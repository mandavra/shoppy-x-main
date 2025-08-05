import axios from "axios";

export default async function deleteBannerService(id){
    try {
      const {data}= await axios.delete(`http://localhost:3000/api/v1/banners/${id}`,
        { withCredentials: true }
      )
      return data
    } catch (err) {
        console.log(err)
        throw new Error(err)
    }
}