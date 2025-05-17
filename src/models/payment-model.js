const { commonQueryGetAll, commonQueryGetOne, commonQueryInsert, commonQueryUpdate, commonQueryDelete } = require("./db");

const tableName = "Payments";

class PaymentModel {
    static async getAllPayments() {
        return commonQueryGetAll(tableName);
    }

    static async getPaymentById(id) {
        return commonQueryGetOne(tableName, { id });
    }

    static async insertPayment(data) {
        return commonQueryInsert(tableName, data);
    }

    static async updatePayment(id, data) {
        return commonQueryUpdate(tableName, { id }, data);
    }

    static async deletePayment(id) {
        return commonQueryDelete(tableName, { id });
    }
}

module.exports = PaymentModel;

