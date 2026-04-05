const { NutritionRequirement, FamilyMember } = require('../models');
const { Op } = require('sequelize');

async function getAllRequirements(req, res) {
  try {
    const reqs = await NutritionRequirement.findAll({ order: [['age_min', 'ASC'], ['gender', 'ASC']] });
    res.json(reqs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getRequirementForProfile(req, res) {
  try {
    const { age, gender, activity } = req.params;
    const req_nutrition = await NutritionRequirement.findOne({
      where: {
        age_min: { [Op.lte]: parseInt(age) },
        age_max: { [Op.gte]: parseInt(age) },
        [Op.or]: [{ gender }, { gender: 'both' }],
        activity_level: activity
      }
    });
    if (!req_nutrition) return res.status(404).json({ error: 'No requirement found for this profile' });
    res.json(req_nutrition);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getFamilySummary(req, res) {
  try {
    const members = await FamilyMember.findAll({ where: { user_id: req.params.userId } });

    const summaryData = await Promise.all(
      members.map(async member => {
        const req_nutrition = await NutritionRequirement.findOne({
          where: {
            age_min: { [Op.lte]: member.age },
            age_max: { [Op.gte]: member.age },
            [Op.or]: [{ gender: member.gender }, { gender: 'both' }],
            activity_level: member.activity_level
          }
        });
        return { member, nutrition: req_nutrition };
      })
    );

    const totals = summaryData.reduce((acc, { nutrition }) => {
      if (!nutrition) return acc;
      return {
        calories_min: acc.calories_min + nutrition.calories_min,
        calories_max: acc.calories_max + nutrition.calories_max,
        protein_g: acc.protein_g + nutrition.protein_g,
        carbs_g: acc.carbs_g + nutrition.carbs_g,
        fat_g: acc.fat_g + nutrition.fat_g,
        fiber_g: acc.fiber_g + nutrition.fiber_g,
        calcium_mg: acc.calcium_mg + nutrition.calcium_mg,
        iron_mg: acc.iron_mg + nutrition.iron_mg
      };
    }, { calories_min: 0, calories_max: 0, protein_g: 0, carbs_g: 0, fat_g: 0, fiber_g: 0, calcium_mg: 0, iron_mg: 0 });

    res.json({ members: summaryData, familyTotals: totals });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getAllRequirements, getRequirementForProfile, getFamilySummary };
