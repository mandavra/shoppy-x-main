import axios from "axios";

export default async function updateOrderService(id,formData){
    try {
      const {data} = await axios.patch(`http://localhost:3000/api/v1/orders/${id}`,
        formData,
        {
            withCredentials:true,
            headers:{
                "Content-Type":"application/json"
            }
        }
      )
      return data
    } catch (err) {
        console.log(err.response)
        return err.response
    }
}