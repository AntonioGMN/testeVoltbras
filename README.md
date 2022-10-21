## Implemented features:

- [x] Query suitablePlanets
- [x] Mutation installStation
- [x] Query stations
- [x] Mutation recharge
- [x] Mutation reservation
- [x] Query stationHistory 
- [x] Mutation signUp and login

## Technologies

<p>

  <img alt="node" src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white"/>
  <img alt="apolloGraphQL" src="https://img.shields.io/badge/-ApolloGraphQL-311C87?style=for-the-badge&logo=apollo-graphql"/>
  <img alt="jwt" src="https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens"/>
  <img alt="prisma" src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white"/>
  <img alt="typecript" src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white"/>
  

</p>

## Requirements

### [npm](https://www.npmjs.com/)

<details>
    <summary>install npm</summary>

```bash
wget -qO- <https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh> | bash

## Or this command
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash

# Close and open terminal
nvm install --lts
nvm use --lts
# Verify node version
node --version # Must show v14.16.1
# Verify npm version
npm -v
```

</details>

### [postgreSQL](https://www.postgresql.org/)

<details>
    <summary>install postgres</summary>

```bash
sudo apt install postgresql postgresql-contrib
```
</details>

## How to run

### Clone this repository

```bash
$ git clone git@github.com:AntonioGMN/testeVoltbras.git
```

### Access the directory where you cloned it

```bash
$ cd -TestHubLocal-back-
```

### Install back-end dependencies

```bash
npm i
```

### Create an environment variables file in the project root (.env) and configure it as shown in .env.example file:

```bash
DATABASE_URL= postgres://postgres:123456@localhost:5432/stations
JWT_SECRET=123456
```

### Run the back-end with

```bash
npm run dev
```

