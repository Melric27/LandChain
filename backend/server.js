const express = require('express');
const cors = require('cors');
const { LandContract } = require('./blockchain/landContract');
const { extractRole } = require('./middleware/permissions');
const createLandRoutes = require('./routes/landRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(extractRole); // attaches req.userRole from x-user-role header

// ─── Instantiate the smart contract (shared singleton) ───
const contract = new LandContract();

// ─── Routes ───────────────────────────────────────────────
app.use('/api', createLandRoutes(contract));

// ─── Health check ─────────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({
    name: 'LandChain API',
    version: '1.0.0',
    description: 'Permissioned Blockchain Land Registry',
    status: 'running',
  });
});

// ─── Start ────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🔗 LandChain API running on http://localhost:${PORT}`);
  console.log(`   Endpoints available at /api/*\n`);
});
