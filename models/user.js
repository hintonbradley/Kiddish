var bcrypt = require("bcrypt");
var salt = bcrypt.genSaltSync(10);

module.exports = function (sequelize, DataTypes){
  var User = sequelize.define('User', {
    
// MERGE CONFLICT!! REVIEW AFTER PUSH!
///////////////////////////////////////
// <<<<<<< HEAD
//     username: DataTypes.STRING,
//     email: DataTypes.STRING,
//     password_digest: DataTypes.STRING
//   }, {
//     classMethods: {
//       associate: function(models) {
//         // associations can be defined here
//         // this.hasMany(models.Video);
// =======
    email: { 
      type: DataTypes.STRING, 
      unique: true, 
      validate: {
        len: [6, 30],
      }
    },
    password_digest: {
      type:DataTypes.STRING,
      validate: {
        notEmpty: true
// >>>>>>> 115a52978286a454d8e426f9ff99ac8f62c11123
      }
    }
  },

  {
    instanceMethods: {
      checkPassword: function(password) {
        return bcrypt.compareSync(password, this.password_digest);
      }
    },
    classMethods: {
      encryptPassword: function(password) {
        var hash = bcrypt.hashSync(password, salt);
        return hash;
      },
      createSecure: function(email, password) {
        if(password.length < 6) {
          throw new Error("Password too short");
        }
        return this.create({
          email: email,
          password_digest: this.encryptPassword(password)
        });

      },
      authenticate: function(email, password) {
        // find a user in the DB
        return this.find({
          where: {
            email: email
          }
        }) 
        .then(function(user){
          if (user === null){
            throw new Error("Username does not exist");
          }
          else if (user.checkPassword(password)){
            return user;
          }

        });
      }

    } // close classMethods
  }); // close define user
  return User;
}; // close User function


// 'use strict';
// module.exports = function(sequelize, DataTypes) {
//   var User = sequelize.define('User', {
//     username: DataTypes.STRING,
//     email: DataTypes.STRING,
//     password_digest: DataTypes.STRING
//   }, {
//     classMethods: {
//       associate: function(models) {
//         // associations can be defined here
//         this.hasMany(models.Video);
//       }
//     }
//   });
//   return User;
// };