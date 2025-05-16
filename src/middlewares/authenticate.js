const jwt = require('jsonwebtoken');
const Joi = require('joi');
const dayjs = require('dayjs');
require('dotenv').config();

const { ApplicationError, AuthorizationError, ValidationError } = require('../helpers/error-handler');
const { encryptAes } = require('../helpers/security');

const TokenModel = require('../models/token-model');
const UserProModel = require('../models/user-model');

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, ACCESS_TOKEN_EXPIRED, REFRESH_TOKEN_EXPIRED } = process.env;

const loginPro = async (req, res, next) => {
    console.log('loginPro');
    try {
        if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
            throw new Error('Access token secret or refresh token secret is not defined in environment variables!');
        }

        const schema = Joi.object({
            username_or_email: Joi.string().required(),
            password: Joi.string().required()
        });

        const { error } = schema.validate(req.body);
        if (error) {
            return next(new ValidationError(error.message));
        }

        const findUser = await UserProModel.findByUsernameOrEmail(req.body.username_or_email);
        if (!findUser) {
            return res.status(401).json({ code: 401, message: 'Username or Email not registered!' });
        }

        const encryptedPassword = await encryptAes(req.body.password);
        const findPass = await UserProModel.findLogin(req.body.username_or_email, encryptedPassword);

        if (!findPass) {
            return res.status(401).json({ code: 401, message: 'Password not match with username or email!' });
        }

        delete findPass.password;

        const accessToken = jwt.sign(findPass, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRED });
        const refreshToken = jwt.sign(findPass, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRED });

        console.log('Generated Refresh Token:', refreshToken);

        await TokenModel.create({
            refresh_token: refreshToken,
            created_by: req.body.username_or_email || 'unknown'
        });

        return res.status(200).json({
            code: 200,
            message: 'Success authenticate!',
            data: { access_token: accessToken, refresh_token: refreshToken, user: findPass }
        });

    } catch (error) {
        console.error('Error in loginPro:', error);
        return next(new ApplicationError(error.message));
    }
};


const getNewToken = async (req, res, next) => {
    try {
        const schema = Joi.object({ refresh_token: Joi.string().required() });
        const { error } = schema.validate(req.body);
        if (error) {
            return next(new ValidationError(error.message));
        }

        const decoded = jwt.verify(req.body.refresh_token, REFRESH_TOKEN_SECRET);
        const findToken = await TokenModel.findOne({ refresh_token: req.body.refresh_token });

        if (!findToken) {
            return res.status(401).json({ code: 401, message: 'Refresh token not found!' });
        }

        delete decoded.iat;
        delete decoded.exp;

        const newAccessToken = jwt.sign(decoded, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRED });
        const newRefreshToken = jwt.sign(decoded, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRED });

        await TokenModel.update(
            { refresh_token: req.body.refresh_token },
            { refresh_token: newRefreshToken, updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss') }
        );

        return res.status(200).json({
            code: 200,
            message: 'Success refresh new token',
            data: { access_token: newAccessToken, refresh_token: newRefreshToken }
        });

    } catch (error) {
        console.error(error);
        return next(new AuthorizationError('Refresh token is invalid or expired!'));
    }
};

module.exports = {
    loginPro,
    getNewToken
};
