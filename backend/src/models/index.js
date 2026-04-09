const sequelize = require('../config/database');
const User = require('./User');
const FamilyMember = require('./FamilyMember');
const MenuItem = require('./MenuItem');
const Ingredient = require('./Ingredient');
const DietPlan = require('./DietPlan');
const DietPlanDay = require('./DietPlanDay');
const DietPlanDayItem = require('./DietPlanDayItem');
const NutritionRequirement = require('./NutritionRequirement');
const NotificationLog = require('./NotificationLog');
const Setting = require('./Setting');

User.hasMany(FamilyMember, { foreignKey: 'user_id', as: 'familyMembers' });
FamilyMember.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(DietPlan, { foreignKey: 'user_id', as: 'dietPlans' });
DietPlan.belongsTo(User, { foreignKey: 'user_id' });

DietPlan.hasMany(DietPlanDay, { foreignKey: 'diet_plan_id', as: 'days' });
DietPlanDay.belongsTo(DietPlan, { foreignKey: 'diet_plan_id' });

MenuItem.hasMany(Ingredient, { foreignKey: 'menu_item_id', as: 'ingredients' });
Ingredient.belongsTo(MenuItem, { foreignKey: 'menu_item_id' });

DietPlanDay.belongsTo(MenuItem, { foreignKey: 'breakfast_item_id', as: 'breakfast' });
DietPlanDay.belongsTo(MenuItem, { foreignKey: 'lunch_item_id', as: 'lunch' });
DietPlanDay.belongsTo(MenuItem, { foreignKey: 'dinner_item_id', as: 'dinner' });
DietPlanDay.belongsTo(MenuItem, { foreignKey: 'breakfast_addon_id', as: 'breakfastAddon' });
DietPlanDay.belongsTo(MenuItem, { foreignKey: 'morning_snack_id', as: 'morningSnack' });
DietPlanDay.belongsTo(MenuItem, { foreignKey: 'evening_snack_id', as: 'eveningSnack' });

DietPlanDay.hasMany(DietPlanDayItem, { foreignKey: 'diet_plan_day_id', as: 'mealItems' });
DietPlanDayItem.belongsTo(DietPlanDay, { foreignKey: 'diet_plan_day_id' });
DietPlanDayItem.belongsTo(MenuItem, { foreignKey: 'menu_item_id', as: 'menuItem' });

User.hasMany(NotificationLog, { foreignKey: 'user_id', as: 'notifications' });
NotificationLog.belongsTo(User, { foreignKey: 'user_id' });

module.exports = {
  sequelize,
  User,
  FamilyMember,
  MenuItem,
  Ingredient,
  DietPlan,
  DietPlanDay,
  DietPlanDayItem,
  NutritionRequirement,
  NotificationLog,
  Setting
};
