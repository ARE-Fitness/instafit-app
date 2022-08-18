import React, {useState, useEffect} from "react";
import { isAuthenticated } from "../auth";
import Dashboard from '../core/Dashboard';
import { getGym } from "../gym/helper/api";
import { getBranch,updateBranch } from "./helper/api";
import BranchLogo from "../assets/sumo.png";
import ArrowUp from "../assets/arrow-sign.svg"
import {API} from '../backend';

export default function BranchBio(props) {

    const {user, token} = isAuthenticated();
    const BranchId = props.match.params.branchId;
    const GymId = props.match.params.gymId;

    const [flag]=useState(2);

    const [previousField, setPreviousField] = useState("");
    const [Gym,setGym]=useState({gymName:"",email:"",phone:""});
    const {gymName,email,phone}=Gym;
    const [Branch,setBranch]=useState({branchName:"",branchemail:"",branchphone:"",optional_branchemail:"",optional_branchphone:"",totaladminusers:0,totalmembers:0,state:"",location:"",city:"",pincode:"",address:"",active:true,branchId:"",branchmanagerFistname:"",branchmanagerLastname:"",branchmanagerEmail:"",branchmanangerPhone:"",branchmanagerActive:false,error:"",success:""});//save branch info
    const {branchName,branchemail,branchphone,optional_branchemail,optional_branchphone,state,location,totaladminusers,totalmembers,address,city,pincode,active,branchId,branchmanagerFistname,branchmanagerLastname,branchmanagerEmail,branchmanangerPhone,branchmanagerActive}=Branch;//destructuring the branch info 
    const [dashboardData,setdashboardData]=useState({ dashbranchId:"",dashactive:true, dashbranchName:"", dashgymId:"",  dashgymName:"",dashemail:"",dashphone:"",dashbranchemail:"",dashbranchphone:"",dashoptional_branchemail:"",dashoptional_branchphone:""});
    const {dashbranchId,dashactive,dashemail,dashbranchName,dashgymId,dashgymName,dashphone,dashbranchemail,dashbranchphone,dashoptional_branchemail,dashoptional_branchphone}=dashboardData; //used for sending data to gym dashboard

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


    //handler
    const handleChange=name=>event=>{
        setBranch({...Branch,[name]:event.target.value});
    }



    const UpdateBranch= (field,value)=>{
       
        let branchmanager={
            firstname:branchmanagerFistname,
            lastname:branchmanagerLastname,
            email:branchmanagerEmail,
            phone:branchmanangerPhone,
            active:branchmanagerActive
          };
        return updateBranch(user._id,token,BranchId,{[field]:value,branchmanager}).then(data=>{
            if(data.error){
                return false;
            }else{
               return data;
            }
        }).catch(err=>{
            return false;
        })
    }


    const getCurrentBranch = () => {
        getBranch(user._id, token, BranchId).then(data => {
            if(data.error){
                console.log("something went wrong");
            }else{

                console.log(data);
                setBranch({
                    ...Branch,
                    branchName:data.branchName,
                    state: data.state,
                    location: data.location,
                    branchemail:data.branchemail,
                    branchphone:data.branchphone,
                    optional_branchemail:data.optional_branchemail,
                    optional_branchphone:data.optional_branchphone,
                    totalmembers:data.memberList.length,
                    totaladminusers:data.branchAdminList.length,
                    address: data.address,
                    city: data.city,
                    pincode: data.pincode,
                    active:data.active,
                    branchmanagerFistname: data.branchmanager.firstname,
                    branchmanagerLastname: data.branchmanager.lastname,
                    branchmanagerEmail: data.branchmanager.email,
                    branchmanangerPhone: data.branchmanager.phone,
                })
                setTimeout(()=>{
                    if(document.getElementById("image-profile-pic")) document.getElementById("image-profile-pic").src=`${API}/photo-gym/${data.gymId}?${new Date().getTime()}`;
              },100)
 
            }
        })
    }

    const getCurrentBranchGym = () => {
        getGym(user.id, token, GymId).then(data => {
            if(data.error){
                console.log("Something went wrong")
            }else{
                setGym({
                    ...Gym,
                    gymName : data.gymName,
                    email: data.email,
                    phone: data.phone
                })
            }
        })
    }

    const toggleUnitField = (dataId,value) =>(event) => {
        event.preventDefault();
     
        let currentUnitId = event.target.id.split('-')[1];
        switch(dataId){
            case "dropdown":
                console.log('the dropdown is oppened')
            break;
            case "menuItem":
                // setBranch({...Branch,[currentUnitId]:value})
            default:
                console.log(dataId)
        }
        setTimeout(() => {
            if(document.getElementById("menu-" + currentUnitId).style.display == "block"){
                document.getElementById("menu-" + currentUnitId).style.display = "none";
                if(document.getElementById("icon-" + currentUnitId)) document.getElementById("icon-" + currentUnitId).style.transform = "rotate(0deg)";
                setTimeout(async ()=>{
                    let data= await UpdateBranch(currentUnitId,value);
                   
                    setBranch({...Branch,[currentUnitId]:data[currentUnitId]})
                })
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

    const EditField = (event) => {
       let currentField = event.target.id.split('-')[1];
       let fields = ["branchName","branchemail","branchphone","optional_branchemail","optional_branchphone","state","location","totaladminusers","totalmembers","address","city","pincode","active","branchId","branchmanagerFistname","branchmanagerLastname","branchmanagerEmail","branchmanangerPhone","branchmanagerActive"];
       if(Boolean(fields.find(id=>id==currentField)) && (document.getElementById("edit-" + currentField).style.display == "none")){
            document.getElementById("edit-" + currentField).style.display = "block";
            document.getElementById("save-" + currentField).style.display = "none";
            document.getElementById("input-" + currentField).style.pointerEvents = "none";
            if(previousField !== ""){
                document.getElementById("edit-" + previousField).style.display = "block";
                document.getElementById("save-" + previousField).style.display = "none";
                document.getElementById("input-" + previousField).style.pointerEvents = "none";
            }
            setTimeout(async ()=>{
                let data= await UpdateBranch(currentField,Branch[currentField]);
               
                setBranch({...Branch,[currentField]:data[currentField]})
            })
       }else{
            document.getElementById("edit-" + currentField).style.display = "none";
            document.getElementById("save-" + currentField).style.display = "block";
            document.getElementById("input-" + currentField).style.pointerEvents = "auto";
            document.getElementById("input-" + currentField).focus();

       }
       setPreviousField(currentField);
    }

    useEffect(() => {
        getCurrentBranch();
        getCurrentBranchGym();
    },[])

    return(
        <Dashboard flag={flag} data={{
            branchId:BranchId,
            branchName:branchName,
            gymId:GymId,
            gymName:gymName,
            email:email,
            totaladminusers,
            totalmembers,
            phone:phone,
            active:active
        }} navItemData={"Branch"}>
              <div className="d-flex dashboard-container">
                <div className="flex-item-2 dashboard-section-1" style={{marginRight :"3%"}}>
                    
                    <span class="material-icons-round edit-icon" style={{position:"absolute", margin :"-1% 0 0 15%"}}>share</span>
                    
                    <div className="my-profile-image">
                        <img id="image-profile-pic" src={BranchLogo} className="profile" />
                        <div className="update-picture d-flex">
                            <span class="material-icons-outlined flex-item-2">photo_camera</span>
                            <input type="file" style={{zIndex:"1", width:"5vw"}}/>
                        </div>
                    </div>

                    <div className="spacing-4 bold-font my-profile-heading">Branch profile</div>

                    <div className="spacing-6">
                        <div className="g-font-1">Name</div>
                        <div className="d-flex">
                            <input onChange={handleChange("branchName")} id="input-branchName" className="my-profile-field pointer-event-toggle" value={branchName} />
                            <span onClick={EditField} id="edit-branchName" class="material-icons-round edit-icon">edit</span>
                            <span onClick={EditField} id="save-branchName" class="material-icons-round edit-icon" style={{display: "none"}}>done</span>
                        </div>
                    </div>


                    <div className="spacing-6">
                        <div className="g-font-1">Email</div>
                        <div className="d-flex">
                            <input onChange={handleChange("branchemail")} id="input-branchemail" className="my-profile-field pointer-event-toggle" value={branchemail} />
                            <span onClick={EditField} id="edit-branchemail" class="material-icons-round edit-icon">edit</span>
                            <span onClick={EditField} id="save-branchemail" class="material-icons-round edit-icon" style={{display: "none"}}>done</span>
                        </div>
                    </div>

                    <div className="spacing-6">
                        <div className="g-font-1">Phone</div>
                        <div className="d-flex">
                            <input onChange={handleChange("branchphone")} id="input-branchphone" className="my-profile-field pointer-event-toggle" value={branchphone} />
                            <span onClick={EditField} id="edit-branchphone" class="material-icons-round edit-icon">edit</span>
                            <span onClick={EditField} id="save-branchphone" class="material-icons-round edit-icon" style={{display: "none"}}>done</span>
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
                                    <input onChange={handleChange("address")}  id="input-address" className="my-profile-field pointer-event-toggle field-expand" value={address} />
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
                              
                                </div>
                            </div>



                            <div className="spacing-7">
                                <div className="g-font-1">Secondary Email</div>
                                <div className="d-flex">
                                    <input id="input-optional_branchemail" onChange={handleChange("optional_branchemail")}  className="my-profile-field pointer-event-toggle field-collapse" value={optional_branchemail} />
                                    <span onClick={EditField} id="edit-optional_branchemail" class="material-icons-round edit-icon">edit</span>
                                    <span onClick={EditField} id="save-optional_branchemail" class="material-icons-round edit-icon" style={{display: "none"}}>done</span>
                                </div>
                            </div>



                            <div className="spacing-8">
                                <div className="g-font-1">Secondary Contact No.</div>
                                <div className="d-flex">
                                    <input id="input-optional_branchphone" onChange={handleChange("optional_branchphone")} className="my-profile-field pointer-event-toggle field-collapse" value={optional_branchphone} />
                                    <span onClick={EditField} id="edit-optional_branchphone" class="material-icons-round edit-icon">edit</span>
                                    <span onClick={EditField} id="save-optional_branchphone" class="material-icons-round edit-icon" style={{display: "none"}}>done</span>
                                </div>
                            </div>
                            
                            {/* <div className="form-spacing"></div> */}
                        </div>

                        <div className="d-flex" style={{marginTop : "8%"}}>
                            <div className="bold-font my-profile-heading" style={{marginRight : "70%"}}>Admin Details</div>
                        </div>

                        <div className="d-flex" style={{flexWrap:"wrap"}}>
                            <div className="spacing-7">
                                <div className="g-font-1">First Name</div>
                                <div className="d-flex">
                                    <input id="input-branchmanagerFistname" onChange={handleChange("branchmanagerFistname")} className="my-profile-field pointer-event-toggle field-collapse" value={branchmanagerFistname} />
                                    <span onClick={EditField} id="edit-branchmanagerFistname" class="material-icons-round edit-icon">edit</span>
                                    <span onClick={EditField} id="save-branchmanagerFistname" class="material-icons-round edit-icon" style={{display: "none"}}>done</span>
                                </div>
                            </div>

                            <div className="spacing-8">
                                <div className="g-font-1">Last Name</div>
                                <div className="d-flex">
                                    <input id="input-branchmanagerLastname" onChange={handleChange("branchmanagerLastname")} className="my-profile-field pointer-event-toggle field-collapse" value={branchmanagerLastname} />
                                    <span onClick={EditField} id="edit-branchmanagerLastname" class="material-icons-round edit-icon">edit</span>
                                    <span onClick={EditField} id="save-branchmanagerLastname" class="material-icons-round edit-icon" style={{display: "none"}}>done</span>
                                </div>
                            </div>

                            <div className="spacing-7">
                                <div className="g-font-1">Email Address</div>
                                <div className="d-flex">
                                    <input id="input-branchmanagerEmail" onChange={handleChange("branchmanagerEmail")} className="my-profile-field pointer-event-toggle field-collapse" value={branchmanagerEmail} />
                                    <span onClick={EditField} id="edit-branchmanagerEmail" class="material-icons-round edit-icon">edit</span>
                                    <span onClick={EditField} id="save-branchmanagerEmail" class="material-icons-round edit-icon" style={{display: "none"}}>done</span>
                                </div>
                            </div>

                            <div className="spacing-8">
                                <div className="g-font-1">Phone No.</div>
                                <div className="d-flex">
                                    <input id="input-branchmanangerPhone" onChange={handleChange("branchmanangerPhone")} className="my-profile-field pointer-event-toggle field-collapse" value={branchmanangerPhone} />
                                    <span onClick={EditField} id="edit-branchmanangerPhone" class="material-icons-round edit-icon">edit</span>
                                    <span onClick={EditField} id="save-branchmanangerPhone" class="material-icons-round edit-icon" style={{display: "none"}}>done</span>
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