const { Sequelize, Model, DataTypes } = require('sequelize')

const fs = require('fs');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite',
    logging: (sql) => {
        if (sql.includes('CREATE TABLE') && !fs.existsSync('database.sqlite')) {
            fs.closeSync(fs.openSync('database.sqlite', 'w'));
        }
        console.log(sql)
    }
})

const Task = sequelize.define('Task', {
    id : {
        type: DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement : true
    },
    username : DataTypes.STRING,
    task_value : DataTypes.STRING
})

const getTasks = async () => {
    return await Task.findAll()
}


module.exports = {
    Task,
    sequelize,
    getTasks
}