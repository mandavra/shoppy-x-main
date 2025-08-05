import axios from "axios";

export default async function getAllOrdersService(){
    try {
      const {data} = await axios.get(`http://localhost:3000/api/v1/orders/getAll`)
      return data
    } catch (err) {
        console.log(err.response)
        return err.response
    }
}