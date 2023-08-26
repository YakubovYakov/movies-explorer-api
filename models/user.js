const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { isEmail } = require('validator');

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Поле "email" должно быть заполнено'],
      unique: true,
      validate: [isEmail, 'Не валидный Email'],
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    name: {
      type: String,
      required: [true, 'Поле "name" должно быть заполнено'],
      minlength: [2],
      maxlength: [30],
    },
  },
  {
    versionKey: false,
    statics: {
      findUserByCredentials(email, password) {
        return this.findOne({ email })
          .select('+password')
          .then((user) => {
            if (user) {
              return bcrypt.compare(password, user.password).then((matched) => {
                if (matched) return user;

                return Promise.reject();
              });
            }

            return Promise.reject();
          });
      },
    },
  },
);

module.exports = mongoose.model('user', userSchema);
