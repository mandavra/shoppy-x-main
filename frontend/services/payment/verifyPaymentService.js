import axios from "axios";

export default async function verifyPaymentService(paymentId){
    try {
      const {data} = await axios.get(`http://localhost:3000/api/v1/payments/payment-status?paymentId=${paymentId}`,
        {
            withCredentials:true
        }
      )
      return data
    } catch (err) {
      console.error("Payment verification error:", err)
      throw err
    }
}