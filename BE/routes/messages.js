const express = require('express');
const prisma = require('../db');
const router = express.Router();

// pridobi vsa sporočila iz baze
router.get('/', async (req, res) => {
  const messages = await prisma.message.findMany({
    include: { user: true },
    orderBy: { date: 'asc' }
  });

  res.json(messages.map(m => ({
    id: m.id,
    text: m.text,
    date: m.date,
    likes: m.likes,
    user_id: m.userId,
    username: m.user.name
  })));
});

//dodajanje likov, dislaikov ali ostranjevanje teh
router.post('/:id/react', async (req, res) => {
  const messageId = parseInt(req.params.id);
  const { userId, type, username } = req.body;

  if (!['like', 'dislike'].includes(type)) {
    return res.status(400).json({ error: 'Invalid reaction type' });
  }

  //preveri če sporočilo obstaja
  const message = await prisma.message.findUnique({ where: { id: messageId } });
  if (!message) return res.status(404).json({ error: 'Message not found' });

  let updatedLikes = message.likes || [];

  // preveri, če je uporabnik že dal reakcijo
  const existingIndex = updatedLikes.findIndex(r => r.userId === userId);

  if (existingIndex !== -1) {
    const existing = updatedLikes[existingIndex];
    //preveri tip
    if (existing.type === type) {
      // če je enako potem odstrani
      updatedLikes.splice(existingIndex, 1);
    } else {
      // će je različno potem spremeni v novo
      updatedLikes[existingIndex] = {
        userId,
        username: username,
        type
      };
    }
  } else {
    // dodaj novo reakcijo
    updatedLikes.push({
      userId,
      username: username,
      type
    });
  }

  //posodobi sporočilo z reakcijo
  const updatedMessage = await prisma.message.update({
    where: { id: messageId },
    data: { likes: updatedLikes },
    include: { user: true }
  });

  // pošlji posodobitev vsem uporabnikom
  req.app.get('io').emit('messageReactionUpdated', {
    id: updatedMessage.id,
    likes: updatedMessage.likes
  });

  res.json(updatedMessage);
});

module.exports = router;
