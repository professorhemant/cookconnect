const { DietPlan, DietPlanDay, MenuItem, Ingredient } = require('../models');
const { generatePlan } = require('../services/dietPlanService');
const { Op } = require('sequelize');

const dayIncludes = [
  { model: MenuItem, as: 'breakfast', include: [{ model: Ingredient, as: 'ingredients' }] },
  { model: MenuItem, as: 'lunch', include: [{ model: Ingredient, as: 'ingredients' }] },
  { model: MenuItem, as: 'dinner', include: [{ model: Ingredient, as: 'ingredients' }] },
  { model: MenuItem, as: 'morningSnack' },
  { model: MenuItem, as: 'eveningSnack' }
];

async function generateDietPlan(req, res) {
  try {
    const { userId, planType, startDate, preferences } = req.body;
    if (!userId || !planType || !startDate) {
      return res.status(400).json({ error: 'userId, planType, and startDate are required' });
    }
    const plan = await generatePlan(userId, planType, startDate, preferences || {});
    const full = await DietPlan.findByPk(plan.id, {
      include: [{ model: DietPlanDay, as: 'days', include: dayIncludes, order: [['day_number', 'ASC']] }]
    });
    res.status(201).json(full);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function getUserPlans(req, res) {
  try {
    const plans = await DietPlan.findAll({
      where: { user_id: req.params.userId },
      order: [['createdAt', 'DESC']]
    });
    res.json(plans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getFullPlan(req, res) {
  try {
    const plan = await DietPlan.findByPk(req.params.planId, {
      include: [{
        model: DietPlanDay, as: 'days',
        include: dayIncludes
      }]
    });
    if (!plan) return res.status(404).json({ error: 'Plan not found' });
    res.json(plan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getTodayMenu(req, res) {
  try {
    const today = new Date().toISOString().split('T')[0];
    const plan = await DietPlan.findOne({
      where: {
        user_id: req.params.userId,
        status: 'active',
        start_date: { [Op.lte]: today },
        end_date: { [Op.gte]: today }
      }
    });

    if (!plan) return res.status(404).json({ error: 'No active plan found for today' });

    const planDay = await DietPlanDay.findOne({
      where: { diet_plan_id: plan.id, day_date: today },
      include: dayIncludes
    });

    if (!planDay) return res.status(404).json({ error: 'No menu for today' });
    res.json({ plan, day: planDay });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updatePlanDay(req, res) {
  try {
    const day = await DietPlanDay.findOne({
      where: { id: req.params.dayId, diet_plan_id: req.params.planId }
    });
    if (!day) return res.status(404).json({ error: 'Plan day not found' });

    await day.update(req.body);

    const updatedDay = await DietPlanDay.findByPk(day.id, { include: dayIncludes });
    res.json(updatedDay);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function deletePlan(req, res) {
  try {
    const plan = await DietPlan.findByPk(req.params.planId);
    if (!plan) return res.status(404).json({ error: 'Plan not found' });
    await DietPlanDay.destroy({ where: { diet_plan_id: plan.id } });
    await plan.destroy();
    res.json({ message: 'Plan deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  generateDietPlan, getUserPlans, getFullPlan, getTodayMenu, updatePlanDay, deletePlan
};
