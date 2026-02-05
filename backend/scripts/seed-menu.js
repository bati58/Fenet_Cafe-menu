// backend/scripts/seed-menu.js

require('dotenv').config();
const mongoose = require('mongoose');
const MenuItem = require('../models/MenuItem');

const items = [
  {
    name: 'Chechebsa',
    description: 'Pan-fried flatbread with berbere and spiced butter.',
    category: 'breakfast',
    price: 140,
    imageUrl: '/images/chechebsa.jpg',
  },
  {
    name: 'Ful',
    description: 'Slow-cooked fava beans with herbs and mild spices.',
    category: 'breakfast',
    price: 130,
    imageUrl: '/images/foul.jpg',
  },
  {
    name: 'Injera Firfir',
    description: 'Injera tossed with a mild tomato and spice sauce.',
    category: 'breakfast',
    price: 160,
    imageUrl: '/images/injera_firfir.jpg',
  },
  {
    name: 'Goden Tegab',
    description: 'Injera bites with a spicy berbere sauce.',
    category: 'breakfast',
    price: 170,
    imageUrl: '/images/goden_tegab.jpg',
  },
  {
    name: 'Shiro Sandwich',
    description: 'Creamy chickpea stew served in toasted bread.',
    category: 'lunch_dinner',
    price: 180,
    imageUrl: '/images/shiro_sandwich.jpg',
  },
  {
    name: 'Misir Wot',
    description: 'Red lentil stew with berbere and garlic.',
    category: 'lunch_dinner',
    price: 200,
    imageUrl: '/images/misir_wot.jpg',
  },
  {
    name: 'Atkilt Wot Wrap',
    description: 'Cabbage and potato stew wrapped in fresh injera.',
    category: 'lunch_dinner',
    price: 190,
    imageUrl: '/images/atkilt_wot_wrap.jpg',
  },
  {
    name: 'Timatim Salata',
    description: 'Fresh tomato salad with herbs and lemon.',
    category: 'lunch_dinner',
    price: 120,
    imageUrl: '/images/timatim_salata.jpg',
  },
  {
    name: 'Ambasha Slice',
    description: 'Lightly sweet Ethiopian bread with a soft crumb.',
    category: 'baked_goods',
    price: 90,
    imageUrl: '/images/ambasha_slice.jpg',
  },
  {
    name: 'Cake Slice',
    description: 'Moist cake slice with a gentle vanilla finish.',
    category: 'baked_goods',
    price: 120,
    imageUrl: '/images/cake_slice.jpg',
  },
  {
    name: 'Cookie',
    description: 'Freshly baked cookie with a crisp edge.',
    category: 'baked_goods',
    price: 70,
    imageUrl: '/images/cookie.jpg',
  },
  {
    name: 'Dabo Kolo',
    description: 'Crunchy spiced bites, perfect with coffee.',
    category: 'baked_goods',
    price: 60,
    imageUrl: '/images/dabo_kolo.jpg',
  },
  {
    name: 'Donut',
    description: 'Classic donut with a light sugar finish.',
    category: 'baked_goods',
    price: 85,
    imageUrl: '/images/donut.jpg',
  },
  {
    name: 'Sambusa',
    description: 'Crisp pastry filled with spiced lentils.',
    category: 'baked_goods',
    price: 110,
    imageUrl: '/images/sambusa.jpg',
  },
  {
    name: 'Buna (Traditional Coffee)',
    description: 'Freshly roasted Ethiopian coffee served hot.',
    category: 'drinks',
    price: 80,
    imageUrl: '/images/buna.jpg',
  },
  {
    name: 'Macchiato',
    description: 'Rich espresso with a touch of milk.',
    category: 'drinks',
    price: 90,
    imageUrl: '/images/macchiato.jpg',
  },
  {
    name: 'Lemonade',
    description: 'Bright and refreshing house-made lemonade.',
    category: 'drinks',
    price: 70,
    imageUrl: '/images/lemonade.jpg',
  },
  {
    name: 'Spriss (Layered Juice)',
    description: 'Layered fruit juice served cold and fresh.',
    category: 'drinks',
    price: 95,
    imageUrl: '/images/spriss.jpg',
  },
];

const run = async () => {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI is not set.');
    process.exit(1);
  }

  const shouldWipe = process.argv.includes('--wipe');

  try {
    await mongoose.connect(process.env.MONGO_URI);

    if (shouldWipe) {
      await MenuItem.deleteMany({});
    }

    const ops = items.map((item) => ({
      updateOne: {
        filter: { name: item.name },
        update: { $set: item },
        upsert: true,
      },
    }));

    const result = await MenuItem.bulkWrite(ops);
    console.log(
      `Seeded menu items. Upserted: ${result.upsertedCount || 0}, Modified: ${result.modifiedCount || 0}, Matched: ${result.matchedCount || 0}`
    );
  } catch (err) {
    console.error('Seed failed:', err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

run();
