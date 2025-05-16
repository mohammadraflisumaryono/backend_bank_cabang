const Joi = require("joi");
const { ApplicationError, ValidationError } = require("../helpers/error-handler");
const { encryptAes } = require("../helpers/security");
const dayjs = require("dayjs");
const UserModel = require("../models/loan-model");

class LoanController {
    static addLoan = async (req, res, next) => {
        try {
            const schema = Joi.object({
                username: Joi.string().required(),
                email: Joi.string().email().required(),
                password: Joi.string().min(5).required(),
            });

            const { error } = schema.validate(req.body);
            if (error) return next(new ValidationError(error.message));

            const userExist = await UserModel.findByUsernameOrEmail(req.body.username);
            if (userExist) {
                return res.status(400).json({
                    code: 101,
                    message: `Username or email already exists.`,
                    data: null,
                });
            }

            req.body.password = await encryptAes(req.body.password);
            req.body.created_at = dayjs().format("YYYY-MM-DD HH:mm:ss");
            req.body.role = "user";
            const user = await UserModel.create(req.body);

            return res.status(201).json({
                code: 201,
                message: "User created successfully",
                data: user,
            });
        } catch (error) {
            return next(new ApplicationError(error.message));
        }
    };

    static getAllUsers = async (req, res, next) => {
        try {
            const users = await UserModel.findAll();
            return res.status(200).json({
                code: 0,
                message: "Users retrieved successfully",
                data: users,
            });
        } catch (error) {
            return next(new ApplicationError(error.message));
        }
    };

    static getUserById = async (req, res, next) => {
        try {
            const schema = Joi.object({ id: Joi.number().required() });
            const { error } = schema.validate(req.params);
            if (error) return next(new ValidationError(error.message));

            const user = await UserModel.findOneByID(req.params.id);
            if (!user) {
                return res.status(404).json({
                    code: 102,
                    message: "User not found",
                    data: null,
                });
            }

            return res.status(200).json({
                code: 0,
                message: "User retrieved successfully",
                data: user,
            });
        } catch (error) {
            return next(new ApplicationError(error.message));
        }
    };

    static updateUser = async (req, res, next) => {
        try {
            const schema = Joi.object({
                username: Joi.string().optional(),
                email: Joi.string().email().optional(),
                password: Joi.string().min(5).optional(),
            });
            const { error } = schema.validate(req.body);
            if (error) return next(new ValidationError(error.message));

            const user = await UserModel.findOneByID(req.params.id);
            if (!user) {
                return res.status(404).json({
                    code: 103,
                    message: "User not found",
                    data: null,
                });
            }

            if (req.body.password) req.body.password = await encryptAes(req.body.password);
            const updatedUser = await UserModel.update({ id: req.params.id }, req.body);

            return res.status(200).json({
                code: 0,
                message: "User updated successfully",
                data: updatedUser,
            });
        } catch (error) {
            return next(new ApplicationError(error.message));
        }
    };

    static deleteUser = async (req, res, next) => {
        try {
            const schema = Joi.object({ id: Joi.number().required() });
            const { error } = schema.validate(req.params);
            if (error) return next(new ValidationError(error.message));

            const user = await UserModel.findOneByID(req.params.id);
            if (!user) {
                return res.status(404).json({
                    code: 104,
                    message: "User not found",
                    data: null,
                });
            }

            await UserModel.delete({ id: req.params.id });
            return res.status(200).json({
                code: 200,
                message: "User deleted successfully",
                data: null,
            });
        } catch (error) {
            return next(new ApplicationError(error.message));
        }
    };
}

module.exports = LoanController;
