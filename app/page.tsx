const services = [
  ["The Apex Fade", "$45", "Precision skin fade with a custom lineup. The gold standard."],
  ["Deep Sea Shave", "$35", "Hot towel treatment, straight razor shave, and soothing oil."],
  ["The Night Owl", "$70", "Full service: fade, beard trim, and scalp massage."]
];

const gallery = [
  { label: "THE CRAFT", image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=1800&q=85" },
  { label: "THE CHAIR", image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1800&q=85" },
  { label: "AFTER DARK", image: "https://images.unsplash.com/photo-1512690459411-b9245aed614b?auto=format&fit=crop&w=1800&q=85" }
];

export default function Home() {
  return <main>
    <nav className="nav">
      <a className="brand" href="#">SHARK<span>AFTER DARK</span></a>
      <div className="nav-links"><a href="#services">Services</a><a href="#about">The Studio</a><a href="#gallery">Journal</a></div>
      <a className="book-pill" href="https://cutzbyshark.square.site/" target="_blank" rel="noreferrer">Reserve</a>
    </nav>

    <header className="hero">
      <div className="hero-photo" />
      <div className="hero-overlay" />
      <div className="hero-inner">
        <p className="eyebrow">PRIVATE GROOMING STUDIO · EST. 2026</p>
        <h1>Sharp cuts.<br/><em>Quiet luxury.</em></h1>
        <p className="hero-copy">An intimate grooming experience for men who appreciate the details. Tailored cuts, considered service, and a chair worth slowing down for.</p>
        <a className="cta" href="https://cutzbyshark.square.site/" target="_blank" rel="noreferrer">Reserve Your Chair <span>↗</span></a>
      </div>
      <div className="scroll-mark">SCROLL TO EXPLORE <span>↓</span></div>
    </header>

    <section id="services" className="services">
      <div className="section-intro"><p className="eyebrow">THE MENU</p><h2>Considered grooming.<br/><em>Nothing excessive.</em></h2></div>
      <div className="service-list">{services.map(([name, price, detail], i) =>
        <article className="service-row" key={name}>
          <span className="service-number">0{i + 1}</span>
          <h3>{name}</h3><p>{detail}</p><strong>{price}</strong>
        </article>
      )}</div>
    </section>

    <section id="about" className="statement">
      <div className="statement-photo" />
      <div className="statement-copy">
        <p className="eyebrow">THE SHARK STANDARD</p>
        <h2>The art of looking <em>exactly right.</em></h2>
        <p>Shark After Dark is a private studio built around one simple idea: great grooming should feel personal. Every cut is deliberate, every detail considered, and every appointment given room to breathe.</p>
        <a className="text-link" href="https://cutzbyshark.square.site/" target="_blank" rel="noreferrer">Enter the studio <span>→</span></a>
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
      <a className="cta dark" href="https://cutzbyshark.square.site/" target="_blank" rel="noreferrer">Reserve Your Chair <span>↗</span></a>
    </section>

    <footer>
      <div><a className="brand" href="#">SHARK<span>AFTER DARK</span></a><p>Private grooming studio · Thomaston, Georgia</p></div>
      <div className="footer-links"><a href="#services">Services</a><a href="#about">Studio</a><a href="#gallery">Journal</a><a href="https://cutzbyshark.square.site/" target="_blank" rel="noreferrer">Booking</a></div>
      <small>© {new Date().getFullYear()} Shark After Dark</small>
    </footer>
  </main>
}