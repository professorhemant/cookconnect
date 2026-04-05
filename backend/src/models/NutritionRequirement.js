const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const NutritionRequirement = sequelize.define('NutritionRequirement', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  age_min: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  age_max: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  gender: {
    type: DataTypes.ENUM('male', 'female', 'both'),
    defaultValue: 'both'
  },
  activity_level: {
    type: DataTypes.ENUM('sedentary', 'moderate', 'active'),
    defaultValue: 'moderate'
  },
  calories_min: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  calories_max: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  protein_g: {
    type: DataTypes.FLOAT,
    defaultValue: 50
  },
  carbs_g: {
    type: DataTypes.FLOAT,
    defaultValue: 250
  },
  fat_g: {
    type: DataTypes.FLOAT,
    defaultValue: 65
  },
  fiber_g: {
    type: DataTypes.FLOAT,
    defaultValue: 25
  },
  calcium_mg: {
    type: DataTypes.FLOAT,
    defaultValue: 1000
  },
  iron_mg: {
    type: DataTypes.FLOAT,
    defaultValue: 18
  },
  vitamin_d_iu: {
    type: DataTypes.FLOAT,
    defaultValue: 600
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'nutrition_requirements',
  timestamps: true
});

module.exports = NutritionRequirement;
