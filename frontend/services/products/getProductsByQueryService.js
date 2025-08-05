import axios from "axios";

export default async function getProductsByQueryService(searchedQuery,searchParams){
    try {
      const {data}= await axios.get(`http://localhost:3000/api/v1/products/queryProducts/${searchedQuery}?${searchParams}`)
      return data
    } catch (err) {
        console.log(err)
        return err.response.data
    }
}