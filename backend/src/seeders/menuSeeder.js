const { MenuItem, Ingredient, DietPlanDayItem, DietPlanDay, DietPlan } = require('../models');

const menuData = [

  // ─────────────────────────────────────────────
  // BREAKFAST — Paranthas
  // ─────────────────────────────────────────────
  {
    meal_type: 'breakfast', name: 'Aloo Parantha', cuisine_type: 'North Indian',
    sub_category: 'Parantha',
    description: 'Whole wheat flatbread stuffed with spiced mashed potato, served with dahi and butter',
    prep_time_minutes: 15, cook_time_minutes: 20, servings: 4,
    calories_per_serving: 380, protein_g: 9, carbs_g: 58, fat_g: 13, fiber_g: 5,
    kitchen_equipment: 'tawa,rolling pin,bowl', difficulty: 'medium',
    is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Whole wheat flour', quantity: '2', unit: 'cups', calories: 400 },
      { name: 'Potato (boiled, mashed)', quantity: '3', unit: 'medium', calories: 240 },
      { name: 'Green chilli', quantity: '2', unit: 'pcs', calories: 6 },
      { name: 'Ghee / butter', quantity: '2', unit: 'tbsp', calories: 180 },
      { name: 'Salt', quantity: '1', unit: 'tsp', calories: 0 },
      { name: 'Ajwain', quantity: '0.5', unit: 'tsp', calories: 3 },
    ]
  },
  {
    meal_type: 'breakfast', name: 'Gobhi Parantha', cuisine_type: 'North Indian',
    sub_category: 'Parantha',
    description: 'Flaky whole wheat parantha stuffed with spiced grated cauliflower',
    prep_time_minutes: 15, cook_time_minutes: 20, servings: 4,
    calories_per_serving: 340, protein_g: 10, carbs_g: 52, fat_g: 11, fiber_g: 6,
    kitchen_equipment: 'tawa,rolling pin,grater', difficulty: 'medium',
    is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Whole wheat flour', quantity: '2', unit: 'cups', calories: 400 },
      { name: 'Cauliflower (grated)', quantity: '2', unit: 'cups', calories: 80 },
      { name: 'Green chilli', quantity: '2', unit: 'pcs', calories: 6 },
      { name: 'Ghee / butter', quantity: '2', unit: 'tbsp', calories: 180 },
      { name: 'Ginger (grated)', quantity: '1', unit: 'tsp', calories: 3 },
      { name: 'Coriander (chopped)', quantity: '2', unit: 'tbsp', calories: 4 },
    ]
  },
  {
    meal_type: 'breakfast', name: 'Paneer Parantha', cuisine_type: 'North Indian',
    sub_category: 'Parantha',
    description: 'Whole wheat parantha stuffed with crumbled spiced paneer',
    prep_time_minutes: 15, cook_time_minutes: 20, servings: 4,
    calories_per_serving: 420, protein_g: 16, carbs_g: 50, fat_g: 18, fiber_g: 4,
    kitchen_equipment: 'tawa,rolling pin,bowl', difficulty: 'medium',
    is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Whole wheat flour', quantity: '2', unit: 'cups', calories: 400 },
      { name: 'Paneer (crumbled)', quantity: '200', unit: 'g', calories: 320 },
      { name: 'Green chilli', quantity: '2', unit: 'pcs', calories: 6 },
      { name: 'Ghee / butter', quantity: '2', unit: 'tbsp', calories: 180 },
      { name: 'Cumin powder', quantity: '0.5', unit: 'tsp', calories: 4 },
    ]
  },
  {
    meal_type: 'breakfast', name: 'Methi Parantha', cuisine_type: 'North Indian',
    sub_category: 'Parantha',
    description: 'Healthy parantha made with fresh fenugreek leaves and spices',
    prep_time_minutes: 10, cook_time_minutes: 20, servings: 4,
    calories_per_serving: 310, protein_g: 9, carbs_g: 48, fat_g: 10, fiber_g: 7,
    kitchen_equipment: 'tawa,rolling pin,bowl', difficulty: 'easy',
    is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Whole wheat flour', quantity: '2', unit: 'cups', calories: 400 },
      { name: 'Fresh methi leaves', quantity: '1', unit: 'cup', calories: 30 },
      { name: 'Oil', quantity: '2', unit: 'tbsp', calories: 240 },
      { name: 'Ajwain', quantity: '0.5', unit: 'tsp', calories: 3 },
      { name: 'Red chilli powder', quantity: '0.5', unit: 'tsp', calories: 3 },
    ]
  },
  {
    meal_type: 'breakfast', name: 'Mooli Parantha', cuisine_type: 'North Indian',
    sub_category: 'Parantha',
    description: 'Parantha stuffed with spiced grated radish — a Punjabi winter favourite',
    prep_time_minutes: 15, cook_time_minutes: 20, servings: 4,
    calories_per_serving: 320, protein_g: 8, carbs_g: 50, fat_g: 11, fiber_g: 5,
    kitchen_equipment: 'tawa,rolling pin,grater', difficulty: 'medium',
    is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Whole wheat flour', quantity: '2', unit: 'cups', calories: 400 },
      { name: 'Radish (grated)', quantity: '2', unit: 'cups', calories: 40 },
      { name: 'Green chilli', quantity: '2', unit: 'pcs', calories: 6 },
      { name: 'Ghee', quantity: '2', unit: 'tbsp', calories: 180 },
      { name: 'Ajwain', quantity: '0.5', unit: 'tsp', calories: 3 },
    ]
  },
  {
    meal_type: 'breakfast', name: 'Pyaz Parantha', cuisine_type: 'North Indian',
    sub_category: 'Parantha',
    description: 'Crispy parantha stuffed with spiced onion and herbs',
    prep_time_minutes: 10, cook_time_minutes: 20, servings: 4,
    calories_per_serving: 330, protein_g: 8, carbs_g: 52, fat_g: 11, fiber_g: 5,
    kitchen_equipment: 'tawa,rolling pin,bowl', difficulty: 'easy',
    is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Whole wheat flour', quantity: '2', unit: 'cups', calories: 400 },
      { name: 'Onion (finely chopped)', quantity: '2', unit: 'medium', calories: 80 },
      { name: 'Green chilli', quantity: '2', unit: 'pcs', calories: 6 },
      { name: 'Oil', quantity: '2', unit: 'tbsp', calories: 240 },
      { name: 'Coriander', quantity: '2', unit: 'tbsp', calories: 4 },
    ]
  },
  {
    meal_type: 'breakfast', name: 'Dal Parantha', cuisine_type: 'North Indian',
    sub_category: 'Parantha',
    description: 'Protein-rich parantha stuffed with cooked chana dal and spices',
    prep_time_minutes: 20, cook_time_minutes: 20, servings: 4,
    calories_per_serving: 390, protein_g: 14, carbs_g: 56, fat_g: 13, fiber_g: 8,
    kitchen_equipment: 'tawa,rolling pin,pressure cooker', difficulty: 'medium',
    is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Whole wheat flour', quantity: '2', unit: 'cups', calories: 400 },
      { name: 'Chana dal (cooked)', quantity: '1', unit: 'cup', calories: 220 },
      { name: 'Oil', quantity: '2', unit: 'tbsp', calories: 240 },
      { name: 'Coriander powder', quantity: '1', unit: 'tsp', calories: 6 },
      { name: 'Amchur powder', quantity: '0.5', unit: 'tsp', calories: 2 },
    ]
  },
  {
    meal_type: 'breakfast', name: 'Lachha Parantha', cuisine_type: 'North Indian',
    sub_category: 'Parantha',
    description: 'Multi-layered flaky whole wheat parantha with butter',
    prep_time_minutes: 15, cook_time_minutes: 20, servings: 4,
    calories_per_serving: 360, protein_g: 8, carbs_g: 50, fat_g: 15, fiber_g: 4,
    kitchen_equipment: 'tawa,rolling pin', difficulty: 'medium',
    is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Whole wheat flour', quantity: '2', unit: 'cups', calories: 400 },
      { name: 'Ghee', quantity: '3', unit: 'tbsp', calories: 270 },
      { name: 'Salt', quantity: '1', unit: 'tsp', calories: 0 },
    ]
  },

  // ─────────────────────────────────────────────
  // BREAKFAST — Poha
  // ─────────────────────────────────────────────
  {
    meal_type: 'breakfast', name: 'Batata Poha', cuisine_type: 'Gujarati',
    sub_category: 'Poha',
    description: 'Flattened rice with potato, onion, and tempering of mustard seeds and curry leaves',
    prep_time_minutes: 10, cook_time_minutes: 15, servings: 4,
    calories_per_serving: 370, protein_g: 7, carbs_g: 62, fat_g: 9, fiber_g: 4,
    kitchen_equipment: 'kadai,spatula', difficulty: 'easy',
    is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Poha (flattened rice)', quantity: '2', unit: 'cups', calories: 350 },
      { name: 'Potato (diced)', quantity: '2', unit: 'medium', calories: 160 },
      { name: 'Onion', quantity: '1', unit: 'large', calories: 40 },
      { name: 'Oil', quantity: '2', unit: 'tbsp', calories: 240 },
      { name: 'Mustard seeds', quantity: '1', unit: 'tsp', calories: 5 },
      { name: 'Curry leaves', quantity: '8', unit: 'leaves', calories: 2 },
      { name: 'Lemon juice', quantity: '1', unit: 'tbsp', calories: 4 },
    ]
  },
  {
    meal_type: 'breakfast', name: 'Kanda Poha', cuisine_type: 'Indian',
    sub_category: 'Poha',
    description: 'Maharashtra-style poha with onion, peanuts and a dash of lemon',
    prep_time_minutes: 10, cook_time_minutes: 15, servings: 4,
    calories_per_serving: 355, protein_g: 8, carbs_g: 58, fat_g: 9, fiber_g: 4,
    kitchen_equipment: 'kadai,spatula', difficulty: 'easy',
    is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Poha', quantity: '2', unit: 'cups', calories: 350 },
      { name: 'Onion (finely chopped)', quantity: '2', unit: 'medium', calories: 80 },
      { name: 'Peanuts (roasted)', quantity: '3', unit: 'tbsp', calories: 120 },
      { name: 'Oil', quantity: '2', unit: 'tbsp', calories: 240 },
      { name: 'Green chilli', quantity: '2', unit: 'pcs', calories: 6 },
      { name: 'Lemon juice', quantity: '1', unit: 'tbsp', calories: 4 },
    ]
  },
  {
    meal_type: 'breakfast', name: 'Indori Poha', cuisine_type: 'Indian',
    sub_category: 'Poha',
    description: 'Indori-style thick poha topped with sev, onion, and jalebi',
    prep_time_minutes: 10, cook_time_minutes: 15, servings: 4,
    calories_per_serving: 410, protein_g: 8, carbs_g: 65, fat_g: 12, fiber_g: 4,
    kitchen_equipment: 'kadai,spatula', difficulty: 'easy',
    is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Thick poha', quantity: '2', unit: 'cups', calories: 350 },
      { name: 'Sev', quantity: '4', unit: 'tbsp', calories: 120 },
      { name: 'Onion (chopped)', quantity: '1', unit: 'medium', calories: 40 },
      { name: 'Oil', quantity: '2', unit: 'tbsp', calories: 240 },
      { name: 'Fennel seeds', quantity: '1', unit: 'tsp', calories: 5 },
    ]
  },

  // ─────────────────────────────────────────────
  // BREAKFAST — Uttapam
  // ─────────────────────────────────────────────
  {
    meal_type: 'breakfast', name: 'Plain Uttapam', cuisine_type: 'South Indian',
    sub_category: 'Uttapam',
    description: 'Thick rice-lentil pancake served with coconut chutney and sambar',
    prep_time_minutes: 5, cook_time_minutes: 15, servings: 4,
    calories_per_serving: 280, protein_g: 9, carbs_g: 48, fat_g: 6, fiber_g: 3,
    kitchen_equipment: 'tawa,spatula', difficulty: 'easy',
    is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Idli-dosa batter', quantity: '2', unit: 'cups', calories: 400 },
      { name: 'Oil', quantity: '2', unit: 'tbsp', calories: 240 },
    ]
  },
  {
    meal_type: 'breakfast', name: 'Tomato Uttapam', cuisine_type: 'South Indian',
    sub_category: 'Uttapam',
    description: 'Fluffy uttapam topped with fresh tomatoes and green chilli',
    prep_time_minutes: 5, cook_time_minutes: 15, servings: 4,
    calories_per_serving: 295, protein_g: 9, carbs_g: 50, fat_g: 6, fiber_g: 4,
    kitchen_equipment: 'tawa,spatula', difficulty: 'easy',
    is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Idli-dosa batter', quantity: '2', unit: 'cups', calories: 400 },
      { name: 'Tomato (sliced)', quantity: '2', unit: 'medium', calories: 40 },
      { name: 'Green chilli', quantity: '2', unit: 'pcs', calories: 6 },
      { name: 'Oil', quantity: '2', unit: 'tbsp', calories: 240 },
    ]
  },
  {
    meal_type: 'breakfast', name: 'Onion Uttapam', cuisine_type: 'South Indian',
    sub_category: 'Uttapam',
    description: 'Soft uttapam loaded with caramelised onion and coriander',
    prep_time_minutes: 5, cook_time_minutes: 15, servings: 4,
    calories_per_serving: 300, protein_g: 9, carbs_g: 50, fat_g: 7, fiber_g: 4,
    kitchen_equipment: 'tawa,spatula', difficulty: 'easy',
    is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Idli-dosa batter', quantity: '2', unit: 'cups', calories: 400 },
      { name: 'Onion (finely chopped)', quantity: '2', unit: 'medium', calories: 80 },
      { name: 'Oil', quantity: '2', unit: 'tbsp', calories: 240 },
    ]
  },
  {
    meal_type: 'breakfast', name: 'Mixed Veg Uttapam', cuisine_type: 'South Indian',
    sub_category: 'Uttapam',
    description: 'Colourful uttapam topped with tomato, onion, capsicum and carrot',
    prep_time_minutes: 8, cook_time_minutes: 15, servings: 4,
    calories_per_serving: 315, protein_g: 10, carbs_g: 52, fat_g: 7, fiber_g: 5,
    kitchen_equipment: 'tawa,spatula', difficulty: 'easy',
    is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Idli-dosa batter', quantity: '2', unit: 'cups', calories: 400 },
      { name: 'Mixed vegetables (chopped)', quantity: '1', unit: 'cup', calories: 80 },
      { name: 'Oil', quantity: '2', unit: 'tbsp', calories: 240 },
    ]
  },

  // ─────────────────────────────────────────────
  // BREAKFAST — Shakes
  // ─────────────────────────────────────────────
  {
    meal_type: 'breakfast', name: 'Banana Shake', cuisine_type: 'Indian',
    sub_category: 'Shake',
    description: 'Thick creamy banana milkshake with honey — energising morning drink',
    prep_time_minutes: 5, cook_time_minutes: 0, servings: 2,
    calories_per_serving: 280, protein_g: 8, carbs_g: 45, fat_g: 7, fiber_g: 2,
    kitchen_equipment: 'blender,glass', difficulty: 'easy',
    is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Banana', quantity: '2', unit: 'large', calories: 200 },
      { name: 'Milk (full cream)', quantity: '1.5', unit: 'cups', calories: 220 },
      { name: 'Honey', quantity: '1', unit: 'tbsp', calories: 60 },
    ]
  },
  {
    meal_type: 'breakfast', name: 'Mango Shake', cuisine_type: 'Indian',
    sub_category: 'Shake',
    description: 'Refreshing Alphonso mango milkshake — summer breakfast favourite',
    prep_time_minutes: 5, cook_time_minutes: 0, servings: 2,
    calories_per_serving: 310, protein_g: 7, carbs_g: 52, fat_g: 7, fiber_g: 2,
    kitchen_equipment: 'blender,glass', difficulty: 'easy',
    is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Mango pulp / fresh mango', quantity: '1', unit: 'cup', calories: 200 },
      { name: 'Milk', quantity: '1.5', unit: 'cups', calories: 220 },
      { name: 'Sugar', quantity: '1', unit: 'tbsp', calories: 50 },
    ]
  },
  {
    meal_type: 'breakfast', name: 'Chikoo Shake', cuisine_type: 'Indian',
    sub_category: 'Shake',
    description: 'Sweet sapodilla milkshake — rich, smooth and full of natural energy',
    prep_time_minutes: 5, cook_time_minutes: 0, servings: 2,
    calories_per_serving: 295, protein_g: 7, carbs_g: 48, fat_g: 7, fiber_g: 3,
    kitchen_equipment: 'blender,glass', difficulty: 'easy',
    is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Chikoo (sapodilla)', quantity: '3', unit: 'pcs', calories: 200 },
      { name: 'Milk', quantity: '1.5', unit: 'cups', calories: 220 },
      { name: 'Honey', quantity: '1', unit: 'tsp', calories: 20 },
    ]
  },
  {
    meal_type: 'breakfast', name: 'Strawberry Shake', cuisine_type: 'Indian',
    sub_category: 'Shake',
    description: 'Fresh strawberry blended with chilled milk and a hint of vanilla',
    prep_time_minutes: 5, cook_time_minutes: 0, servings: 2,
    calories_per_serving: 250, protein_g: 8, carbs_g: 38, fat_g: 7, fiber_g: 2,
    kitchen_equipment: 'blender,glass', difficulty: 'easy',
    is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Strawberry', quantity: '1', unit: 'cup', calories: 50 },
      { name: 'Milk', quantity: '1.5', unit: 'cups', calories: 220 },
      { name: 'Sugar', quantity: '1', unit: 'tbsp', calories: 50 },
    ]
  },
  {
    meal_type: 'breakfast', name: 'Papaya Shake', cuisine_type: 'Indian',
    sub_category: 'Shake',
    description: 'Nutritious papaya blended with milk and cardamom — great for digestion',
    prep_time_minutes: 5, cook_time_minutes: 0, servings: 2,
    calories_per_serving: 240, protein_g: 7, carbs_g: 40, fat_g: 6, fiber_g: 3,
    kitchen_equipment: 'blender,glass', difficulty: 'easy',
    is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Papaya (ripe)', quantity: '1', unit: 'cup', calories: 60 },
      { name: 'Milk', quantity: '1.5', unit: 'cups', calories: 220 },
      { name: 'Honey', quantity: '1', unit: 'tsp', calories: 20 },
      { name: 'Cardamom powder', quantity: '0.25', unit: 'tsp', calories: 2 },
    ]
  },

  // ─────────────────────────────────────────────
  // BREAKFAST — Dahi / Lassi
  // ─────────────────────────────────────────────
  {
    meal_type: 'breakfast', name: 'Dahi with Shakkar', cuisine_type: 'North Indian',
    sub_category: 'Dahi and Lassi',
    description: 'Fresh homemade curd with jaggery or sugar — light and cooling',
    prep_time_minutes: 2, cook_time_minutes: 0, servings: 2,
    calories_per_serving: 180, protein_g: 8, carbs_g: 24, fat_g: 5, fiber_g: 0,
    kitchen_equipment: 'bowl', difficulty: 'easy',
    is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Dahi (curd)', quantity: '1', unit: 'cup', calories: 150 },
      { name: 'Sugar / jaggery', quantity: '2', unit: 'tsp', calories: 30 },
    ]
  },
  {
    meal_type: 'breakfast', name: 'Sweet Lassi', cuisine_type: 'Punjabi',
    sub_category: 'Dahi and Lassi',
    description: 'Thick churned yogurt drink sweetened with sugar and flavoured with cardamom',
    prep_time_minutes: 5, cook_time_minutes: 0, servings: 2,
    calories_per_serving: 220, protein_g: 9, carbs_g: 32, fat_g: 6, fiber_g: 0,
    kitchen_equipment: 'blender,glass', difficulty: 'easy',
    is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Dahi (thick curd)', quantity: '1.5', unit: 'cups', calories: 220 },
      { name: 'Sugar', quantity: '2', unit: 'tbsp', calories: 100 },
      { name: 'Cardamom powder', quantity: '0.25', unit: 'tsp', calories: 2 },
      { name: 'Ice', quantity: '4', unit: 'cubes', calories: 0 },
    ]
  },
  {
    meal_type: 'breakfast', name: 'Namkeen Lassi', cuisine_type: 'Punjabi',
    sub_category: 'Dahi and Lassi',
    description: 'Salted buttermilk lassi with roasted cumin and mint — a cooling drink',
    prep_time_minutes: 5, cook_time_minutes: 0, servings: 2,
    calories_per_serving: 140, protein_g: 8, carbs_g: 12, fat_g: 5, fiber_g: 0,
    kitchen_equipment: 'blender,glass', difficulty: 'easy',
    is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Dahi (curd)', quantity: '1.5', unit: 'cups', calories: 220 },
      { name: 'Roasted cumin powder', quantity: '0.5', unit: 'tsp', calories: 4 },
      { name: 'Salt', quantity: '0.5', unit: 'tsp', calories: 0 },
      { name: 'Mint leaves', quantity: '5', unit: 'leaves', calories: 2 },
    ]
  },
  {
    meal_type: 'breakfast', name: 'Mango Lassi', cuisine_type: 'Punjabi',
    sub_category: 'Dahi and Lassi',
    description: 'Creamy mango yogurt lassi — thick, sweet and absolutely irresistible',
    prep_time_minutes: 5, cook_time_minutes: 0, servings: 2,
    calories_per_serving: 270, protein_g: 8, carbs_g: 42, fat_g: 6, fiber_g: 1,
    kitchen_equipment: 'blender,glass', difficulty: 'easy',
    is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Dahi (thick curd)', quantity: '1', unit: 'cup', calories: 150 },
      { name: 'Mango pulp', quantity: '0.5', unit: 'cup', calories: 100 },
      { name: 'Sugar', quantity: '2', unit: 'tbsp', calories: 100 },
    ]
  },

  // ─────────────────────────────────────────────
  // BREAKFAST — Other classics
  // ─────────────────────────────────────────────
  {
    meal_type: 'breakfast', name: 'Masala Dosa', cuisine_type: 'South Indian',
    sub_category: 'Dosa and Idli',
    description: 'Crispy fermented rice crepe stuffed with spiced potato filling, served with sambar and chutney',
    prep_time_minutes: 10, cook_time_minutes: 20, servings: 4,
    calories_per_serving: 390, protein_g: 10, carbs_g: 60, fat_g: 13, fiber_g: 4,
    kitchen_equipment: 'tawa,spatula', difficulty: 'medium',
    is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Dosa batter', quantity: '2', unit: 'cups', calories: 360 },
      { name: 'Potato (boiled)', quantity: '3', unit: 'medium', calories: 240 },
      { name: 'Oil', quantity: '2', unit: 'tbsp', calories: 240 },
      { name: 'Mustard seeds, curry leaves', quantity: '1', unit: 'tsp', calories: 5 },
    ]
  },
  {
    meal_type: 'breakfast', name: 'Plain Dosa', cuisine_type: 'South Indian',
    sub_category: 'Dosa and Idli',
    description: 'Thin crispy plain dosa served with coconut chutney and sambar',
    prep_time_minutes: 5, cook_time_minutes: 15, servings: 4,
    calories_per_serving: 250, protein_g: 7, carbs_g: 44, fat_g: 6, fiber_g: 2,
    kitchen_equipment: 'tawa,spatula', difficulty: 'easy',
    is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Dosa batter', quantity: '2', unit: 'cups', calories: 360 },
      { name: 'Oil', quantity: '1', unit: 'tbsp', calories: 120 },
    ]
  },
  {
    meal_type: 'breakfast', name: 'Idli Sambar', cuisine_type: 'South Indian',
    sub_category: 'Dosa and Idli',
    description: 'Steamed rice-lentil cakes served with toor dal sambar and coconut chutney',
    prep_time_minutes: 5, cook_time_minutes: 15, servings: 4,
    calories_per_serving: 260, protein_g: 9, carbs_g: 46, fat_g: 4, fiber_g: 3,
    kitchen_equipment: 'idli cooker,pressure cooker', difficulty: 'easy',
    is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Idli batter', quantity: '2', unit: 'cups', calories: 360 },
      { name: 'Toor dal (cooked)', quantity: '0.5', unit: 'cup', calories: 120 },
      { name: 'Mixed vegetables', quantity: '0.5', unit: 'cup', calories: 40 },
      { name: 'Tamarind', quantity: '1', unit: 'small piece', calories: 10 },
    ]
  },
  {
    meal_type: 'breakfast', name: 'Besan Chilla', cuisine_type: 'North Indian',
    sub_category: 'Chilla',
    description: 'Savoury gram flour pancake with veggies — high protein, quick breakfast',
    prep_time_minutes: 5, cook_time_minutes: 15, servings: 4,
    calories_per_serving: 300, protein_g: 14, carbs_g: 38, fat_g: 10, fiber_g: 6,
    kitchen_equipment: 'tawa,spatula', difficulty: 'easy',
    is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Besan (chickpea flour)', quantity: '1.5', unit: 'cups', calories: 500 },
      { name: 'Onion (chopped)', quantity: '1', unit: 'medium', calories: 40 },
      { name: 'Green chilli', quantity: '2', unit: 'pcs', calories: 6 },
      { name: 'Oil', quantity: '2', unit: 'tbsp', calories: 240 },
      { name: 'Tomato (chopped)', quantity: '1', unit: 'medium', calories: 20 },
    ]
  },
  {
    meal_type: 'breakfast', name: 'Moong Dal Chilla', cuisine_type: 'North Indian',
    sub_category: 'Chilla',
    description: 'Light protein-rich green moong dal pancake with spices and herbs',
    prep_time_minutes: 15, cook_time_minutes: 15, servings: 4,
    calories_per_serving: 280, protein_g: 15, carbs_g: 38, fat_g: 8, fiber_g: 7,
    kitchen_equipment: 'tawa,spatula,blender', difficulty: 'easy',
    is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Moong dal (soaked)', quantity: '1', unit: 'cup', calories: 340 },
      { name: 'Ginger', quantity: '1', unit: 'inch', calories: 5 },
      { name: 'Green chilli', quantity: '2', unit: 'pcs', calories: 6 },
      { name: 'Oil', quantity: '2', unit: 'tbsp', calories: 240 },
    ]
  },
  {
    meal_type: 'breakfast', name: 'Sabudana Khichdi', cuisine_type: 'Indian',
    sub_category: 'Other Breakfast',
    description: 'Tapioca pearls cooked with peanuts, potato and cumin — popular fasting breakfast',
    prep_time_minutes: 30, cook_time_minutes: 15, servings: 4,
    calories_per_serving: 420, protein_g: 8, carbs_g: 68, fat_g: 13, fiber_g: 2,
    kitchen_equipment: 'kadai,spatula', difficulty: 'medium',
    is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Sabudana (tapioca pearls)', quantity: '1.5', unit: 'cups', calories: 540 },
      { name: 'Peanuts (roasted, coarsely ground)', quantity: '0.5', unit: 'cup', calories: 280 },
      { name: 'Potato (boiled, cubed)', quantity: '2', unit: 'medium', calories: 160 },
      { name: 'Oil / ghee', quantity: '2', unit: 'tbsp', calories: 240 },
    ]
  },
  {
    meal_type: 'breakfast', name: 'Oats Porridge', cuisine_type: 'Indian',
    sub_category: 'Other Breakfast',
    description: 'Creamy oats cooked with milk, banana and honey — hearty healthy breakfast',
    prep_time_minutes: 2, cook_time_minutes: 10, servings: 2,
    calories_per_serving: 320, protein_g: 10, carbs_g: 52, fat_g: 7, fiber_g: 5,
    kitchen_equipment: 'saucepan,bowl', difficulty: 'easy',
    is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Rolled oats', quantity: '1', unit: 'cup', calories: 300 },
      { name: 'Milk', quantity: '1.5', unit: 'cups', calories: 220 },
      { name: 'Banana', quantity: '1', unit: 'medium', calories: 100 },
      { name: 'Honey', quantity: '1', unit: 'tbsp', calories: 60 },
    ]
  },
  {
    meal_type: 'breakfast', name: 'Upma', cuisine_type: 'South Indian',
    sub_category: 'Upma',
    description: 'Semolina porridge cooked with mixed vegetables and tempered spices',
    prep_time_minutes: 5, cook_time_minutes: 20, servings: 4,
    calories_per_serving: 320, protein_g: 9, carbs_g: 52, fat_g: 8, fiber_g: 3,
    kitchen_equipment: 'kadai,spatula', difficulty: 'easy',
    is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Sooji (semolina)', quantity: '1.5', unit: 'cups', calories: 500 },
      { name: 'Onion', quantity: '1', unit: 'large', calories: 40 },
      { name: 'Mixed vegetables', quantity: '0.5', unit: 'cup', calories: 40 },
      { name: 'Oil', quantity: '2', unit: 'tbsp', calories: 240 },
      { name: 'Mustard seeds, curry leaves', quantity: '1', unit: 'tsp', calories: 5 },
    ]
  },

  // ─────────────────────────────────────────────
  // BREAKFAST — More Dosa varieties
  // ─────────────────────────────────────────────
  {
    meal_type: 'breakfast', name: 'Rava Dosa', cuisine_type: 'South Indian',
    sub_category: 'Dosa and Idli',
    description: 'Instant crispy lacy dosa made with semolina, rice flour and onion — no fermentation needed',
    prep_time_minutes: 10, cook_time_minutes: 15, servings: 4,
    calories_per_serving: 270, protein_g: 7, carbs_g: 42, fat_g: 8, fiber_g: 2,
    kitchen_equipment: 'tawa,spatula', difficulty: 'easy',
    is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Sooji (semolina)', quantity: '0.5', unit: 'cup', calories: 170 },
      { name: 'Rice flour', quantity: '0.5', unit: 'cup', calories: 180 },
      { name: 'Onion (finely chopped)', quantity: '1', unit: 'medium', calories: 40 },
      { name: 'Green chilli, cumin', quantity: '1', unit: 'tsp', calories: 5 },
      { name: 'Oil', quantity: '1.5', unit: 'tbsp', calories: 180 },
    ]
  },
  {
    meal_type: 'breakfast', name: 'Onion Dosa', cuisine_type: 'South Indian',
    sub_category: 'Dosa and Idli',
    description: 'Crispy dosa topped with finely chopped onion and green chilli',
    prep_time_minutes: 5, cook_time_minutes: 15, servings: 4,
    calories_per_serving: 265, protein_g: 7, carbs_g: 44, fat_g: 7, fiber_g: 3,
    kitchen_equipment: 'tawa,spatula', difficulty: 'easy',
    is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Dosa batter', quantity: '2', unit: 'cups', calories: 360 },
      { name: 'Onion (finely chopped)', quantity: '2', unit: 'medium', calories: 80 },
      { name: 'Green chilli', quantity: '2', unit: 'pcs', calories: 6 },
      { name: 'Oil', quantity: '1', unit: 'tbsp', calories: 120 },
    ]
  },
  {
    meal_type: 'breakfast', name: 'Mysore Masala Dosa', cuisine_type: 'South Indian',
    sub_category: 'Dosa and Idli',
    description: 'Crispy dosa spread with spicy red chutney and filled with seasoned potato masala',
    prep_time_minutes: 10, cook_time_minutes: 20, servings: 4,
    calories_per_serving: 420, protein_g: 11, carbs_g: 62, fat_g: 14, fiber_g: 5,
    kitchen_equipment: 'tawa,spatula', difficulty: 'medium',
    is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Dosa batter', quantity: '2', unit: 'cups', calories: 360 },
      { name: 'Potato masala (filling)', quantity: '1', unit: 'cup', calories: 200 },
      { name: 'Red chutney (Mysore)', quantity: '3', unit: 'tbsp', calories: 60 },
      { name: 'Oil', quantity: '2', unit: 'tbsp', calories: 240 },
    ]
  },
  {
    meal_type: 'breakfast', name: 'Paneer Dosa', cuisine_type: 'South Indian',
    sub_category: 'Dosa and Idli',
    description: 'Golden dosa stuffed with spiced crumbled paneer and onion filling',
    prep_time_minutes: 10, cook_time_minutes: 20, servings: 4,
    calories_per_serving: 430, protein_g: 17, carbs_g: 50, fat_g: 18, fiber_g: 3,
    kitchen_equipment: 'tawa,spatula', difficulty: 'medium',
    is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Dosa batter', quantity: '2', unit: 'cups', calories: 360 },
      { name: 'Paneer (crumbled)', quantity: '150', unit: 'g', calories: 240 },
      { name: 'Onion, green chilli', quantity: '1', unit: 'medium', calories: 45 },
      { name: 'Oil', quantity: '2', unit: 'tbsp', calories: 240 },
    ]
  },
  {
    meal_type: 'breakfast', name: 'Pesarattu', cuisine_type: 'South Indian',
    sub_category: 'Dosa and Idli',
    description: 'Andhra-style green moong dal dosa — high protein, naturally crispy',
    prep_time_minutes: 15, cook_time_minutes: 15, servings: 4,
    calories_per_serving: 290, protein_g: 15, carbs_g: 40, fat_g: 7, fiber_g: 8,
    kitchen_equipment: 'tawa,spatula,blender', difficulty: 'easy',
    is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Green moong dal (soaked)', quantity: '1', unit: 'cup', calories: 340 },
      { name: 'Ginger, green chilli', quantity: '1', unit: 'inch + 2 pcs', calories: 8 },
      { name: 'Oil', quantity: '1.5', unit: 'tbsp', calories: 180 },
    ]
  },
  {
    meal_type: 'breakfast', name: 'Ghee Roast Dosa', cuisine_type: 'South Indian',
    sub_category: 'Dosa and Idli',
    description: 'Extra crispy dosa roasted in generous ghee — a Karnataka speciality',
    prep_time_minutes: 5, cook_time_minutes: 15, servings: 4,
    calories_per_serving: 310, protein_g: 7, carbs_g: 44, fat_g: 12, fiber_g: 2,
    kitchen_equipment: 'tawa,spatula', difficulty: 'easy',
    is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Dosa batter', quantity: '2', unit: 'cups', calories: 360 },
      { name: 'Ghee', quantity: '2', unit: 'tbsp', calories: 180 },
    ]
  },

  // ─────────────────────────────────────────────
  // BREAKFAST — More Idli varieties
  // ─────────────────────────────────────────────
  {
    meal_type: 'breakfast', name: 'Rava Idli', cuisine_type: 'South Indian',
    sub_category: 'Dosa and Idli',
    description: 'Instant soft semolina idli with mustard seeds and cashews — no overnight soaking needed',
    prep_time_minutes: 10, cook_time_minutes: 15, servings: 4,
    calories_per_serving: 280, protein_g: 8, carbs_g: 44, fat_g: 8, fiber_g: 2,
    kitchen_equipment: 'idli cooker,kadai', difficulty: 'easy',
    is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Sooji (semolina)', quantity: '1.5', unit: 'cups', calories: 500 },
      { name: 'Dahi (curd)', quantity: '1', unit: 'cup', calories: 150 },
      { name: 'Cashews', quantity: '8', unit: 'pcs', calories: 80 },
      { name: 'Ghee', quantity: '1', unit: 'tbsp', calories: 90 },
    ]
  },
  {
    meal_type: 'breakfast', name: 'Mini Idli Sambar', cuisine_type: 'South Indian',
    sub_category: 'Dosa and Idli',
    description: 'Bite-sized mini idlis dunked in piping hot toor dal sambar — kids favourite',
    prep_time_minutes: 5, cook_time_minutes: 15, servings: 4,
    calories_per_serving: 270, protein_g: 10, carbs_g: 46, fat_g: 5, fiber_g: 4,
    kitchen_equipment: 'mini idli cooker,pressure cooker', difficulty: 'easy',
    is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Idli batter', quantity: '2', unit: 'cups', calories: 360 },
      { name: 'Toor dal sambar', quantity: '1.5', unit: 'cups', calories: 150 },
      { name: 'Oil', quantity: '1', unit: 'tsp', calories: 40 },
    ]
  },
  {
    meal_type: 'breakfast', name: 'Ragi Idli', cuisine_type: 'South Indian',
    sub_category: 'Dosa and Idli',
    description: 'Nutritious finger millet idli — high calcium, iron-rich healthy breakfast',
    prep_time_minutes: 5, cook_time_minutes: 15, servings: 4,
    calories_per_serving: 240, protein_g: 8, carbs_g: 42, fat_g: 3, fiber_g: 5,
    kitchen_equipment: 'idli cooker', difficulty: 'easy',
    is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Ragi (finger millet) flour', quantity: '1', unit: 'cup', calories: 320 },
      { name: 'Urad dal (soaked, ground)', quantity: '0.5', unit: 'cup', calories: 170 },
      { name: 'Salt', quantity: '1', unit: 'tsp', calories: 0 },
    ]
  },

  // ─────────────────────────────────────────────
  // BREAKFAST — More Upma varieties
  // ─────────────────────────────────────────────
  {
    meal_type: 'breakfast', name: 'Semiya Upma', cuisine_type: 'South Indian',
    sub_category: 'Upma',
    description: 'Vermicelli cooked with vegetables and South Indian tempering — light and quick',
    prep_time_minutes: 5, cook_time_minutes: 15, servings: 4,
    calories_per_serving: 300, protein_g: 8, carbs_g: 50, fat_g: 7, fiber_g: 3,
    kitchen_equipment: 'kadai,spatula', difficulty: 'easy',
    is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Semiya (vermicelli)', quantity: '1.5', unit: 'cups', calories: 480 },
      { name: 'Onion, mixed vegetables', quantity: '1', unit: 'cup', calories: 80 },
      { name: 'Oil', quantity: '1.5', unit: 'tbsp', calories: 180 },
      { name: 'Mustard seeds, curry leaves', quantity: '1', unit: 'tsp', calories: 5 },
    ]
  },
  {
    meal_type: 'breakfast', name: 'Oats Upma', cuisine_type: 'Indian',
    sub_category: 'Upma',
    description: 'Healthy savoury oats upma with vegetables and spices — guilt-free breakfast',
    prep_time_minutes: 5, cook_time_minutes: 12, servings: 2,
    calories_per_serving: 290, protein_g: 10, carbs_g: 44, fat_g: 8, fiber_g: 6,
    kitchen_equipment: 'kadai,spatula', difficulty: 'easy',
    is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Rolled oats', quantity: '1', unit: 'cup', calories: 300 },
      { name: 'Mixed vegetables (carrot, peas, capsicum)', quantity: '0.5', unit: 'cup', calories: 50 },
      { name: 'Oil', quantity: '1.5', unit: 'tbsp', calories: 180 },
      { name: 'Mustard seeds, curry leaves, green chilli', quantity: '1', unit: 'tsp', calories: 5 },
    ]
  },
  {
    meal_type: 'breakfast', name: 'Bread Upma', cuisine_type: 'Indian',
    sub_category: 'Upma',
    description: 'Leftover bread stir-fried with onion, tomato and spices — quick tasty breakfast',
    prep_time_minutes: 5, cook_time_minutes: 10, servings: 2,
    calories_per_serving: 310, protein_g: 9, carbs_g: 48, fat_g: 9, fiber_g: 3,
    kitchen_equipment: 'kadai,spatula', difficulty: 'easy',
    is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Bread (cubed)', quantity: '6', unit: 'slices', calories: 360 },
      { name: 'Onion', quantity: '1', unit: 'medium', calories: 40 },
      { name: 'Tomato', quantity: '1', unit: 'medium', calories: 20 },
      { name: 'Oil', quantity: '1.5', unit: 'tbsp', calories: 180 },
      { name: 'Mustard seeds, curry leaves', quantity: '1', unit: 'tsp', calories: 5 },
    ]
  },
  {
    meal_type: 'breakfast', name: 'Rava Upma', cuisine_type: 'South Indian',
    sub_category: 'Upma',
    description: 'Classic semolina upma with cashews and fresh coconut — a South Indian staple',
    prep_time_minutes: 5, cook_time_minutes: 20, servings: 4,
    calories_per_serving: 340, protein_g: 9, carbs_g: 54, fat_g: 10, fiber_g: 3,
    kitchen_equipment: 'kadai,spatula', difficulty: 'easy',
    is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Sooji (semolina)', quantity: '1.5', unit: 'cups', calories: 500 },
      { name: 'Cashews', quantity: '10', unit: 'pcs', calories: 100 },
      { name: 'Fresh coconut (grated)', quantity: '2', unit: 'tbsp', calories: 60 },
      { name: 'Ghee', quantity: '1.5', unit: 'tbsp', calories: 135 },
      { name: 'Mustard seeds, urad dal, curry leaves', quantity: '1', unit: 'tsp', calories: 8 },
    ]
  },
  {
    meal_type: 'breakfast', name: 'Poha Upma', cuisine_type: 'Indian',
    sub_category: 'Upma',
    description: 'Flattened rice cooked upma-style with peanuts and tempering',
    prep_time_minutes: 10, cook_time_minutes: 15, servings: 4,
    calories_per_serving: 330, protein_g: 8, carbs_g: 54, fat_g: 9, fiber_g: 3,
    kitchen_equipment: 'kadai,spatula', difficulty: 'easy',
    is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Thick poha', quantity: '2', unit: 'cups', calories: 350 },
      { name: 'Peanuts', quantity: '3', unit: 'tbsp', calories: 120 },
      { name: 'Oil', quantity: '1.5', unit: 'tbsp', calories: 180 },
      { name: 'Mustard seeds, curry leaves', quantity: '1', unit: 'tsp', calories: 5 },
    ]
  },

  // ─────────────────────────────────────────────
  // LUNCH
  // ─────────────────────────────────────────────
  {
    meal_type: 'lunch', name: 'Aloo Gobhi with Roti', cuisine_type: 'North Indian',
    sub_category: 'Roti Sabzi',
    description: 'Dry spiced potato and cauliflower curry served with 2 whole wheat rotis',
    prep_time_minutes: 10, cook_time_minutes: 25, servings: 4,
    calories_per_serving: 450, protein_g: 11, carbs_g: 68, fat_g: 14, fiber_g: 8,
    kitchen_equipment: 'kadai,tawa,spatula', difficulty: 'easy',
    is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Potato', quantity: '3', unit: 'medium', calories: 240 },
      { name: 'Cauliflower', quantity: '1', unit: 'small head', calories: 80 },
      { name: 'Whole wheat roti', quantity: '2', unit: 'pcs', calories: 240 },
      { name: 'Oil', quantity: '2', unit: 'tbsp', calories: 240 },
    ]
  },
  {
    meal_type: 'lunch', name: 'Palak Paneer with Roti', cuisine_type: 'North Indian',
    sub_category: 'Roti Sabzi',
    description: 'Creamy spinach curry with soft paneer cubes served with 2 rotis',
    prep_time_minutes: 15, cook_time_minutes: 25, servings: 4,
    calories_per_serving: 510, protein_g: 20, carbs_g: 52, fat_g: 24, fiber_g: 6,
    kitchen_equipment: 'kadai,tawa,blender', difficulty: 'medium',
    is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Spinach (palak)', quantity: '500', unit: 'g', calories: 100 },
      { name: 'Paneer', quantity: '200', unit: 'g', calories: 320 },
      { name: 'Cream', quantity: '2', unit: 'tbsp', calories: 100 },
      { name: 'Whole wheat roti', quantity: '2', unit: 'pcs', calories: 240 },
      { name: 'Oil', quantity: '2', unit: 'tbsp', calories: 240 },
    ]
  },
  {
    meal_type: 'lunch', name: 'Dal Tadka with Rice', cuisine_type: 'North Indian',
    sub_category: 'Dal Rice',
    description: 'Yellow toor dal with a smoky ghee-tempered tadka, served with steamed rice',
    prep_time_minutes: 10, cook_time_minutes: 30, servings: 4,
    calories_per_serving: 480, protein_g: 16, carbs_g: 72, fat_g: 14, fiber_g: 7,
    kitchen_equipment: 'pressure cooker,kadai', difficulty: 'easy',
    is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Toor dal', quantity: '1', unit: 'cup', calories: 380 },
      { name: 'Basmati rice (cooked)', quantity: '1.5', unit: 'cups', calories: 340 },
      { name: 'Ghee', quantity: '2', unit: 'tbsp', calories: 180 },
      { name: 'Onion, tomato, spices', quantity: '1', unit: 'serving', calories: 80 },
    ]
  },
  {
    meal_type: 'lunch', name: 'Dal Makhani with Roti', cuisine_type: 'Punjabi',
    sub_category: 'Dal Roti',
    description: 'Rich slow-cooked black dal in butter and cream, served with 2 rotis',
    prep_time_minutes: 10, cook_time_minutes: 60, servings: 4,
    calories_per_serving: 540, protein_g: 18, carbs_g: 62, fat_g: 22, fiber_g: 9,
    kitchen_equipment: 'pressure cooker,kadai,tawa', difficulty: 'medium',
    is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Black urad dal (whole)', quantity: '1', unit: 'cup', calories: 380 },
      { name: 'Rajma', quantity: '0.25', unit: 'cup', calories: 100 },
      { name: 'Butter', quantity: '2', unit: 'tbsp', calories: 200 },
      { name: 'Cream', quantity: '2', unit: 'tbsp', calories: 100 },
      { name: 'Whole wheat roti', quantity: '2', unit: 'pcs', calories: 240 },
    ]
  },
  {
    meal_type: 'lunch', name: 'Rajma Chawal', cuisine_type: 'North Indian',
    sub_category: 'Dal Rice',
    description: 'Spiced red kidney bean curry served over steamed rice — comfort food',
    prep_time_minutes: 10, cook_time_minutes: 40, servings: 4,
    calories_per_serving: 500, protein_g: 18, carbs_g: 78, fat_g: 12, fiber_g: 12,
    kitchen_equipment: 'pressure cooker,kadai', difficulty: 'easy',
    is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Rajma (red kidney beans)', quantity: '1', unit: 'cup', calories: 340 },
      { name: 'Basmati rice (cooked)', quantity: '1.5', unit: 'cups', calories: 340 },
      { name: 'Onion, tomato, spices', quantity: '1', unit: 'serving', calories: 100 },
      { name: 'Oil', quantity: '2', unit: 'tbsp', calories: 240 },
    ]
  },
  {
    meal_type: 'lunch', name: 'Paneer Butter Masala with Roti', cuisine_type: 'North Indian',
    sub_category: 'Roti Sabzi',
    description: 'Paneer in rich tomato-butter gravy with aromatic spices, served with 2 rotis',
    prep_time_minutes: 15, cook_time_minutes: 25, servings: 4,
    calories_per_serving: 580, protein_g: 22, carbs_g: 56, fat_g: 28, fiber_g: 4,
    kitchen_equipment: 'kadai,tawa,blender', difficulty: 'medium',
    is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Paneer', quantity: '250', unit: 'g', calories: 400 },
      { name: 'Tomato puree', quantity: '1', unit: 'cup', calories: 80 },
      { name: 'Butter', quantity: '2', unit: 'tbsp', calories: 200 },
      { name: 'Cream', quantity: '3', unit: 'tbsp', calories: 150 },
      { name: 'Whole wheat roti', quantity: '2', unit: 'pcs', calories: 240 },
    ]
  },
  {
    meal_type: 'lunch', name: 'Bhindi Masala with Roti', cuisine_type: 'North Indian',
    sub_category: 'Roti Sabzi',
    description: 'Stir-fried okra with onion, tomato and spices served with 2 rotis',
    prep_time_minutes: 10, cook_time_minutes: 20, servings: 4,
    calories_per_serving: 410, protein_g: 9, carbs_g: 58, fat_g: 15, fiber_g: 9,
    kitchen_equipment: 'kadai,tawa', difficulty: 'easy',
    is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Bhindi (okra)', quantity: '500', unit: 'g', calories: 150 },
      { name: 'Onion', quantity: '2', unit: 'medium', calories: 80 },
      { name: 'Oil', quantity: '2', unit: 'tbsp', calories: 240 },
      { name: 'Whole wheat roti', quantity: '2', unit: 'pcs', calories: 240 },
    ]
  },
  {
    meal_type: 'lunch', name: 'Baingan Bharta with Roti', cuisine_type: 'Punjabi',
    sub_category: 'Roti Sabzi',
    description: 'Smoky roasted eggplant mash with onion, tomato and spices, served with rotis',
    prep_time_minutes: 10, cook_time_minutes: 30, servings: 4,
    calories_per_serving: 380, protein_g: 8, carbs_g: 58, fat_g: 11, fiber_g: 9,
    kitchen_equipment: 'gas flame,kadai,tawa', difficulty: 'medium',
    is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Brinjal (baingan)', quantity: '2', unit: 'large', calories: 100 },
      { name: 'Onion, tomato', quantity: '2', unit: 'each', calories: 100 },
      { name: 'Oil', quantity: '2', unit: 'tbsp', calories: 240 },
      { name: 'Whole wheat roti', quantity: '2', unit: 'pcs', calories: 240 },
    ]
  },
  {
    meal_type: 'lunch', name: 'Matar Paneer with Roti', cuisine_type: 'North Indian',
    sub_category: 'Roti Sabzi',
    description: 'Green peas and paneer in spiced tomato-onion gravy with rotis',
    prep_time_minutes: 10, cook_time_minutes: 25, servings: 4,
    calories_per_serving: 490, protein_g: 19, carbs_g: 58, fat_g: 20, fiber_g: 7,
    kitchen_equipment: 'kadai,tawa', difficulty: 'easy',
    is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Paneer', quantity: '200', unit: 'g', calories: 320 },
      { name: 'Green peas', quantity: '1', unit: 'cup', calories: 120 },
      { name: 'Tomato-onion gravy', quantity: '1', unit: 'cup', calories: 120 },
      { name: 'Whole wheat roti', quantity: '2', unit: 'pcs', calories: 240 },
    ]
  },
  {
    meal_type: 'lunch', name: 'Chana Masala with Bhatura', cuisine_type: 'Punjabi',
    sub_category: 'Chana Chole',
    description: 'Spiced chickpea curry with fluffy deep-fried bhatura — a festive treat',
    prep_time_minutes: 15, cook_time_minutes: 30, servings: 4,
    calories_per_serving: 620, protein_g: 18, carbs_g: 82, fat_g: 24, fiber_g: 12,
    kitchen_equipment: 'pressure cooker,kadai,deep pan', difficulty: 'medium',
    is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Kabuli chana (chickpeas)', quantity: '1.5', unit: 'cups', calories: 520 },
      { name: 'Bhatura (fried bread)', quantity: '2', unit: 'pcs', calories: 400 },
      { name: 'Onion, tomato, spices', quantity: '1', unit: 'serving', calories: 100 },
    ]
  },
  {
    meal_type: 'lunch', name: 'Veg Biryani', cuisine_type: 'Mughal',
    sub_category: 'Rice Dishes',
    description: 'Aromatic basmati rice cooked with mixed vegetables, saffron and whole spices',
    prep_time_minutes: 20, cook_time_minutes: 40, servings: 4,
    calories_per_serving: 520, protein_g: 12, carbs_g: 80, fat_g: 16, fiber_g: 6,
    kitchen_equipment: 'heavy pot,tawa', difficulty: 'medium',
    is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Basmati rice', quantity: '1.5', unit: 'cups', calories: 510 },
      { name: 'Mixed vegetables', quantity: '2', unit: 'cups', calories: 160 },
      { name: 'Ghee', quantity: '3', unit: 'tbsp', calories: 270 },
      { name: 'Fried onion (birista)', quantity: '0.5', unit: 'cup', calories: 200 },
      { name: 'Saffron, whole spices', quantity: '1', unit: 'tsp', calories: 10 },
    ]
  },
  {
    meal_type: 'lunch', name: 'Kadhi Chawal', cuisine_type: 'Gujarati',
    sub_category: 'Dal Rice',
    description: 'Tangy yogurt-besan curry with pakoda, served over fluffy rice',
    prep_time_minutes: 10, cook_time_minutes: 30, servings: 4,
    calories_per_serving: 460, protein_g: 13, carbs_g: 66, fat_g: 15, fiber_g: 4,
    kitchen_equipment: 'kadai,pressure cooker', difficulty: 'medium',
    is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Dahi (curd)', quantity: '1', unit: 'cup', calories: 150 },
      { name: 'Besan', quantity: '3', unit: 'tbsp', calories: 100 },
      { name: 'Basmati rice (cooked)', quantity: '1.5', unit: 'cups', calories: 340 },
      { name: 'Ghee', quantity: '1', unit: 'tbsp', calories: 90 },
    ]
  },
  {
    meal_type: 'lunch', name: 'Mix Veg Thali', cuisine_type: 'Indian',
    sub_category: 'Thali',
    description: 'Complete thali with 2 sabzis, dal, rice, 2 rotis, salad and dahi',
    prep_time_minutes: 20, cook_time_minutes: 40, servings: 4,
    calories_per_serving: 680, protein_g: 22, carbs_g: 92, fat_g: 22, fiber_g: 10,
    kitchen_equipment: 'kadai,tawa,pressure cooker', difficulty: 'medium',
    is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Mixed sabzi', quantity: '2', unit: 'cups', calories: 300 },
      { name: 'Dal', quantity: '1', unit: 'cup', calories: 200 },
      { name: 'Rice', quantity: '1', unit: 'cup', calories: 200 },
      { name: 'Whole wheat roti', quantity: '2', unit: 'pcs', calories: 240 },
      { name: 'Dahi, salad', quantity: '1', unit: 'serving', calories: 100 },
    ]
  },

  // ─────────────────── LUNCH: Paneer Sabzi ──────────────────────
  {
    meal_type: 'lunch', name: 'Shahi Paneer', cuisine_type: 'Mughal',
    sub_category: 'Paneer Sabzi',
    description: 'Paneer in rich cashew-cream gravy with aromatic whole spices — royal treat',
    prep_time_minutes: 15, cook_time_minutes: 25, servings: 4,
    calories_per_serving: 560, protein_g: 20, carbs_g: 28, fat_g: 40, fiber_g: 3,
    kitchen_equipment: 'kadai,blender,tawa', difficulty: 'medium', is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Paneer', quantity: '250', unit: 'g', calories: 400 },
      { name: 'Cashew paste', quantity: '3', unit: 'tbsp', calories: 150 },
      { name: 'Cream', quantity: '3', unit: 'tbsp', calories: 150 },
      { name: 'Butter', quantity: '2', unit: 'tbsp', calories: 200 },
      { name: 'Whole wheat roti', quantity: '2', unit: 'pcs', calories: 240 },
    ]
  },
  {
    meal_type: 'lunch', name: 'Kadai Paneer', cuisine_type: 'North Indian',
    sub_category: 'Paneer Sabzi',
    description: 'Paneer and capsicum tossed in bold kadai masala with freshly ground spices',
    prep_time_minutes: 15, cook_time_minutes: 20, servings: 4,
    calories_per_serving: 490, protein_g: 20, carbs_g: 30, fat_g: 32, fiber_g: 5,
    kitchen_equipment: 'kadai,tawa', difficulty: 'medium', is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Paneer', quantity: '250', unit: 'g', calories: 400 },
      { name: 'Capsicum (diced)', quantity: '2', unit: 'medium', calories: 50 },
      { name: 'Tomato-onion gravy', quantity: '1', unit: 'cup', calories: 120 },
      { name: 'Oil', quantity: '2', unit: 'tbsp', calories: 240 },
      { name: 'Whole wheat roti', quantity: '2', unit: 'pcs', calories: 240 },
    ]
  },
  {
    meal_type: 'lunch', name: 'Paneer Do Pyaza', cuisine_type: 'North Indian',
    sub_category: 'Paneer Sabzi',
    description: 'Paneer cooked with double the onion in two stages — sweet and spicy',
    prep_time_minutes: 10, cook_time_minutes: 20, servings: 4,
    calories_per_serving: 470, protein_g: 18, carbs_g: 34, fat_g: 28, fiber_g: 4,
    kitchen_equipment: 'kadai,tawa', difficulty: 'medium', is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Paneer', quantity: '250', unit: 'g', calories: 400 },
      { name: 'Onion (large, quartered)', quantity: '3', unit: 'large', calories: 120 },
      { name: 'Oil', quantity: '2', unit: 'tbsp', calories: 240 },
      { name: 'Whole wheat roti', quantity: '2', unit: 'pcs', calories: 240 },
    ]
  },
  {
    meal_type: 'lunch', name: 'Paneer Tikka Masala', cuisine_type: 'Punjabi',
    sub_category: 'Paneer Sabzi',
    description: 'Grilled marinated paneer chunks simmered in smoky tomato-based masala gravy',
    prep_time_minutes: 20, cook_time_minutes: 25, servings: 4,
    calories_per_serving: 530, protein_g: 22, carbs_g: 32, fat_g: 34, fiber_g: 4,
    kitchen_equipment: 'grill/tawa,kadai', difficulty: 'medium', is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Paneer', quantity: '250', unit: 'g', calories: 400 },
      { name: 'Dahi (for marinade)', quantity: '3', unit: 'tbsp', calories: 50 },
      { name: 'Tomato gravy', quantity: '1', unit: 'cup', calories: 120 },
      { name: 'Cream', quantity: '2', unit: 'tbsp', calories: 100 },
      { name: 'Whole wheat roti', quantity: '2', unit: 'pcs', calories: 240 },
    ]
  },
  {
    meal_type: 'lunch', name: 'Paneer Lababdar', cuisine_type: 'Punjabi',
    sub_category: 'Paneer Sabzi',
    description: 'Soft paneer in a thick, indulgent onion-tomato-cashew gravy',
    prep_time_minutes: 15, cook_time_minutes: 25, servings: 4,
    calories_per_serving: 510, protein_g: 20, carbs_g: 30, fat_g: 35, fiber_g: 3,
    kitchen_equipment: 'kadai,blender,tawa', difficulty: 'medium', is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Paneer', quantity: '250', unit: 'g', calories: 400 },
      { name: 'Onion-tomato-cashew gravy', quantity: '1.5', unit: 'cups', calories: 250 },
      { name: 'Butter', quantity: '1.5', unit: 'tbsp', calories: 150 },
      { name: 'Whole wheat roti', quantity: '2', unit: 'pcs', calories: 240 },
    ]
  },

  // ─────────────────── LUNCH: Gobhi Sabzi ──────────────────────
  {
    meal_type: 'lunch', name: 'Gobhi Masala', cuisine_type: 'North Indian',
    sub_category: 'Gobhi Sabzi',
    description: 'Cauliflower florets in spicy tomato-onion masala gravy',
    prep_time_minutes: 10, cook_time_minutes: 25, servings: 4,
    calories_per_serving: 380, protein_g: 9, carbs_g: 50, fat_g: 16, fiber_g: 8,
    kitchen_equipment: 'kadai,tawa', difficulty: 'easy', is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Cauliflower', quantity: '1', unit: 'medium head', calories: 120 },
      { name: 'Tomato-onion masala', quantity: '1', unit: 'cup', calories: 120 },
      { name: 'Oil', quantity: '2', unit: 'tbsp', calories: 240 },
      { name: 'Whole wheat roti', quantity: '2', unit: 'pcs', calories: 240 },
    ]
  },
  {
    meal_type: 'lunch', name: 'Gobhi Matar', cuisine_type: 'North Indian',
    sub_category: 'Gobhi Sabzi',
    description: 'Cauliflower and green peas in a light spiced gravy',
    prep_time_minutes: 10, cook_time_minutes: 20, servings: 4,
    calories_per_serving: 370, protein_g: 10, carbs_g: 52, fat_g: 13, fiber_g: 8,
    kitchen_equipment: 'kadai,tawa', difficulty: 'easy', is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Cauliflower', quantity: '1', unit: 'small head', calories: 80 },
      { name: 'Green peas', quantity: '1', unit: 'cup', calories: 120 },
      { name: 'Oil', quantity: '2', unit: 'tbsp', calories: 240 },
      { name: 'Whole wheat roti', quantity: '2', unit: 'pcs', calories: 240 },
    ]
  },
  {
    meal_type: 'lunch', name: 'Achari Gobhi', cuisine_type: 'North Indian',
    sub_category: 'Gobhi Sabzi',
    description: 'Tangy cauliflower cooked with pickling spices — bold and appetising',
    prep_time_minutes: 10, cook_time_minutes: 20, servings: 4,
    calories_per_serving: 360, protein_g: 8, carbs_g: 48, fat_g: 15, fiber_g: 7,
    kitchen_equipment: 'kadai,tawa', difficulty: 'easy', is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Cauliflower', quantity: '1', unit: 'medium head', calories: 120 },
      { name: 'Mustard oil', quantity: '2', unit: 'tbsp', calories: 240 },
      { name: 'Pickling spices (saunf, kalonji, methi seeds)', quantity: '1', unit: 'tsp', calories: 8 },
      { name: 'Whole wheat roti', quantity: '2', unit: 'pcs', calories: 240 },
    ]
  },
  {
    meal_type: 'lunch', name: 'Gobhi Manchurian (Dry)', cuisine_type: 'Indo-Chinese',
    sub_category: 'Gobhi Sabzi',
    description: 'Crispy fried cauliflower tossed in a tangy Indo-Chinese sauce',
    prep_time_minutes: 15, cook_time_minutes: 20, servings: 4,
    calories_per_serving: 420, protein_g: 10, carbs_g: 58, fat_g: 17, fiber_g: 5,
    kitchen_equipment: 'kadai,deep pan', difficulty: 'medium', is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Cauliflower florets', quantity: '1', unit: 'large head', calories: 150 },
      { name: 'Cornflour, maida (batter)', quantity: '4', unit: 'tbsp', calories: 150 },
      { name: 'Soy sauce, tomato sauce', quantity: '2', unit: 'tbsp', calories: 40 },
      { name: 'Oil', quantity: '4', unit: 'tbsp', calories: 480 },
    ]
  },
  {
    meal_type: 'lunch', name: 'Dum Aloo Gobhi', cuisine_type: 'North Indian',
    sub_category: 'Gobhi Sabzi',
    description: 'Potato and cauliflower slow-cooked dum-style in rich spiced gravy',
    prep_time_minutes: 10, cook_time_minutes: 30, servings: 4,
    calories_per_serving: 430, protein_g: 9, carbs_g: 62, fat_g: 16, fiber_g: 7,
    kitchen_equipment: 'heavy pot,tawa', difficulty: 'medium', is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Potato', quantity: '3', unit: 'medium', calories: 240 },
      { name: 'Cauliflower', quantity: '1', unit: 'small head', calories: 80 },
      { name: 'Oil', quantity: '2', unit: 'tbsp', calories: 240 },
      { name: 'Whole wheat roti', quantity: '2', unit: 'pcs', calories: 240 },
    ]
  },

  // ─────────────────── LUNCH: Aloo Sabzi ──────────────────────
  {
    meal_type: 'lunch', name: 'Jeera Aloo', cuisine_type: 'North Indian',
    sub_category: 'Aloo Sabzi',
    description: 'Boiled potatoes tempered with cumin seeds, green chilli and coriander',
    prep_time_minutes: 5, cook_time_minutes: 15, servings: 4,
    calories_per_serving: 380, protein_g: 7, carbs_g: 62, fat_g: 11, fiber_g: 5,
    kitchen_equipment: 'kadai,tawa', difficulty: 'easy', is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Potato (boiled)', quantity: '4', unit: 'medium', calories: 320 },
      { name: 'Oil', quantity: '2', unit: 'tbsp', calories: 240 },
      { name: 'Cumin seeds (jeera)', quantity: '1.5', unit: 'tsp', calories: 8 },
      { name: 'Whole wheat roti', quantity: '2', unit: 'pcs', calories: 240 },
    ]
  },
  {
    meal_type: 'lunch', name: 'Dum Aloo', cuisine_type: 'Kashmiri',
    sub_category: 'Aloo Sabzi',
    description: 'Baby potatoes slow-cooked in spiced yogurt-based Kashmiri gravy',
    prep_time_minutes: 10, cook_time_minutes: 30, servings: 4,
    calories_per_serving: 430, protein_g: 8, carbs_g: 60, fat_g: 17, fiber_g: 5,
    kitchen_equipment: 'kadai,tawa', difficulty: 'medium', is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Baby potatoes', quantity: '500', unit: 'g', calories: 400 },
      { name: 'Dahi (curd)', quantity: '0.5', unit: 'cup', calories: 80 },
      { name: 'Oil', quantity: '2', unit: 'tbsp', calories: 240 },
      { name: 'Whole wheat roti', quantity: '2', unit: 'pcs', calories: 240 },
    ]
  },
  {
    meal_type: 'lunch', name: 'Aloo Palak', cuisine_type: 'North Indian',
    sub_category: 'Aloo Sabzi',
    description: 'Potato cubes cooked with spiced spinach — nutritious and hearty',
    prep_time_minutes: 10, cook_time_minutes: 20, servings: 4,
    calories_per_serving: 390, protein_g: 10, carbs_g: 56, fat_g: 13, fiber_g: 7,
    kitchen_equipment: 'kadai,tawa', difficulty: 'easy', is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Potato', quantity: '3', unit: 'medium', calories: 240 },
      { name: 'Spinach (palak)', quantity: '250', unit: 'g', calories: 50 },
      { name: 'Oil', quantity: '2', unit: 'tbsp', calories: 240 },
      { name: 'Whole wheat roti', quantity: '2', unit: 'pcs', calories: 240 },
    ]
  },
  {
    meal_type: 'lunch', name: 'Aloo Methi', cuisine_type: 'North Indian',
    sub_category: 'Aloo Sabzi',
    description: 'Potatoes stir-fried with fresh fenugreek leaves — slightly bitter, very flavourful',
    prep_time_minutes: 10, cook_time_minutes: 20, servings: 4,
    calories_per_serving: 370, protein_g: 8, carbs_g: 56, fat_g: 12, fiber_g: 7,
    kitchen_equipment: 'kadai,tawa', difficulty: 'easy', is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Potato', quantity: '3', unit: 'medium', calories: 240 },
      { name: 'Fresh methi leaves', quantity: '1', unit: 'cup', calories: 30 },
      { name: 'Oil', quantity: '2', unit: 'tbsp', calories: 240 },
      { name: 'Whole wheat roti', quantity: '2', unit: 'pcs', calories: 240 },
    ]
  },
  {
    meal_type: 'lunch', name: 'Aloo Tamatar', cuisine_type: 'North Indian',
    sub_category: 'Aloo Sabzi',
    description: 'Simple potato and tomato sabzi with spices — everyday North Indian staple',
    prep_time_minutes: 5, cook_time_minutes: 20, servings: 4,
    calories_per_serving: 360, protein_g: 7, carbs_g: 56, fat_g: 12, fiber_g: 5,
    kitchen_equipment: 'kadai,tawa', difficulty: 'easy', is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Potato', quantity: '3', unit: 'medium', calories: 240 },
      { name: 'Tomato', quantity: '3', unit: 'medium', calories: 60 },
      { name: 'Oil', quantity: '2', unit: 'tbsp', calories: 240 },
      { name: 'Whole wheat roti', quantity: '2', unit: 'pcs', calories: 240 },
    ]
  },
  {
    meal_type: 'lunch', name: 'Aloo Baingan', cuisine_type: 'North Indian',
    sub_category: 'Aloo Sabzi',
    description: 'Potato and brinjal cooked together in a spiced dry masala',
    prep_time_minutes: 10, cook_time_minutes: 20, servings: 4,
    calories_per_serving: 370, protein_g: 7, carbs_g: 54, fat_g: 14, fiber_g: 7,
    kitchen_equipment: 'kadai,tawa', difficulty: 'easy', is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Potato', quantity: '2', unit: 'medium', calories: 160 },
      { name: 'Brinjal', quantity: '2', unit: 'medium', calories: 60 },
      { name: 'Oil', quantity: '2', unit: 'tbsp', calories: 240 },
      { name: 'Whole wheat roti', quantity: '2', unit: 'pcs', calories: 240 },
    ]
  },

  // ─────────────────── LUNCH: Kadhi ──────────────────────
  {
    meal_type: 'lunch', name: 'Punjabi Kadhi Pakora', cuisine_type: 'Punjabi',
    sub_category: 'Kadhi',
    description: 'Thick, sour yogurt-besan curry loaded with fried onion-besan pakoras',
    prep_time_minutes: 20, cook_time_minutes: 40, servings: 4,
    calories_per_serving: 520, protein_g: 14, carbs_g: 58, fat_g: 24, fiber_g: 5,
    kitchen_equipment: 'kadai,deep pan,pressure cooker', difficulty: 'medium', is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Dahi (sour curd)', quantity: '1.5', unit: 'cups', calories: 220 },
      { name: 'Besan', quantity: '4', unit: 'tbsp', calories: 140 },
      { name: 'Onion pakora', quantity: '8', unit: 'pcs', calories: 320 },
      { name: 'Oil', quantity: '2', unit: 'tbsp', calories: 240 },
      { name: 'Steamed rice', quantity: '1', unit: 'cup', calories: 200 },
    ]
  },
  {
    meal_type: 'lunch', name: 'Rajasthani Kadhi', cuisine_type: 'Rajasthani',
    sub_category: 'Kadhi',
    description: 'Thin, tangy Rajasthani-style kadhi tempered with dried red chilli and ghee',
    prep_time_minutes: 10, cook_time_minutes: 25, servings: 4,
    calories_per_serving: 400, protein_g: 10, carbs_g: 52, fat_g: 16, fiber_g: 3,
    kitchen_equipment: 'kadai,pressure cooker', difficulty: 'easy', is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Dahi (curd)', quantity: '1', unit: 'cup', calories: 150 },
      { name: 'Besan', quantity: '2', unit: 'tbsp', calories: 70 },
      { name: 'Ghee', quantity: '2', unit: 'tbsp', calories: 180 },
      { name: 'Steamed rice', quantity: '1', unit: 'cup', calories: 200 },
    ]
  },
  {
    meal_type: 'lunch', name: 'Sindhi Kadhi', cuisine_type: 'Sindhi',
    sub_category: 'Kadhi',
    description: 'Besan-based Sindhi kadhi packed with mixed vegetables — no yogurt used',
    prep_time_minutes: 15, cook_time_minutes: 30, servings: 4,
    calories_per_serving: 440, protein_g: 10, carbs_g: 60, fat_g: 16, fiber_g: 8,
    kitchen_equipment: 'kadai,pressure cooker', difficulty: 'medium', is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Besan', quantity: '3', unit: 'tbsp', calories: 105 },
      { name: 'Mixed vegetables (potato, drumstick, cluster beans)', quantity: '2', unit: 'cups', calories: 200 },
      { name: 'Tamarind pulp', quantity: '2', unit: 'tbsp', calories: 30 },
      { name: 'Oil', quantity: '2', unit: 'tbsp', calories: 240 },
      { name: 'Steamed rice', quantity: '1', unit: 'cup', calories: 200 },
    ]
  },

  // ─────────────────── LUNCH: Raita ──────────────────────
  {
    meal_type: 'lunch', name: 'Boondi Raita', cuisine_type: 'North Indian',
    sub_category: 'Raita',
    description: 'Chilled yogurt with soaked boondi, cumin and red chilli — classic side dish',
    prep_time_minutes: 5, cook_time_minutes: 0, servings: 4,
    calories_per_serving: 160, protein_g: 7, carbs_g: 18, fat_g: 6, fiber_g: 1,
    kitchen_equipment: 'bowl', difficulty: 'easy', is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Dahi (curd)', quantity: '1.5', unit: 'cups', calories: 220 },
      { name: 'Boondi', quantity: '0.5', unit: 'cup', calories: 150 },
      { name: 'Roasted cumin powder', quantity: '0.5', unit: 'tsp', calories: 4 },
    ]
  },
  {
    meal_type: 'lunch', name: 'Cucumber Raita', cuisine_type: 'Indian',
    sub_category: 'Raita',
    description: 'Cooling grated cucumber in seasoned yogurt — refreshing with any heavy meal',
    prep_time_minutes: 5, cook_time_minutes: 0, servings: 4,
    calories_per_serving: 120, protein_g: 6, carbs_g: 12, fat_g: 5, fiber_g: 1,
    kitchen_equipment: 'bowl,grater', difficulty: 'easy', is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Dahi (curd)', quantity: '1.5', unit: 'cups', calories: 220 },
      { name: 'Cucumber (grated)', quantity: '1', unit: 'medium', calories: 20 },
      { name: 'Mint, cumin', quantity: '0.5', unit: 'tsp each', calories: 3 },
    ]
  },
  {
    meal_type: 'lunch', name: 'Onion Tomato Raita', cuisine_type: 'Indian',
    sub_category: 'Raita',
    description: 'Chunky onion and tomato mixed into spiced yogurt — great with biryani and pulao',
    prep_time_minutes: 5, cook_time_minutes: 0, servings: 4,
    calories_per_serving: 130, protein_g: 6, carbs_g: 14, fat_g: 5, fiber_g: 2,
    kitchen_equipment: 'bowl', difficulty: 'easy', is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Dahi (curd)', quantity: '1.5', unit: 'cups', calories: 220 },
      { name: 'Onion (finely chopped)', quantity: '1', unit: 'small', calories: 30 },
      { name: 'Tomato (chopped)', quantity: '1', unit: 'medium', calories: 20 },
    ]
  },
  {
    meal_type: 'lunch', name: 'Mixed Veg Raita', cuisine_type: 'Indian',
    sub_category: 'Raita',
    description: 'Yogurt mixed with grated carrot, cucumber, capsicum and beetroot',
    prep_time_minutes: 8, cook_time_minutes: 0, servings: 4,
    calories_per_serving: 140, protein_g: 7, carbs_g: 16, fat_g: 5, fiber_g: 3,
    kitchen_equipment: 'bowl,grater', difficulty: 'easy', is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Dahi (curd)', quantity: '1.5', unit: 'cups', calories: 220 },
      { name: 'Mixed vegetables (grated)', quantity: '0.5', unit: 'cup', calories: 40 },
      { name: 'Roasted cumin, salt', quantity: '0.5', unit: 'tsp', calories: 3 },
    ]
  },
  {
    meal_type: 'lunch', name: 'Palak Raita', cuisine_type: 'Indian',
    sub_category: 'Raita',
    description: 'Blanched and chopped spinach folded into spiced yogurt — iron-rich',
    prep_time_minutes: 8, cook_time_minutes: 5, servings: 4,
    calories_per_serving: 125, protein_g: 7, carbs_g: 12, fat_g: 5, fiber_g: 2,
    kitchen_equipment: 'bowl,saucepan', difficulty: 'easy', is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Dahi (curd)', quantity: '1.5', unit: 'cups', calories: 220 },
      { name: 'Spinach (blanched, chopped)', quantity: '0.5', unit: 'cup', calories: 20 },
      { name: 'Roasted cumin', quantity: '0.5', unit: 'tsp', calories: 3 },
    ]
  },

  // ─────────────────── LUNCH: Stuffed Sabzi ──────────────────────
  {
    meal_type: 'lunch', name: 'Bharwa Bhindi', cuisine_type: 'North Indian',
    sub_category: 'Stuffed Sabzi',
    description: 'Okra slit and stuffed with spiced besan-onion masala, pan-fried to perfection',
    prep_time_minutes: 20, cook_time_minutes: 20, servings: 4,
    calories_per_serving: 360, protein_g: 10, carbs_g: 44, fat_g: 16, fiber_g: 10,
    kitchen_equipment: 'kadai,spatula', difficulty: 'medium', is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Bhindi (okra)', quantity: '500', unit: 'g', calories: 150 },
      { name: 'Besan + spices (filling)', quantity: '3', unit: 'tbsp', calories: 100 },
      { name: 'Oil', quantity: '2', unit: 'tbsp', calories: 240 },
      { name: 'Whole wheat roti', quantity: '2', unit: 'pcs', calories: 240 },
    ]
  },
  {
    meal_type: 'lunch', name: 'Bharwa Baingan', cuisine_type: 'Maharashtrian',
    sub_category: 'Stuffed Sabzi',
    description: 'Small brinjals stuffed with peanut-coconut-sesame masala and braised in oil',
    prep_time_minutes: 20, cook_time_minutes: 25, servings: 4,
    calories_per_serving: 400, protein_g: 10, carbs_g: 42, fat_g: 22, fiber_g: 9,
    kitchen_equipment: 'kadai,spatula', difficulty: 'medium', is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Small brinjal (baingan)', quantity: '500', unit: 'g', calories: 130 },
      { name: 'Peanuts + coconut + sesame (filling)', quantity: '4', unit: 'tbsp', calories: 200 },
      { name: 'Oil', quantity: '2', unit: 'tbsp', calories: 240 },
      { name: 'Whole wheat roti', quantity: '2', unit: 'pcs', calories: 240 },
    ]
  },
  {
    meal_type: 'lunch', name: 'Bharwa Karela', cuisine_type: 'North Indian',
    sub_category: 'Stuffed Sabzi',
    description: 'Bitter gourd stuffed with spiced onion-amchur filling — an acquired taste',
    prep_time_minutes: 20, cook_time_minutes: 25, servings: 4,
    calories_per_serving: 320, protein_g: 7, carbs_g: 38, fat_g: 16, fiber_g: 6,
    kitchen_equipment: 'kadai,spatula', difficulty: 'medium', is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Karela (bitter gourd)', quantity: '500', unit: 'g', calories: 100 },
      { name: 'Onion + spice filling', quantity: '1', unit: 'cup', calories: 80 },
      { name: 'Oil', quantity: '2', unit: 'tbsp', calories: 240 },
      { name: 'Whole wheat roti', quantity: '2', unit: 'pcs', calories: 240 },
    ]
  },
  {
    meal_type: 'lunch', name: 'Bharwa Tamatar', cuisine_type: 'North Indian',
    sub_category: 'Stuffed Sabzi',
    description: 'Whole tomatoes stuffed with spiced paneer-potato filling and cooked in their own juices',
    prep_time_minutes: 15, cook_time_minutes: 20, servings: 4,
    calories_per_serving: 390, protein_g: 13, carbs_g: 44, fat_g: 18, fiber_g: 4,
    kitchen_equipment: 'kadai,oven optional', difficulty: 'medium', is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Large tomatoes', quantity: '8', unit: 'pcs', calories: 160 },
      { name: 'Paneer + potato filling', quantity: '1', unit: 'cup', calories: 280 },
      { name: 'Oil', quantity: '1.5', unit: 'tbsp', calories: 180 },
      { name: 'Whole wheat roti', quantity: '2', unit: 'pcs', calories: 240 },
    ]
  },

  // ─────────────────── LUNCH: Other Sabzi ──────────────────────
  {
    meal_type: 'lunch', name: 'Mushroom Masala', cuisine_type: 'North Indian',
    sub_category: 'Other Sabzi',
    description: 'Button mushrooms in a rich spiced tomato-onion gravy',
    prep_time_minutes: 10, cook_time_minutes: 20, servings: 4,
    calories_per_serving: 380, protein_g: 13, carbs_g: 36, fat_g: 20, fiber_g: 5,
    kitchen_equipment: 'kadai,tawa', difficulty: 'easy', is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Button mushrooms', quantity: '400', unit: 'g', calories: 100 },
      { name: 'Tomato-onion masala', quantity: '1', unit: 'cup', calories: 120 },
      { name: 'Oil', quantity: '2', unit: 'tbsp', calories: 240 },
      { name: 'Whole wheat roti', quantity: '2', unit: 'pcs', calories: 240 },
    ]
  },
  {
    meal_type: 'lunch', name: 'Soya Chunks Curry', cuisine_type: 'North Indian',
    sub_category: 'Other Sabzi',
    description: 'High-protein soya chunks simmered in a spiced tomato-onion gravy',
    prep_time_minutes: 15, cook_time_minutes: 20, servings: 4,
    calories_per_serving: 440, protein_g: 28, carbs_g: 46, fat_g: 16, fiber_g: 8,
    kitchen_equipment: 'kadai,tawa', difficulty: 'easy', is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Soya chunks (soaked)', quantity: '1.5', unit: 'cups', calories: 350 },
      { name: 'Tomato-onion masala', quantity: '1', unit: 'cup', calories: 120 },
      { name: 'Oil', quantity: '2', unit: 'tbsp', calories: 240 },
      { name: 'Whole wheat roti', quantity: '2', unit: 'pcs', calories: 240 },
    ]
  },
  {
    meal_type: 'lunch', name: 'Arbi Masala', cuisine_type: 'North Indian',
    sub_category: 'Other Sabzi',
    description: 'Crispy taro root cooked in tangy amchur-spiced masala',
    prep_time_minutes: 15, cook_time_minutes: 25, servings: 4,
    calories_per_serving: 420, protein_g: 7, carbs_g: 64, fat_g: 15, fiber_g: 6,
    kitchen_equipment: 'kadai,tawa', difficulty: 'medium', is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Arbi (taro root, boiled)', quantity: '500', unit: 'g', calories: 400 },
      { name: 'Oil', quantity: '2', unit: 'tbsp', calories: 240 },
      { name: 'Amchur, red chilli, coriander', quantity: '1', unit: 'tsp each', calories: 8 },
      { name: 'Whole wheat roti', quantity: '2', unit: 'pcs', calories: 240 },
    ]
  },
  {
    meal_type: 'lunch', name: 'Lobhia Masala', cuisine_type: 'North Indian',
    sub_category: 'Other Sabzi',
    description: 'Black-eyed peas in a tangy tomato-onion gravy — wholesome and earthy',
    prep_time_minutes: 10, cook_time_minutes: 30, servings: 4,
    calories_per_serving: 450, protein_g: 17, carbs_g: 66, fat_g: 13, fiber_g: 14,
    kitchen_equipment: 'pressure cooker,kadai,tawa', difficulty: 'easy', is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Lobhia (black-eyed peas)', quantity: '1', unit: 'cup', calories: 340 },
      { name: 'Tomato-onion masala', quantity: '1', unit: 'cup', calories: 120 },
      { name: 'Oil', quantity: '2', unit: 'tbsp', calories: 240 },
      { name: 'Whole wheat roti', quantity: '2', unit: 'pcs', calories: 240 },
    ]
  },
  {
    meal_type: 'lunch', name: 'Kathal Ki Sabzi', cuisine_type: 'North Indian',
    sub_category: 'Other Sabzi',
    description: 'Raw jackfruit cooked in spiced onion-tomato gravy — meaty texture, full of flavour',
    prep_time_minutes: 20, cook_time_minutes: 30, servings: 4,
    calories_per_serving: 410, protein_g: 8, carbs_g: 62, fat_g: 14, fiber_g: 9,
    kitchen_equipment: 'pressure cooker,kadai,tawa', difficulty: 'medium', is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Raw jackfruit (kathal)', quantity: '500', unit: 'g', calories: 260 },
      { name: 'Onion-tomato masala', quantity: '1', unit: 'cup', calories: 120 },
      { name: 'Oil', quantity: '2', unit: 'tbsp', calories: 240 },
      { name: 'Whole wheat roti', quantity: '2', unit: 'pcs', calories: 240 },
    ]
  },

  // ─────────────────── LUNCH: Dal varieties ──────────────────────
  {
    meal_type: 'lunch', name: 'Masoor Dal with Rice', cuisine_type: 'North Indian',
    sub_category: 'Dal Rice',
    description: 'Red lentil dal tempered with onion-tomato tadka, served with steamed rice',
    prep_time_minutes: 5, cook_time_minutes: 20, servings: 4,
    calories_per_serving: 450, protein_g: 16, carbs_g: 70, fat_g: 11, fiber_g: 8,
    kitchen_equipment: 'pressure cooker,kadai', difficulty: 'easy', is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Masoor dal (red lentil)', quantity: '1', unit: 'cup', calories: 360 },
      { name: 'Basmati rice (cooked)', quantity: '1.5', unit: 'cups', calories: 340 },
      { name: 'Oil', quantity: '1.5', unit: 'tbsp', calories: 180 },
    ]
  },
  {
    meal_type: 'lunch', name: 'Moong Dal Tadka with Rice', cuisine_type: 'Indian',
    sub_category: 'Dal Rice',
    description: 'Light yellow moong dal with a simple ghee-cumin-garlic tadka, served with rice',
    prep_time_minutes: 5, cook_time_minutes: 20, servings: 4,
    calories_per_serving: 430, protein_g: 15, carbs_g: 68, fat_g: 10, fiber_g: 7,
    kitchen_equipment: 'pressure cooker,kadai', difficulty: 'easy', is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Yellow moong dal', quantity: '1', unit: 'cup', calories: 340 },
      { name: 'Basmati rice (cooked)', quantity: '1.5', unit: 'cups', calories: 340 },
      { name: 'Ghee', quantity: '1.5', unit: 'tbsp', calories: 135 },
    ]
  },
  {
    meal_type: 'lunch', name: 'Chana Dal with Roti', cuisine_type: 'North Indian',
    sub_category: 'Dal Roti',
    description: 'Split chickpea dal with whole spices and a fragrant ghee tadka',
    prep_time_minutes: 10, cook_time_minutes: 30, servings: 4,
    calories_per_serving: 490, protein_g: 18, carbs_g: 64, fat_g: 15, fiber_g: 11,
    kitchen_equipment: 'pressure cooker,kadai,tawa', difficulty: 'easy', is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Chana dal', quantity: '1', unit: 'cup', calories: 380 },
      { name: 'Ghee', quantity: '1.5', unit: 'tbsp', calories: 135 },
      { name: 'Whole wheat roti', quantity: '2', unit: 'pcs', calories: 240 },
    ]
  },
  {
    meal_type: 'lunch', name: 'Panchmel Dal with Rice', cuisine_type: 'Rajasthani',
    sub_category: 'Dal Rice',
    description: 'Five lentils cooked together with spices — Rajasthani dal dhokli style',
    prep_time_minutes: 10, cook_time_minutes: 30, servings: 4,
    calories_per_serving: 480, protein_g: 18, carbs_g: 72, fat_g: 12, fiber_g: 10,
    kitchen_equipment: 'pressure cooker,kadai', difficulty: 'easy', is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Mixed dals (toor, moong, masoor, chana, urad)', quantity: '1', unit: 'cup', calories: 380 },
      { name: 'Basmati rice (cooked)', quantity: '1.5', unit: 'cups', calories: 340 },
      { name: 'Ghee', quantity: '1.5', unit: 'tbsp', calories: 135 },
    ]
  },

  // ─────────────────── LUNCH: Rice Dishes ──────────────────────
  {
    meal_type: 'lunch', name: 'Jeera Rice with Dal', cuisine_type: 'Indian',
    sub_category: 'Rice Dishes',
    description: 'Fragrant cumin-tempered rice served with toor dal — simple and satisfying',
    prep_time_minutes: 5, cook_time_minutes: 20, servings: 4,
    calories_per_serving: 460, protein_g: 13, carbs_g: 72, fat_g: 12, fiber_g: 4,
    kitchen_equipment: 'kadai,pressure cooker', difficulty: 'easy', is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Basmati rice', quantity: '1.5', unit: 'cups', calories: 510 },
      { name: 'Ghee', quantity: '1.5', unit: 'tbsp', calories: 135 },
      { name: 'Cumin seeds', quantity: '1', unit: 'tsp', calories: 5 },
      { name: 'Toor dal (cooked)', quantity: '1', unit: 'cup', calories: 200 },
    ]
  },
  {
    meal_type: 'lunch', name: 'Tomato Rice', cuisine_type: 'South Indian',
    sub_category: 'Rice Dishes',
    description: 'Tangy South Indian rice cooked with tomatoes and curry leaves tempering',
    prep_time_minutes: 5, cook_time_minutes: 20, servings: 4,
    calories_per_serving: 420, protein_g: 8, carbs_g: 68, fat_g: 12, fiber_g: 3,
    kitchen_equipment: 'kadai,pressure cooker', difficulty: 'easy', is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Basmati rice (cooked)', quantity: '1.5', unit: 'cups', calories: 340 },
      { name: 'Tomato', quantity: '3', unit: 'medium', calories: 60 },
      { name: 'Oil', quantity: '2', unit: 'tbsp', calories: 240 },
      { name: 'Mustard seeds, curry leaves', quantity: '1', unit: 'tsp', calories: 5 },
    ]
  },
  {
    meal_type: 'lunch', name: 'Curd Rice', cuisine_type: 'South Indian',
    sub_category: 'Rice Dishes',
    description: 'Cooked rice mixed with curd and tempered — a cooling South Indian classic',
    prep_time_minutes: 5, cook_time_minutes: 5, servings: 4,
    calories_per_serving: 380, protein_g: 11, carbs_g: 56, fat_g: 10, fiber_g: 1,
    kitchen_equipment: 'kadai,bowl', difficulty: 'easy', is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Rice (cooked)', quantity: '1.5', unit: 'cups', calories: 340 },
      { name: 'Dahi (curd)', quantity: '1', unit: 'cup', calories: 150 },
      { name: 'Oil', quantity: '1', unit: 'tbsp', calories: 120 },
      { name: 'Mustard seeds, curry leaves', quantity: '1', unit: 'tsp', calories: 5 },
    ]
  },
  {
    meal_type: 'lunch', name: 'Lemon Rice', cuisine_type: 'South Indian',
    sub_category: 'Rice Dishes',
    description: 'Zesty South Indian rice with lemon juice, peanuts and curry leaf tempering',
    prep_time_minutes: 5, cook_time_minutes: 10, servings: 4,
    calories_per_serving: 400, protein_g: 8, carbs_g: 62, fat_g: 13, fiber_g: 2,
    kitchen_equipment: 'kadai,bowl', difficulty: 'easy', is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Rice (cooked)', quantity: '1.5', unit: 'cups', calories: 340 },
      { name: 'Lemon juice', quantity: '2', unit: 'tbsp', calories: 8 },
      { name: 'Peanuts', quantity: '2', unit: 'tbsp', calories: 100 },
      { name: 'Oil', quantity: '1.5', unit: 'tbsp', calories: 180 },
    ]
  },

  // ─────────────────────────────────────────────
  // DINNER
  // ─────────────────────────────────────────────
  {
    meal_type: 'dinner', name: 'Dal Khichdi', cuisine_type: 'Indian',
    sub_category: 'Khichdi Rice',
    description: 'Light one-pot rice and moong dal khichdi — easy to digest, perfect dinner',
    prep_time_minutes: 5, cook_time_minutes: 25, servings: 4,
    calories_per_serving: 380, protein_g: 14, carbs_g: 60, fat_g: 10, fiber_g: 5,
    kitchen_equipment: 'pressure cooker,kadai', difficulty: 'easy',
    is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Rice', quantity: '1', unit: 'cup', calories: 340 },
      { name: 'Moong dal', quantity: '0.5', unit: 'cup', calories: 170 },
      { name: 'Ghee', quantity: '1.5', unit: 'tbsp', calories: 135 },
      { name: 'Turmeric, jeera', quantity: '1', unit: 'tsp', calories: 5 },
    ]
  },
  {
    meal_type: 'dinner', name: 'Aloo Matar with Roti', cuisine_type: 'North Indian',
    sub_category: 'Roti Sabzi',
    description: 'Comforting potato and peas curry in tomato-based gravy served with 2 rotis',
    prep_time_minutes: 10, cook_time_minutes: 25, servings: 4,
    calories_per_serving: 440, protein_g: 12, carbs_g: 66, fat_g: 14, fiber_g: 8,
    kitchen_equipment: 'kadai,tawa', difficulty: 'easy',
    is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Potato', quantity: '3', unit: 'medium', calories: 240 },
      { name: 'Green peas', quantity: '1', unit: 'cup', calories: 120 },
      { name: 'Oil', quantity: '2', unit: 'tbsp', calories: 240 },
      { name: 'Whole wheat roti', quantity: '2', unit: 'pcs', calories: 240 },
    ]
  },
  {
    meal_type: 'dinner', name: 'Lauki Sabzi with Roti', cuisine_type: 'North Indian',
    sub_category: 'Roti Sabzi',
    description: 'Light bottle gourd curry — low calorie, easy to digest, great for dinner',
    prep_time_minutes: 10, cook_time_minutes: 20, servings: 4,
    calories_per_serving: 350, protein_g: 8, carbs_g: 56, fat_g: 10, fiber_g: 7,
    kitchen_equipment: 'kadai,tawa', difficulty: 'easy',
    is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Lauki (bottle gourd)', quantity: '500', unit: 'g', calories: 80 },
      { name: 'Oil', quantity: '1.5', unit: 'tbsp', calories: 180 },
      { name: 'Spices', quantity: '1', unit: 'tsp', calories: 5 },
      { name: 'Whole wheat roti', quantity: '2', unit: 'pcs', calories: 240 },
    ]
  },
  {
    meal_type: 'dinner', name: 'Paneer Bhurji with Roti', cuisine_type: 'North Indian',
    sub_category: 'Roti Sabzi',
    description: 'Scrambled crumbled paneer with onion, tomato and spices, served with 2 rotis',
    prep_time_minutes: 10, cook_time_minutes: 15, servings: 4,
    calories_per_serving: 490, protein_g: 22, carbs_g: 50, fat_g: 24, fiber_g: 4,
    kitchen_equipment: 'kadai,tawa', difficulty: 'easy',
    is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Paneer', quantity: '250', unit: 'g', calories: 400 },
      { name: 'Onion, tomato, capsicum', quantity: '2', unit: 'medium', calories: 100 },
      { name: 'Oil', quantity: '1.5', unit: 'tbsp', calories: 180 },
      { name: 'Whole wheat roti', quantity: '2', unit: 'pcs', calories: 240 },
    ]
  },
  {
    meal_type: 'dinner', name: 'Methi Thepla with Dahi', cuisine_type: 'Gujarati',
    sub_category: 'Roti Sabzi',
    description: 'Soft spiced fenugreek flatbreads served with fresh curd — light and wholesome',
    prep_time_minutes: 15, cook_time_minutes: 20, servings: 4,
    calories_per_serving: 400, protein_g: 13, carbs_g: 56, fat_g: 14, fiber_g: 7,
    kitchen_equipment: 'tawa,rolling pin', difficulty: 'easy',
    is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Whole wheat flour', quantity: '2', unit: 'cups', calories: 400 },
      { name: 'Fresh methi leaves', quantity: '1', unit: 'cup', calories: 30 },
      { name: 'Dahi (curd)', quantity: '3', unit: 'tbsp', calories: 50 },
      { name: 'Oil', quantity: '2', unit: 'tbsp', calories: 240 },
      { name: 'Dahi (serving)', quantity: '0.5', unit: 'cup', calories: 80 },
    ]
  },
  {
    meal_type: 'dinner', name: 'Coconut Rice with Sambar', cuisine_type: 'South Indian',
    sub_category: 'Khichdi Rice',
    description: 'Fragrant coconut-tempered rice served with toor dal sambar and papad',
    prep_time_minutes: 10, cook_time_minutes: 20, servings: 4,
    calories_per_serving: 450, protein_g: 10, carbs_g: 70, fat_g: 14, fiber_g: 4,
    kitchen_equipment: 'kadai,pressure cooker', difficulty: 'easy',
    is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Basmati rice (cooked)', quantity: '1.5', unit: 'cups', calories: 340 },
      { name: 'Fresh coconut (grated)', quantity: '0.5', unit: 'cup', calories: 160 },
      { name: 'Oil', quantity: '1.5', unit: 'tbsp', calories: 180 },
      { name: 'Sambar', quantity: '1', unit: 'cup', calories: 80 },
    ]
  },
  {
    meal_type: 'dinner', name: 'Veg Pulao with Raita', cuisine_type: 'Indian',
    sub_category: 'Khichdi Rice',
    description: 'Mildly spiced vegetable pulao served with refreshing boondi raita',
    prep_time_minutes: 10, cook_time_minutes: 25, servings: 4,
    calories_per_serving: 460, protein_g: 11, carbs_g: 70, fat_g: 14, fiber_g: 5,
    kitchen_equipment: 'heavy pot,pressure cooker', difficulty: 'easy',
    is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Basmati rice', quantity: '1.5', unit: 'cups', calories: 510 },
      { name: 'Mixed vegetables', quantity: '1.5', unit: 'cups', calories: 120 },
      { name: 'Ghee', quantity: '2', unit: 'tbsp', calories: 180 },
      { name: 'Dahi (for raita)', quantity: '0.5', unit: 'cup', calories: 80 },
    ]
  },
  {
    meal_type: 'dinner', name: 'Stuffed Capsicum with Roti', cuisine_type: 'Indian',
    sub_category: 'Roti Sabzi',
    description: 'Bell peppers stuffed with spiced paneer and potato, served with 2 rotis',
    prep_time_minutes: 15, cook_time_minutes: 25, servings: 4,
    calories_per_serving: 430, protein_g: 16, carbs_g: 56, fat_g: 16, fiber_g: 6,
    kitchen_equipment: 'oven/kadai,tawa', difficulty: 'medium',
    is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Capsicum (bell pepper)', quantity: '4', unit: 'large', calories: 80 },
      { name: 'Paneer', quantity: '150', unit: 'g', calories: 240 },
      { name: 'Potato (boiled)', quantity: '2', unit: 'medium', calories: 160 },
      { name: 'Oil', quantity: '2', unit: 'tbsp', calories: 240 },
      { name: 'Whole wheat roti', quantity: '2', unit: 'pcs', calories: 240 },
    ]
  },
  {
    meal_type: 'dinner', name: 'Dahi Aloo with Roti', cuisine_type: 'North Indian',
    sub_category: 'Roti Sabzi',
    description: 'Potatoes cooked in tangy yogurt gravy — light and flavourful dinner',
    prep_time_minutes: 10, cook_time_minutes: 20, servings: 4,
    calories_per_serving: 400, protein_g: 10, carbs_g: 62, fat_g: 11, fiber_g: 5,
    kitchen_equipment: 'kadai,tawa', difficulty: 'easy',
    is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Baby potato / regular potato', quantity: '400', unit: 'g', calories: 320 },
      { name: 'Dahi (curd)', quantity: '0.5', unit: 'cup', calories: 80 },
      { name: 'Oil', quantity: '1.5', unit: 'tbsp', calories: 180 },
      { name: 'Whole wheat roti', quantity: '2', unit: 'pcs', calories: 240 },
    ]
  },
  {
    meal_type: 'dinner', name: 'Sabudana Khichdi', cuisine_type: 'Indian',
    sub_category: 'Other Breakfast',
    description: 'Light tapioca pearl khichdi with peanuts and cumin — easy on the stomach',
    prep_time_minutes: 30, cook_time_minutes: 15, servings: 4,
    calories_per_serving: 420, protein_g: 8, carbs_g: 68, fat_g: 13, fiber_g: 2,
    kitchen_equipment: 'kadai,spatula', difficulty: 'medium',
    is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Sabudana', quantity: '1.5', unit: 'cups', calories: 540 },
      { name: 'Peanuts (roasted)', quantity: '0.5', unit: 'cup', calories: 280 },
      { name: 'Potato', quantity: '1', unit: 'medium', calories: 80 },
      { name: 'Oil', quantity: '1.5', unit: 'tbsp', calories: 180 },
    ]
  },

  // ─────────────────── DINNER: Paneer Sabzi ──────────────────────
  {
    meal_type: 'dinner', name: 'Shahi Paneer', cuisine_type: 'Mughal',
    sub_category: 'Paneer Sabzi',
    description: 'Paneer in rich cashew-cream gravy with aromatic spices — indulgent dinner',
    prep_time_minutes: 15, cook_time_minutes: 25, servings: 4,
    calories_per_serving: 560, protein_g: 20, carbs_g: 28, fat_g: 40, fiber_g: 3,
    kitchen_equipment: 'kadai,blender,tawa', difficulty: 'medium', is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Paneer', quantity: '250', unit: 'g', calories: 400 },
      { name: 'Cashew paste', quantity: '3', unit: 'tbsp', calories: 150 },
      { name: 'Cream', quantity: '3', unit: 'tbsp', calories: 150 },
      { name: 'Butter', quantity: '2', unit: 'tbsp', calories: 200 },
      { name: 'Whole wheat roti', quantity: '2', unit: 'pcs', calories: 240 },
    ]
  },
  {
    meal_type: 'dinner', name: 'Kadai Paneer', cuisine_type: 'North Indian',
    sub_category: 'Paneer Sabzi',
    description: 'Paneer and capsicum in bold kadai masala — fragrant and satisfying dinner',
    prep_time_minutes: 15, cook_time_minutes: 20, servings: 4,
    calories_per_serving: 490, protein_g: 20, carbs_g: 30, fat_g: 32, fiber_g: 5,
    kitchen_equipment: 'kadai,tawa', difficulty: 'medium', is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Paneer', quantity: '250', unit: 'g', calories: 400 },
      { name: 'Capsicum (diced)', quantity: '2', unit: 'medium', calories: 50 },
      { name: 'Tomato-onion gravy', quantity: '1', unit: 'cup', calories: 120 },
      { name: 'Oil', quantity: '2', unit: 'tbsp', calories: 240 },
      { name: 'Whole wheat roti', quantity: '2', unit: 'pcs', calories: 240 },
    ]
  },
  {
    meal_type: 'dinner', name: 'Matar Paneer', cuisine_type: 'North Indian',
    sub_category: 'Paneer Sabzi',
    description: 'Green peas and paneer in spiced tomato-onion gravy with rotis',
    prep_time_minutes: 10, cook_time_minutes: 25, servings: 4,
    calories_per_serving: 490, protein_g: 19, carbs_g: 58, fat_g: 20, fiber_g: 7,
    kitchen_equipment: 'kadai,tawa', difficulty: 'easy', is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Paneer', quantity: '200', unit: 'g', calories: 320 },
      { name: 'Green peas', quantity: '1', unit: 'cup', calories: 120 },
      { name: 'Tomato-onion gravy', quantity: '1', unit: 'cup', calories: 120 },
      { name: 'Whole wheat roti', quantity: '2', unit: 'pcs', calories: 240 },
    ]
  },
  {
    meal_type: 'dinner', name: 'Paneer Saag', cuisine_type: 'Punjabi',
    sub_category: 'Paneer Sabzi',
    description: 'Tender paneer cubes in mustard-spinach saag — rustic Punjabi winter dinner',
    prep_time_minutes: 15, cook_time_minutes: 30, servings: 4,
    calories_per_serving: 500, protein_g: 22, carbs_g: 30, fat_g: 32, fiber_g: 8,
    kitchen_equipment: 'kadai,tawa,blender', difficulty: 'medium', is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Paneer', quantity: '200', unit: 'g', calories: 320 },
      { name: 'Sarson (mustard greens)', quantity: '300', unit: 'g', calories: 60 },
      { name: 'Spinach', quantity: '200', unit: 'g', calories: 40 },
      { name: 'Butter', quantity: '2', unit: 'tbsp', calories: 200 },
      { name: 'Makki roti', quantity: '2', unit: 'pcs', calories: 280 },
    ]
  },
  {
    meal_type: 'dinner', name: 'Paneer Kofta Curry', cuisine_type: 'North Indian',
    sub_category: 'Paneer Sabzi',
    description: 'Soft paneer koftas in a rich golden onion-tomato gravy',
    prep_time_minutes: 20, cook_time_minutes: 30, servings: 4,
    calories_per_serving: 580, protein_g: 22, carbs_g: 36, fat_g: 38, fiber_g: 4,
    kitchen_equipment: 'kadai,deep pan,tawa', difficulty: 'hard', is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Paneer', quantity: '250', unit: 'g', calories: 400 },
      { name: 'Onion-tomato gravy', quantity: '1.5', unit: 'cups', calories: 200 },
      { name: 'Oil', quantity: '3', unit: 'tbsp', calories: 360 },
      { name: 'Whole wheat roti', quantity: '2', unit: 'pcs', calories: 240 },
    ]
  },

  // ─────────────────── DINNER: Gobhi Sabzi ──────────────────────
  {
    meal_type: 'dinner', name: 'Gobhi Masala', cuisine_type: 'North Indian',
    sub_category: 'Gobhi Sabzi',
    description: 'Cauliflower in spicy tomato-onion masala — light and warming dinner',
    prep_time_minutes: 10, cook_time_minutes: 25, servings: 4,
    calories_per_serving: 380, protein_g: 9, carbs_g: 50, fat_g: 16, fiber_g: 8,
    kitchen_equipment: 'kadai,tawa', difficulty: 'easy', is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Cauliflower', quantity: '1', unit: 'medium head', calories: 120 },
      { name: 'Tomato-onion masala', quantity: '1', unit: 'cup', calories: 120 },
      { name: 'Oil', quantity: '2', unit: 'tbsp', calories: 240 },
      { name: 'Whole wheat roti', quantity: '2', unit: 'pcs', calories: 240 },
    ]
  },
  {
    meal_type: 'dinner', name: 'Aloo Gobhi (Dry)', cuisine_type: 'North Indian',
    sub_category: 'Gobhi Sabzi',
    description: 'Dry spiced potato-cauliflower stir fry — a comforting dinner staple',
    prep_time_minutes: 10, cook_time_minutes: 25, servings: 4,
    calories_per_serving: 400, protein_g: 9, carbs_g: 60, fat_g: 14, fiber_g: 8,
    kitchen_equipment: 'kadai,tawa', difficulty: 'easy', is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Potato', quantity: '2', unit: 'medium', calories: 160 },
      { name: 'Cauliflower', quantity: '1', unit: 'small head', calories: 80 },
      { name: 'Oil', quantity: '2', unit: 'tbsp', calories: 240 },
      { name: 'Whole wheat roti', quantity: '2', unit: 'pcs', calories: 240 },
    ]
  },
  {
    meal_type: 'dinner', name: 'Gobhi Matar Sabzi', cuisine_type: 'North Indian',
    sub_category: 'Gobhi Sabzi',
    description: 'Cauliflower and peas in a light, aromatic gravy — easy wholesome dinner',
    prep_time_minutes: 10, cook_time_minutes: 20, servings: 4,
    calories_per_serving: 360, protein_g: 10, carbs_g: 52, fat_g: 12, fiber_g: 8,
    kitchen_equipment: 'kadai,tawa', difficulty: 'easy', is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Cauliflower', quantity: '1', unit: 'small head', calories: 80 },
      { name: 'Green peas', quantity: '1', unit: 'cup', calories: 120 },
      { name: 'Oil', quantity: '2', unit: 'tbsp', calories: 240 },
      { name: 'Whole wheat roti', quantity: '2', unit: 'pcs', calories: 240 },
    ]
  },

  // ─────────────────── DINNER: Aloo Sabzi ──────────────────────
  {
    meal_type: 'dinner', name: 'Jeera Aloo', cuisine_type: 'North Indian',
    sub_category: 'Aloo Sabzi',
    description: 'Boiled potatoes tempered with cumin — quick, light and satisfying dinner side',
    prep_time_minutes: 5, cook_time_minutes: 15, servings: 4,
    calories_per_serving: 380, protein_g: 7, carbs_g: 62, fat_g: 11, fiber_g: 5,
    kitchen_equipment: 'kadai,tawa', difficulty: 'easy', is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Potato (boiled)', quantity: '4', unit: 'medium', calories: 320 },
      { name: 'Oil', quantity: '2', unit: 'tbsp', calories: 240 },
      { name: 'Cumin seeds', quantity: '1.5', unit: 'tsp', calories: 8 },
      { name: 'Whole wheat roti', quantity: '2', unit: 'pcs', calories: 240 },
    ]
  },
  {
    meal_type: 'dinner', name: 'Aloo Palak', cuisine_type: 'North Indian',
    sub_category: 'Aloo Sabzi',
    description: 'Potatoes cooked in spiced spinach — iron-rich and hearty dinner',
    prep_time_minutes: 10, cook_time_minutes: 20, servings: 4,
    calories_per_serving: 390, protein_g: 10, carbs_g: 56, fat_g: 13, fiber_g: 7,
    kitchen_equipment: 'kadai,tawa', difficulty: 'easy', is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Potato', quantity: '3', unit: 'medium', calories: 240 },
      { name: 'Spinach (palak)', quantity: '250', unit: 'g', calories: 50 },
      { name: 'Oil', quantity: '2', unit: 'tbsp', calories: 240 },
      { name: 'Whole wheat roti', quantity: '2', unit: 'pcs', calories: 240 },
    ]
  },
  {
    meal_type: 'dinner', name: 'Dum Aloo', cuisine_type: 'Kashmiri',
    sub_category: 'Aloo Sabzi',
    description: 'Baby potatoes slow-cooked in spiced yogurt-based gravy — rich dinner option',
    prep_time_minutes: 10, cook_time_minutes: 30, servings: 4,
    calories_per_serving: 430, protein_g: 8, carbs_g: 60, fat_g: 17, fiber_g: 5,
    kitchen_equipment: 'kadai,tawa', difficulty: 'medium', is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Baby potatoes', quantity: '500', unit: 'g', calories: 400 },
      { name: 'Dahi (curd)', quantity: '0.5', unit: 'cup', calories: 80 },
      { name: 'Oil', quantity: '2', unit: 'tbsp', calories: 240 },
      { name: 'Whole wheat roti', quantity: '2', unit: 'pcs', calories: 240 },
    ]
  },

  // ─────────────────── DINNER: Kadhi ──────────────────────
  {
    meal_type: 'dinner', name: 'Punjabi Kadhi Pakora', cuisine_type: 'Punjabi',
    sub_category: 'Kadhi',
    description: 'Thick sour yogurt-besan curry with fried pakoras — classic dinner comfort food',
    prep_time_minutes: 20, cook_time_minutes: 40, servings: 4,
    calories_per_serving: 520, protein_g: 14, carbs_g: 58, fat_g: 24, fiber_g: 5,
    kitchen_equipment: 'kadai,deep pan', difficulty: 'medium', is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Dahi (sour curd)', quantity: '1.5', unit: 'cups', calories: 220 },
      { name: 'Besan', quantity: '4', unit: 'tbsp', calories: 140 },
      { name: 'Onion pakora', quantity: '8', unit: 'pcs', calories: 320 },
      { name: 'Oil', quantity: '2', unit: 'tbsp', calories: 240 },
      { name: 'Steamed rice', quantity: '1', unit: 'cup', calories: 200 },
    ]
  },
  {
    meal_type: 'dinner', name: 'Gujarati Kadhi', cuisine_type: 'Gujarati',
    sub_category: 'Kadhi',
    description: 'Sweet-tangy thin Gujarati kadhi with mustard-curry leaf tempering',
    prep_time_minutes: 5, cook_time_minutes: 15, servings: 4,
    calories_per_serving: 360, protein_g: 9, carbs_g: 50, fat_g: 13, fiber_g: 2,
    kitchen_equipment: 'kadai,pressure cooker', difficulty: 'easy', is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Dahi (curd)', quantity: '1', unit: 'cup', calories: 150 },
      { name: 'Besan', quantity: '2', unit: 'tbsp', calories: 70 },
      { name: 'Sugar', quantity: '1', unit: 'tsp', calories: 20 },
      { name: 'Ghee', quantity: '1.5', unit: 'tbsp', calories: 135 },
      { name: 'Steamed rice', quantity: '1', unit: 'cup', calories: 200 },
    ]
  },
  {
    meal_type: 'dinner', name: 'Rajasthani Kadhi', cuisine_type: 'Rajasthani',
    sub_category: 'Kadhi',
    description: 'Thin tangy Rajasthani kadhi tempered with dried red chilli and ghee',
    prep_time_minutes: 10, cook_time_minutes: 25, servings: 4,
    calories_per_serving: 400, protein_g: 10, carbs_g: 52, fat_g: 16, fiber_g: 3,
    kitchen_equipment: 'kadai,pressure cooker', difficulty: 'easy', is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Dahi (curd)', quantity: '1', unit: 'cup', calories: 150 },
      { name: 'Besan', quantity: '2', unit: 'tbsp', calories: 70 },
      { name: 'Ghee', quantity: '2', unit: 'tbsp', calories: 180 },
      { name: 'Steamed rice', quantity: '1', unit: 'cup', calories: 200 },
    ]
  },

  // ─────────────────── DINNER: Raita ──────────────────────
  {
    meal_type: 'dinner', name: 'Boondi Raita', cuisine_type: 'North Indian',
    sub_category: 'Raita',
    description: 'Classic boondi raita — cooling side dish perfect with any dinner',
    prep_time_minutes: 5, cook_time_minutes: 0, servings: 4,
    calories_per_serving: 160, protein_g: 7, carbs_g: 18, fat_g: 6, fiber_g: 1,
    kitchen_equipment: 'bowl', difficulty: 'easy', is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Dahi (curd)', quantity: '1.5', unit: 'cups', calories: 220 },
      { name: 'Boondi', quantity: '0.5', unit: 'cup', calories: 150 },
      { name: 'Roasted cumin powder', quantity: '0.5', unit: 'tsp', calories: 4 },
    ]
  },
  {
    meal_type: 'dinner', name: 'Mixed Veg Raita', cuisine_type: 'Indian',
    sub_category: 'Raita',
    description: 'Yogurt with grated carrot, cucumber, capsicum — refreshing with dinner',
    prep_time_minutes: 8, cook_time_minutes: 0, servings: 4,
    calories_per_serving: 140, protein_g: 7, carbs_g: 16, fat_g: 5, fiber_g: 3,
    kitchen_equipment: 'bowl,grater', difficulty: 'easy', is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Dahi (curd)', quantity: '1.5', unit: 'cups', calories: 220 },
      { name: 'Mixed vegetables (grated)', quantity: '0.5', unit: 'cup', calories: 40 },
      { name: 'Roasted cumin, salt', quantity: '0.5', unit: 'tsp', calories: 3 },
    ]
  },
  {
    meal_type: 'dinner', name: 'Palak Raita', cuisine_type: 'Indian',
    sub_category: 'Raita',
    description: 'Blanched spinach folded into spiced yogurt — iron-rich dinner side',
    prep_time_minutes: 8, cook_time_minutes: 5, servings: 4,
    calories_per_serving: 125, protein_g: 7, carbs_g: 12, fat_g: 5, fiber_g: 2,
    kitchen_equipment: 'bowl,saucepan', difficulty: 'easy', is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Dahi (curd)', quantity: '1.5', unit: 'cups', calories: 220 },
      { name: 'Spinach (blanched, chopped)', quantity: '0.5', unit: 'cup', calories: 20 },
      { name: 'Roasted cumin', quantity: '0.5', unit: 'tsp', calories: 3 },
    ]
  },

  // ─────────────────── DINNER: Dal varieties ──────────────────────
  {
    meal_type: 'dinner', name: 'Dal Tadka with Roti', cuisine_type: 'North Indian',
    sub_category: 'Dal Roti',
    description: 'Yellow toor dal with smoky ghee tadka — simple nourishing dinner',
    prep_time_minutes: 10, cook_time_minutes: 30, servings: 4,
    calories_per_serving: 470, protein_g: 15, carbs_g: 64, fat_g: 14, fiber_g: 7,
    kitchen_equipment: 'pressure cooker,kadai,tawa', difficulty: 'easy', is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Toor dal', quantity: '1', unit: 'cup', calories: 380 },
      { name: 'Ghee', quantity: '2', unit: 'tbsp', calories: 180 },
      { name: 'Onion, tomato, spices', quantity: '1', unit: 'serving', calories: 80 },
      { name: 'Whole wheat roti', quantity: '2', unit: 'pcs', calories: 240 },
    ]
  },
  {
    meal_type: 'dinner', name: 'Dal Makhani', cuisine_type: 'Punjabi',
    sub_category: 'Dal Roti',
    description: 'Slow-cooked creamy black dal with butter — an indulgent dinner classic',
    prep_time_minutes: 10, cook_time_minutes: 60, servings: 4,
    calories_per_serving: 540, protein_g: 18, carbs_g: 62, fat_g: 22, fiber_g: 9,
    kitchen_equipment: 'pressure cooker,kadai,tawa', difficulty: 'medium', is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Black urad dal (whole)', quantity: '1', unit: 'cup', calories: 380 },
      { name: 'Butter', quantity: '2', unit: 'tbsp', calories: 200 },
      { name: 'Cream', quantity: '2', unit: 'tbsp', calories: 100 },
      { name: 'Whole wheat roti', quantity: '2', unit: 'pcs', calories: 240 },
    ]
  },
  {
    meal_type: 'dinner', name: 'Moong Dal Khichdi', cuisine_type: 'Indian',
    sub_category: 'Khichdi Rice',
    description: 'Light moong dal and rice khichdi with ghee — easy to digest, ideal dinner',
    prep_time_minutes: 5, cook_time_minutes: 25, servings: 4,
    calories_per_serving: 400, protein_g: 14, carbs_g: 62, fat_g: 11, fiber_g: 5,
    kitchen_equipment: 'pressure cooker,kadai', difficulty: 'easy', is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Rice', quantity: '0.75', unit: 'cup', calories: 255 },
      { name: 'Moong dal', quantity: '0.75', unit: 'cup', calories: 255 },
      { name: 'Ghee', quantity: '2', unit: 'tbsp', calories: 180 },
      { name: 'Turmeric, jeera', quantity: '1', unit: 'tsp', calories: 5 },
    ]
  },
  {
    meal_type: 'dinner', name: 'Masoor Dal with Roti', cuisine_type: 'North Indian',
    sub_category: 'Dal Roti',
    description: 'Red lentil dal with onion-tomato tadka, served with 2 rotis',
    prep_time_minutes: 5, cook_time_minutes: 20, servings: 4,
    calories_per_serving: 450, protein_g: 16, carbs_g: 62, fat_g: 12, fiber_g: 8,
    kitchen_equipment: 'pressure cooker,kadai,tawa', difficulty: 'easy', is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Masoor dal (red lentil)', quantity: '1', unit: 'cup', calories: 360 },
      { name: 'Oil', quantity: '1.5', unit: 'tbsp', calories: 180 },
      { name: 'Whole wheat roti', quantity: '2', unit: 'pcs', calories: 240 },
    ]
  },

  // ─────────────────── DINNER: Stuffed Sabzi ──────────────────────
  {
    meal_type: 'dinner', name: 'Bharwa Bhindi', cuisine_type: 'North Indian',
    sub_category: 'Stuffed Sabzi',
    description: 'Okra stuffed with spiced besan-onion masala — flavourful dinner option',
    prep_time_minutes: 20, cook_time_minutes: 20, servings: 4,
    calories_per_serving: 360, protein_g: 10, carbs_g: 44, fat_g: 16, fiber_g: 10,
    kitchen_equipment: 'kadai,spatula', difficulty: 'medium', is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Bhindi (okra)', quantity: '500', unit: 'g', calories: 150 },
      { name: 'Besan + spices (filling)', quantity: '3', unit: 'tbsp', calories: 100 },
      { name: 'Oil', quantity: '2', unit: 'tbsp', calories: 240 },
      { name: 'Whole wheat roti', quantity: '2', unit: 'pcs', calories: 240 },
    ]
  },
  {
    meal_type: 'dinner', name: 'Bharwa Baingan', cuisine_type: 'Maharashtrian',
    sub_category: 'Stuffed Sabzi',
    description: 'Brinjals stuffed with peanut-coconut masala — rich and aromatic dinner',
    prep_time_minutes: 20, cook_time_minutes: 25, servings: 4,
    calories_per_serving: 400, protein_g: 10, carbs_g: 42, fat_g: 22, fiber_g: 9,
    kitchen_equipment: 'kadai,spatula', difficulty: 'medium', is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Small brinjal (baingan)', quantity: '500', unit: 'g', calories: 130 },
      { name: 'Peanuts + coconut + sesame (filling)', quantity: '4', unit: 'tbsp', calories: 200 },
      { name: 'Oil', quantity: '2', unit: 'tbsp', calories: 240 },
      { name: 'Whole wheat roti', quantity: '2', unit: 'pcs', calories: 240 },
    ]
  },

  // ─────────────────── DINNER: Other Sabzi ──────────────────────
  {
    meal_type: 'dinner', name: 'Mushroom Masala', cuisine_type: 'North Indian',
    sub_category: 'Other Sabzi',
    description: 'Button mushrooms in rich spiced tomato-onion gravy — hearty dinner',
    prep_time_minutes: 10, cook_time_minutes: 20, servings: 4,
    calories_per_serving: 380, protein_g: 13, carbs_g: 36, fat_g: 20, fiber_g: 5,
    kitchen_equipment: 'kadai,tawa', difficulty: 'easy', is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Button mushrooms', quantity: '400', unit: 'g', calories: 100 },
      { name: 'Tomato-onion masala', quantity: '1', unit: 'cup', calories: 120 },
      { name: 'Oil', quantity: '2', unit: 'tbsp', calories: 240 },
      { name: 'Whole wheat roti', quantity: '2', unit: 'pcs', calories: 240 },
    ]
  },
  {
    meal_type: 'dinner', name: 'Soya Chunks Curry', cuisine_type: 'North Indian',
    sub_category: 'Other Sabzi',
    description: 'High-protein soya chunks in spiced gravy — nutritious satisfying dinner',
    prep_time_minutes: 15, cook_time_minutes: 20, servings: 4,
    calories_per_serving: 440, protein_g: 28, carbs_g: 46, fat_g: 16, fiber_g: 8,
    kitchen_equipment: 'kadai,tawa', difficulty: 'easy', is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Soya chunks (soaked)', quantity: '1.5', unit: 'cups', calories: 350 },
      { name: 'Tomato-onion masala', quantity: '1', unit: 'cup', calories: 120 },
      { name: 'Oil', quantity: '2', unit: 'tbsp', calories: 240 },
      { name: 'Whole wheat roti', quantity: '2', unit: 'pcs', calories: 240 },
    ]
  },
  {
    meal_type: 'dinner', name: 'Lauki Dal', cuisine_type: 'North Indian',
    sub_category: 'Dal Roti',
    description: 'Bottle gourd cooked with moong dal — light, digestive-friendly dinner',
    prep_time_minutes: 10, cook_time_minutes: 25, servings: 4,
    calories_per_serving: 380, protein_g: 13, carbs_g: 56, fat_g: 10, fiber_g: 7,
    kitchen_equipment: 'pressure cooker,kadai,tawa', difficulty: 'easy', is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Lauki (bottle gourd)', quantity: '400', unit: 'g', calories: 60 },
      { name: 'Moong dal', quantity: '0.75', unit: 'cup', calories: 255 },
      { name: 'Ghee', quantity: '1', unit: 'tbsp', calories: 90 },
      { name: 'Whole wheat roti', quantity: '2', unit: 'pcs', calories: 240 },
    ]
  },
  {
    meal_type: 'dinner', name: 'Palak Dal', cuisine_type: 'North Indian',
    sub_category: 'Dal Roti',
    description: 'Toor dal cooked with spinach and spices — iron-rich, nutritious dinner',
    prep_time_minutes: 10, cook_time_minutes: 25, servings: 4,
    calories_per_serving: 420, protein_g: 16, carbs_g: 58, fat_g: 12, fiber_g: 9,
    kitchen_equipment: 'pressure cooker,kadai,tawa', difficulty: 'easy', is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Toor dal', quantity: '0.75', unit: 'cup', calories: 285 },
      { name: 'Spinach (palak)', quantity: '200', unit: 'g', calories: 40 },
      { name: 'Oil', quantity: '1.5', unit: 'tbsp', calories: 180 },
      { name: 'Whole wheat roti', quantity: '2', unit: 'pcs', calories: 240 },
    ]
  },
  {
    meal_type: 'dinner', name: 'Rajma Roti', cuisine_type: 'North Indian',
    sub_category: 'Dal Roti',
    description: 'Spiced red kidney bean curry served with rotis — protein-packed dinner',
    prep_time_minutes: 10, cook_time_minutes: 40, servings: 4,
    calories_per_serving: 510, protein_g: 18, carbs_g: 72, fat_g: 13, fiber_g: 12,
    kitchen_equipment: 'pressure cooker,kadai,tawa', difficulty: 'easy', is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Rajma (kidney beans)', quantity: '1', unit: 'cup', calories: 340 },
      { name: 'Onion, tomato, spices', quantity: '1', unit: 'serving', calories: 100 },
      { name: 'Oil', quantity: '2', unit: 'tbsp', calories: 240 },
      { name: 'Whole wheat roti', quantity: '2', unit: 'pcs', calories: 240 },
    ]
  },
  {
    meal_type: 'dinner', name: 'Chana Masala Roti', cuisine_type: 'North Indian',
    sub_category: 'Dal Roti',
    description: 'Spiced chickpea curry with rotis — wholesome high-protein dinner',
    prep_time_minutes: 10, cook_time_minutes: 30, servings: 4,
    calories_per_serving: 500, protein_g: 17, carbs_g: 70, fat_g: 14, fiber_g: 12,
    kitchen_equipment: 'pressure cooker,kadai,tawa', difficulty: 'easy', is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Kabuli chana', quantity: '1', unit: 'cup', calories: 340 },
      { name: 'Onion, tomato, spices', quantity: '1', unit: 'serving', calories: 100 },
      { name: 'Oil', quantity: '2', unit: 'tbsp', calories: 240 },
      { name: 'Whole wheat roti', quantity: '2', unit: 'pcs', calories: 240 },
    ]
  },

  // ─────────────────── DINNER: Rice Dishes ──────────────────────
  {
    meal_type: 'dinner', name: 'Veg Biryani', cuisine_type: 'Mughal',
    sub_category: 'Rice Dishes',
    description: 'Aromatic basmati rice with mixed vegetables and saffron — festive dinner',
    prep_time_minutes: 20, cook_time_minutes: 40, servings: 4,
    calories_per_serving: 520, protein_g: 12, carbs_g: 80, fat_g: 16, fiber_g: 6,
    kitchen_equipment: 'heavy pot,tawa', difficulty: 'medium', is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Basmati rice', quantity: '1.5', unit: 'cups', calories: 510 },
      { name: 'Mixed vegetables', quantity: '2', unit: 'cups', calories: 160 },
      { name: 'Ghee', quantity: '3', unit: 'tbsp', calories: 270 },
      { name: 'Fried onion (birista)', quantity: '0.5', unit: 'cup', calories: 200 },
    ]
  },
  {
    meal_type: 'dinner', name: 'Jeera Rice with Dal', cuisine_type: 'Indian',
    sub_category: 'Rice Dishes',
    description: 'Fragrant cumin rice with toor dal — simple and deeply satisfying dinner',
    prep_time_minutes: 5, cook_time_minutes: 20, servings: 4,
    calories_per_serving: 460, protein_g: 13, carbs_g: 72, fat_g: 12, fiber_g: 4,
    kitchen_equipment: 'kadai,pressure cooker', difficulty: 'easy', is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Basmati rice', quantity: '1.5', unit: 'cups', calories: 510 },
      { name: 'Ghee', quantity: '1.5', unit: 'tbsp', calories: 135 },
      { name: 'Cumin seeds', quantity: '1', unit: 'tsp', calories: 5 },
      { name: 'Toor dal (cooked)', quantity: '1', unit: 'cup', calories: 200 },
    ]
  },
  {
    meal_type: 'dinner', name: 'Curd Rice', cuisine_type: 'South Indian',
    sub_category: 'Rice Dishes',
    description: 'Cooked rice mixed with curd and tempered — light cooling dinner',
    prep_time_minutes: 5, cook_time_minutes: 5, servings: 4,
    calories_per_serving: 380, protein_g: 11, carbs_g: 56, fat_g: 10, fiber_g: 1,
    kitchen_equipment: 'kadai,bowl', difficulty: 'easy', is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Rice (cooked)', quantity: '1.5', unit: 'cups', calories: 340 },
      { name: 'Dahi (curd)', quantity: '1', unit: 'cup', calories: 150 },
      { name: 'Oil', quantity: '1', unit: 'tbsp', calories: 120 },
      { name: 'Mustard seeds, curry leaves', quantity: '1', unit: 'tsp', calories: 5 },
    ]
  },

  // ─────────────────────────────────────────────
  // SNACKS
  // ─────────────────────────────────────────────
  {
    meal_type: 'snack', name: 'Roasted Makhana', cuisine_type: 'Indian',
    sub_category: 'Light Snacks',
    description: 'Light fox nuts roasted with ghee and rock salt — guilt-free healthy snack',
    prep_time_minutes: 2, cook_time_minutes: 8, servings: 2,
    calories_per_serving: 180, protein_g: 5, carbs_g: 28, fat_g: 5, fiber_g: 1,
    kitchen_equipment: 'kadai', difficulty: 'easy',
    is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Makhana (fox nuts)', quantity: '2', unit: 'cups', calories: 280 },
      { name: 'Ghee', quantity: '1', unit: 'tsp', calories: 40 },
      { name: 'Rock salt, black pepper', quantity: '0.5', unit: 'tsp', calories: 2 },
    ]
  },
  {
    meal_type: 'snack', name: 'Roasted Chana', cuisine_type: 'Indian',
    sub_category: 'Light Snacks',
    description: 'Crunchy roasted chickpeas with salt and spices — high protein snack',
    prep_time_minutes: 2, cook_time_minutes: 5, servings: 2,
    calories_per_serving: 200, protein_g: 10, carbs_g: 30, fat_g: 4, fiber_g: 8,
    kitchen_equipment: 'pan', difficulty: 'easy',
    is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Roasted chana', quantity: '0.75', unit: 'cup', calories: 280 },
      { name: 'Chaat masala', quantity: '0.5', unit: 'tsp', calories: 3 },
    ]
  },
  {
    meal_type: 'snack', name: 'Mixed Dry Fruits', cuisine_type: 'Indian',
    sub_category: 'Light Snacks',
    description: 'Handful of almonds, walnuts, cashews and raisins — energy-dense healthy snack',
    prep_time_minutes: 1, cook_time_minutes: 0, servings: 2,
    calories_per_serving: 280, protein_g: 7, carbs_g: 18, fat_g: 20, fiber_g: 3,
    kitchen_equipment: 'bowl', difficulty: 'easy',
    is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Almonds', quantity: '8', unit: 'pcs', calories: 80 },
      { name: 'Walnuts', quantity: '4', unit: 'halves', calories: 80 },
      { name: 'Cashews', quantity: '6', unit: 'pcs', calories: 80 },
      { name: 'Raisins', quantity: '1', unit: 'tbsp', calories: 40 },
    ]
  },
  {
    meal_type: 'snack', name: 'Fruit Chaat', cuisine_type: 'Indian',
    sub_category: 'Light Snacks',
    description: 'Seasonal fruit salad tossed with chaat masala, lemon juice and mint',
    prep_time_minutes: 8, cook_time_minutes: 0, servings: 2,
    calories_per_serving: 160, protein_g: 2, carbs_g: 38, fat_g: 1, fiber_g: 5,
    kitchen_equipment: 'bowl,knife', difficulty: 'easy',
    is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Banana', quantity: '1', unit: 'medium', calories: 100 },
      { name: 'Apple', quantity: '1', unit: 'medium', calories: 80 },
      { name: 'Orange', quantity: '1', unit: 'medium', calories: 60 },
      { name: 'Chaat masala, lemon juice', quantity: '1', unit: 'tsp', calories: 5 },
    ]
  },
  {
    meal_type: 'snack', name: 'Sprouts Salad', cuisine_type: 'Indian',
    sub_category: 'Light Snacks',
    description: 'Mixed sprouts with onion, tomato, lemon and chaat masala — protein-packed',
    prep_time_minutes: 5, cook_time_minutes: 0, servings: 2,
    calories_per_serving: 190, protein_g: 12, carbs_g: 28, fat_g: 3, fiber_g: 8,
    kitchen_equipment: 'bowl', difficulty: 'easy',
    is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Mixed sprouts (moong, chana)', quantity: '1', unit: 'cup', calories: 200 },
      { name: 'Onion, tomato, cucumber', quantity: '0.5', unit: 'cup each', calories: 50 },
      { name: 'Lemon juice, chaat masala', quantity: '1', unit: 'tsp', calories: 5 },
    ]
  },
  {
    meal_type: 'snack', name: 'Dahi Vada', cuisine_type: 'North Indian',
    sub_category: 'Fried Snacks',
    description: 'Soft lentil dumplings soaked in chilled curd with sweet tamarind chutney',
    prep_time_minutes: 30, cook_time_minutes: 20, servings: 4,
    calories_per_serving: 320, protein_g: 12, carbs_g: 44, fat_g: 10, fiber_g: 5,
    kitchen_equipment: 'deep pan,bowl', difficulty: 'medium',
    is_vegetarian: true, is_vegan: false,
    ingredients: [
      { name: 'Urad dal (soaked)', quantity: '1', unit: 'cup', calories: 340 },
      { name: 'Dahi (curd)', quantity: '1', unit: 'cup', calories: 150 },
      { name: 'Tamarind chutney', quantity: '2', unit: 'tbsp', calories: 50 },
      { name: 'Oil (for frying)', quantity: '3', unit: 'tbsp', calories: 360 },
    ]
  },
  {
    meal_type: 'snack', name: 'Samosa (2 pcs)', cuisine_type: 'North Indian',
    sub_category: 'Fried Snacks',
    description: 'Crispy pastry filled with spiced potato and peas — the classic Indian snack',
    prep_time_minutes: 30, cook_time_minutes: 20, servings: 4,
    calories_per_serving: 360, protein_g: 7, carbs_g: 42, fat_g: 18, fiber_g: 4,
    kitchen_equipment: 'deep pan,rolling pin', difficulty: 'hard',
    is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Maida (refined flour)', quantity: '1', unit: 'cup', calories: 360 },
      { name: 'Potato, peas (filling)', quantity: '2', unit: 'cups', calories: 250 },
      { name: 'Oil (for frying)', quantity: '4', unit: 'tbsp', calories: 480 },
    ]
  },
  {
    meal_type: 'snack', name: 'Namkeen Mathri', cuisine_type: 'North Indian',
    sub_category: 'Fried Snacks',
    description: 'Crispy flaky deep-fried crackers with ajwain and black pepper',
    prep_time_minutes: 20, cook_time_minutes: 20, servings: 4,
    calories_per_serving: 290, protein_g: 5, carbs_g: 32, fat_g: 16, fiber_g: 2,
    kitchen_equipment: 'deep pan,rolling pin', difficulty: 'medium',
    is_vegetarian: true, is_vegan: true,
    ingredients: [
      { name: 'Maida / whole wheat flour', quantity: '1.5', unit: 'cups', calories: 500 },
      { name: 'Oil (in dough + frying)', quantity: '4', unit: 'tbsp', calories: 480 },
      { name: 'Ajwain, black pepper', quantity: '1', unit: 'tsp each', calories: 6 },
    ]
  },
];

async function seedMenu() {
  // Clear in correct FK order: deepest child first
  const { Ingredient } = require('../models');
  await DietPlanDayItem.destroy({ where: {} });
  await DietPlanDay.destroy({ where: {} });
  await DietPlan.destroy({ where: {} });
  await Ingredient.destroy({ where: {} });
  await MenuItem.destroy({ where: {} });

  let created = 0;
  for (const item of menuData) {
    const { ingredients, ...data } = item;
    const menuItem = await MenuItem.create(data);
    if (ingredients && ingredients.length) {
      await Ingredient.bulkCreate(
        ingredients.map(ing => ({ ...ing, menu_item_id: menuItem.id }))
      );
    }
    created++;
  }
  console.log(`[menuSeeder] Seeded ${created} menu items.`);
  return created;
}

module.exports = { seedMenu };
