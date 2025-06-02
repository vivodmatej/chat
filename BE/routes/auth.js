const express = require('express');
const router = express.Router();
const prisma = require('../db'); 

const { addUser, removeUser, getUsers } = require('../loggedInUsers');

// prijava v aplikacijo
router.post('/login', async (req, res) => {
  const { name } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'Username is required' });
  }

  const username = name.trim();

  // preveri, če je uporabnik že prijavljen v applikacijo
  const alreadyLogged = getUsers().find((u) => u.name === username);
  if (alreadyLogged) {
    return res.status(403).json({ error: 'User already logged in' });
  }

  // Preveri, če uporabnik že obstaja
  let user = await prisma.user.findFirst({ where: { name: username } });

  // Ustvari novega uporabnika, če ne obstaja
  let newUser = false
  if (!user) {
    user = await prisma.user.create({ data: { name: username } });
    newUser = true
  }

  // prijavi uporabnika v applikacijo
  addUser({ id: user.id, name: user.name });
  //Pošlji posodobljene uporabniko v socketu
  req.app.get('io').emit('updateLoggedUsers', getUsers());

  res.json({ message: 'Login successful', user, newUser });
});

// odjava uporabnika iz aplikacije
router.post('/logout', (req, res) => {
  const { id } = req.body;
  removeUser( id);
  req.app.get('io').emit('updateLoggedUsers', getUsers());
  res.json({ message: 'Logged out' });
});

module.exports = { router };
