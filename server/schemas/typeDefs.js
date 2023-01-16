const { gql } = require("apollo-server-express");

const typeDefs = gql`
type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]
  }
  type Book {
    _id: ID
    bookId: String
    authors: [String]
    description: String
    title: String
    image: String
  }
  input SavedBook {
    authors: [String]
    title: String
    description: String
    bookId: String
    image: String
  }
type Auth {
  token: ID!
  user: User
}
  type Query {
    me: User
  }
  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(book: SavedBook): User
    removeBook(bookId: String!): User
  }
`;

// export the typeDefs
module.exports = typeDefs;