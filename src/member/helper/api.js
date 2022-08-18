//member basic operations
import {API} from '../../backend';

export const getMember=(userId,token,memberId)=>{
       return fetch(`${API}/get-member/${userId}/${memberId}`,{
           method:'GET',
           headers:{
            "Content-type":"application/json",
            Authorization: `Bearer ${token}`
           }
       }).then(response=>{
           return response.json();
       }).catch(err=>console.log(err))
};
export const getAllActiveMember=(userId,token,branchId,page,limit)=>{
    return fetch(`${API}/get-all-member-active/${userId}/${branchId}?limit=${limit}&page=${page}`,{
        method:'GET',
        headers:{
             Accept:"application/json",
             Authorization: `Bearer ${token}`
        }
    }).then(response=>{
        return response.json();
    }).catch(err=>console.log(err));
};
export const getAllInActiveMember=(userId,token,branchId,page,limit)=>{
    return fetch(`${API}/get-all-member-inactive/${userId}/${branchId}?limit=${limit}&page=${page}`,{
        method:'GET',
        headers:{
            "Content-type":"application/json",
             Authorization: `Bearer ${token}`
        }
    }).then(response=>{
        return response.json();
    }).catch(err=>console.log(err));
};
export const createMember=(userId,token,branchId,member)=>{

    return fetch(`${API}/create-member/${userId}/${branchId}`,{
        method:'POST',
        headers:{
            Accept:"application//json",
            Authorization: `Bearer ${token}` 
        },
        body:member
    }).then(response=>{
        return response.json();
    }).catch(err=>console.log(err))

};
export const updateMember=(userId,token,memberId,member)=>{
    return fetch(`${API}/update-member/${userId}/${memberId}`,{
        method:'PUT',
        headers:{
            Accept:"application//json",
            Authorization: `Bearer ${token}` 
        },
        body:member
    }).then(response=>{
        return response.json();
    }).catch(err=>console.log(err))
};
export const activeInactiveMemberOperation=(userId,token,memberId,member)=>{

    return fetch(`${API}/active-inactive-operation-member/${userId}/${memberId}`,{
        method:'POST',
        headers:{
            Accept:"application//json",
            "Content-type":"application/json",
            Authorization: `Bearer ${token}` 
        },
        body:JSON.stringify(member)
    }).then(response=>{
        return response.json();
    }).catch(err=>console.log(err))

};

export const totalActiveMemberPage=(userId,token,branchId,limit)=>{
   return fetch(`${API}/total-page-member-active/${userId}/${branchId}?limit=${limit}`,{
       method:'GET',
       headers:{
           Accept:'application/json',
           Authorization: `Bearer ${token}`
       }
   }).then(response=>{
       return response.json();
   }).catch(err=>console.log(err));
}

export const totalInActiveMemberPage=(userId,token,branchId,limit)=>{
    return fetch(`${API}/total-page-member-inactive/${userId}/${branchId}?limit=${limit}`,{
        method:'GET',
        headers:{
            Accept:'application/json',
            Authorization: `Bearer ${token}`
        }
    }).then(response=>{
        return response.json();
    }).catch(err=>console.log(err));
 }


 //medicall report api calls

 export const getMedicalReport=(userId,token,medicalreportId)=>{
    return fetch(`${API}/get-medical-report/${userId}/${medicalreportId}`,{
        method:'GET',
        headers:{
            Accept:'application/json',
            Authorization: `Bearer ${token}`
        }
    }).then(response=>{
        return response.json()
    }).catch(err=>console.log(err))
 }


 export const getAllMedicalReport=(userId,token,medicalreportId)=>{
     return fetch(`/get-all-medical-report/${userId}/${medicalreportId}`,{
         method:'GET',
         headers:{
            Accept:'application/json',
            Authorization: `Bearer ${token}`
         }
     }).then(response=>{
         return response.json();
     }).catch(err=>console.log(err))
 };

 export const addMedicalReport=(userId,token,memberId,report)=>{
     return fetch(`/add-medical-report/${userId}/${memberId}`,{
         method:'POST',
         headers:{
            Accept:'application/json',
            Authorization: `Bearer ${token}`
         },
         body:report
     }).then(response=>{
         return response.json();
     }).catch(err=>console.log(err));
 }


