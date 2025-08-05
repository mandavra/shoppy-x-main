import axios from "axios";

export default async function getUserOrdersService(){
    try {
      const {data} = await axios.get(`http://localhost:3000/api/v1/orders/getUserOrders`,
        {
            withCredentials:true
        }
      )
      return data
    } catch (err) {
        console.log(err.response)
    }
}