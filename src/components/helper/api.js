import {API} from "../../backend";

// Exercise API's //


// Create Exercise Type
export const assignExerciseType=(userId,token,gymId,etype)=>{
    return fetch(`${API}/gym-user-add-extype/${userId}/${gymId}`,{
        method: "POST",
        headers:{
          Accept: "application/json",
          "Content-type":"application/json",
          Authorization: `Bearer ${token}`
      },
      body:JSON.stringify(etype)
    })
    .then(response => {
        return response.json();
    })
    .catch(err => console.log(err));   
}

// Delete Exercise Type
export const popExerciseType=(userId,token,gymId,etype)=>{
    return fetch(`${API}/gym-user-pop-extype/${userId}/${gymId}`,{
        method: "POST",
        headers:{
          Accept: "application/json",
          "Content-type":"application/json",
          Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(etype)
    })
    .then(response => {
        return response.json();
    })
    .catch(err => console.log(err));   
}

// Create Exercise Lable
export const assignExerciseLable=(userId,token,gymId,elable)=>{
    return fetch(`${API}/gym-user-add-exlable/${userId}/${gymId}`,{
        method: "POST",
        headers:{
          Accept: "application/json",
          "Content-type":"application/json",
          Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(elable)
    })
    .then(response => {
        return response.json();
    })
    .catch(err => console.log(err));   
}

// Delete Exercise Lable
export const popExerciseLable=(userId,token,gymId,elable)=>{
    return fetch(`${API}/gym-user-pop-exlable/${userId}/${gymId}`,{
        method: "POST",
        headers:{
          Accept: "application/json",
          "Content-type":"application/json",
          Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(elable)
    })
    .then(response => {
        return response.json();
    })
    .catch(err => console.log(err));   
}

// Create Exercise Target Muscle
export const assignExerciseTargetMuscl=(userId,token,gymId,emuscl)=>{
    return fetch(`${API}/gym-user-add-exmuscl/${userId}/${gymId}`,{
        method: "POST",
        headers:{
          Accept: "application/json",
          "Content-type":"application/json",
          Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(emuscl)
    })
    .then(response => {
        return response.json();
    })
    .catch(err => console.log(err));   
}

// Delete Exercise Target Muscle
export const popExerciseTargetMuscl=(userId,token,gymId,emuscl)=>{
    return fetch(`${API}/gym-user-pop-exmuscl/${userId}/${gymId}`,{
        method: "POST",
        headers:{
          Accept: "application/json",
          "Content-type":"application/json",
          Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(emuscl)
    })
    .then(response => {
        return response.json();
    })
    .catch(err => console.log(err));   
}



// Content API's //


// Create Content
export const createContent=(userId,token,gymId,content)=>{
    return fetch(`${API}/user-gym-content-create/${userId}/${gymId}`,{
        method: "POST",
        headers:{
          Accept: "application/json",
          "Content-type":"application/json",
          Authorization: `Bearer ${token}`
      },
      body:JSON.stringify(content)
    })
    .then(response => {
        return response.json();
    })
    .catch(err => console.log(err));
}

// Get Content
export const getContent=(userId,token,contentId)=>{
    return fetch(`${API}/user-gym-get-content/${userId}/${contentId}`,{
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

// Get All Active Content
export const getAllActiveContent=(userId,token,gymId)=>{
    return fetch(`${API}/user-gym-get-all-active-contents/${userId}/${gymId}`,{
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

// Update Content
export const updateContent=(userId,token,contentId,content)=>{
    return fetch(`${API}/user-gym-content-update/${userId}/${contentId}`,{
        method: "PUT",
        headers:{
          Accept: "application/json",
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`
      },
      body:JSON.stringify(content)
    })
    .then(response => {
        return response.json();
    })
    .catch(err => console.log(err));
}

// Block Content
export const blockOpContent=(userId,token,contentId,content)=>{
    return fetch(`${API}/block-content-op/${userId}/${contentId}`,{
        method: "POST",
        headers:{
          Accept: "application/json",
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`
      },
      body:JSON.stringify(content)
    })
    .then(response => {
        return response.json();
    })
    .catch(err => console.log(err));    
};

// Test List //

//TODO: change api call format

export const getAllMeasurementTestGym=(userId,token,gymId,limit,page)=>{

    return fetch(`${API}/get-all-measurement-test-by-gym/${userId}/${gymId}?limit=${limit}&page=${page}`,{
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

export const getAllFitnessTestGym=(userId,token,gymId,limit,page)=>{

    return fetch(`${API}/get-all-fitness-test-by-gym/${userId}/${gymId}?limit=${limit}&page=${page}`,{
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


export const addTestToGym=(userId,token,gymId,test)=>{
    return fetch(`${API}/add-test-to-gym/${userId}/${gymId}`,{
        method: "POST",
        headers:{
          Accept: "application/json",
          "Content-type":"application/json",
          Authorization: `Bearer ${token}`
      },
      body:JSON.stringify(test)
    })
    .then(response => {
        return response.json();
    })
    .catch(err => console.log(err));
}

export const popTestFromGym=(userId,token,gymId,testId)=>{
    return fetch(`${API}/remove-test-from-gym/${userId}/${gymId}/${testId}`,{
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
};

export const totalPageGymTest=(userId,token,gymId,limit,testtype)=>{

    return fetch(`${API}/total-page-test-of-gym/${userId}/${gymId}?limit=${limit}&testtype=${testtype}`,{
        method:'GET',
        headers:{
            Accept:'application/json',
            Authorization:`Bearer ${token}`
        }
    }).then(response=>response.json()).catch(err=>console.log(err));

};

export const totalPageBranchTest=(userId,token,branchId,limit,testtype)=>{

    return fetch(`${API}/total-page-test-of-branch/${userId}/${branchId}?limit=${limit}&testtype=${testtype}`,{
        method:'GET',
        headers:{
            Accept:'application/json',
            Authorization:`Bearer ${token}`
        }
    }).then(response=>response.json()).catch(err=>console.log(err));

};


// Exercise API's //


export const getAllActiveWarmUpExercise = (userId, token, gymId) => {
    return fetch(`${API}/get-all-active-warmups-by-gym/${userId}/${gymId}`, {
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

export const getAllActiveMainExercise = (userId, token, gymId) => {
    return fetch(`${API}/get-all-active-mainex-by-gym/${userId}/${gymId}`,{
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


export const getAllActiveCoolDownExercise = (userId, token, gymId) => {
    return fetch (`${API}/get-all-active-cooldown-by-game/${userId}/${gymId}`, {
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


export const getAllInActiveContent=(userId,token,gymId)=>{

    return fetch(`${API}/user-gym-get-all-inactive-contents/${userId}/${gymId}`,{
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


export const getAllInActiveWarmUpExercise = (userId, token, gymId) => {
    return fetch(`${API}/get-all-inactive-warmups-by-gym/${userId}/${gymId}`,{
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

export const getAllInActiveMainExercise = (userId, token, gymId) => {
    return fetch(`${API}/get-all-inactive-mainex-by-game/${userId}/${gymId}`,{
        method: "GET",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`
        }
    })
    .then(response =>{
        return response.json();
    })
    .catch(err => console.log(err));
}

export const getAllInActiveCoolDownExercise = (userId, token, gymId) => {
    return fetch(`${API}/get-all-inactive-cooldown-by-game/${userId}/${gymId}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            Authorization : `Bearer ${token}`
        }
    })
    .then(response => {
        return response.json();
    })
    .catch(err => console.log(err));
};


//test content

export const getAllActiveFitnessConents=(userId,token,gymId)=>{
    return fetch(`${API}/get-all-active/fitness-contents/${userId}/${gymId}`,{
        method:'get',
        headers: {
            Accept: "application/json",
            Authorization : `Bearer ${token}`
        }
    })
    .then(response => {
        return response.json();
    })
    .catch(err => console.log(err));
}

export const getAllinActiveFitnessContents=(userId,token,gymId)=>{
    return fetch(`${API}/get-all-inactive/fitness-contents/${userId}/${gymId}`,{
        method:'get',
        headers: {
            Accept: "application/json",
            Authorization : `Bearer ${token}`
        }
    })
    .then(response => {
        return response.json();
    })
    .catch(err => console.log(err));
}


//planner api calls

export const createPlanner=(userId,token,planner)=>{
   return fetch(`${API}/branch-create-planner/${userId}`,{
       method:'post',
       headers:{
           Accept:"application/json",
          'Content-type':'application/json',
           Authorization:`Bearer ${token}`
       },
       body:JSON.stringify(planner)
   }).then(response=>{
       return response.json();
   }).catch(err=>console.log(err))   
};

export const updatePlanner=(userId,token,plannerId,planner)=>{
    return fetch(`${API}/branch-update-planner/${userId}/${plannerId}`,{
        method: "PUT",
        headers:{
          Accept: "application/json",
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`
       },
       body:JSON.stringify(planner)
    }).then(response=>{
        return response.json()
    }).catch(err=>console.log(err))
};

export const getPlanner=(userId,token,plannerId)=>{
    return fetch(`${API}/branch-get-planner/${userId}/${plannerId}`,{
        method:'get',
        headers:{
            Accept:'application/json',
            Authorization:`Bearer ${token}`
        }
    }).then(response=>response.json()).catch(err=>console.log(err))
};

export const deletePlanner=(userId,token,branchId,plannerId)=>{
    return fetch(`${API}/delete-planner/${userId}/${branchId}/${plannerId}`,{
        method:'delete',
        headers:{
            Accept:'application/json',
            Authorization:`Bearer ${token}`
        },
    }).then(response=>response.json()).catch(err=>console.log(err));
}

export const getAllPlanner=(userId,token,branchId,limit,page)=>{
    return fetch(`${API}/branch-get-all-planner/${userId}/${branchId}?limit=${limit}&page=${page}`,{
     method:'get',
     headers:{
         Accept:'application/json',
         Authorization:`Bearer ${token}`
     }   
    }).then(response=>response.json()).catch(err=>console.log(err))
};

export const getTotalPlannerPage=(userId,token,branchId,limit)=>{
    return fetch(`${API}/get-planner-page-total/${userId}/${branchId}?limit=${limit}`,{
        method:'get',
        headers:{
           Accept:'application/json',
           Authorization:`Bearer ${token}`
        }
    }).then(response=>response.json()).catch(err=>console.log(err))
};


//exercise api call
export const addExercise=(userId,token,plannerId,exercise)=>{
    return fetch(`${API}/add-planner-day-exercise/${userId}/${plannerId}`,{
        method:'post',
        headers:{
            Accept:'application/json',
            'Content-type':'application/json',
            Authorization:`Bearer ${token}`
        },
        body:JSON.stringify(exercise)
    }).then(response=>response.json()).catch(err=>console.log(err))
};

export const updateExercise=(userId,token,exerciseId,exercise)=>{
    return fetch(`${API}/update-planner-day-exercise/${userId}/${exerciseId}`,{
        method:'put',
        headers:{
            Accept:'application/json',
            'Content-type':'application/json',
            Authorization:`Bearer ${token}`
        },
        body:JSON.stringify(exercise)
    }).then(response=>response.json(response)).catch(err=>console.log(err))
}

export const getExercise=(userId,token,exerciseId)=>{
    return fetch(`${API}/get-planner-day-exercise/${userId}/${exerciseId}`,{
        method:'get',
        headers:{
            Accept:'application/json',
            Authorization:`Bearer ${token}`
        }
    }).then(response=>response.json()).catch(err=>console.log(err))
}

export const getAllExercise=(userId,token,plannerId)=>{
    return fetch(`${API}/get-planner-day-all-exercises/${userId}/${plannerId}`,{
        method:'get',
        headers:{
            Accept:'application/json',
            Authorization:`Bearer ${token}`
        }
    }).then(response=>response.json()).catch(err=>console.log(err))
}

export const removeExercise=(userId,token,exerciseId,plannerId)=>{
    return fetch(`${API}/remove-planner-day-exercise/${userId}/${plannerId}/${exerciseId}`,{
        method:'delete',
        headers:{
            Accept:'application/json',
            Authorization:`Bearer ${token}`
        }
    }).then(response=>response.json()).catch(err=>console.log(err))
}

export const getAllSelectedexercise=(userId,token,exercises)=>{
    return fetch(`${API}/get-all-selected-exercises/${userId}`,{
        method:'post',
        headers:{
            Accept:'application/json',
            Authorization:`bearer ${token}`,
            'Content-type':"application/json"
        },
        body:JSON.stringify(exercises)
    }).then(response=>response.json()).catch(err=>console.log(err))
}

export const deleteSelectedExercises=(userId,token,plannerId,data)=>{
    return fetch(`${API}/delete-selected-exercises/${userId}/${plannerId}`,{
        method:'post',
        headers:{
            Accept:'application/json',
            Authorization:`bearer ${token}`,
            'Content-type':"application/json"
        },
        body:JSON.stringify(data)
    }).then(response=>response.json()).catch(err=>console.log(err))
}

//branchadmin
export const getBranchAdmin=(userId,token,branchadminId)=>{
    return fetch(`${API}/get-branch-admin/:userId/:branchadminId/${userId}/${branchadminId}`,{
        method:'get',
        headers:{
            Accept:'application/json',
            Authorization:`Bearer ${token}`
        }
    }).then(response=>response.json()).catch(err=>console.log(err))
}

export const getAllActiveBranchAdmin=(userId,token,branchId,page,limit)=>{
    return fetch(`${API}/get-all-active-branchadmin/${userId}/${branchId}?limit=${limit}&page=${page}`,{
        method:'get',
        headers:{
            Accept:'application/json',
            Authorization:`Bearer ${token}`
        }
    }).then(response=>response.json()).catch(err=>{
        console.log(err)
    })
}

export const getAllInActiveBranchAdmin=(userId,token,branchId,page,limit)=>{
    return fetch(`${API}/get-all-inactive-branchadmin/${userId}/${branchId}?limit=${limit}&page=${page}`,{
        method:'get',
        headers:{
            Accept:'application/json',
            Authorization:`Bearer ${token}`
        }
    }).then(response=>response.json()).catch(err=>{
        console.log(err)
    })
}

export const addBranchAdmin=(userId,token, branchId, branchadmin)=>{
    return fetch(`${API}/assign-branch-admin/${userId}/${branchId}`,{
        method:'post',
        headers:{
            Accept:'application/json',
            Authorization:`Bearer ${token}`
        },
        body:branchadmin
    }).then(response=>response.json()).catch(err=>{
        console.log(err)
    });
}

export const updateBranchAdmin=(userId,token,branchadminId,branchadmin)=>{
    return fetch(`${API}/update-branchadmin/${userId}/${branchadminId}`,{
        method:'put',
        headers:{
            Accept:'application/json',
            Authorization:`Bearer ${token}`
        },
        body:branchadmin
    }).then(response=>response.json()).catch(err=>{
        console.log(err)
    });
}

export const activeinactiveOperationBranchAdmin=(userId,token,branchadminId,branchadmin)=>{
    return fetch(`${API}/active-inactive-operation-branchadmin/${userId}/${branchadminId}`,{
        method:'POST',
        headers:{
            Accept:'application/json',
            'Content-type':'application/json',
            Authorization:`Bearer ${token}`
        },
        body:JSON.stringify(branchadmin)
    }).then(response=>response.json()).catch(err=>{
        console.log(err);
    });
}

export const totalactiveBranchAdminPage=(userId,token,branchId,limit)=>{
    return fetch(`${API}/active-branchadmin-total-page/${userId}/${branchId}?limit=${limit}`,{
        method:'get',
        headers:{
            Accept:'application/json',
            Authorization:`bearer ${token}`
        }
    }).then(response=>response.json()).catch(err=>console.log(err))
}

export const totalinactiveBranchAdminPage=(userId,token,branchId,limit)=>{
    return fetch(`${API}/inactive-branchadmin-total-page/${userId}/${branchId}?limit=${limit}`,{
        method:'get',
        headers:{
            Accept:'application/json',
            Authorization:`bearer ${token}`
        }
    }).then(response=>response.json()).catch(err=>console.log(err))
}


export const getAllSelecdContents=(userId,token,contents)=>{
    return fetch(`${API}/get-all-selected-contents/${userId}`,{
        method:'post',
        headers:{
            Accept:`application/json`,
            'Content-type':'application/json',
            Authorization:`bearer ${token}`
        },
        body:JSON.stringify(contents)
    }).then(response=>response.json()).catch(err=>console.log(err))
}



export const checkBranchAdminStatus=(userId,token,branchId,data)=>{
    return fetch(`${API}/check-branch-admin/status/${userId}/${branchId}?field=${data["field"]}&value=${data['value']}`,{
        method:'get',
        headers:{
            Accept:"application/json",
            Authorization:`bearer ${token}`
        }
    }).then(response=>response.json()).catch(err=>console.log(err));
}

export const checkPlannerStatus=(userId,token,branchId,data)=>{
    return fetch(`${API}/check-planner/status/${userId}/${branchId}?field=${data["field"]}&value=${data['value']}`,{
        method:'get',
        headers:{
            Accept:"application/json",
            Authorization:`bearer ${token}`
        }
    }).then(response=>response.json()).catch(err=>console.log(err));
}

export const checkContentStatus=(userId,token,gymId,data)=>{
    return fetch(`${API}/check-content/status/${userId}/${gymId}?field=${data["field"]}&value=${data['value']}`,{
        method:'get',
        headers:{
            Accept:"application/json",
            Authorization:`bearer ${token}`
        }
    }).then(response=>response.json()).catch(err=>console.log(err));
}



export const getAllBranchAdminUsers=(userId,token,data)=>{
    return fetch(`${API}/get/branchadmins/${userId}?active=${data['active']}`,{
        method:'get',
        headers:{
            Accept:"application/json",
            Authorization:`bearer ${token}`
        }
    }).then(response=>response.json()).catch(err=>console.log(err));
}

export const getAllContents=(userId,token,data)=>{
    return fetch(`${API}/get/contents/${userId}?active=${data['active']}`,{
        method:'get',
        headers:{
            Accept:'application/json',
            Authorization:`bearer ${token}`
        }
    }).then(response=>{
        return response.json()
    }).catch(err=>console.log(err))
}

//parameters
export const getAllParameters=(userId,token,data)=>{
    return fetch(`${API}/parameters/${userId}?type=${data['type']}`,{
        method:'get',
        headers:{
            Accept:'application/json',
            Authorization:`bearer ${token}`
        }
    }).then(response=>{
        return response.json()
    }).catch(err=>console.log(err))
}

export const updateParameter=(userId,token,parameterId,data)=>{
    return fetch(`${API}/update/parameter/${userId}/${parameterId}`,{
        method:'put',
        headers:{
            Accept:'application/json',
            Authorization:`bearer ${token}`,
        },
        body:data
    }).then(response=>{
        return response.json()
    }).catch(err=>console.log(err))
}


export const addParameter=(userId,token,data)=>{
    return fetch(`${API}/create/parameter/${userId}`,{
        method:'post',
        headers:{
            Accept:'application/json',
            Authorization:`bearer ${token}`,
        },
        body:data
    }).then(response=>{
        return response.json()
    }).catch(err=>console.log(err))
}

export const getParameter=(userId,token,parameterId)=>{
    return fetch(`${API}/parameter/${userId}/${parameterId}`,{
        method:'get',
        headers:{
            Accept:'application/json',
            Authorization:`bearer ${token}`
        }
    }).then(response=>{
        return response.json()
    }).catch(err=>console.log(err))
}

export const deleteParameter=(userId,token,parameterId)=>{
    return fetch(`${API}/delete/parameter/${userId}/${parameterId}`,{
        method:'delete',
        headers:{
            Accept:'application/json',
            Authorization:`bearer ${token}`
        }
    }).then(response=>response.json()).catch(err=>console.log(err))
}


export const getAllPlanners=(userId,token,data)=>{
    return fetch(`${API}/get/planners/${userId}?active=${data['active']}`,{
        method:'get',
        headers:{
            Accept:'application/json',
            Authorization:`bearer ${token}`
        }
    }).then(response=>response.json()).catch(err=>console.log(err))
}