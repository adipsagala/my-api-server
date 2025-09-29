const express = require("express");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();
const PORT = 3000;

app.use(express.json()); // Parse JSON bodies

// ----- In-Memory Data Store -----
let items = [
  { id: 1, name: "Item 1", description: "First item" },
  { id: 2, name: "Item 2", description: "Second item" },
];

// ----- Swagger Setup -----
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "CRUD API Example",
      version: "1.0.0",
      description: "A simple CRUD API with Swagger docs",
    },
    servers: [{ url: "http://localhost:3000" }],
  },
  apis: ["./server-crud.js"], // scans this file for Swagger comments
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * components:
 *   schemas:
 *     Item:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated ID
 *         name:
 *           type: string
 *           description: Item name
 *         description:
 *           type: string
 *           description: Item description
 *       example:
 *         id: 1
 *         name: Sample Item
 *         description: A simple item
 */

/**
 * @swagger
 * tags:
 *   - name: Items
 *     description: API for managing items
 */

/**
 * @swagger
 * /items:
 *   get:
 *     summary: Get all items
 *     tags: [Items]
 *     responses:
 *       200:
 *         description: List of items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Item'
 */
app.get("/items", (req, res) => {
  res.json(items);
});

/**
 * @swagger
 * /items/{id}:
 *   get:
 *     summary: Get a single item by ID
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Item ID
 *     responses:
 *       200:
 *         description: Item found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       404:
 *         description: Item not found
 */
app.get("/items/:id", (req, res) => {
  const item = items.find((i) => i.id === parseInt(req.params.id));
  if (!item) return res.status(404).json({ error: "Item not found" });
  res.json(item);
});

/**
 * @swagger
 * /items:
 *   post:
 *     summary: Create a new item
 *     tags: [Items]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Item'
 *     responses:
 *       201:
 *         description: Item created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 */
app.post("/items", (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ error: "Name is required" });

  const newItem = {
    id: items.length ? items[items.length - 1].id + 1 : 1,
    name,
    description: description || "",
  };
  items.push(newItem);
  res.status(201).json(newItem);
});

/**
 * @swagger
 * /items/{id}:
 *   put:
 *     summary: Update an item by ID
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Item'
 *     responses:
 *       200:
 *         description: Item updated
 *       404:
 *         description: Item not found
 */
app.put("/items/:id", (req, res) => {
  const itemIndex = items.findIndex((i) => i.id === parseInt(req.params.id));
  if (itemIndex === -1) return res.status(404).json({ error: "Item not found" });

  const { name, description } = req.body;
  items[itemIndex] = {
    ...items[itemIndex],
    name: name ?? items[itemIndex].name,
    description: description ?? items[itemIndex].description,
  };
  res.json(items[itemIndex]);
});

/**
 * @swagger
 * /items/{id}:
 *   delete:
 *     summary: Delete an item by ID
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Item ID
 *     responses:
 *       200:
 *         description: Item deleted
 *       404:
 *         description: Item not found
 */
app.delete("/items/:id", (req, res) => {
  const itemIndex = items.findIndex((i) => i.id === parseInt(req.params.id));
  if (itemIndex === -1) return res.status(404).json({ error: "Item not found" });

  const deletedItem = items.splice(itemIndex, 1);
  res.json({ message: "Item deleted", deletedItem });
});

// ----- Start Server -----
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📚 Swagger docs available at http://localhost:${PORT}/api-docs`);
});
