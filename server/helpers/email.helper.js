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
