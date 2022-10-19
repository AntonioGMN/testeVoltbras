const typeDefs = `#graphql
  scalar date

  type suitablePlanet {
    name: String
    mass: Float
    hasStation: Boolean
  }

  type recharge{
    start: date
    end: date
  }

  type stations{
    name:    String   
    planet:  String
  }

  input stationsInput {
    name: String
    planet: String
  }
 
  input rechargeInput {
    stationName: String
    date: String
  }

  type Query {
    suitablePlanets: [suitablePlanet]
    stations: [stations]
  }


  type Mutation {
    installStation(data: stationsInput): stations
    recharge(data: rechargeInput): recharge
  }
`;

export default typeDefs;
