const { commonQueryGetAll, commonQueryGetOne, commonQueryInsert, commonQueryUpdate, commonQueryDelete } = require("./db");

const tableName = "kantor_units";

class KantorUnitModel {
    static async getAllKantorUnits() {
        return commonQueryGetAll(tableName);
    }

    static async getKantorUnitById(id) {
        return commonQueryGetOne(tableName, { id });
    }

    static async insertKantorUnit(data) {
        return commonQueryInsert(tableName, data);
    }

    static async updateKantorUnit(id, data) {
        return commonQueryUpdate(tableName, { id }, data);
    }

    static async deleteKantorUnit(id) {
        return commonQueryDelete(tableName, { id });
    }
}

module.exports = KantorUnitModel;
