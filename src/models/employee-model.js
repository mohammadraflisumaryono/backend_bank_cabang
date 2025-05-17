const { commonQueryGetAll, commonQueryGetOne, commonQueryInsert, commonQueryUpdate, commonQueryDelete } = require("./db");

const tableName = "employees";

class EmployeeModel {
    static async getAllEmployees() {
        return commonQueryGetAll(tableName);
    }

    static async getEmployeeById(id) {
        return commonQueryGetOne(tableName, { id });
    }

    static async insertEmployee(data) {
        return commonQueryInsert(tableName, data);
    }

    static async updateEmployee(id, data) {
        return commonQueryUpdate(tableName, { id }, data);
    }

    static async deleteEmployee(id) {
        return commonQueryDelete(tableName, { id });
    }
}

module.exports = EmployeeModel;
