import assert from "node:assert/strict";
import test from "node:test";
import { JSDOM } from "jsdom";
import React from "react";

test("cliente puede armar, revisar y abrir un pedido válido por WhatsApp", async () => {
  const dom = new JSDOM("<!doctype html><html><body></body></html>", { url: "http://localhost:3000", pretendToBeVisual: true });
  Object.assign(globalThis, {
    window: dom.window,
    document: dom.window.document,
    HTMLElement: dom.window.HTMLElement,
    Node: dom.window.Node,
    MouseEvent: dom.window.MouseEvent,
    getComputedStyle: dom.window.getComputedStyle,
    requestAnimationFrame: dom.window.requestAnimationFrame.bind(dom.window),
    cancelAnimationFrame: dom.window.cancelAnimationFrame.bind(dom.window),
    localStorage: dom.window.localStorage,
  });
  Object.defineProperty(globalThis, "navigator", { value: dom.window.navigator, configurable: true });
  const { render, within, waitFor, cleanup } = await import("@testing-library/react");
  const userEvent = (await import("@testing-library/user-event")).default;
  const Home = (await import("../src/app/page")).default;
  const user = userEvent.setup({ document: dom.window.document });
  const view = render(React.createElement(Home));
  await new Promise(resolve => setTimeout(resolve, 30));

  await user.click(view.getByRole("button", { name: "Agregar Tiramisú Latte" }));
  const product = view.getByRole("dialog", { name: "Tiramisú Latte" });
  await user.click(within(product).getByRole("radio", { name: /Avena/ }));
  await user.click(within(product).getByRole("button", { name: /Agregar al pedido/ }));

  const cart = view.getByRole("dialog", { name: /Tu pedido/ });
  assert.match(cart.textContent ?? "", /Leche de avena/);
  assert.match(cart.textContent ?? "", /\$80 MXN/);
  await user.click(within(cart).getByRole("button", { name: /Agregar uno de Tiramisú Latte/ }));
  assert.match(cart.textContent ?? "", /\$160 MXN/);
  await user.click(within(cart).getByRole("button", { name: /Quitar uno de Tiramisú Latte/ }));
  assert.match(cart.textContent ?? "", /\$80 MXN/);
  await user.click(within(cart).getByRole("button", { name: /Continuar pedido/ }));

  const checkout = view.getByRole("dialog", { name: /A dónde va tu/ });
  await user.type(within(checkout).getByPlaceholderText("¿Cómo te llamas?"), "Ana");
  await user.type(within(checkout).getByPlaceholderText("999 123 4567"), "9991234567");
  await user.click(within(checkout).getByRole("button", { name: /Revisar pedido/ }));
  assert.match(within(checkout).getByRole("alert").textContent ?? "", /zona de entrega/);
  await user.selectOptions(within(checkout).getByRole("combobox"), "centro");
  await user.type(within(checkout).getByPlaceholderText("Calle, número, colonia y referencias"), "Calle 10 #20, Centro");
  assert.match(checkout.textContent ?? "", /\$130 MXN/);
  await user.click(within(checkout).getByRole("button", { name: /Revisar pedido/ }));

  const confirmation = await waitFor(() => view.getByRole("dialog", { name: /Tu viaje está/ }));
  assert.match(confirmation.textContent ?? "", /Calle 10 #20, Centro/);
  assert.match(confirmation.textContent ?? "", /\$130 MXN/);
  const sendLink = within(confirmation).getByRole("link", { name: /Enviar por WhatsApp/ });
  const url = new URL(sendLink.getAttribute("href") ?? "");
  assert.equal(url.pathname, "/5219993300883");
  assert.match(url.searchParams.get("text") ?? "", /Leche: Avena/);
  assert.match(url.searchParams.get("text") ?? "", /Total estimado: \$130 MXN/);

  await user.click(within(confirmation).getByRole("button", { name: /Editar mis datos/ }));
  const editedCheckout = view.getByRole("dialog", { name: /A dónde va tu/ });
  await user.click(within(editedCheckout).getByRole("button", { name: "Retiro" }));
  assert.match(editedCheckout.textContent ?? "", /punto de retiro y el horario/);
  assert.match(editedCheckout.textContent ?? "", /\$80 MXN/);
  await user.click(within(editedCheckout).getByRole("button", { name: /Revisar pedido/ }));
  const pickupConfirmation = await waitFor(() => view.getByRole("dialog", { name: /Tu viaje está/ }));
  const pickupUrl = new URL(within(pickupConfirmation).getByRole("link", { name: /Enviar por WhatsApp/ }).getAttribute("href") ?? "");
  assert.match(pickupUrl.searchParams.get("text") ?? "", /punto de retiro y el horario/);
  assert.match(pickupUrl.searchParams.get("text") ?? "", /Total estimado: \$80 MXN/);
  assert.doesNotMatch(pickupUrl.searchParams.get("text") ?? "", /Dirección:|Envío:/);

  const agency = view.getByRole("region", { name: /Esta página web fue diseñada/ });
  assert.equal(within(agency).getByRole("link", { name: /Visitar darw.cl/ }).getAttribute("href"), "https://darw.cl/");
  assert.match(within(agency).getByRole("link", { name: /Hablemos por WhatsApp/ }).getAttribute("href") ?? "", /^https:\/\/wa\.me\/56926341222/);
  cleanup();
  dom.window.close();
});
