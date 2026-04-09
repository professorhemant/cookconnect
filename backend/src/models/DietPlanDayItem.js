const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DietPlanDayItem = sequelize.define('DietPlanDayItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  diet_plan_day_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  menu_item_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  meal_type: {
    type: DataTypes.ENUM('breakfast', 'lunch', 'dinner', 'snack'),
    allowNull: false
  }
}, {
  tableName: 'diet_plan_day_items',
  timestamps: false
});

module.exports = DietPlanDayItem;
