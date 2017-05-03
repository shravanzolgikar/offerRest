//========================Module Dependencies==============================
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var validator = require('validator');
var bcrypt = require('bcrypt');
SALT_WORK_FACTOR = 10;
var uniqueValidator = require('mongoose-beautiful-unique-validation');

//========================UserModule Schema=================================
var userSchema = new Schema({
    userName: {
        type: String,
        required: [true, 'please enter the name'],
        unique: [true, 'userName/Email already exists'],
        index: true,
        lowercase: true,
        validate: [{
            validator: function (value) {
                return validator.isEmail(value)
            }, msg: 'Invalid Email ID'
        }]
    },
    password: {type: String, required: [true, 'please enter the password']},
    firstName: {type: String, required: [false, 'Please enter firstName']},
    pwdToken: {type: String, required: false, select: false},
    tokenExpiryDate: {type: Date, required: false, select: false},
    lastName: {type: String, required: false},
    isActive: {type: Boolean, required: true, default: true},
    createdDate: {type: Date, required: true, default: Date.now},
    modifiedDate: {type: Date, required: false}
});

//Hashing the Password
userSchema.pre('save', function (next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};
// enables beautifying
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);