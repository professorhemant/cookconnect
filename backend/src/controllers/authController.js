const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

async function register(req, res) {
  try {
    const { name, email, password, phone, cook_phone, address, family_name, plan_type } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'name, email, and password are required' });
    }
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, phone, cook_phone, address, family_name, plan_type });

    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET || 'cookconnect_secret_2024', { expiresIn: '7d' });
    const { password: _, ...userOut } = user.toJSON();
    res.status(201).json({ user: userOut, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email and password are required' });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET || 'cookconnect_secret_2024', { expiresIn: '7d' });
    const { password: _, ...userOut } = user.toJSON();
    res.json({ user: userOut, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getProfile(req, res) {
  try {
    const user = await User.findByPk(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const { password: _, ...userOut } = user.toJSON();
    res.json(userOut);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateProfile(req, res) {
  try {
    const user = await User.findByPk(req.params.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { password, ...updateData } = req.body;
    if (password) updateData.password = await bcrypt.hash(password, 10);

    await user.update(updateData);
    const { password: _, ...userOut } = user.toJSON();
    res.json(userOut);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

module.exports = { register, login, getProfile, updateProfile };
