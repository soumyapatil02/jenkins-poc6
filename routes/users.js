const express = require('express');
const router = express.Router();
const { calculateAge, formatName } = require('../utils/helper');

// Fake in-memory database
let users = [
    { id: 1, name: 'alice smith', birthYear: 1995 },
    { id: 2, name: 'bob jones', birthYear: 1988 },
    { id: 3, name: 'carol white', birthYear: 2000 }
];

// GET all users
router.get('/', (req, res) => {
    const formattedUsers = users.map(user => ({
        id: user.id,
        name: formatName(user.name),
        age: calculateAge(user.birthYear)
    }));
    res.status(200).json(formattedUsers);
});

// GET single user by ID
router.get('/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({
        id: user.id,
        name: formatName(user.name),
        age: calculateAge(user.birthYear)
    });
});

// POST create new user
router.post('/', (req, res) => {
    const { name, birthYear } = req.body;
    if (!name || !birthYear) {
        return res.status(400).json({ error: 'Name and birthYear are required' });
    }
    const newUser = {
        id: users.length + 1,
        name: name.toLowerCase(),
        birthYear: parseInt(birthYear)
    };
    users.push(newUser);
    res.status(201).json({
        id: newUser.id,
        name: formatName(newUser.name),
        age: calculateAge(newUser.birthYear)
    });
});

// DELETE user by ID
router.delete('/:id', (req, res) => {
    const index = users.findIndex(u => u.id === parseInt(req.params.id));
    if (index === -1) {
        return res.status(404).json({ error: 'User not found' });
    }
    users.splice(index, 1);
    res.status(200).json({ message: 'User deleted successfully' });
});

module.exports = router;