const express = require('express');
const prisma = require('../db');
const router = express.Router();
const {  getUsers } = require('../loggedInUsers');

// pridobi vse uporabnike
router.get('/', async (req, res) => {
  const users = await prisma.user.findMany();
  console.log({line:"8", a:getUsers()})
  const data={users, loggedInUsers:getUsers()}
  res.json(data);
});

// ustvari novega uporabnika
router.post('/', async (req, res) => {
  const { name } = req.body;
  const user = await prisma.user.create({
    data: { name }
  });
  res.json(user);
});

module.exports = router;
