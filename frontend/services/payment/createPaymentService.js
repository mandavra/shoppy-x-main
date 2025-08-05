import axios from "axios";

export default async function createPaymentService(orderData){
    try {
      const {data} = await axios.post(`http://localhost:3000/api/v1/payments/create-payment-session`,
        orderData,
        {
            withCredentials:true
        }
      )
      return data
    } catch (err) {
        console.log(err)
    }
}

export async function processPaymentService(paymentData){
    try {
      const {data} = await axios.post(`http://localhost:3000/api/v1/payments/process-payment`,
        paymentData,
        {
            withCredentials:true
        }
      )
      return data
    } catch (err) {
        console.log(err)
    }
}

export async function getPaymentStatusService(paymentId){
    try {
      const {data} = await axios.get(`http://localhost:3000/api/v1/payments/payment-status?paymentId=${paymentId}`,
        {
            withCredentials:true
        }
      )
      return data
    } catch (err) {
        console.log(err)
    }
}