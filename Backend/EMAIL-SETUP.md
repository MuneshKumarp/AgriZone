# Email Setup Instructions

## Setting up Gmail for OTP (Free)

### Step 1: Enable 2-Step Verification
1. Go to https://myaccount.google.com/security
2. Click "2-Step Verification" and enable it
3. Follow the setup process

### Step 2: Create App Password
1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" from dropdown
3. Select "Other (Custom name)" 
4. Enter "AgriZone Backend"
5. Click "Generate"
6. Copy the 16-character password (spaces will be added automatically)

### Step 3: Configure Backend
1. Create a `.env` file in the `Backend` folder:
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx
```

2. Update `Backend/config/email.js`:
- Replace `process.env.EMAIL_USER` with your Gmail address
- Replace `process.env.EMAIL_PASS` with your app password

### Step 4: Install Dependencies
```bash
cd Backend
npm install
```

### Step 5: Test Email
```bash
node server.js
```

The backend will now send OTP emails when users request password reset!

## Troubleshooting

### "Invalid login" error
- Make sure you're using the 16-character app password, not your regular Gmail password
- Verify 2-Step Verification is enabled

### Email not sending
- Check MongoDB is running
- Check backend console for errors
- Verify email credentials in `.env` file

### Email going to spam
- This is normal for automated emails
- Users should check spam folder for OTP

## Alternative: Using Other Email Services

You can modify `Backend/config/email.js` to use:
- **SendGrid** (free tier: 100 emails/day)
- **Mailgun** (free tier: 100 emails/day)  
- **Sendinblue** (free tier: 300 emails/day)

Just update the transporter configuration in `email.js`.

