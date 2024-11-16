import axios from "axios";
import apiUrl from "../../config/config";
import { toast } from "react-toastify";
import toastCss from "../../config/toast";

const getToken = () => window.localStorage.getItem("token");

class AdminPanel {
    async login({ email, password }) {
        const url = `${apiUrl}/panel/login`;
        const body = JSON.stringify({ email, password });
        const token = getToken();

        let response = await fetch(url, {
            method: "POST",
            body,
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        });

        const jsonData = await response.json();
        if (jsonData.success) {
            toast.success(jsonData.message, toastCss);
            return jsonData;
        }

        toast.error(jsonData.error, toastCss);
        return false;
    }

    async changePassword({ oldPassword, newPassword, confirmPassword }) {
        const url = `${apiUrl}/panel/change-password`;
        const body = JSON.stringify({ oldPassword, newPassword, confirmPassword });
        const token = getToken();

        const response = await fetch(url, {
            method: "POST",
            body,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        const jsonData = await response.json();
        if (jsonData.success) {
            toast.success(jsonData.message, toastCss);
            return true;
        }

        toast.error(jsonData.error, toastCss);
        return false;
    }

    async forgotPassword({ email }) {
        const url = `${apiUrl}/panel/forgot-password`;
        const body = JSON.stringify({ email });
        const token = getToken();

        const response = await fetch(url, {
            method: "POST",
            body,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        const jsonData = await response.json();

        if (jsonData.success) {
            toast.success(jsonData.message, toastCss);
            return true;
        }

        toast.error(jsonData.error, toastCss);
        return false;
    }

    async resetPassword({ newPassword, confirmPassword, token }) {
        const url = `${apiUrl}/panel/reset-password/${token}`;
        const body = JSON.stringify({ newPassword, confirmPassword });

        const response = await fetch(url, {
            method: "POST",
            body,
            headers: { "Content-Type": "application/json" },
        });

        const jsonData = await response.json();
        if (jsonData.success) {
            toast.success(jsonData.message, toastCss);
            return true;
        }

        toast.error(jsonData.error, toastCss);
        return false;
    }

    async profile() {
        const url = `${apiUrl}/panel/profile`;
        const token = getToken();

        const resposne = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
        const jsonData = await resposne.json();

        if (jsonData.success) {
            return jsonData;
        }

        return false;
    }

    async getCustomers({ page, limit, search, sort, order }) {
        let url = `${apiUrl}/panel/customers?page=${page}&limit=${limit}&search=${search}&sort=${sort}&order=${order}`;

        let response = await fetch(url, { headers: { Authorization: `Bearer ${getToken()}` } });
        let jsonData = await response.json();
        if (jsonData.success) {
            return jsonData;
        }

        toast.error(jsonData.error, toastCss);
        return false;
    }

    async getCustomer(customerId) {
        let url = `${apiUrl}/panel/customers/${customerId}`;

        let response = await fetch(url, { headers: { Authorization: `Bearer ${getToken()}` } });
        let jsonData = await response.json();
        if (jsonData.success) {
            return jsonData;
        }

        toast.error(jsonData.error, toastCss);
        return false;
    }

    async getOrders({ page, limit, search, sort, order }) {
        let url = `${apiUrl}/panel/orders?page=${page}&limit=${limit}&search=${search}&sort=${sort}&order=${order}`;

        let response = await fetch(url, { headers: { Authorization: `Bearer ${getToken()}` } });
        let jsonData = await response.json();
        if (jsonData.success) {
            return jsonData;
        }

        toast.error(jsonData.error, toastCss);
        return false;
    }
    async getOrder(orderId) {}

    async getTransactions() {}
    async getTransaction() {}

    async getCategories() {
        let url = `${apiUrl}/panel/categories`;

        let response = await fetch(url, { headers: { Authorization: `Bearer ${getToken()}` } });
        let jsonData = await response.json();
        if (jsonData.success) {
            return jsonData;
        }

        toast.error(jsonData.error, toastCss);
        return false;
    }

    async getCategory(categoryId) {
        let url = `${apiUrl}/panel/categories/${categoryId}`;

        let response = await fetch(url, { headers: { Authorization: `Bearer ${getToken()}` } });
        let jsonData = await response.json();
        if (jsonData.success) {
            return jsonData;
        }

        toast.error(jsonData.error, toastCss);
        return false;
    }

    async createCategory(data) {
        let url = `${apiUrl}/panel/categories`;

        let response = await fetch(url, {
            method: "POST",
            body: JSON.stringify(data),
            headers: { Authorization: `Bearer ${getToken()}`, "Content-Type": "application/json" },
        });
        let jsonData = await response.json();
        if (jsonData.success) {
            toast.success(jsonData.message, toastCss);
            return jsonData;
        }

        toast.error(jsonData.error, toastCss);
        return false;
    }

    async updateCategory(categoryId, data) {
        let url = `${apiUrl}/panel/categories/${categoryId}`;

        let response = await fetch(url, {
            method: "PUT",
            body: JSON.stringify(data),
            headers: { Authorization: `Bearer ${getToken()}`, "Content-Type": "application/json" },
        });
        let jsonData = await response.json();
        if (jsonData.success) {
            toast.success(jsonData.message, toastCss);
            return jsonData;
        }

        toast.error(jsonData.error, toastCss);
        return false;
    }

    async deleteCategory(categoryId) {
        let url = `${apiUrl}/panel/categories/${categoryId}`;

        let response = await fetch(url, { method: "DELETE", headers: { Authorization: `Bearer ${getToken()}` } });
        let jsonData = await response.json();
        if (jsonData.success) {
            toast.success(jsonData.message, toastCss);
            return true;
        }

        toast.error(jsonData.error, toastCss);
        return false;
    }

    async getInventory() {}
    async updateInventory() {}

    async getPermissions() {
        let url = `${apiUrl}/panel/permissions`;

        let response = await fetch(url, { headers: { Authorization: `Bearer ${getToken()}` } });
        let jsonData = await response.json();
        if (jsonData.success) {
            return jsonData;
        }

        toast.error(jsonData.error, toastCss);
    }

    async getRoles() {
        let url = `${apiUrl}/panel/roles`;

        let response = await fetch(url, { headers: { Authorization: `Bearer ${getToken()}` } });
        let jsonData = await response.json();
        if (jsonData.success) {
            return jsonData;
        }

        toast.error(jsonData.error, toastCss);
        return false;
    }

    async getRole(roleId) {
        let url = `${apiUrl}/panel/roles/${roleId}`;

        let response = await fetch(url, { headers: { Authorization: `Bearer ${getToken()}` } });
        let jsonData = await response.json();
        if (jsonData.success) {
            return jsonData;
        }

        toast.error(jsonData.error, toastCss);
        return false;
    }

    async createRole(data) {
        let url = `${apiUrl}/panel/roles`;

        let response = await fetch(url, {
            method: "POST",
            body: JSON.stringify(data),
            headers: { Authorization: `Bearer ${getToken()}`, "Content-Type": "application/json" },
        });
        let jsonData = await response.json();
        if (jsonData.success) {
            toast.success(jsonData.message, toastCss);
            return jsonData;
        }

        toast.error(jsonData.error, toastCss);
        return false;
    }

    async updateRole(roleId, data) {
        let url = `${apiUrl}/panel/roles/${roleId}`;

        let response = await fetch(url, {
            method: "PUT",
            body: JSON.stringify(data),
            headers: { Authorization: `Bearer ${getToken()}`, "Content-Type": "application/json" },
        });
        let jsonData = await response.json();
        if (jsonData.success) {
            toast.success(jsonData.message, toastCss);
            return jsonData;
        }

        toast.error(jsonData.error, toastCss);
        return false;
    }

    async deleteRole(roleId) {
        let url = `${apiUrl}/panel/roles/${roleId}`;

        let response = await fetch(url, { method: "DELETE", headers: { Authorization: `Bearer ${getToken()}` } });
        let jsonData = await response.json();
        if (jsonData.success) {
            toast.success(jsonData.message, toastCss);
            return true;
        }

        toast.error(jsonData.error, toastCss);
        return false;
    }

    async getPanelUsers({ page, limit, search, sort, order }) {
        let url = `${apiUrl}/panel/panel-users?page=${page}&limit=${limit}&search=${search}&sort=${sort}&order=${order}`;

        let response = await fetch(url, { headers: { Authorization: `Bearer ${getToken()}` } });
        let jsonData = await response.json();
        if (jsonData.success) {
            return jsonData;
        }

        toast.error(jsonData.error, toastCss);
        return false;
    }

    async getPanelUser(panelUserId) {
        let url = `${apiUrl}/panel/panel-users/${panelUserId}`;

        let response = await fetch(url, { headers: { Authorization: `Bearer ${getToken()}` } });
        let jsonData = await response.json();
        if (jsonData.success) {
            return jsonData;
        }

        toast.error(jsonData.error, toastCss);
        return false;
    }

    async createPanelUser(data) {
        let url = `${apiUrl}/panel/panel-users`;

        let response = await fetch(url, {
            method: "POST",
            body: JSON.stringify(data),
            headers: { Authorization: `Bearer ${getToken()}`, "Content-Type": "application/json" },
        });
        let jsonData = await response.json();
        if (jsonData.success) {
            toast.success(jsonData.message, toastCss);
            return jsonData;
        }

        toast.error(jsonData.error, toastCss);
        return false;
    }

    async updatePanelUser(panelUserId, data) {
        let url = `${apiUrl}/panel/panel-users/${panelUserId}`;

        let response = await fetch(url, {
            method: "PUT",
            body: JSON.stringify(data),
            headers: { Authorization: `Bearer ${getToken()}`, "Content-Type": "application/json" },
        });
        let jsonData = await response.json();
        if (jsonData.success) {
            toast.success(jsonData.message, toastCss);
            return jsonData;
        }

        toast.error(jsonData.error, toastCss);
        return false;
    }

    async deletePanelUser(panelUserId) {
        let url = `${apiUrl}/panel/panel-users/${panelUserId}`;

        let response = await fetch(url, { method: "DELETE", headers: { Authorization: `Bearer ${getToken()}` } });
        let jsonData = await response.json();
        if (jsonData.success) {
            toast.success(jsonData.message, toastCss);
            return true;
        }

        toast.error(jsonData.error, toastCss);
        return false;
    }

    async getReports(page, limit, search, sort, order) {}
    async getReport() {}

    async getAudits({ page, limit, search, sort, order }) {
        let url = `${apiUrl}/panel/audits?page=${page}&limit=${limit}&search=${search}&sort=${sort}&order=${order}`;

        let response = await fetch(url, { headers: { Authorization: `Bearer ${getToken()}` } });
        let jsonData = await response.json();
        if (jsonData.success) {
            return jsonData;
        }

        toast.error(jsonData.error, toastCss);
        return false;
    }

    async getAudit(auditId) {
        const url = `${apiUrl}/panel/audits/${auditId}`;
        const token = getToken();

        const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
        const jsonData = await response.json();
        if (jsonData.success) {
            return jsonData;
        }

        toast.error(jsonData.error, toastCss);
        return false;
    }

    async logout() {
        const url = `${apiUrl}/panel/logout`;
        const token = getToken();

        const response = await fetch(url, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
        const jsonData = await response.json();
        if (jsonData.success) {
            return jsonData;
        }

        toast.error(jsonData.error, toastCss);
        return false;
    }

    async getProducts({ page, limit, search, sort, order }) {
        let url = `${apiUrl}/panel/products?page=${page}&limit=${limit}&search=${search}&sort=${sort}&order=${order}`;

        let response = await fetch(url, { headers: { Authorization: `Bearer ${getToken()}` } });
        let jsonData = await response.json();
        if (jsonData.success) {
            return jsonData;
        }

        toast.error(jsonData.error, toastCss);
        return false;
    }

    async getProduct(productId) {
        let url = `${apiUrl}/panel/products/${productId}`;

        let response = await fetch(url, { headers: { Authorization: `Bearer ${getToken()}` } });
        let jsonData = await response.json();
        if (jsonData.success) {
            return jsonData;
        }

        toast.error(jsonData.error, toastCss);
        return false;
    }

    async createProduct(data) {
        let url = `${apiUrl}/panel/products`;

        let response = await fetch(url, {
            method: "POST",
            body: JSON.stringify(data),
            headers: { Authorization: `Bearer ${getToken()}`, "Content-Type": "application/json" },
        });
        let jsonData = await response.json();
        if (jsonData.success) {
            toast.success(jsonData.message, toastCss);
            return jsonData;
        }

        toast.error(jsonData.error, toastCss);
        return false;
    }

    async updateProduct(productId, data) {
        let url = `${apiUrl}/panel/products/${productId}`;

        let response = await fetch(url, {
            method: "PUT",
            body: JSON.stringify(data),
            headers: { Authorization: `Bearer ${getToken()}`, "Content-Type": "application/json" },
        });
        let jsonData = await response.json();
        if (jsonData.success) {
            toast.success(jsonData.message, toastCss);
            return jsonData;
        }

        toast.error(jsonData.error, toastCss);
        return false;
    }

    async deleteProduct(productId) {
        let url = `${apiUrl}/panel/products/${productId}`;

        let response = await fetch(url, { method: "DELETE", headers: { Authorization: `Bearer ${getToken()}` } });
        let jsonData = await response.json();
        if (jsonData.success) {
            toast.success(jsonData.message, toastCss);
            return true;
        }

        toast.error(jsonData.error, toastCss);
        return false;
    }

    async createProductColour(productId, data) {
        const url = `${apiUrl}/panel/product/colours?productId=${productId}`;
        const response = await fetch(url, {
            method: "POST",
            body: data,
            headers: { Authorization: `Bearer ${getToken()}` },
        });

        const jsonData = await response.json();
        if (jsonData.success) {
            toast.success(jsonData.message, toastCss);
            return true;
        }

        toast.error(jsonData.error, toastCss);
        return false;
    }

    async updateProductColour(productId, productColourId, data) {
        const url = `${apiUrl}/panel/product/colours/${productColourId}?productId=${productId}`;
        const response = await fetch(url, {
            method: "PUT",
            body: data,
            headers: { Authorization: `Bearer ${getToken()}` },
        });

        const jsonData = await response.json();
        if (jsonData.success) {
            toast.success(jsonData.message, toastCss);
            return true;
        }

        toast.error(jsonData.error, toastCss);
        return false;
    }

    async deleteProductColour(productColourId) {
        const url = `${apiUrl}/panel/product/colours/${productColourId}`;
        const response = await fetch(url, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${getToken()}` },
        });

        const jsonData = await response.json();
        if (jsonData.success) {
            toast.success(jsonData.message, toastCss);
            return true;
        }

        toast.error(jsonData.error, toastCss);
        return false;
    }

    async createProductSize(productId, colourId, data) {
        const url = `${apiUrl}/panel/product/sizes?productId=${productId}&productColourId=${colourId}`;
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify(data),
            headers: { Authorization: `Bearer ${getToken()}`, "Content-Type": "application/json" },
        });

        const jsonData = await response.json();
        if (jsonData.success) {
            toast.success(jsonData.message, toastCss);
            return jsonData;
        }

        toast.error(jsonData.error, toastCss);
        return false;
    }

    async updateProductSize(productSizeId, productId, colourId, data) {
        const url = `${apiUrl}/panel/product/sizes/${productSizeId}?productId=${productId}&productColourId=${colourId}`;
        const response = await fetch(url, {
            method: "PUT",
            body: JSON.stringify(data),
            headers: { Authorization: `Bearer ${getToken()}`, "Content-Type": "application/json" },
        });

        const jsonData = await response.json();

        if (jsonData.success) {
            toast.success(jsonData.message, toastCss);
            return jsonData;
        }

        toast.error(jsonData.error, toastCss);
        return false;
    }

    async orderReports(type) {
        const url = `${apiUrl}/panel/reports/orders?type=${type}`;
        const response = await fetch(url, {
            headers: { Authorization: `Bearer ${getToken()}` },
        });

        const jsonData = await response.json();

        if (jsonData.success) {
            toast.success(jsonData.message, toastCss);
            return jsonData;
        }

        toast.error(jsonData.error, toastCss);
        return false;
    }

    async revenueReports(type) {
        const url = `${apiUrl}/panel/reports/revenue?type=${type}`;
        const response = await fetch(url, {
            headers: { Authorization: `Bearer ${getToken()}` },
        });

        const jsonData = await response.json();

        if (jsonData.success) {
            toast.success(jsonData.message, toastCss);
            return jsonData;
        }

        toast.error(jsonData.error, toastCss);
        return false;
    }

    async customerReports(type) {
        const url = `${apiUrl}/panel/reports/customers?type=${type}`;
        const response = await fetch(url, {
            headers: { Authorization: `Bearer ${getToken()}` },
        });

        const jsonData = await response.json();

        if (jsonData.success) {
            toast.success(jsonData.message, toastCss);
            return jsonData;
        }

        toast.error(jsonData.error, toastCss);
        return false;
    }
}

const adminPanelService = new AdminPanel();

export default adminPanelService;
