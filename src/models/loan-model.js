const { commonQueryGetAll, commonQueryGetOne, commonQueryInsert, commonQueryUpdate, commonQueryDelete } = require("./db");

const tableName = "Loans";

class LoanModel {
    static async getAllLoans() {
        return commonQueryGetAll(tableName);
    }

    static async getLoanById(id) {
        return commonQueryGetOne(tableName, { id });
    }

    static async insertLoan(data) {
        return commonQueryInsert(tableName, data);
    }

    static async updateLoan(id, data) {
        return commonQueryUpdate(tableName, { id }, data);
    }

    static async deleteLoan(id) {
        return commonQueryDelete(tableName, { id });
    }
}

module.exports = LoanModel;
