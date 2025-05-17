const { commonQueryGetAll, commonQueryGetOne, commonQueryInsert, commonQueryUpdate, commonQueryDelete } = require("./db");

const tableName = "income";

class IncomeModel {
    static async getAllIncomes() {
        return commonQueryGetAll(tableName);
    }

    static async getIncomeById(id) {
        return commonQueryGetOne(tableName, { id });
    }

    static async insertIncome(data) {
        return commonQueryInsert(tableName, data);
    }

    static async updateIncome(id, data) {
        return commonQueryUpdate(tableName, { id }, data);
    }

    static async deleteIncome(id) {
        return commonQueryDelete(tableName, { id });
    }
}

module.exports = IncomeModel;
