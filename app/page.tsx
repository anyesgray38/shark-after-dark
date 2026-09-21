const services = [
  ["Signature Cut", "$40", "Precision cut, line-up and finish."],
  ["Cut + Beard", "$55", "Full cut, beard sculpt and hot finish."],
  ["After-Hours", "$75", "Private late-night appointment."],
];

export default function Home() {
  return (
    <main>
      <nav className="nav">
        <div className="logo">SHARK<span>AFTER DARK</span></div>
        <a className="nav-link" href="#book">Book now</a>
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">MOBILE BARBERING • AFTER HOURS</p>
          <h1>Sharp cuts.<br /><em>No daylight required.</em></h1>
          <p className="lede">
            Premium mobile barbering built for people who move on their own schedule.
            I come to you. You leave camera-ready.
          </p>
          <div className="actions">
            <a className="button primary" href="#book">Book an appointment</a>
            <a className="button ghost" href="#services">View services</a>
          </div>
          <div className="proof">
            <span>01</span><p>Private mobile service</p>
            <span>02</span><p>Flexible evening availability</p>
            <span>03</span><p>Clean, precise finishes</p>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="orb"></div>
          <div className="ring ring-one"></div>
          <div className="ring ring-two"></div>
          <div className="shark-mark">S</div>
          <div className="art-label">AFTER<br />DARK</div>
        </div>
      </section>

      <section id="services" className="services">
        <div className="section-head">
          <p className="eyebrow">THE MENU</p>
          <h2>Built around the appointment.</h2>
        </div>
        <div className="cards">
          {services.map(([name, price, detail]) => (
            <article className="card" key={name}>
              <p className="card-index">0{services.findIndex((s) => s[0] === name) + 1}</p>
              <h3>{name}</h3>
              <p>{detail}</p>
              <strong>{price}</strong>
            </article>
          ))}
        </div>
      </section>

      <section id="book" className="booking">
        <div>
          <p className="eyebrow">READY WHEN YOU ARE</p>
          <h2>Your chair.<br />Your location.<br /><em>Your time.</em></h2>
        </div>
        <div className="booking-panel">
          <p>Book through the live appointment system.</p>
          <a className="button primary full" href="https://cutzbyshark.square.site/" target="_blank" rel="noreferrer">
            Open booking
          </a>
          <small>Mobile appointments • Thomaston & surrounding area</small>
        </div>
      </section>

      <footer>
        <div className="logo">SHARK<span>AFTER DARK</span></div>
        <p>© {new Date().getFullYear()} Shark After Dark</p>
      </footer>
    </main>
  );
}