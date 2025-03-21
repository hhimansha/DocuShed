import nodemailer from 'nodemailer'


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'navindadharmasiri@gmail.com',
      pass: 'xbdd pchv ufvh spcs', // Please replace with your actual password or use environment variables for security
    },
  });

export default transporter