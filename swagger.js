import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Courses API",
            version: "1.0.0",
            description: "API for managing courses, chapters, and quizzes",
        },
        servers: [
            {
                url: "http://192.168.1.114:5000",
                description: "Local server",
            },
        ],
    },
    apis: ["./routes/*.js"], // Path to your route files
};

const specs = swaggerJsDoc(options);

export default (app) => {
    app.use("/", swaggerUi.serve, swaggerUi.setup(specs));
};
