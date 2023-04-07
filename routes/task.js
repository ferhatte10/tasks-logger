const express = require('express');
const router = express.Router();
const fs = require('fs')
const path = require('path')
const {Task,getTasks} = require("../model/models.js")

router.get('/', (req, res,next) => {
    // get the data of all tasks
    getTasks().then((data) => {
        if (data.length === 0) {
            return res.status(404).json({"success": true,"message": "No tasks found", "data": []})
        }
        return res.status(200).json({"success": true,"message": "Tasks found", "data": data})
    }).catch((err) => {
        console.log(err)
        return res.status(500).json({"success": false, "message": "Error while getting tasks"})
    })

})

// delete a task with id using sequelize
router.delete("/:id", (req, res, next) => {
    let id = req.params.id
    //checking if the id is integer with regex
    if (!/^\d+$/.test(req.params.id)) {
        return res.status(400).json({"success": false, "message": "Task id must be an integer"})

    }
    Task.destroy({
        where: {
            id: id
        }
    }).then((data) => {
        if (data === 0) {
            return res.status(404).json({"success": false, "message": "Task not found"})
        } else {
            return res.status(200).json({"success": true, "message": "Task deleted"})
        }
    }).catch((err) => {
        console.log(err)
        return res.status(500).json({"success": false, "message": "Error while deleting task"})
    })
})

router.delete("/", (req, res, next) => {
    Task.destroy({
        where: {},
        truncate: true
    }).then((data) => {
        return res.status(200).json({"success": true, "message": "All tasks deleted"})
    }).catch((err) => {
        console.log(err)
        return res.status(500).json({"success": false, "message": "Error while deleting tasks"})
    })
})

router.post("/", (req, res, next) => {
    let form_data = req.body
    console.log(form_data)
    //check if the task value and username is not undefined and trim the spaces from the task value and username and check if the task value is not empty
    if (form_data.task_value === undefined || form_data.username === undefined || form_data.task_value.trim() === "" || form_data.username.trim() === "") {
        return res.status(400).json({"success": false, "message": "Task value and username cannot be empty"})
    }
    Task.findOne({
        where: {
            username: form_data.username,
            task_value: form_data.task_value
        }
    }).then((data) => {
        if (data) {
            return res.status(200).json({"success": false, "message": "Task already exists"})
        } else {
            Task.create({
                username: form_data.username,
                task_value: form_data.task_value
            }).then((data) => {
                return res.status(200).json({"success": true, "message": "Task created"})
            }).catch((err) => {
                console.log(err)
                return res.status(500).json({"success": false, "message": "Error while creating task"})
            })
        }
    })
})

router.put("/:id", (req, res, next) => {
    let idT = req.params.id
    //checking if the id is integer with regex
    if (!/^\d+$/.test(req.params.id)) {
        return res.status(400).json({"success": false, "message": "Task id must be an integer"})

    }
    let form_data = req.body
    Task.findOne({
        where: {
            username: form_data.username,
            task_value: form_data.task_value
        }
    }).then((data) => {
        if (data) {
            return res.status(200).json({"success": false, "message": "Task already exists"})
        } else {
            Task.update({
                task_value: form_data.task_value
            }, {
                where: {
                    id: idT
                }
            }).then((data) => {
                if (data[0] === 0) {
                    return res.status(404).json({"success": false, "message": "Task not found"})
                } else {
                    return res.status(200).json({"success": true, "message": "Task updated"})
                }
            }).catch((err) => {
                console.log(err)
                return res.status(500).json({"success": false, "message": "Error while updating task"})
            })
        }
    })
})


module.exports = router;