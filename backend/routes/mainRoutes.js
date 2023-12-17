const express = require('express')
const router = express.Router()
const {getPosts, getPost, postRoutes, putRoutes, deleteRoutes} = require('../controllers/postController') 

router.route('/').get(getPosts).post(postRoutes);

router.route('/:id').put(putRoutes).delete(deleteRoutes);

router.route('/:id').get(getPost);
module.exports = router 