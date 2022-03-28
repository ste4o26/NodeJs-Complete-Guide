const express = require('express');
const router = express.Router();

const postResource = require('../resources/post-resource');
const { postValidation } = require('../middlewares/validation-middleware');
const authMiddleware = require('../middlewares/auth-middleware');

router.get('/all', authMiddleware, postResource.getPosts);

router.post('/add', authMiddleware, postValidation, postResource.addPost);

router.get('/:postId', authMiddleware, postResource.getPost);

router.put('/edit/:postId', authMiddleware, postValidation, postResource.putPost);

router.delete('/delete/:postId', authMiddleware, postResource.deletePost);

module.exports = router;