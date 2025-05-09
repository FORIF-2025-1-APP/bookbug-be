import express, { RequestHandler } from "express";
import swaggerUi from "swagger-ui-express"; //ui 설정할 수 있는 모듈 불러오기
import swaggerJSDoc from "swagger-jsdoc";
import { options } from "./swagger/config";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import bookRoutes from "./routes/book.routes";
import reviewRoutes from "./routes/review.routes";
import tagRoutes from "./routes/tag.routes";
import replyRoutes from "./routes/reply.routes";
import commentRoutes from "./routes/comment.routes";
import { authMiddleware } from "./middleware/auth.middleware";
import categoryRoutes from "./routes/category.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy settings for Cloudflare and Nginx Proxy Manager
app.set("trust proxy", [
  "loopback",
  "linklocal",
  "uniquelocal",
  "10.0.0.0/8",
  "172.16.0.0/12",
  "192.168.0.0/16",
]);
app.enable("trust proxy");

// Middleware
app.use(express.json());

// Swagger UI options
const swaggerUiOptions = {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    docExpansion: 'none',
    filter: true,
    showExtensions: true,
    showCommonExtensions: true,
    supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
    tryItOutEnabled: true,
    syntaxHighlight: {
      activate: true,
      theme: 'monokai'
    }
  }
};

// Routes
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerJSDoc(options), swaggerUiOptions));
app.use("/api/auth", authRoutes);
app.use("/api/user", authMiddleware as RequestHandler, userRoutes);
app.use("/api/books", authMiddleware as RequestHandler, bookRoutes);
app.use("/api/categories", authMiddleware as RequestHandler, categoryRoutes);
app.use("/api/reviews", authMiddleware as RequestHandler, reviewRoutes);
app.use("/api/tags", authMiddleware as RequestHandler, tagRoutes);
app.use("/api/replies", replyRoutes);
app.use("/api/comments", commentRoutes);

// Health check route
app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

// Health check route
app.get("/", (req, res) => {
  res.json({ status: "OK" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
