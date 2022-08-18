import {API} from "../../backend";
import Branch from "../ManageBranch";

export const getBranch = (userId, token,branchId) => {
    return fetch(`${API}/get-branch/${userId}/${branchId}`,{
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
};

export const getBranchByUser=(userId,token)=>{
    return fetch(`${API}/get-branch-by-user/${userId}`,{
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
};


export const createBranch=(userId,token,gymId,branch)=>{
    return fetch(`${API}/create-branch/${userId}/${gymId}`,{
        method: "POST",
        headers:{
          Accept: "application/json",
          "Content-type":"application/json",
          Authorization: `Bearer ${token}`
      },
      body:JSON.stringify(branch)
    })
    .then(response => {
        return response.json();
    })
    .catch(err => console.log(err));
};


export const updateBranch=(userId,token,branchId,branch)=>{
    return fetch(`${API}/update-branch/${userId}/${branchId}`,{
        method: "PUT",
        headers:{
          Accept: "application/json",
          "Content-type":"application/json",
          Authorization: `Bearer ${token}`
      },
      body:JSON.stringify(branch)
    })
    .then(response => {
        return response.json();
    })
    .catch(err => console.log(err));
};


export const getAllActiveBranch=(userId,token,gymId,page,limit)=>{
    return fetch(`${API}/get-all-active-branch/${userId}/${gymId}?limit=${limit}&page=${page}`,{
        method: "GET",
        headers:{
          Accept:"application/json",
          Authorization: `Bearer ${token}`
      },
    })
    .then(response => {
        return response.json();
    })
    .catch(err => console.log(err));
};

export const getAllInActiveBranch=(userId,token,gymId,page,limit)=>{
    return fetch(`${API}/get-all-inactive-branch/${userId}/${gymId}?limit=${limit}&page=${page}`,{
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
};


export const activeInactiveBranchOperation=(userId,token,branchId,branch)=>{
    return fetch(`${API}/block-op-branch/${userId}/${branchId}`,{
        method: "POST",
        headers:{
          Accept: "application/json",
          "Content-type":"application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(branch)
    }).then(response=>{
        return response.json();
    }).catch(err=>console.log(err));
};




export const totalActiveBranchPage=(userId,token,gymId,limit)=>{

    return fetch(`${API}/total-page-active-branch/${userId}/${gymId}?limit=${limit}`,{
        method: "GET",
        headers:{
          Accept: "application/json",
          Authorization: `Bearer ${token}`
        }
    }).then(response=>{
        return response.json();
    }).catch(err=>console.log(err));

};


export const totalInActiveBranchPage=(userId,token,gymId,limit)=>{
    return fetch(`${API}/total-page-inactive-branch/${userId}/${gymId}?limit=${limit}`,{
        method:'GET',
        headers:{
            Accept:"application/json",
            Authorization:`Bearer ${token}`
        }
    }).then(response=>{
        return response.json();
    }).catch(err=>console.log(err));
}

export const chcekBranchStaus=(userId,token,gymId,data)=>{
    return fetch(`${API}/find-branch/status/${userId}/${gymId}?field=${data["field"]}&value=${data['value']}`,{
        method:'get',
        headers:{
            Accept:"application/json",
            Authorization:`bearer ${token}`
        }
    }).then(response=>response.json()).catch(err=>console.log(err));
}



export const getAllBranch=(userId,token,data)=>{
    return fetch(`${API}/get/branchs/${userId}?active=${data['active']}`,{
        method:'GET',
        headers:{
            Accept:"application/json",
            Authorization:`Bearer ${token}`
        }
    }).then(response=>{
        return response.json();
    }).catch(err=>console.log(err));
}