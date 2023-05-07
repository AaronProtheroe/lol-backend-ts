import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import fetch from 'node-fetch';

const port = parseInt(process.env.PORT) || 4000
​
// Type definitions for Champions and query's
const typeDefs = `
    type Champion {
      id: String
      name: String
      title: String
      lore: String
    }

    type Query {
      champions: [Champion]
      champion(id: String): Champion
    }
`

const resolvers = {
  Query: {

    // Query to fetch all of the champions
    champions: async () => {

      const response = await fetch('https://ddragon.leagueoflegends.com/cdn/13.7.1/data/en_US/champion.json')

      // TODO: Properly type instead of any
      const data: any = await response.json()

      return Object.values(data.data)
    },

    // Query to fetch a single champion given its ID 
    champion: async (_,{id}) => {
      
      const response = await fetch(`https://ddragon.leagueoflegends.com/cdn/13.7.1/data/en_US/champion/${id}.json`)

      // TODO: Properly type instead of any
      const data: any = await response.json()

      return data.data[id]
    }

  }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  
const { url } = await startStandaloneServer(server, {
    listen: { port: port },
});

console.log(`🚀  Server ready at: ${url}`);




