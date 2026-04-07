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

  const MODELS = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-flash-latest'];
  let lastError;

  for (const model of MODELS) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
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
      if (data.error) {
        lastError = new Error(`Gemini error (${model}): ${data.error.message}`);
        continue; // try next model
      }
      const parts = data.candidates?.[0]?.content?.parts;
      if (!parts) { lastError = new Error('Empty response'); continue; }

      const textParts = parts.filter(p => !p.thought && p.text);
      const text = (textParts.length > 0 ? textParts : parts)
        .map(p => p.text || '').join('').trim();
      if (!text) { lastError = new Error('Empty text response'); continue; }

      const fenceMatch = text.match(/```json\s*([\s\S]*?)\s*```/s);
      const jsonStr = fenceMatch ? fenceMatch[1].trim() : text.match(/\{[\s\S]*\}/s)?.[0];
      if (!jsonStr) { lastError = new Error('No JSON found'); continue; }

      const result = JSON.parse(jsonStr);
      nutritionCache.set(cacheKey, { result, ts: Date.now(), servings: servings || 1 });
      return result; // success — return immediately
    } catch (err) {
      lastError = err;
      // continue to next model
    }
  }

  throw lastError || new Error('All Gemini models failed');
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
      order: [['name', 'ASC']]
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

module.exports = {
  getMenuItems, getMenuItemById, getBreakfastItems, getLunchItems, getDinnerItems,
  createMenuItem, updateMenuItem, deleteMenuItem, estimateNutrition
};
