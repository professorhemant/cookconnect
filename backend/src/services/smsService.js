require('dotenv').config();

let twilioClient = null;

function getTwilioClient() {
  if (twilioClient) return twilioClient;
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env;
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) return null;
  try {
    const twilio = require('twilio');
    twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
    return twilioClient;
  } catch {
    return null;
  }
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]}`;
}

function formatTodayMessage(user, planDay) {
  if (!planDay) return `CookConnect: No meal plan found for today.`;
  const b = planDay.breakfast ? planDay.breakfast.name : 'Not set';
  const l = planDay.lunch ? planDay.lunch.name : 'Not set';
  const d = planDay.dinner ? planDay.dinner.name : 'Not set';
  const bCal = planDay.breakfast ? planDay.breakfast.calories_per_serving : 0;
  const lCal = planDay.lunch ? planDay.lunch.calories_per_serving : 0;
  const dCal = planDay.dinner ? planDay.dinner.calories_per_serving : 0;
  const bPrep = planDay.breakfast ? `${planDay.breakfast.prep_time_minutes + planDay.breakfast.cook_time_minutes} min` : '';
  const lPrep = planDay.lunch ? `${planDay.lunch.prep_time_minutes + planDay.lunch.cook_time_minutes} min` : '';
  const dPrep = planDay.dinner ? `${planDay.dinner.prep_time_minutes + planDay.dinner.cook_time_minutes} min` : '';

  return [
    `*CookConnect* - TODAY'S MENU`,
    `Family: ${user.family_name || user.name}`,
    `Date: ${formatDate(planDay.day_date)}`,
    `━━━━━━━━━━━━━━━━━━━`,
    ``,
    `*Breakfast* (7:30 AM)`,
    `  ${b}`,
    `  Calories: ${bCal} kcal | Prep: ${bPrep}`,
    ``,
    `*Lunch* (12:30 PM)`,
    `  ${l}`,
    `  Calories: ${lCal} kcal | Prep: ${lPrep}`,
    ``,
    `*Dinner* (7:30 PM)`,
    `  ${d}`,
    `  Calories: ${dCal} kcal | Prep: ${dPrep}`,
    ``,
    `Total Day Calories: ${planDay.total_calories || 0} kcal`,
    `━━━━━━━━━━━━━━━━━━━`,
    `Timings: BF 7:30AM | LU 12:30PM | DI 7:30PM`,
    `Queries? Call family admin.`,
    `- CookConnect`
  ].join('\n');
}

function formatWeeklyMessage(user, planDays) {
  const sorted = [...planDays].sort((a, b) => a.day_number - b.day_number).slice(0, 7);
  const startDate = sorted[0] ? formatDate(sorted[0].day_date) : '';
  const endDate = sorted[6] ? formatDate(sorted[6].day_date) : '';

  let msg = `*CookConnect* - WEEKLY MEAL PLAN\n`;
  msg += `Family: ${user.family_name || user.name}\n`;
  msg += `Week: ${startDate} to ${endDate}\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

  sorted.forEach(day => {
    const b = day.breakfast ? day.breakfast.name : '-';
    const l = day.lunch ? day.lunch.name : '-';
    const d = day.dinner ? day.dinner.name : '-';
    const bCal = day.breakfast ? day.breakfast.calories_per_serving : 0;
    const lCal = day.lunch ? day.lunch.calories_per_serving : 0;
    const dCal = day.dinner ? day.dinner.calories_per_serving : 0;
    msg += `*${formatDate(day.day_date)}*\n`;
    msg += `  BF: ${b} (${bCal} cal)\n`;
    msg += `  LU: ${l} (${lCal} cal)\n`;
    msg += `  DI: ${d} (${dCal} cal)\n`;
    msg += `  Total: ${day.total_calories || bCal + lCal + dCal} cal\n`;
    msg += `─────────────────────────\n`;
  });

  msg += `\nTimings: BF 7:30AM | LU 12:30PM | DI 7:30PM\n`;
  msg += `Queries? Call family admin.\n`;
  msg += `- CookConnect`;
  return msg;
}

async function sendSms(toPhone, message) {
  const client = getTwilioClient();
  if (!client) {
    console.log('[SMS] Twilio not configured. Would have sent to', toPhone, ':', message.substring(0, 80));
    return { status: 'skipped', reason: 'Twilio not configured' };
  }
  try {
    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_FROM_NUMBER,
      to: toPhone
    });
    return { status: 'sent', sid: result.sid };
  } catch (err) {
    return { status: 'failed', error: err.message };
  }
}

async function sendTodayMenu(user, planDay) {
  const message = formatTodayMessage(user, planDay);
  const results = [];

  if (user.phone) {
    const r = await sendSms(user.phone, message);
    results.push({ phone: user.phone, role: 'owner', ...r });
  }
  if (user.cook_phone) {
    const r = await sendSms(user.cook_phone, message);
    results.push({ phone: user.cook_phone, role: 'cook', ...r });
  }
  return { message, results };
}

async function sendWeeklyMenu(user, planDays) {
  const message = formatWeeklyMessage(user, planDays);
  const results = [];

  if (user.phone) {
    const r = await sendSms(user.phone, message);
    results.push({ phone: user.phone, role: 'owner', ...r });
  }
  if (user.cook_phone) {
    const r = await sendSms(user.cook_phone, message);
    results.push({ phone: user.cook_phone, role: 'cook', ...r });
  }
  return { message, results };
}

module.exports = { sendTodayMenu, sendWeeklyMenu, formatTodayMessage, formatWeeklyMessage };
