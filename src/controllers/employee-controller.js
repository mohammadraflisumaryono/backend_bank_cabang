const Joi = require("joi");
const { ApplicationError, ValidationError } = require("../helpers/error-handler");
const EmployeeModel = require("../models/employee-model");

class EmployeeController {
    static addEmployee = async (req, res, next) => {
        try {
            const schema = Joi.object({
                name: Joi.string().required(),
                position: Joi.string().required(),
                assigned_customers: Joi.number().optional(),
                hire_date: Joi.date().optional()
            });

            const { error } = schema.validate(req.body);
            if (error) return next(new ValidationError(error.message));

            req.body.created_at = dayjs().format("YYYY-MM-DD HH:mm:ss");
            const data = await EmployeeModel.insertEmployee(req.body);

            return res.status(201).json({
                code: 201,
                message: "Employee created successfully",
                data,
            });
        } catch (error) {
            return next(new ApplicationError(error.message));
        }
    };

    static getAllEmployees = async (req, res, next) => {
        try {
            const employees = await EmployeeModel.getAllEmployees();
            return res.status(200).json({
                code: 0,
                message: "Employees retrieved successfully",
                data: employees,
            });
        } catch (error) {
            return next(new ApplicationError(error.message));
        }
    };

    static getEmployeeById = async (req, res, next) => {
        try {
            const schema = Joi.object({ id: Joi.number().required() });
            const { error } = schema.validate(req.params);
            if (error) return next(new ValidationError(error.message));

            const employee = await EmployeeModel.getEmployeeById(req.params.id);
            if (!employee) {
                return res.status(404).json({
                    code: 102,
                    message: "Employee not found",
                    data: null,
                });
            }

            return res.status(200).json({
                code: 0,
                message: "Employee retrieved successfully",
                data: employee,
            });
        } catch (error) {
            return next(new ApplicationError(error.message));
        }
    };

    static updateEmployee = async (req, res, next) => {
        try {
            const schemaParams = Joi.object({ id: Joi.number().required() });
            const schemaBody = Joi.object({
                name: Joi.string().optional(),
                position: Joi.string().optional(),
                assigned_customers: Joi.number().optional(),
                hire_date: Joi.date().optional()
            });

            const { error: errorParams } = schemaParams.validate(req.params);
            if (errorParams) return next(new ValidationError(errorParams.message));

            const { error: errorBody } = schemaBody.validate(req.body);
            if (errorBody) return next(new ValidationError(errorBody.message));

            const existing = await EmployeeModel.getEmployeeById(req.params.id);
            if (!existing) {
                return res.status(404).json({
                    code: 103,
                    message: "Employee not found",
                    data: null,
                });
            }

            const updated = await EmployeeModel.updateEmployee(req.params.id, req.body);
            return res.status(200).json({
                code: 0,
                message: "Employee updated successfully",
                data: updated,
            });
        } catch (error) {
            return next(new ApplicationError(error.message));
        }
    };

    static deleteEmployee = async (req, res, next) => {
        try {
            const schema = Joi.object({ id: Joi.number().required() });
            const { error } = schema.validate(req.params);
            if (error) return next(new ValidationError(error.message));

            const existing = await EmployeeModel.getEmployeeById(req.params.id);
            if (!existing) {
                return res.status(404).json({
                    code: 104,
                    message: "Employee not found",
                    data: null,
                });
            }

            const result = await EmployeeModel.deleteEmployee(req.params.id);
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

module.exports = EmployeeController;
