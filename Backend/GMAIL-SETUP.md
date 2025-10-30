# Gmail Setup for muneshkumar10pp@gmail.com

## Quick Setup Steps:

### Step 1: Enable 2-Step Verification
1. Go to: https://myaccount.google.com/security
2. Click **"2-Step Verification"**
3. Click **"Get Started"** and follow the prompts

### Step 2: Create App Password
1. Go to: https://myaccount.google.com/apppasswords
2. Grocery select:
   - **"Mail"** from dropdown
   - **"Other (Custom name)"** 
3. Enter name: **"AgriZone"**
4. Click **"Generate"**
5. **Copy the 16-character password** (looks like: abcd efgh ijkl mnop)

### Step 3: Update Backend

Open `Backend/config/email.js` and replace line 9:
```javascript
pass: process.env.EMAIL_PASS || 'paste-your-16-char-password-here',
```

### Step 4: Restart Backend

```bash
# Stop the current backend (Ctrl+C)
cd Backend
node server.js
```

### Step 5: Test
Try forgot password again - you'll now receive OTP on your email!

---

**Quick Test Right Now:**
- Use OTP from backend console: `604747` or `466469`
- After setup, real emails will be sent!
