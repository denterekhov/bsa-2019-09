import { Router } from 'express';
const sgMail = require('@sendgrid/mail');
const crypto = require('crypto');

import * as authService from '../services/auth.service';
import * as userService from '../services/user.service';
import authenticationMiddleware from '../middlewares/authentication.middleware';
import registrationMiddleware from '../middlewares/registration.middleware';
import jwtMiddleware from '../middlewares/jwt.middleware';
import { SENDGRID_API_KEY } from '../../config/email.config';

const router = Router();

router
    .post('/login', authenticationMiddleware, (req, res, next) => authService.login(req.user) // user added to the request in the login strategy, see passport config
        .then(data => res.send(data))
        .catch(next))
    .post('/register', registrationMiddleware, (req, res, next) => authService.register(req.user) // user added to the request in the register strategy, see passport config
        .then(data => res.send(data))
        .catch(next))
    .get('/user', jwtMiddleware, (req, res, next) => userService.getUserById(req.user.id) // user added to the request in the jwt strategy, see passport config
        .then(data => res.send(data))
        .catch(next))
    .put('/update_user', jwtMiddleware, (req, res, next) => userService.setUserProps(req.body) // user added to the request in the jwt strategy, see passport config
        .then(data => res.send(data))
        .catch(next))
    .post('/forgot', function(req, res, next) {
        const token = crypto.randomBytes(20).toString('hex');
        userService.getUserByEmail(req.body.email).then((user) => {
            if (!user) {
                return res.json({body: `User with email ${req.body.email} not found`});
            }
            const resetPasswordToken = token;
            const resetPasswordExpires = Date.now() + 3600000; // 1 hour

            userService.setResetPasswordTokenAndDate(user.id, resetPasswordToken, resetPasswordExpires).then(([user]) => {
                sgMail.setApiKey(SENDGRID_API_KEY);
                const msg = {
                    to: user.email,
                    from: 'support@thread-js.com',
                    subject: 'Thread-js Password Reset',
                    text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.
                    Please click on the following link, or paste this into your browser to complete the process:
                    http://localhost:3001/reset/${user.resetPasswordToken}
                    If you did not request this, please ignore this email and your password will remain unchanged.`,
                };
                sgMail.send(msg);
                return res.json({body: `An e-mail has been sent to ${req.body.email} with further instructions.`});
            });
        })
    })
    .get('/reset/:token', function(req, res) {
        userService.getUserToResetPassword(req.params.token, Date.now() ).then((user) => {
            if (!user) {
              return res.json({body: false});
            }
            return res.json({body: true});
        });
    })
    .post('/new_password', function(req, res) {
        userService.setNewPassword(req.body.token, req.body.password).then(([user]) => {
            if (!user) {
              return res.json({body: false});
            }
            return res.json({body: true});
        });
    });

export default router;
