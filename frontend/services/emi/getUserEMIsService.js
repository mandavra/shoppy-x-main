import axios from "axios";

export default async function getUserEMIsService() {
    try {
        const { data } = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1'}/emi/user`,
            { withCredentials: true }
        );
        return data;
    } catch (error) {
        console.error("Error fetching user EMIs:", error);
        throw error;
    }
} 