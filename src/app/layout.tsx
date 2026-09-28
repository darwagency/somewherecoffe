import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Somewhere Coffee Lab | Your trip starts here",
  description: "Cafés de especialidad hechos con cariño en Mérida. Explora la carta, arma tu pedido y envíalo por WhatsApp.",
  openGraph: {
    title: "Somewhere Coffee Lab",
    description: "Your trip starts here ☕️✈️",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es-MX"><body>{children}</body></html>;
}
