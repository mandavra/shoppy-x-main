import axios from "axios"
export default async function getCouponByNameService(couponName){
    try {
      const {data} = await axios.get(`http://localhost:3000/api/v1/coupons/get/${couponName}`)
      return data
    } catch (err) {
        console.log(err)
        return err.response.data
    }
}