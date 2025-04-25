import swaggerAutogen from "swagger-autogen";
import path from "path";

const doc = {
  info: {
    version: "1.0.0",
    title: "BookBug API",
    description: "API for BookBug",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Local Server",
    },
  ],
  schemes: ["http", "https"],
  securityDefinitions: {
    bearerAuth: {
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
    },
  },
};

const outputFile = "../swagger.json";
const endpointsFiles = [
  "../index.ts",

];

swaggerAutogen(outputFile, endpointsFiles, doc);
