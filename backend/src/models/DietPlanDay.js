const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DietPlanDay = sequelize.define('DietPlanDay', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  diet_plan_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  day_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  day_number: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  breakfast_item_id: {
    type: DataTypes.UUID,
    allowNull: true
  },
  lunch_item_id: {
    type: DataTypes.UUID,
    allowNull: true
  },
  dinner_item_id: {
    type: DataTypes.UUID,
    allowNull: true
  },
  morning_snack_id: {
    type: DataTypes.UUID,
    allowNull: true
  },
  evening_snack_id: {
    type: DataTypes.UUID,
    allowNull: true
  },
  total_calories: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  total_protein: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  total_carbs: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  total_fat: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  }
}, {
  tableName: 'diet_plan_days',
  timestamps: true
});

module.exports = DietPlanDay;
