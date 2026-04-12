require('dotenv').config();
const { MenuItem } = require('./src/models');

const SALAD_BASE = [
  {
    name: 'Kachumber Salad',
    description: 'Classic Indian fresh salad with cucumber, tomato, onion, green chilli and lemon — served with every Indian meal',
    cuisine_type: 'Indian',
    calories_per_serving: 35, protein_g: 1.5, carbs_g: 7.0, fat_g: 0.3, fiber_g: 2.0,
    prep_time_minutes: 5, cook_time_minutes: 0, difficulty: 'easy',
    is_vegetarian: true, is_vegan: true, servings: 1,
  },
  {
    name: 'Mooli Gajar Salad',
    description: 'Seasonal winter salad with grated radish and carrot, dressed with lemon juice, salt and black pepper',
    cuisine_type: 'Indian',
    calories_per_serving: 40, protein_g: 1.2, carbs_g: 8.5, fat_g: 0.2, fiber_g: 2.5,
    prep_time_minutes: 5, cook_time_minutes: 0, difficulty: 'easy',
    is_vegetarian: true, is_vegan: true, servings: 1,
  },
  {
    name: 'Chana Sprout Salad',
    description: 'Protein-rich sprouted chickpea salad with onion, tomato, coriander, lemon and chaat masala',
    cuisine_type: 'Indian',
    calories_per_serving: 80, protein_g: 5.0, carbs_g: 12.0, fat_g: 1.0, fiber_g: 4.0,
    prep_time_minutes: 10, cook_time_minutes: 0, difficulty: 'easy',
    is_vegetarian: true, is_vegan: true, servings: 1,
  },
  {
    name: 'Beetroot Carrot Salad',
    description: 'Vibrant seasonal salad with grated beetroot, carrot, lemon juice and a pinch of chaat masala',
    cuisine_type: 'Indian',
    calories_per_serving: 55, protein_g: 1.5, carbs_g: 11.0, fat_g: 0.3, fiber_g: 3.0,
    prep_time_minutes: 8, cook_time_minutes: 0, difficulty: 'easy',
    is_vegetarian: true, is_vegan: true, servings: 1,
  },
  {
    name: 'Peanut Cucumber Salad',
    description: 'Crunchy salad with roasted peanuts, cucumber, coriander and lemon — popular in Maharashtra and Gujarat',
    cuisine_type: 'Indian',
    calories_per_serving: 115, protein_g: 5.0, carbs_g: 8.0, fat_g: 7.0, fiber_g: 2.0,
    prep_time_minutes: 8, cook_time_minutes: 0, difficulty: 'easy',
    is_vegetarian: true, is_vegan: true, servings: 1,
  },
  {
    name: 'Green Leafy Salad',
    description: 'Light salad with seasonal leafy greens, cucumber, lemon dressing and roasted cumin — refreshing and low-calorie',
    cuisine_type: 'Indian',
    calories_per_serving: 30, protein_g: 2.0, carbs_g: 5.0, fat_g: 0.5, fiber_g: 2.0,
    prep_time_minutes: 5, cook_time_minutes: 0, difficulty: 'easy',
    is_vegetarian: true, is_vegan: true, servings: 1,
  },
  {
    name: 'Onion Tomato Salad',
    description: 'Simple Indian side salad with raw onion, tomato, green chilli and coriander — traditional accompaniment to dal-roti',
    cuisine_type: 'Indian',
    calories_per_serving: 25, protein_g: 1.0, carbs_g: 5.0, fat_g: 0.2, fiber_g: 1.5,
    prep_time_minutes: 3, cook_time_minutes: 0, difficulty: 'easy',
    is_vegetarian: true, is_vegan: true, servings: 1,
  },
  {
    name: 'Mixed Seasonal Salad',
    description: 'Colourful mix of seasonal vegetables — carrot, cucumber, capsicum, tomato — with lemon and chaat masala',
    cuisine_type: 'Indian',
    calories_per_serving: 45, protein_g: 1.8, carbs_g: 9.0, fat_g: 0.4, fiber_g: 2.5,
    prep_time_minutes: 8, cook_time_minutes: 0, difficulty: 'easy',
    is_vegetarian: true, is_vegan: true, servings: 1,
  },
];

async function seed() {
  let created = 0, skipped = 0;
  for (const base of SALAD_BASE) {
    for (const meal_type of ['lunch', 'dinner']) {
      const existing = await MenuItem.findOne({ where: { name: base.name, meal_type } });
      if (existing) {
        console.log(`  ⏭  Already exists: ${base.name} (${meal_type})`);
        skipped++;
      } else {
        await MenuItem.create({ ...base, meal_type, sub_category: 'Salad' });
        console.log(`  ✅ Created: ${base.name} (${meal_type})`);
        created++;
      }
    }
  }
  console.log(`\nDone — ${created} created, ${skipped} skipped.`);
  process.exit(0);
}

seed().catch(err => { console.error('Seed error:', err); process.exit(1); });
