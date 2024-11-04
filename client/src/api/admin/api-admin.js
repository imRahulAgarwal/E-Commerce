import axios from "axios";
import apiUrl from "../../config/config";
import { toast } from "react-toastify";
import toastCss from "../../config/toast";

const getToken = () => {
    return window.localStorage.getItem("token");
};

export async function login(email, password) {
    try {
        const url = `${apiUrl}/panel/login`;
        const body = JSON.stringify({ email, password });
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
                window.localStorage.setItem("token", data.token);
            } else {
                toast.error(data.message, toastCss);
            }
        }
    } catch (error) {
        toast.error("Internal server error", toastCss);
    }
}

export async function changePassword(oldPassword, newPassword, confirmPassword) {
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

export async function resetPassword(newPassword, confirmPassword) {
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

export async function forgotPassword(email) {
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

export async function profile() {}

export async function getCustomers(page, limit, search, sort, order) {}
export async function getCustomer(customerId) {}

export async function getOrders(page, limit, search, sort, order) {}
export async function getOrder(orderId) {}

export async function getTransactions() {}
export async function getTransaction() {}

export async function getInventory() {}
export async function updateInventory() {}

export async function getPermissions() {}

export async function getRoles(page, limit, search, sort, order) {}
export async function getRole() {}
export async function createRole() {}
export async function updateRole() {}
export async function deleteRole() {}

export async function getPanelUsers(page, limit, search, sort, order) {}
export async function getPanelUser() {}
export async function createPanelUser() {}
export async function updatePanelUser() {}
export async function deletePanelUser() {}

export async function getReports(page, limit, search, sort, order) {}
export async function getReport() {}

export async function getAudits(page, limit, search, sort, order) {}
export async function getAudit() {}

export async function logout() {}
