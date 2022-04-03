const bcrypt = require('bcryptjs');

const User = require('../models/user');
const Post = require('../models/post');
const ErrorResponse = require('../models/error-response');
const { isValidPost, isValidUser } = require('../utils/validation-util')
const fileUtil = require('../utils/file-util');
const jwtUtil = require('../utils/jwt-util');

module.exports = {
    register: async (args, req) => {
        const userData = args.userRegisterData;
        if (!isValidUser(userData, req, true))
            throw new ErrorResponse(422, 'Invalid user input!', req.errors);

        const userByEmail = await User.findOne({ email: userData.email });
        if (userByEmail) throw new ErrorResponse(400, 'Email already taken!');

        const hashedPassword = await bcrypt.hash(userData.password, 12);
        const user = new User({
            name: userData.name,
            email: userData.email,
            password: hashedPassword
        });

        const persistedUser = await user.save();
        return { ...persistedUser._doc, _id: persistedUser._id.toString() };
    },

    login: async (args, req) => {
        const userData = args.userLoginData;
        if (!isValidUser(userData, req, false))
            throw new ErrorResponse(422, 'Invalid user input!', req.errors);

        const user = await User.findOne({ email: userData.email });
        if (!user) throw new ErrorResponse(400, 'Invalid username or password!');

        const doMatch = await bcrypt.compare(userData.password, user.password);
        if (!doMatch) throw new ErrorResponse(400, 'Invalid username or password!');

        const token = jwtUtil.signTokenFor(user);
        return { token, userId: user._id.toString() };
    },

    createPost: async (args, req) => {
        if (!req.isAuth) throw new ErrorResponse(401, 'Not Authenticated!');

        const postData = args.postData;
        if (!isValidPost(postData, req))
            throw new ErrorResponse(422, 'Invalid post data', req.errors);

        const user = await User.findById(req.userId);
        if (!user) throw new ErrorResponse(401, 'Not authenticated!');

        const post = new Post({
            title: postData.title,
            imageUrl: postData.imageUrl,
            content: postData.content,
            creator: user
        });

        const persistedPost = await post.save();
        user.posts.push(persistedPost);
        await user.save();

        return {
            ...persistedPost._doc,
            _id: persistedPost._id.toString(),
            createdAt: persistedPost.createdAt.toISOString(),
            updatedAt: persistedPost.updatedAt.toISOString(),
        };
    },

    getPosts: async (args, req) => {
        if (!req.isAuth) throw new ErrorResponse(401, 'Not authenticated!');

        const currentPage = args.page || 1;
        const postsPerPage = 2;

        const totalPostsCount = await Post.countDocuments();
        const posts = await Post
            .find()
            .populate('creator')
            .skip((currentPage - 1) * postsPerPage)
            .limit(postsPerPage);

        const modifiedPosts = posts.map(post => {
            return {
                ...post._doc,
                _id: post._id.toString(),
                createdAt: post.createdAt.toISOString(),
                updatedAt: post.updatedAt.toISOString()
            }
        })

        return {
            posts: modifiedPosts,
            totalItems: totalPostsCount
        }
    },

    getPost: async (args, req) => {
        if (!req.isAuth) throw new ErrorResponse(401, 'Not authenticated!');

        const post = await Post
            .findById(args.postId)
            .populate('creator');
        if (!post) throw new ErrorResponse(404, 'No such post!');

        console.log(post)
        return {
            ...post._doc,
            _id: post._id.toString(),
            createdAt: post.createdAt.toISOString(),
            updatedAt: post.updatedAt.toISOString()
        }
    },

    editPost: async (args, req) => {
        if (!req.isAuth) throw new ErrorResponse(401, 'Not authenticated!');

        const post = await Post
            .findById(args.postId)
            .populate('creator');
        if (!post) throw new ErrorResponse(404, 'No such post!');

        if (post.creator._id.toString() !== req.userId.toString())
            throw new ErrorResponse(403, 'Unauthorized action!');

        const postData = args.postData;
        post.title = postData.title;
        post.content = postData.content;
        if (postData.imageUrl !== 'undefined')
            post.imageUrl = postData.imageUrl;

        const updatedPost = await post.save();

        return {
            ...updatedPost._doc,
            _id: updatedPost._id.toString(),
            createdAt: updatedPost.createdAt.toISOString(),
            updatedAt: updatedPost.updatedAt.toISOString()
        }
    },

    deletePost: async (args, req) => {
        if (!req.isAuth) throw new ErrorResponse(401, 'Not authenticated!');

        const post = await Post
            .findById(args.postId)
            .populate('creator');
        if (!post) throw new ErrorResponse(404, 'No such post!');

        if (post.creator._id.toString() !== req.userId.toString())
            throw new ErrorResponse(403, 'Unauthorized action!');

        fileUtil.clearImage(post.imageUrl);

        const response = await post.remove();
        if (!response) throw new ErrorResponse(500, 'Somenthing went wrong!');

        const user = await User.findById(req.userId);
        user.posts.pull(args.postId);
        await user.save();

        return true;
    },

    getCurrentUser: async (args, req) => {
        if (!req.isAuth) throw new ErrorResponse(401, 'Not authenticated!');

        const user = await User.findById(req.userId);
        if (!user) throw new ErrorResponse(404, 'No such user!');

        return {
            ... user._doc,
            _id: user._id.toString()
        }
    }
}