import { base_url } from "./base_url"
import { commonApi } from "./commonApi"

//register user
export const registerApi = async (userData) => {
    return await commonApi("POST", `${base_url}/user/register`, userData, "")
}
//login user
export const loginApi = async (data) => {
    return await commonApi("POST", `${base_url}/user/login`, data, "")
}
//get userDetails
export const getUserDetailsApi = async (reqHeader) => {
    return await commonApi("GET", `${base_url}/user/userDetails`, "", reqHeader)
}
//get userPets
export const addUserPetApi = async (data, reqHeader) => {
    return await commonApi('POST', `${base_url}/user/pets`, data, reqHeader)
}