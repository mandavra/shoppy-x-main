import checkLogin from "../services/users/checkLogin.js";

export default async function checkUserLogin(){
    const data = await checkLogin()
    return data.data
}