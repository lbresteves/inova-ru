export const PRODUCTS_MOCK = [
  {
    id: "1",
    name: "Notebook Pro X15",
    description:
      "High-performance laptop with 12th Gen Intel i7 processor, 16GB RAM, and 512GB SSD.",
    price: 7499.9,
    image: {
      filePath: "https://picsum.photos/id/180/600/400",
      alt: "Notebook Pro X15",
    },
  },
  {
    id: "2",
    name: "Smartphone Neo Z",
    description:
      "5G smartphone with 6.7” AMOLED display, triple 64MP camera, and 5000mAh battery.",
    price: 3999.0,
    image: {
      filePath:
        "https://images.samsung.com/is/image/samsung/p6pim/br/f-a566ezkr390b/gallery/br-bundle-a56-5g__-galaxy-fit3__-graphite-f-a566ezkr390b-thumb-545945947?$UX_EXT2_PNG$",
      alt: "Smartphone Neo Z",
    },
  },
  {
    id: "3",
    name: "Headphones Pulse",
    description:
      "Bluetooth headset with active noise cancellation and up to 30 hours of battery life.",
    price: 899.9,
    image: {
      filePath:
        "https://cdn.dooca.store/152726/products/1078_640x640.png?v=1723048692&webp=0",
      alt: "Wireless Headphones Pulse",
    },
  },
  {
    id: "4",
    name: "UltraWide 34” Vision Monitor",
    description:
      "Curved UltraWide monitor with QHD resolution, 144Hz refresh rate, and HDR10 support.",
    price: 2599.0,
    image: {
      filePath:
        "https://img.odcdn.com.br/wp-content/uploads/2023/01/odyssey-g9-57-2.webp",
      alt: "UltraWide 34” Vision Monitor",
    },
  },
  {
    id: "5",
    name: "RGB Mechanical Keyboard",
    description:
      "Gaming mechanical keyboard with Blue switches, RGB lighting, and programmable keys.",
    price: 499.9,
    image: {
      filePath:
        "https://m.media-amazon.com/images/S/aplus-media-library-service-media/d519ae5a-5abe-4b40-847b-b3dbbb5b7266.__CR0,0,970,600_PT0_SX970_V1___.png",
      alt: "RGB Storm Mechanical Keyboard",
    },
  },
];

export const HIGHLIGHTED_PRODUCTS_MOCK = PRODUCTS_MOCK.slice(0, 3);
