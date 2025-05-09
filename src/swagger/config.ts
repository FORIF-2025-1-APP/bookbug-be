export const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      version: "1.0.0", 
      title: "BookBug API",
      description: "API for BookBug - A book review and discussion platform",
    },
    servers: [
      {
        url: "https://forifbookbugapi.seongjinemong.app",
        description: "Production Server",
      },
      {
        url: "http://localhost:3000", 
        description: "Local Development Server",
      },
      {
        url: "http://localhost:3300",
        description: "Docker Development Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    process.env.NODE_ENV === 'production'
      ? ["./dist/src/routes/*.js", "./dist/src/controllers/*.js"]
      : ["./src/routes/*.ts", "./src/controllers/*.ts"]
  ].flat(),
};
