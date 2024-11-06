// routes/panelRoutes.js

import express from "express";
import * as panelController from "../controllers/panelController.js"; // Importing all controller functions
import { isPanelUserAuthenticated, isPanelUserNotAuthenticated } from "../middlewares/authMiddleware.js";

const panelRouter = express.Router();

// Authentication and Password Reset
panelRouter.post("/login", isPanelUserNotAuthenticated, panelController.login);
panelRouter.post("/forgot-password", isPanelUserNotAuthenticated, panelController.forgotPassword);
panelRouter.post("/reset-password/:token", isPanelUserNotAuthenticated, panelController.resetPassword);

panelRouter.use(isPanelUserAuthenticated);

// Profile and Password Management
panelRouter.get("/profile", panelController.getProfile);
panelRouter.post("/change-password", panelController.changePassword);

// Dashboard
panelRouter.get("/dashboard", panelController.getDashboard);

// Customer Management
panelRouter.get("/customers", panelController.getCustomers);
panelRouter.get("/customers/:customerId", panelController.getCustomerById);
panelRouter.post("/customers", panelController.createCustomer);

// Order Management
panelRouter.get("/orders", panelController.getOrders);
panelRouter.get("/orders/:orderId", panelController.getOrderById);

// Product Management
panelRouter.get("/products", panelController.getProducts);
panelRouter.get("/products/:productId", panelController.getProductById);
panelRouter.post("/products", panelController.createProduct);
panelRouter.patch("/products/:productId/toggle-active", panelController.toggleProductActiveStatus);
panelRouter.put("/products/:productId", panelController.updateProduct);
panelRouter.delete("/products/:productId", panelController.deleteProduct);

// Product Colour Management
panelRouter.get("/product/colours", panelController.getProductColours);
panelRouter.get("/product/colours/:colourId", panelController.getProductColourById);
panelRouter.post("/product/colours", panelController.createProductColour);
panelRouter.put("/product/colours/:colourId", panelController.updateProductColour);
panelRouter.delete("/product/colours/:colourId", panelController.deleteProductColour);

// Product Size Management
panelRouter.get("/product/sizes", panelController.getProductSizes);
panelRouter.get("/product/sizes/:sizeId", panelController.getProductSizeById);
panelRouter.post("/product/sizes", panelController.createProductSize);
panelRouter.patch("/product/sizes/:sizeId", panelController.toggleProductSizeActiveStatus);
panelRouter.put("/product/sizes/:sizeId", panelController.updateProductSize);

// Inventory Management
panelRouter.patch("/product/stock/:sizeId", panelController.updateProductStock);
panelRouter.patch("/product/price/:productId", panelController.updateProductPrice);

// Audit Management
panelRouter.get("/audits", panelController.getAudits);
panelRouter.get("/audits/:auditId", panelController.getAuditById);

panelRouter.get("/permissions", panelController.getPermissions);

// Role Management
panelRouter.get("/roles", panelController.getRoles);
panelRouter.get("/roles/:roleId", panelController.getRoleById);
panelRouter.post("/roles", panelController.createRole);
panelRouter.put("/roles/:roleId", panelController.updateRole);
panelRouter.delete("/roles/:roleId", panelController.deleteRole);

// Panel User Management
panelRouter.get("/panel-users", panelController.getPanelUsers);
panelRouter.get("/panel-users/:panelUserId", panelController.getPanelUserById);
panelRouter.post("/panel-users", panelController.createPanelUser);
panelRouter.put("/panel-users/:panelUserId", panelController.updatePanelUser);
panelRouter.delete("/panel-users/:panelUserId", panelController.deletePanelUser);

// Logout
panelRouter.post("/logout", panelController.logout);

export default panelRouter;
