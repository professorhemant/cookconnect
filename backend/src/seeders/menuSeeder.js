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
    sub_category: 'Other Breakfast',
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
