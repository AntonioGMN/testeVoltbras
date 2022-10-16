const typeDefs = `#graphql
  type suitablePlanet {
    name: String
    mass: Float
    hasStation: Boolean
  }

  type Query {
    suitablePlanets: [suitablePlanet]
  }


  type Mutation {
    installStation(name: String, mass: Float, hasStation: Boolean): suitablePlanet
  }
`;

export default typeDefs;
