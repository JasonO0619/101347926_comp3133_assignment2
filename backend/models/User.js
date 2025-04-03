const mongoose = require('mongoose');
const emailRegex  = require('../constants');

const UserSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true 
    },
    email: { 
        type: String,
         required: true, 
         unique: true,
         validate: function(value) {
            return emailRegex.test(value);
          } 
        },
    password: { 
        type: String, 
        required: true 
    }},
    {
      timestamps: true 
    }
  );

module.exports = mongoose.model('User', UserSchema);
