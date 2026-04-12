require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./src/models');
const { seedMenu } = require('./src/seeders/menuSeeder');
const { seedNutrition } = require('./src/seeders/nutritionSeeder');
const { startCronJobs } = require('./src/services/cronJobs');
const { connectWhatsApp, getStatus, disconnect } = require('./src/services/whatsappService');
const { generateTodayPDF, generateWeeklyPDF, generateShoppingListPDF } = require('./src/services/pdfService');
const { sendPDF } = require('./src/services/whatsappService');
const { User, DietPlan, DietPlanDay, MenuItem, FamilyMember, Ingredient, NotificationLog } = require('./src/models');
const { Op } = require('sequelize');

const authController = require('./src/controllers/authController');
const menuController = require('./src/controllers/menuController');
const familyController = require('./src/controllers/familyController');
const dietPlanController = require('./src/controllers/dietPlanController');
const notificationController = require('./src/controllers/notificationController');
const nutritionController = require('./src/controllers/nutritionController');
const { analyzeImage } = require('./src/controllers/imageToDishController');
const multer = require('multer');

const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/pdfs', express.static(path.join(__dirname, 'public/pdfs')));

// Temporary one-time salad seeder endpoint — remove after use
app.post('/api/admin/seed-salads', async (req, res) => {
  const SALAD_BASE = [
    { name: 'Kachumber Salad', description: 'Classic Indian fresh salad with cucumber, tomato, onion, green chilli and lemon', cuisine_type: 'Indian', calories_per_serving: 35, protein_g: 1.5, carbs_g: 7.0, fat_g: 0.3, fiber_g: 2.0, prep_time_minutes: 5, cook_time_minutes: 0, difficulty: 'easy', is_vegetarian: true, is_vegan: true, servings: 1 },
    { name: 'Mooli Gajar Salad', description: 'Seasonal winter salad with grated radish and carrot, dressed with lemon juice', cuisine_type: 'Indian', calories_per_serving: 40, protein_g: 1.2, carbs_g: 8.5, fat_g: 0.2, fiber_g: 2.5, prep_time_minutes: 5, cook_time_minutes: 0, difficulty: 'easy', is_vegetarian: true, is_vegan: true, servings: 1 },
    { name: 'Chana Sprout Salad', description: 'Protein-rich sprouted chickpea salad with onion, tomato, coriander, lemon and chaat masala', cuisine_type: 'Indian', calories_per_serving: 80, protein_g: 5.0, carbs_g: 12.0, fat_g: 1.0, fiber_g: 4.0, prep_time_minutes: 10, cook_time_minutes: 0, difficulty: 'easy', is_vegetarian: true, is_vegan: true, servings: 1 },
    { name: 'Beetroot Carrot Salad', description: 'Vibrant seasonal salad with grated beetroot, carrot, lemon juice and chaat masala', cuisine_type: 'Indian', calories_per_serving: 55, protein_g: 1.5, carbs_g: 11.0, fat_g: 0.3, fiber_g: 3.0, prep_time_minutes: 8, cook_time_minutes: 0, difficulty: 'easy', is_vegetarian: true, is_vegan: true, servings: 1 },
    { name: 'Peanut Cucumber Salad', description: 'Crunchy salad with roasted peanuts, cucumber, coriander and lemon', cuisine_type: 'Indian', calories_per_serving: 115, protein_g: 5.0, carbs_g: 8.0, fat_g: 7.0, fiber_g: 2.0, prep_time_minutes: 8, cook_time_minutes: 0, difficulty: 'easy', is_vegetarian: true, is_vegan: true, servings: 1 },
    { name: 'Green Leafy Salad', description: 'Light salad with seasonal leafy greens, cucumber, lemon dressing and roasted cumin', cuisine_type: 'Indian', calories_per_serving: 30, protein_g: 2.0, carbs_g: 5.0, fat_g: 0.5, fiber_g: 2.0, prep_time_minutes: 5, cook_time_minutes: 0, difficulty: 'easy', is_vegetarian: true, is_vegan: true, servings: 1 },
    { name: 'Onion Tomato Salad', description: 'Simple Indian side salad with raw onion, tomato, green chilli and coriander', cuisine_type: 'Indian', calories_per_serving: 25, protein_g: 1.0, carbs_g: 5.0, fat_g: 0.2, fiber_g: 1.5, prep_time_minutes: 3, cook_time_minutes: 0, difficulty: 'easy', is_vegetarian: true, is_vegan: true, servings: 1 },
    { name: 'Mixed Seasonal Salad', description: 'Colourful mix of seasonal vegetables — carrot, cucumber, capsicum, tomato — with lemon and chaat masala', cuisine_type: 'Indian', calories_per_serving: 45, protein_g: 1.8, carbs_g: 9.0, fat_g: 0.4, fiber_g: 2.5, prep_time_minutes: 8, cook_time_minutes: 0, difficulty: 'easy', is_vegetarian: true, is_vegan: true, servings: 1 },
  ];
  try {
    let created = 0, skipped = 0;
    for (const base of SALAD_BASE) {
      for (const meal_type of ['lunch', 'dinner']) {
        const existing = await MenuItem.findOne({ where: { name: base.name, meal_type } });
        if (existing) { skipped++; } else { await MenuItem.create({ ...base, meal_type, sub_category: 'Salad' }); created++; }
      }
    }
    res.json({ ok: true, created, skipped });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

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
app.post('/api/menu/estimate-nutrition', menuController.estimateNutrition);
app.post('/api/menu/thali-options', menuController.getThaliOptions);
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
app.delete('/api/notifications/:id', notificationController.deleteNotificationLog);

// PDF preview routes (opens in browser)
app.get('/api/notifications/preview-today/:userId', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const today = new Date().toISOString().split('T')[0];
    const plan = await DietPlan.findOne({
      where: { user_id: user.id, status: 'active', start_date: { [Op.lte]: today }, end_date: { [Op.gte]: today } }
    });
    let planDay = null;
    if (plan) {
      planDay = await DietPlanDay.findOne({
        where: { diet_plan_id: plan.id, day_date: today },
        include: [{ model: MenuItem, as: 'breakfast' }, { model: MenuItem, as: 'lunch' }, { model: MenuItem, as: 'dinner' }]
      });
    }
    const { filepath } = await generateTodayPDF(user, planDay);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="today-menu.pdf"');
    require('fs').createReadStream(filepath).pipe(res);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/notifications/preview-weekly/:userId', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const today = new Date().toISOString().split('T')[0];
    const plan = await DietPlan.findOne({
      where: { user_id: user.id, status: 'active', start_date: { [Op.lte]: today }, end_date: { [Op.gte]: today } }
    });
    if (!plan) return res.status(404).json({ error: 'No active plan found' });
    const planDays = await DietPlanDay.findAll({
      where: { diet_plan_id: plan.id },
      include: [{ model: MenuItem, as: 'breakfast' }, { model: MenuItem, as: 'lunch' }, { model: MenuItem, as: 'dinner' }],
      order: [['day_number', 'ASC']]
    });
    const { filepath } = await generateWeeklyPDF(user, planDays);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="weekly-plan.pdf"');
    require('fs').createReadStream(filepath).pipe(res);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/notifications/preview-shopping/:userId', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const today = new Date().toISOString().split('T')[0];
    const plan = await DietPlan.findOne({
      where: { user_id: user.id, status: 'active', start_date: { [Op.lte]: today }, end_date: { [Op.gte]: today } }
    });
    if (!plan) return res.status(404).json({ error: 'No active plan found' });
    const planDays = await DietPlanDay.findAll({
      where: { diet_plan_id: plan.id },
      include: [
        { model: MenuItem, as: 'breakfast', include: [{ model: Ingredient, as: 'ingredients' }] },
        { model: MenuItem, as: 'lunch', include: [{ model: Ingredient, as: 'ingredients' }] },
        { model: MenuItem, as: 'dinner', include: [{ model: Ingredient, as: 'ingredients' }] }
      ],
      order: [['day_number', 'ASC']]
    });
    const familyCount = await FamilyMember.count({ where: { user_id: user.id } });
    const members = familyCount > 0 ? familyCount : 1;
    const { filepath } = await generateShoppingListPDF(user, planDays, members);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="shopping-list.pdf"');
    require('fs').createReadStream(filepath).pipe(res);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/notifications/send-shopping/:userId', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.userId);
    if (!user || !user.phone) return res.status(404).json({ error: 'User or phone not found' });
    const today = new Date().toISOString().split('T')[0];
    const plan = await DietPlan.findOne({
      where: { user_id: user.id, status: 'active', start_date: { [Op.lte]: today }, end_date: { [Op.gte]: today } }
    });
    if (!plan) return res.status(404).json({ error: 'No active plan found' });
    const planDays = await DietPlanDay.findAll({
      where: { diet_plan_id: plan.id },
      include: [
        { model: MenuItem, as: 'breakfast', include: [{ model: Ingredient, as: 'ingredients' }] },
        { model: MenuItem, as: 'lunch', include: [{ model: Ingredient, as: 'ingredients' }] },
        { model: MenuItem, as: 'dinner', include: [{ model: Ingredient, as: 'ingredients' }] }
      ],
      order: [['day_number', 'ASC']]
    });
    const familyCount = await FamilyMember.count({ where: { user_id: user.id } });
    const members = familyCount > 0 ? familyCount : 1;
    const { filename, filepath } = await generateShoppingListPDF(user, planDays, members);
    const caption = `CookConnect — Shopping List (${members} member${members !== 1 ? 's' : ''})`;
    const result = await sendPDF(user.phone, filepath, filename, caption);
    await NotificationLog.create({
      user_id: user.id, type: 'shopping_list',
      recipient_phone: user.phone, message: filepath, status: result.status
    });
    res.json({ status: result.status });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// WhatsApp routes
app.get('/api/whatsapp/status', (req, res) => res.json(getStatus()));
app.post('/api/whatsapp/connect', async (req, res) => {
  connectWhatsApp();
  res.json({ message: 'Connecting...' });
});
app.post('/api/whatsapp/disconnect', async (req, res) => {
  await disconnect();
  res.json({ message: 'Disconnected' });
});

// Image to Dish route
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });
app.post('/api/image-to-dish', upload.single('image'), analyzeImage);

// Nutrition routes
app.get('/api/nutrition/requirements', nutritionController.getAllRequirements);
app.get('/api/nutrition/requirements/:age/:gender/:activity', nutritionController.getRequirementForProfile);
app.get('/api/nutrition/family-summary/:userId', nutritionController.getFamilySummary);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Admin: force re-seed menu (clears all plans + menu items, then seeds fresh)
app.post('/api/admin/seed-menu', async (req, res) => {
  try {
    const { seedMenu } = require('./src/seeders/menuSeeder');
    const count = await seedMenu();
    res.json({ success: true, message: `Seeded ${count} menu items` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('Database connected');

    await sequelize.sync({ alter: true });
    console.log('Models synced');

    const menuCount = await MenuItem.count();
    if (menuCount === 0) await seedMenu();
    await seedNutrition();

    startCronJobs();
    connectWhatsApp();

    app.listen(PORT, () => {
      console.log(`CookConnect backend running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Startup error:', err.message);
    process.exit(1);
  }
}

start();
