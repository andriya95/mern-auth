const { Schema, model } = require('mongoose')

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
      trim: true
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      trim: true,
      unique: true
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
      min: 6,
    },
    avatar: {
      type: String,
      default: "https://res.cloudinary.com/andriya/image/upload/v1661523548/avatars/blank_avatar_kdg2of.png",
    }
  }, {timestamp: true}
);


module.exports = model("User", userSchema);

