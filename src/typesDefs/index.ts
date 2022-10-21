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
    reservationId: Int
    stationName: String
    date: String
  }

  type user {
    name: String
    email: String
    password: String
  }

  input userInput{
    name: String
    email: String
    password: String
  }

  type stationHistory{
    start: date
    duration: String
    user: String
  }

  type reservate{
    id: Int
    station: String
    user: String
    start: date
    end: date
  }

  input reservateInput{
    stationName: String
    start: date
    end: date
  }

  type Query {
    suitablePlanets: [suitablePlanet]
    stations: [stations]
    stationHistory(stationName: String): [stationHistory]
  }

  type token {
    token: String
  }


  type Mutation {
    installStation(data: stationsInput): stations
    recharge(data: rechargeInput): recharge
    signUp(data: userInput): user
    login(data: userInput): String
    reservation(data: reservateInput): reservate
  }
`;

export default typeDefs;
