const sgMail = require('@sendgrid/mail');

import { SENDGRID_API_KEY } from '../config/email.config';

export const sendMailReaction = (email) => {
    sgMail.setApiKey(SENDGRID_API_KEY);
    const msg = {
        to: `${email}`,
        from: 'support@thread-js.com',
        subject: 'Your post was liked by someone',
        text: 'Your post was liked by someone',
    };
    sgMail.send(msg);
}

export const sendMailShare = (to, from, subject, text) => {
    sgMail.setApiKey(SENDGRID_API_KEY);
    const msg = {
        to,
        from,
        subject,
        text,
    };
    sgMail.send(msg);
}

export const sendMailPasswordReset = (email, token) => {
    sgMail.setApiKey(SENDGRID_API_KEY);
    const msg = {
        to: email,
        from: 'support@thread-js.com',
        subject: 'Thread-js Password Reset',
        text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.
        Please click on the following link, or paste this into your browser to complete the process:
        http://localhost:3001/reset/${token}
        If you did not request this, please ignore this email and your password will remain unchanged.`,
    };
    sgMail.send(msg);
}
