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

  type user {
    email: String
    password: String
  }

  input userInput{
    email: String
    password: String
  }

  type Query {
    suitablePlanets: [suitablePlanet]
    stations: [stations]
  }

  type token {
    token: String
  }


  type Mutation {
    installStation(data: stationsInput): stations
    recharge(data: rechargeInput): recharge
    signUp(data: userInput): user
    login(data: userInput): token
  }
`;

export default typeDefs;
