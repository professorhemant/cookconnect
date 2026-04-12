const { MenuItem, Ingredient } = require('../models');
const { Op } = require('sequelize');

// In-memory cache: key = "name|cuisine", value = { result, ts }
const nutritionCache = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

async function fetchNutritionFromAI(name, cuisine_type, description, ingredients, servings = 1) {
  const cacheKey = `${name.toLowerCase().trim()}|${(cuisine_type || 'Indian').toLowerCase()}`;
  const cached = nutritionCache.get(cacheKey);
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
    // Scale cached per-serving values to requested servings
    const base = cached.result;
    const ratio = (cached.servings || 1) / (servings || 1);
    return {
      ...base,
      calories_per_serving: base.calories_per_serving ? Math.round(base.calories_per_serving * ratio) : base.calories_per_serving,
      protein_g: base.protein_g ? Math.round(base.protein_g * ratio * 10) / 10 : base.protein_g,
      carbs_g: base.carbs_g ? Math.round(base.carbs_g * ratio * 10) / 10 : base.carbs_g,
      fat_g: base.fat_g ? Math.round(base.fat_g * ratio * 10) / 10 : base.fat_g,
      fiber_g: base.fiber_g ? Math.round(base.fiber_g * ratio * 10) / 10 : base.fiber_g,
    };
  }

  const ingredientText = ingredients && ingredients.length > 0
    ? `Ingredients: ${ingredients.map(i => `${i.name} (${i.quantity} ${i.unit || ''})`).join(', ')}`
    : '';

  const prompt = `You are a nutrition and cooking expert. For the given dish, provide complete dish details including ingredients, nutrition, and cooking info.

Dish: ${name}
Cuisine: ${cuisine_type || 'Indian'}
Servings: ${servings}
${description ? `Description: ${description}` : ''}
${ingredientText}

Respond ONLY with valid JSON, no other text:
{
  "description": "Brief 1-sentence description of the dish",
  "calories_per_serving": 350,
  "protein_g": 12.5,
  "carbs_g": 45.0,
  "fat_g": 8.5,
  "fiber_g": 4.0,
  "prep_time_minutes": 15,
  "cook_time_minutes": 25,
  "difficulty": "easy",
  "is_vegetarian": true,
  "is_vegan": false,
  "kitchen_equipment": "kadai, tawa",
  "ingredients": [
    { "name": "ingredient name", "quantity": "1", "unit": "cup", "notes": "" }
  ]
}`;

  const MODEL = 'gemini-2.0-flash-lite'; // higher free-tier RPM limit

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, maxOutputTokens: 2048 }
      })
    }
  );

  const data = await response.json();
  if (data.error) throw new Error(`Gemini error: ${data.error.message}`);
  const parts = data.candidates?.[0]?.content?.parts;
  if (!parts) throw new Error('Empty response from Gemini');

  const textParts = parts.filter(p => !p.thought && p.text);
  const text = (textParts.length > 0 ? textParts : parts)
    .map(p => p.text || '').join('').trim();
  if (!text) throw new Error('Empty text response');

  const fenceMatch = text.match(/```json\s*([\s\S]*?)\s*```/s);
  const jsonStr = fenceMatch ? fenceMatch[1].trim() : text.match(/\{[\s\S]*\}/s)?.[0];
  if (!jsonStr) throw new Error('No JSON found in response');

  const result = JSON.parse(jsonStr);
  nutritionCache.set(cacheKey, { result, ts: Date.now(), servings: servings || 1 });
  return result;
}

