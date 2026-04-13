const { User, DietPlan, DietPlanDay, DietPlanDayItem, MenuItem, NotificationLog, FamilyMember } = require('../models');
const { sendTodayMenu, sendWeeklyMenu } = require('../services/smsService');
const { Op } = require('sequelize');

const dayIncludes = [
  { model: MenuItem, as: 'breakfast' },
  { model: MenuItem, as: 'lunch' },
  { model: MenuItem, as: 'dinner' },
  { model: DietPlanDayItem, as: 'mealItems', include: [{ model: MenuItem, as: 'menuItem' }] }
];

async function sendTodayMenuNotification(req, res) {
  try {
    const user = await User.findByPk(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const familyCount = await FamilyMember.count({ where: { user_id: user.id } }) || 1;

    const today = new Date().toISOString().split('T')[0];
    const plan = await DietPlan.findOne({
      where: {
        user_id: user.id,
        status: 'active',
        start_date: { [Op.lte]: today },
        end_date: { [Op.gte]: today }
      }
    });

    let planDay = null;
    if (plan) {
      planDay = await DietPlanDay.findOne({
        where: { diet_plan_id: plan.id, day_date: today },
        include: dayIncludes
      });
    }

    const { message, results } = await sendTodayMenu(user, planDay, familyCount);

    const status = results.length === 0 ? 'skipped'
      : results.every(r => r.status === 'sent') ? 'sent'
      : results.some(r => r.status === 'sent') ? 'sent' : results[0]?.status;

    const log = await NotificationLog.create({
      user_id: user.id,
      type: 'today_menu',
      recipient_phone: [user.phone, user.cook_phone].filter(Boolean).join(', '),
      message,
      status
    });

    res.json({ log, results, message });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function sendWeekMenuNotification(req, res) {
  try {
    const user = await User.findByPk(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const familyCount = await FamilyMember.count({ where: { user_id: user.id } }) || 1;

    const today = new Date().toISOString().split('T')[0];
    const plan = await DietPlan.findOne({
      where: {
        user_id: user.id,
        status: 'active',
        start_date: { [Op.gte]: today }
      },
      order: [['start_date', 'ASC']]
    });

    if (!plan) {
      const activePlan = await DietPlan.findOne({
        where: {
          user_id: user.id,
          status: 'active',
          start_date: { [Op.lte]: today },
          end_date: { [Op.gte]: today }
        }
      });
      if (!activePlan) return res.status(404).json({ error: 'No active plan found' });

      const planDays = await DietPlanDay.findAll({
        where: { diet_plan_id: activePlan.id },
        include: dayIncludes,
        order: [['day_number', 'ASC']]
      });

      const { message, results } = await sendWeeklyMenu(user, planDays, familyCount);
      const status = results.length === 0 ? 'skipped'
        : results.some(r => r.status === 'sent') ? 'sent' : results[0]?.status;

      const log = await NotificationLog.create({
        user_id: user.id,
        type: 'weekly_plan',
        recipient_phone: [user.phone, user.cook_phone].filter(Boolean).join(', '),
        message,
        status
      });

      return res.json({ log, results, message });
    }

    const planDays = await DietPlanDay.findAll({
      where: { diet_plan_id: plan.id },
      include: dayIncludes,
      order: [['day_number', 'ASC']]
    });

    const { message, results } = await sendWeeklyMenu(user, planDays, familyCount);
    const status = results.length === 0 ? 'skipped'
      : results.some(r => r.status === 'sent') ? 'sent' : results[0]?.status;

    const log = await NotificationLog.create({
      user_id: user.id,
      type: 'weekly_plan',
      recipient_phone: [user.phone, user.cook_phone].filter(Boolean).join(', '),
      message,
      status
    });

    res.json({ log, results, message });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getNotificationHistory(req, res) {
  try {
    const logs = await NotificationLog.findAll({
      where: { user_id: req.params.userId },
      order: [['createdAt', 'DESC']],
      limit: 20
    });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function deleteNotificationLog(req, res) {
  try {
    const log = await NotificationLog.findByPk(req.params.id);
    if (!log) return res.status(404).json({ error: 'Not found' });
    await log.destroy();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { sendTodayMenuNotification, sendWeekMenuNotification, getNotificationHistory, deleteNotificationLog };
