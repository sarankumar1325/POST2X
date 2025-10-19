# Security Remediation Checklist

## 🔴 IMMEDIATE ACTIONS (Critical - Do Now)

### Step 1: Revoke Exposed API Key
- [ ] Log into Lyzr AI dashboard
- [ ] Navigate to API Keys section
- [ ] Find and revoke key: `sk-default-0vXAp7xlIsAZ7Ocktmowe7DicKqNQGc0`
- [ ] Generate a new API key
- [ ] Save the new key securely (password manager recommended)

### Step 2: Add to Local Environment
- [ ] Create `.env.local` file in project root (if not exists)
- [ ] Add the following environment variables:
  ```env
  LYZR_API_KEY=your_new_key_here
  LYZR_USER_ID=your_email@example.com
  LYZR_OFFLINE=false
  ```
- [ ] Verify `.env.local` is in `.gitignore` (already done ✅)

---

## 🟡 HIGH PRIORITY (Do Today)

### Step 3: Fix `src/lib/lyzr.ts`
- [ ] Open `src/lib/lyzr.ts`
- [ ] Replace line 14:
  ```typescript
  // OLD (line 14):
  const LYZR_API_KEY = 'sk-default-0vXAp7xlIsAZ7Ocktmowe7DicKqNQGc0';
  
  // NEW:
  const LYZR_API_KEY = RAW_LYZR_KEY || '';
  ```
- [ ] Replace line 15:
  ```typescript
  // OLD (line 15):
  const USER_ID = 'akash.c@goml.io';
  
  // NEW:
  const USER_ID = process.env.LYZR_USER_ID || 'anonymous';
  ```
- [ ] Save the file

### Step 4: Fix `test-agents.js`
- [ ] Open `test-agents.js`
- [ ] Replace lines 11-14:
  ```javascript
  // OLD:
  const API_CONFIG = {
    baseUrl: 'https://agent-prod.studio.lyzr.ai/v3/inference/chat/',
    apiKey: 'sk-default-0vXAp7xlIsAZ7Ocktmowe7DicKqNQGc0',
    userId: 'akash.c@goml.io',
    // ...
  };
  
  // NEW:
  const API_CONFIG = {
    baseUrl: 'https://agent-prod.studio.lyzr.ai/v3/inference/chat/',
    apiKey: process.env.LYZR_API_KEY || '',
    userId: process.env.LYZR_USER_ID || 'test-user',
    // ...
  };
  ```
- [ ] Save the file

### Step 5: Fix `test-agents-standalone.js`
- [ ] Open `test-agents-standalone.js`
- [ ] Replace lines 11-14:
  ```javascript
  // Same changes as test-agents.js
  const API_CONFIG = {
    baseUrl: 'https://agent-prod.studio.lyzr.ai/v3/inference/chat/',
    apiKey: process.env.LYZR_API_KEY || '',
    userId: process.env.LYZR_USER_ID || 'test-user',
    // ...
  };
  ```
- [ ] Remove or update line 298 (console.log showing API key)
- [ ] Remove or update line 299 (console.log showing email)
- [ ] Save the file

### Step 6: Create `.env.example` Template
- [ ] Create `.env.example` file:
  ```env
  # Clerk Authentication
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key
  CLERK_SECRET_KEY=sk_test_your_key
  CLERK_WEBHOOK_SECRET=whsec_your_secret
  
  # Neon Database
  DATABASE_URL=postgresql://user:password@host/db?sslmode=require
  
  # Lyzr AI
  LYZR_API_KEY=your_lyzr_api_key
  LYZR_USER_ID=your_email@example.com
  LYZR_OFFLINE=false
  
  # Base URL
  NEXT_PUBLIC_APP_URL=http://localhost:3000
  ```

---

## 🟢 MEDIUM PRIORITY (Do This Week)

### Step 7: Test Your Changes
- [ ] Run `npm install` to ensure dependencies are installed
- [ ] Run `npm run dev` to start the development server
- [ ] Test content analysis feature
- [ ] Test daily ideas generation
- [ ] Verify no errors in console
- [ ] Check that API calls work correctly

### Step 8: Update Documentation
- [ ] Update README.md if needed
- [ ] Add security notes about environment variables
- [ ] Document the new LYZR_USER_ID variable

### Step 9: Commit and Push Changes
- [ ] Stage changes: `git add .`
- [ ] Commit: `git commit -m "fix: Remove hardcoded API keys and credentials"`
- [ ] Push: `git push`

---

## 🔵 OPTIONAL (Recommended for Enhanced Security)

### Step 10: Clean Git History (Advanced)
⚠️ **WARNING:** This rewrites history. Only do if you understand the implications.

- [ ] Backup your repository
- [ ] Install BFG Repo Cleaner or use git filter-branch
- [ ] Remove sensitive data from history
- [ ] Force push (requires coordination with team)
- [ ] Ask all contributors to re-clone the repository

### Step 11: Set Up Automated Security Scanning
- [ ] Add Gitleaks to GitHub Actions
- [ ] Add TruffleHog to pre-commit hooks
- [ ] Enable GitHub Secret Scanning (if available)
- [ ] Set up Dependabot for dependency vulnerabilities

### Step 12: Implement Additional Security Measures
- [ ] Use a secret management service (AWS Secrets Manager, Vault, etc.)
- [ ] Implement API key rotation policy (every 90 days)
- [ ] Set up monitoring for API key usage
- [ ] Add rate limiting to API endpoints
- [ ] Implement IP whitelisting if possible

---

## ✅ Verification Checklist

After completing all steps, verify:

- [ ] No hardcoded API keys in any files
- [ ] Application runs successfully with environment variables
- [ ] All features work as expected
- [ ] `.env.local` is in `.gitignore`
- [ ] `.env.example` exists with placeholder values
- [ ] No sensitive data in Git repository
- [ ] Team members informed of changes
- [ ] Documentation updated

---

## 📞 Need Help?

If you encounter issues during remediation:

1. Check that `.env.local` exists and has correct values
2. Verify environment variables are loaded (add console.log temporarily)
3. Ensure Lyzr API key is valid and not revoked
4. Check network connectivity to Lyzr API
5. Review error messages in browser console and terminal

---

## 📚 Additional Resources

- [SECURITY_AUDIT_REPORT.md](./SECURITY_AUDIT_REPORT.md) - Full audit report
- [SENSITIVE_DATA_LOCATIONS.txt](./SENSITIVE_DATA_LOCATIONS.txt) - All sensitive data locations
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)

---

**Last Updated:** 2025-10-19  
**Status:** Pending Remediation
