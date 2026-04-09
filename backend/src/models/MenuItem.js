const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MenuItem = sequelize.define('MenuItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  meal_type: {
    type: DataTypes.ENUM('breakfast', 'lunch', 'dinner', 'snack'),
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  cuisine_type: {
    type: DataTypes.STRING,
    defaultValue: 'Indian'
  },
  prep_time_minutes: {
    type: DataTypes.INTEGER,
    defaultValue: 10
  },
  cook_time_minutes: {
    type: DataTypes.INTEGER,
    defaultValue: 20
  },
  servings: {
    type: DataTypes.INTEGER,
    defaultValue: 4
  },
  calories_per_serving: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  protein_g: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  carbs_g: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  fat_g: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  fiber_g: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  kitchen_equipment: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Comma-separated list of equipment needed'
  },
  difficulty: {
    type: DataTypes.ENUM('easy', 'medium', 'hard'),
    defaultValue: 'easy'
  },
  is_vegetarian: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  is_vegan: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  image_url: {
    type: DataTypes.STRING,
    allowNull: true
  },
  sub_category: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null
  }
}, {
  tableName: 'menu_items',
  timestamps: true
});

module.exports = MenuItem;
