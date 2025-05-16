const { db, commonQueryGetOne, commonQueryDelete, commonQueryUpdate, commonQueryInsert } = require("./db");

const tableName = `t_mtr_token`;

class TokenModel {

    /**
     * 
     * @param {Object} whereData    {id_seq: 1, phone_number_int: 6281234567890} 
     */
    static findOne = async (whereData) => {
        const sql = commonQueryGetOne(tableName, whereData, 'ORDER BY id DESC LIMIT 1');
        console.log(sql);

        try {
            const [result] = await db.execute(sql.query, sql.values);

            return result.length > 0 ? result[0] : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    };


    /**
     * 
     * @param {Object} dataInsert {fullname_var:"admin", password_var: "admin123", email_var: "b@mail.com", ...}
     */
    static create = async (dataInsert) => {
        console.log("Data to be inserted:", dataInsert);

        try {
            const result = await commonQueryInsert(tableName, dataInsert);
            return result || false;
        } catch (error) {
            console.error("Error in TokenModel.create:", error);
            return false;
        }
    };





    /**
     * 
     * @param {Object} whereData {id_seq: 1, phone_number_int: 6281234567890} 
     * @param {Object} dataUpdate {fullname_var:"admin", password_var: "admin123", email_var: "a@mail.com", ...}
     * @returns 
     */
    static update = async (whereData, dataUpdate) => {
        const sql = commonQueryUpdate(tableName, whereData, dataUpdate);
        console.log(sql);

        try {
            const [result] = await db.execute(sql.query, sql.values);
            if (result.affectedRows > 0) {
                const data = await this.findOne(whereData);
                return data;
            } else {
                return false;
            }
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    /**
     * 
     * @param {Object} whereData {id_seq: 1, phone_number_int: 6281234567890} 
     */
    static delete = async (whereData) => {
        const sql = commonQueryDelete(tableName, whereData);
        console.log(sql);

        try {
            const [result] = await db.execute(sql.query, sql.values);
            if (result.affectedRows > 0) {
                return result;
            } else {
                return false;
            }
        } catch (error) {
            console.error(error);
            return false;
        }
    };
}

module.exports = TokenModel;
