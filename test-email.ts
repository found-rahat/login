import * as nodemailer from 'nodemailer';

async function testEmail() {
  try {
    console.log('Testing email configuration...');

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Verify the connection
    await transporter.verify();
    console.log('✓ SMTP configuration is valid');

    // Try sending a test email
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.SMTP_USER, // sending to yourself for testing
      subject: 'Test Email',
      text: 'This is a test email from your application.',
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✓ Test email sent successfully:', info.messageId);
  } catch (error: any) {
    console.error('✗ Email configuration error:', error.message);
    if (error.message && error.message.includes('authentication')) {
      console.log('Hint: Make sure you are using an App Password for Gmail, not your regular password.');
      console.log('Generate an App Password at: https://myaccount.google.com/apppasswords');
    }
  }
}

// Run the test
testEmail();