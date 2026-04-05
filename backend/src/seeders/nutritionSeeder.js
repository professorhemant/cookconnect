const { NutritionRequirement } = require('../models');

const nutritionData = [
  // 1-3 years
  { age_min: 1, age_max: 3, gender: 'both', activity_level: 'sedentary', calories_min: 1000, calories_max: 1200, protein_g: 13, carbs_g: 130, fat_g: 35, fiber_g: 14, calcium_mg: 700, iron_mg: 7, vitamin_d_iu: 600, description: 'Toddler (1-3 years)' },
  { age_min: 1, age_max: 3, gender: 'both', activity_level: 'moderate', calories_min: 1100, calories_max: 1300, protein_g: 13, carbs_g: 140, fat_g: 38, fiber_g: 14, calcium_mg: 700, iron_mg: 7, vitamin_d_iu: 600, description: 'Active Toddler (1-3 years)' },
  { age_min: 1, age_max: 3, gender: 'both', activity_level: 'active', calories_min: 1200, calories_max: 1400, protein_g: 15, carbs_g: 150, fat_g: 40, fiber_g: 14, calcium_mg: 700, iron_mg: 7, vitamin_d_iu: 600, description: 'Very Active Toddler (1-3 years)' },

  // 4-8 years
  { age_min: 4, age_max: 8, gender: 'both', activity_level: 'sedentary', calories_min: 1200, calories_max: 1400, protein_g: 19, carbs_g: 160, fat_g: 40, fiber_g: 17, calcium_mg: 1000, iron_mg: 10, vitamin_d_iu: 600, description: 'Child (4-8 years)' },
  { age_min: 4, age_max: 8, gender: 'both', activity_level: 'moderate', calories_min: 1400, calories_max: 1600, protein_g: 19, carbs_g: 180, fat_g: 45, fiber_g: 17, calcium_mg: 1000, iron_mg: 10, vitamin_d_iu: 600, description: 'Active Child (4-8 years)' },
  { age_min: 4, age_max: 8, gender: 'both', activity_level: 'active', calories_min: 1500, calories_max: 1800, protein_g: 21, carbs_g: 200, fat_g: 50, fiber_g: 17, calcium_mg: 1000, iron_mg: 10, vitamin_d_iu: 600, description: 'Very Active Child (4-8 years)' },

  // 9-13 years male
  { age_min: 9, age_max: 13, gender: 'male', activity_level: 'sedentary', calories_min: 1600, calories_max: 1800, protein_g: 34, carbs_g: 220, fat_g: 55, fiber_g: 22, calcium_mg: 1300, iron_mg: 8, vitamin_d_iu: 600, description: 'Pre-teen Boy (9-13 years)' },
  { age_min: 9, age_max: 13, gender: 'male', activity_level: 'moderate', calories_min: 1800, calories_max: 2000, protein_g: 34, carbs_g: 240, fat_g: 60, fiber_g: 22, calcium_mg: 1300, iron_mg: 8, vitamin_d_iu: 600, description: 'Active Pre-teen Boy (9-13 years)' },
  { age_min: 9, age_max: 13, gender: 'male', activity_level: 'active', calories_min: 2000, calories_max: 2200, protein_g: 38, carbs_g: 265, fat_g: 65, fiber_g: 22, calcium_mg: 1300, iron_mg: 8, vitamin_d_iu: 600, description: 'Very Active Pre-teen Boy (9-13 years)' },

  // 9-13 years female
  { age_min: 9, age_max: 13, gender: 'female', activity_level: 'sedentary', calories_min: 1400, calories_max: 1600, protein_g: 34, carbs_g: 200, fat_g: 50, fiber_g: 22, calcium_mg: 1300, iron_mg: 8, vitamin_d_iu: 600, description: 'Pre-teen Girl (9-13 years)' },
  { age_min: 9, age_max: 13, gender: 'female', activity_level: 'moderate', calories_min: 1600, calories_max: 1800, protein_g: 34, carbs_g: 220, fat_g: 55, fiber_g: 22, calcium_mg: 1300, iron_mg: 8, vitamin_d_iu: 600, description: 'Active Pre-teen Girl (9-13 years)' },
  { age_min: 9, age_max: 13, gender: 'female', activity_level: 'active', calories_min: 1800, calories_max: 2000, protein_g: 38, carbs_g: 240, fat_g: 60, fiber_g: 22, calcium_mg: 1300, iron_mg: 8, vitamin_d_iu: 600, description: 'Very Active Pre-teen Girl (9-13 years)' },

  // 14-18 years male
  { age_min: 14, age_max: 18, gender: 'male', activity_level: 'sedentary', calories_min: 2000, calories_max: 2200, protein_g: 52, carbs_g: 270, fat_g: 70, fiber_g: 28, calcium_mg: 1300, iron_mg: 11, vitamin_d_iu: 600, description: 'Teen Boy (14-18 years)' },
  { age_min: 14, age_max: 18, gender: 'male', activity_level: 'moderate', calories_min: 2200, calories_max: 2400, protein_g: 52, carbs_g: 300, fat_g: 75, fiber_g: 28, calcium_mg: 1300, iron_mg: 11, vitamin_d_iu: 600, description: 'Active Teen Boy (14-18 years)' },
  { age_min: 14, age_max: 18, gender: 'male', activity_level: 'active', calories_min: 2400, calories_max: 2800, protein_g: 58, carbs_g: 330, fat_g: 82, fiber_g: 28, calcium_mg: 1300, iron_mg: 11, vitamin_d_iu: 600, description: 'Very Active Teen Boy (14-18 years)' },

  // 14-18 years female
  { age_min: 14, age_max: 18, gender: 'female', activity_level: 'sedentary', calories_min: 1800, calories_max: 2000, protein_g: 46, carbs_g: 240, fat_g: 62, fiber_g: 26, calcium_mg: 1300, iron_mg: 15, vitamin_d_iu: 600, description: 'Teen Girl (14-18 years)' },
  { age_min: 14, age_max: 18, gender: 'female', activity_level: 'moderate', calories_min: 2000, calories_max: 2200, protein_g: 46, carbs_g: 265, fat_g: 68, fiber_g: 26, calcium_mg: 1300, iron_mg: 15, vitamin_d_iu: 600, description: 'Active Teen Girl (14-18 years)' },
  { age_min: 14, age_max: 18, gender: 'female', activity_level: 'active', calories_min: 2200, calories_max: 2400, protein_g: 52, carbs_g: 290, fat_g: 72, fiber_g: 26, calcium_mg: 1300, iron_mg: 15, vitamin_d_iu: 600, description: 'Very Active Teen Girl (14-18 years)' },

  // 19-30 years male
  { age_min: 19, age_max: 30, gender: 'male', activity_level: 'sedentary', calories_min: 2000, calories_max: 2200, protein_g: 56, carbs_g: 270, fat_g: 72, fiber_g: 30, calcium_mg: 1000, iron_mg: 8, vitamin_d_iu: 600, description: 'Young Adult Man (19-30 years)' },
  { age_min: 19, age_max: 30, gender: 'male', activity_level: 'moderate', calories_min: 2200, calories_max: 2400, protein_g: 56, carbs_g: 300, fat_g: 78, fiber_g: 30, calcium_mg: 1000, iron_mg: 8, vitamin_d_iu: 600, description: 'Active Young Adult Man (19-30 years)' },
  { age_min: 19, age_max: 30, gender: 'male', activity_level: 'active', calories_min: 2600, calories_max: 3000, protein_g: 62, carbs_g: 350, fat_g: 88, fiber_g: 30, calcium_mg: 1000, iron_mg: 8, vitamin_d_iu: 600, description: 'Very Active Young Adult Man (19-30 years)' },

  // 19-30 years female
  { age_min: 19, age_max: 30, gender: 'female', activity_level: 'sedentary', calories_min: 1800, calories_max: 2000, protein_g: 46, carbs_g: 240, fat_g: 62, fiber_g: 25, calcium_mg: 1000, iron_mg: 18, vitamin_d_iu: 600, description: 'Young Adult Woman (19-30 years)' },
  { age_min: 19, age_max: 30, gender: 'female', activity_level: 'moderate', calories_min: 2000, calories_max: 2200, protein_g: 46, carbs_g: 265, fat_g: 68, fiber_g: 25, calcium_mg: 1000, iron_mg: 18, vitamin_d_iu: 600, description: 'Active Young Adult Woman (19-30 years)' },
  { age_min: 19, age_max: 30, gender: 'female', activity_level: 'active', calories_min: 2200, calories_max: 2400, protein_g: 52, carbs_g: 290, fat_g: 75, fiber_g: 25, calcium_mg: 1000, iron_mg: 18, vitamin_d_iu: 600, description: 'Very Active Young Adult Woman (19-30 years)' },

  // 31-50 years male
  { age_min: 31, age_max: 50, gender: 'male', activity_level: 'sedentary', calories_min: 1800, calories_max: 2000, protein_g: 56, carbs_g: 250, fat_g: 65, fiber_g: 30, calcium_mg: 1000, iron_mg: 8, vitamin_d_iu: 600, description: 'Adult Man (31-50 years)' },
  { age_min: 31, age_max: 50, gender: 'male', activity_level: 'moderate', calories_min: 2000, calories_max: 2200, protein_g: 56, carbs_g: 275, fat_g: 72, fiber_g: 30, calcium_mg: 1000, iron_mg: 8, vitamin_d_iu: 600, description: 'Active Adult Man (31-50 years)' },
  { age_min: 31, age_max: 50, gender: 'male', activity_level: 'active', calories_min: 2200, calories_max: 2600, protein_g: 62, carbs_g: 320, fat_g: 80, fiber_g: 30, calcium_mg: 1000, iron_mg: 8, vitamin_d_iu: 600, description: 'Very Active Adult Man (31-50 years)' },

  // 31-50 years female
  { age_min: 31, age_max: 50, gender: 'female', activity_level: 'sedentary', calories_min: 1600, calories_max: 1800, protein_g: 46, carbs_g: 220, fat_g: 58, fiber_g: 25, calcium_mg: 1000, iron_mg: 18, vitamin_d_iu: 600, description: 'Adult Woman (31-50 years)' },
  { age_min: 31, age_max: 50, gender: 'female', activity_level: 'moderate', calories_min: 1800, calories_max: 2000, protein_g: 46, carbs_g: 245, fat_g: 62, fiber_g: 25, calcium_mg: 1000, iron_mg: 18, vitamin_d_iu: 600, description: 'Active Adult Woman (31-50 years)' },
  { age_min: 31, age_max: 50, gender: 'female', activity_level: 'active', calories_min: 2000, calories_max: 2200, protein_g: 52, carbs_g: 270, fat_g: 68, fiber_g: 25, calcium_mg: 1000, iron_mg: 18, vitamin_d_iu: 600, description: 'Very Active Adult Woman (31-50 years)' },

  // 51+ years male
  { age_min: 51, age_max: 99, gender: 'male', activity_level: 'sedentary', calories_min: 1600, calories_max: 1800, protein_g: 56, carbs_g: 220, fat_g: 58, fiber_g: 30, calcium_mg: 1200, iron_mg: 8, vitamin_d_iu: 800, description: 'Senior Man (51+ years)' },
  { age_min: 51, age_max: 99, gender: 'male', activity_level: 'moderate', calories_min: 1800, calories_max: 2000, protein_g: 56, carbs_g: 245, fat_g: 65, fiber_g: 30, calcium_mg: 1200, iron_mg: 8, vitamin_d_iu: 800, description: 'Active Senior Man (51+ years)' },
  { age_min: 51, age_max: 99, gender: 'male', activity_level: 'active', calories_min: 2000, calories_max: 2200, protein_g: 62, carbs_g: 270, fat_g: 70, fiber_g: 30, calcium_mg: 1200, iron_mg: 8, vitamin_d_iu: 800, description: 'Very Active Senior Man (51+ years)' },

  // 51+ years female
  { age_min: 51, age_max: 99, gender: 'female', activity_level: 'sedentary', calories_min: 1400, calories_max: 1600, protein_g: 46, carbs_g: 200, fat_g: 52, fiber_g: 21, calcium_mg: 1200, iron_mg: 8, vitamin_d_iu: 800, description: 'Senior Woman (51+ years)' },
  { age_min: 51, age_max: 99, gender: 'female', activity_level: 'moderate', calories_min: 1600, calories_max: 1800, protein_g: 46, carbs_g: 220, fat_g: 58, fiber_g: 21, calcium_mg: 1200, iron_mg: 8, vitamin_d_iu: 800, description: 'Active Senior Woman (51+ years)' },
  { age_min: 51, age_max: 99, gender: 'female', activity_level: 'active', calories_min: 1800, calories_max: 2000, protein_g: 52, carbs_g: 245, fat_g: 62, fiber_g: 21, calcium_mg: 1200, iron_mg: 8, vitamin_d_iu: 800, description: 'Very Active Senior Woman (51+ years)' }
];

async function seedNutrition() {
  const existing = await NutritionRequirement.count();
  if (existing > 0) return;

  await NutritionRequirement.bulkCreate(nutritionData);
  console.log(`Seeded ${nutritionData.length} nutrition requirements`);
}

module.exports = { seedNutrition };
