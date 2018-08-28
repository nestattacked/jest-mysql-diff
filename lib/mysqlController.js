const Mysql = require('promise-mysql');
const FS = require('fs-extra');

class MysqlController {
  constructor(options) {
    options.host = options.host || '127.0.0.1';
    options.user = options.user || 'root';
    options.password = options.password || 'root';
    options.database = options.database || 'default';
    options.multipleStatements = true;
    this.options = options;
    this.connection = null;
  }

  async end() {
    if (this.connection === null) {
      return;
    }
    await this.connection.end();
  }

  async loadSql(sqlPath) {
    await this._cleanDB();
    const sql = await FS.readFile(sqlPath, 'utf8');
    await this._query(sql);
  }

  async getData() {
    const tableNameObjects = await this._query(`SELECT table_name as name FROM information_schema.tables WHERE table_schema = '${this.options.database}'`);
    const tableNames = tableNameObjects.map(tableNameObject => tableNameObject.name);
    const tables = await Promise.all(tableNames.map(tableName => this._getTable(tableName)))
    const data = {};
    tables.forEach(table => {
      data[table.tableTitle] = table.rows;
    });
    return data;
  }

  async _getTable(tableName) {
    const rawRows = await this._query(`SELECT * FROM ${tableName}`);
    const rows = this._cook(rawRows);
    const tableTitle = await this._getTableTitle(tableName);
    return {
      tableTitle,
      rows
    };
  }

  _cook(rawRows) {
    return rawRows.map(row => {
      return JSON.stringify(Object.values(row));
    });
  }

  async _getTableTitle(tableName) {
    const columns = await this._query(`SELECT column_name as name FROM information_schema.columns WHERE table_name = '${tableName}' AND table_schema = '${this.options.database}'`);
    const columnNames = columns.map(column => column.name);
    return `[${tableName}][${columnNames.join(',')}]`;
  }

  async _cleanDB() {
    const db = this.options.database;
    await this._query(`DROP DATABASE IF EXISTS ${db}`);
    await this._query(`CREATE DATABASE ${db}`);
    await this._query(`USE ${db}`);
  }

  async _getConnection() {
    if (this.connection === null) {
      this.connection = await Mysql.createConnection(this.options);
    }
    return this.connection;
  }

  async _query(sql, values) {
    const connection = await this._getConnection();
    return connection.query(sql, values);
  }
}

module.exports = MysqlController;
