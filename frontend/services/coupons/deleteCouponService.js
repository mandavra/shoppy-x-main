import axios from "axios"
export default async function deleteCouponService(id){
    try {
      const {data} = await axios.delete(`http://localhost:3000/api/v1/coupons/${id}`)
      return data
    } catch (err) {
        console.log(err)
    }
}