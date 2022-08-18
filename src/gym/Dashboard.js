import React, {useEffect, useState} from 'react';
import { isAuthenticated } from '../auth';
import { getGym } from '../gym/helper/api';
import Dashboard from '../core/Dashboard';
import ErrorLogo from '../assets/no_access.svg';


const GymDashboard  = () => {

    const {user,token} = isAuthenticated();

    // Hooks call for Dashboard Info Switching 
    const [flag,setflag] = useState(1);
    const [gymId, setGymId] = useState(user.pannelAccessId);

    const [regGym, setRegGym] = useState({
        active: "",
        formData:new FormData(),
    });

    const {active} = regGym;

    getGym(user._id,token,gymId).then(data=>{
        if(data.error){
            console.log("error in DB")
        }else{
            setRegGym({...regGym,
                active: data.active
            });
        }
    })
    

    return (
        <div>
        {
            (active === true)? (

                <Dashboard flag={flag} itemId={gymId}>
                    
                </Dashboard>

            ) : (active === false) ? (

                <div style={{width: "100%", height: "100vh", backgroundColor: "#ffffff", textAlign: "center", paddingTop:"15%"}}>
                    <img src={ErrorLogo} style={{width: 200}}/>
                    <p>Your Gym Account is Blocked, Please contact to your Company.</p>
                </div>

            ) : null
        }
        </div>
    )
}

export default GymDashboard;