const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const FamilyMember = sequelize.define('FamilyMember', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  gender: {
    type: DataTypes.ENUM('male', 'female', 'other'),
    allowNull: false
  },
  health_conditions: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Comma-separated: diabetes, hypertension, obesity, lactose_intolerant, gluten_free'
  },
  dietary_restrictions: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  activity_level: {
    type: DataTypes.ENUM('sedentary', 'moderate', 'active'),
    defaultValue: 'moderate'
  }
}, {
  tableName: 'family_members',
  timestamps: true
});

module.exports = FamilyMember;
