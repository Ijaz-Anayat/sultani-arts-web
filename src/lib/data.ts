export const navLinks = [
  { href: "/", label: "Home" },
  { href: "#collection", label: "Shop" },
  { href: "#categories", label: "Categories" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
] as const;

export const categories = [
  {
    id: "islamic",
    name: "Islamic Calligraphy",
    pieces: 48,
    image: "/images/islamic.jpg",
  },
  {
    id: "arabic",
    name: "Arabic Calligraphy",
    pieces: 36,
    image: "/images/arabic.jpg",
  },
  {
    id: "modern",
    name: "Modern Calligraphy",
    pieces: 29,
    image: "/images/modern.jpg",
  },
  {
    id: "wall-art",
    name: "Wall Art",
    pieces: 54,
    image: "/images/wall.jpg",
  },
  {
    id: "custom",
    name: "Custom Calligraphy",
    pieces: 18,
    image: "/images/custom.jpg",
  },
  {
    id: "prints",
    name: "Art Prints",
    pieces: 41,
    image: "/images/prints.jpg",
  },
] as const;

export const products = [
  {
    id: "ayat-kursi-gold",
    name: "Ayat al-Kursi — Gold Leaf",
    category: "Islamic Calligraphy",
    price: 240,
    rating: 4.9,
    reviews: 86,
    image: "/images/islamic.jpg",
  },
  {
    id: "bismillah-contemporary",
    name: "Bismillah — Contemporary Panel",
    category: "Modern Calligraphy",
    price: 165,
    rating: 4.8,
    reviews: 54,
    image: "/images/showcase.jpg",
  },
  {
    id: "alfatiha-framed",
    name: "Al-Fatiha — Framed Script",
    category: "Arabic Calligraphy",
    price: 310,
    rating: 5,
    reviews: 41,
    image: "/images/about.jpg",
  },
  {
    id: "geometric-tawhid",
    name: "Tawhid Geometric Study",
    category: "Wall Art",
    price: 195,
    rating: 4.7,
    reviews: 33,
    image: "/images/prints.jpg",
  },
  {
    id: "names-diptych",
    name: "The Beautiful Names — Diptych",
    category: "Islamic Calligraphy",
    price: 420,
    rating: 4.9,
    reviews: 27,
    image: "/images/geometry.jpg",
  },
  {
    id: "naskh-study",
    name: "Midnight Naskh Study",
    category: "Art Prints",
    price: 95,
    rating: 4.6,
    reviews: 62,
    image: "/images/mosque.jpg",
  },
  {
    id: "kufic-floral",
    name: "Floral Kufic Panel",
    category: "Wall Art",
    price: 275,
    rating: 4.8,
    reviews: 19,
    image: "/images/wall.jpg",
  },
  {
    id: "custom-name",
    name: "Commissioned Name Piece",
    category: "Custom Calligraphy",
    price: 185,
    rating: 5,
    reviews: 74,
    image: "/images/kaaba.jpg",
  },
] as const;

export type Product = (typeof products)[number];

export const benefits = [
  {
    title: "Authentic Artwork",
    description:
      "Each composition is crafted by trained calligraphers, honouring classical proportions, rhythm, and meaning.",
  },
  {
    title: "Premium Quality",
    description:
      "Museum-grade inks, gold leaf, archival papers, and carefully chosen frames made to last for generations.",
  },
  {
    title: "Custom Designs",
    description:
      "Commission a verse, a name, or a personal blessing — designed in conversation with you, written by hand.",
  },
  {
    title: "Secure & Reliable Delivery",
    description:
      "Artwork is packed with gallery-level care and shipped worldwide with tracking and full insurance.",
  },
] as const;
