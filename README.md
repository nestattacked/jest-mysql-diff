# Introduction

jest-mysql-diff can find out changes of database after executing some code. It can be used in test framework like jest.

# Install

npm install jest-mysql-diff

# How to use

```javascript
const MysqlDiffer = require('jest-mysql-diff');
const differ = new MysqlDiffer({
  mysql: {
    host: 'your-host',
    user: 'your-user',
    password: 'your-password',
    database: 'your-database'
  }
});

async beforeAllTest() {
  await differ.register('main', 'your-sql-absolute-path');
}

async someTest() {
  await differ.use('main');
  await runSomeCode();
  const changes = await differ.diff();
}

async afterAllTest() {
  await differ.end();
}
```

# Used in Jest

You can create `MysqlDiffer` object and register some sql files in `globalSetup`. And then call `use` in `beforeEach` to reset database. Use `diff` to get changes and compare it with snapshot to make sure database changes as expected. Finally, we can call `end` in `globalTeardown` to close connecton.

```javascript
test('some test', async () => {
  await differ.use('main');
  await runSomeCode();
  const changes = await differ.diff();
  expect(changes).toMatchSnapshot();
})
```

# Make it fast

MysqlDiffer will read whole database and it will make test become very slow. Running Mysql in memory can speed it up.

In unix system, there is a directory `/dev/shm`, it works just like normal file system except it keeps data in momery instead of disk.

# API

### MysqlDiffer

this library exports a class, constructor accept one parameter `options`.

```javascript
const options = {
  mysql: {
    host: 'your-host',
    user: 'your-user',
    password: 'your-password',
    database: 'your-database'
  }
}

const differ = new MysqlDiffer(options);
```

### MysqlDiffer.register

`register` will execute a sql file and remember how database looks, also, will name it.

```javascript
await differ.register('main', 'your-sql-absolute-path');
```

### MysqlDiffer.use

After testing, we could call function `use` with parameter `name` to reset database for next test.

```javascript
await differ.use('main');
```

### MysqlDiffer.diff

`diff` will compare present database state with the state before testing. `diff` will return a readable result that can tell us how database is changed.

```javascript
const changes = await differ.diff()
```

### MysqlDiffer.end

After all tests, you should call `end` to close database connection.

```javascript
await differ.end();
```
