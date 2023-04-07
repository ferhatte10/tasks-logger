const readline = require('readline')
const cors = require('cors')
const express = require('express')
const app = express()
const port = 3000
const path = require('path')
const morgan = require('morgan')
const fs = require("fs");

//setting view engine to ejs
app.set("view engine", "ejs")


app.use(express.static(path.join(__dirname, 'assets')))
app.use('/logoImages', express.static(__dirname + '/assets/images'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())
app.use(morgan('dev'))

//route for index page
app.get("/", function (req, res) {
  res.render("index")
})

//route for magic page
app.get("/tasks", function (req, res) {

  fs.readFile(path.join(__dirname, './data/tasks.json'), 'utf8', (err, data) => {
    if (err) {
      console.error(err)
    }
    let tasks = []
    if (data === "") {
      tasks = JSON.parse("[]")
      res.render("tasks", {tasks: tasks})
    }else {
      tasks = JSON.parse(data)
      res.render("tasks", {tasks: tasks})
    }
  })
})

app.use("/api/task", require("./routes/task.js"))

app.use(`*`, function(req, res) {
  res.status(404).send(`404 not found`)
})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})
rl.on('line', (input) => {
  if(input === 'clear'){
    console.clear()
  }
  if (input === 'kill') {
    process.exit(0)
  }
  rl.prompt()
})