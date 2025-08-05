import axios from "axios";

export default async function getOrdersByOrderIdService(id){
    try {
      const {data} = await axios.get(`http://localhost:3000/api/v1/orders/${id}`,
        {
            withCredentials:true
        }
      )
      return data
    } catch (err) {
        console.log(err.response)
        return err.response
    }
}