import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  ChevronUp,
  CircleCheck,
  Clock3,
  Heart,
  Instagram,
  Mail,
  Menu,
  MessageCircle,
  MoveUpRight,
  Palette,
  Sparkles,
  Star,
  X,
} from "lucide-react";

const WHATSAPP_PHONE = "0000000000";
const WHATSAPP_IS_DEMO = WHATSAPP_PHONE === "0000000000";

const navItems = [
  { label: "Services", href: "#services" },
  { label: "Our Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "FAQs", href: "#faqs" },
];

const services = [
  {
    number: "01",
    title: "Wedding Planning",
    description: "A considered plan for the moments, people, and details that make your day feel like yours.",
    image: "/images/wedding-venue.jpg",
    alt: "Warmly lit wedding reception with greenery and long tables",
  },
  {
    number: "02",
    title: "Birthday & Private Celebrations",
    description: "Thoughtful styling and practical coordination for gatherings made around the people you love.",
    image: "/images/table-florals.jpg",
    alt: "Colorful floral tablescape with candles and place settings",
  },
  {
    number: "03",
    title: "Corporate Events",
    description: "An elevated, well-organised setting for team gatherings, launches, dinners, and milestones.",
    image: "/images/corporate-event.jpeg",
    alt: "Elegant corporate dinner setup with a long table and floral arrangements",
  },
  {
    number: "04",
    title: "Event Styling & Decoration",
    description: "Colour, texture, light, and beautiful details brought together with a clear point of view.",
    image: "/images/floral-detail.webp",
    alt: "Close detail of colourful flowers arranged for an event table",
  },
];

const galleryItems = [
  {
    title: "A warm welcome",
    category: "Wedding reception",
    image: "/images/wedding-venue.jpg",
    alt: "Candlelit reception room with a leafy floral installation",
    className: "gallery-tall",
  },
  {
    title: "The little details",
    category: "Table styling",
    image: "/images/table-florals.jpg",
    alt: "Close view of a joyful floral tablescape with coloured glassware",
    className: "gallery-wide",
  },
  {
    title: "An evening to remember",
    category: "Celebration setting",
    image: "/images/couple-portrait.jpg",
    alt: "Couple in formal wedding attire beneath classical columns",
    className: "gallery-standard",
  },
  {
    title: "Made for the moment",
    category: "Corporate event",
    image: "/images/corporate-event.jpeg",
    alt: "Long corporate dinner table with white flowers and place settings",
    className: "gallery-standard",
  },
  {
    title: "Colour in bloom",
    category: "Floral detail",
    image: "/images/floral-detail.webp",
    alt: "Bright flower arrangement glowing beside candlelight",
    className: "gallery-wide",
  },
  {
    title: "A table with a story",
    category: "Intimate celebration",
    image: "/images/tablescape.jpg",
    alt: "Refined tablescape with flowers, cutlery, and linen napkins",
    className: "gallery-standard",
  },
];

const faqs = [
  {
    question: "What types of events do you plan?",
    answer: "We can discuss weddings, birthdays, private celebrations, corporate events, and event styling. Share your requirements so we can establish whether the project is a good fit.",
  },
  {
    question: "How early should I enquire?",
    answer: "As early as possible, especially for larger celebrations. Availability depends on the proposed date and project requirements.",
  },
  {
    question: "Can I work with a specific budget?",
    answer: "Yes. Share your estimated budget and priorities so the scope can be discussed realistically.",
  },
  {
    question: "Do you handle decoration and coordination?",
    answer: "Services can be discussed based on your event, requirements, and the scope agreed before work begins.",
  },
  {
    question: "How do I get a quote?",
    answer: "Send an enquiry with your event type, date if known, location, and requirements. The next step is to discuss the details.",
  },
];

type FormValues = {
  name: string;
  email: string;
  phone: string;
  eventType: string;
  date: string;
  location: string;
  budget: string;
  description: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const initialForm: FormValues = {
  name: "",
  email: "",
  phone: "",
  eventType: "",
  date: "",
  location: "",
  budget: "",
  description: "",
};

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function buildWhatsAppMessage(values: FormValues) {
  return [
    "Hello EverAfter Events, I would like to enquire about an event.",
    `Name: ${values.name}`,
    `Email: ${values.email || "Not provided"}`,
    `Phone / WhatsApp: ${values.phone}`,
    `Event type: ${values.eventType}`,
    `Proposed date: ${values.date || "Not provided"}`,
    `Location: ${values.location || "Not provided"}`,
    `Estimated budget: ${values.budget || "Not provided"}`,
    `Details: ${values.description || "Not provided"}`,
  ].join("\n");
}

function Wordmark({ light = false }: { light?: boolean }) {
  return (
    <a className={`wordmark ${light ? "wordmark-light" : ""}`} href="#top" aria-label="EverAfter Events home">
      <span className="wordmark-mark" aria-hidden="true">
        <span />
        <span />
      </span>
      <span className="wordmark-copy">
        <strong>EverAfter</strong>
        <small>EVENTS</small>
      </span>
    </a>
  );
}

function SectionIntro({ eyebrow, title, copy, align = "left" }: { eyebrow: string; title: string; copy: string; align?: "left" | "center" }) {
  return (
    <div className={`section-intro ${align === "center" ? "section-intro-center" : ""}`}>
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      <p>{copy}</p>
    </div>
  );
}

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [form, setForm] = useState<FormValues>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formMessage, setFormMessage] = useState("");
  const galleryButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const lightboxRef = useRef<HTMLDivElement | null>(null);
  const lightboxCloseRef = useRef<HTMLButtonElement | null>(null);
  const lastFocusedGalleryIndex = useRef<number | null>(null);
  const previousLightboxIndex = useRef<number | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLightboxIndex(null);
        setMenuOpen(false);
      }
      if (event.key === "ArrowRight" && lightboxIndex !== null) {
        setLightboxIndex((lightboxIndex + 1) % galleryItems.length);
      }
      if (event.key === "ArrowLeft" && lightboxIndex !== null) {
        setLightboxIndex((lightboxIndex - 1 + galleryItems.length) % galleryItems.length);
      }
      if (event.key === "Tab" && lightboxIndex !== null) {
        const focusableElements = lightboxRef.current?.querySelectorAll<HTMLElement>("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])");
        if (!focusableElements?.length) return;
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex]);

  useEffect(() => {
    if (lightboxIndex !== null && previousLightboxIndex.current === null) {
      lightboxCloseRef.current?.focus();
    } else if (lightboxIndex === null && previousLightboxIndex.current !== null && lastFocusedGalleryIndex.current !== null) {
      galleryButtonRefs.current[lastFocusedGalleryIndex.current]?.focus();
      lastFocusedGalleryIndex.current = null;
    }
    previousLightboxIndex.current = lightboxIndex;
  }, [lightboxIndex]);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    window.setTimeout(() => scrollToId(href.slice(1)), 0);
  };

  const handleWhatsAppCta = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (WHATSAPP_IS_DEMO) {
      event.preventDefault();
      setFormMessage("Demo mode: replace the placeholder WhatsApp number in Home.tsx before presenting this site to a real business.");
      scrollToId("enquiry");
      return;
    }
    event.preventDefault();
    window.open(`https://wa.me/${WHATSAPP_PHONE}`, "_blank", "noopener,noreferrer");
  };

  const updateField = (field: keyof FormValues, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
    if (formMessage) setFormMessage("");
  };

  const validateForm = () => {
    const nextErrors: FormErrors = {};
    if (!form.name.trim()) nextErrors.name = "Please tell us your name.";
    if (!form.phone.trim()) nextErrors.phone = "Please add a phone or WhatsApp number.";
    if (!form.eventType) nextErrors.eventType = "Please choose an event type.";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) {
      nextErrors.email = "Please check the email address format.";
    }
    return nextErrors;
  };

  const submitEnquiry = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateForm();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setFormMessage("Please check the highlighted fields and try again.");
      return;
    }

    if (WHATSAPP_IS_DEMO) {
      setFormMessage("Demo mode: your enquiry has not been sent. Replace the placeholder WhatsApp number before using this handoff with a real business.");
      return;
    }

    const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(buildWhatsAppMessage(form))}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setFormMessage("Your enquiry is ready in WhatsApp. Review the message there and send it when you are happy with the details.");
  };

  return (
    <div className="site-shell" id="top">
      <div className="announcement-strip">
        <span>Thoughtfully planned celebrations, made personal.</span>
        <span className="announcement-dot" aria-hidden="true" />
        <span>Concept website demo</span>
      </div>

      <header className="site-header">
        <div className="container nav-wrap">
          <Wordmark />
          <nav className="desktop-nav" aria-label="Primary navigation">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} onClick={(event) => { event.preventDefault(); handleNavClick(item.href); }}>{item.label}</a>
            ))}
          </nav>
          <a className="button button-dark nav-cta" href="#enquiry" onClick={(event) => { event.preventDefault(); handleNavClick("#enquiry"); }}>
            Plan Your Event <ArrowRight size={15} aria-hidden="true" />
          </a>
          <button className="menu-button" type="button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        <div className={`mobile-nav ${menuOpen ? "mobile-nav-open" : ""}`}>
          <div className="container mobile-nav-inner">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} onClick={(event) => { event.preventDefault(); handleNavClick(item.href); }}>{item.label}</a>
            ))}
            <a className="button button-dark" href="#enquiry" onClick={(event) => { event.preventDefault(); handleNavClick("#enquiry"); }}>
              Plan Your Event <ArrowRight size={15} aria-hidden="true" />
            </a>
          </div>
        </div>
      </header>

      <main>
        <section className="hero-section">
          <div className="container hero-grid">
            <div className="hero-copy">
              <span className="eyebrow">Event planning & styling</span>
              <h1>Your Vision.<br /><em>Beautifully</em><br />Brought to Life.</h1>
              <p className="hero-lede">Thoughtful planning, beautiful details, and celebrations that feel uniquely yours. Let&apos;s create an event worth remembering.</p>
              <div className="hero-actions">
                <a className="button button-dark" href="#enquiry" onClick={(event) => { event.preventDefault(); handleNavClick("#enquiry"); }}>Plan Your Event <ArrowRight size={16} aria-hidden="true" /></a>
                <a className="text-link" href="#work" onClick={(event) => { event.preventDefault(); handleNavClick("#work"); }}>Explore our work <ArrowDownRight size={16} aria-hidden="true" /></a>
              </div>
              <div className="hero-note"><span className="hero-note-line" /> Weddings, private celebrations & corporate events</div>
            </div>
            <div className="hero-visual">
              <div className="hero-image-frame">
                <img src="/images/wedding-venue.jpg" alt="Elegant wedding reception with leafy florals and warm candlelight" />
                <div className="hero-image-caption"><span>Illustrative concept imagery</span><span>01 / 06</span></div>
              </div>
              <div className="hero-stamp" aria-hidden="true"><Sparkles size={14} /><span>Thoughtful<br />by design</span></div>
              <div className="hero-arch" aria-hidden="true" />
            </div>
          </div>
          <div className="hero-bottom container"><span>Scroll to explore</span><span className="scroll-line" /></div>
        </section>

        <section className="marquee-section" aria-label="EverAfter Events services">
          <div className="marquee-track"><span>Weddings</span><i>✦</i><span>Private celebrations</span><i>✦</i><span>Corporate gatherings</span><i>✦</i><span>Beautifully considered</span><i>✦</i><span>Weddings</span><i>✦</i><span>Private celebrations</span></div>
        </section>

        <section className="section section-services" id="services">
          <div className="container">
            <div className="services-heading-row">
              <SectionIntro eyebrow="What we do" title="Every Occasion, Thoughtfully Planned." copy="Whether intimate or grand, every celebration deserves care, creativity, and attention to detail." />
              <div className="section-index">01 <span /> 04</div>
            </div>
            <div className="services-grid">
              {services.map((service) => (
                <article className="service-card" key={service.number}>
                  <div className="service-image-wrap"><img src={service.image} alt={service.alt} loading="lazy" /><span className="service-number">{service.number}</span></div>
                  <div className="service-content"><h3>{service.title}</h3><p>{service.description}</p><a className="small-link" href="#enquiry" onClick={(event) => { event.preventDefault(); handleNavClick("#enquiry"); }}>Enquire <MoveUpRight size={14} aria-hidden="true" /></a></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-work" id="work">
          <div className="container">
            <div className="work-heading-row">
              <SectionIntro eyebrow="The gallery" title="Moments Worth Remembering." copy="A glimpse of the celebrations, settings, and details that inspire us." />
              <p className="concept-note"><span className="gold-rule" />All imagery is illustrative concept imagery for this fictional demo.</p>
            </div>
            <div className="gallery-grid">
              {galleryItems.map((item, index) => (
                <button className={`gallery-item ${item.className}`} type="button" key={item.title} ref={(element) => { galleryButtonRefs.current[index] = element; }} onClick={() => { lastFocusedGalleryIndex.current = index; setLightboxIndex(index); }} aria-label={`View ${item.title}, ${item.category}`}>
                  <img src={item.image} alt={item.alt} loading="lazy" />
                  <span className="gallery-overlay"><span><small>{item.category}</small><strong>{item.title}</strong></span><ArrowUpRightIcon /></span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-process">
          <div className="container">
            <SectionIntro eyebrow="Our approach" title="From First Conversation to Final Detail." copy="A simple, considered process that gives your ideas room to take shape." />
            <div className="process-grid">
              <div className="process-step"><span className="process-number">01</span><div><h3>Tell Us Your Vision.</h3><p>Share your event type, ideas, date, and priorities.</p></div></div>
              <div className="process-connector" aria-hidden="true" />
              <div className="process-step"><span className="process-number">02</span><div><h3>Plan the Details.</h3><p>We discuss the details and shape an event plan around your needs.</p></div></div>
              <div className="process-connector" aria-hidden="true" />
              <div className="process-step"><span className="process-number">03</span><div><h3>Celebrate With Confidence.</h3><p>We coordinate the agreed details so you can focus on enjoying your occasion.</p></div></div>
            </div>
          </div>
        </section>

        <section className="section section-about" id="about">
          <div className="container about-grid">
            <div className="about-image-wrap"><img src="/images/couple-portrait.jpg" alt="Couple in wedding attire beneath classical columns" loading="lazy" /><span className="vertical-caption">Beautifully considered / 02</span></div>
            <div className="about-copy"><SectionIntro eyebrow="A personal touch" title="Thoughtful Planning. Personal Touch." copy="Every event has a story. Our approach begins with understanding yours—your ideas, your priorities, and the details that matter most. We bring those elements together in a considered plan designed around your occasion." /><a className="text-link" href="#enquiry" onClick={(event) => { event.preventDefault(); handleNavClick("#enquiry"); }}>Let&apos;s talk about your event <ArrowRight size={16} aria-hidden="true" /></a></div>
          </div>
        </section>

        <section className="section section-benefits">
          <div className="container">
            <div className="benefits-heading"><SectionIntro eyebrow="Why EverAfter" title="The Details Make the Difference." copy="A thoughtful partner for bringing the big picture and the small things together." /></div>
            <div className="benefits-grid">
              <article className="benefit-card"><span className="benefit-icon"><Heart size={21} /></span><span className="benefit-count">01</span><h3>Personalized planning</h3><p>Your event should reflect your preferences and priorities.</p></article>
              <article className="benefit-card"><span className="benefit-icon"><Check size={22} /></span><span className="benefit-count">02</span><h3>Thoughtful coordination</h3><p>Keep the important details organized from planning through execution.</p></article>
              <article className="benefit-card"><span className="benefit-icon"><Palette size={21} /></span><span className="benefit-count">03</span><h3>Creative styling</h3><p>Bring together colours, textures, décor, and atmosphere that complement your vision.</p></article>
            </div>
          </div>
        </section>

        <section className="section enquiry-section" id="enquiry">
          <div className="container enquiry-grid">
            <div className="enquiry-intro"><span className="eyebrow eyebrow-light">Start a conversation</span><h2>Let&apos;s Start Planning <em>Something Special.</em></h2><p>Tell us a little about your event, and let&apos;s explore how we can bring your ideas together.</p><div className="enquiry-meta"><div><Clock3 size={18} /><span>Enquiries are welcome for events of all shapes and sizes.</span></div><div><CircleCheck size={18} /><span>An enquiry does not guarantee availability or confirm a booking.</span></div></div><div className="demo-notice"><span className="demo-dot" /> Demo note: this form is set up for a WhatsApp handoff. Replace the placeholder number before a real launch.</div></div>
            <form className="enquiry-form" onSubmit={submitEnquiry} noValidate>
              <div className="form-row"><Field label="Full name" name="name" value={form.name} onChange={(value) => updateField("name", value)} error={errors.name} required placeholder="Your name" /><Field label="Email address" name="email" type="email" value={form.email} onChange={(value) => updateField("email", value)} error={errors.email} placeholder="you@example.com" /></div>
              <div className="form-row"><Field label="WhatsApp or phone number" name="phone" type="tel" value={form.phone} onChange={(value) => updateField("phone", value)} error={errors.phone} required placeholder="Your best number" /><SelectField label="Event type" name="eventType" value={form.eventType} onChange={(value) => updateField("eventType", value)} error={errors.eventType} required options={["Wedding", "Birthday or private celebration", "Corporate event", "Event styling and decoration", "Something else"]} /></div>
              <div className="form-row"><Field label="Proposed event date" name="date" type="date" value={form.date} onChange={(value) => updateField("date", value)} /><Field label="Event location" name="location" value={form.location} onChange={(value) => updateField("location", value)} placeholder="City or venue (if known)" /></div>
              <SelectField label="Estimated budget range" name="budget" value={form.budget} onChange={(value) => updateField("budget", value)} options={["I’m still exploring", "Under £2,500", "£2,500 – £5,000", "£5,000 – £10,000", "£10,000+"]} />
              <div className="field"><label htmlFor="description">Brief description <span>(optional)</span></label><textarea id="description" name="description" rows={4} value={form.description} onChange={(event) => updateField("description", event.target.value)} placeholder="Tell us a little about what you’re planning..." /></div>
              {formMessage && <div className={`form-message ${Object.keys(errors).length > 0 ? "form-message-error" : ""}`} role="status">{formMessage}</div>}
              <button className="button button-light form-submit" type="submit">Send enquiry via WhatsApp <ArrowRight size={16} aria-hidden="true" /></button>
              <p className="form-privacy">Your details are only used to prepare the enquiry message you choose to send. No booking is made by submitting this form.</p>
            </form>
          </div>
        </section>

        <section className="section section-faq" id="faqs">
          <div className="container faq-grid"><SectionIntro eyebrow="Good to know" title="Questions Before We Begin?" copy="A few helpful notes before you get in touch." /><div className="faq-list">{faqs.map((faq, index) => { const isOpen = activeFaq === index; return <div className={`faq-item ${isOpen ? "faq-open" : ""}`} key={faq.question}><button type="button" className="faq-question" onClick={() => setActiveFaq(isOpen ? null : index)} aria-expanded={isOpen} aria-controls={`faq-answer-${index}`}><span><small>0{index + 1}</small>{faq.question}</span>{isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</button><div className="faq-answer" id={`faq-answer-${index}`} hidden={!isOpen}><p>{faq.answer}</p></div></div>; })}</div></div>
        </section>

        <section className="final-cta"><div className="container final-cta-inner"><div><span className="eyebrow eyebrow-light">Let&apos;s make it memorable</span><h2>Your Next Celebration<br /><em>Starts With a Conversation.</em></h2></div><a className="button button-light" href="#enquiry" onClick={(event) => { event.preventDefault(); handleNavClick("#enquiry"); }}>Enquire About Your Event <ArrowUpRight size={16} aria-hidden="true" /></a></div></section>
      </main>

      <footer className="site-footer"><div className="container footer-grid"><div className="footer-brand"><Wordmark light /><p>Beautifully planned.<br />Unforgettable moments.</p></div><div className="footer-nav"><span className="footer-label">Explore</span>{navItems.map((item) => <a key={item.href} href={item.href} onClick={(event) => { event.preventDefault(); handleNavClick(item.href); }}>{item.label}</a>)}<a href="#enquiry" onClick={(event) => { event.preventDefault(); handleNavClick("#enquiry"); }}>Plan Your Event</a></div><div className="footer-contact"><span className="footer-label">Contact</span><a href="mailto:hello@everafter-events.demo"><Mail size={15} /> hello@everafter-events.demo</a><a href="#enquiry" onClick={(event) => { event.preventDefault(); handleNavClick("#enquiry"); }}><MessageCircle size={15} /> WhatsApp enquiry</a><span className="footer-placeholder">Placeholder contact for concept demo</span></div><div className="footer-social"><span className="footer-label">Follow along</span><a href="#enquiry" onClick={(event) => { event.preventDefault(); handleNavClick("#enquiry"); }}><Instagram size={16} /> Instagram placeholder</a><span className="social-note">Social links intentionally not connected.</span></div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} EverAfter Events</span><span>Concept website demo — fictional business.</span><span>Made for meaningful moments <Star size={12} fill="currentColor" /></span></div></footer>

      {lightboxIndex !== null && <div className="lightbox" ref={lightboxRef} role="dialog" aria-modal="true" aria-label="Portfolio image viewer" onClick={() => setLightboxIndex(null)}><button className="lightbox-close" ref={lightboxCloseRef} type="button" onClick={() => setLightboxIndex(null)} aria-label="Close image viewer"><X size={22} /></button><button className="lightbox-control lightbox-prev" type="button" onClick={(event) => { event.stopPropagation(); setLightboxIndex((lightboxIndex - 1 + galleryItems.length) % galleryItems.length); }} aria-label="Previous image">←</button><div className="lightbox-content" onClick={(event) => event.stopPropagation()}><img src={galleryItems[lightboxIndex].image} alt={galleryItems[lightboxIndex].alt} /><div><span>{galleryItems[lightboxIndex].category}</span><strong>{galleryItems[lightboxIndex].title}</strong></div></div><button className="lightbox-control lightbox-next" type="button" onClick={(event) => { event.stopPropagation(); setLightboxIndex((lightboxIndex + 1) % galleryItems.length); }} aria-label="Next image">→</button></div>}
    </div>
  );
}

function Field({ label, name, value, onChange, error, required, type = "text", placeholder }: { label: string; name: string; value: string; onChange: (value: string) => void; error?: string; required?: boolean; type?: string; placeholder?: string }) {
  return <div className="field"><label htmlFor={name}>{label} {required ? <b>*</b> : <span>(optional)</span>}</label><input id={name} name={name} type={type} required={required} aria-invalid={Boolean(error)} aria-describedby={error ? `${name}-error` : undefined} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />{error && <span className="field-error" id={`${name}-error`}>{error}</span>}</div>;
}

function SelectField({ label, name, value, onChange, error, required, options }: { label: string; name: string; value: string; onChange: (value: string) => void; error?: string; required?: boolean; options: string[] }) {
  return <div className="field"><label htmlFor={name}>{label} {required ? <b>*</b> : <span>(optional)</span>}</label><div className="select-wrap"><select id={name} name={name} required={required} aria-invalid={Boolean(error)} aria-describedby={error ? `${name}-error` : undefined} value={value} onChange={(event) => onChange(event.target.value)}><option value="">Select an option</option>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select><ChevronDown size={16} aria-hidden="true" /></div>{error && <span className="field-error" id={`${name}-error`}>{error}</span>}</div>;
}

function ArrowUpRightIcon() { return <ArrowUpRight size={17} aria-hidden="true" />; }

export default Home;
