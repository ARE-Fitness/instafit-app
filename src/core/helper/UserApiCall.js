import {API} from "../../backend";

export const getUser = (userId, token) => {
    return fetch(`${API}/get-user/${userId}`,{
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

  export const getUserFromDbAdmin=(userId)=>{
    return fetch(`${API}/get-user-db909-admin-6a676fg/${userId}`,{
      method: "GET",
      headers:{
        Accept: "application/json"
    },
  })
  .then(response => {
      return response.json();
  })
  .catch(err => console.log(err));
  }