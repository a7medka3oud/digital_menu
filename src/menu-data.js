window.DEFAULT_MENU_DATA = {
  brand: {
    name: "Burger Bite",
    tagline: "Burgers, Broast, Strips & Meals",
    kicker: "Smart Digital Menu",
    headline: "Your Meal is Ready to Choose",
    description: "Hot selections, flexible pricing, and a customizable brand identity for every branch.",
    location: "Main Branch",
    phone: "0100 000 0000",
    logo: "assets/logo.png",
    heroImage: "assets/menu-hero.png"
  },
  theme: {
    primary: "#181512",
    accent: "#c93422",
    gold: "#f2aa25",
    background: "#fff8ed",
    surface: "#ffffff",
    ink: "#201b18",
    muted: "#746a60"
  },
  settings: {
    currency: "EGP",
    taxRate: 14,
    averagePrepPerItem: 3,
    minimumPrep: 12
  },
  categories: [
    { id: "burgers", name: "Burgers", shortName: "Burger", accent: "#c93422" },
    { id: "broast", name: "Broast", shortName: "Broast", accent: "#f2aa25" },
    { id: "strips", name: "Strips", shortName: "Strips", accent: "#236449" },
    { id: "meals", name: "Meals", shortName: "Meals", accent: "#313a56" },
    { id: "sides", name: "Sides & Drinks", shortName: "Sides", accent: "#8b4b2d" }
  ],
  items: [
    {
      id: "classic-burger",
      categoryId: "burgers",
      name: "Classic Cheeseburger",
      description: "Grilled beef patty, cheddar cheese, lettuce, tomato, and Crown sauce.",
      price: 145,
      available: true,
      popular: true,
      photoPosition: "8% 72%"
    },
    {
      id: "double-smash",
      categoryId: "burgers",
      name: "Double Smash Burger",
      description: "Two smashed beef patties, double cheddar, pickles, and smoked sauce.",
      price: 195,
      available: true,
      popular: true,
      photoPosition: "12% 68%"
    },
    {
      id: "spicy-chicken-burger",
      categoryId: "burgers",
      name: "Spicy Chicken Burger",
      description: "Crispy chicken breast, spicy sauce, fresh lettuce, and brioche bun.",
      price: 155,
      available: true,
      popular: false,
      photoPosition: "64% 74%"
    },
    {
      id: "broast-4",
      categoryId: "broast",
      name: "4-Piece Broast",
      description: "Golden broasted chicken served with fries, garlic sauce, bread, and dipping sauce.",
      price: 210,
      available: true,
      popular: true,
      photoPosition: "47% 55%"
    },
    {
      id: "broast-8",
      categoryId: "broast",
      name: "8-Piece Family Broast",
      description: "Family meal with large fries, garlic sauce, and assorted dipping sauces.",
      price: 390,
      available: true,
      popular: false,
      photoPosition: "52% 52%"
    },
    {
      id: "strips-5",
      categoryId: "strips",
      name: "5-Piece Chicken Strips",
      description: "Crispy chicken strips served with fries and honey mustard sauce.",
      price: 165,
      available: true,
      popular: true,
      photoPosition: "71% 82%"
    },
    {
      id: "strips-9",
      categoryId: "strips",
      name: "9-Piece Chicken Strips",
      description: "Perfect for sharing with two dipping sauces and fries.",
      price: 255,
      available: true,
      popular: false,
      photoPosition: "77% 84%"
    },
    {
      id: "crown-combo",
      categoryId: "meals",
      name: "Crown Combo Meal",
      description: "Classic burger, two chicken strips, fries, and a soft drink.",
      price: 260,
      available: true,
      popular: true,
      photoPosition: "42% 72%"
    },
    {
      id: "family-box",
      categoryId: "meals",
      name: "Family Box",
      description: "Broast, chicken strips, family-size fries, bread, and four dipping sauces.",
      price: 520,
      available: true,
      popular: false,
      photoPosition: "62% 68%"
    },
    {
      id: "fries",
      categoryId: "sides",
      name: "Crispy Fries",
      description: "Golden crispy fries served with your choice of dipping sauce.",
      price: 65,
      available: true,
      popular: false,
      photoPosition: "83% 58%"
    },
    {
      id: "sauces",
      categoryId: "sides",
      name: "Extra Sauces",
      description: "BBQ, Ranch, Garlic, Spicy Ketchup, or Honey Mustard.",
      price: 20,
      available: true,
      popular: false,
      photoPosition: "38% 84%"
    },
    {
      id: "soft-drink",
      categoryId: "sides",
      name: "Soft Drink",
      description: "Chilled canned soft drink (subject to availability).",
      price: 35,
      available: true,
      popular: false,
      photoPosition: "8% 26%"
    }
  ]
};