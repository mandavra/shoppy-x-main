import axios from "axios";

export default async function getEMIOptionsService(amount) {
    try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1'}/emi/options/${amount}`);
        return data;
    } catch (error) {
        console.error("Error fetching EMI options:", error);
        throw error;
    }
} 