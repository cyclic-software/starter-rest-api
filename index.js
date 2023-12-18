const db = require('@cyclic.sh/dynamodb')
const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');

const resolvers = require('./resolvers')
const typeDefs = require('./schema');

async function startApolloServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers
  });

  const { url } = await startStandaloneServer(server, {
    context: () => {
      return {
        dataSources : {
          db: db
        }
      }
    }
   });

  console.log(`
      🚀  Server is running
      📭  Query at ${url}
    `);
}

startApolloServer();

