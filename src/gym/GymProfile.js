import React, { useEffect, useState } from 'react';
import { isAuthenticated } from '../auth';
import Dashboard from "../core/Dashboard";
import { getGym, gettotalMembers,updateGym } from './helper/api';
import GymLogo from "../assets/sumo.png";
import ArrowUp from "../assets/arrow-sign.svg"
import ArrowDown from "../assets/arrow-down.svg";
import MoreInfo from "../assets/more-info.png";
import {API} from '../backend'

export default function GymBio(props) {

    const [flag]=useState(1);
    const gymId = props.match.params.gymId;
    const [previousField, setPreviousField] = useState("");

    // User Authentication
    const {user,token} = isAuthenticated();

    const [totalListAttr,settotalListAttr]=useState({
        totalBranch:0,
        totalMembers:0
    })
    const {totalMembers,totalBranch}=totalListAttr;

    const [startProgress,setstartProgress]=useState(false);

    const [statelist,setstatelist]=useState([
        "Tripura",
        "Uttarakhand",
        "Telengana",
        "Maharashtra",
        "Kerala",
        "Hydrabad"
    ]);

    const [citylist,setcitylist]=useState([
        "Agartala",
        "Udaipur",
        "Chobimura",
        "Pune"
    ])

    const [locationlist,setlocationlist]=useState([
        "Wagholi",
        "Biman Nagar",
        "Ram Nagar",
        "Pechar Tal"
    ])

    const [regGym, setRegGym] = useState({
        gymName: "",
        email: "",
        optional_email:"",
        phone: "",
        address: "",
        optional_phone:"",
        location: "",
        city: "",
        state: "",
        pincode: "",
        gymtype:0,
        photo: "",
        managerFirstname:"",
        managerLastname:"",
        managerEmail:"",
        managerPhone:"",
        ownerFirstname: "",
        ownerLastname: "",
        ownerEmail: "",
        ownerphone: "",
        error: "",
        loading: "",
        success: "",
        formData:new FormData(),
    });
    const {gymName,optional_email,optional_phone, email, phone,gymtype,managerEmail,managerFirstname,managerLastname,managerPhone, address, location, city, state, pincode, photo, ownerFirstname, ownerLastname, ownerEmail, ownerphone, error, loading, success, formData} = regGym;
    //hooks for display gyminfo
    const [displayGymInfo,setDisplayGymInfo]=useState({
        display_gymName:"",
        display_email:"",
        display_optional_email:"",
        display_phone:"",
        display_optional_phone:"",
        display_adress:"",
        display_location:"", 
        display_city:"", 
        display_state:"", 
        display_gymtype:0,
        display_pincode:"",
        display_managerFirstname:"",
        display_managerLastname:"",
        display_managerEmail:"",
        display_managerPhone:"",
        display_ownerFirstName:"",
        display_ownerLastName:"",
        display_ownerphone:"",
        display_ownerEmail:""
    });
    const {display_gymName,display_optional_phone,display_optional_email,display_email,display_managerEmail,display_managerPhone,display_managerLastname,display_managerFirstname,display_phone,display_gymtype,display_state,display_pincode,display_adress,display_city,display_location,display_ownerFirstName,display_ownerLastName,display_ownerEmail,display_ownerphone}=displayGymInfo;


    // Handle Request to accept Gym Information from input fields
    const handleRegisterGym = name => event => {
        const value = name === "photo" ? event.target.files[0] : event.target.value;
        if(name=="photo") document.getElementById("image-profile-pic").src=  URL.createObjectURL(event.target.files[0]);
        formData.set(name, value);
        setRegGym({...regGym,  [name]: event.target.value});
        if(name=="photo"){
            setTimeout(async ()=>{
                let data = await UpdateGymProfile();
                if(data!=false){
            
                  setTimeout(()=>{
                        if(document.getElementById("image-profile-pic")) document.getElementById("image-profile-pic").src=`${API}/photo-gym/${data._id}?${new Date().getTime()}`;
                  },100)
     
                }else{
                    console.log("something went wrong please try again")
                }
            },100)
        }
       
        event.preventDefault();
    }




    const getThisGym = () => {
        getGym(user._id,token,gymId).then(data=>{
            if(data.error){
                console.log("something went wrong")
            }else{
                setRegGym({...regGym,
                    gymName: data.gymName,
                    email: data.email,
                    optional_email:data.optional_email,
                    gymtype:data.gymtype,
                    optional_phone:data.optional_phone,
                    phone: data.phone,
                    address: data.address,
                    location: data.location,
                    city: data.city,
                    state: data.state,
                    pincode: data.pincode,
                    photo: data.photo,
                    ownerFirstname : (data.owner&&data.owner["firstname"])?data.owner['firstname']:"",
                    ownerLastname : (data.owner&&data.owner["lastname"])?data.owner['lastname']:"",
                    ownerphone : (data.owner&&data.owner["phone"])?data.owner['phone']:"",
                    ownerEmail : (data.owner&&data.owner["email"])?data.owner['email']:"" ,
                    managerFirstname:(data.gymManager&&data.gymManager["firstname"])?data.gymManager['firstname']:"",
                    managerLastname:(data.gymManager&&data.gymManager["lastname"])?data.gymManager['lastname']:"",
                    managerEmail:(data.gymManager&&data.gymManager["email"])?data.gymManager['email']:"",
                    managerPhone:(data.gymManager&&data.gymManager["phone"])?data.gymManager['phone']:""
                });
             
                setDisplayGymInfo({
                    ...displayGymInfo,
                    display_gymName:data.gymName,
                    display_email:data.email,
                    display_optional_phone:data.optional_phone,
                    display_gymtype:data.gymtype,
                    display_optional_email:data.optional_email,
                    display_phone:data.phone,
                    display_adress: data.address,
                    display_location: data.location,
                    display_city: data.city,
                    display_state: data.state,
                    display_pincode: data.pincode,
                    display_managerFirstname:(data.gymManager&&data.gymManager['firstname'])?data.gymManager["firstname"]:"",
                    display_managerLastname:(data.gymManager&&data.gymManager['lastname'])?data.gymManager["lastname"]:"",
                    display_managerEmail:(data.gymManager&&data.gymManager['email'])?data.gymManager["email"]:"",
                    display_managerPhone:(data.gymManager&&data.gymManager['phone'])?data.gymManager["phone"]:"",
                    display_ownerFirstName : (data.owner&&data.owner['firstname'])?data.owner["firstname"]:"",
                    display_ownerLastName : (data.owner&&data.owner['lastname'])?data.owner["lastname"]:"",
                    display_ownerphone : (data.owner&&data.owner['email'])?data.owner["email"]:"",
                    display_ownerEmail : (data.owner&&data.owner['phone'])?data.owner["phone"]:"" 
                });

                if(document.getElementById("image-profile-pic")) document.getElementById("image-profile-pic").src=`${API}/photo-gym/${data._id}?${new Date().getTime()}`;

              gettotalMembers(user._id,token, gymId).then(data=>{
                  if(data.error){
                      console.log('something went wrong please try again')
                  }else{
                      settotalListAttr({...totalListAttr,totalMembers:data.totalmembers,totalBranch:data.totalbranch});
                      setstartProgress(false)
                  }             
              }).catch(err=>console.log(err))
            
            }
        }).catch(err=>console.log(err));
    }

    const toggleUnitField = (dataId,value) => event => {
        event.preventDefault()
        let currentUnitId = event.target.id.split('-')[1];
       
        switch(dataId){
            case "dropdown":
                console.log('the dropdown is oppened')
            break;
            case "menuItem":
                setRegGym({...regGym,[currentUnitId]:value})
                formData.set(currentUnitId,value);
            break;
            default:
                console.log(dataId)
        }
        
        setTimeout(() => {
            if(document.getElementById("menu-" + currentUnitId).style.display == "block"){
                document.getElementById("menu-" + currentUnitId).style.display = "none";
                if(document.getElementById("icon-" + currentUnitId)) document.getElementById("icon-" + currentUnitId).style.transform = "rotate(0deg)";

                setTimeout(async ()=>{
                    let data = await UpdateGymProfile();
                    if(data!=false){
                     setRegGym({...regGym,                       
                         location: data.location,
                         city: data.city,
                         state: data.state,
                     });
                  
                     setDisplayGymInfo({
                         ...displayGymInfo,
                         display_location: data.location,
                         display_city: data.city,
                         display_state: data.state,
                     });
                     console.log("suucess")
                
         
                    }else{
                        console.log("something went wrong please try again")
                    }
                },100)
            } else{
                document.getElementById("menu-" + currentUnitId).style.display = "block";
                if(document.getElementById("icon-" + currentUnitId)) document.getElementById("icon-" + currentUnitId).style.transform = "rotate(-180deg)";

                // if(previousField !== ""){
                //     document.getElementById("menu-" + currentUnitId).style.display = "none";
                //     if(document.getElementById("icon-" + currentUnitId)) document.getElementById("icon-" + currentUnitId).style.transform = "rotate(-180deg)";
                   
                // }
                // setPreviousField(currentUnitId);
            }
        }, 10); 
        
    }

    const UpdateGymProfile=()=>{
        
        var owner = {
            firstname: ownerFirstname,
            lastname: ownerLastname,
            email: ownerEmail,
            phone: ownerphone
        };
        var gymManager={
            firstname:managerFirstname,
            lastname:managerLastname,
            email:managerEmail,
            phone:managerPhone
        }
        formData.set("owner", JSON.stringify(owner));
        formData.set('gymManager',JSON.stringify(gymManager));
        return updateGym(user._id,token,gymId,formData).then(data=>{
            if(data.error){
                return false;
            }else{
            
                return data;
            }
        }).catch(err=>{
            return false;
        })

      
    }

    
    const EditField = async (event) => {
       let currentField = event.target.id.split('-')[1];

       let fields = ["gymName","email","phone","address","city","state","location","optional_email","optional_phone","managerFirstname","managerLastname","managerPhone","managerEmail","ownerFirstname","ownerLastname","ownerphone","ownerEmail"];
      //Boolean(fields.find(id=>id==currentField)) &&
     
       if( (document.getElementById("edit-" + currentField).style.display == "none")){
            document.getElementById("edit-" + currentField).style.display = "block";
            document.getElementById("save-" + currentField).style.display = "none";
            document.getElementById("input-" + currentField).style.pointerEvents = "none";

            if(previousField !== ""){
                document.getElementById("edit-" + previousField).style.display = "block";
                document.getElementById("save-" + previousField).style.display = "none";
                document.getElementById("input-" + previousField).style.pointerEvents = "none";
            }

            let data = await UpdateGymProfile();
            if(data!=false){
             setRegGym({...regGym,
                 gymName: data.gymName,
                 email: data.email,
                 optional_email:data.optional_email,
                 gymtype:data.gymtype,
                 optional_phone:data.optional_phone,
                 phone: data.phone,
                 address: data.address,
                 pincode: data.pincode,
                 photo: data.photo,
                 ownerFirstname : (data.owner&&data.owner["firstname"])?data.owner['firstname']:"",
                 ownerLastname : (data.owner&&data.owner["lastname"])?data.owner['lastname']:"",
                 ownerphone : (data.owner&&data.owner["phone"])?data.owner['phone']:"",
                 ownerEmail : (data.owner&&data.owner["email"])?data.owner['email']:"" ,
                 managerFirstname:(data.gymManager&&data.gymManager["firstname"])?data.gymManager['firstname']:"",
                 managerLastname:(data.gymManager&&data.gymManager["lastname"])?data.gymManager['lastname']:"",
                 managerEmail:(data.gymManager&&data.gymManager["email"])?data.gymManager['email']:"",
                 managerPhone:(data.gymManager&&data.gymManager["phone"])?data.gymManager['phone']:""
             });
          
             setDisplayGymInfo({
                 ...displayGymInfo,
                 display_gymName:data.gymName,
                 display_email:data.email,
                 display_optional_phone:data.optional_phone,
                 display_gymtype:data.gymtype,
                 display_optional_email:data.optional_email,
                 display_phone:data.phone,
                 display_adress: data.address,
                 display_pincode: data.pincode,
                 display_managerFirstname:(data.gymManager&&data.gymManager['firstname'])?data.gymManager["firstname"]:"",
                 display_managerLastname:(data.gymManager&&data.gymManager['lastname'])?data.gymManager["lastname"]:"",
                 display_managerEmail:(data.gymManager&&data.gymManager['email'])?data.gymManager["email"]:"",
                 display_managerPhone:(data.gymManager&&data.gymManager['phone'])?data.gymManager["phone"]:"",
                 display_ownerFirstName : (data.owner&&data.owner['firstname'])?data.owner["firstname"]:"",
                 display_ownerLastName : (data.owner&&data.owner['lastname'])?data.owner["lastname"]:"",
                 display_ownerphone : (data.owner&&data.owner['email'])?data.owner["email"]:"",
                 display_ownerEmail : (data.owner&&data.owner['phone'])?data.owner["phone"]:"" 
             });
             console.log("suucess")
 
            }else{
                console.log("something went wrong please try again")
            }
           
       }else{
            document.getElementById("edit-" + currentField).style.display = "none";
            document.getElementById("save-" + currentField).style.display = "block";
            document.getElementById("input-" + currentField).style.pointerEvents = "auto";
            document.getElementById("input-" + currentField).focus();  
        
       }

       setPreviousField(currentField);

       event.stopPropagation();
    }

    const toggleUpdatePassword = () => {
        if(document.getElementById("reset-password-id").style.display  == "none"){
            document.getElementById("reset-password-id").style.display = "block";
        }else{
            document.getElementById("reset-password-id").style.display = "none";
        }
    }  


    useEffect(()=>{
        getThisGym();
    },[]);

    return(
        
        <Dashboard flag={flag} data={{state:"none",
        totalMembers,
        totalBranch,
        gymName:display_gymName,
        email:display_email,
        phone:display_phone,
        address:display_adress,
        city:display_city,
        location:display_location,
        state:display_state,
        pincode:display_pincode,
        ownerFirstname:display_ownerFirstName,
        ownerLastname:display_ownerLastName,
        ownerEmail:display_ownerEmail,
        ownerphone:display_ownerphone,
        startProgress:startProgress,
        }} navItemData={"Gym"} itemId={gymId}>

            <div id="reset-password-id" className="popup-container" style={{display:"none"}}>
                <div className="popup-view">
                    <div className="d-flex" style={{justifyContent:"space-between"}}>
                        <div className="bold-font my-profile-heading flex-item">Update your password</div>
                        <span onClick={toggleUpdatePassword} class="material-icons-round edit-icon">close</span>
                    </div>

                    <div className="spacing-28 field-text">Update the password for your account. Use the new password the next time you sign in.</div>

                    <div className="bold-font spacing-28 field-text-2">Email Address : <span style={{fontWeight:"normal"}}>anikroy.cs@gmail.com</span></div>

                    <div style={{margin:"6% 0 2% 0"}}>
                        <div className="bold-font field-text-2" style={{marginBottom:"1%"}}>
                            Current Password
                        </div>
                        <input className="input-field-1" type="password" placeholder="Enter your current password"/>
                    </div>

                    <div className="spacing-29">
                        <div className="bold-font field-text-2" style={{marginBottom:"1%"}}>
                            New Password
                        </div>
                        <input className="input-field-1" type="password" placeholder="Enter new password"/>
                    </div>

                    <div className="spacing-29">
                        <div className="bold-font" style={{fontSize:"1vw", marginBottom:"1%"}}>
                            Confirm Password
                        </div>
                        <input className="input-field-1" type="password" placeholder="Confirm your password"/>
                        {/* Text to be shown on unmatched password */}
                        <div className="field-text" style={{color:"#ff1100", position:"absolute", display:"none"}}>Password must be the same</div>
                    </div>
                    <div onClick={toggleUpdatePassword} className="save-button">Save</div>
                </div>
            </div>

            <div className="d-flex dashboard-container">
                <div className="flex-item-2 dashboard-section-1" style={{marginRight :"3%"}}>
                    
                    <span class="material-icons-round edit-icon" style={{position:"absolute", margin :"-1% 0 0 15%"}}>share</span>
                    
                    <div className="my-profile-image">
                        <img id="image-profile-pic" src={GymLogo} className="profile" />
                        <div className="update-picture d-flex">
                            <span class="material-icons-outlined flex-item-2">photo_camera</span>
                            <input onInput={handleRegisterGym("photo")} type="file" style={{zIndex:"1", width:"5vw"}}/>
                        </div>
                    </div>
                    <div className="d-flex spacing-4">
                        <div className="bold-font my-profile-heading flex-item">Gym profile</div>
                        <span onClick={toggleUpdatePassword} id="edit-password" class="material-icons-round edit-icon flex-item" style={{margin:"0 0 0 4%"}}>vpn_key</span>
                    </div>
                   
                    <div className="spacing-6">
                        <div className="g-font-1">Name</div>
                        <div className="d-flex">
                            <input id="input-gymName" onChange={handleRegisterGym("gymName")} className="my-profile-field pointer-event-toggle" value={gymName} />
                            <span onClick={EditField} id="edit-gymName" class="material-icons-round edit-icon">edit</span>
                            <span onClick={EditField} id="save-gymName" class="material-icons-round edit-icon" style={{display: "none"}}>done</span>
                        </div>
                    </div>


                    <div className="spacing-6">
                        <div className="g-font-1">Email</div>
                        <div className="d-flex">
                            <input id="input-email" className="my-profile-field pointer-event-toggle" onChange={handleRegisterGym("email")}  value={email} />
                            <span onClick={EditField} id="edit-email" class="material-icons-round edit-icon">edit</span>
                            <span onClick={EditField} id="save-email" class="material-icons-round edit-icon" style={{display: "none"}}>done</span>
                        </div>
                    </div>

                    <div className="spacing-6">
                        <div className="g-font-1">Phone</div>
                        <div className="d-flex">
                            <input id="input-phone" onChange={handleRegisterGym("phone")}  className="my-profile-field pointer-event-toggle" value={phone} />
                            <span onClick={EditField} id="edit-phone" class="material-icons-round edit-icon">edit</span>
                            <span onClick={EditField} id="save-phone" class="material-icons-round edit-icon" style={{display: "none"}}>done</span>
                        </div>
                    </div>
                </div>
           
                <div className="dashboard-section-2">
                    <div id="personal-details-container" className="flex-item-2 dashboard-section-container-1 expanded-container-2" style={{margin: "2.5% 0"}}>
                       
                        <div className="d-flex" style={{marginBottom : "2%"}}>
                            <div className="bold-font my-profile-heading" style={{marginRight : "70%"}}>Contact Details</div>
                        </div>
                       
                       <div id="personal-details-content" className="form-scroll-container">
                        <div className="d-flex" style={{flexWrap:"wrap"}}>

                            <div className="spacing-14">
                                <div className="d-flex">
                                    <input id="input-address" onChange={handleRegisterGym("address")}  className="my-profile-field pointer-event-toggle field-expand" value={address} />
                                    <span onClick={EditField} id="edit-address" class="material-icons-round edit-icon">edit</span>
                                    <span onClick={EditField} id="save-address" class="material-icons-round edit-icon" style={{display: "none"}}>done</span>
                                </div>
                            </div>


                            <div className="spacing-7">
                                <div className="g-font-1">State</div>
                                <div role="button" onClick={toggleUnitField("dropdown")} id="container-state" type="text" className="d-flex select-dropdown dropdown-adjust-2">
                                    <div id="text-state" className="select-exercise-text-2 bold-font">{state}</div>
                                    <img  id="icon-state" src={ArrowUp} className="select-exercise-icon"/>
                                </div>

                                <div  id="menu-state" className="measurement-container adjust-container-1" style={{display: "none"}}>
                                    {
                                        statelist.map((data,index)=>{
                                            return (
                                                <div onClick={toggleUnitField("menuItem",data)} id={"item-state-"+index} className="measurement-container-item">{data}</div>
                                            )
                                        })
                                    }
                                    {/* <div onClick={toggleUnitField} id="one-state" className="measurement-container-item">Tripura</div>
                                    <div onClick={toggleUnitField} id="two-state" className="measurement-container-item">Assam</div>
                                    <div onClick={toggleUnitField} id="three-state" className="measurement-container-item">Mizoram</div> */}
                                </div>

                            </div>

                            <div className="spacing-8">
                                <div className="g-font-1">City</div>
                                <div role="button" type="text" onClick={toggleUnitField("dropdown")} id="container-city" className="d-flex select-dropdown dropdown-adjust-2">
                                    <div  id="text-city" className="select-exercise-text-2 bold-font">{city}</div>
                                    <img  id="icon-city" src={ArrowUp} className="select-exercise-icon"/>
                                </div>

                                <div id="menu-city" className="measurement-container adjust-container-1" style={{display: "none"}}>
                                {
                                        citylist.map((data,index)=>{
                                            return (
                                                <div onClick={toggleUnitField("menuItem",data)} id={"item-city-"+index} className="measurement-container-item">{data}</div>
                                            )
                                        })
                                    }
                                    {/* <div onClick={toggleUnitField} id="one-city" className="measurement-container-item">Updaipur</div>
                                    <div onClick={toggleUnitField} id="two-city" className="measurement-container-item">Ramnagar</div>
                                    <div onClick={toggleUnitField} id="three-city" className="measurement-container-item">Abhoynagar</div> */}
                                </div>
                            </div>

                            <div className="spacing-15">
                                <div className="g-font-1">Location</div>
                                <div role="button" onClick={toggleUnitField("dropdown")} id="container-location" type="text" className="d-flex select-dropdown dropdown-adjust-2">
                                    <div  id="text-location" className="select-exercise-text-2 bold-font">{location}</div>
                                    <img  id="icon-location" src={ArrowUp} className="select-exercise-icon"/>
                                </div>

                                <div id="menu-location" className="measurement-container adjust-container-1" style={{display: "none"}}>
                                {
                                        locationlist.map((data,index)=>{
                                            return (
                                                <div onClick={toggleUnitField("menuItem",data)} id={"item-location-"+index} className="measurement-container-item">{data}</div>
                                            )
                                        })
                                    }
                                    {/* <div onClick={toggleUnitField} id="one-location" className="measurement-container-item">Kunjaban Colony</div>
                                    <div onClick={toggleUnitField} id="two-location" className="measurement-container-item">Bhati Abhoynagar</div>
                                    <div onClick={toggleUnitField} id="three-location" className="measurement-container-item">Ujan Abhoynagar</div> */}
                                </div>
                            </div>
                            
                            {/* <div className="form-spacing"></div> */}


                            <div className="spacing-7">
                                <div className="g-font-1">Secondary Email</div>
                                <div className="d-flex">
                                    <input id="input-optional_email" onChange={handleRegisterGym("optional_email")}  className="my-profile-field pointer-event-toggle field-collapse" value={optional_email} />
                                    <span onClick={EditField} id="edit-optional_email" class="material-icons-round edit-icon">edit</span>
                                    <span onClick={EditField} id="save-optional_email" class="material-icons-round edit-icon" style={{display: "none"}}>done</span>
                                </div>
                            </div>

                            <div className="spacing-8">
                                <div className="g-font-1">Secondary Contact No.</div>
                                <div className="d-flex">
                                    <input id="input-optional_phone" onChange={handleRegisterGym("optional_phone")} className="my-profile-field pointer-event-toggle field-collapse" value={optional_phone} />
                                    <span onClick={EditField} id="edit-optional_phone" class="material-icons-round edit-icon">edit</span>
                                    <span onClick={EditField} id="save-optional_phone" class="material-icons-round edit-icon" style={{display: "none"}}>done</span>
                                </div>
                            </div>
                        </div>

                        <div className="d-flex" style={{marginTop : "8%"}}>
                            <div className="bold-font my-profile-heading" style={{marginRight : "70%"}}>Admin Details</div>
                        </div>

                        <div className="d-flex" style={{flexWrap:"wrap"}}>
                            <div className="spacing-7">
                                <div className="g-font-1">First Name</div>
                                <div className="d-flex">
                                    <input id="input-managerFirstname" onChange={handleRegisterGym("managerFirstname")} className="my-profile-field pointer-event-toggle field-collapse" value={managerFirstname} />
                                    <span onClick={EditField} id="edit-managerFirstname" class="material-icons-round edit-icon">edit</span>
                                    <span onClick={EditField} id="save-managerFirstname" class="material-icons-round edit-icon" style={{display: "none"}}>done</span>
                                </div>
                            </div>
                            

                            <div className="spacing-8">
                                <div className="g-font-1">Last Name</div>
                                <div className="d-flex">
                                    <input id="input-managerLastname"  onChange={handleRegisterGym("managerLastname")} className="my-profile-field pointer-event-toggle field-collapse" value={managerLastname} />
                                    <span onClick={EditField} id="edit-managerLastname" class="material-icons-round edit-icon">edit</span>
                                    <span onClick={EditField} id="save-managerLastname" class="material-icons-round edit-icon" style={{display: "none"}}>done</span>
                                </div>
                            </div>

                            {/* <div className="spacing-7">
                                <div className="g-font-1">Email Adress</div>
                                <div className="d-flex">
                                    <input id="input-managerEmail"  onChange={handleRegisterGym("managerEmail")} className="my-profile-field pointer-event-toggle field-collapse" value={managerEmail} />
                                    <span onClick={EditField} id="edit-managerEmail" class="material-icons-round edit-icon">edit</span>
                                    <span onClick={EditField} id="save-managerEmail" class="material-icons-round edit-icon" style={{display: "none"}}>done</span>
                                </div>
                            </div> */}

                            <div className="spacing-7">
                                <div className="g-font-1">Phone Number</div>
                                <div className="d-flex">
                                    <input id="input-managerPhone" onChange={handleRegisterGym("managerPhone")} className="my-profile-field pointer-event-toggle field-collapse" value={managerPhone} />
                                    <span onClick={EditField} id="edit-managerPhone" class="material-icons-round edit-icon">edit</span>
                                    <span onClick={EditField} id="save-managerPhone" class="material-icons-round edit-icon" style={{display: "none"}}>done</span>
                                </div>
                            </div>
                        </div>
                       
                        <div className="d-flex" style={{marginTop : "8%"}}>
                            <div className="bold-font my-profile-heading" style={{marginRight : "70%"}}>Owner Details</div>
                        </div>

                        <div className="d-flex" style={{flexWrap:"wrap"}}>
                            <div className="spacing-7">
                                <div className="g-font-1">First Name</div>
                                <div className="d-flex">
                                    <input id="input-ownerFirstname" onChange={handleRegisterGym("ownerFirstname")} className="my-profile-field pointer-event-toggle field-collapse" value={ownerFirstname} />
                                    <span onClick={EditField} id="edit-ownerFirstname" class="material-icons-round edit-icon">edit</span>
                                    <span onClick={EditField} id="save-ownerFirstname" class="material-icons-round edit-icon" style={{display: "none"}}>done</span>
                                </div>
                            </div>
                            

                            <div className="spacing-8">
                                <div className="g-font-1">Last Name</div>
                                <div className="d-flex">
                                    <input id="input-ownerLastname"  onChange={handleRegisterGym("ownerLastname")} className="my-profile-field pointer-event-toggle field-collapse" value={ownerLastname} />
                                    <span onClick={EditField} id="edit-ownerLastname" class="material-icons-round edit-icon">edit</span>
                                    <span onClick={EditField} id="save-ownerLastname" class="material-icons-round edit-icon" style={{display: "none"}}>done</span>
                                </div>
                            </div>

                            <div className="spacing-7">
                                <div className="g-font-1">Email Adress</div>
                                <div className="d-flex">
                                    <input id="input-ownerEmail"  onChange={handleRegisterGym("ownerEmail")} className="my-profile-field pointer-event-toggle field-collapse" value={ownerEmail} />
                                    <span onClick={EditField} id="edit-ownerEmail" class="material-icons-round edit-icon">edit</span>
                                    <span onClick={EditField} id="save-ownerEmail" class="material-icons-round edit-icon" style={{display: "none"}}>done</span>
                                </div>
                            </div>

                            <div className="spacing-8">
                                <div className="g-font-1">Phone Number</div>
                                <div className="d-flex">
                                    <input id="input-ownerphone" onChange={handleRegisterGym("ownerphone")} className="my-profile-field pointer-event-toggle field-collapse" value={ownerphone} />
                                    <span onClick={EditField} id="edit-ownerphone" class="material-icons-round edit-icon">edit</span>
                                    <span onClick={EditField} id="save-ownerphone" class="material-icons-round edit-icon" style={{display: "none"}}>done</span>
                                </div>
                            </div>
                        </div>
                       
                    </div>
                </div>  
            </div>
        </div>
        

        </Dashboard>
    )
}

