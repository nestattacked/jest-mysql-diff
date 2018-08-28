const MysqlDiffer = require('../index.js');
const Mysql = require('promise-mysql');
const Path = require('path');
const MysqlConfig = require('./mysqlConfig.js');

const options = {
  mysql: MysqlConfig
};

let differ = null;
let connection = null;

beforeEach(async () => {
  differ = new MysqlDiffer(options);
});

afterEach(async () => {
  await differ.end();
  differ = null;
});

beforeAll(async () => {
  connection = await Mysql.createConnection(options.mysql);
});

afterAll(async () => {
  await connection.end();
});

test('work without error', async () => {
  await differ.register('main', Path.resolve(__dirname, './sql/main.sql'));
  await differ.use('main');
  await connection.query('INSERT INTO table1(`int`, `varchar`, `text`) VALUES(4, "four", "four")');
  await connection.query('DELETE FROM table1 WHERE id = 2');
  const changes = await differ.diff();
  expect(changes).toMatchSnapshot();
});

test('register with the same name', async () => {
  await differ.register('main', Path.resolve(__dirname, './sql/main.sql'));
  await expect(differ.register('main', Path.resolve(__dirname, './sql/main.sql'))).rejects.toThrow('name has been used');
});

test('use the baseline does not exist', async () => {
  await expect(differ.use('undefined')).rejects.toThrow('baseline doesn\'t exist');
});

test('diff before use', async () => {
  await expect(differ.diff()).rejects.toThrow('no baseline to diff');
});
