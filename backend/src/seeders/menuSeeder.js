const { MenuItem, Ingredient } = require('../models');

const menuData = [
  // BREAKFAST ITEMS
  {
    meal_type: 'breakfast', name: 'Poha', cuisine_type: 'Indian',
    description: 'Flattened rice cooked with mustard seeds, onions, peas and turmeric',
    prep_time_minutes: 10, cook_time_minutes: 15, servings: 4,
    calories_per_serving: 350, protein_g: 8, carbs_g: 60, fat_g: 8, fiber_g: 4,
    kitchen_equipment: 'kadai,spatula,bowl', difficulty: 'easy',
    is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Poha (flattened rice)', quantity: '2', unit: 'cups', calories: 350 },
      { name: 'Onion', quantity: '1', unit: 'large', calories: 40 },
      { name: 'Green peas', quantity: '0.5', unit: 'cup', calories: 60 },
      { name: 'Mustard seeds', quantity: '1', unit: 'tsp', calories: 5 },
      { name: 'Turmeric', quantity: '0.5', unit: 'tsp', calories: 2 },
      { name: 'Oil', quantity: '2', unit: 'tbsp', calories: 240 },
      { name: 'Curry leaves', quantity: '8', unit: 'leaves', calories: 2 },
      { name: 'Lemon juice', quantity: '1', unit: 'tbsp', calories: 4 }
    ]
  },
  {
    meal_type: 'breakfast', name: 'Upma', cuisine_type: 'South Indian',
    description: 'Semolina porridge cooked with vegetables and tempered with mustard seeds',
    prep_time_minutes: 5, cook_time_minutes: 20, servings: 4,
    calories_per_serving: 320, protein_g: 9, carbs_g: 55, fat_g: 7, fiber_g: 3,
    kitchen_equipment: 'kadai,spatula', difficulty: 'easy',
    is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Semolina (rava)', quantity: '1.5', unit: 'cups', calories: 420 },
      { name: 'Mixed vegetables', quantity: '1', unit: 'cup', calories: 80 },
      { name: 'Onion', quantity: '1', unit: 'medium', calories: 30 },
      { name: 'Mustard seeds', quantity: '1', unit: 'tsp', calories: 5 },
      { name: 'Ghee', quantity: '1', unit: 'tbsp', calories: 120 },
      { name: 'Green chillies', quantity: '2', unit: 'pieces', calories: 4 }
    ]
  },
  {
    meal_type: 'breakfast', name: 'Idli Sambar', cuisine_type: 'South Indian',
    description: 'Steamed rice cakes served with lentil vegetable stew and coconut chutney',
    prep_time_minutes: 480, cook_time_minutes: 20, servings: 4,
    calories_per_serving: 380, protein_g: 12, carbs_g: 65, fat_g: 6, fiber_g: 5,
    kitchen_equipment: 'idli_mould,pressure_cooker,kadai', difficulty: 'medium',
    is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Idli batter', quantity: '3', unit: 'cups', calories: 480 },
      { name: 'Toor dal', quantity: '0.5', unit: 'cup', calories: 180 },
      { name: 'Mixed vegetables', quantity: '1', unit: 'cup', calories: 80 },
      { name: 'Sambar powder', quantity: '2', unit: 'tsp', calories: 15 },
      { name: 'Tamarind', quantity: '1', unit: 'small ball', calories: 20 }
    ]
  },
  {
    meal_type: 'breakfast', name: 'Aloo Paratha', cuisine_type: 'North Indian',
    description: 'Whole wheat flatbread stuffed with spiced mashed potatoes, served with curd',
    prep_time_minutes: 20, cook_time_minutes: 20, servings: 4,
    calories_per_serving: 480, protein_g: 10, carbs_g: 72, fat_g: 16, fiber_g: 5,
    kitchen_equipment: 'tawa,rolling_pin,bowl', difficulty: 'medium',
    is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Whole wheat flour', quantity: '2', unit: 'cups', calories: 450 },
      { name: 'Potato', quantity: '3', unit: 'medium', calories: 300 },
      { name: 'Ghee', quantity: '2', unit: 'tbsp', calories: 240 },
      { name: 'Green chillies', quantity: '2', unit: 'pieces', calories: 4 },
      { name: 'Coriander leaves', quantity: '2', unit: 'tbsp', calories: 5 },
      { name: 'Curd', quantity: '0.5', unit: 'cup', calories: 60 }
    ]
  },
  {
    meal_type: 'breakfast', name: 'Oatmeal with Fruits', cuisine_type: 'International',
    description: 'Rolled oats cooked with milk, topped with seasonal fruits and honey',
    prep_time_minutes: 5, cook_time_minutes: 10, servings: 2,
    calories_per_serving: 340, protein_g: 12, carbs_g: 58, fat_g: 7, fiber_g: 6,
    kitchen_equipment: 'saucepan,bowl', difficulty: 'easy',
    is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Rolled oats', quantity: '1', unit: 'cup', calories: 300 },
      { name: 'Milk', quantity: '1.5', unit: 'cups', calories: 180 },
      { name: 'Banana', quantity: '1', unit: 'medium', calories: 100 },
      { name: 'Honey', quantity: '1', unit: 'tbsp', calories: 60 },
      { name: 'Mixed fruits', quantity: '0.5', unit: 'cup', calories: 80 }
    ]
  },
  {
    meal_type: 'breakfast', name: 'Vegetable Sandwich', cuisine_type: 'International',
    description: 'Toasted whole wheat bread with fresh vegetables, cheese and green chutney',
    prep_time_minutes: 10, cook_time_minutes: 5, servings: 2,
    calories_per_serving: 310, protein_g: 11, carbs_g: 45, fat_g: 10, fiber_g: 4,
    kitchen_equipment: 'toaster,knife,plate', difficulty: 'easy',
    is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Whole wheat bread', quantity: '4', unit: 'slices', calories: 280 },
      { name: 'Cucumber', quantity: '1', unit: 'medium', calories: 20 },
      { name: 'Tomato', quantity: '1', unit: 'medium', calories: 25 },
      { name: 'Cheese slice', quantity: '2', unit: 'slices', calories: 140 },
      { name: 'Green chutney', quantity: '2', unit: 'tbsp', calories: 30 }
    ]
  },
  {
    meal_type: 'breakfast', name: 'Dalia (Broken Wheat Porridge)', cuisine_type: 'North Indian',
    description: 'Nutritious broken wheat cooked with vegetables and mild spices',
    prep_time_minutes: 5, cook_time_minutes: 20, servings: 4,
    calories_per_serving: 290, protein_g: 10, carbs_g: 52, fat_g: 5, fiber_g: 7,
    kitchen_equipment: 'pressure_cooker,kadai', difficulty: 'easy',
    is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Broken wheat (dalia)', quantity: '1', unit: 'cup', calories: 340 },
      { name: 'Mixed vegetables', quantity: '1', unit: 'cup', calories: 80 },
      { name: 'Ghee', quantity: '1', unit: 'tbsp', calories: 120 },
      { name: 'Cumin seeds', quantity: '1', unit: 'tsp', calories: 8 }
    ]
  },
  {
    meal_type: 'breakfast', name: 'Besan Chilla', cuisine_type: 'North Indian',
    description: 'Savory chickpea flour pancake with vegetables, high in protein',
    prep_time_minutes: 10, cook_time_minutes: 15, servings: 4,
    calories_per_serving: 260, protein_g: 14, carbs_g: 35, fat_g: 7, fiber_g: 5,
    kitchen_equipment: 'tawa,ladle,bowl', difficulty: 'easy',
    is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Chickpea flour (besan)', quantity: '2', unit: 'cups', calories: 400 },
      { name: 'Onion', quantity: '1', unit: 'medium', calories: 30 },
      { name: 'Tomato', quantity: '1', unit: 'medium', calories: 25 },
      { name: 'Spinach', quantity: '0.5', unit: 'cup', calories: 15 },
      { name: 'Oil', quantity: '2', unit: 'tbsp', calories: 240 }
    ]
  },
  {
    meal_type: 'breakfast', name: 'Fruit Bowl', cuisine_type: 'International',
    description: 'Mixed seasonal fruits with chaat masala and mint, light and refreshing',
    prep_time_minutes: 10, cook_time_minutes: 0, servings: 2,
    calories_per_serving: 200, protein_g: 3, carbs_g: 48, fat_g: 1, fiber_g: 6,
    kitchen_equipment: 'knife,bowl', difficulty: 'easy',
    is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Apple', quantity: '1', unit: 'medium', calories: 80 },
      { name: 'Banana', quantity: '1', unit: 'medium', calories: 100 },
      { name: 'Orange', quantity: '1', unit: 'medium', calories: 60 },
      { name: 'Papaya', quantity: '0.5', unit: 'cup', calories: 40 },
      { name: 'Chaat masala', quantity: '0.5', unit: 'tsp', calories: 3 }
    ]
  },
  {
    meal_type: 'breakfast', name: 'Egg Toast', cuisine_type: 'International',
    description: 'Whole wheat toast topped with scrambled eggs, bell peppers and herbs',
    prep_time_minutes: 5, cook_time_minutes: 10, servings: 2,
    calories_per_serving: 360, protein_g: 18, carbs_g: 32, fat_g: 16, fiber_g: 3,
    kitchen_equipment: 'pan,toaster,spatula', difficulty: 'easy',
    is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Eggs', quantity: '4', unit: 'pieces', calories: 280 },
      { name: 'Whole wheat bread', quantity: '4', unit: 'slices', calories: 280 },
      { name: 'Bell pepper', quantity: '0.5', unit: 'cup', calories: 20 },
      { name: 'Butter', quantity: '1', unit: 'tbsp', calories: 100 }
    ]
  },
  {
    meal_type: 'breakfast', name: 'Moong Dal Chilla', cuisine_type: 'North Indian',
    description: 'Green moong lentil pancakes, protein-rich and easy to digest',
    prep_time_minutes: 240, cook_time_minutes: 15, servings: 4,
    calories_per_serving: 240, protein_g: 15, carbs_g: 38, fat_g: 4, fiber_g: 6,
    kitchen_equipment: 'tawa,ladle,blender', difficulty: 'medium',
    is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Moong dal (soaked)', quantity: '1.5', unit: 'cups', calories: 360 },
      { name: 'Onion', quantity: '1', unit: 'medium', calories: 30 },
      { name: 'Green chillies', quantity: '2', unit: 'pieces', calories: 4 },
      { name: 'Ginger', quantity: '0.5', unit: 'inch', calories: 3 },
      { name: 'Oil', quantity: '1', unit: 'tbsp', calories: 120 }
    ]
  },
  {
    meal_type: 'breakfast', name: 'Masala Dosa', cuisine_type: 'South Indian',
    description: 'Crispy rice and lentil crepe filled with spiced potato mixture',
    prep_time_minutes: 480, cook_time_minutes: 25, servings: 4,
    calories_per_serving: 420, protein_g: 9, carbs_g: 68, fat_g: 12, fiber_g: 4,
    kitchen_equipment: 'tawa,ladle,pressure_cooker', difficulty: 'hard',
    is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Dosa batter', quantity: '3', unit: 'cups', calories: 480 },
      { name: 'Potato', quantity: '3', unit: 'medium', calories: 300 },
      { name: 'Onion', quantity: '2', unit: 'medium', calories: 60 },
      { name: 'Mustard seeds', quantity: '1', unit: 'tsp', calories: 5 },
      { name: 'Oil', quantity: '3', unit: 'tbsp', calories: 360 }
    ]
  },

  // LUNCH ITEMS
  {
    meal_type: 'lunch', name: 'Dal Rice', cuisine_type: 'North Indian',
    description: 'Comforting yellow lentil dal served with steamed basmati rice',
    prep_time_minutes: 10, cook_time_minutes: 30, servings: 4,
    calories_per_serving: 520, protein_g: 18, carbs_g: 90, fat_g: 8, fiber_g: 8,
    kitchen_equipment: 'pressure_cooker,kadai', difficulty: 'easy',
    is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Toor dal', quantity: '1', unit: 'cup', calories: 360 },
      { name: 'Basmati rice', quantity: '1.5', unit: 'cups', calories: 480 },
      { name: 'Tomato', quantity: '2', unit: 'medium', calories: 50 },
      { name: 'Onion', quantity: '1', unit: 'medium', calories: 30 },
      { name: 'Ghee', quantity: '2', unit: 'tbsp', calories: 240 },
      { name: 'Spices (cumin, turmeric, coriander)', quantity: '1', unit: 'set', calories: 20 }
    ]
  },
  {
    meal_type: 'lunch', name: 'Rajma Chawal', cuisine_type: 'North Indian',
    description: 'Kidney beans in rich tomato-onion gravy served with steamed rice',
    prep_time_minutes: 480, cook_time_minutes: 45, servings: 4,
    calories_per_serving: 580, protein_g: 22, carbs_g: 95, fat_g: 10, fiber_g: 12,
    kitchen_equipment: 'pressure_cooker,kadai', difficulty: 'medium',
    is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Rajma (kidney beans)', quantity: '1', unit: 'cup', calories: 340 },
      { name: 'Basmati rice', quantity: '1.5', unit: 'cups', calories: 480 },
      { name: 'Tomatoes', quantity: '3', unit: 'medium', calories: 75 },
      { name: 'Onion', quantity: '2', unit: 'medium', calories: 60 },
      { name: 'Oil', quantity: '2', unit: 'tbsp', calories: 240 }
    ]
  },
  {
    meal_type: 'lunch', name: 'Chole Bhature', cuisine_type: 'Punjabi',
    description: 'Spiced chickpea curry with deep-fried leavened bread, a Punjabi classic',
    prep_time_minutes: 480, cook_time_minutes: 40, servings: 4,
    calories_per_serving: 680, protein_g: 20, carbs_g: 100, fat_g: 22, fiber_g: 10,
    kitchen_equipment: 'pressure_cooker,kadai,deep_fry_pan', difficulty: 'medium',
    is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Chickpeas (chole)', quantity: '1.5', unit: 'cups', calories: 500 },
      { name: 'All-purpose flour', quantity: '2', unit: 'cups', calories: 440 },
      { name: 'Curd', quantity: '0.5', unit: 'cup', calories: 60 },
      { name: 'Oil for frying', quantity: '4', unit: 'tbsp', calories: 480 }
    ]
  },
  {
    meal_type: 'lunch', name: 'Vegetable Pulao', cuisine_type: 'North Indian',
    description: 'Fragrant basmati rice cooked with mixed vegetables and whole spices',
    prep_time_minutes: 15, cook_time_minutes: 25, servings: 4,
    calories_per_serving: 490, protein_g: 10, carbs_g: 85, fat_g: 12, fiber_g: 5,
    kitchen_equipment: 'pressure_cooker,kadai', difficulty: 'easy',
    is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Basmati rice', quantity: '1.5', unit: 'cups', calories: 480 },
      { name: 'Mixed vegetables', quantity: '2', unit: 'cups', calories: 160 },
      { name: 'Ghee', quantity: '2', unit: 'tbsp', calories: 240 },
      { name: 'Whole spices (bay leaf, cardamom, cloves)', quantity: '1', unit: 'set', calories: 10 }
    ]
  },
  {
    meal_type: 'lunch', name: 'Paneer Sabzi with Roti', cuisine_type: 'North Indian',
    description: 'Fresh cottage cheese cooked in spiced tomato-onion gravy with whole wheat rotis',
    prep_time_minutes: 15, cook_time_minutes: 30, servings: 4,
    calories_per_serving: 560, protein_g: 24, carbs_g: 60, fat_g: 22, fiber_g: 4,
    kitchen_equipment: 'kadai,tawa,rolling_pin', difficulty: 'medium',
    is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Paneer', quantity: '300', unit: 'grams', calories: 480 },
      { name: 'Whole wheat flour', quantity: '2', unit: 'cups', calories: 450 },
      { name: 'Tomatoes', quantity: '3', unit: 'medium', calories: 75 },
      { name: 'Onion', quantity: '2', unit: 'medium', calories: 60 },
      { name: 'Oil', quantity: '2', unit: 'tbsp', calories: 240 }
    ]
  },
  {
    meal_type: 'lunch', name: 'Mixed Veg Thali', cuisine_type: 'Indian',
    description: 'Complete Indian thali with dal, two sabzis, rice, roti, salad and papad',
    prep_time_minutes: 20, cook_time_minutes: 45, servings: 4,
    calories_per_serving: 650, protein_g: 20, carbs_g: 105, fat_g: 15, fiber_g: 10,
    kitchen_equipment: 'pressure_cooker,kadai,tawa', difficulty: 'hard',
    is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Dal (mixed lentils)', quantity: '0.5', unit: 'cup', calories: 180 },
      { name: 'Seasonal vegetables', quantity: '2', unit: 'cups', calories: 160 },
      { name: 'Rice', quantity: '0.5', unit: 'cup', calories: 160 },
      { name: 'Whole wheat flour', quantity: '0.5', unit: 'cup', calories: 112 }
    ]
  },
  {
    meal_type: 'lunch', name: 'Khichdi', cuisine_type: 'Indian',
    description: 'One-pot rice and lentil dish, the ultimate comfort food and easy to digest',
    prep_time_minutes: 10, cook_time_minutes: 25, servings: 4,
    calories_per_serving: 460, protein_g: 16, carbs_g: 80, fat_g: 8, fiber_g: 7,
    kitchen_equipment: 'pressure_cooker,kadai', difficulty: 'easy',
    is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Rice', quantity: '1', unit: 'cup', calories: 320 },
      { name: 'Moong dal', quantity: '0.5', unit: 'cup', calories: 180 },
      { name: 'Mixed vegetables', quantity: '1', unit: 'cup', calories: 80 },
      { name: 'Ghee', quantity: '1', unit: 'tbsp', calories: 120 },
      { name: 'Turmeric', quantity: '0.5', unit: 'tsp', calories: 2 }
    ]
  },
  {
    meal_type: 'lunch', name: 'Palak Dal with Rice', cuisine_type: 'North Indian',
    description: 'Protein-rich lentils cooked with fresh spinach, served with steamed rice',
    prep_time_minutes: 10, cook_time_minutes: 30, servings: 4,
    calories_per_serving: 500, protein_g: 20, carbs_g: 85, fat_g: 7, fiber_g: 9,
    kitchen_equipment: 'pressure_cooker,kadai', difficulty: 'easy',
    is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Toor dal', quantity: '0.75', unit: 'cup', calories: 270 },
      { name: 'Spinach (palak)', quantity: '2', unit: 'cups', calories: 50 },
      { name: 'Rice', quantity: '1.5', unit: 'cups', calories: 480 },
      { name: 'Ghee', quantity: '1', unit: 'tbsp', calories: 120 }
    ]
  },
  {
    meal_type: 'lunch', name: 'Aloo Gobi with Roti', cuisine_type: 'North Indian',
    description: 'Potato and cauliflower cooked with cumin and spices, served with whole wheat roti',
    prep_time_minutes: 15, cook_time_minutes: 25, servings: 4,
    calories_per_serving: 480, protein_g: 11, carbs_g: 78, fat_g: 12, fiber_g: 7,
    kitchen_equipment: 'kadai,tawa,rolling_pin', difficulty: 'easy',
    is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Potato', quantity: '3', unit: 'medium', calories: 300 },
      { name: 'Cauliflower', quantity: '1', unit: 'small head', calories: 100 },
      { name: 'Whole wheat flour', quantity: '2', unit: 'cups', calories: 450 },
      { name: 'Oil', quantity: '2', unit: 'tbsp', calories: 240 }
    ]
  },
  {
    meal_type: 'lunch', name: 'Sambar Rice', cuisine_type: 'South Indian',
    description: 'Rice mixed with tangy tamarind sambar, tempered with mustard seeds',
    prep_time_minutes: 10, cook_time_minutes: 35, servings: 4,
    calories_per_serving: 510, protein_g: 14, carbs_g: 90, fat_g: 8, fiber_g: 8,
    kitchen_equipment: 'pressure_cooker,kadai', difficulty: 'medium',
    is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Rice', quantity: '1.5', unit: 'cups', calories: 480 },
      { name: 'Toor dal', quantity: '0.5', unit: 'cup', calories: 180 },
      { name: 'Vegetables (drumstick, brinjal)', quantity: '1', unit: 'cup', calories: 80 },
      { name: 'Tamarind', quantity: '1', unit: 'small ball', calories: 20 },
      { name: 'Sambar powder', quantity: '2', unit: 'tsp', calories: 15 }
    ]
  },
  {
    meal_type: 'lunch', name: 'Vegetable Biryani', cuisine_type: 'Mughal',
    description: 'Aromatic basmati rice cooked with vegetables and whole spices in dum style',
    prep_time_minutes: 20, cook_time_minutes: 45, servings: 4,
    calories_per_serving: 580, protein_g: 12, carbs_g: 98, fat_g: 14, fiber_g: 5,
    kitchen_equipment: 'heavy_pot,kadai', difficulty: 'hard',
    is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Basmati rice', quantity: '2', unit: 'cups', calories: 640 },
      { name: 'Mixed vegetables', quantity: '2', unit: 'cups', calories: 160 },
      { name: 'Saffron', quantity: '0.25', unit: 'tsp', calories: 1 },
      { name: 'Whole spices', quantity: '1', unit: 'set', calories: 15 },
      { name: 'Ghee', quantity: '3', unit: 'tbsp', calories: 360 }
    ]
  },
  {
    meal_type: 'lunch', name: 'Dahi Rice', cuisine_type: 'South Indian',
    description: 'Cooled rice mixed with curd and tempered with mustard seeds and curry leaves',
    prep_time_minutes: 10, cook_time_minutes: 20, servings: 4,
    calories_per_serving: 430, protein_g: 12, carbs_g: 75, fat_g: 8, fiber_g: 2,
    kitchen_equipment: 'pressure_cooker,kadai', difficulty: 'easy',
    is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Rice', quantity: '1.5', unit: 'cups', calories: 480 },
      { name: 'Curd', quantity: '1', unit: 'cup', calories: 120 },
      { name: 'Mustard seeds', quantity: '1', unit: 'tsp', calories: 5 },
      { name: 'Curry leaves', quantity: '10', unit: 'leaves', calories: 3 },
      { name: 'Oil', quantity: '1', unit: 'tbsp', calories: 120 }
    ]
  },

  // DINNER ITEMS
  {
    meal_type: 'dinner', name: 'Roti with Mixed Sabzi', cuisine_type: 'North Indian',
    description: 'Soft whole wheat rotis with seasonal vegetable curry, a balanced dinner',
    prep_time_minutes: 15, cook_time_minutes: 25, servings: 4,
    calories_per_serving: 420, protein_g: 12, carbs_g: 68, fat_g: 10, fiber_g: 6,
    kitchen_equipment: 'tawa,kadai,rolling_pin', difficulty: 'easy',
    is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Whole wheat flour', quantity: '2', unit: 'cups', calories: 450 },
      { name: 'Seasonal vegetables', quantity: '2', unit: 'cups', calories: 160 },
      { name: 'Oil', quantity: '2', unit: 'tbsp', calories: 240 },
      { name: 'Spices', quantity: '1', unit: 'set', calories: 15 }
    ]
  },
  {
    meal_type: 'dinner', name: 'Paneer Butter Masala with Roti', cuisine_type: 'North Indian',
    description: 'Creamy tomato-based paneer gravy with butter rotis, a family favourite',
    prep_time_minutes: 15, cook_time_minutes: 30, servings: 4,
    calories_per_serving: 560, protein_g: 22, carbs_g: 55, fat_g: 26, fiber_g: 4,
    kitchen_equipment: 'kadai,tawa,blender', difficulty: 'medium',
    is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Paneer', quantity: '300', unit: 'grams', calories: 480 },
      { name: 'Tomatoes', quantity: '4', unit: 'medium', calories: 100 },
      { name: 'Butter', quantity: '2', unit: 'tbsp', calories: 200 },
      { name: 'Cream', quantity: '3', unit: 'tbsp', calories: 150 },
      { name: 'Whole wheat flour', quantity: '2', unit: 'cups', calories: 450 }
    ]
  },
  {
    meal_type: 'dinner', name: 'Tomato Soup with Bread', cuisine_type: 'International',
    description: 'Fresh tomato soup with herbs, served with toasted whole grain bread',
    prep_time_minutes: 10, cook_time_minutes: 25, servings: 4,
    calories_per_serving: 290, protein_g: 8, carbs_g: 45, fat_g: 8, fiber_g: 5,
    kitchen_equipment: 'saucepan,blender', difficulty: 'easy',
    is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Tomatoes', quantity: '6', unit: 'medium', calories: 150 },
      { name: 'Onion', quantity: '1', unit: 'medium', calories: 30 },
      { name: 'Cream', quantity: '2', unit: 'tbsp', calories: 100 },
      { name: 'Whole grain bread', quantity: '4', unit: 'slices', calories: 280 },
      { name: 'Butter', quantity: '1', unit: 'tbsp', calories: 100 }
    ]
  },
  {
    meal_type: 'dinner', name: 'Moong Dal Khichdi', cuisine_type: 'Indian',
    description: 'Light and digestible moong dal khichdi, ideal for a healthy dinner',
    prep_time_minutes: 10, cook_time_minutes: 25, servings: 4,
    calories_per_serving: 400, protein_g: 18, carbs_g: 68, fat_g: 6, fiber_g: 8,
    kitchen_equipment: 'pressure_cooker,kadai', difficulty: 'easy',
    is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Rice', quantity: '0.75', unit: 'cup', calories: 240 },
      { name: 'Moong dal', quantity: '0.75', unit: 'cup', calories: 270 },
      { name: 'Ghee', quantity: '1', unit: 'tbsp', calories: 120 },
      { name: 'Turmeric', quantity: '0.5', unit: 'tsp', calories: 2 },
      { name: 'Ginger', quantity: '0.5', unit: 'inch', calories: 3 }
    ]
  },
  {
    meal_type: 'dinner', name: 'Dal Tadka with Jeera Rice', cuisine_type: 'North Indian',
    description: 'Yellow dal tempered with cumin and red chillies, served with cumin-flavored rice',
    prep_time_minutes: 10, cook_time_minutes: 30, servings: 4,
    calories_per_serving: 510, protein_g: 18, carbs_g: 88, fat_g: 9, fiber_g: 8,
    kitchen_equipment: 'pressure_cooker,kadai', difficulty: 'easy',
    is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Chana dal', quantity: '0.75', unit: 'cup', calories: 270 },
      { name: 'Basmati rice', quantity: '1.5', unit: 'cups', calories: 480 },
      { name: 'Ghee', quantity: '2', unit: 'tbsp', calories: 240 },
      { name: 'Cumin seeds', quantity: '2', unit: 'tsp', calories: 16 }
    ]
  },
  {
    meal_type: 'dinner', name: 'Vegetable Curry with Rice', cuisine_type: 'Indian',
    description: 'Mixed vegetable curry in coconut milk gravy, served with steamed rice',
    prep_time_minutes: 15, cook_time_minutes: 30, servings: 4,
    calories_per_serving: 480, protein_g: 10, carbs_g: 80, fat_g: 12, fiber_g: 6,
    kitchen_equipment: 'kadai,pressure_cooker', difficulty: 'medium',
    is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Mixed vegetables', quantity: '3', unit: 'cups', calories: 240 },
      { name: 'Coconut milk', quantity: '0.5', unit: 'cup', calories: 120 },
      { name: 'Rice', quantity: '1.5', unit: 'cups', calories: 480 },
      { name: 'Oil', quantity: '2', unit: 'tbsp', calories: 240 }
    ]
  },
  {
    meal_type: 'dinner', name: 'Palak Paneer with Roti', cuisine_type: 'North Indian',
    description: 'Iron-rich spinach gravy with soft paneer cubes, served with whole wheat rotis',
    prep_time_minutes: 15, cook_time_minutes: 25, servings: 4,
    calories_per_serving: 500, protein_g: 24, carbs_g: 52, fat_g: 20, fiber_g: 6,
    kitchen_equipment: 'kadai,tawa,blender', difficulty: 'medium',
    is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Spinach (palak)', quantity: '4', unit: 'cups', calories: 100 },
      { name: 'Paneer', quantity: '250', unit: 'grams', calories: 400 },
      { name: 'Whole wheat flour', quantity: '2', unit: 'cups', calories: 450 },
      { name: 'Cream', quantity: '2', unit: 'tbsp', calories: 100 },
      { name: 'Oil', quantity: '2', unit: 'tbsp', calories: 240 }
    ]
  },
  {
    meal_type: 'dinner', name: 'Mixed Dal with Roti', cuisine_type: 'North Indian',
    description: 'Five-lentil dal cooked with tomatoes and tempered, served with fresh rotis',
    prep_time_minutes: 10, cook_time_minutes: 35, servings: 4,
    calories_per_serving: 450, protein_g: 20, carbs_g: 72, fat_g: 8, fiber_g: 10,
    kitchen_equipment: 'pressure_cooker,kadai,tawa', difficulty: 'medium',
    is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Mixed lentils (panchratna dal)', quantity: '1', unit: 'cup', calories: 360 },
      { name: 'Whole wheat flour', quantity: '2', unit: 'cups', calories: 450 },
      { name: 'Tomatoes', quantity: '2', unit: 'medium', calories: 50 },
      { name: 'Oil', quantity: '1', unit: 'tbsp', calories: 120 }
    ]
  },
  {
    meal_type: 'dinner', name: 'Vegetable Soup with Salad', cuisine_type: 'International',
    description: 'Clear vegetable soup with fresh seasonal salad, a light and healthy dinner',
    prep_time_minutes: 15, cook_time_minutes: 20, servings: 4,
    calories_per_serving: 220, protein_g: 6, carbs_g: 38, fat_g: 5, fiber_g: 7,
    kitchen_equipment: 'saucepan,bowl', difficulty: 'easy',
    is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Mixed vegetables', quantity: '3', unit: 'cups', calories: 240 },
      { name: 'Salad greens', quantity: '2', unit: 'cups', calories: 30 },
      { name: 'Olive oil', quantity: '1', unit: 'tbsp', calories: 120 },
      { name: 'Lemon', quantity: '1', unit: 'piece', calories: 15 }
    ]
  },
  {
    meal_type: 'dinner', name: 'Methi Thepla with Raita', cuisine_type: 'Gujarati',
    description: 'Fenugreek flatbreads with whole wheat and besan, served with cucumber raita',
    prep_time_minutes: 15, cook_time_minutes: 20, servings: 4,
    calories_per_serving: 390, protein_g: 14, carbs_g: 60, fat_g: 10, fiber_g: 5,
    kitchen_equipment: 'tawa,rolling_pin,bowl', difficulty: 'medium',
    is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Whole wheat flour', quantity: '1.5', unit: 'cups', calories: 338 },
      { name: 'Fresh methi (fenugreek)', quantity: '1', unit: 'cup', calories: 30 },
      { name: 'Chickpea flour', quantity: '0.5', unit: 'cup', calories: 200 },
      { name: 'Curd', quantity: '0.5', unit: 'cup', calories: 60 },
      { name: 'Oil', quantity: '2', unit: 'tbsp', calories: 240 }
    ]
  },
  {
    meal_type: 'dinner', name: 'Tomato Rice', cuisine_type: 'South Indian',
    description: 'Tangy rice cooked with tomatoes, mustard seeds and curry leaves',
    prep_time_minutes: 10, cook_time_minutes: 25, servings: 4,
    calories_per_serving: 440, protein_g: 8, carbs_g: 80, fat_g: 10, fiber_g: 3,
    kitchen_equipment: 'pressure_cooker,kadai', difficulty: 'easy',
    is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Rice', quantity: '1.5', unit: 'cups', calories: 480 },
      { name: 'Tomatoes', quantity: '4', unit: 'medium', calories: 100 },
      { name: 'Oil', quantity: '2', unit: 'tbsp', calories: 240 },
      { name: 'Mustard seeds', quantity: '1', unit: 'tsp', calories: 5 }
    ]
  },
  {
    meal_type: 'dinner', name: 'Baingan Bharta with Roti', cuisine_type: 'North Indian',
    description: 'Smoky roasted eggplant mash with onions and tomatoes, served with rotis',
    prep_time_minutes: 10, cook_time_minutes: 30, servings: 4,
    calories_per_serving: 380, protein_g: 9, carbs_g: 62, fat_g: 10, fiber_g: 8,
    kitchen_equipment: 'gas_burner,kadai,tawa', difficulty: 'medium',
    is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Brinjal/Eggplant', quantity: '2', unit: 'large', calories: 80 },
      { name: 'Whole wheat flour', quantity: '2', unit: 'cups', calories: 450 },
      { name: 'Onion', quantity: '2', unit: 'medium', calories: 60 },
      { name: 'Tomatoes', quantity: '2', unit: 'medium', calories: 50 },
      { name: 'Oil', quantity: '2', unit: 'tbsp', calories: 240 }
    ]
  },

  // ── NEW BREAKFAST ITEMS ──────────────────────────────────────────────
  {
    meal_type: 'breakfast', name: 'Paneer Paratha', cuisine_type: 'North Indian',
    description: 'Whole wheat flatbread stuffed with spiced paneer filling, served with curd and pickle',
    prep_time_minutes: 15, cook_time_minutes: 20, servings: 4,
    calories_per_serving: 320, protein_g: 12, carbs_g: 38, fat_g: 14, fiber_g: 3,
    kitchen_equipment: 'tawa,rolling pin,bowl', difficulty: 'medium',
    is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Whole wheat flour', quantity: '2', unit: 'cups', calories: 450 },
      { name: 'Paneer', quantity: '200', unit: 'grams', calories: 320 },
      { name: 'Ghee', quantity: '2', unit: 'tbsp', calories: 240 },
      { name: 'Green chillies', quantity: '2', unit: 'pieces', calories: 4 },
      { name: 'Coriander leaves', quantity: '2', unit: 'tbsp', calories: 5 },
      { name: 'Curd', quantity: '0.5', unit: 'cup', calories: 60 }
    ]
  },
  {
    meal_type: 'breakfast', name: 'Dosa (Plain)', cuisine_type: 'South Indian',
    description: 'Crispy thin rice and lentil crepe served with coconut chutney and sambar',
    prep_time_minutes: 5, cook_time_minutes: 15, servings: 4,
    calories_per_serving: 160, protein_g: 4, carbs_g: 32, fat_g: 3, fiber_g: 1,
    kitchen_equipment: 'tawa,ladle,bowl', difficulty: 'easy',
    is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Dosa batter', quantity: '3', unit: 'cups', calories: 480 },
      { name: 'Oil', quantity: '2', unit: 'tbsp', calories: 240 },
      { name: 'Coconut chutney', quantity: '4', unit: 'tbsp', calories: 80 }
    ]
  },
  {
    meal_type: 'breakfast', name: 'Sabudana Khichdi', cuisine_type: 'Indian',
    description: 'Sago pearls cooked with peanuts, curry leaves and mild spices — popular fasting food',
    prep_time_minutes: 20, cook_time_minutes: 15, servings: 4,
    calories_per_serving: 280, protein_g: 4, carbs_g: 55, fat_g: 6, fiber_g: 1,
    kitchen_equipment: 'kadai,spatula', difficulty: 'easy',
    is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Sabudana (sago)', quantity: '1.5', unit: 'cups', calories: 480 },
      { name: 'Peanuts (roasted)', quantity: '0.5', unit: 'cup', calories: 200 },
      { name: 'Potato', quantity: '2', unit: 'medium', calories: 160 },
      { name: 'Oil', quantity: '2', unit: 'tbsp', calories: 240 },
      { name: 'Curry leaves', quantity: '10', unit: 'leaves', calories: 3 },
      { name: 'Green chillies', quantity: '2', unit: 'pieces', calories: 4 }
    ]
  },
  {
    meal_type: 'breakfast', name: 'Bread Sandwich', cuisine_type: 'International',
    description: 'Simple yet filling sandwich with vegetables, cheese or chutney between bread slices',
    prep_time_minutes: 5, cook_time_minutes: 5, servings: 4,
    calories_per_serving: 220, protein_g: 7, carbs_g: 38, fat_g: 5, fiber_g: 2,
    kitchen_equipment: 'toaster,knife,plate', difficulty: 'easy',
    is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Whole wheat bread', quantity: '8', unit: 'slices', calories: 560 },
      { name: 'Cucumber', quantity: '1', unit: 'medium', calories: 20 },
      { name: 'Tomato', quantity: '2', unit: 'medium', calories: 50 },
      { name: 'Butter', quantity: '1', unit: 'tbsp', calories: 100 },
      { name: 'Green chutney', quantity: '2', unit: 'tbsp', calories: 30 }
    ]
  },
  {
    meal_type: 'breakfast', name: 'Masala Oats', cuisine_type: 'Indian',
    description: 'Savory oats cooked with Indian spices, vegetables — a quick high-fibre breakfast',
    prep_time_minutes: 5, cook_time_minutes: 10, servings: 4,
    calories_per_serving: 200, protein_g: 7, carbs_g: 32, fat_g: 5, fiber_g: 4,
    kitchen_equipment: 'kadai,spatula', difficulty: 'easy',
    is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Rolled oats', quantity: '1.5', unit: 'cups', calories: 450 },
      { name: 'Mixed vegetables', quantity: '1', unit: 'cup', calories: 80 },
      { name: 'Onion', quantity: '1', unit: 'medium', calories: 30 },
      { name: 'Mustard seeds', quantity: '1', unit: 'tsp', calories: 5 },
      { name: 'Oil', quantity: '1', unit: 'tbsp', calories: 120 },
      { name: 'Spices (cumin, turmeric)', quantity: '1', unit: 'set', calories: 10 }
    ]
  },
  {
    meal_type: 'breakfast', name: 'Bread Butter Toast', cuisine_type: 'International',
    description: 'Toasted bread with butter and jam or honey — quick and easy morning meal',
    prep_time_minutes: 2, cook_time_minutes: 5, servings: 4,
    calories_per_serving: 250, protein_g: 5, carbs_g: 42, fat_g: 8, fiber_g: 2,
    kitchen_equipment: 'toaster,knife', difficulty: 'easy',
    is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'White/brown bread', quantity: '8', unit: 'slices', calories: 560 },
      { name: 'Butter', quantity: '2', unit: 'tbsp', calories: 200 },
      { name: 'Jam/honey', quantity: '2', unit: 'tbsp', calories: 100 }
    ]
  },
  {
    meal_type: 'breakfast', name: 'Cornflakes with Milk', cuisine_type: 'International',
    description: 'Ready-to-eat cornflakes or cereals with chilled or warm milk and optional fruits',
    prep_time_minutes: 2, cook_time_minutes: 0, servings: 4,
    calories_per_serving: 180, protein_g: 4, carbs_g: 38, fat_g: 1, fiber_g: 3,
    kitchen_equipment: 'bowl,spoon', difficulty: 'easy',
    is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Cornflakes/cereals', quantity: '1.5', unit: 'cups', calories: 420 },
      { name: 'Milk', quantity: '1.5', unit: 'cups', calories: 180 },
      { name: 'Banana (optional)', quantity: '1', unit: 'medium', calories: 100 }
    ]
  },
  {
    meal_type: 'breakfast', name: 'Sprouts Salad', cuisine_type: 'Indian',
    description: 'Nutritious mixed sprouts tossed with lemon juice, onion, tomato and chaat masala',
    prep_time_minutes: 10, cook_time_minutes: 0, servings: 4,
    calories_per_serving: 120, protein_g: 9, carbs_g: 18, fat_g: 1, fiber_g: 5,
    kitchen_equipment: 'bowl,knife', difficulty: 'easy',
    is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Mixed sprouts (moong/chana)', quantity: '2', unit: 'cups', calories: 300 },
      { name: 'Onion', quantity: '1', unit: 'medium', calories: 30 },
      { name: 'Tomato', quantity: '1', unit: 'medium', calories: 25 },
      { name: 'Lemon juice', quantity: '2', unit: 'tbsp', calories: 8 },
      { name: 'Chaat masala', quantity: '0.5', unit: 'tsp', calories: 3 }
    ]
  },
  {
    meal_type: 'breakfast', name: 'Uttapam', cuisine_type: 'South Indian',
    description: 'Thick rice pancake topped with onion, tomato and green chillies — a South Indian classic',
    prep_time_minutes: 10, cook_time_minutes: 15, servings: 4,
    calories_per_serving: 230, protein_g: 7, carbs_g: 42, fat_g: 5, fiber_g: 2,
    kitchen_equipment: 'tawa,ladle,spatula', difficulty: 'easy',
    is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Idli/dosa batter', quantity: '3', unit: 'cups', calories: 480 },
      { name: 'Onion', quantity: '2', unit: 'medium', calories: 60 },
      { name: 'Tomato', quantity: '2', unit: 'medium', calories: 50 },
      { name: 'Green chillies', quantity: '2', unit: 'pieces', calories: 4 },
      { name: 'Oil', quantity: '2', unit: 'tbsp', calories: 240 }
    ]
  },
  {
    meal_type: 'breakfast', name: 'Medu Vada', cuisine_type: 'South Indian',
    description: 'Crispy deep-fried urad dal doughnuts served with coconut chutney and sambar',
    prep_time_minutes: 20, cook_time_minutes: 20, servings: 4,
    calories_per_serving: 190, protein_g: 7, carbs_g: 28, fat_g: 6, fiber_g: 3,
    kitchen_equipment: 'kadai,grinder,spatula', difficulty: 'medium',
    is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Urad dal (soaked)', quantity: '1.5', unit: 'cups', calories: 450 },
      { name: 'Onion', quantity: '1', unit: 'medium', calories: 30 },
      { name: 'Green chillies', quantity: '2', unit: 'pieces', calories: 4 },
      { name: 'Ginger', quantity: '0.5', unit: 'inch', calories: 3 },
      { name: 'Oil for frying', quantity: '3', unit: 'tbsp', calories: 360 }
    ]
  },
  {
    meal_type: 'breakfast', name: 'Paneer Sandwich', cuisine_type: 'Indian',
    description: 'Grilled sandwich stuffed with spiced paneer, capsicum and onion — high protein breakfast',
    prep_time_minutes: 10, cook_time_minutes: 10, servings: 4,
    calories_per_serving: 280, protein_g: 14, carbs_g: 30, fat_g: 11, fiber_g: 2,
    kitchen_equipment: 'sandwich maker,knife,bowl', difficulty: 'easy',
    is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Whole wheat bread', quantity: '8', unit: 'slices', calories: 560 },
      { name: 'Paneer', quantity: '200', unit: 'grams', calories: 320 },
      { name: 'Capsicum', quantity: '1', unit: 'medium', calories: 30 },
      { name: 'Onion', quantity: '1', unit: 'medium', calories: 30 },
      { name: 'Butter', quantity: '1', unit: 'tbsp', calories: 100 },
      { name: 'Chaat masala', quantity: '1', unit: 'tsp', calories: 5 }
    ]
  },
  {
    meal_type: 'breakfast', name: 'Sprouts Chaat', cuisine_type: 'Indian',
    description: 'Protein-packed sprouts tossed with tamarind chutney, sev and spices as a light breakfast',
    prep_time_minutes: 10, cook_time_minutes: 0, servings: 4,
    calories_per_serving: 130, protein_g: 10, carbs_g: 20, fat_g: 1, fiber_g: 5,
    kitchen_equipment: 'bowl,knife', difficulty: 'easy',
    is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Mixed sprouts', quantity: '2', unit: 'cups', calories: 300 },
      { name: 'Tamarind chutney', quantity: '2', unit: 'tbsp', calories: 60 },
      { name: 'Onion', quantity: '1', unit: 'medium', calories: 30 },
      { name: 'Tomato', quantity: '1', unit: 'medium', calories: 25 },
      { name: 'Sev', quantity: '2', unit: 'tbsp', calories: 80 },
      { name: 'Chaat masala', quantity: '1', unit: 'tsp', calories: 5 }
    ]
  },
  {
    meal_type: 'breakfast', name: 'Sprouts Cheela', cuisine_type: 'Indian',
    description: 'Savory pancakes made from ground sprouts batter — high protein and filling',
    prep_time_minutes: 15, cook_time_minutes: 15, servings: 4,
    calories_per_serving: 170, protein_g: 12, carbs_g: 22, fat_g: 4, fiber_g: 5,
    kitchen_equipment: 'tawa,grinder,spatula', difficulty: 'easy',
    is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Moong sprouts (ground)', quantity: '2', unit: 'cups', calories: 280 },
      { name: 'Onion', quantity: '1', unit: 'medium', calories: 30 },
      { name: 'Green chillies', quantity: '2', unit: 'pieces', calories: 4 },
      { name: 'Ginger', quantity: '0.5', unit: 'inch', calories: 3 },
      { name: 'Oil', quantity: '1', unit: 'tbsp', calories: 120 }
    ]
  },
  {
    meal_type: 'breakfast', name: 'Soya Chunks Upma', cuisine_type: 'Indian',
    description: 'Semolina upma loaded with protein-rich soya chunks — a wholesome high-protein breakfast',
    prep_time_minutes: 15, cook_time_minutes: 20, servings: 4,
    calories_per_serving: 260, protein_g: 18, carbs_g: 32, fat_g: 6, fiber_g: 4,
    kitchen_equipment: 'kadai,spatula', difficulty: 'easy',
    is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Semolina (rava)', quantity: '1', unit: 'cup', calories: 280 },
      { name: 'Soya chunks (soaked)', quantity: '1', unit: 'cup', calories: 250 },
      { name: 'Onion', quantity: '1', unit: 'medium', calories: 30 },
      { name: 'Mixed vegetables', quantity: '0.5', unit: 'cup', calories: 40 },
      { name: 'Oil', quantity: '1.5', unit: 'tbsp', calories: 180 },
      { name: 'Mustard seeds', quantity: '1', unit: 'tsp', calories: 5 }
    ]
  },
  {
    meal_type: 'breakfast', name: 'Oats Cheela', cuisine_type: 'Indian',
    description: 'Savory pancakes made from oats batter with veggies — can be stuffed with curd or paneer',
    prep_time_minutes: 10, cook_time_minutes: 15, servings: 4,
    calories_per_serving: 180, protein_g: 10, carbs_g: 28, fat_g: 4, fiber_g: 4,
    kitchen_equipment: 'tawa,bowl,spatula', difficulty: 'easy',
    is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Rolled oats (ground)', quantity: '1.5', unit: 'cups', calories: 450 },
      { name: 'Curd', quantity: '0.5', unit: 'cup', calories: 60 },
      { name: 'Onion', quantity: '1', unit: 'medium', calories: 30 },
      { name: 'Spinach', quantity: '0.5', unit: 'cup', calories: 15 },
      { name: 'Oil', quantity: '1', unit: 'tbsp', calories: 120 },
      { name: 'Paneer (optional stuffing)', quantity: '100', unit: 'grams', calories: 160 }
    ]
  },
  {
    meal_type: 'breakfast', name: 'Greek Yogurt Bowl', cuisine_type: 'International',
    description: 'Thick Greek yogurt topped with nuts, seeds, honey and fresh fruits — protein-rich',
    prep_time_minutes: 5, cook_time_minutes: 0, servings: 4,
    calories_per_serving: 180, protein_g: 15, carbs_g: 20, fat_g: 5, fiber_g: 2,
    kitchen_equipment: 'bowl,spoon', difficulty: 'easy',
    is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Greek yogurt', quantity: '2', unit: 'cups', calories: 300 },
      { name: 'Mixed nuts (almonds, walnuts)', quantity: '3', unit: 'tbsp', calories: 150 },
      { name: 'Honey', quantity: '1', unit: 'tbsp', calories: 60 },
      { name: 'Mixed berries/fruits', quantity: '0.5', unit: 'cup', calories: 50 },
      { name: 'Chia seeds', quantity: '1', unit: 'tbsp', calories: 60 }
    ]
  },
  {
    meal_type: 'breakfast', name: 'Curd with Roasted Chana', cuisine_type: 'Indian',
    description: 'Cooling curd paired with crunchy roasted chana — high protein, gut-friendly breakfast',
    prep_time_minutes: 5, cook_time_minutes: 0, servings: 4,
    calories_per_serving: 210, protein_g: 13, carbs_g: 28, fat_g: 4, fiber_g: 6,
    kitchen_equipment: 'bowl,spoon', difficulty: 'easy',
    is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Curd (dahi)', quantity: '2', unit: 'cups', calories: 240 },
      { name: 'Roasted chana', quantity: '1', unit: 'cup', calories: 360 },
      { name: 'Cucumber', quantity: '1', unit: 'medium', calories: 20 },
      { name: 'Chaat masala', quantity: '0.5', unit: 'tsp', calories: 3 }
    ]
  },
  {
    meal_type: 'breakfast', name: 'Dal Paratha', cuisine_type: 'North Indian',
    description: 'Whole wheat flatbread stuffed with spiced cooked lentils — filling and nutritious',
    prep_time_minutes: 20, cook_time_minutes: 20, servings: 4,
    calories_per_serving: 300, protein_g: 11, carbs_g: 42, fat_g: 9, fiber_g: 5,
    kitchen_equipment: 'tawa,rolling pin,pressure cooker', difficulty: 'medium',
    is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Whole wheat flour', quantity: '2', unit: 'cups', calories: 450 },
      { name: 'Chana dal / moong dal (cooked)', quantity: '1', unit: 'cup', calories: 360 },
      { name: 'Ghee', quantity: '2', unit: 'tbsp', calories: 240 },
      { name: 'Onion', quantity: '1', unit: 'medium', calories: 30 },
      { name: 'Green chillies', quantity: '2', unit: 'pieces', calories: 4 },
      { name: 'Coriander leaves', quantity: '2', unit: 'tbsp', calories: 5 }
    ]
  },
  {
    meal_type: 'breakfast', name: 'Quinoa Upma', cuisine_type: 'Indian',
    description: 'Protein-rich quinoa cooked with vegetables and spices in upma style — modern healthy twist',
    prep_time_minutes: 10, cook_time_minutes: 15, servings: 4,
    calories_per_serving: 220, protein_g: 8, carbs_g: 38, fat_g: 5, fiber_g: 4,
    kitchen_equipment: 'kadai,spatula', difficulty: 'easy',
    is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Quinoa', quantity: '1.5', unit: 'cups', calories: 480 },
      { name: 'Mixed vegetables', quantity: '1', unit: 'cup', calories: 80 },
      { name: 'Onion', quantity: '1', unit: 'medium', calories: 30 },
      { name: 'Mustard seeds', quantity: '1', unit: 'tsp', calories: 5 },
      { name: 'Oil', quantity: '1.5', unit: 'tbsp', calories: 180 },
      { name: 'Curry leaves', quantity: '10', unit: 'leaves', calories: 3 }
    ]
  }
];

async function seedMenu() {
  let added = 0;
  for (const item of menuData) {
    const { ingredients, ...menuItem } = item;
    const [created, wasCreated] = await MenuItem.findOrCreate({
      where: { name: menuItem.name, meal_type: menuItem.meal_type },
      defaults: menuItem
    });
    if (wasCreated) {
      if (ingredients && ingredients.length > 0) {
        await Promise.all(
          ingredients.map(ing => Ingredient.create({ ...ing, menu_item_id: created.id }))
        );
      }
      added++;
    }
  }
  if (added > 0) console.log(`Seeded ${added} new menu items`);
}

module.exports = { seedMenu };
