require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');

const products = [
  // Agriculture
  {
    name: 'Fresh Mangoes',
    category: 'Agriculture',
    description: 'Premium quality fresh mangoes, exported worldwide',
    price: 5.99,
    featured: true,
    image: 'https://via.placeholder.com/300x200?text=Fresh+Mangoes'
  },
  {
    name: 'Basmati Rice',
    category: 'Agriculture',
    description: 'Long grain basmati rice, finest quality',
    price: 2.50,
    featured: true,
    image: 'https://via.placeholder.com/300x200?text=Basmati+Rice'
  },
  {
    name: 'Organic Spices',
    category: 'Agriculture',
    description: 'Organic spice collection, direct from farms',
    price: 15.00,
    featured: false,
    image: 'https://via.placeholder.com/300x200?text=Organic+Spices'
  },

  // Automobiles
  {
    name: 'Used Japanese Cars',
    category: 'Automobiles',
    description: 'Premium quality used vehicles from Japan',
    price: 8000.00,
    featured: true,
    image: 'https://via.placeholder.com/300x200?text=Used+Cars'
  },
  {
    name: 'Auto Spare Parts',
    category: 'Automobiles',
    description: 'Original automotive spare parts',
    price: 75.00,
    featured: false,
    image: 'https://via.placeholder.com/300x200?text=Spare+Parts'
  },
  {
    name: 'Heavy Machinery',
    category: 'Automobiles',
    description: 'Heavy construction and agricultural machinery',
    price: 25000.00,
    featured: false,
    image: 'https://via.placeholder.com/300x200?text=Machinery'
  },

  // Textiles
  {
    name: 'Cotton Fabric',
    category: 'Textiles',
    description: 'Premium quality cotton textiles',
    price: 8.50,
    featured: true,
    image: 'https://via.placeholder.com/300x200?text=Cotton+Fabric'
  },
  {
    name: 'Silk Garments',
    category: 'Textiles',
    description: 'Traditional silk clothing',
    price: 45.00,
    featured: false,
    image: 'https://via.placeholder.com/300x200?text=Silk+Garments'
  },
  {
    name: 'Polyester Yarn',
    category: 'Textiles',
    description: 'Industrial polyester yarn',
    price: 12.00,
    featured: false,
    image: 'https://via.placeholder.com/300x200?text=Polyester+Yarn'
  },

  // Industrial
  {
    name: 'Steel Products',
    category: 'Industrial',
    description: 'Industrial grade steel and alloys',
    price: 400.00,
    featured: false,
    image: 'https://via.placeholder.com/300x200?text=Steel+Products'
  },
  {
    name: 'Plastic Pellets',
    category: 'Industrial',
    description: 'Virgin and recycled plastic pellets',
    price: 3.50,
    featured: false,
    image: 'https://via.placeholder.com/300x200?text=Plastic+Pellets'
  },
  {
    name: 'Industrial Equipment',
    category: 'Industrial',
    description: 'Manufacturing and industrial equipment',
    price: 5000.00,
    featured: false,
    image: 'https://via.placeholder.com/300x200?text=Equipment'
  }
];

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    await Product.deleteMany({});
    console.log('Cleared existing products');
    
    // Drop any existing indexes that might conflict
    try {
      await Product.collection.dropIndexes();
    } catch (e) {
      // Index drop errors are okay if indexes don't exist
    }
    
    const result = await Product.insertMany(products);
    console.log(`Seeded ${result.length} products successfully`);
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Error seeding database:', err);
    process.exit(1);
  });
