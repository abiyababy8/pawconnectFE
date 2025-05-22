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
export const getUserPetApi = async (reqHeader) => {
    return await commonApi('GET', `${base_url}/user/pets`, "", reqHeader)
}
//update userPets
export const editUserPetApi = async (id, reqBody, reqHeader) => {
    return await commonApi('PUT', `${base_url}/user/pets/${id}`, reqBody, reqHeader)
}
// delete userPets
export const deleteUserPetApi = async (id, reqHeader) => {
    return await commonApi('DELETE', `${base_url}/user/pets/${id}`, {}, reqHeader)
}
// add lostPets
export const addLostPetApi = async (data, reqHeader) => {
    return await commonApi('POST', `${base_url}/lost/pets`, data, reqHeader)
}
//get lostPets
export const getLostPetApi = async (reqHeader) => {
    return await commonApi('GET', `${base_url}/lost/pets`, "", reqHeader)
}
// update location of lostPets
export const updateLostPetLocationApi = async (petId, location, headers) => {
    return await commonApi("PUT", `${base_url}/lostpets/${petId}/location`, { location }, headers);
};
// add adopt pet listing
export const addAdoptPetDetailsApi = async (data, reqHeader) => {
    return await commonApi('POST', `${base_url}/adopt/pets`, data, reqHeader)
}
// get adopt pet listing
export const getAdoptPetApi = async (reqHeader) => {
    return await commonApi('GET', `${base_url}/adopt/pets`,"", reqHeader)
}
// add adoption request
export const addAdoptRequestApi=async(data,reqHeader)=>{
    return await commonApi('POST',`${base_url}/adopt/request`,data,reqHeader)
}