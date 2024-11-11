import axios from "axios";
import apiUrl from "../../config/config";
import { toast } from "react-toastify";
import toastCss from "../../config/toast";

const getToken = () => {
    return window.localStorage.getItem("token");
};

class AdminPanel {
    async login(email, password) {
        try {
            const url = `${apiUrl}/panel/login`;
            const body = JSON.stringify({ email, password });
            const token = getToken();

            let response = await axios.post(url, body, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            let data = response.data;
            if (data.success) {
                window.localStorage.setItem("token", data.token);
            } else {
                toast.error(data.message, toastCss);
            }
        } catch (error) {
            toast.error("Internal server error", toastCss);
        }
    }

    async changePassword(oldPassword, newPassword, confirmPassword) {
        try {
            const url = `${apiUrl}/panel/change-password`;
            const body = JSON.stringify({ oldPassword, newPassword, confirmPassword });
            const token = getToken();

            if (token) {
                let response = await axios.post(url, body, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                let data = response.data;
                if (data.success) {
                    toast.success(data.message, toastCss);
                } else {
                    toast.error(data.message, toastCss);
                }
            } else {
                toast.error("Login to proceed", toastCss);
            }
        } catch (error) {
            toast.error("Internal server error", toastCss);
        }
    }

    async resetPassword(newPassword, confirmPassword) {
        try {
            const url = `${apiUrl}/panel/reset-password`;
            const body = JSON.stringify({ newPassword, confirmPassword });
            const token = getToken();

            if (!token) {
                let response = await axios.post(url, body, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                let data = response.data;
                if (data.success) {
                    toast.success(data.message, toastCss);
                } else {
                    toast.error(data.message, toastCss);
                }
            } else {
                toast.error("User already logged in", toastCss);
            }
        } catch (error) {
            toast.error("Internal server error", toastCss);
        }
    }

    async forgotPassword(email) {
        try {
            const url = `${apiUrl}/panel/forgot-password`;
            const body = JSON.stringify({ email });
            const token = getToken();

            let response = await axios.post(url, body, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            let data = response.data;
            if (data.success) {
                toast.success(data.message, toastCss);
            } else {
                toast.error(data.message, toastCss);
            }
        } catch (error) {
            toast.error("Internal server error", toastCss);
        }
    }

    async profile() {}

    async getCustomers(page, limit, search, sort, order) {
        let url = `${apiUrl}/panel/customers?page=${page}&limit=${limit}`;

        let response = await fetch(url, { headers: { Authorization: `Bearer ${getToken()}` } });
        let jsonData = await response.json();
        if (jsonData.success) {
            return jsonData;
        }

        toast.error(jsonData.error, toastCss);
    }
    async getCustomer(customerId) {
        let url = `${apiUrl}/panel/customers/${customerId}`;

        let response = await fetch(url, { headers: { Authorization: `Bearer ${getToken()}` } });
        let jsonData = await response.json();
        if (jsonData.success) {
            return jsonData;
        }

        toast.error(jsonData.error, toastCss);
    }

    async getOrders(page, limit, search, sort, order) {}
    async getOrder(orderId) {}

    async getTransactions() {}
    async getTransaction() {}

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

    async getRoles(page, limit, search, sort, order) {
        let url = `${apiUrl}/panel/roles`;

        let response = await fetch(url, { headers: { Authorization: `Bearer ${getToken()}` } });
        let jsonData = await response.json();
        if (jsonData.success) {
            return jsonData;
        }

        toast.error(jsonData.error, toastCss);
    }

    async getRole(roleId) {
        let url = `${apiUrl}/panel/roles/${roleId}`;

        let response = await fetch(url, { headers: { Authorization: `Bearer ${getToken()}` } });
        let jsonData = await response.json();
        if (jsonData.success) {
            return jsonData;
        }

        toast.error(jsonData.error, toastCss);
    }

    async createRole() {}
    async updateRole() {}
    async deleteRole() {}

    async getPanelUsers(page, limit, search, sort, order) {
        let url = `${apiUrl}/panel/panel-users`;

        let response = await fetch(url, { headers: { Authorization: `Bearer ${getToken()}` } });
        let jsonData = await response.json();
        if (jsonData.success) {
            return jsonData;
        }

        toast.error(jsonData.error, toastCss);
    }
    async getPanelUser(panelUserId) {
        let url = `${apiUrl}/panel/panel-users/${panelUserId}`;

        let response = await fetch(url, { headers: { Authorization: `Bearer ${getToken()}` } });
        let jsonData = await response.json();
        if (jsonData.success) {
            return jsonData;
        }

        toast.error(jsonData.error, toastCss);
    }
    async createPanelUser() {}
    async updatePanelUser() {}
    async deletePanelUser() {}

    async getReports(page, limit, search, sort, order) {}
    async getReport() {}

    async getAudits(page, limit, search, sort, order) {
        let url = `${apiUrl}/panel/audits`;

        let response = await fetch(url, { headers: { Authorization: `Bearer ${getToken()}` } });
        let jsonData = await response.json();
        if (jsonData.success) {
            return jsonData;
        }

        toast.error(jsonData.error, toastCss);
    }
    async getAudit() {}

    async logout() {}
}

const adminPanelService = new AdminPanel();

export default adminPanelService;
