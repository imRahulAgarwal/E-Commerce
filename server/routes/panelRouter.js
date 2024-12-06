import express from "express";
import * as panelController from "../controllers/panelController.js"; // Importing all controller functions
import {
    checkPermission,
    isPanelUserAuthenticated,
    isPanelUserNotAuthenticated,
} from "../middlewares/authMiddleware.js";

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
panelRouter.get("/customers", checkPermission("manage_customer"), panelController.getCustomers);
panelRouter.get("/customers/:customerId", checkPermission("manage_customer"), panelController.getCustomerById);
panelRouter.post("/customers", checkPermission("manage_customer"), panelController.createCustomer);

// Order Management
panelRouter.get("/orders", checkPermission("manage_order"), panelController.getOrders);
panelRouter.get("/orders/:orderId", checkPermission("manage_order"), panelController.getOrderById);

// Category Management
panelRouter.get("/categories", checkPermission("manage_product"), panelController.getCategories);
panelRouter.get("/categories/:categoryId", checkPermission("manage_product"), panelController.getCategory);
panelRouter.post("/categories", checkPermission("manage_product"), panelController.createCategory);
panelRouter.put("/categories/:categoryId", checkPermission("manage_product"), panelController.udpateCategory);
panelRouter.delete("/categories/:categoryId", checkPermission("manage_product"), panelController.deleteCategory);

// Product Management
panelRouter.get("/products", checkPermission("manage_product"), panelController.getProducts);
panelRouter.get("/products/:productId", checkPermission("manage_product"), panelController.getProductById);
panelRouter.post("/products", checkPermission("manage_product"), panelController.createProduct);
panelRouter.put("/products/:productId", checkPermission("manage_product"), panelController.updateProduct);
panelRouter.delete("/products/:productId", checkPermission("manage_product"), panelController.deleteProduct);

// Product Colour Management
panelRouter.get("/product/colours", checkPermission("manage_product"), panelController.getProductColours);
panelRouter.get("/product/colours/:colourId", checkPermission("manage_product"), panelController.getProductColourById);
panelRouter.post("/product/colours", checkPermission("manage_product"), panelController.createProductColour);
panelRouter.put("/product/colours/:colourId", checkPermission("manage_product"), panelController.updateProductColour);
panelRouter.delete(
    "/product/colours/:colourId",
    checkPermission("manage_product"),
    panelController.deleteProductColour
);

// Product Size Management
panelRouter.get("/product/sizes", checkPermission("manage_product"), panelController.getProductSizes);
panelRouter.get("/product/sizes/:sizeId", checkPermission("manage_product"), panelController.getProductSizeById);
panelRouter.post("/product/sizes", checkPermission("manage_product"), panelController.createProductSize);
panelRouter.put("/product/sizes/:sizeId", checkPermission("manage_product"), panelController.updateProductSize);

// Audit Management
panelRouter.get("/audits", checkPermission("manage_audit"), panelController.getAudits);
panelRouter.get("/audits/:auditId", checkPermission("manage_audit"), panelController.getAuditById);

panelRouter.get("/permissions", panelController.getPermissions);

// Role Management
panelRouter.get("/roles", checkPermission("manage_role"), panelController.getRoles);
panelRouter.get("/roles/:roleId", checkPermission("manage_role"), panelController.getRoleById);
panelRouter.post("/roles", checkPermission("manage_role"), panelController.createRole);
panelRouter.put("/roles/:roleId", checkPermission("manage_role"), panelController.updateRole);
panelRouter.delete("/roles/:roleId", checkPermission("manage_role"), panelController.deleteRole);

// Panel User Management
panelRouter.get("/panel-users", checkPermission("manage_panel_user"), panelController.getPanelUsers);
panelRouter.get("/panel-users/:panelUserId", checkPermission("manage_panel_user"), panelController.getPanelUserById);
panelRouter.post("/panel-users", checkPermission("manage_panel_user"), panelController.createPanelUser);
panelRouter.put("/panel-users/:panelUserId", checkPermission("manage_panel_user"), panelController.updatePanelUser);
panelRouter.delete("/panel-users/:panelUserId", checkPermission("manage_panel_user"), panelController.deletePanelUser);

panelRouter.get("/reports/orders", checkPermission("manage_report"), panelController.getOrderReports);
panelRouter.get("/reports/revenue", checkPermission("manage_report"), panelController.getRevenueReports);
panelRouter.get("/reports/customers", checkPermission("manage_report"), panelController.getCustomerReports);

// Contact Us Query Management
panelRouter.get("/contact-us", checkPermission("manage_query"), panelController.getContactUsQueries);

// Logout
panelRouter.post("/logout", panelController.logout);

export default panelRouter;
