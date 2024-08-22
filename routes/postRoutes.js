const express = require('express')
const router = express.Router()
const postCOntroller = require('../controllers/postController')
const { authenticateToken } = require('../middlewares/auth')

router.get('/', postCOntroller.getAllPosts)
router.post('/', authenticateToken,postCOntroller.createPost) // after checking acess token should be provided ==>  authenticateToken
router.delete('/:id', authenticateToken, postCOntroller.deletePost)

module.exports = router