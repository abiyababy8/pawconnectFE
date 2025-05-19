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
//add userPets
export const addUserPetApi = async (data, reqHeader) => {
    return await commonApi('POST', `${base_url}/user/pets`, data, reqHeader)
}
//get userPets
export const getUserPetApi=async(reqHeader)=>{
    return await commonApi('GET',`${base_url}/user/pets`,"",reqHeader)
}
//update userPets
export const editUserPetApi=async(id,reqBody,reqHeader)=>{
    return await commonApi('PUT',`${base_url}/user/pets/${id}`,reqBody,reqHeader)
}
// add lostPets
export const addLostPetApi = async (data, reqHeader) => {
    return await commonApi('POST', `${base_url}/lost/pets`, data, reqHeader)
}