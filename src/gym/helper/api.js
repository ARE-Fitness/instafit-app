import {API} from "../../backend";


export const getGym = (userId, token,gymId) => {
    return fetch(`${API}/gym-get/${userId}/${gymId}`,{
        method: "GET",
        headers:{
          Accept: "application/json",
          Authorization: `Bearer ${token}`
      },
    })
    .then(response => {
        return response.json();
    })
    .catch(err => console.log(err));
}



export const registerGym=(userId,token,gym)=>{
    return fetch(`${API}/register-gym/${userId}`,{
        method: "POST",
        headers:{
          Accept: "application/json",
          Authorization: `Bearer ${token}`
      },
      body:gym
    })
    .then(response => {
        return response.json();
    })
    .catch(err => console.log(err));
}


export const updateGym=(userId,token,gymId,gym)=>{
    return fetch(`${API}/update-gym/${userId}/${gymId}`,{
        method: "PUT",
        headers:{
          Accept: "application/json",
          Authorization: `Bearer ${token}`
      },
      body:gym
    })
    .then(response => {
        return response.json();
    })
    .catch(err => console.log(err));
}



export const assignGymAdmin=(userId,token,gymId,user)=>{
    return fetch(`${API}/insft-create-gym-admin/${userId}/${gymId}`,{
        method: "POST",
        headers:{
          Accept: "application/json",
          "Content-type":"application/json",
          Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(user)
    })
    .then(response => {
        return response.json();
    })
    .catch(err => console.log(err));   
}


export const removeGymAdmin=(userId,token,gymId)=>{
    return fetch(`${API}/insft-remove-gym-admin/${userId}/${gymId}`,{
        method: "DELETE",
        headers:{
          Accept: "application/json",
          Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
        return response.json();
    })
    .catch(err => console.log(err));   
}


export const getAllActiveGym=(userId,token,page,limit)=>{
    return fetch(`${API}/get-all-gym-active/${userId}?page=${page}&limit=${limit}`,{
        method: "GET",
        headers:{
          Accept: "application/json",
          Authorization: `Bearer ${token}`
      },
    })
    .then(response => {
        return response.json();
    })
    .catch(err => console.log(err));
}

export const getAllInActiveGym=(userId,token,page,limit)=>{
    return fetch(`${API}/get-all-gym-inactive/${userId}?page=${page}&limit=${limit}`,{
        method: "GET",
        headers:{
          Accept: "application/json",
          Authorization: `Bearer ${token}`
      },
    })
    .then(response => {
        return response.json();
    })
    .catch(err => console.log(err));
}


export const totalActiveGym = (userId, token,limit) => {
    return fetch(`${API}/get-total-page-active-gym/${userId}?limit=${limit}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`
        }
    })
    .then(response => {
        return response.json();
    })
    .catch(err => console.log(err));
}



export const blockOpGym=(userId,token,gymId,gym)=>{
    return fetch(`${API}/block-gym-op/${userId}/${gymId}`,{
        method: "POST",
        headers:{
          Accept: "application/json",
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`
      },
      body:JSON.stringify(gym)
    })
    .then(response => {
        return response.json();
    })
    .catch(err => console.log(err));    
};


export const totalInActiveGym = (userId, token,limit) => {
    return fetch(`${API}/get-total-page-inactive-gym/${userId}?limit=${limit}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`
        }
    })
    .then(response => {
        return response.json();
    })
    .catch(err => console.log(err));
}

export const gettotalMembers=(userId,token,gymId)=>{
    return fetch(`${API}/get/total/lists/${userId}/${gymId}`, {
        method:'GET',
        headers:{
            Accept:'application/json',
            Authorization:`Bearer ${token}`
        }
    }).then(response=>response.json()).catch(err=>console.log(err))
}


export const checkGymStatus=(userId,token,data)=>{
    return fetch(`${API}/find-gym/status/${userId}?field=${data["field"]}&value=${data['value']}`,{
        method:'get',
        headers:{
            Accept:"application/json",
            Authorization:`bearer ${token}`
        }
    }).then(response=>response.json()).catch(err=>console.log(err));
}