import { deliveryZones, menu, money, type MenuItem, type Milk } from "./menu";

export type CartLine = { key: string; itemId: string; milk: Milk; quantity: number; flavor?: string };
export type Fulfillment = "delivery" | "pickup";
export type OrderLine = CartLine & { item: MenuItem; unitPrice: number };

export function getCartLines(cart: CartLine[]): OrderLine[] {
  return cart.flatMap(line => {
    const item = menu.find(entry => entry.id === line.itemId);
    return item && Number.isSafeInteger(line.quantity) && line.quantity > 0
      ? [{ ...line, item, unitPrice: item.price + (line.milk === "Regular" ? 0 : 10) }]
      : [];
  });
}

export function getTotals(lines: OrderLine[], fulfillment: Fulfillment, zone: string) {
  const count = lines.reduce((sum, line) => sum + line.quantity, 0);
  const subtotal = lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
  const deliveryFee = fulfillment === "delivery" ? (deliveryZones.find(entry => entry.id === zone)?.fee ?? 0) : 0;
  return { count, subtotal, deliveryFee, total: subtotal + deliveryFee };
}

export type OrderDetails = {
  lines: OrderLine[];
  fulfillment: Fulfillment;
  zone: string;
  name: string;
  phone: string;
  address: string;
  notes: string;
};

export function validateOrder(details: OrderDetails): string {
  if (details.lines.length === 0) return "Agrega al menos una bebida antes de continuar.";
  if (!details.name.trim()) return "Escribe tu nombre para identificar el pedido.";
  const digits = details.phone.replace(/\D/g, "");
  if (!/^\+?[\d\s().-]+$/.test(details.phone.trim()) || !/^(?:\d{10}|52\d{10}|521\d{10})$/.test(digits)) return "Escribe un WhatsApp de 10 dígitos, con +52 si lo prefieres.";
  if (details.fulfillment === "delivery" && !deliveryZones.some(entry => entry.id === details.zone)) return "Selecciona una zona de entrega.";
  if (details.fulfillment === "delivery" && !details.address.trim()) return "Escribe la dirección de entrega.";
  return "";
}

export function buildWhatsAppMessage(details: OrderDetails): string {
  const { subtotal, deliveryFee, total } = getTotals(details.lines, details.fulfillment, details.zone);
  const items = details.lines.map(line => `• ${line.quantity} × ${line.item.name}${line.item.city ? ` (${line.item.city})` : ""} — ${money(line.unitPrice * line.quantity)}${line.flavor ? `\n  Sabor: ${line.flavor}` : ""}${line.milk !== "Regular" ? `\n  Leche: ${line.milk} (+$10 c/u)` : ""}`).join("\n");
  const destination = details.fulfillment === "delivery"
    ? `Delivery · ${deliveryZones.find(entry => entry.id === details.zone)?.label ?? ""}\nDirección: ${details.address.trim()}\nEnvío: ${money(deliveryFee)}`
    : "Retiro en Somewhere Coffee Lab\nPor favor, confírmenme el punto de retiro y el horario.";
  return `¡Hola, Somewhere Coffee Lab! ☕️✈️\nQuiero hacer este pedido:\n\n${items}\n\nSubtotal: ${money(subtotal)}\n${destination}\n*Total estimado: ${money(total)}*\n\nNombre: ${details.name.trim()}\nWhatsApp: ${details.phone.trim()}${details.notes.trim() ? `\nNotas: ${details.notes.trim()}` : ""}\n\n¿Me confirman disponibilidad y tiempo de ${details.fulfillment === "delivery" ? "entrega" : "preparación"}?`;
}

export function buildWhatsAppUrl(message: string, number = "5219993300883") {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