async function getMenuItems(req, res) {
  try {
    const { meal_type, is_vegetarian, max_calories, cuisine_type, search } = req.query;
    const where = {};

    if (meal_type) where.meal_type = meal_type;
    if (is_vegetarian === 'true') where.is_vegetarian = true;
    if (max_calories) where.calories_per_serving = { [Op.lte]: parseInt(max_calories) };
    if (cuisine_type) where.cuisine_type = cuisine_type;
    if (search) where.name = { [Op.like]: `%${search}%` };

    const items = await MenuItem.findAll({
      where,
      include: [{ model: Ingredient, as: 'ingredients' }],
      order: [['sub_category', 'ASC'], ['name', 'ASC']]
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getMenuItemById(req, res) {
  try {
    const item = await MenuItem.findByPk(req.params.id, {
      include: [{ model: Ingredient, as: 'ingredients' }]
    });
    if (!item) return res.status(404).json({ error: 'Menu item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getBreakfastItems(req, res) {
  req.query.meal_type = 'breakfast';
  return getMenuItems(req, res);
}

async function getLunchItems(req, res) {
  req.query.meal_type = 'lunch';
  return getMenuItems(req, res);
}

async function getDinnerItems(req, res) {
  req.query.meal_type = 'dinner';
  return getMenuItems(req, res);
}

async function estimateNutrition(req, res) {
  const { name, cuisine_type, description, ingredients, servings } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });
  try {
    const result = await fetchNutritionFromAI(name, cuisine_type, description, ingredients, servings || 1);
    res.json(result);
  } catch (err) {
    const retryMatch = err.message.match(/retry in (\d+)/i);
    const retrySeconds = retryMatch ? parseInt(retryMatch[1]) + 5 : 60;
    res.status(429).json({ error: err.message, retryAfter: retrySeconds });
  }
}

async function createMenuItem(req, res) {
  try {
    const { ingredients, ...menuData } = req.body;

    if (!menuData.calories_per_serving) {
      try {
        const aiData = await fetchNutritionFromAI(
          menuData.name, menuData.cuisine_type, menuData.description, ingredients
        );
        Object.assign(menuData, aiData);
      } catch {
        menuData.calories_per_serving = 300;
      }
    }

    const item = await MenuItem.create(menuData);

    if (ingredients && ingredients.length > 0) {
      await Promise.all(
        ingredients.map(ing => Ingredient.create({ ...ing, menu_item_id: item.id }))
      );
    }

    const created = await MenuItem.findByPk(item.id, {
      include: [{ model: Ingredient, as: 'ingredients' }]
    });
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function updateMenuItem(req, res) {
  try {
    const item = await MenuItem.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Menu item not found' });

    const { ingredients, ...menuData } = req.body;
    await item.update(menuData);

    if (ingredients) {
      await Ingredient.destroy({ where: { menu_item_id: item.id } });
      await Promise.all(
        ingredients.map(ing => Ingredient.create({ ...ing, menu_item_id: item.id }))
      );
    }

    const updated = await MenuItem.findByPk(item.id, {
      include: [{ model: Ingredient, as: 'ingredients' }]
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function deleteMenuItem(req, res) {
  try {
    const item = await MenuItem.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Menu item not found' });
    await Ingredient.destroy({ where: { menu_item_id: item.id } });
    await item.destroy();
    res.json({ message: 'Menu item deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// NIN (National Institute of Nutrition, India) daily calorie distribution
// Breakfast 30% | Lunch 30% | Evening Snacks 10% | Dinner 30%

// Thali slot templates — each slot picks one item from its matching sub_categories
const THALI_TEMPLATES = {
  breakfast: [
    { role: 'Main Dish',      emoji: '🫓', cats: ['Parantha', 'Chilla', 'Dosa and Idli', 'Uttapam', 'Upma', 'Poha', 'Other Breakfast'] },
    { role: 'Sabzi',          emoji: '🥬', cats: ['Aloo Sabzi', 'Gobhi Sabzi', 'Paneer Sabzi', 'Other Sabzi', 'Sabzi', 'Stuffed Sabzi'] },
    { role: 'Dahi / Raita',   emoji: '🥛', cats: ['Raita', 'Dahi and Lassi'] },
  ],
  lunch: [
    { role: 'Rice / Biryani', emoji: '🍚', cats: ['Biryani', 'Rice Dishes', 'Rice/Chawal', 'Khichdi'] },
    { role: 'Roti',           emoji: '🫓', cats: ['Roti', 'Parantha'] },
    { role: 'Dal',            emoji: '🥘', cats: ['Dal', 'Kadhi', 'Chana Chole'] },
    { role: 'Sabzi',          emoji: '🥬', cats: ['Aloo Sabzi', 'Paneer Sabzi', 'Gobhi Sabzi', 'Other Sabzi', 'Sabzi', 'Stuffed Sabzi'] },
    { role: 'Salad',          emoji: '🥗', cats: ['Salad'] },
    { role: 'Raita / Dahi',   emoji: '🥛', cats: ['Raita', 'Dahi and Lassi'] },
  ],
  snack: [
    { role: 'Light Snack',    emoji: '🥜', cats: ['Light Snacks', 'Fried Snacks', 'Chilla'] },
    { role: 'Beverage / Dahi',emoji: '🥛', cats: ['Shake', 'Dahi and Lassi', 'Raita'] },
  ],
  dinner: [
    { role: 'Roti',           emoji: '🫓', cats: ['Roti', 'Parantha'] },
    { role: 'Dal',            emoji: '🥘', cats: ['Dal', 'Kadhi', 'Chana Chole'] },
    { role: 'Sabzi',          emoji: '🥬', cats: ['Aloo Sabzi', 'Paneer Sabzi', 'Gobhi Sabzi', 'Other Sabzi', 'Sabzi', 'Stuffed Sabzi'] },
    { role: 'Salad',          emoji: '🥗', cats: ['Salad'] },
    { role: 'Raita / Dahi',   emoji: '🥛', cats: ['Raita', 'Dahi and Lassi'] },
  ],
};

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

async function getThaliOptions(req, res) {
  try {
    const { meal_type = 'lunch', isVegetarian = false, numOptions = 3 } = req.body;

    const template = THALI_TEMPLATES[meal_type] || THALI_TEMPLATES.lunch;

    // Fetch all items for this meal_type
    const where = { meal_type };
    if (isVegetarian) where.is_vegetarian = true;
    const allItems = await MenuItem.findAll({ where });

    // Group items by sub_category
    const byCategory = {};
    allItems.forEach(item => {
      const cat = item.sub_category || 'Other';
      if (!byCategory[cat]) byCategory[cat] = [];
      byCategory[cat].push(item);
    });

    // For each slot, build a pool and pre-shuffle so options get different items
    // slotPools[i] = shuffled array of candidates for slot i
    const slotPools = template.map(slot => {
      const pool = [];
      slot.cats.forEach(cat => { if (byCategory[cat]) pool.push(...byCategory[cat]); });
      return shuffleArray(pool);
    });

    // Generate options by taking successive items from each slot's pool
    const options = [];
    for (let n = 0; n < numOptions; n++) {
      const components = [];
      let totalKcal = 0, totalProtein = 0, totalCarbs = 0, totalFat = 0;

      for (let si = 0; si < template.length; si++) {
        const slot = template[si];
        const pool = slotPools[si];
        if (pool.length === 0) continue;

        // Pick item at position n (wrap around if fewer items than numOptions)
        const item = pool[n % pool.length];

        components.push({
          role: slot.role,
          emoji: slot.emoji,
          item: {
            id: item.id,
            name: item.name,
            sub_category: item.sub_category,
            cuisine_type: item.cuisine_type,
            calories_per_serving: item.calories_per_serving || 0,
            protein_g: parseFloat(item.protein_g) || 0,
            carbs_g: parseFloat(item.carbs_g) || 0,
            fat_g: parseFloat(item.fat_g) || 0,
            is_vegetarian: item.is_vegetarian,
          }
        });

        totalKcal     += item.calories_per_serving || 0;
        totalProtein  += parseFloat(item.protein_g) || 0;
        totalCarbs    += parseFloat(item.carbs_g) || 0;
        totalFat      += parseFloat(item.fat_g) || 0;
      }

      options.push({
        id: n,
        components,
        totalKcal:    Math.round(totalKcal),
        totalProtein: Math.round(totalProtein * 10) / 10,
        totalCarbs:   Math.round(totalCarbs * 10) / 10,
        totalFat:     Math.round(totalFat * 10) / 10,
      });
    }

    // Also return available items per slot so the frontend can offer swaps
    const slotCandidates = template.map(slot => {
      const pool = [];
      slot.cats.forEach(cat => { if (byCategory[cat]) pool.push(...byCategory[cat]); });
      return { role: slot.role, emoji: slot.emoji, items: pool.map(i => ({
        id: i.id, name: i.name, sub_category: i.sub_category,
        calories_per_serving: i.calories_per_serving || 0,
        protein_g: parseFloat(i.protein_g) || 0,
        carbs_g: parseFloat(i.carbs_g) || 0,
        fat_g: parseFloat(i.fat_g) || 0,
        is_vegetarian: i.is_vegetarian,
        cuisine_type: i.cuisine_type,
      })) };
    });

    res.json({ options, slotCandidates, meal_type });
  } catch (err) {
    console.error('getThaliOptions error:', err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getMenuItems, getMenuItemById, getBreakfastItems, getLunchItems, getDinnerItems,
  createMenuItem, updateMenuItem, deleteMenuItem, estimateNutrition, getThaliOptions
};
