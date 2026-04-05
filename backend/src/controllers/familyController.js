const { FamilyMember, NutritionRequirement } = require('../models');
const { Op } = require('sequelize');

async function getFamilyMembers(req, res) {
  try {
    const members = await FamilyMember.findAll({
      where: { user_id: req.params.userId },
      order: [['name', 'ASC']]
    });
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function addFamilyMember(req, res) {
  try {
    const member = await FamilyMember.create(req.body);
    res.status(201).json(member);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function updateFamilyMember(req, res) {
  try {
    const member = await FamilyMember.findByPk(req.params.id);
    if (!member) return res.status(404).json({ error: 'Family member not found' });
    await member.update(req.body);
    res.json(member);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function deleteFamilyMember(req, res) {
  try {
    const member = await FamilyMember.findByPk(req.params.id);
    if (!member) return res.status(404).json({ error: 'Family member not found' });
    await member.destroy();
    res.json({ message: 'Family member deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getMemberNutrition(req, res) {
  try {
    const member = await FamilyMember.findByPk(req.params.id);
    if (!member) return res.status(404).json({ error: 'Family member not found' });

    const req_nutrition = await NutritionRequirement.findOne({
      where: {
        age_min: { [Op.lte]: member.age },
        age_max: { [Op.gte]: member.age },
        [Op.or]: [{ gender: member.gender }, { gender: 'both' }],
        activity_level: member.activity_level
      }
    });

    res.json({ member, nutrition: req_nutrition });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getFamilyMembers, addFamilyMember, updateFamilyMember, deleteFamilyMember, getMemberNutrition
};
