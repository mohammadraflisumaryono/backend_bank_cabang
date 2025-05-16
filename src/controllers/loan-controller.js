const Joi = require("joi");
const { ApplicationError, ValidationError } = require("../helpers/error-handler");
const { encryptAes } = require("../helpers/security");
const dayjs = require("dayjs");
const LoanModel = require("../models/loan-model");
const LoanModel = require("../models/loan-model");

class LoanController {
    static addLoan = async (req, res, next) => {
        try {
            // CREATE TABLE`loans`(
            //     `id` int NOT NULL AUTO_INCREMENT,
            //     `customer_id` int NOT NULL,
            //     `branch_id` int NOT NULL,
            //     `amount_plafond` decimal(15, 2) NOT NULL,
            //     `interest_rate` float DEFAULT NULL,
            //     `loan_date` date DEFAULT NULL,
            //     `term_months` int DEFAULT NULL,
            //     `status` enum('active', 'completed', 'defaulted') DEFAULT 'active',
            //         PRIMARY KEY(`id`) USING BTREE,
            //             KEY`customer_id`(`customer_id`),
            //             KEY`branch_id`(`branch_id`),
            //             CONSTRAINT`loans_ibfk_1` FOREIGN KEY(`customer_id`) REFERENCES`customers`(`id`),
            //                 CONSTRAINT`loans_ibfk_2` FOREIGN KEY(`branch_id`) REFERENCES`kantor_units`(`id`)
            //   ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE =utf8mb4_0900_ai_ci;
            const schema = Joi.object({
                customer_id: Joi.number().required(),
                branch_id: Joi.number().required(),
                amount_plafond: Joi.number().required(),
                interest_rate: Joi.number().optional(),
                loan_date: Joi.date().optional(),
                term_months: Joi.number().optional(),
                status: Joi.string().valid("active", "completed", "defaulted").optional(),

            });

            const { error } = schema.validate(req.body);
            if (error) return next(new ValidationError(error.message));

            const userExist = await LoanModel.findByUsernameOrEmail(req.body.username);
            if (userExist) {
                return res.status(400).json({
                    code: 101,
                    message: `Username or email already exists.`,
                    data: null,
                });
            }


            const data = await LoanModel.insertLoan(req.body);

            return res.status(201).json({
                code: 201,
                message: "Loans created successfully",
                data: data,
            });
        } catch (error) {
            return next(new ApplicationError(error.message));
        }
    };

    static getAllUsers = async (req, res, next) => {
        try {
            const users = await LoanModel.findAll();
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

            const user = await LoanModel.findOneByID(req.params.id);
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

            const user = await LoanModel.findOneByID(req.params.id);
            if (!user) {
                return res.status(404).json({
                    code: 103,
                    message: "User not found",
                    data: null,
                });
            }

            if (req.body.password) req.body.password = await encryptAes(req.body.password);
            const updatedUser = await LoanModel.update({ id: req.params.id }, req.body);

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

            const user = await LoanModel.findOneByID(req.params.id);
            if (!user) {
                return res.status(404).json({
                    code: 104,
                    message: "User not found",
                    data: null,
                });
            }

            await LoanModel.delete({ id: req.params.id });
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
