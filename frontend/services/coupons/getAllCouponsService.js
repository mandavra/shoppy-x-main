import axios from "axios"
export default async function getAllCouponsService(){
    try {
      const {data} = await axios.get(`http://localhost:3000/api/v1/coupons/getAll`)
      return data
    } catch (err) {
        console.log(err)
    }
}