export type MenuItem = { id: string; city?: string; name: string; description: string; price: number; image?: string; category: "destinos" | "clasicos"; tone?: string };

export const menu: MenuItem[] = [
  { id: "roma", city: "Roma", name: "Tiramisú Latte", description: "Latte de chocolate, cloud foam y cacao", price: 70, image: "/drinks/roma.jpg", category: "destinos", tone: "#e7c3a4" },
  { id: "new-york", city: "New York", name: "Brown Sugar", description: "Espresso, canela, azúcar mascabado y leche", price: 65, image: "/drinks/new-york.jpg", category: "destinos", tone: "#d9b08b" },
  { id: "merida", city: "Mérida", name: "Horchata Latte", description: "Latte de horchata, cloud foam y canela", price: 65, image: "/drinks/merida.jpg", category: "destinos", tone: "#dfc4a6" },
  { id: "buenos-aires", city: "Buenos Aires", name: "Dulce de leche", description: "Latte de dulce de leche y cloud foam", price: 65, image: "/drinks/buenos-aires.jpg", category: "destinos", tone: "#ddad81" },
  { id: "londres", city: "Londres", name: "Caramel Latte", description: "Latte de caramelo, cloud foam y caramelo líquido", price: 75, image: "/drinks/londres.jpg", category: "destinos", tone: "#d6a579" },
  { id: "oaxaca", city: "Oaxaca", name: "Vainilla Latte", description: "Latte de vainilla y cloud foam", price: 75, image: "/drinks/oaxaca.jpg", category: "destinos", tone: "#e7ceb0" },
  { id: "tokyo", city: "Tokyo", name: "Matcha coco", description: "Matcha con syrup de coco, leche y un toque de vainilla", price: 75, image: "/drinks/tokyo.jpg", category: "destinos", tone: "#b9c9a6" },
  { id: "viena", city: "Viena", name: "Cinnamon Latte", description: "Latte de canela, vainilla y cloud foam", price: 65, image: "/drinks/viena.jpg", category: "destinos", tone: "#dab38e" },
  { id: "americano-caliente", name: "Americano caliente", description: "Espresso y agua caliente", price: 45, category: "clasicos" },
  { id: "americano-frio", name: "Americano frío", description: "Espresso sobre hielo", price: 50, category: "clasicos" },
  { id: "latte-caliente", name: "Latte caliente", description: "Espresso con leche vaporizada", price: 50, category: "clasicos" },
  { id: "latte-caliente-sabor", name: "Latte caliente sabor", description: "Tu latte caliente con un toque de sabor", price: 60, category: "clasicos" },
  { id: "latte-frio", name: "Latte frío", description: "Espresso y leche sobre hielo", price: 55, category: "clasicos" },
  { id: "capuccino-caliente", name: "Capuccino caliente", description: "Espresso, leche y espuma", price: 50, category: "clasicos" },
  { id: "capuccino-caliente-sabor", name: "Capuccino caliente sabor", description: "Capuccino con un toque de sabor", price: 60, category: "clasicos" },
  { id: "matcha-caliente", name: "Matcha caliente", description: "Matcha cremoso con leche", price: 70, category: "clasicos" },
];

export const milkOptions = ["Regular", "Avena", "Almendra", "Coco"] as const;
export type Milk = typeof milkOptions[number];
export const deliveryZones = [
  { id: "centro", label: "Zona 1 · Centro (ejemplo)", fee: 50 },
  { id: "norte", label: "Zona 2 · Norte (ejemplo)", fee: 60 },
  { id: "poniente", label: "Zona 3 · Poniente (ejemplo)", fee: 70 },
];
export const money = (amount: number) => `$${amount} MXN`;

