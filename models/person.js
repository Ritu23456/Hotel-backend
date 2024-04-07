const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
// Define person Schema
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }, 
  age: {
    type: Number
  },
  work:{
    type: String,
    enum: ['chef', 'waiter', 'manager'],
    required: true
  },
  mobile: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  address: {
    type: String,
  },
  salary: {
    type: Number, 
    required: true
  }, 
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
})

// we need to hash the password before storing it into the databases
personSchema.pre('save', async function(next) {
  const person = this;

  // Hash the password only if it has been modified (or it is new)
  if(!person.isModified('password')) return next(); // let a user only want to change his sallary so in this case no need to change the password
  
  try {
    // hash password generation
    const salt = await bcrypt.genSalt(10);
    
    // hash password
    const hashedPassword = await bcrypt.hash(person.password, salt);

    // Override the plain password with the hashed one
    person.password = hashedPassword;

    next();
  } catch (error) {
    return next(error);
  }
})
personSchema.methods.comparePassword = async function(candidatePassword){
  try {
    // Use bcrypt to compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  } catch (error) {
    throw error;
  }
}

// Create Person model
const Person = mongoose.model('Person', personSchema);

// Export this person model
module.exports = Person;