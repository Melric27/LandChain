# LandChain — Permissioned Blockchain Land Registry

A college PBL project simulating a **Hyperledger-like permissioned blockchain** for land registration, built entirely in **Node.js** — no Docker, no Fabric.

---

## Architecture

```
┌──────────────────────────────────────────────────────┐
│                    React Frontend                     │
│  Dashboard │ Create │ Transfer │ View │ History │ Chain│
├──────────────────────────────────────────────────────┤
│                Express API Layer                      │
│  POST /createLand  │  POST /transferLand  │  GET ...  │
├──────────────────────────────────────────────────────┤
│              Permission Layer (RBAC)                  │
│          Admin: read + write  │  User: read-only      │
├──────────────────────────────────────────────────────┤
│             Smart Contract Layer                      │
│  createLand │ transferLand │ getLand │ getHistory      │
├──────────────────────────────────────────────────────┤
│               Blockchain Ledger                       │
│  SHA256 blocks │ Chain validation │ Immutable history  │
└──────────────────────────────────────────────────────┘
```

## Quick Start

### Prerequisites
- **Node.js** (v18+)
- **npm**

### 1. Install & Start Backend

```bash
cd backend
npm install
npm run dev      # runs on http://localhost:5000
```

### 2. Install & Start Frontend

```bash
cd frontend
npm install
npm start        # runs on http://localhost:3000
```

### 3. Use the App

1. Open **http://localhost:3000** in your browser
2. The sidebar has a **Role Selector** → choose `Admin` or `User`
3. As **Admin**: register land, transfer ownership
4. As **User**: view land details, history, and blockchain (no write access)

---

## API Endpoints

| Method | Endpoint             | Role  | Description            |
|--------|----------------------|-------|------------------------|
| POST   | `/api/createLand`    | Admin | Register new land      |
| POST   | `/api/transferLand`  | Admin | Transfer ownership     |
| GET    | `/api/getLand/:id`   | Any   | View land details      |
| GET    | `/api/getHistory/:id`| Any   | View ownership history |
| GET    | `/api/lands`         | Any   | List all lands         |
| GET    | `/api/chain`         | Any   | View full blockchain   |
| GET    | `/api/validate`      | Any   | Validate chain         |

**Role is sent via the `x-user-role` header** (`admin` | `user`).

---

## Key Concepts Demonstrated

1. **Permissioned Blockchain** — Role-based access (Admin vs User)
2. **Smart Contracts** — Business logic layer mimicking Hyperledger chaincode
3. **Immutable Ledger** — SHA256-linked blocks with chain validation
4. **World State** — In-memory state map for current land records
5. **Ownership History** — Full audit trail via blockchain traversal

---

## Tech Stack

- **Backend**: Node.js, Express
- **Frontend**: React, React Router, Axios
- **Blockchain**: Custom implementation with `crypto` (SHA256)
- **Storage**: In-memory (no database required)
