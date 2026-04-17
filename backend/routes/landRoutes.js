const express = require('express');
const { requireRole } = require('../middleware/permissions');
const crypto = require('crypto');

module.exports = function createLandRoutes(contract) {
  const router = express.Router();

  // ─── POST /api/createLand ───────────────────────────────
  router.post('/createLand', requireRole('admin'), (req, res) => {
    try {
      const { owner, location, area, price, latitude, longitude } = req.body;

      if (!owner || !location || !area || !price) {
        return res.status(400).json({
          success: false,
          error: 'All fields are required: owner, location, area, price',
        });
      }

      const landId = `LAND-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;

      const result = contract.createLand(landId, owner, location, parseFloat(area), parseFloat(price), latitude, longitude);
      res.status(201).json({ success: true, message: `Land "${landId}" registered successfully.`, ...result });
    } catch (err) {
      res.status(409).json({ success: false, error: err.message });
    }
  });

  // ─── POST /api/transferLand ─────────────────────────────
  router.post('/transferLand', requireRole('admin'), (req, res) => {
    try {
      const { landId, newOwner } = req.body;

      if (!landId || !newOwner) {
        return res.status(400).json({
          success: false,
          error: 'Both "landId" and "newOwner" are required.',
        });
      }

      const result = contract.transferLand(landId, newOwner);
      res.status(200).json({ success: true, message: `Land "${landId}" transferred to "${newOwner}".`, ...result });
    } catch (err) {
      res.status(404).json({ success: false, error: err.message });
    }
  });

  // ─── GET /api/getLand/:id ───────────────────────────────
  router.get('/getLand/:id', (req, res) => {
    try {
      const land = contract.getLand(req.params.id);
      res.json({ success: true, land });
    } catch (err) {
      res.status(404).json({ success: false, error: err.message });
    }
  });

  // ─── GET /api/getHistory/:id ────────────────────────────
  router.get('/getHistory/:id', (req, res) => {
    try {
      const history = contract.getHistory(req.params.id);
      res.json({ success: true, history });
    } catch (err) {
      res.status(404).json({ success: false, error: err.message });
    }
  });

  // ─── GET /api/lands ─────────────────────────────────────
  router.get('/lands', (_req, res) => {
    const lands = contract.getAllLands();
    res.json({ success: true, count: lands.length, lands });
  });

  // ─── GET /api/chain ─────────────────────────────────────
  router.get('/chain', (_req, res) => {
    const chain = contract.getChain();
    res.json({ success: true, length: chain.length, chain });
  });

  // ─── GET /api/validate ──────────────────────────────────
  router.get('/validate', (_req, res) => {
    const result = contract.validateChain();
    res.json({ success: true, ...result });
  });

  return router;
};
