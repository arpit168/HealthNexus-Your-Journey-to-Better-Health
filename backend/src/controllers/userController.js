import cloudinary from "../config/cloudinary.js";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";

export const updateUserProfile = async (req, res, next) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const updates = {};
    const {
      fullName,
      email,
      phone,
      dob,
      gender,
      address,
      city,
      pin,
      photo,
      healthData,
      documents,
    } = req.body;

    /* ================= BASIC FIELDS ================= */

    if (fullName !== undefined) updates.fullName = fullName;

    if (email !== undefined) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }

      const emailExists = await User.findOne({
        email: email.toLowerCase(),
        _id: { $ne: userId },
      });

      if (emailExists) {
        return res.status(409).json({ message: "Email already in use" });
      }

      updates.email = email.toLowerCase();
    }

    if (phone !== undefined) {
      if (!/^\d{10}$/.test(phone.replace(/\D/g, ""))) {
        return res.status(400).json({ message: "Phone must be 10 digits" });
      }
      updates.phone = phone;
    }

    if (dob !== undefined) updates.dob = dob;
    if (gender !== undefined) updates.gender = gender;
    if (address !== undefined) updates.address = address;
    if (city !== undefined) updates.city = city;

    if (pin !== "N/A" && pin !== null && pin !== undefined) {
      if (!/^\d{6}$/.test(pin)) {
        return res.status(400).json({ message: "Invalid PIN" });
      }
      updates.pin = pin;
    }

    /* ================= PHOTO ================= */

    if (photo !== undefined) {
      updates.photo = {
        url: photo.url || "",
        publicID: photo.publicID || "",
      };
    }

    /* ================= DOCUMENTS ================= */
    // if (documents !== N/A) {

    //   if (documents?.pan) {
    //     const pan = documents.pan.trim().toUpperCase();

    //     if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan)) {
    //       return res.status(400).json({ message: "Invalid PAN format" });
    //     }

    //     documents.pan = pan;
    //   }

    //   updates.documents = {
    //     ...documents,
    //   };
    // }

    /* ================= HEALTH DATA ================= */

    if (healthData !== undefined) {
      updates.healthData = healthData;

      // Auto BMI calculation (if vitals present)
      if (healthData?.vitals?.height && healthData?.vitals?.weight) {
        const h = healthData.vitals.height / 100;
        updates.healthData.vitals.bmi =
          Math.round((healthData.vitals.weight / (h * h)) * 10) / 10;
      }
    }

    /* ================= SAVE ================= */

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true },
    ).select("-password -__v");

    res.status(200).json({
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

// ================= CHANGE PROFILE PHOTO =================
export const UserChangePhoto = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.body.id || req.body._id;
    if (!userId) {
      const error = new Error("User id is required");
      error.statusCode = 400;
      return next(error);
    }

    const currentUser = await User.findById(userId);
    if (!currentUser) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }

    const dp = req.file;

    if (!dp) {
      const error = new Error("Profile Picture required");
      error.statusCode = 400;
      return next(error);
    }

    if (currentUser.photo?.publicID) {
      await cloudinary.uploader.destroy(currentUser.photo.publicID);
    }

    const b64 = Buffer.from(dp.buffer).toString("base64");
    const dataURI = `data:${dp.mimetype};base64,${b64}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "HealthNexus/User",
      width: 500,
      height: 500,
      crop: "fill",
    });

    currentUser.photo.url = result.secure_url;
    currentUser.photo.publicID = result.public_id;

    await currentUser.save();

    res.status(200).json({
      message: "Photo Updated Successfully",
      data: currentUser,
    });
  } catch (error) {
    next(error);
  }
};
// ================= RESET PASSWORD =================

export const UserResetPassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user._id; // from Protect middleware

    if (!oldPassword || !newPassword) {
      const error = new Error("All fields required");
      error.statusCode = 400;
      return next(error);
    }

    // Fetch user with password field
    const user = await User.findById(userId).select("+password");
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }

    const isVerified = await bcrypt.compare(oldPassword, user.password);
    if (!isVerified) {
      const error = new Error("Old password did not match");
      error.statusCode = 401;
      return next(error);
    }

    // Hash and save new password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashPassword;
    await user.save();

    res.status(200).json({ message: "Password Reset Successful" });
  } catch (error) {
    next(error);
  }
};
