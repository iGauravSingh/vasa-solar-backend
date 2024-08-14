const express = require('express')
const router = express.Router()
const postCOntroller = require('../controllers/postController')
const { authenticateToken } = require('../middlewares/auth')

router.get('/', postCOntroller.getAllPosts)
router.post('/', authenticateToken, postCOntroller.createPost)
router.delete('/:id', authenticateToken, postCOntroller.deletePost)

module.exports = router