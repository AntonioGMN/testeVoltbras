const typeDefs = `#graphql
  type suitablePlanet {
    name: String
    mass: Float
    hasStation: Boolean
  }

  type recharge{
    start: String
    end: String
  }

  type stations{
    name:    String   
    planet:  String
    recharges: [recharge]
  }

  input stationsInput {
    name: String
    planet: String
  }

  type Query {
    suitablePlanets: [suitablePlanet]
    stations: [stations]
  }


  type Mutation {
    installStation(data: stationsInput): stations
  }
`;

export default typeDefs;