//member test
//measurement
export const takeMemberMeasurementTest=(userId,token,memberId,test)=>{
return fetch(`${API}/take-member-measurement-test/${userId}/${memberId}`,{
    method:'POST',
    headers:{
        Accept:'application/json',
        "Content-type":"application/json",
        Authorization: `Bearer ${token}`
    },
    body:JSON.stringify(test)
}).then(response=>{
    return response.json();
}).catch(err=>console.log(err));
};
export const getMemberMeasurementTest=(userId,token,testId)=>{
return fetch(`${API}/get-measurement-test-by-member/${userId}/${testId}`,{
    method:'GET',
    headers:{
        Accept:'application/json',
        Authorization: `Bearer ${token}`
    }
}).then(response=>{
    return response.json();
}).catch(err=>console.log(err));
};
export const getMemberAllMeasurementTest=(userId,token,memberId,limit,page)=>{
    return fetch(`${API}/get-all-measurement-test-by-member/${userId}/${memberId}?limit=${limit}&page=${page}`,{
        method:'GET',
        headers:{
            Accept:'application/json',
            Authorization:`Bearer ${token}`
        }
    }).then(response=>{
        return response.json();
    }).catch(err=>console.log(err));
};
export const updateMemberMeasurementTest=(userId,token,testId,test)=>{
    return fetch(`${API}/update-member-measurement-test/${userId}/${testId}`,{
        method:'PUT',
        headers:{
            Accept:'application/json',
            'Content-type':"application/json",
            Authorization:`Bearer ${token}`            
        },
        body:JSON.stringify(test)
    }).then(response=>{
        return response.json()
    }).catch(err=>{
        console.log(err);
    })
};
export const removeMemberMeasurementTest=(userId,token,memberId,testId)=>{
     return fetch(`${API}/delete-member-measurement-test/${userId}/${memberId}/${testId}`,{
         method:'DELETE',
         headers:{
             Accept:'application/json',
             Authorization:`Bearer ${token}`
         }
     }).then(response=>{
         return response.json()
     }).catch(err=>console.log(err))
};
export const totalPageMemberMeasurementTest=(userId,token,memberId)=>{
    return fetch(`${API}/get-member-total-page-measurement-test/${userId}/${memberId}`,{
        method:'GET',
        headers:{
            Accept:'application/json',
            Authorization:`Bearer ${token}`
        }
    }).then(response=>{
        return response.json();
    }).catch(err=>console.log(err));
};

//fitness
export const takeMemberFitnessTest=(userId,token,memberId,test)=>{
return fetch(`${API}/take-member-fitness-test/${userId}/${memberId}`,{
    method:'POST',
    headers:{
        Accept:'application/json',
        "Content-type":"application/json",
        Authorization: `Bearer ${token}`
    },
    body:JSON.stringify(test)
}).then(response=>{
    return response.json();
}).catch(err=>console.log(err));  
};
export const getMemberFitnessTest=(userId,token,testId)=>{
return fetch(`${API}/get-fitness-test-by-member/${userId}/${testId}`,{
    method:'GET',
    headers:{
        Accept:'application/json',
        Authorization: `Bearer ${token}`
    }
}).then(response=>{
    return response.json();
}).catch(err=>console.log(err));
};
export const getMemberAllFitnessTest=(userId,token,memberId,limit,page)=>{
    return fetch(`${API}/get-all-fitness-test-by-member/${userId}/${memberId}?limit=${limit}&page=${page}`,{
        method:'GET',
        headers:{
            Accept:'application/json',
            Authorization:`Bearer ${token}`
        }
    }).then(response=>{
        return response.json();
    }).catch(err=>console.log(err));
};
export const updateMemberFitnessTest=(userId,token,testId,test)=>{
return fetch(`${API}/update-member-fitness-test/${userId}/${testId}`,{
    method:'PUT',
    headers:{
        Accept:'application/json',
        'Content-type':"application/json",
        Authorization:`Bearer ${token}`            
    },
    body:JSON.stringify(test)
}).then(response=>{
    return response.json()
}).catch(err=>{
    console.log(err);
})
};
export const removeMemberFitnessTest=(userId,token,memberId,testId)=>{
     return fetch(`${API}/delete-member-fitness-test/${userId}/${memberId}/${testId}`,{
         method:'DELETE',
         headers:{
             Accept:'application/json',
             Authorization:`Bearer ${token}`
         }
     }).then(response=>{
         return response.json()
     }).catch(err=>console.log(err))
};
export const totalPageMemberFitnessTest=(userId,token,memberId)=>{
    return fetch(`${API}/get-member-total-page-fitness-test/${userId}/${memberId}`,{
        method:'GET',
        headers:{
            Accept:'application/json',
            Authorization:`Bearer ${token}`
        }
    }).then(response=>{
        return response.json();
    }).catch(err=>console.log(err));
};


