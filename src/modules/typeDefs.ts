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

  type Query {
    suitablePlanets: [suitablePlanet]
    stations: [stations]
  }


  type Mutation {
    installStation(name: String, mass: Float, hasStation: Boolean, stationName: String): stations
  }
`;

export default typeDefs;
