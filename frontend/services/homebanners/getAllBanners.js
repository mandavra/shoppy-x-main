import axios from "axios";

export default async function getAllBanners(){
    try {
      const {data}= await axios.get(`http://localhost:3000/api/v1/banners/getAll`,
        { withCredentials: true }
      )
      return data
    } catch (err) {
        console.log(err)
        throw new Error(err)
    }
}