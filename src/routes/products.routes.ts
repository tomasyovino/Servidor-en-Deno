import { Router } from "../../deps.ts";
import {
  findAll,
  findProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../handlers/products.handler.ts";

export const router = new Router()
  .get("/api/products", findAll)
  .get("/api/products/:id", findProduct)
  .post("/api/products", createProduct)
  .put("/api/products/:id", updateProduct)
  .delete("/api/products/:id", deleteProduct);
