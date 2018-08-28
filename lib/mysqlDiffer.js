const MysqlController = require('./mysqlController.js');
const Diff = require('diff');

class MysqlDiffer {
  constructor(options = {}) {
    this.controller = new MysqlController(options.mysql || {});
    this.currentBaseline = null;
    this.baselineMap = {};
  }

  async end() {
    await this.controller.end();
  }

  async register(name, sqlPath) {
    if (this.baselineMap[name] !== undefined) {
      throw new Error(`name has been used`);
    }
    await this.controller.loadSql(sqlPath);
    const data = await this.controller.getData();
    this.baselineMap[name] = {
      sqlPath,
      data
    };
  }

  async use(name) {
    if (this.baselineMap[name] === undefined) {
      throw new Error(`baseline doesn't exist`);
    }
    this.currentBaseline = name;
    await this.controller.loadSql(this.baselineMap[name].sqlPath);
  }

  async diff() {
    if (this.currentBaseline === null) {
      throw new Error('no baseline to diff');
    }
    const data = await this.controller.getData();
    const baselineData = this.baselineMap[this.currentBaseline].data;
    const changes = {};
    for (const table in data) {
      const diffGroups = Diff.diffArrays(baselineData[table], data[table]).filter(diffGroup => {
        return diffGroup.added || diffGroup.removed;
      })
      const diffs = diffGroups.reduce((diffs, diffGroup) => {
        const diffFlag = diffGroup.added ? '+ ' : '- ';
        return diffs.concat(diffGroup.value.map(diff => diffFlag + diff));
      }, []);
      if (diffs.length > 0) {
        changes[table] = diffs;
      }
    }
    return changes;
  }
}

module.exports = MysqlDiffer;
