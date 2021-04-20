const express = require("express");
const mongoose = require("mongoose");
const {graphqlHTTP} = require("express-graphql");
//const logger = require("./core/logger");
const dotenv = require("dotenv");
const extensions = ({context}) => {
    return {
        runTime: Date.now() - context.startTime,
    };
};

dotenv.config()

const mongoString = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.zzecs.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

mongoose.connect(mongoString, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});

mongoose.connection.on("error", function(error) {
    console.log(error);
});

mongoose.connection.on("open", function() {
    console.log("Connected to MongoDB database..")
})

const app = express();

app.use(express.json());

//app.use(logger);

app.listen(5000, () => {
    console.log("server is running ", 5000);
});

const graphqlSchema = require("./schemas/index");
const { request } = require("express");
app.use(
    "/graphql",
    graphqlHTTP((request) => {
        return {
            context: {startTime: Date.now()},
            graphiql: true,
            schema: graphqlSchema,
            extensions,
        };
    })
);