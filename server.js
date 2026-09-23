import http from "node:http";
import { URL } from "node:url";
import pg from "pg";

const { Pool } = pg;
const PORT = Number(process.env.PORT || 10000);
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false });

const json = (res, status, body) => {
  res.writeHead(status, { "Content-Type": "application/json", "Access-Control-Allow-Origin": process.env.FRONTEND_ORIGIN || "*", "Access-Control-Allow-Headers": "Content-Type,X-Admin-Key", "Access-Control-Allow-Methods": "GET,POST,OPTIONS" });
  res.end(JSON.stringify(body));
};

const readBody = (req) => new Promise((resolve, reject) => {
  let raw = "";
  req.on("data", chunk => { raw += chunk; if (raw.length > 1000000) reject(new Error("Request too large")); });
  req.on("end", () => { try { resolve(raw ? JSON.parse(raw) : {}); } catch { reject(new Error("Invalid JSON")); } });
  req.on("error", reject);
});

async function init() {
  await pool.query(`
    CREATE EXTENSION IF NOT EXISTS pgcrypto;
    CREATE TABLE IF NOT EXISTS services (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      price_cents INTEGER NOT NULL,
      duration_minutes INTEGER NOT NULL DEFAULT 60,
      description TEXT NOT NULL DEFAULT '',
      active BOOLEAN NOT NULL DEFAULT TRUE
    );
    CREATE TABLE IF NOT EXISTS customers (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE UNIQUE INDEX IF NOT EXISTS customers_email_idx ON customers (LOWER(email));
    CREATE TABLE IF NOT EXISTS appointments (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      customer_id INTEGER NOT NULL REFERENCES customers(id),
      service_id INTEGER NOT NULL REFERENCES services(id),
      starts_at TIMESTAMPTZ NOT NULL,
      ends_at TIMESTAMPTZ NOT NULL,
      status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('pending','confirmed','cancelled','completed','no_show')),
      notes TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS appointments_time_idx ON appointments (starts_at, ends_at);
    INSERT INTO services (name, price_cents, duration_minutes, description)
    SELECT 'The Apex Fade', 4500, 60, 'Precision skin fade with a custom lineup.'
    WHERE NOT EXISTS (SELECT 1 FROM services WHERE name='The Apex Fade');
    INSERT INTO services (name, price_cents, duration_minutes, description)
    SELECT 'Deep Sea Shave', 3500, 45, 'Hot towel treatment, straight razor shave, and soothing oil.'
    WHERE NOT EXISTS (SELECT 1 FROM services WHERE name='Deep Sea Shave');
    INSERT INTO services (name, price_cents, duration_minutes, description)
    SELECT 'The Night Owl', 7000, 90, 'Full service: fade, beard trim, and scalp massage.'
    WHERE NOT EXISTS (SELECT 1 FROM services WHERE name='The Night Owl');
  `);
}

async function main() {
  await init();
  const server = http.createServer(async (req, res) => {
    if (req.method === "OPTIONS") return json(res, 204, {});
    try {
      const url = new URL(req.url, `http://${req.headers.host}`);
      if (req.method === "GET" && url.pathname === "/health") return json(res, 200, { ok: true, service: "shark-after-dark-api" });
      if (req.method === "GET" && url.pathname === "/api/services") {
        const { rows } = await pool.query("SELECT id,name,price_cents,duration_minutes,description FROM services WHERE active=true ORDER BY id");
        return json(res, 200, { services: rows });
      }
      if (req.method === "GET" && url.pathname === "/api/appointments") {
        if (!process.env.ADMIN_KEY || req.headers["x-admin-key"] !== process.env.ADMIN_KEY) return json(res, 401, { error: "Unauthorized" });
        const { rows } = await pool.query(`SELECT a.id,a.starts_at,a.ends_at,a.status,a.notes,s.name service_name,s.price_cents,c.name customer_name,c.email,c.phone
          FROM appointments a JOIN services s ON s.id=a.service_id JOIN customers c ON c.id=a.customer_id
          ORDER BY a.starts_at DESC LIMIT 250`);
        return json(res, 200, { appointments: rows });
      }
      if (req.method === "GET" && url.pathname === "/api/availability") {
        const serviceId = Number(url.searchParams.get("service_id"));
        const from = url.searchParams.get("from");
        const to = url.searchParams.get("to");
        if (!serviceId || !from || !to) return json(res, 400, { error: "service_id, from, and to are required" });
        const service = await pool.query("SELECT id,duration_minutes FROM services WHERE id=$1 AND active=true",[serviceId]);
        if (!service.rowCount) return json(res, 404, { error: "Service not found" });
        const { rows } = await pool.query("SELECT starts_at,ends_at FROM appointments WHERE status IN ('pending','confirmed') AND starts_at < $2 AND ends_at > $1 ORDER BY starts_at",[from,to]);
        return json(res,200,{busy:rows,duration_minutes:service.rows[0].duration_minutes});
      }
      if (req.method === "POST" && url.pathname === "/api/appointments") {
        const body = await readBody(req);
        const { name,email,phone,service_id,starts_at,notes } = body;
        if (!name || !email || !service_id || !starts_at) return json(res,400,{error:"name, email, service_id, and starts_at are required"});
        const client = await pool.connect();
        try {
          await client.query("BEGIN");
          const service = await client.query("SELECT id,duration_minutes FROM services WHERE id=$1 AND active=true FOR SHARE",[Number(service_id)]);
          if (!service.rowCount) throw Object.assign(new Error("Service not found"),{status:404});
          const start = new Date(starts_at);
          if (Number.isNaN(start.getTime())) throw Object.assign(new Error("Invalid starts_at"),{status:400});
          const end = new Date(start.getTime()+service.rows[0].duration_minutes*60000);
          const conflict = await client.query("SELECT 1 FROM appointments WHERE status IN ('pending','confirmed') AND starts_at < $2 AND ends_at > $1 FOR UPDATE",[start.toISOString(),end.toISOString()]);
          if (conflict.rowCount) throw Object.assign(new Error("That time is no longer available"),{status:409});
          const customer = await client.query(`INSERT INTO customers(name,email,phone) VALUES($1,$2,$3)
            ON CONFLICT (LOWER(email)) DO UPDATE SET name=EXCLUDED.name, phone=COALESCE(EXCLUDED.phone,customers.phone)
            RETURNING id`,[name.trim(),email.trim().toLowerCase(),phone?.trim()||null]);
          const appt = await client.query(`INSERT INTO appointments(customer_id,service_id,starts_at,ends_at,status,notes)
            VALUES($1,$2,$3,$4,'confirmed',$5) RETURNING id,starts_at,ends_at,status`,[customer.rows[0].id,Number(service_id),start.toISOString(),end.toISOString(),notes?.trim()||null]);
          await client.query("COMMIT");
          return json(res,201,{appointment:appt.rows[0]});
        } catch (e) {
          await client.query("ROLLBACK");
          return json(res,e.status||500,{error:e.message||"Booking failed"});
        } finally { client.release(); }
      }
      return json(res,404,{error:"Not found"});
    } catch (e) { return json(res,500,{error:e.message||"Internal server error"}); }
  });
  server.listen(PORT, "0.0.0.0", () => console.log(`Shark After Dark API listening on ${PORT}`));
}
main().catch(err => { console.error(err); process.exit(1); });
