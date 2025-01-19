const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");

dotenv.config();

const app = express();
app.use(express.json());

//  CORS
app.use(cors());

// Import routes
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");

//morgan
app.use(morgan("combined"));

// Middleware
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0", 
    info: {
      title: "to-do API",
      version: "1.0.0",
      description: "API Documentation",
    },
    servers: [
      {
        url: "http://localhost:5000/api",
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
  apis: ["./routes/*.js"],
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Serve Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Example route
app.get("", (req, res) => {
  res.send("Hello, world!");
});
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
