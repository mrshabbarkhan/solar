const express = require("express")
const connectDB = require("./config/db_config")
const errorHandler = require("./middlewares/errorHandler")
const cors = require('cors');


require("dotenv").config()
const app = express()
const PORT = process.env.PORT

// CONNECT DB 
connectDB()


// Body Parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors());

// connect user  Routes
app.use("/api/user", require('./routes/userRoutes'))
app.use("/api/solar", require("./routes/solarRoutes"))



// Error Handller
app.use(errorHandler)



app.get("/", (req, res) => {
    res.send("Welcome")
})

app.listen(PORT, () => {
    console.log(`Server is Running at:${PORT}`)
})