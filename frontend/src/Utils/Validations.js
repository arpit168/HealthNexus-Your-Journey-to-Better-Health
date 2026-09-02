// utils/validation.js
export const validateForm = (formData) => {
  const errors = {};

  // Basic Information Validation
  // Full Name validation
  if (!formData.fullName?.trim()) {
    errors.fullName = "Full name is required";
  } else if (formData.fullName.length < 3) {
    errors.fullName = "Name must be at least 3 characters";
  } else if (formData.fullName.length > 50) {
    errors.fullName = "Name must be less than 50 characters";
  } else if (!/^[a-zA-Z\s'-]+$/.test(formData.fullName)) {
    errors.fullName =
      "Name can only contain letters, spaces, hyphens and apostrophes";
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email?.trim()) {
    errors.email = "Email is required";
  } else if (!emailRegex.test(formData.email)) {
    errors.email = "Please enter a valid email address";
  }

  // Password validation
  //   const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!formData.password) {
    errors.password = "Password is required";
  } else if (formData.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  } else if (!/(?=.*[A-Z])/.test(formData.password)) {
    errors.password = "Password must contain at least one uppercase letter";
  } else if (!/(?=.*\d)/.test(formData.password)) {
    errors.password = "Password must contain at least one number";
  } else if (!/(?=.*[@$!%*?&])/.test(formData.password)) {
    errors.password =
      "Password must contain at least one special character (@$!%*?&)";
  }

  // Confirm password
  if (!formData.confirmPassword) {
    errors.confirmPassword = "Please confirm your password";
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  // Health Profile Validation
  // Age validation
  const age = parseInt(formData.age);
  if (!formData.age) {
    errors.age = "Age is required";
  } else if (isNaN(age)) {
    errors.age = "Age must be a number";
  } else if (age < 15) {
    errors.age = "You must be at least 15 years old";
  } else if (age > 70) {
    errors.age = "Age cannot exceed 70 years";
  }

  // Biological Sex
  if (!formData.biologicalSex) {
    errors.biologicalSex = "Please select your biological sex";
  }

  // Height validation
  const height = parseInt(formData.height);
  if (!formData.height) {
    errors.height = "Height is required";
  } else if (isNaN(height)) {
    errors.height = "Height must be a number";
  } else if (height < 120) {
    errors.height = "Height must be at least 120 cm";
  } else if (height > 220) {
    errors.height = "Height cannot exceed 220 cm";
  }

  // Weight validation
  const weight = parseInt(formData.weight);
  if (!formData.weight) {
    errors.weight = "Weight is required";
  } else if (isNaN(weight)) {
    errors.weight = "Weight must be a number";
  } else if (weight < 30) {
    errors.weight = "Weight must be at least 30 kg";
  } else if (weight > 200) {
    errors.weight = "Weight cannot exceed 200 kg";
  }

  // Activity Level
  if (!formData.activityLevel) {
    errors.activityLevel = "Please select your activity level";
  }

  // Experience Level
  if (!formData.experienceLevel) {
    errors.experienceLevel = "Please select your experience level";
  }

  // Primary Goal
  if (!formData.primaryGoal) {
    errors.primaryGoal = "Please select your primary goal";
  }

  // Legal Checkboxes
  if (!formData.medicalDisclaimer) {
    errors.medicalDisclaimer =
      "You must accept the medical disclaimer to continue";
  }

  if (!formData.termsAccepted) {
    errors.termsAccepted = "You must accept the Terms & Conditions";
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

export const getPasswordStrength = (password) => {
  if (!password) return { level: 0, message: "", color: "gray" };

  let strength = 0;
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    numbers: /\d/.test(password),
    special: /[@$!%*?&]/.test(password),
  };

  // Calculate strength level (0-4)
  if (checks.length) strength++;
  if (checks.uppercase) strength++;
  if (checks.numbers) strength++;
  if (checks.special) strength++;

  // Additional point for combination
  if (strength === 4 && checks.lowercase) strength = 5;

  const strengthConfig = {
    0: { message: "Enter a password", color: "gray" },
    1: { message: "Weak", color: "red" },
    2: { message: "Fair", color: "orange" },
    3: { message: "Good", color: "yellow" },
    4: { message: "Strong", color: "blue" },
    5: { message: "Very Strong", color: "green" },
  };

  return {
    level: strength,
    message: strengthConfig[strength]?.message || "",
    color: strengthConfig[strength]?.color || "gray",
    checks,
  };
};

export const calculateBMI = (weight, height) => {
  if (!weight || !height) return null;

  const weightNum = parseFloat(weight);
  const heightNum = parseFloat(height) / 100; // convert cm to m

  if (isNaN(weightNum) || isNaN(heightNum) || heightNum === 0) return null;

  const bmi = weightNum / (heightNum * heightNum);
  const roundedBMI = Math.round(bmi * 10) / 10;

  let category;
  let color;
  let recommendation;

  if (bmi < 18.5) {
    category = "Underweight";
    color = "blue";
    recommendation = "Focus on nutrient-dense foods and strength training";
  } else if (bmi < 25) {
    category = "Normal";
    color = "green";
    recommendation = "Great! Maintain with balanced diet and regular exercise";
  } else if (bmi < 30) {
    category = "Overweight";
    color = "yellow";
    recommendation = "Consider a balanced diet and increased physical activity";
  } else {
    category = "Obese";
    color = "red";
    recommendation =
      "Consult with a healthcare provider for a personalized plan";
  }

  return {
    value: roundedBMI,
    category,
    color,
    recommendation,
  };
};

// Additional utility functions for form handling
export const formatHeight = (cm) => {
  if (!cm) return "";
  const meters = Math.floor(cm / 100);
  const centimeters = cm % 100;
  return `${meters}'${centimeters}"`;
};

export const calculateCalorieNeeds = (
  weight,
  height,
  age,
  sex,
  activityLevel,
) => {
  // Mifflin-St Jeor Equation
  if (!weight || !height || !age || !sex) return null;

  const weightNum = parseFloat(weight);
  const heightNum = parseFloat(height);
  const ageNum = parseInt(age);

  if (isNaN(weightNum) || isNaN(heightNum) || isNaN(ageNum)) return null;

  let bmr;
  if (sex === "male") {
    bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum + 5;
  } else {
    bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum - 161;
  }

  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    very: 1.725,
    extra: 1.9,
  };

  const multiplier = activityMultipliers[activityLevel] || 1.2;
  const tdee = Math.round(bmr * multiplier);

  return {
    bmr: Math.round(bmr),
    tdee,
    maintenance: tdee,
    weightLoss: Math.round(tdee * 0.8),
    weightGain: Math.round(tdee * 1.15),
  };
};
