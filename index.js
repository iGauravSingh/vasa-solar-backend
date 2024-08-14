const express = require('express')

const cors = require('cors')

const app = express()

app.use(cors())

app.use(express.json());
app.use(express.urlencoded({ extended: false }))

//default
app.get('/',(req,res) => {
    res.send("Hello from vasa solar")
})

// all routes go here in this case we need routes for
// auth admin
app.use('/auth', require('./routes/authRoutes'))

// project posts
app.use('/posts', require('./routes/postRoutes'))
// image posts

// youtube link post


//

// error
app.use((err,req,res,next) => {
    console.log(err.stack);
    res.status(500).json({ message: 'Internal server error' })
})

// 404 routes
app.use((req,res) => {
    res.status(404).json({ 404: "page not found"})
})

// Start the server
const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})











