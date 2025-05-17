const Joi = require("joi");
const { ApplicationError, ValidationError } = require("../helpers/error-handler");
const PaymentModel = require("../models/payment-model");

class PaymentController {
    static addPayment = async (req, res, next) => {
        try {
            const schema = Joi.object({
                loan_id: Joi.number().required(),
                branch_id: Joi.number().required(),
                payment_date: Joi.date().optional(),
                amount_paid: Joi.number().optional(),
                due_date: Joi.date().optional(),
                is_on_time: Joi.boolean().optional(),
            });

            const { error } = schema.validate(req.body);
            if (error) return next(new ValidationError(error.message));

            const payload = {
                ...req.body,
                created_at: new Date(),
                updated_at: new Date(),
            };

            const data = await PaymentModel.insertPayment(payload);

            return res.status(201).json({
                code: 201,
                message: "Payment created successfully",
                data,
            });
        } catch (error) {
            return next(new ApplicationError(error.message));
        }
    };

    static getAllPayments = async (req, res, next) => {
        try {
            const data = await PaymentModel.getAllPayments();
            return res.status(200).json({
                code: 0,
                message: "Payments retrieved successfully",
                data,
            });
        } catch (error) {
            return next(new ApplicationError(error.message));
        }
    };

    static getPaymentById = async (req, res, next) => {
        try {
            const schema = Joi.object({ id: Joi.number().required() });
            const { error } = schema.validate(req.params);
            if (error) return next(new ValidationError(error.message));

            const data = await PaymentModel.getPaymentById(req.params.id);
            if (!data) {
                return res.status(404).json({
                    code: 102,
                    message: "Payment not found",
                    data: null,
                });
            }

            return res.status(200).json({
                code: 0,
                message: "Payment retrieved successfully",
                data,
            });
        } catch (error) {
            return next(new ApplicationError(error.message));
        }
    };

    static updatePayment = async (req, res, next) => {
        try {
            const schemaParams = Joi.object({ id: Joi.number().required() });
            const schemaBody = Joi.object({
                loan_id: Joi.number().optional(),
                branch_id: Joi.number().optional(),
                payment_date: Joi.date().optional(),
                amount_paid: Joi.number().optional(),
                due_date: Joi.date().optional(),
                is_on_time: Joi.boolean().optional(),
            });

            const { error: errorParams } = schemaParams.validate(req.params);
            if (errorParams) return next(new ValidationError(errorParams.message));

            const { error: errorBody } = schemaBody.validate(req.body);
            if (errorBody) return next(new ValidationError(errorBody.message));

            const existing = await PaymentModel.getPaymentById(req.params.id);
            if (!existing) {
                return res.status(404).json({
                    code: 103,
                    message: "Payment not found",
                    data: null,
                });
            }

            const payload = {
                ...req.body,
                updated_at: new Date(),
            };

            const updated = await PaymentModel.updatePayment(req.params.id, payload);
            return res.status(200).json({
                code: 0,
                message: "Payment updated successfully",
                data: updated,
            });
        } catch (error) {
            return next(new ApplicationError(error.message));
        }
    };

    static deletePayment = async (req, res, next) => {
        try {
            const schema = Joi.object({ id: Joi.number().required() });
            const { error } = schema.validate(req.params);
            if (error) return next(new ValidationError(error.message));

            const existing = await PaymentModel.getPaymentById(req.params.id);
            if (!existing) {
                return res.status(404).json({
                    code: 104,
                    message: "Payment not found",
                    data: null,
                });
            }

            const result = await PaymentModel.deletePayment(req.params.id);
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

module.exports = PaymentController;
