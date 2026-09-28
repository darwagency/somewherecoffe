import assert from "node:assert/strict";
import test from "node:test";
import { buildWhatsAppMessage, buildWhatsAppUrl, getCartLines, getTotals, validateOrder, type OrderDetails } from "../src/lib/order";

const lines = getCartLines([
  { key: "roma:Avena", itemId: "roma", milk: "Avena", quantity: 2 },
  { key: "latte-sabor:Regular:avellana", itemId: "latte-caliente-sabor", milk: "Regular", flavor: "Avellana", quantity: 1 },
]);

function details(overrides: Partial<OrderDetails> = {}): OrderDetails {
  return { lines, fulfillment: "delivery", zone: "centro", name: "Ana", phone: "+52 1 999 123 4567", address: "Calle 10 #20, Centro", notes: "Poco hielo", ...overrides };
}

test("calcula bebida, cambio de leche y envío sin alterar el retiro", () => {
  assert.deepEqual(getTotals(lines, "delivery", "centro"), { count: 3, subtotal: 220, deliveryFee: 50, total: 270 });
  assert.deepEqual(getTotals(lines, "delivery", "poniente"), { count: 3, subtotal: 220, deliveryFee: 70, total: 290 });
  assert.deepEqual(getTotals(lines, "pickup", "poniente"), { count: 3, subtotal: 220, deliveryFee: 0, total: 220 });
});

test("valida los datos imprescindibles antes de crear el pedido", () => {
  assert.equal(validateOrder(details()), "");
  assert.match(validateOrder(details({ lines: [] })), /Agrega al menos una bebida/);
  assert.match(validateOrder(details({ name: " " })), /nombre/);
  assert.match(validateOrder(details({ phone: "123456789012345" })), /WhatsApp/);
  assert.match(validateOrder(details({ phone: "abc9991234567" })), /WhatsApp/);
  assert.match(validateOrder(details({ zone: "" })), /zona/);
  assert.match(validateOrder(details({ address: " " })), /dirección/);
  assert.equal(validateOrder(details({ fulfillment: "pickup", zone: "", address: "" })), "");
});

test("el mensaje de delivery conserva cantidades, personalización, contacto y total", () => {
  const message = buildWhatsAppMessage(details());
  assert.match(message, /2 × Tiramisú Latte/);
  assert.match(message, /Leche: Avena \(\+\$10 c\/u\)/);
  assert.match(message, /Sabor: Avellana/);
  assert.match(message, /Delivery · Zona 1 · Centro/);
  assert.match(message, /Dirección: Calle 10 #20, Centro/);
  assert.match(message, /Total estimado: \$270 MXN/);
  assert.match(message, /WhatsApp: \+52 1 999 123 4567/);
  assert.match(message, /Notas: Poco hielo/);
  assert.equal(new URL(buildWhatsAppUrl(message)).pathname, "/5219993300883");
  assert.equal(new URL(buildWhatsAppUrl(message)).searchParams.get("text"), message);
});

test("el retiro no incluye costo de envío ni dirección privada", () => {
  const message = buildWhatsAppMessage(details({ fulfillment: "pickup" }));
  assert.match(message, /Total estimado: \$220 MXN/);
  assert.match(message, /punto de retiro y el horario/);
  assert.doesNotMatch(message, /Dirección:|Envío:/);
});
