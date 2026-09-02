import mongoose from "mongoose";

const ContactSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    sub: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timeStamps: true },
);

const Contact = mongoose.model("contact", ContactSchema);

export default Contact;
