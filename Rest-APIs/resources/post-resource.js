const Post = require('../models/post');
const User = require('../models/user');
const { isValidPost, getErrorResponse } = require('../utils/validation-util');

exports.getPosts = async (req, res, next) => {
    const currentPage = req.query.page || 1;
    const postsPerPage = 2;
    let totalPosts;
    let posts;

    try {
        totalPosts = await Post.countDocuments();
        posts = await Post
            .find()
            .populate('creator')
            .skip((currentPage - 1) * postsPerPage)
            .limit(postsPerPage);

            console.log(posts)
    } catch (err) {
        if (!err.status) return next(getErrorResponse(500, err.message));
        return next(err);
    }

    res.status(200)
        .json({ totalItems: totalPosts, posts });
};

exports.addPost = async (req, res, next) => {
    if (!isValidPost(req))
        throw getErrorResponse(422, 'Invalid input please try again!', req);

    let user;
    const postData = { ...req.body };
    const post = new Post({
        title: postData.title,
        content: postData.content,
        imageUrl: req.file.path.replace('\\', '/'),
        creator: req.userId,
    });

    try {
        await post.save();
        user = await User.findById(req.userId);
        user.posts.push(post);
        user = user.save();
    } catch (err) {
        if (!err.status) return next(getErrorResponse(500, err.message));
        return next(err);
    }

    res.status(201)
        .json({
            message: 'Post created successfully.',
            creator: {
                _id: user._id,
                name: user.name
            },
            post
        });
}

exports.getPost = async (req, res, next) => {
    const postId = req.params.postId;
    let post;

    try {
        post = await Post.findById(postId);
        if (!post) throw getErrorResponse(404, 'No such post');
    } catch (err) {
        if (!err.status) return next(getErrorResponse(500, err.message));
        return next(err);
    }

    res.status(200)
        .json({ message: 'Post found successfully', post });
}

exports.putPost = async (req, res, next) => {
    if (!isValidPost(req))
        throw getErrorResponse(422, 'Invalid input!', req);

    let post;
    const postId = req.params.postId;
    const postData = { ...req.body }
    postData.imageUrl = postData.image ? postData.image : req.file.path.replace('\\', '/');
    try {
        post = await Post.findById(postId);
        if (!post) throw getErrorResponse(404, 'No such post!');
        if (post.creator.toString() !== req.userId) throw getErrorResponse(403, 'Unauthorized action!');

        post.clearImageIfUpdated();
        post.title = postData.title;
        post.content = postData.content;
        post.imageUrl = postData.imageUrl;

        post.save();
    } catch (err) {
        if (!err.status) return next(getErrorResponse(500, err.message));
        return next(err);
    }

    res.status(200)
        .json({ message: 'Post updated successfully.', post });
}

exports.deletePost = async (req, res, next) => {
    const postId = req.params.postId;

    try {
        const post = await Post.findById(postId);

        if (post.creator.toString() !== req.userId) throw getErrorResponse(403, 'Unauthorized action!');
        if (!post) throw getErrorResponse(404, 'No such post!');

        await post.clearImageIfUpdated();
        await post.remove();
        const user = await User.findById(req.userId);

        await user.posts.pull(postId);
        await user.save();
    } catch (err) {
        if (!err.status) return next(getErrorResponse(500, err.message));
        next(err);
    }

    res.status(200)
        .json({ message: 'Post deleted successfully.' });
}

