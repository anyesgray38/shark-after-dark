"use client";

import { FormEvent, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://shark-after-dark-api.onrender.com";

const services = [
  { id: 1, name: "The Apex Fade", price: "$45", description: "Precision skin fade with a custom lineup. The gold standard." },
  { id: 2, name: "Deep Sea Shave", price: "$35", description: "Hot towel treatment, straight razor shave, and soothing oil." },
  { id: 3, name: "The Night Owl", price: "$70", description: "Full service: fade, beard trim, and scalp massage." }
];

const gallery = [
  { label: "THE CRAFT", image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=1800&q=85" },
  { label: "THE CHAIR", image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1800&q=85" },
  { label: "AFTER DARK", image: "https://images.unsplash.com/photo-1512690459411-b9245aed614b?auto=format&fit=crop&w=1800&q=85" }
];

export default function Home() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(services[0]);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const openBooking = (service = services[0]) => {
    setSelectedService(service);
    setSubmitted(false);
    setError("");
    setBookingOpen(true);
  };

  async function submitBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch(API_BASE + "/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          phone: form.get("phone"),
          service_id: selectedService.id,
          starts_at: new Date(String(form.get("date")) + "T" + String(form.get("time"))).toISOString(),
          notes: form.get("notes")
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "We couldn't reserve that time.");
      setSubmitted(true);
      event.currentTarget.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn't reserve that time.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main>
      <nav className="nav">
        <a className="brand" href="#">SHARK<span>AFTER DARK</span></a>
        <div className="nav-links"><a href="#services">Services</a><a href="#about">The Studio</a><a href="#gallery">Journal</a></div>
        <button className="book-pill" onClick={() => openBooking()}>Reserve</button>
      </nav>

      <header className="hero">
        <div className="hero-photo" />
        <div className="hero-overlay" />
        <div className="hero-inner">
          <p className="eyebrow">PRIVATE GROOMING STUDIO · EST. 2026</p>
          <h1>Sharp cuts.<br/><em>Quiet luxury.</em></h1>
          <p className="hero-copy">An intimate grooming experience for men who appreciate the details. Tailored cuts, considered service, and a chair worth slowing down for.</p>
          <button className="cta" onClick={() => openBooking()}>Reserve Your Chair <span>↗</span></button>
        </div>
        <div className="scroll-mark">SCROLL TO EXPLORE <span>↓</span></div>
      </header>

      <section id="services" className="services">
        <div className="section-intro"><p className="eyebrow">THE MENU</p><h2>Considered grooming.<br/><em>Nothing excessive.</em></h2></div>
        <div className="service-list">{services.map((service, i) =>
          <article className="service-row" key={service.id}>
            <span className="service-number">0{i + 1}</span>
            <h3>{service.name}</h3><p>{service.description}</p>
            <div className="service-action"><strong>{service.price}</strong><button onClick={() => openBooking(service)}>Book</button></div>
          </article>
        )}</div>
      </section>

      <section id="about" className="statement">
        <div className="statement-photo" />
        <div className="statement-copy">
          <p className="eyebrow">THE SHARK STANDARD</p>
          <h2>The art of looking <em>exactly right.</em></h2>
          <p>Shark After Dark is a private studio built around one simple idea: great grooming should feel personal. Every cut is deliberate, every detail considered, and every appointment given room to breathe.</p>
          <button className="text-link" onClick={() => openBooking()}>Enter the studio <span>→</span></button>
        </div>
      </section>

      <section id="gallery" className="gallery">
        <div className="gallery-heading"><p className="eyebrow">THE JOURNAL</p><h2>Inside<br/><em>after dark.</em></h2></div>
        <div className="gallery-grid">{gallery.map((item, i) =>
          <figure className={`gallery-card gallery-${i + 1}`} key={item.label}>
            <img src={item.image} alt={item.label} />
            <figcaption>{item.label}</figcaption>
          </figure>
        )}</div>
      </section>

      <section className="booking-band">
        <p className="eyebrow">YOUR NEXT APPOINTMENT</p>
        <h2>Leave sharper<br/><em>than you arrived.</em></h2>
        <button className="cta dark" onClick={() => openBooking()}>Reserve Your Chair <span>↗</span></button>
      </section>

      <footer>
        <div><a className="brand" href="#">SHARK<span>AFTER DARK</span></a><p>Private grooming studio · Thomaston, Georgia</p></div>
        <div className="footer-links"><a href="#services">Services</a><a href="#about">Studio</a><a href="#gallery">Journal</a><button onClick={() => openBooking()}>Booking</button></div>
        <small>© {new Date().getFullYear()} Shark After Dark</small>
      </footer>

      {bookingOpen && (
        <div className="booking-modal" role="dialog" aria-modal="true" aria-label="Reserve your chair">
          <div className="booking-backdrop" onClick={() => setBookingOpen(false)} />
          <div className="booking-panel">
            <button className="modal-close" onClick={() => setBookingOpen(false)} aria-label="Close">×</button>
            {!submitted ? (
              <>
                <p className="eyebrow">PRIVATE APPOINTMENTS</p>
                <h2>Reserve<br/><em>your chair.</em></h2>
                <p className="modal-copy">Choose your service and requested time. Your appointment is held directly in the Shark After Dark system.</p>
                <form onSubmit={submitBooking}>
                  <label>Service
                    <select value={selectedService.id} onChange={e => setSelectedService(services.find(s => s.id === Number(e.target.value)) || services[0])}>
                      {services.map(s => <option key={s.id} value={s.id}>{s.name} · {s.price}</option>)}
                    </select>
                  </label>
                  <div className="form-grid">
                    <label>Name<input name="name" required autoComplete="name" /></label>
                    <label>Phone<input name="phone" autoComplete="tel" /></label>
                  </div>
                  <label>Email<input name="email" type="email" required autoComplete="email" /></label>
                  <div className="form-grid">
                    <label>Date<input name="date" type="date" required /></label>
                    <label>Time<input name="time" type="time" required /></label>
                  </div>
                  <label>Notes (optional)<textarea name="notes" rows={3} placeholder="Anything I should know?" /></label>
                  {error && <p className="form-error">{error}</p>}
                  <button className="modal-submit" disabled={busy}>{busy ? "RESERVING…" : "RESERVE APPOINTMENT →"}</button>
                </form>
              </>
            ) : (
              <div className="booking-success">
                <p className="eyebrow">RESERVATION RECEIVED</p>
                <h2>You’re<br/><em>on the books.</em></h2>
                <p>Your appointment request has been recorded in the Shark After Dark system.</p>
                <button className="modal-submit" onClick={() => setBookingOpen(false)}>DONE</button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
