const express = require('express');
const router = express.Router();
const Person = require('./../models/person')

const {jwtAuthMiddleware, generateToken} = require('./../jwt');

// Post route to add a person
router.post('/signup', async(req, res) => {
  try {
    const personData = req.body // Assuming the request body contains the new person data

    // create a new person document using Mongoose model
    const newPerson = new Person(personData);

    // save the new person to the databases
    const response = await newPerson.save();
    console.log('person data Saved');

    const payload = {
      id: response.id,
      userame: response.username
    }

    console.log(JSON.stringify(payload));
    const token = generateToken(payload);
    console.log('Token is : ', token);

    res.status(200).json({response: response, token: token});
  } 
  catch (error) {
    console.log(error);
    res.status(500).json({erron: 'Internal Server Error'});
  }
})

// Login the user
router.post('/login', async (req, res) => {
  try {
    // Extract username and password from request body
    const {username, password} = req.body;

    // find the useranme exist or not
    const user = await Person.findOne({username: username});

    // If user does not exist or password does not match, return error
    if(!user || !(await user.comparePassword(password))){
      return res.status(401).json({error: 'Invalid username or password'});
    }

    // generate token 
    const payload = {
      id: user.id,
      username: user.username
    }
    const token = generateToken(payload);

    // return token as a response
    res.json({token});
  } catch (error) {
    console.log(error)
    res.status(500).json({error: 'Internal Server Error'});
  }
}) 



// Get method to get person
router.get('/',jwtAuthMiddleware, async(req, res) => {
  try {
    const data = await Person.find();
    console.log("Data fetched");
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({erron: 'Internal Server Error'});
  }
})

// getting data from variable endpoint (using worktype endpoint)
router.get('/:workType', async (req, res) => {
  try {
    const workType = req.params.workType;  // extract the work type from the URL parameter

    if(workType == 'chef' || workType == 'manager' || workType == 'waiter') {
      
      const response = await Person.find({work: workType});
      console.log('responser fetched');
      res.status(200).json(response);

    }else {
      res.status(400).json({error: 'Invalid work type'});
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({erron: 'Internal Server Error'});
  }
})

// Put request to update
router.put('/:id', async (req, res) => {
  try {
    const personId = req.params.id;  // Extract the id from the URL Paramater
    const updatedPersonData = req.body; // Updated data from the person

    const response = await Person.findByIdAndUpdate(personId, updatedPersonData, {
      new: true, // Return the updated document
      runValidators: true, // Run Mongoose Validation
    });

    if(!response) {
      return res.status(404).json({error: 'Person not found'});
    }

    console.log('Data Updated');
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({erron: 'Internal Server Error'});
  }
})

// Delete request
router.delete('/:id', async(req, res) => {
  try {
    const personId = req.params.id;  // Extract the person Id
    
    // Assuming you have a person Model
    const response = await Person.findByIdAndDelete(personId);

    if(!response){
      return res.status(404).json({error: 'Person not found'});
    }
    console.log('Data deleted');
    res.status(200).json({message: 'Person Deleted successfully'});

  } catch (error) {
    console.log(error);
    res.status(500).json({error: 'Internal Serever Error'});
  }
})


// Profile Route
router.get('/profile',jwtAuthMiddleware, async (req, res) => {
  try {
    const userData = req.user;
    console.log("user Data is : ", userData);

    const userId = userData.id;
    const user = await Person.findById(userId);

    res.status(200).json({user});
  } catch (error) {
    console.log(error);
    res.status(500).json({error: 'Internal Serever Error'});
  }
})

module.exports = router;

// comment added to check git commit another comment added