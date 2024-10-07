const sgMail = require('@sendgrid/mail');

// Load the SendGrid API key from environment variables
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.handler = async function(event, context) {
  try {
    // Check the request method
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method Not Allowed. Use POST.' }),
      };
    }

    // Parse the request body (ensure that it is in JSON format)
    const data = JSON.parse(event.body);

    // Validate that essential fields are provided
    if (!data.email || !data.subject || !data.message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields: email, subject, and message.' }),
      };
    }

    // Set up the email object
    const msg = {
      to: data.email, // recipient email from the request body
      from: 'your-verified-email@example.com', // your verified sender email on SendGrid
      subject: data.subject, // subject from the request body
      text: data.message, // plain text message from the request body
      html: `<strong>${data.message}</strong>`, // HTML formatted version of the message
    };

    // Check for and add attachments if present
    if (data.attachment) {
      msg.attachments = [
        {
          content: data.attachment.content, // base64 encoded PDF
          filename: data.attachment.filename,
          type: data.attachment.type,
          disposition: data.attachment.disposition,
        },
      ];
    }

    // Attempt to send the email
    await sgMail.send(msg);

    // Return a success response if email is sent
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent successfully!' }),
    };
  } catch (error) {
    // Log the error details for debugging
    console.error('Error sending email:', error.response ? error.response.body : error.message);

    // Return an error response
    return {
      statusCode: error.code || 500,
      body: JSON.stringify({ message: 'Failed to send email.', error: error.message }),
    };
  }
};
