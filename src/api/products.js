// Product images would typically be stored in a CDN or Firebase Storage
// For now, we'll use placeholder images
const products = [
  {
    id: 1,
    name: "Auto Clicker for Phone",
    price: 12.99,
    originalPrice: 39.99,
    description:
      "Automate repetitive tasks on your phone with this convenient auto clicker. Perfect for games and applications that require repeated tapping.",
    images: [
     "https://www.palletbodega.com/cdn/shop/files/Screenshot_2024-10-31_at_10.23.55_AM.png?v=1730388270?height=400&width=400&text=Auto+Clicker+1",
     "https://www.palletbodega.com/cdn/shop/files/Screenshot_2024-10-31_at_10.23.40_AM.png?v=1730388271?height=400&width=400&text=Auto+Clicker+2",
    ],
    soldOut: false,
    sale: true,
    category: "electronics",
    featured: false,
  },
  {
    id: 2,
    name: "Drone with Camera Foldable Mini Drone",
    price: 45.99,
    originalPrice: 179.99,
    description:
      "Foldable mini drone for kids and beginners with camera, gesture selfie, one key start, 360° flips, and 1020mAh rechargeable battery. Supports connecting to TV and two players. Perfect birthday gift toy.",
    images: [
      "https://www.palletbodega.com/cdn/shop/files/Screenshot2024-11-19at12.14.16PM.png?v=1732040289&width=1066?height=400&width=400&text=Drone+1",
      "https://www.palletbodega.com/cdn/shop/files/Screenshot2024-11-19at12.14.32PM.png?v=1732040289&width=1066?height=400&width=400&text=Drone+2",
    ],
    soldOut: false,
    sale: true,
    category: "electronics",
    featured: false,
  },
  {
    id: 3,
    name: "Handheld Game Console",
    price: 14.99,
    originalPrice: 49.99,
    description:
      "Portable retro game console with 400 classical FC games and intelligent screen charging case. Relive your childhood with this compact gaming device.",
    images: [
      "https://www.palletbodega.com/cdn/shop/files/1_0f57c4e2-92bb-4174-9893-03883ac8ddbf.png?v=1731615681&width=1066",
      "https://www.palletbodega.com/cdn/shop/files/2.png?v=1731615681&width=1066",
    ],
    soldOut: false,
    sale: true,
    category: "electronics",
    featured: false,
  },
  {
    id: 4,
    name: "Limited Edition Makeup Mystery Boxes",
    price: 89.0,
    originalPrice: null,
    description:
      "Surprise yourself with our limited edition makeup mystery boxes. Each box contains a curated selection of premium makeup products worth much more than the purchase price.",
    images: [
     "https://www.palletbodega.com/cdn/shop/files/makeuponly.png?v=1727724881&width=720?height=400&width=400&text=Makeup+Box+1",
     "https://www.palletbodega.com/cdn/shop/files/DSC09378.jpg?v=1727723560&width=720?height=400&width=400&text=Makeup+Box+2",
    ],
    soldOut: false,
    sale: false,
    category: "beauty",
    featured: true,
  },
  {
    id: 5,
    name: "Noise Cancelling Bluetooth Earbuds",
    price: 24.99,
    originalPrice: 89.99,
    description:
      "White noise cancelling bluetooth earbuds with big touch intelligent screen charging case. Enjoy crystal clear audio without distractions.",
    images: [
      "https://www.palletbodega.com/cdn/shop/files/51akeWHcI2L.jpg?v=1730388825&width=720?height=400&width=400&text=Earbuds+1",
      "https://www.palletbodega.com/cdn/shop/files/61N0PqzMY7L.jpg?v=1730388825&width=720?height=400&width=400&text=Earbuds+2",
    ],
    soldOut: false,
    sale: true,
    category: "electronics",
    featured: false,
  },
  {
    id: 6,
    name: "Pallet Bodega -Large Box-",
    price: 189.99,
    originalPrice: null,
    description:
      "Our large mystery box contains a variety of premium products across multiple categories. Each box is carefully curated to ensure maximum value and excitement.",
    images: [
      "https://www.palletbodega.com/cdn/shop/files/Large_PIC.png?v=1726955743?height=400&width=400&text=Large+Box+1"
    ],
    soldOut: true,
    sale: false,
    category: "mystery",
    featured: true,
  },
  {
    id: 7,
    name: "Pallet Bodega -Medium Box-",
    price: 137.99,
    originalPrice: null,
    description:
      "Our medium mystery box offers a balanced selection of quality products at a great value. Perfect for those who want to try something new without committing to the large box.",
    images: [
      "https://www.palletbodega.com/cdn/shop/files/pallet_bode_med.png?v=1726955400?height=400&width=400&text=Medium+Box+1"
    ],
    soldOut: true,
    sale: false,
    category: "mystery",
    featured: true,
  },
  {
    id: 8,
    name: "Pallet Bodega -Small Box-",
    price: 99.0,
    originalPrice: null,
    description:
      "Our small mystery box is an affordable way to experience the thrill of unboxing surprise products. Great as a gift or a treat for yourself.",
    images: [
      "https://www.palletbodega.com/cdn/shop/files/Pallet_bd_small_0debe103-5c59-499f-9275-af1d837bb680.png?v=1726955439&width=533"
    ],
    soldOut: true,
    sale: false,
    category: "mystery",
    featured: true,
  },
  {
    id: 9,
    name: "Portable Wireless Speaker",
    price: 34.99,
    originalPrice: 89.99,
    description:
      "Compact wireless speaker with powerful sound and long battery life. Perfect for outdoor activities, travel, or home use.",
    images: [
      "https://www.palletbodega.com/cdn/shop/files/IMG_0272_2.jpg?v=1732582318&width=940?height=400&width=400&text=Speaker+1",
      "https://www.palletbodega.com/cdn/shop/files/1_2.png?v=1732582375&width=940?height=400&width=400&text=Speaker+2",
    ],
    soldOut: false,
    sale: true,
    category: "electronics",
    featured: false,
  },
  {
    id: 10,
    name: "Power Bank Wireless Charger 10000mAh",
    price: 27.99,
    originalPrice: 59.99,
    description:
      "10000mAh power bank with built-in 3 solar panels for fast charging. This solar charger is perfect for outdoor activities and emergency situations.",
    images: [
      "https://www.palletbodega.com/cdn/shop/files/Screenshot2024-11-19at11.21.33AM.png?v=1732037137&width=533?height=400&width=400&text=Power+Bank+1",
      "https://www.palletbodega.com/cdn/shop/files/Screenshot2024-11-19at11.22.22AM.png?v=1732037137&width=533?height=400&width=400&text=Power+Bank+2",
    ],
    soldOut: false,
    sale: true,
    category: "electronics",
    featured: false,
  },
  {
    id: 11,
    name: "Sam's Club Clothing Box (Random Brand Pulls)",
    price: 400.0,
    originalPrice: null,
    description:
      "Premium clothing mystery box featuring random brand pulls from Sam's Club. Each box contains a variety of clothing items from well-known brands at a fraction of the retail price.",
    images: [
      "https://www.palletbodega.com/cdn/shop/files/Export_photo_1.png?v=1728588280&width=990?height=400&width=400&text=Clothing+Box+1",
      "https://www.palletbodega.com/cdn/shop/files/Pallet_Dogea_1.png?v=1728588151&width=360",
    ],
    soldOut: false,
    sale: false,
    category: "clothing",
    featured: true,
  },
]

// API functions remain the same
export const getAllProducts = async () => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))
  return [...products]
}

export const getProductById = async (id) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  const product = products.find((p) => p.id === Number.parseInt(id))

  if (!product) {
    throw new Error("Product not found")
  }

  return product
}

export const getFeaturedProducts = async () => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))
  return products.filter((p) => p.featured)
}

export const getProductsByCategory = async (category) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))
  return products.filter((p) => p.category === category)
}

export const getProductsOnSale = async () => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))
  return products.filter((p) => p.sale)
}

export const searchProducts = async (query) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  if (!query || query.trim() === "") {
    return []
  }

  const searchTerm = query.toLowerCase().trim()
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm) ||
      p.description.toLowerCase().includes(searchTerm) ||
      p.category.toLowerCase().includes(searchTerm),
  )
}

