const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const store = require('../models/store');

router.get('/', (req, res) => {
  const { zone, status } = req.query;
  let filtered = [...store.workers];

  if (zone) {
    filtered = filtered.filter(w => w.zone === zone);
  }
  if (status) {
    filtered = filtered.filter(w => w.status === status);
  }

  res.json({ workers: filtered });
});

router.post('/', (req, res) => {
  const { name, badgeId, zone, role } = req.body;

  if (!name || !badgeId) {
    return res.status(400).json({ error: 'Name and badgeId are required' });
  }

  const worker = {
    id: uuidv4(),
    name,
    badgeId,
    zone: zone || null,
    role: role || 'operator',
    status: 'active',
    lastSeen: new Date().toISOString(),
    createdAt: new Date().toISOString()
  };

  store.workers.push(worker);
  res.status(201).json({ worker });
});

router.put('/:id', (req, res) => {
  const worker = store.workers.find(w => w.id === req.params.id);
  if (!worker) {
    return res.status(404).json({ error: 'Worker not found' });
  }

  const { name, badgeId, zone, role, status } = req.body;
  if (name !== undefined) worker.name = name;
  if (badgeId !== undefined) worker.badgeId = badgeId;
  if (zone !== undefined) worker.zone = zone;
  if (role !== undefined) worker.role = role;
  if (status !== undefined) worker.status = status;
  worker.lastSeen = new Date().toISOString();

  res.json({ worker });
});

router.delete('/:id', (req, res) => {
  const index = store.workers.findIndex(w => w.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Worker not found' });
  }

  store.workers.splice(index, 1);
  res.status(204).send();
});

module.exports = router;
