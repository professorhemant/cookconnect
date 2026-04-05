const cron = require('node-cron');
const { User, DietPlan, DietPlanDay, MenuItem, NotificationLog } = require('../models');
const { sendTodayMenu, sendWeeklyMenu } = require('./smsService');
const { Op } = require('sequelize');

function getTodayString() {
  return new Date().toISOString().split('T')[0];
}

async function runDailyMenuJob() {
  console.log('[CRON] Running daily menu SMS job');
  const users = await User.findAll({ where: { sms_enabled: true } });

  for (const user of users) {
    try {
      const today = getTodayString();
      const plan = await DietPlan.findOne({
        where: {
          user_id: user.id,
          status: 'active',
          start_date: { [Op.lte]: today },
          end_date: { [Op.gte]: today }
        }
      });

      if (!plan) continue;

      const planDay = await DietPlanDay.findOne({
        where: { diet_plan_id: plan.id, day_date: today },
        include: [
          { model: MenuItem, as: 'breakfast' },
          { model: MenuItem, as: 'lunch' },
          { model: MenuItem, as: 'dinner' }
        ]
      });

      const { message, results } = await sendTodayMenu(user, planDay);

      const overallStatus = results.every(r => r.status === 'sent') ? 'sent'
        : results.some(r => r.status === 'sent') ? 'sent' : results[0]?.status || 'skipped';

      await NotificationLog.create({
        user_id: user.id,
        type: 'today_menu',
        recipient_phone: [user.phone, user.cook_phone].filter(Boolean).join(', '),
        message,
        status: overallStatus
      });
    } catch (err) {
      console.error(`[CRON] Error sending daily menu for user ${user.id}:`, err.message);
    }
  }
}

async function runWeeklyPlanJob() {
  console.log('[CRON] Running weekly plan SMS job');
  const users = await User.findAll({
    where: { sms_enabled: true, plan_type: 'weekly' }
  });

  for (const user of users) {
    try {
      const today = getTodayString();
      const plan = await DietPlan.findOne({
        where: {
          user_id: user.id,
          status: 'active',
          start_date: { [Op.gte]: today }
        },
        order: [['start_date', 'ASC']]
      });

      if (!plan) continue;

      const planDays = await DietPlanDay.findAll({
        where: { diet_plan_id: plan.id },
        include: [
          { model: MenuItem, as: 'breakfast' },
          { model: MenuItem, as: 'lunch' },
          { model: MenuItem, as: 'dinner' }
        ],
        order: [['day_number', 'ASC']]
      });

      const { message, results } = await sendWeeklyMenu(user, planDays);

      const overallStatus = results.every(r => r.status === 'sent') ? 'sent'
        : results.some(r => r.status === 'sent') ? 'sent' : results[0]?.status || 'skipped';

      await NotificationLog.create({
        user_id: user.id,
        type: 'weekly_plan',
        recipient_phone: [user.phone, user.cook_phone].filter(Boolean).join(', '),
        message,
        status: overallStatus
      });
    } catch (err) {
      console.error(`[CRON] Error sending weekly plan for user ${user.id}:`, err.message);
    }
  }
}

function startCronJobs() {
  // Every day at 7:00 AM
  cron.schedule('0 7 * * *', runDailyMenuJob, { timezone: 'Asia/Kolkata' });

  // Every Sunday at 8:00 AM
  cron.schedule('0 8 * * 0', runWeeklyPlanJob, { timezone: 'Asia/Kolkata' });

  console.log('[CRON] Scheduled: daily menu (7AM) and weekly plan (Sunday 8AM)');
}

module.exports = { startCronJobs, runDailyMenuJob, runWeeklyPlanJob };
