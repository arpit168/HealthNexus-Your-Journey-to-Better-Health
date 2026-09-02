// Validation utilities
import validator from "validator";

export const validateEmail = (email) => {
  return validator.isEmail(email);
};

export const validatePassword = (password) => {
  // At least 8 chars, 1 uppercase, 1 number, 1 special char
  const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};

export const validatePhone = (phone) => {
  return /^\d{10}$/.test(phone.replace(/\D/g, ""));
};

export const validatePIN = (pin) => {
  return /^\d{6}$/.test(pin);
};

export const validateAge = (age) => {
  const numAge = parseInt(age);
  return numAge >= 15 && numAge <= 100;
};

export const validateHeight = (height) => {
  const numHeight = parseInt(height);
  return numHeight >= 100 && numHeight <= 250;
};

export const validateWeight = (weight) => {
  const numWeight = parseFloat(weight);
  return numWeight >= 20 && numWeight <= 300;
};

export const validateOTP = (otp) => {
  return /^\d{6}$/.test(otp);
};

export const validateWorkoutData = (data) => {
  const errors = [];

  if (
    !data.exercise ||
    typeof data.exercise !== "string" ||
    data.exercise.trim().length === 0
  ) {
    errors.push("Exercise name is required");
  }

  if (!data.duration || parseInt(data.duration) <= 0) {
    errors.push("Duration must be a positive number");
  }

  if (data.sets && parseInt(data.sets) < 0) {
    errors.push("Sets cannot be negative");
  }

  if (data.reps && parseInt(data.reps) < 0) {
    errors.push("Reps cannot be negative");
  }

  if (data.weight && parseFloat(data.weight) < 0) {
    errors.push("Weight cannot be negative");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateMealData = (data) => {
  const errors = [];

  if (
    !data.mealName ||
    typeof data.mealName !== "string" ||
    data.mealName.trim().length === 0
  ) {
    errors.push("Meal name is required");
  }

  if (!data.calories || parseFloat(data.calories) <= 0) {
    errors.push("Calories must be a positive number");
  }

  if (data.protein && parseFloat(data.protein) < 0) {
    errors.push("Protein cannot be negative");
  }

  if (data.carbs && parseFloat(data.carbs) < 0) {
    errors.push("Carbs cannot be negative");
  }

  if (data.fat && parseFloat(data.fat) < 0) {
    errors.push("Fat cannot be negative");
  }

  const validMealTypes = ["breakfast", "lunch", "dinner", "snack", "other"];
  if (data.mealType && !validMealTypes.includes(data.mealType)) {
    errors.push("Invalid meal type");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateTrackingData = (data) => {
  const errors = [];

  if (!data.type || typeof data.type !== "string") {
    errors.push("Tracking type is required");
  }

  if (!data.value || parseFloat(data.value) <= 0) {
    errors.push("Value must be a positive number");
  }

  const validTypes = ["weight", "measurement", "photo", "adherence"];
  if (data.type && !validTypes.includes(data.type)) {
    errors.push("Invalid tacking type");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
