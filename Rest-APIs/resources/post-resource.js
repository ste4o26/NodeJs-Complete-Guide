const Post = require('../models/post');
const User = require('../models/user');
const { isValidPost, getErrorResponse } = require('../utils/validation-util');

exports.getPosts = ((req, res, next) => {
    const currentPage = req.query.page || 1;
    const postsPerPage = 2;
    let totalPosts;

    Post
        .countDocuments()
        .then(count => {
            totalPosts = count;
            return Post
                .find()
                .skip((currentPage - 1) * postsPerPage)
                .limit(postsPerPage);
        })
        .then(posts => {
            return res
                .status(200)
                .json({ totalItems: totalPosts, posts });
        })
        .catch(err => {
            if (!err.status) return next(getErrorResponse(500, err.message));
            next(err);
        });

});

exports.addPost = ((req, res, next) => {
    if (!isValidPost(req))
        throw getErrorResponse(422, 'Invalid input please try again!', req);

    const postData = { ...req.body };
    const post = new Post({
        title: postData.title,
        content: postData.content,
        imageUrl: req.file.path.replace('\\', '/'),
        creator: req.userId,
    });

    post
        .save()
        .then(() => User.findById(req.userId))
        .then(user => {
            user.posts.push(post);
            return user.save();
        })
        .then(user => {
            return res
                .status(201)
                .json({
                    message: 'Post created successfully.',
                    creator: {
                        _id: user._id,
                        name: user.name
                    },
                    post
                });
        })
        .catch(err => {
            if (!err.status) return next(getErrorResponse(500, err.message));
            next(err);
        });
});

exports.getPost = (req, res, next) => {
    const postId = req.params.postId;

    Post
        .findById(postId)
        .then(post => {
            if (!post) throw getErrorResponse(404, 'No such post');
            return res
                .status(200)
                .json({ message: 'Post found successfully', post });
        })
        .catch(err => {
            if (!err.status) return next(getErrorResponse(500, err.message));
            next(err);
        });
}

exports.putPost = (req, res, next) => {
    if (!isValidPost(req))
        throw getErrorResponse(422, 'Invalid input!', req);

    const postId = req.params.postId;
    const postData = { ...req.body }
    postData.imageUrl = postData.image ? postData.image : req.file.path.replace('\\', '/');

    Post
        .findById(postId)
        .then(post => {
            if (!post) throw getErrorResponse(404, 'No such post!');
            if (post.creator.toString() !== req.userId) throw getErrorResponse(403, 'Unauthorized action!');

            post.clearImageIfUpdated();
            post.title = postData.title;
            post.content = postData.content;
            post.imageUrl = postData.imageUrl;

            return post.save();
        })
        .then(post => {
            return res
                .status(200)
                .json({ message: 'Post updated successfully.', post });
        })
        .catch(err => {
            if (!err.status) return next(getErrorResponse(500, err.message));
            next(err);
        });
}

exports.deletePost = (req, res, next) => {
    const postId = req.params.postId;

    Post.findById(postId)
        .then(post => {
            if (post.creator.toString() !== req.userId) throw getErrorResponse(403, 'Unauthorized action!');
            if (!post) throw getErrorResponse(404, 'No such post!');

            post.clearImageIfUpdated();
            return post.remove();
        })
        .then(() => User.findById(req.userId))
        .then(user => {
            user.posts.pull(postId);
            return user.save();
        })
        .then(() => {
            return res
                .status(200)
                .json({ message: 'Post deleted successfully.' });
        })
        .catch(err => {
            if (!err.status) return next(getErrorResponse(500, err.message));
            next(err);
        });
}

