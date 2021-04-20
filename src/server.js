const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { graphqlHTTP } = require("express-graphql");
const logger = require("./core/logger");
const extensions = ({ context }) => {
  return {
    runTime: Date.now() - context.startTime,
  };
};

dotenv.config();

app.use(logger);

app.listen(5000, async () => {
  console.log("server is running ", 5000);
  await mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.zzecs.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

mongoose.connection.on(
  "error",
  console.error.bind(console, "MongoDB connection error:")
);
const graphqlSchema = require("./schemas/index");

app.use(
  "/graphql",
  graphqlHTTP((request) => {
    return {
      context: { startTime: Date.now() },
      graphiql: true,
      schema: graphqlSchema,
      extensions,
    };
  })
);