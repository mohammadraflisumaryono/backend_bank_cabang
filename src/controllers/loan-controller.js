const Joi = require("joi");
const { ApplicationError, ValidationError } = require("../helpers/error-handler");
const LoanModel = require("../models/loan-model");

class LoanController {
    static addLoan = async (req, res, next) => {
        try {
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

            const data = await LoanModel.insertLoan(req.body);

            return res.status(201).json({
                code: 201,
                message: "Loan created successfully",
                data,
            });
        } catch (error) {
            return next(new ApplicationError(error.message));
        }
    };

    static getAllLoans = async (req, res, next) => {
        try {
            const loans = await LoanModel.getAllLoans();
            return res.status(200).json({
                code: 0,
                message: "Loans retrieved successfully",
                data: loans,
            });
        } catch (error) {
            return next(new ApplicationError(error.message));
        }
    };

    static getLoanById = async (req, res, next) => {
        try {
            const schema = Joi.object({ id: Joi.number().required() });
            const { error } = schema.validate(req.params);
            if (error) return next(new ValidationError(error.message));

            const loan = await LoanModel.getLoanById(req.params.id);
            if (!loan) {
                return res.status(404).json({
                    code: 102,
                    message: "Loan not found",
                    data: null,
                });
            }

            return res.status(200).json({
                code: 0,
                message: "Loan retrieved successfully",
                data: loan,
            });
        } catch (error) {
            return next(new ApplicationError(error.message));
        }
    };

    static updateLoan = async (req, res, next) => {
        try {
            const schemaParams = Joi.object({ id: Joi.number().required() });
            const schemaBody = Joi.object({
                customer_id: Joi.number().optional(),
                branch_id: Joi.number().optional(),
                amount_plafond: Joi.number().optional(),
                interest_rate: Joi.number().optional(),
                loan_date: Joi.date().optional(),
                term_months: Joi.number().optional(),
                status: Joi.string().valid("active", "completed", "defaulted").optional(),
            });

            const { error: errorParams } = schemaParams.validate(req.params);
            if (errorParams) return next(new ValidationError(errorParams.message));

            const { error: errorBody } = schemaBody.validate(req.body);
            if (errorBody) return next(new ValidationError(errorBody.message));

            const existingLoan = await LoanModel.getLoanById(req.params.id);
            if (!existingLoan) {
                return res.status(404).json({
                    code: 103,
                    message: "Loan not found",
                    data: null,
                });
            }

            const updatedLoan = await LoanModel.updateLoan(req.params.id, req.body);
            return res.status(200).json({
                code: 0,
                message: "Loan updated successfully",
                data: updatedLoan,
            });
        } catch (error) {
            return next(new ApplicationError(error.message));
        }
    };

    static deleteLoan = async (req, res, next) => {
        try {
            const schema = Joi.object({ id: Joi.number().required() });
            const { error } = schema.validate(req.params);
            if (error) return next(new ValidationError(error.message));

            const loan = await LoanModel.getLoanById(req.params.id);
            if (!loan) {
                return res.status(404).json({
                    code: 104,
                    message: "Loan not found",
                    data: null,
                });
            }

            const result = await LoanModel.deleteLoan(req.params.id);
            return res.status(200).json({
                code: 200,
                message: result.message,
                data: result.deletedData,
            });
        } catch (error) {
            return next(new ApplicationError(error.message));
        }
    };
}

module.exports = LoanController;
