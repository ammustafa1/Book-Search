const { AuthenticationError } = require("apollo-server-express");
const { User, Book } = require("../models");
const { signToken } = require("../utils/auth");

const queryResolvers = {
    myProfile: async (parent, args, context) => {
        if (context.user) {
            const userData = await User.findOne({ _id: context.user._id }).select(
                "-__v -password"
            );
            return userData;
        }
        throw new AuthenticationError("Not logged in!");
    },
};

const mutationResolvers = {
    register: async (parent, args) => {
        const newUser = await User.create(args);
        const token = signToken(newUser);
        return { user: newUser, token };
    },
    signIn: async (parent, { email, password }) => {
        const user = await User.findOne({ email });
        if (!user) {
            throw new AuthenticationError("Incorrect credentials");
        }
        const validPass = await user.isCorrectPassword(password);
        if (!validPass) {
            throw new AuthenticationError("Incorrect credentials");
        }
        const token = signToken(user);
        return { user, token };
    },
    addToLibrary: async (parent, { book }, context) => {
        if (context.user) {
            const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $addToSet: { savedBooks: book } },
                { new: true, runValidators: true }
            );
            return updatedUser;
        }
        throw new AuthenticationError("Not logged in!");
    },
    removeFromLibrary: async (parent, { bookId }, context) => {
        if (context.user) {
            const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $pull: { savedBooks: { bookId: bookId } } },
                { new: true }
            );
            return updatedUser;
        }
    },
};

const resolvers = {
    Query: queryResolvers,
    Mutation: mutationResolvers
};

module.exports = resolvers;
