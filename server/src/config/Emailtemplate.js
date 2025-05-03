export const Email_very_template=`<!DOCTYPE html>
<html lang="en" style="margin: 0; padding: 0;">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reset Password - Docushed</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f6fb;
      font-family: 'Arial', sans-serif;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(90deg, #4f46e5, #7c3aed);
      padding: 20px;
      text-align: center;
      color: #fff;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
    }
    .body {
      padding: 30px;
      color: #333;
      text-align: center;
    }
    .body h2 {
      margin-bottom: 10px;
      color: #4f46e5;
    }
    .otp {
      font-size: 24px;
      font-weight: bold;
      background-color: #f3f4f6;
      padding: 12px 20px;
      margin: 20px auto;
      display: inline-block;
      letter-spacing: 2px;
      border-radius: 6px;
      color: #111827;
    }
    .button {
      display: inline-block;
      padding: 12px 25px;
      background-color: #4f46e5;
      color: #fff;
      text-decoration: none;
      border-radius: 6px;
      margin-top: 20px;
      font-weight: bold;
    }
    .footer {
      background-color: #f9fafb;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #6b7280;
    }
    @media (max-width: 600px) {
      .header h1 { font-size: 22px; }
      .body h2 { font-size: 20px; }
      .otp { font-size: 20px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Docushed</h1>
    </div>
    <div class="body">
      <h2>Reset Your Password</h2>
      <p>Hello,</p>
      <p>We received a request to reset your password for your <strong>Docushed</strong> account.</p>
      <p>Use the OTP below to proceed:</p>
      <div class="otp">{{otp}}</div>
      <p>This OTP is valid for 10 minutes.</p>
      <a  class="button">Reset Password</a>
      <p style="margin-top: 30px;">If you did not request a password reset, please ignore this email.</p>
    </div>
    <div class="footer">
      &copy; 2025 Docushed. All Rights Reserved. <br />
      Need help? <a href="mailto:support@docushed.com">Contact Support</a>
    </div>
  </div>
</body>
</html>

`