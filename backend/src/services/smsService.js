require('dotenv').config();
const { generateTodayPDF, generateWeeklyPDF } = require('./pdfService');
const { sendPDF } = require('./whatsappService');

const BACKEND_URL = process.env.BACKEND_URL || 'https://backend-production-7862.up.railway.app';

async function sendToPhones(user, filepath, filename, caption) {
  const results = [];
  const recipients = [
    { phone: user.phone, role: 'owner' },
    { phone: user.cook_phone, role: 'cook' }
  ].filter(r => r.phone);

  for (const { phone, role } of recipients) {
    const r = await sendPDF(phone, filepath, filename, caption);
    results.push({ phone, role, ...r });
  }
  return results;
}

async function sendTodayMenu(user, planDay, familyCount = 1) {
  const { filename, filepath } = await generateTodayPDF(user, planDay, familyCount);
  const caption = `CookConnect — Today's Menu for ${user.family_name || user.name} (${familyCount} member${familyCount !== 1 ? 's' : ''})`;
  const results = await sendToPhones(user, filepath, filename, caption);
  return { message: `${BACKEND_URL}/pdfs/${filename}`, results };
}

async function sendWeeklyMenu(user, planDays, familyCount = 1) {
  const { filename, filepath } = await generateWeeklyPDF(user, planDays, familyCount);
  const caption = `CookConnect — Weekly Meal Plan for ${user.family_name || user.name} (${familyCount} member${familyCount !== 1 ? 's' : ''})`;
  const results = await sendToPhones(user, filepath, filename, caption);
  return { message: `${BACKEND_URL}/pdfs/${filename}`, results };
}

module.exports = { sendTodayMenu, sendWeeklyMenu };
