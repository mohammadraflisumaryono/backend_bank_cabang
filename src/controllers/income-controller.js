const Joi = require("joi");
const { ApplicationError, ValidationError } = require("../helpers/error-handler");
const IncomeModel = require("../models/income-model");

class IncomeController {
    static addIncome = async (req, res, next) => {
        try {
            const schema = Joi.object({
                loan_id: Joi.number().required(),
                income_amount: Joi.number().optional(),
                recorded_date: Joi.date().optional(),
            });

            const { error } = schema.validate(req.body);
            if (error) return next(new ValidationError(error.message));

            const payload = {
                ...req.body,
                created_at: new Date(),
                updated_at: new Date(),
            };

            const data = await IncomeModel.insertIncome(payload);

            return res.status(201).json({
                code: 201,
                message: "Income created successfully",
                data,
            });
        } catch (error) {
            return next(new ApplicationError(error.message));
        }
    };

    static getAllIncome = async (req, res, next) => {
        try {
            const data = await IncomeModel.getAllIncome();
            return res.status(200).json({
                code: 0,
                message: "Income records retrieved successfully",
                data,
            });
        } catch (error) {
            return next(new ApplicationError(error.message));
        }
    };

    static getIncomeById = async (req, res, next) => {
        try {
            const schema = Joi.object({ id: Joi.number().required() });
            const { error } = schema.validate(req.params);
            if (error) return next(new ValidationError(error.message));

            const data = await IncomeModel.getIncomeById(req.params.id);
            if (!data) {
                return res.status(404).json({
                    code: 102,
                    message: "Income record not found",
                    data: null,
                });
            }

            return res.status(200).json({
                code: 0,
                message: "Income record retrieved successfully",
                data,
            });
        } catch (error) {
            return next(new ApplicationError(error.message));
        }
    };

    static updateIncome = async (req, res, next) => {
        try {
            const schemaParams = Joi.object({ id: Joi.number().required() });
            const schemaBody = Joi.object({
                loan_id: Joi.number().optional(),
                income_amount: Joi.number().optional(),
                recorded_date: Joi.date().optional(),
            });

            const { error: errorParams } = schemaParams.validate(req.params);
            if (errorParams) return next(new ValidationError(errorParams.message));

            const { error: errorBody } = schemaBody.validate(req.body);
            if (errorBody) return next(new ValidationError(errorBody.message));

            const existing = await IncomeModel.getIncomeById(req.params.id);
            if (!existing) {
                return res.status(404).json({
                    code: 103,
                    message: "Income record not found",
                    data: null,
                });
            }

            const payload = {
                ...req.body,
                updated_at: new Date(),
            };

            const updated = await IncomeModel.updateIncome(req.params.id, payload);
            return res.status(200).json({
                code: 0,
                message: "Income record updated successfully",
                data: updated,
            });
        } catch (error) {
            return next(new ApplicationError(error.message));
        }
    };

    static deleteIncome = async (req, res, next) => {
        try {
            const schema = Joi.object({ id: Joi.number().required() });
            const { error } = schema.validate(req.params);
            if (error) return next(new ValidationError(error.message));

            const existing = await IncomeModel.getIncomeById(req.params.id);
            if (!existing) {
                return res.status(404).json({
                    code: 104,
                    message: "Income record not found",
                    data: null,
                });
            }

            const result = await IncomeModel.deleteIncome(req.params.id);
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

module.exports = IncomeController;
