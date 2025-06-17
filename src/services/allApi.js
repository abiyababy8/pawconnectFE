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
//get All users
export const getAllUserDetailsApi = async (reqHeader) => {
    return await commonApi("GET", `${base_url}/user/allUserDetails`, "", reqHeader)
}
//get userDetails
export const getUserDetailsApi = async (reqHeader) => {
    return await commonApi("GET", `${base_url}/user/userDetails`, "", reqHeader)
}
//edit userDetails
export const editUserApi = async (id, reqBody, reqHeader) => {
    return await commonApi('PUT', `${base_url}/user/edit/${id}`, reqBody, reqHeader)
}
// delete user
export const deleteUserApi = async (id, reqHeader) => {
    return await commonApi('PUT', `${base_url}/user/delete/${id}`, {}, reqHeader)
}
//add userPets
export const addUserPetApi = async (data, reqHeader) => {
    return await commonApi('POST', `${base_url}/user/pets`, data, reqHeader)
}
//get userPets
export const getUserPetApi = async (reqHeader) => {
    return await commonApi('GET', `${base_url}/user/pets`, "", reqHeader)
}
// get alluser pets
export const getAllPetDetailsApi = async (reqHeader) => {
    return await commonApi('GET', `${base_url}/alluser/pets`, "", reqHeader)
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
// update status of lostPets
export const updateLostPetStatusApi = async (petId, status, headers) => {
    return await commonApi("PUT", `${base_url}/lostpets/${petId}/status`, { status }, headers);
};
// delete lostPet
export const deleteLostPetApi = async (id, reqHeader) => {
    return await commonApi("DELETE", `${base_url}/lostpets/${id}`, {}, reqHeader)
}
// get my lost pets
export const getUserLostPetApi = async (reqHeader) => {
    return await commonApi('GET', `${base_url}/user-lost/pets`, "", reqHeader)
}
// add adopt pet listing
export const addAdoptPetDetailsApi = async (data, reqHeader) => {
    return await commonApi('POST', `${base_url}/adopt/pets`, data, reqHeader)
}
// get adopt pet listing
export const getAdoptPetApi = async (reqHeader) => {
    return await commonApi('GET', `${base_url}/adopt/pets`, "", reqHeader)
}
// get my adoption listing
export const getUserAdoptListApi = async (reqHeader) => {
    return await commonApi('GET', `${base_url}/user-adopt/petlist`, "", reqHeader)
}
// update status of adoption listing
export const updateAdoptListStatusApi = async (id, status, headers) => {
    return await commonApi("PUT", `${base_url}/adopt/pets/${id}/status`, { status }, headers);
};
// delete adoption listing 
export const deleteAdoptListApi = async (id, reqHeader) => {
    return await commonApi("DELETE", `${base_url}/adopt/pets/${id}`, {}, reqHeader)
}
// add adoption request
export const addAdoptRequestApi = async (data, reqHeader) => {
    return await commonApi('POST', `${base_url}/adopt/request`, data, reqHeader)
}
// get my adoption requests
export const getUserAdoptRequestApi = async (reqHeader) => {
    return await commonApi('GET', `${base_url}/user-adopt/request`, "", reqHeader)
}
//  get all adoption requests
export const getAllAdoptRequestApi = async (reqHeader) => {
    return await commonApi('GET', `${base_url}/all-adopt/request`, "", reqHeader)
}
// update status of adoption request
export const updateAdoptRequestStatusApi = async (id, status, headers) => {
    return await commonApi("PUT", `${base_url}/adopt/request/${id}/status`, { status }, headers);
};
// delete adoption request
export const deleteAdoptRequestApi = async (id, reqHeader) => {
    return await commonApi("DELETE", `${base_url}/adopt/request/${id}`, {}, reqHeader)
}