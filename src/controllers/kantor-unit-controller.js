const Joi = require("joi");
const { ApplicationError, ValidationError } = require("../helpers/error-handler");
const KantorUnitModel = require("../models/kantor-unit-model");

class KantorUnitController {
    static addKantorUnit = async (req, res, next) => {
        try {
            const schema = Joi.object({
                name: Joi.string().required(),
                location: Joi.string().optional(),
            });

            const { error } = schema.validate(req.body);
            if (error) return next(new ValidationError(error.message));

            const payload = {
                ...req.body,
                created_at: new Date(),
                update_at: new Date(),
            };

            const data = await KantorUnitModel.insertKantorUnit(payload);

            return res.status(201).json({
                code: 201,
                message: "Kantor unit created successfully",
                data,
            });
        } catch (error) {
            return next(new ApplicationError(error.message));
        }
    };

    static getAllKantorUnits = async (req, res, next) => {
        try {
            const data = await KantorUnitModel.getAllKantorUnits();
            return res.status(200).json({
                code: 0,
                message: "Kantor units retrieved successfully",
                data,
            });
        } catch (error) {
            return next(new ApplicationError(error.message));
        }
    };

    static getKantorUnitById = async (req, res, next) => {
        try {
            const schema = Joi.object({ id: Joi.number().required() });
            const { error } = schema.validate(req.params);
            if (error) return next(new ValidationError(error.message));

            const data = await KantorUnitModel.getKantorUnitById(req.params.id);
            if (!data) {
                return res.status(404).json({
                    code: 102,
                    message: "Kantor unit not found",
                    data: null,
                });
            }

            return res.status(200).json({
                code: 0,
                message: "Kantor unit retrieved successfully",
                data,
            });
        } catch (error) {
            return next(new ApplicationError(error.message));
        }
    };

    static updateKantorUnit = async (req, res, next) => {
        try {
            const schemaParams = Joi.object({ id: Joi.number().required() });
            const schemaBody = Joi.object({
                name: Joi.string().optional(),
                location: Joi.string().optional(),
            });

            const { error: errorParams } = schemaParams.validate(req.params);
            if (errorParams) return next(new ValidationError(errorParams.message));

            const { error: errorBody } = schemaBody.validate(req.body);
            if (errorBody) return next(new ValidationError(errorBody.message));

            const existing = await KantorUnitModel.getKantorUnitById(req.params.id);
            if (!existing) {
                return res.status(404).json({
                    code: 103,
                    message: "Kantor unit not found",
                    data: null,
                });
            }

            const payload = {
                ...req.body,
                update_at: new Date(),
            };

            const updated = await KantorUnitModel.updateKantorUnit(req.params.id, payload);
            return res.status(200).json({
                code: 0,
                message: "Kantor unit updated successfully",
                data: updated,
            });
        } catch (error) {
            return next(new ApplicationError(error.message));
        }
    };

    static deleteKantorUnit = async (req, res, next) => {
        try {
            const schema = Joi.object({ id: Joi.number().required() });
            const { error } = schema.validate(req.params);
            if (error) return next(new ValidationError(error.message));

            const existing = await KantorUnitModel.getKantorUnitById(req.params.id);
            if (!existing) {
                return res.status(404).json({
                    code: 104,
                    message: "Kantor unit not found",
                    data: null,
                });
            }

            const result = await KantorUnitModel.deleteKantorUnit(req.params.id);
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

module.exports = KantorUnitController;
