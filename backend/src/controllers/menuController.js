const { MenuItem, Ingredient } = require('../models');
const { Op } = require('sequelize');
const Anthropic = require('@anthropic-ai/sdk');

async function fetchNutritionFromAI(name, cuisine_type, description, ingredients) {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const ingredientText = ingredients && ingredients.length > 0
    ? `Ingredients: ${ingredients.map(i => `${i.name} (${i.quantity} ${i.unit || ''})`).join(', ')}`
    : '';

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1000,
    messages: [{
      role: 'user',
      content: `You are a nutrition and cooking expert. For the given dish, provide complete dish details including ingredients, nutrition, and cooking info.

Dish: ${name}
Cuisine: ${cuisine_type || 'Indian'}
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
}`
    }]
  });

  const text = response.content[0].text.trim();
  const clean = text.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
  return JSON.parse(clean);
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
  const { name, cuisine_type, description, ingredients } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });
  try {
    const result = await fetchNutritionFromAI(name, cuisine_type, description, ingredients);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
