const mysql = require('mysql2/promise');
require('dotenv').config();
const logger = require('pino')();

const { DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT } = process.env;

if (!DB_HOST || !DB_USER || !DB_NAME || !DB_PORT) {
    throw new Error("Missing required database environment variables.");
}

const config = {
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
};

const db = mysql.createPool(config);

db.getConnection()
    .then(() => console.log(`DB Connected: ${JSON.stringify(config)}`))
    .catch((err) => {
        console.error(`DB connection error: ${err.message}`);
    });

const validatePayload = (payload) => {
    if (typeof payload !== 'object' || payload === null) {
        throw new Error("Payload must be a valid object.");
    }
};

const commonQueryInsert = async (tableName, payload) => {
    validatePayload(payload);

    const columns = Object.keys(payload).join(', ');
    const values = Object.values(payload);
    const placeholders = Object.keys(payload).map(() => '?').join(', ');

    const query = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`;

    try {
        // Melakukan insert data
        const [result] = await db.execute(query, values);

        // Mengambil data yang baru saja diinsert
        const insertedId = result.insertId;
        const selectQuery = `SELECT * FROM ${tableName} WHERE id = ?`;
        const [rows] = await db.execute(selectQuery, [insertedId]);

        // Mengembalikan data yang baru diinsert
        return rows[0];
    } catch (err) {
        logger.error({ query, values, message: err.message }, "Database Insert Error");
        throw err;
    }
};

const commonQueryGetAll = async (tableName) => {
    const query = `SELECT * FROM ${tableName} ORDER BY COALESCE(updated_at, created_at) DESC, id DESC`;
    try {
        const [rows] = await db.query(query);
        return rows;
    } catch (err) {
        console.error('Error executing query:', err.message);
        throw err;
    }
};

const commonQueryGetOne = async (tableName, payload, optionalQuery = '') => {
    let whereClause = '1=1';
    const values = [];

    for (const [key, value] of Object.entries(payload)) {
        whereClause += ` AND ${key} = ?`;
        values.push(value);
    }

    const query = `SELECT * FROM ${tableName} WHERE ${whereClause} ${optionalQuery}`;
    try {
        const [rows] = await db.execute(query, values);
        return rows[0] || null; // Return null if no data found
    } catch (err) {
        console.error('Error executing query:', err.message);
        throw err;
    }
};

const commonQueryUpdate = async (tableName, identity, payload) => {
    let setClause = '';
    let whereClause = '';
    const values = [];

    for (const [key, value] of Object.entries(payload)) {
        if (setClause) setClause += ', ';
        setClause += `${key} = ?`;
        values.push(value);
    }

    for (const [key, value] of Object.entries(identity)) {
        if (whereClause) whereClause += ' AND ';
        whereClause += `${key} = ?`;
        values.push(value);
    }

    const query = `UPDATE ${tableName} SET ${setClause} WHERE ${whereClause}`;

    try {
        // Melakukan update data
        await db.execute(query, values);

        // Mengambil data yang baru diupdate
        const selectQuery = `SELECT * FROM ${tableName} WHERE `;
        const whereConditions = Object.keys(identity).map(key => `${key} = ?`).join(' AND ');
        const [updatedRows] = await db.execute(
            selectQuery + whereConditions,
            Object.values(identity)
        );

        // Mengembalikan data yang baru diupdate
        return updatedRows[0] || null;
    } catch (err) {
        console.error('Error executing query:', err.message);
        throw err;
    }
};

const commonQueryDelete = async (tableName, identity) => {
    try {
        // Mengambil data sebelum dihapus
        const selectQuery = `SELECT * FROM ${tableName} WHERE `;
        const whereConditions = Object.keys(identity).map(key => `${key} = ?`).join(' AND ');
        const [rowToDelete] = await db.execute(
            selectQuery + whereConditions,
            Object.values(identity)
        );

        // Jika data ditemukan, lakukan penghapusan
        if (rowToDelete[0]) {
            let whereClause = '';
            const values = [];

            for (const [key, value] of Object.entries(identity)) {
                if (whereClause) whereClause += ' AND ';
                whereClause += `${key} = ?`;
                values.push(value);
            }

            const query = `DELETE FROM ${tableName} WHERE ${whereClause}`;
            await db.execute(query, values);

            // Mengembalikan data yang telah dihapus
            return {
                message: 'Data successfully deleted',
                deletedData: rowToDelete[0]
            };
        }

        return {
            message: 'No data found to delete',
            deletedData: null
        };
    } catch (err) {
        console.error('Error executing query:', err.message);
        throw err;
    }
};

const commonQueryDisable = async (tableName, identity, statusValue = -5) => {
    try {
        // Mengambil data sebelum dinonaktifkan
        const selectQuery = `SELECT * FROM ${tableName} WHERE `;
        const whereConditions = Object.keys(identity).map(key => `${key} = ?`).join(' AND ');
        const [rowToDisable] = await db.execute(
            selectQuery + whereConditions,
            Object.values(identity)
        );

        if (rowToDisable[0]) {
            let whereClause = '';
            const values = [];

            for (const [key, value] of Object.entries(identity)) {
                if (whereClause) whereClause += ' AND ';
                whereClause += `${key} = ?`;
                values.push(value);
            }

            const query = `UPDATE ${tableName} SET status_int = ? WHERE ${whereClause}`;
            values.unshift(statusValue);

            await db.execute(query, values);

            // Mengambil data setelah dinonaktifkan
            const [updatedRow] = await db.execute(
                selectQuery + whereConditions,
                Object.values(identity)
            );

            return updatedRow[0];
        }

        return null;
    } catch (err) {
        console.error('Error executing query:', err.message);
        throw err;
    }
};



module.exports = {
    db,
    commonQueryGetAll,
    commonQueryGetOne,
    commonQueryInsert,
    commonQueryUpdate,
    commonQueryDelete,
    commonQueryDisable,
};