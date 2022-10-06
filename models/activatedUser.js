const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const ActivatedUserSchema = new Schema(
  {
    fullname: {
      type: String,
      required: [true, "field name is required"],
    },
    location: {
      type: String,
    },
    alternative_email: {
      type: String,
      required: [true, "alternative mail is required"],
    },
    phone_number: {
      type: String,
      required: [true, "phone number is required"],
    },
    country: {
      type: String,
      required: [true, "country is required"],
    },
    prefered_currency: {
      type: String,
      required: [true, "please provide your prefered currency"],
    },
    city: {
      type: String,
      required: [true, "city is required"],
    },
    periodAvailable: {
      type: String,
      required: [true, "period of availability is required"],
    },
    imgUrl: {
      type: String,
      default: "/uploads/defaultImg.png",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    appointments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment",
      },
    ],
  },
  {
    timestamps: true,
  }
);

ActivatedUserSchema.pre("save", async function (next) {
  try {
    const saltRounds = 10;
    let hash = await bcrypt.hash(this.password, saltRounds);
    this.password = hash;
  } catch (error) {
    next(error);
  }
  next();
});

module.exports = mongoose.model("ActivatedUser", ActivatedUserSchema);
