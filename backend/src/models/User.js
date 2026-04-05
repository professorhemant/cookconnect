const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  cook_phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  family_name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  sms_enabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  plan_type: {
    type: DataTypes.ENUM('weekly', 'monthly'),
    defaultValue: 'weekly'
  }
}, {
  tableName: 'users',
  timestamps: true
});

module.exports = User;
