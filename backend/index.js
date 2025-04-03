const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PORT = process.env.PORT || 8081
const {ApolloServer} = require('apollo-server-express')


const dotenv = require('dotenv');
dotenv.config();


const bodyParser = require('body-parser');
const cors = require('cors');


const TypeDefsUser = require('./GQLComponents/Schemas/GQLUserSchema')
const TypeDefEmployee = require('./GQLComponents/Schemas/GQLEmployeeSchema')
const ResolversUser = require('./GQLComponents/Resolvers/GQLUserResolver')
const ResolversEmployee = require('./GQLComponents/Resolvers/GQLEmployeeResolver')


const apolloServer = new ApolloServer({
    typeDefs: [TypeDefsUser, TypeDefEmployee],
    resolvers: [ResolversUser, ResolversEmployee]
})
const allowedOrigins = [
    'https://101347926-comp3133-assignment2.vercel.app', 'http://localhost:4200', 
  ];

app.use(bodyParser.json());
app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
  }));


const connectDB = async() => {
    try{
        console.log(`Attempting to connect to DB`);

        mongoose.connect(process.env.Mongo_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then( () => {
            console.log(`MongoDB connected`)
        }).catch( (err) => {
            console.log(`Error while connecting to MongoDB : ${JSON.stringify(err)}`)
        });
    }catch(error){
        console.log(`Unable to connect to DB : ${error.message}`);
        
    }
}

const startExpressServer = async() => {
    connectDB()
    await apolloServer.start()
    apolloServer.applyMiddleware( {app} )

    app.listen(PORT, () => {
        console.log(`The server started running at http://localhost:${PORT}`);
        console.log(`Access GraphQL at http://localhost:${PORT}${apolloServer.graphqlPath}`);
    })
}

startExpressServer()
