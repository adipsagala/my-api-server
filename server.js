const express = require("express");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();
const PORT = 3000;

app.use(express.json()); // Parse JSON request body

// Basic test route
app.get("/", (req, res) => {
  res.send("Hello from Node.js API server!");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

// 1. Define Swagger options
const swaggerOptions = {
  definition: {
    openapi: "3.0.0", // OpenAPI version
    info: {
      title: "My API",
      version: "1.0.0",
      description: "API documentation with Swagger",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./server.js"], // files to scan for API docs (you can include multiple)
};

// 2. Generate swagger specification

// 3. Setup Swagger UI route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerJsdoc(swaggerOptions)));

/**
 * @swagger
 * /hello:
 *   get:
 *     summary: Returns a greeting message
 *     tags: [Greeting]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Hello, world!
 */
app.get("/hello", (req, res) => {
  res.json({ message: "Hello, world!" });
});
