require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./src/models');
const { seedMenu } = require('./src/seeders/menuSeeder');
const { seedNutrition } = require('./src/seeders/nutritionSeeder');
const { startCronJobs } = require('./src/services/cronJobs');

const authController = require('./src/controllers/authController');
const menuController = require('./src/controllers/menuController');
const familyController = require('./src/controllers/familyController');
const dietPlanController = require('./src/controllers/dietPlanController');
const notificationController = require('./src/controllers/notificationController');
const nutritionController = require('./src/controllers/nutritionController');

const app = express();

app.use(cors());
app.use(express.json());

// Auth routes
app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', authController.login);
app.get('/api/auth/profile/:userId', authController.getProfile);
app.put('/api/auth/profile/:userId', authController.updateProfile);

// Menu routes (specific routes before parameterized)
app.get('/api/menu/breakfast', menuController.getBreakfastItems);
app.get('/api/menu/lunch', menuController.getLunchItems);
app.get('/api/menu/dinner', menuController.getDinnerItems);
app.get('/api/menu', menuController.getMenuItems);
app.get('/api/menu/:id', menuController.getMenuItemById);
app.post('/api/menu', menuController.createMenuItem);
app.put('/api/menu/:id', menuController.updateMenuItem);
app.delete('/api/menu/:id', menuController.deleteMenuItem);

// Family routes
app.get('/api/family/:userId', familyController.getFamilyMembers);
app.post('/api/family', familyController.addFamilyMember);
app.put('/api/family/:id', familyController.updateFamilyMember);
app.delete('/api/family/:id', familyController.deleteFamilyMember);
app.get('/api/family/:id/nutrition', familyController.getMemberNutrition);

// Diet plan routes
app.post('/api/plans/generate', dietPlanController.generateDietPlan);
app.get('/api/plans/today/:userId', dietPlanController.getTodayMenu);
app.get('/api/plans/:userId', dietPlanController.getUserPlans);
app.get('/api/plans/:planId/full', dietPlanController.getFullPlan);
app.put('/api/plans/:planId/day/:dayId', dietPlanController.updatePlanDay);
app.delete('/api/plans/:planId', dietPlanController.deletePlan);

// Notification routes
app.post('/api/notifications/send-today/:userId', notificationController.sendTodayMenuNotification);
app.post('/api/notifications/send-week/:userId', notificationController.sendWeekMenuNotification);
app.get('/api/notifications/history/:userId', notificationController.getNotificationHistory);

// Nutrition routes
app.get('/api/nutrition/requirements', nutritionController.getAllRequirements);
app.get('/api/nutrition/requirements/:age/:gender/:activity', nutritionController.getRequirementForProfile);
app.get('/api/nutrition/family-summary/:userId', nutritionController.getFamilySummary);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('Database connected');

    await sequelize.sync({ alter: true });
    console.log('Models synced');

    await seedMenu();
    await seedNutrition();

    startCronJobs();

    app.listen(PORT, () => {
      console.log(`CookConnect backend running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Startup error:', err.message);
    process.exit(1);
  }
}

start();