//bodycomposition
export const takeMemberBodyCompositionTest=(userId,token,memberId,test)=>{
return fetch(`${API}/take-member-bodycomposition-test/${userId}/${memberId}`,{
    method:'POST',
    headers:{
        Accept:'application/json',
        "Content-type":"application/json",
        Authorization: `Bearer ${token}`
    },
    body:JSON.stringify(test)
}).then(response=>{
    return response.json();
}).catch(err=>console.log(err));  
};
export const getMemberBodyCompositionTest=(userId,token,testId)=>{
return fetch(`${API}/get-bodycomposition-test-by-member/${userId}/${testId}`,{
    method:'GET',
    headers:{
        Accept:'application/json',
        Authorization: `Bearer ${token}`
    }
}).then(response=>{
    return response.json();
}).catch(err=>console.log(err));
};
export const getMemberAllBodyCompositionTest=(userId,token,memberId,limit,page)=>{
    return fetch(`${API}/get-all-bodycompostion-test-by-member/${userId}/${memberId}?limit=${limit}&page=${page}`,{
        method:'GET',
        headers:{
            Accept:'application/json',
            Authorization:`Bearer ${token}`
        }
    }).then(response=>{
        return response.json();
    }).catch(err=>console.log(err));
};
export const updateMemberBodyCompositionTest=(userId,token,testId,test)=>{
    return fetch(`${API}/update-member-bodycomptest/${userId}/${testId}`,{
        method:'PUT',
        headers:{
            Accept:'application/json',
            'Content-type':"application/json",
            Authorization:`Bearer ${token}`            
        },
        body:JSON.stringify(test)
    }).then(response=>{
        return response.json()
    }).catch(err=>{
        console.log(err);
    });
};
export const removeMemberBodyCompositionTest=(userId,token,memberId,testId)=>{
    return fetch(`${API}/delete-member-bodycomposition-test/${userId}/${memberId}/${testId}`,{
        method:'DELETE',
        headers:{
            Accept:'application/json',
            Authorization:`Bearer ${token}`
        }
    }).then(response=>{
        return response.json()
    }).catch(err=>console.log(err))
};
export const totalPageMemberBodyCompositionTest=(userId,token,memberId)=>{
    return fetch(`${API}/get-member-total-page-bodycomposition-test/${userId}/${memberId}`,{
    method:'GET',
    headers:{
        Accept:'application/json',
        Authorization:`Bearer ${token}`
    }
    }).then(response=>{
    return response.json();
    }).catch(err=>console.log(err));
};

//assign planner
export const assignPlannerToMember=(userId,token,memberId,plannerId,plannerprop)=>{
    return fetch(`${API}/assign-planner-to-member/${userId}/${memberId}/${plannerId}`,{
        method:'POST',
        headers:{
            Accept:'application/json',
            'Content-type':"application/json",
            Authorization:`Bearer ${token}`            
        },
        body:JSON.stringify(plannerprop)
    }).then(response=>response.json()).catch(err=>console.log(err))
};

//member work out reports

export const getWorkOutReport=(userId,token,workoutreportId)=>{
    return fetch(`${API}/user/workout-report/${userId}/${workoutreportId}`,{
        method:'get',
        headers:{
            Accept:"application/json",
            Authorization:`bearer ${token}`
        },
    }).then(response=>response.json()).catch(err=>{
        console.log(err);
    })
}

export const createWorkOutReport=(userId,token,memberId,workoutreport)=>{
    return fetch(`${API}/add/workout-report/${userId}/${memberId}`,{
        method:"post",
        headers:{
            Accept:'application/json',
            'Content-type':'application/json',
            Authorization:`bearer ${token}`
        },
        body:JSON.stringify(workoutreport)
    }).then(response=>response.json()).catch(err=>console.log(err));
}

