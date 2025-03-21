export const Email_very_template=`<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            text-align: center;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            padding: 20px 0;
        }
        .header img {
            width: 80px;
        }
        .content {
            padding: 20px;
        }
        .otp-container {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin: 20px 0;
        }
        .otp-input {
            width: 40px;
            height: 40px;
            text-align: center;
            font-size: 18px;
            border: 1px solid #ccc;
            border-radius: 5px;
        }
        .btn {
            display: inline-block;
            padding: 10px 20px;
            background: #008cba;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 10px;
        }
        .footer {
            margin-top: 20px;
            padding: 20px;
            background: #17a2b8;
            color: white;
            border-radius: 0 0 8px 8px;
        }
        .social-icons {
            margin-top: 10px;
        }
        .social-icons a {
            margin: 0 5px;
            display: inline-block;
        }
        .social-icons img {
            width: 24px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://cdn-icons-png.flaticon.com/512/3176/3176365.png" alt="Email Icon">
        </div>
        <div class="content">
            <h2>Verify Your Email Address</h2>
            <p>A verification code has been sent to <strong>{{email}}</strong></p>
            <p>Please check your inbox and enter the verification code below.</p>
            <div class="otp-container">
                {{otp}}
            </div>
            <a href="#" class="btn">Verify</a>
            <p><a href="#">Resend Code</a> | <a href="#">Change Email</a></p>
        </div>
        <div class="footer">
            <p>Thanks for the support! ❤</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            <div class="social-icons">
                <a href="#"><img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook"></a>
                <a href="#"><img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="Twitter"></a>
                <a href="#"><img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn"></a>
                <a href="#"><img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="Instagram"></a>
            </div>
        </div>
    </div>
</body>
</html>
`