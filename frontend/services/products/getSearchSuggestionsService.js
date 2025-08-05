import axios from "axios";

export default async function getSearchSuggestionsService(query,page){
    try {
      const {data}= await axios.get(`http://localhost:3000/api/v1/products/searchSuggestions?query=${query}&page=${page}`)
      return data
    } catch (err) {
        console.log(err)
        return err.response.data
    }
}