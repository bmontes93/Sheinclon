const products = [
  {
    _id: "1",
    name: "Vestido Floral de Verano",
    description: "Un vestido ligero y fresco, perfecto para los días de verano. Con un estampado floral vibrante.",
    price: 29.99,
    category: "Vestidos",
    imageUrl: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1572804013427-4d7ca7268217?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    stock: 150,
    sizes: [
      { size: "XS", stock: 20 },
      { size: "S", stock: 35 },
      { size: "M", stock: 45 },
      { size: "L", stock: 30 }
    ],
    colors: [
      { name: "Floral", hexCode: "#FFB6C1" },
      { name: "Azul", hexCode: "#87CEEB" }
    ],
  },
  {
    _id: "2",
    name: "Blusa de Seda con Lazo",
    description: "Elegante blusa de seda para un look de oficina sofisticado.",
    price: 25.50,
    category: "Blusas",
    imageUrl: "https://images.unsplash.com/photo-1551163943-3f6a29e3965e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1551163943-3f6a29e3965e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    ],
    stock: 200,
  },
  {
    _id: "3",
    name: "Jeans Skinny de Tiro Alto",
    description: "Jeans ajustados que realzan la figura. Un básico indispensable.",
    price: 39.99,
    category: "Pantalones",
    imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    stock: 300,
  },
  {
    _id: "4",
    name: "Chaqueta de Cuero Biker",
    description: "Clásica chaqueta de cuero estilo biker. Toque rebelde y moderno.",
    price: 75.00,
    category: "Chaquetas",
    imageUrl: "https://images.unsplash.com/photo-1551028919-6019b7a151b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    stock: 100,
  },
  {
    _id: "5",
    name: "Falda Plisada a Media Pierna",
    description: "Falda plisada versátil y femenina.",
    price: 34.90,
    category: "Faldas",
    imageUrl: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    stock: 120,
  },
  {
    _id: "6",
    name: "Top de Tirantes Básico",
    description: "Top sencillo y cómodo para el día a día.",
    price: 9.99,
    category: "Tops",
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    stock: 500,
  },
  {
    _id: "7",
    name: "Pantalones Anchos de Lino",
    description: "Pantalones anchos, ideales para climas cálidos.",
    price: 45.00,
    category: "Pantalones",
    imageUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    stock: 180,
  },
  {
    _id: "8",
    name: "Vestido de Noche Brillante",
    description: "Deslumbra en cualquier evento con este vestido elegante.",
    price: 89.99,
    category: "Vestidos",
    imageUrl: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    stock: 80,
  },
  {
    _id: "9",
    name: "Sudadera Oversize",
    description: "Sudadera cómoda estilo urbano.",
    price: 32.00,
    category: "Sudaderas",
    imageUrl: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    stock: 250,
  },
  {
    _id: "10",
    name: "Bikini de Verano",
    description: "Bikini de dos piezas, diseño atemporal.",
    price: 22.99,
    category: "Ropa de Baño",
    imageUrl: "https://images.unsplash.com/photo-1574941193074-a6f9479d7225?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    stock: 400,
  },
];

module.exports = products;