export const updateWorkOutReport=(userId,token,workoutreportId,workoutreport)=>{
    
    return fetch(`${API}/edit/workout-report/${userId}/${workoutreportId}`,{
        method:"put",
        headers:{
            Accept:'application/json',
            'Content-type':'application/json',
            Authorization:`bearer ${token}`
        },
        body:JSON.stringify(workoutreport)
    }).then(response=>response.json()).catch(err=>console.log(err));
}

export const getAllWorkoutReportsOFMember=(userId,token,memberId,page,limit)=>{
    return fetch(`${API}/user/all/workout-report/${userId}/${memberId}?limit=${limit}&page=${page}`,{
       method:'get',
       headers:{
        Accept:'application/json',
        Authorization:`bearer ${token}`
       }
    }).then(response=>response.json()).catch(err=>console.log(err))
}

export const totalWorkOutReportPages=(userId,token,memberId,limit)=>{
    return fetch(`${API}/user/workout-report/total/pages/${userId}/${memberId}?limit=${limit}`,{
        method:'get',
        headers:{
            Accept:"application/json",
            Authorization:`bearer ${token}`
        }
    }).then(response=>response.json()).catch(err=>console.log(err))
};


export const getPlannerHistory=(userId,token,plannerhistoryId)=>{
    return fetch(`${API}/get-member-planner-history/${userId}/${plannerhistoryId}`,{
        method:'get',
        headers:{
            Accept:'application/json',
            Authorization:`bearer ${token}`
        }
    }).then(response=>response.json()).catch(err=>{
        console.log(err);
    })
}

export const getAllPlannerHistoryByMembers=(userId,token,memberId,limit,page)=>{
    return fetch(`${API}/get-member-all-planner-history/${userId}/${memberId}?limit=${limit}&page=${page}`,{
        method:'get',
        headers:{
            Accept:"application/json",
            Authorization:`bearer ${token}`
        }
    }).then(response=>response.json()).catch(err=>{
        console.log(err);
    });
}

export const totalPlannerHistoryAndPages=(userId,token,memberId,limit)=>{
    return fetch(`${API}/get-member-total-pages/planner-history/${userId}/${memberId}?limit=${limit}`,{
        method:"get",
        headers:{
            Accept:"application/json",
            Authorization:`bearer ${token}`
        }
    }).then(response=>response.json()).catch(err=>{
        console.log(err);
    })
}


///workout report check

export const findWorkoutReport=(userId,token,memberId,workoutreport)=>{
       return fetch(`${API}/find-workout-report/${userId}/${memberId}`,{
           method:'post',
           headers:{
               'Content-type':'application/json',
               Accept:'application/json',
               Authorization:`Bearer ${token}`
           },
           body:JSON.stringify(workoutreport)
       }).then(response=>response.json()).catch(err=>{
           console.log(err)
       })
}

export const getSelectedWorkoutReport=(userId,token,memberId,workoutReport)=>{
    return fetch(`${API}/selected-workout-report/${userId}/${memberId}`,{
        method:'post',
        headers:{
            Accept:'application/json',
            'Content-type':'applicaion/json',
            Authorization:`Bearer ${token}`
        },
        body:JSON.stringify(workoutReport)
    }).then(response=>response.json()).catch(err=>console.log(err))
}

export const getAllMember=(userId,token,data)=>{
    return fetch(`${API}/get/members/${userId}?active=${data['active']}`,{
        method:'GET',
        headers:{
            Accept:"application/json",
            Authorization:`Bearer ${token}`
        }
    }).then(response=>{
        return response.json();
    }).catch(err=>console.log(err));
}


//medical health

export const getMedicalHealth=(userId,token,medicalhealthId)=>{
    return fetch(`${API}/medical/health/${userId}/${medicalhealthId}`,{
        method:'GET',
        headers:{
            Accept:"application/json",
            Authorization:`Bearer ${token}`
        }
    }).then(response=>{
        return response.json();
    }).catch(err=>console.log(err));
}


export const updateMedicalHealth=(userId,token,medicalhealthId,medicalHealth)=>{
    return fetch(`${API}/update/medical/health/${userId}/${medicalhealthId}`,{
        method:'PUT',
        headers:{
            Accept:"application/json",
            'Content-type':'applictaion/json',
            Authorization:`Bearer ${token}`
        },
        body:JSON.stringify(medicalHealth)
    }).then(response=>{
        return response.json();
    }).catch(err=>console.log(err));
}
