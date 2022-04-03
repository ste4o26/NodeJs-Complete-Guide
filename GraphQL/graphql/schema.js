const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type Post {
        _id: ID!
        title: String!
        imageUrl: String!
        content: String!
        creator: User!
        createdAt: String!
        updatedAt: String!
    }

    type User {
        _id: ID!
        name: String!
        email: String!
        status: String!
        posts: [Post!]!
    }

    type AuthData {
        token: String!
        userId: String!
    }

    type PostsData {
        posts: [Post!]!
        totalItems: Int!
    }

    input UserRegisterData {
        name: String!
        email: String!
        password: String!
    } 

    input UserLoginData {
        email: String!
        password: String!
    }

    input PostData {
        title: String!
        imageUrl: String!
        content: String!
    }

    type RootMutation {
        register(userRegisterData: UserRegisterData!): User!
        login(userLoginData: UserLoginData!): AuthData!
        createPost(postData: PostData!): Post!
        editPost(postId: ID!, postData: PostData!): Post!
        deletePost(postId: ID!): Boolean!
    }

    type RootQuery {
        getPosts(page: Int!): PostsData!
        getPost(postId: ID!): Post!
        getCurrentUser: User!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);