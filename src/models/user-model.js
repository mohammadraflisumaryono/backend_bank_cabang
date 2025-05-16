const { db } = require('./db');
const tableName = 'users';

class UserModel {
    // Temukan pengguna berdasarkan username atau email
    static async findByUsernameOrEmail(value) {
        const sql = `SELECT * FROM ${tableName} WHERE username = ? OR email = ? LIMIT 1`;
        try {
            const [result] = await db.execute(sql, [value, value]);
            return result[0] || false;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    // Temukan pengguna untuk login
    static async findLogin(usernameOrEmail, password) {
        const sql = `SELECT * FROM ${tableName} WHERE (username = ? OR email = ?) AND password = ? LIMIT 1`;
        try {
            const [result] = await db.execute(sql, [usernameOrEmail, usernameOrEmail, password]);
            return result[0] || false;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    // Temukan pengguna berdasarkan ID
    static async findOneById(id) {
        const sql = `SELECT * FROM ${tableName} WHERE id = ? LIMIT 1`;
        try {
            const [result] = await db.execute(sql, [id]);
            return result[0] || false;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    // Temukan semua pengguna
    static async findAll() {
        const sql = `SELECT * FROM ${tableName} ORDER BY created_at DESC`;
        try {
            const [results] = await db.execute(sql);
            return results;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    // Buat pengguna baru
    static async create(data) {
        const sql = `INSERT INTO ${tableName} (username, email, password, created_at) VALUES (?, ?, ?, NOW())`;
        try {
            const [result] = await db.execute(sql, [data.username, data.email, data.password]);
            return { id: result.insertId, ...data };
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    // Perbarui pengguna berdasarkan ID
    static async updateById(id, data) {
        const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
        const values = Object.values(data);
        const sql = `UPDATE ${tableName} SET ${fields} WHERE id = ?`;
        try {
            await db.execute(sql, [...values, id]);
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    // Hapus pengguna berdasarkan ID
    static async deleteById(id) {
        const sql = `DELETE FROM ${tableName} WHERE id = ?`;
        try {
            await db.execute(sql, [id]);
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }
}

module.exports = UserModel;
