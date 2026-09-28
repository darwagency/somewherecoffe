"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ArrowRightIcon, BagIcon, CheckIcon, CoffeeIcon, InstagramLogoIcon, MapPinIcon, MinusIcon, PlusIcon, XIcon, WhatsappLogoIcon, AirplaneTiltIcon } from "@phosphor-icons/react";
import { deliveryZones, menu, milkOptions, money, type MenuItem, type Milk } from "@/lib/menu";
import { buildWhatsAppMessage, buildWhatsAppUrl, getCartLines, getTotals, validateOrder, type CartLine, type Fulfillment } from "@/lib/order";

const instagram = "https://www.instagram.com/somewhere.coffeelab/";
const whatsappNumber = "5219993300883";
const agencyWhatsapp = "https://wa.me/56926341222?text=Hola%2C%20Agencia%20Darw.%20Quiero%20conversar%20sobre%20una%20web%20para%20mi%20negocio.";

function brand() {
  return <span className="brand-lockup"><span className="brand-name">SOME<br />WHERE</span><span className="brand-small">COFFEE LAB</span></span>;
}

export default function Home() {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartLoaded, setCartLoaded] = useState(false);
  const [selected, setSelected] = useState<MenuItem | null>(null);
  const [milk, setMilk] = useState<Milk>("Regular");
  const [flavor, setFlavor] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [fulfillment, setFulfillment] = useState<Fulfillment>("delivery");
  const [zone, setZone] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const saved = localStorage.getItem("somewhere-cart");
        if (saved) {
          const parsed = JSON.parse(saved) as CartLine[];
          if (Array.isArray(parsed)) setCart(parsed.filter(line => menu.some(item => item.id === line.itemId) && Number.isSafeInteger(line.quantity) && line.quantity > 0 && milkOptions.includes(line.milk)));
        }
      } catch { /* An old cart must never prevent ordering. */ }
      setCartLoaded(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  useEffect(() => {
    if (!cartLoaded) return;
    try { localStorage.setItem("somewhere-cart", JSON.stringify(cart)); }
    catch { /* Ordering still works if browser storage is unavailable. */ }
  }, [cart, cartLoaded]);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setSelected(null); setCartOpen(false); setCheckoutOpen(false); setConfirmOpen(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const lines = useMemo(() => getCartLines(cart), [cart]);
  const { count, subtotal, deliveryFee, total } = getTotals(lines, fulfillment, zone);

  const add = (item: MenuItem, selectedMilk: Milk) => {
    if (item.id.endsWith("sabor") && !flavor.trim()) return;
    const normalizedFlavor = item.id.endsWith("sabor") ? flavor.trim() : "";
    const key = `${item.id}:${selectedMilk}:${normalizedFlavor.toLocaleLowerCase("es-MX")}`;
    setCart(current => {
      const present = current.find(line => line.key === key);
      return present ? current.map(line => line.key === key ? { ...line, quantity: line.quantity + 1 } : line) : [...current, { key, itemId: item.id, milk: selectedMilk, flavor: normalizedFlavor, quantity: 1 }];
    });
    setSelected(null);
    setCartOpen(true);
  };
  const updateQuantity = (key: string, delta: number) => setCart(current => current.map(line => line.key === key ? { ...line, quantity: line.quantity + delta } : line).filter(line => line.quantity > 0));
  const openItem = (item: MenuItem) => { setMilk("Regular"); setFlavor(""); setSelected(item); };
  const beginCheckout = () => { if (!lines.length) return; setCartOpen(false); setCheckoutOpen(true); setError(""); };
  const orderDetails = { lines, fulfillment, zone, name, phone, address, notes };
  const reviewOrder = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const issue = validateOrder(orderDetails);
    if (issue) { setError(issue); return; }
    setError(""); setCheckoutOpen(false); setConfirmOpen(true);
  };
  const whatsappUrl = buildWhatsAppUrl(buildWhatsAppMessage(orderDetails), whatsappNumber);

  return <>
    <div className="site-shell">
      <header className="site-header">
        <a href="#inicio" className="brand-link" aria-label="Somewhere Coffee Lab, ir al inicio">{brand()}</a>
        <nav className="desktop-nav" aria-label="Navegación principal"><a href="#carta">La carta</a><a href="#historia">Nuestra historia</a><a href="#instagram">Instagram</a></nav>
        <button className="header-cart" onClick={() => setCartOpen(true)} aria-label={`Abrir carrito, ${count} productos`}><BagIcon size={21} weight="regular" /><span>Mi pedido</span><b>{count}</b></button>
      </header>

      <main id="inicio">
        <section className="hero" aria-labelledby="hero-title">
          <Image src="/hero-coffee.jpg" alt="Tres cafés fríos de especialidad sobre una mesa bajo la luz cálida" fill priority sizes="100vw" className="hero-photo" />
          <div className="hero-shade" />
          <div className="hero-content">
            <div className="eyebrow"><span className="eyebrow-line" /> HECHO CON AMOR EN MÉRIDA, YUCATÁN</div>
            <h1 id="hero-title">Un café,<br /><em>mil destinos.</em></h1>
            <p>Tu pausa favorita puede llevarte a cualquier lugar. Elige tu próximo destino, arma tu pedido y deja que la magia viaje hasta ti.</p>
            <a className="primary-button" href="#carta">Explorar la carta <ArrowRightIcon size={20} weight="bold" /></a>
            <div className="hero-note"><AirplaneTiltIcon size={18} weight="fill" /> Your trip starts here ☕️✈️</div>
          </div>
          <div className="hero-stamp" aria-hidden="true"><span>FRESHLY<br />MADE</span><CoffeeIcon size={25} weight="fill" /></div>
        </section>

        <div className="marquee" aria-hidden="true"><div className="marquee-track">SOMEWHERE COFFEE LAB <span>✳</span> FROM MÉRIDA WITH LOVE <span>✳</span> YOUR TRIP STARTS HERE <span>✳</span> SOMEWHERE COFFEE LAB <span>✳</span> FROM MÉRIDA WITH LOVE <span>✳</span> YOUR TRIP STARTS HERE <span>✳</span></div></div>

        <section id="carta" className="menu-section section-wrap">
          <div className="section-heading"><div><span className="overline">01 / ELIGE TU DESTINO</span><h2>Cafés que te llevan <em>lejos.</em></h2><p>Ocho ciudades, ocho maneras de viajar sin salir de casa.</p></div><span className="heading-doodle" aria-hidden="true">✈</span></div>
          <div className="destinations-grid">{menu.filter(item => item.category === "destinos").map((item, index) => <article className="destination-card" key={item.id} style={{ "--drink-tone": item.tone } as React.CSSProperties}>
            <div className="drink-visual"><span className="card-index">{String(index + 1).padStart(2, "0")}</span><Image src={item.image!} alt={`${item.name} de Somewhere Coffee Lab`} fill sizes="(max-width: 600px) 50vw, (max-width: 1000px) 33vw, 25vw" className="drink-photo" /></div>
            <div className="drink-details"><span className="city-label"><MapPinIcon size={13} weight="fill" /> {item.city}</span><h3>{item.name}</h3><p>{item.description}</p><div className="drink-bottom"><strong>{money(item.price)}</strong><button type="button" onClick={() => openItem(item)} aria-label={`Agregar ${item.name}`}><PlusIcon size={20} weight="bold" /></button></div></div>
          </article>)}</div>
          <div className="milk-banner"><span className="milk-icon">✳</span><div><strong>Hazlo más a tu estilo</strong><p>Cambia a leche de avena, almendra o coco por +$10 MXN.</p></div><span className="milk-squiggle" aria-hidden="true">♡</span></div>
        </section>

        <section className="classics-section"><div className="section-wrap classics-inner"><div className="classics-copy"><span className="overline">02 / LOS INFALTABLES</span><h2>Los clásicos<br /><em>de siempre.</em></h2><p>A veces el mejor viaje es volver a lo que amas.</p><span className="classics-mark">Made for your everyday escape ✳</span></div><div className="classics-list">{menu.filter(item => item.category === "clasicos").map(item => <div className="classic-row" key={item.id}><div><h3>{item.name}</h3><p>{item.description}</p></div><span>{money(item.price)}</span><button type="button" onClick={() => openItem(item)} aria-label={`Agregar ${item.name}`}><PlusIcon size={18} weight="bold" /></button></div>)}</div></div></section>

        <section id="historia" className="story-section"><div className="section-wrap story-inner"><div className="story-image-wrap"><Image src="/menu-original.png" alt="Carta original de Somewhere Coffee Lab, creada en Mérida" fill sizes="(max-width: 800px) 80vw, 38vw" className="story-image" /><span className="story-image-caption">DESDE CASA, CON MUCHO AMOR</span></div><div className="story-copy"><span className="overline light">03 / NUESTRA HISTORIA</span><h2>Todo gran viaje<br />empieza <em>en algún lugar.</em></h2><p>Somewhere Coffee Lab nació en casa, en Mérida, de las ganas de crear algo especial en cada vaso. Cada bebida es una invitación a hacer una pausa, probar algo nuevo y compartir el camino.</p><a href={instagram} target="_blank" rel="noopener noreferrer" className="text-link">Conoce la historia en Instagram <ArrowRightIcon size={19} /></a><div className="story-signature">Your trip starts here ☕️✈️</div></div></div></section>

        <section id="instagram" className="social-section section-wrap"><span className="overline">04 / ACOMPAÑA EL VIAJE</span><div className="social-header"><h2>La vida sabe mejor<br /><em>en movimiento.</em></h2><p>Detrás de cada café hay una historia. Mira los videos, el proceso y los momentos del día a día en el Instagram de Somewhere.</p></div><a href={instagram} target="_blank" rel="noopener noreferrer" className="instagram-card"><div className="instagram-card-art"><span className="insta-play" aria-hidden="true">▶</span><Image src="/hero-coffee.jpg" alt="Cafés de Somewhere Coffee Lab" fill sizes="(max-width: 800px) 100vw, 50vw" /></div><div className="instagram-card-copy"><InstagramLogoIcon size={30} weight="fill" /><span><strong>@somewhere.coffeelab</strong><small>Ver videos e historias en Instagram</small></span><ArrowRightIcon size={23} /></div></a></section>
      </main>
      <footer className="footer"><div className="section-wrap footer-inner"><div>{brand()}<p>Desde Mérida, con café y mucho corazón.</p></div><div><span>ENCUÉNTRANOS</span><a href={instagram} target="_blank" rel="noopener noreferrer">Instagram <ArrowRightIcon size={15} /></a><a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer">WhatsApp <ArrowRightIcon size={15} /></a></div><div className="footer-phrase">Your trip<br /><em>starts here.</em></div></div><div className="footer-bottom section-wrap">© {new Date().getFullYear()} Somewhere Coffee Lab <span>Hecho con ☕ en Mérida, México</span></div></footer>
      <section className="agency-credit" aria-labelledby="agency-credit-title"><div className="section-wrap agency-credit-inner"><div className="agency-credit-copy"><span className="agency-credit-label">DISEÑO Y DESARROLLO WEB</span><h2 id="agency-credit-title">Esta página web fue diseñada y<br className="agency-break" /> desarrollada por <span>Agencia Darw.</span></h2><p>¿Quieres desarrollar una web para tu negocio? Conversemos.</p></div><div className="agency-credit-actions"><a className="agency-whatsapp" href={agencyWhatsapp} target="_blank" rel="noopener noreferrer"><WhatsappLogoIcon size={19} weight="fill" /> Hablemos por WhatsApp <ArrowRightIcon size={17} /></a><a className="agency-website" href="https://darw.cl/" target="_blank" rel="noopener noreferrer">Visitar darw.cl <ArrowRightIcon size={17} /></a></div></div></section>
    </div>

    {count > 0 && <button type="button" className="floating-cart" onClick={() => setCartOpen(true)} aria-label={`Ver carrito con ${count} productos`}><BagIcon size={22} weight="fill" /><span>Ver mi pedido ({count})</span><strong>{money(subtotal)}</strong></button>}

    {selected && <div className="modal-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) setSelected(null); }}><div className="product-modal" role="dialog" aria-modal="true" aria-labelledby="product-title"><button className="close-button" onClick={() => setSelected(null)} aria-label="Cerrar"><XIcon size={22} /></button><div className="modal-product-visual" style={{ "--drink-tone": selected.tone ?? "#e4c39f" } as React.CSSProperties}>{selected.image ? <Image src={selected.image} alt="" fill sizes="320px" /> : <CoffeeIcon size={95} weight="duotone" />}</div><div className="modal-product-copy"><span className="overline">TU PRÓXIMO DESTINO</span><h2 id="product-title">{selected.name}</h2><p>{selected.description}</p>{selected.id.endsWith("sabor") && <label className="flavor-field">¿Qué sabor quieres?<input value={flavor} onChange={event => setFlavor(event.target.value)} placeholder="Escribe el sabor" required /></label>}{!selected.id.startsWith("americano") && <fieldset><legend>Elige tu leche</legend>{milkOptions.map(option => <label key={option} className={`milk-option ${milk === option ? "active" : ""}`}><input type="radio" name="milk" value={option} checked={milk === option} onChange={() => setMilk(option)} /><span>{option}</span><small>{option === "Regular" ? "Incluida" : "+$10"}</small></label>)}</fieldset>}<button className="primary-button full" disabled={selected.id.endsWith("sabor") && !flavor.trim()} onClick={() => add(selected, milk)}>Agregar al pedido <span>{money(selected.price + (milk === "Regular" ? 0 : 10))}</span></button></div></div></div>}

    {cartOpen && <div className="drawer-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) setCartOpen(false); }}><aside className="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title"><div className="drawer-head"><div><span className="overline">YOUR TRIP STARTS HERE</span><h2 id="cart-title">Tu pedido <em>✳</em></h2></div><button className="close-button" onClick={() => setCartOpen(false)} aria-label="Cerrar carrito"><XIcon size={22} /></button></div><div className="drawer-body">{lines.length === 0 ? <div className="empty-cart"><BagIcon size={58} weight="thin" /><h3>Tu carrito espera un destino.</h3><p>Explora la carta y elige algo rico para empezar.</p><button onClick={() => setCartOpen(false)} className="outline-button">Seguir explorando</button></div> : lines.map(line => <div className="cart-line" key={line.key}><div className="cart-line-image">{line.item.image ? <Image src={line.item.image} alt="" fill sizes="75px" /> : <CoffeeIcon size={33} />}</div><div className="cart-line-main"><strong>{line.item.name}</strong><small>{line.flavor ? `Sabor: ${line.flavor} · ` : ""}{line.milk === "Regular" ? "Leche regular" : `Leche de ${line.milk.toLowerCase()} (+$10)`}</small><div className="quantity"><button onClick={() => updateQuantity(line.key, -1)} aria-label={`Quitar uno de ${line.item.name}`}><MinusIcon size={15} /></button><span>{line.quantity}</span><button onClick={() => updateQuantity(line.key, 1)} aria-label={`Agregar uno de ${line.item.name}`}><PlusIcon size={15} /></button></div></div><strong>{money(line.unitPrice * line.quantity)}</strong></div>)}</div>{lines.length > 0 && <div className="drawer-foot"><div className="summary-row"><span>Subtotal</span><strong>{money(subtotal)}</strong></div><p>El costo de envío se calcula en el siguiente paso.</p><button className="primary-button full" onClick={beginCheckout}>Continuar pedido <ArrowRightIcon size={20} /></button></div>}</aside></div>}

    {checkoutOpen && <div className="modal-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) setCheckoutOpen(false); }}>
      <div className="checkout-modal" role="dialog" aria-modal="true" aria-labelledby="checkout-title">
        <button className="close-button" onClick={() => setCheckoutOpen(false)} aria-label="Cerrar"><XIcon size={22} /></button>
        <span className="overline">YA CASI LLEGAMOS</span>
        <h2 id="checkout-title">¿A dónde va tu <em>café?</em></h2>
        <p className="checkout-intro">Completa tus datos para preparar el mensaje de pedido.</p>
        <form onSubmit={reviewOrder} noValidate>
          <div className="fulfillment-tabs">
            <button type="button" className={fulfillment === "delivery" ? "active" : ""} onClick={() => { setFulfillment("delivery"); setError(""); }}><MapPinIcon size={20} /> Delivery</button>
            <button type="button" className={fulfillment === "pickup" ? "active" : ""} onClick={() => { setFulfillment("pickup"); setError(""); }}><BagIcon size={20} /> Retiro</button>
          </div>
          <div className="field-grid">
            <label>Tu nombre<input autoComplete="name" value={name} onChange={event => setName(event.target.value)} placeholder="¿Cómo te llamas?" required /></label>
            <label>Tu WhatsApp<input type="tel" autoComplete="tel" inputMode="tel" value={phone} onChange={event => setPhone(event.target.value)} placeholder="999 123 4567" required /></label>
          </div>
          {fulfillment === "delivery" ? <>
            <label>Zona de entrega<select value={zone} onChange={event => setZone(event.target.value)} required><option value="">Selecciona una zona</option>{deliveryZones.map(entry => <option value={entry.id} key={entry.id}>{entry.label} · {money(entry.fee)}</option>)}</select></label>
            <label>Dirección de entrega<input autoComplete="street-address" value={address} onChange={event => setAddress(event.target.value)} placeholder="Calle, número, colonia y referencias" required /></label>
            <p className="zone-note">Zonas y tarifas de ejemplo. Confirma la cobertura final por WhatsApp.</p>
          </> : <p className="pickup-note">Te compartirán el punto de retiro y el horario por WhatsApp.</p>}
          <label>Notas para tu pedido <span className="optional">(opcional)</span><textarea value={notes} onChange={event => setNotes(event.target.value)} placeholder="Algo que debamos saber..." rows={2} /></label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="checkout-total"><div><span>Subtotal</span><strong>{money(subtotal)}</strong></div><div><span>Envío</span><strong>{fulfillment === "pickup" ? "Gratis" : zone ? money(deliveryFee) : "Por elegir"}</strong></div><div className="grand-total"><span>Total estimado</span><strong>{money(total)}</strong></div></div>
          <button type="submit" className="primary-button full">Revisar pedido <ArrowRightIcon size={20} /></button>
        </form>
      </div>
    </div>}

    {confirmOpen && <div className="modal-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) setConfirmOpen(false); }}>
      <div className="confirm-modal" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
        <button className="close-button" onClick={() => setConfirmOpen(false)} aria-label="Cerrar"><XIcon size={22} /></button>
        <div className="confirm-icon"><CheckIcon size={32} weight="bold" /></div>
        <span className="overline">UN ÚLTIMO PASO</span>
        <h2 id="confirm-title">Tu viaje está<br /><em>por comenzar.</em></h2>
        <p>Se abrirá WhatsApp con tu mensaje listo. Revísalo y pulsa enviar allí; Somewhere confirmará disponibilidad y tiempo de preparación.</p>
        <div className="confirm-summary"><span>{count} {count === 1 ? "bebida" : "bebidas"} · {fulfillment === "delivery" ? "Delivery" : "Retiro"}</span><strong>{money(total)}</strong></div>
        <div className="confirm-details">
          <ul>{lines.map(line => <li key={line.key}><span>{line.quantity} × {line.item.name}{line.flavor ? ` · ${line.flavor}` : ""}{line.milk !== "Regular" ? ` · leche ${line.milk.toLowerCase()}` : ""}</span><strong>{money(line.unitPrice * line.quantity)}</strong></li>)}</ul>
          <p><strong>{fulfillment === "delivery" ? "Entrega:" : "Retiro:"}</strong> {fulfillment === "delivery" ? `${deliveryZones.find(entry => entry.id === zone)?.label ?? ""} · ${address.trim()}` : "Punto y horario por confirmar"}</p>
          <p><strong>Contacto:</strong> {name.trim()} · {phone.trim()}</p>
          {notes.trim() && <p><strong>Notas:</strong> {notes.trim()}</p>}
        </div>
        <a className="primary-button full whatsapp-button" href={whatsappUrl} target="_blank" rel="noopener noreferrer"><WhatsappLogoIcon size={23} weight="fill" /> Enviar por WhatsApp</a>
        <button className="back-link" onClick={() => { setConfirmOpen(false); setCheckoutOpen(true); }}>Editar mis datos</button>
      </div>
    </div>}
  </>;
}

