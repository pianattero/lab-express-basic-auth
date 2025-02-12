const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: [true, 'Username is required']
  },
  password: {
    type: String,
    minlength: [8, 'Your password must have at least 8 characters'],
    required: [true, 'Password is required']
  }
});

userSchema.pre('save', function(next) {
  const unhashedPassword = this.password;
  
  if (this.isModified('password')) {
    bcrypt.hash(unhashedPassword, SALT_ROUNDS)
    .then(hash => {
      this.password = hash;
      next()
    })
    .catch(err => console.error(err))
  } else {
    next()
  }
});

//Comparar contraseña que ingresó el usuario con la que registró al hacer el sign in
userSchema.methods.checkPassword = function(passwordToCompare) {
  return bcrypt.compare(passwordToCompare, this.password);
}

const User = mongoose.model("User", userSchema);

module.exports = User;
