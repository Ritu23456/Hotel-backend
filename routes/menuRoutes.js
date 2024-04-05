const express = require('express');
const router = express.Router();
const MenuItem = require('./../models/MenuItem');

// Post route to add a menuItem
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const newmenuItem = new MenuItem(data);
    const response = await newmenuItem.save();
    console.log('New menu data Saved');
    res.status(200).json(response);

  } catch (error) {
    console.log(error);
    res.status(500).json({error: 'Internal Server Error'});
  }
})
router.get('/', async (req, res) => {
  try {
    const data = await MenuItem.find();
    console.log("Data fetched");
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({error: 'Internal Server Error'});
  }
})

router.get('/:Taste', async (req, res) => {
  try {
    const Taste = req.params.Taste;
    if(Taste == 'sweet' || Taste == 'spicy' || Taste == 'sour') {
      const response = await MenuItem.find({taste: Taste});
      console.log('response fetched');
      res.status(200).json(response);

    }else {
      res.status(400).json({error: 'Invalid Taste type'});
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({error: "Internal Server Error"});
  }
})

module.exports = router;