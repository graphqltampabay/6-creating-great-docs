const { ApolloServer, gql } = require('apollo-server');

// This is a (sample) collection of books we'll be able to query
// the GraphQL server for.  A more complete example might fetch
// from an existing data source like a REST API or database.
const books = [
  {
    id: 1,
    title: 'Harry Potter and the Chamber of Secrets',
    authorId: 2,
  },
  {
    id: 2,
    title: 'Jurassic Park',
    authorId: 1,
  },
];

const authors = [
  {
    id: 1,
    name: 'Michael Crichton'
  },
  {
    id: 2,
    name: 'J.K. Rowling',
    age: 53
  }
]

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql`
  # Comments in GraphQL are defined with the hash (#) symbol.

  # Triple quotes in a schema denote a docstring that will appear in the
  # playground alongside the schema. Markdown is fully supported!
  
  """
  Books are essential to learning and human culture.
  They have existed for _thousands_ of years in one form or another.
  More information can be found on [Wikipedia](https://en.wikipedia.org/wiki/Book#Etymology).
  """
  type Book {
    id: ID!
    """
    The often-times misleading name of the book
    """
    title: String
    """
    The human being who wrote the book
    """
    author: Person
  }

  type Person {
    id: ID!
    name: String!
    age: Int
  }

  # The "Query" type is the root of all GraphQL queries.
  # (A "Mutation" type will be covered later on.)
  type Query {
    books: [Book]
  }
`;

// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.
const resolvers = {
  Query: {
    books: () => books,
  },
  
  Book: {
    // Parent in GraphQL means "thing that called this"
    // so the author field is nested in "Book", making it the parent
    author: (parent) => {
      return authors.find(author => author.id === parent.authorId);
    }
  }
};

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({ typeDefs, resolvers });

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen(4000).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});