import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // ✅ REQUIRED (Signup)
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    // ✅ OPTIONAL (Editable later)
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },

    dob: { type: String },
    gender: {
      type: String,
      enum: ["male", "female", "others", "N/A"],
    },

    phone: { type: String },
    address: { type: String },
    city: { type: String },
    pin: { type: String },

    photo: {
      url: { type: String },
      publicID: { type: String },
    },

    // ✅ Health Data (Optional – profile completion phase)
    healthData: {
      profile: {
        age: Number,
        gender: String,
        activityLevel: String,
      },
      goals: {
        primaryGoal: String,
        timeline: String,
        experienceLevel: String,
        calorieTarget: Number,
      },
      vitals: {
        height: Number,
        weight: Number,
        currentWeight: Number,
        goalWeight: Number,
        bmi: Number,
        bloodGroup: String,
        heartRate: Number,
        bloodPressure: String,
        oxygenSaturation: Number,
        temperature: Number,
      },

      medicalHistory: {
        chronicDiseases: [String],
        surgeries: [String],
        allergies: [String],
      },

      medications: {
        currentMedications: [String],
        pastMedications: [String],
      },

      lifestyle: {
        smoking: Boolean,
        alcohol: Boolean,
        exerciseFrequency: {
          type: String,
          enum: ["None", "Occasional", "Regular"],
        },
        diet: String,
      },

      labReports: [
        {
          reportName: String,
          reportDate: Date,
          result: String,
          fileUrl: String,
        },
      ],

      appointments: [
        {
          doctorName: String,
          specialization: String,
          appointmentDate: Date,
          notes: String,
        },
      ],

      vaccinations: [
        {
          vaccineName: String,
          dose: String,
          date: Date,
        },
      ],

      emergencyContacts: [
        {
          name: String,
          relation: String,
          phone: String,
        },
      ],
    },

    // ✅ Documents (Optional)
    documents: {
      gst: String,
      uidai: String,
      pan: String,
    },

    // ✅ System flags
    isActive: {
      type: Boolean,
      default: true,
    },

    workouts: { type: [mongoose.Schema.Types.Mixed], default: [] },
    meals: { type: [mongoose.Schema.Types.Mixed], default: [] },
    weightTracking: { type: [mongoose.Schema.Types.Mixed], default: [] },
    measurements: { type: [mongoose.Schema.Types.Mixed], default: [] },
    progressPhotos: { type: [mongoose.Schema.Types.Mixed], default: [] },
    adherenceLogs: { type: [mongoose.Schema.Types.Mixed], default: [] },
    dietPlan: { type: mongoose.Schema.Types.Mixed, default: {} },
    workoutPlan: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);
export default User;
