# 🤝 Shared Directory

This directory is reserved for code, configurations, validation schemas, and constants shared between the **frontend** and **backend**.

---

## 💡 Recommended Extensions

### 1. Unified Validation Schemas (Zod)
In a professional monorepo setup, you define validation rules in a single place to ensure input formats are identical on both frontend (client-side form validation) and backend (server-side API request sanitization).

For example, you could create a `shared/validation/auth.js` schema:
```javascript
const { z } = require('zod');

const RegisterSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  userRole: z.enum(['homeowner', 'worker', 'admin'])
});

module.exports = { RegisterSchema };
```

### 2. Common Constants
Define error codes, status lists, or category enums here, like `shared/constants/jobCategories.js`:
```javascript
const JOB_CATEGORIES = [
  'Plumbing',
  'Electrical',
  'Painting',
  'Carpentry',
  'Masonry',
  'HVAC',
  'Landscaping'
];

module.exports = { JOB_CATEGORIES };
```

---

## ⚙️ How to Import
Since npm workspaces links packages, you can import this directory directly or add it as a local workspace dependency if you configure it as a private package in `shared/package.json`.
