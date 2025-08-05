import axios from "axios";

export default async function createEMIPaymentService(emiData) {
    try {
        const { data } = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1'}/emi/create`,
            emiData,
            { withCredentials: true }
        );
        return data;
    } catch (error) {
        console.error("Error creating EMI payment:", error);
        throw error;
    }
} 