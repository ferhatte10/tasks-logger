const express = require('express');
const router = express.Router();
const fs = require('fs')
const path = require('path')

router.get('/', (req, res,next) => {
    // get the data of the json file
    fs.readFile(path.join(__dirname, '../data/tasks.json'), 'utf8', (err, data) => {
        if (err) {
            console.error(err)
            return res.status(500).json({"success" : false , "message": "error while getting tasks" })
        }
        let tasks = []
        if (data === "") {
            tasks = JSON.parse("[]")
            return res.status(404).json({"success" : true , "message": "Tasks Not found" , "data": tasks})
        }else {
            tasks = JSON.parse(data)
            return res.status(200).json({"success" : true , "message": "tasks retrieved" , "data": tasks})
        }
    })
})

router.post("/",(req,res,next)=>{
    let form_data = req.body

    if(!fs.existsSync(path.join(__dirname,`../data/tasks.json`))){
        fs.mkdirSync(path.join(__dirname,`../data`))
        fs.writeFileSync(path.join(__dirname,`../data/tasks.json`),JSON.stringify([]))
    }

    fs.readFile(path.join(__dirname, '../data/tasks.json'), 'utf8', (err, data) => {
        if (err) {
            console.error(err)
            return res.status(500).json({"success" : false , "message": "error while saving task" })
        }
        let tasks = []

        if (data === "") {
            tasks = JSON.parse("[]")
        }else {
            tasks = JSON.parse(data)
        }
        // check if task already exists
        let taskExists = tasks.find((task) => {
            return task.task_value === form_data.task_value
                && task.username === form_data.username
        })
        if (taskExists) {
            return res.status(200).json({"success" : false , "message": "task already exists" })
        }else {
            tasks.push(form_data)
            fs.writeFile(path.join(__dirname, '../data/tasks.json'), JSON.stringify(tasks,null,4), (err) => {
                if (err) {
                    console.error(err)
                    return res.status(500).json({"success" : false , "message": "error while saving task" })
                }
            })
            return res.status(200).json({"success" : true , "message": "task created" })

        }
    })
})

router.delete("/",(req,res,next)=>{

    if(!fs.existsSync(path.join(__dirname,`../data/tasks.json`))){
        return res.status(200).json({"success" : true , "message": "no tasks to delete" })
    }
    fs.writeFile(path.join(__dirname, '../data/tasks.json'), JSON.stringify([],null,4), (err) => {
        if (err) {
            console.error(err)
            return res.status(500).json({"success": false, "message": "error while deleting tasks"})
        }

        return res.status(200).json({"success": true, "message": "tasks deleted"})
    })
})

module.exports = router;