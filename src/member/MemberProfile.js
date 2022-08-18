import React, { useState,useEffect } from 'react';
import Dashboard from '../core/Dashboard';
import MemberLogo from '../assets/sumo.png';
import {getMember,getMedicalHealth,updateMedicalHealth,updateMember} from './helper/api';
import {isAuthenticated} from '../auth/index';
import ArrowUp from "../assets/arrow-sign.svg"
import ArrowDown from "../assets/arrow-down.svg";
import MoreInfo from "../assets/more-info.png";
import {API} from '../backend'

export default function MemberBio (props) {

    const [previousField, setPreviousField] = useState("");
    const [Member,setMember]=useState({ 
        memberId:"",
        mfname:"",
        mlname:"",
        memail:"",
        mphone:"",
        moptional_phone:"",
        moptional_contactperson:"",
        madress:"",
        mstate:"",
        mcity:"",
        mlocation:"",
        mpincode:"",
        dateofbirth:"",
        height:"",
        heightUnit:"",
        weight:"",
        weightUnit:"",
        workout_experience:"",
        body_type:"",
        fitness_goal:"",
        id_document:"",
        other_detail:"",
        active:"",
        formData:new FormData()
    });//save member info ( name,phone,email )
    const {
        memberId,
        mfname,
        mlname,
        memail,
        mphone,
        moptional_phone,
        moptional_contactperson,
        madress,
        mstate,
        mcity,
        mlocation,
        mpincode,
        dateofbirth,
        height,
        heightUnit,
        weight,
        weightUnit,
        workout_experience,
        body_type,
        fitness_goal,
        id_document,
        other_detail,
        active,
        formData
     }=Member;//destrucuring member 
    const [Branch,setBranch]=useState({branchName:"",gymId:"",branchId:""});//storing branch after getting 
    const {branchName,gymId,branchId}=Branch;//destructuring branch data
    const [Gym,setGym]=useState({gymName:"",phone:"",email:""});//store gym basic info
    const {gymName,phone,email}=Gym;//destructureing gym hooks
    const [MedicalHealth,setMedicalHealth]=useState({
        medicalhealthId:"",
        Conditions:[
            {
                question:"Are you currently under a doctor's supervision ?",
                isMarked:false,
                attributes:[
                    {
                         itemName:"Doctor",
                         itemValue:"Doctor Name"
                    },
                    {
                        itemName:"Condition",
                        itemValue:"Medicl Condition"
                   }
                ]
            },
            {
                question:"Have you ever had an exercise stress test ?",
                isMarked:false,
                attributes:[
                    {
                        itemName:"Doctor",
                        itemValue:"Doctor Name"
                   },
                   {
                       itemName:"Condition",
                       itemValue:"Medical Condition"
                  }
                ]
            },
            {
                question:"Do you smoke ?",
                isMarked:false,
                attributes:[
                    {
                         itemName:"Frequency",
                         itemValue:"Select Frequency"
                    },
                    {
                        itemName:"Since",
                        itemValue:"Select Date"
                   }
                ]
            },
            {
                question:"Do you take alcohol?",
                isMarked:false,
                attributes:[
                    {
                         itemName:"RadioButtonChoice",
                         itemValue:"Ocationally"
                    },
                    {
                        itemName:"Since",
                        itemValue:"Select Date"
                   }
                ]
            },
            {
                question:"Are you pregnant ?",
                isMarked:false,
                attributes:[
                    {
                         itemName:"Phase",
                         itemValue:"Phase 1"
                    }
                ]
            },
            {
                question:"Is your stress level high?",
                isMarked:false,
                attributes:[
                    
                ]
            },
            {
                question:"High Blood Pressure ?",
                isMarked:false,
                attributes:[
                    {
                         itemName:"SBP",
                         itemValue:"SBP Value"
                    },
                    {
                        itemName:"Date-SBP",
                        itemValue:"Select Date"
                   },
                   {
                        itemName:"DBP",
                        itemValue:"DBP value"
                    },
                    {
                        itemName:"Date-DBP",
                        itemValue:"Select Date"
                    }
                ]
            },
            {
                question:"High cholestrol ?",
                isMarked:false,
                attributes:[
                    {
                         itemName:"Result",
                         itemValue:"value"
                    }
                ]
            },
            {
                question:"Diabetes ?",
                isMarked:false,
                attributes:[
                    {
                         itemName:"Value in mg/dl",
                         itemValue:"Doctor Name"
                    },
                    {
                        itemName:"Type",
                        itemValue:"Select Type"
                   }
                ]
            },
            {
                question:"Any bone or joint injury in the past ?",
                isMarked:false,
                attributes:[
                    {
                         itemName:"Mention in details",
                         itemValue:"Enter your details here"
                    }
                ]
            },
            {
                question:"Any muscle or ligament injury in the past?",
                isMarked:false,
                attributes:[
                    {
                         itemName:"Mention in details",
                         itemValue:"Enter your details here"
                    }
                ]
            },
        ],
        medical_clearence_document:"",
        isUploaded:false,
        other_conditions:"",
    })
    const {Conditions,medical_clearence_document,isUploaded,other_conditions}=MedicalHealth;

    const {user,token}=isAuthenticated() 

    const [statelist,setstatelist]=useState([
        "Amaravati","Itanagar","Itanagar","Patna","Tripura","West Bengal","Maharastra"
    ]);
    const [citylist,setcitylist]=useState([
        "Pune","Mumbai","Aurangabad"
    ]);
    const [locationlist,setlocationlist]=useState([
        "Ram Nagar", "Wagholi","Fulkumari"
    ])



    //handler methods

    const handleMemberChange=name=>event=>{
        event.preventDefault();
        let value=(name=="photo"||name=="id_document")?event.target.files[0]:event.target.value;
        setMember({
            ...Member,
            [name]:event.target.value
        });
        formData.set(name,value);
    }


    const handleMedicalHealth= (name,data)=>async event=>{
        event.preventDefault()
        
      
        await setMedicalHealth(oldstate=>{
            if(name=="Conditions"){
                 if(data.itemName=="isMarked"){
                     oldstate['Conditions'][data.index]['isMarked']=(oldstate['Conditions'][data.index]['isMarked'])?false:true;
                 }
            }
            return ({...oldstate})
        })

        console.log()

        // let medicalhealthdata=await UpdateMedicalHealth(name);
        // setMedicalHealth({
        //     ...MedicalHealth,
        //     workout_experience:medicalhealthdata.workout_experience,
        //     Conditions:medicalhealthdata.Conditions,
        //     medical_clearence_document:medicalhealthdata.medical_clearence_document,
        //     medicalhealthId:medicalhealthdata._id
        // })

    }




    const setCurrentValue =(event) => {
        event.preventDefault();
        let toggleField = event.target.id.split('-')[1];
         
        if(document.getElementById("text-" + toggleField).innerHTML == "No"){
            setTimeout(() => {
                document.getElementById("mode-" + toggleField).classList.remove("form-toggle-ball");
                document.getElementById("mode-" + toggleField).classList.add("form-toggle-ball-active");
                document.getElementById("text-" + toggleField).innerHTML = "Yes";
                if(document.getElementById("data-" + toggleField)) document.getElementById("data-" + toggleField).style.display = "block";
            }, 10);
            
        }else{
            setTimeout(() => {
                document.getElementById("mode-" + toggleField).classList.remove("form-toggle-ball-active");
                document.getElementById("mode-" + toggleField).classList.add("form-toggle-ball");
                document.getElementById("text-" + toggleField).innerHTML = "No";
                if(document.getElementById("data-" + toggleField)) document.getElementById("data-" + toggleField).style.display = "none";
            }, 10);
        }
    }

    const toggleUnitField=(choice,value)=>(event) => {
        event.preventDefault();
        let currentUnitId = event.target.id.split('-')[1];
        switch(choice){
            case "dropdown":
            break;
            case "menuItem":
                setMember({
                    ...Member,
                    [currentUnitId]:value
                });
                formData.set(currentUnitId,value)
            break;
        }
        setTimeout(() => {
            if(document.getElementById("menu-" + currentUnitId).style.display == "block"){
                document.getElementById("menu-" + currentUnitId).style.display = "none";
                if(document.getElementById("icon-" + currentUnitId)) document.getElementById("icon-" + currentUnitId).style.transform = "rotate(0deg)";
                setTimeout(async ()=>{
                    let data=await UpdateMember();
                    if(data!=false){
                        setMember({...Member,[currentUnitId]:data[currentUnitId]})
                    }else{
                        console.log('unable to fetch data')
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

    const EditField = (event) => {
       let currentField = event.target.id.split('-')[1];
       let fields = [
        "mfname",
        "mlname",
        "memail",
        "mphone",
        "moptional_phone",
        "moptional_contactperson",
        "madress",
        "mstate",
        "mcity",
        "mlocation",
        "mpincode",
        "dateofbirth",
        "height",
        "heightUnit",
        "weight",
        "weightUnit",
        "workout_experience",
        "body_type",
        "fitness_goal",
        "id_document",
        "other_detail",
        "Conditions",
        "medical_clearence_document"
        ,"isUploaded","other_conditions"
       ];
       
       if(new Boolean(fields.find(id=>id==currentField)) && (document.getElementById("edit-" + currentField).style.display == "none")){
            document.getElementById("edit-" + currentField).style.display = "block";
            document.getElementById("save-" + currentField).style.display = "none";
            document.getElementById("input-" + currentField).style.pointerEvents = "none";
            if(previousField !== ""){
                document.getElementById("edit-" + previousField).style.display = "block";
                document.getElementById("save-" + previousField).style.display = "none";
                document.getElementById("input-" + previousField).style.pointerEvents = "none";
            }
            setTimeout(async ()=>{
                let data=await UpdateMember();
                if(data!=false){
                    setMember({...Member,[currentField]:data[currentField]});
                }else{
                    console.log('unable to fetch data')
                }
                let medicalhealthdata= await UpdateMedicalHealth(fields);
                setMedicalHealth({
                    ...MedicalHealth,
                    workout_experience:medicalhealthdata.workout_experience,
                    Conditions:medicalhealthdata.Conditions,
                    medical_clearence_document:medicalhealthdata.medical_clearence_document,
                    medicalhealthId:medicalhealthdata._id
                })

            },100)
       }else{
            document.getElementById("edit-" + currentField).style.display = "none";
            document.getElementById("save-" + currentField).style.display = "block";
            document.getElementById("input-" + currentField).style.pointerEvents = "auto";
            document.getElementById("input-" + currentField).focus();

          
          
       }

       setPreviousField(currentField);
    }
    

    function showFileName( event ) {

        var fileName = event.target.files[0].name.substring(0, 14);

        var infoArea = document.getElementById( 'file-upload-filename' );
        infoArea.textContent = fileName;

        //console
        //var inputFile =  document.getElementById("file-upload-text");

        // if(infoArea.innerText.toString.trim == ""){
        //     infoArea.style.display = "none";
        //     inputFile.style.display = "block";
        // }else{
        //     infoArea.style.display = "block";
        //     inputFile.style.display = "none";
        // }
    }


    const toggleExpandDashboard = () => {
        if(document.getElementById("personal-details-content").style.display == "block"){
            document.getElementById("personal-details-content").style.display = "none";
            document.getElementById("personal-details-container").classList.add("collapsed-container");
            document.getElementById("personal-details-container").classList.remove("expanded-container");
            document.getElementById("medical-heath-content").style.display = "block";
            document.getElementById("medical-health-container").classList.add("expanded-container");
            document.getElementById("medical-health-container").classList.remove("collapsed-container");
            document.getElementById("personal-close").style.display = "none";
            document.getElementById("personal-open").style.display = "block";
            document.getElementById("medical-open").style.display = "none";
            document.getElementById("medical-close").style.display = "block";

        }else{
            document.getElementById("personal-details-content").style.display = "block";
            document.getElementById("personal-details-container").classList.add("expanded-container");
            document.getElementById("personal-details-container").classList.remove("collapsed-container");
            document.getElementById("medical-heath-content").style.display = "none";
            document.getElementById("medical-health-container").classList.add("collapsed-container");
            document.getElementById("medical-health-container").classList.remove("expanded-container");
            document.getElementById("personal-close").style.display = "block";
            document.getElementById("personal-open").style.display = "none";
            document.getElementById("medical-open").style.display = "block";
            document.getElementById("medical-close").style.display = "none";
        }
    }


    //API
    const GetThisMember=branchId=>{
        return getMember(user._id,token,branchId).then(data=>{
            if(data.error){
                return false;
            }else{
                return data;
            }
        }).catch(err=>{
            return false;
        })
    }
    const GetMedicalHealth=medicalhealthId=>{
        return getMedicalHealth(user._id,token,medicalhealthId).then(data=>{
            if(data.error){
                return false;
            }else{
                return data;
            }
        }).catch(err=>{
            return false;
        })
    }

    const UpdateMember=()=>{
        return updateMember(user._id,token,memberId,formData).then(data=>{
            if(data.error){
                return false;
            }
            else{
                return data;
            }
        }).catch(err=>{
            return false;
        })
    }

    const UpdateMedicalHealth=field=>event=>{
        event.preventDefault()
        return updateMedicalHealth(user._id,token,{[field]:MedicalHealth[field]}).then(data=>{
            if(data.error){
                return false;
            }else{
                return data;
            }
        }).catch(err=>{
            return false;
        })
    }

    useEffect(async ()=>{
        let data= await GetThisMember(props.match.params.memberId);
        if(data!=false){
   
            setMember({
                ...Member,
                memberId:data._id,
                mfname:data.mfname,
                mlname:data.mlname,
                mphone:data.mphone,
                memail:data.memail,
                active:data.active,
                moptional_phone:data.moptional_phone,
                moptional_contactperson:data.moptional_contactperson,
                madress:data.madress,
                mstate:data.mstate,
                mcity:data.mcity,
                heightUnit:data.heightUnit,
                weightUnit:data.weightUnit,
                mlocation:data.mlocation,
                mpincode:data.mpincode,
                dateofbirth:data.dateofbirth,
                height:data.height,
                weight:data.weight,
                workout_experience:data.workout_experience,
                body_type:data.body_type,
                fitness_goal:data.fitness_goal,
                id_document:data.id_document,
                other_detail:data.other_detail      
            });


            let medicalhealth=await GetMedicalHealth(user._id,token,data.medicalHealth);
      
          
            if(medicalhealth!=false){
                setMedicalHealth({
                    ...MedicalHealth,
                    medicalhealthId:medicalhealth._id,
                    medical_clearence_document:medicalhealth.medical_clearence_document,
                    Conditions:medicalhealth.Conditions,
                    other_conditions:medicalhealth.other_conditions,
                    isUploaded:medicalhealth.isUploaded
                });
            }


        }

    },[])

    return(
        <Dashboard flag={3} navItemData={"Member"}  data={{
            memberId,
            mfname,
            mlname,
            mphone,
            memail,
            active,
            formrole:0
          }} itemId={memberId} navItemData={"Member"}>
            <div className="d-flex dashboard-container">
                <div className="flex-item-2 dashboard-section-1" style={{marginRight :"3%"}}>
                <span class="material-icons-round edit-icon" style={{position:"absolute", margin :"-1% 0 0 15%"}}>share</span>
                    <div className="my-profile-image">
                        <img src={MemberLogo}
                        // src={`${API}/get-member-photo/${props.match.params.memberId}`} 
                        className="profile" />
                        <div className="update-picture d-flex">
                            <span class="material-icons-outlined flex-item-2">photo_camera</span>
                        </div>
                    </div>
                    <div className="spacing-4 bold-font my-profile-heading">My profile</div>
                    <div className="spacing-6">
                        <div className="g-font-1">Fist Name</div>
                        <div className="d-flex">
                            <input id="input-mfname" onChange={handleMemberChange("mfname")} className="my-profile-field pointer-event-toggle" value={mfname} />
                            <span onClick={EditField} id="edit-mfname" class="material-icons-round edit-icon">edit</span>
                            <span onClick={EditField} id="save-mfname" class="material-icons-round edit-icon" style={{display: "none"}}>done</span>
                        </div>
                    </div>
                    <div className="spacing-6">
                        <div className="g-font-1">Last Name</div>
                        <div className="d-flex">
                            <input id="input-mlname" onChange={handleMemberChange("mlname")} className="my-profile-field pointer-event-toggle" value={mlname} />
                            <span onClick={EditField} id="edit-mlname" class="material-icons-round edit-icon">edit</span>
                            <span onClick={EditField} id="save-mlname" class="material-icons-round edit-icon" style={{display: "none"}}>done</span>
                        </div>
                    </div>


                    <div className="spacing-6">
                        <div className="g-font-1">Email</div>
                        <div className="d-flex">
                            <input id="input-memail" onChange={handleMemberChange("memail")} className="my-profile-field pointer-event-toggle" value={memail} />
                            <span onClick={EditField} id="edit-memail" class="material-icons-round edit-icon">edit</span>
                            <span onClick={EditField} id="save-memail" class="material-icons-round edit-icon" style={{display: "none"}}>done</span>
                        </div>
                    </div>

                    <div className="spacing-6">
                        <div className="g-font-1">Phone</div>
                        <div className="d-flex">
                            <input id="input-mphone" onChange={handleMemberChange("mphone")} className="my-profile-field pointer-event-toggle" value={mphone} />
                            <span onClick={EditField} id="edit-mphone" class="material-icons-round edit-icon">edit</span>
                            <span onClick={EditField} id="save-mphone" class="material-icons-round edit-icon" style={{display: "none"}}>done</span>
                        </div>
                    </div>
                    
                    
                </div>
                <div className="dashboard-section-2" >
                    <div id="personal-details-container" className="flex-item-2 dashboard-section-container-1 expanded-container" style={{margin: "2.5% 0 4.8% 0"}}>
                       <div className="d-flex" style={{marginBottom : "4%"}}>
                            <div className="bold-font my-profile-heading" style={{marginRight : "70%"}}>Personal Details</div>
                            <span id="personal-close" onClick={toggleExpandDashboard} class="material-icons-round edit-icon flex-item-2">close_fullscreen</span>
                            <span id="personal-open" onClick={toggleExpandDashboard} style={{display:"none"}} class="material-icons-round edit-icon flex-item-2">open_in_full</span>
                       </div>
                       
                       <div id="personal-details-content" className="form-scroll-container">
                        <div className="d-flex" style={{flexWrap:"wrap"}}>

                            <div className="spacing-14">
                                <div className="d-flex">
                                    <input id="input-madress" onChange={handleMemberChange("madress")} className="my-profile-field pointer-event-toggle field-expand" value={madress} />
                                    <span onClick={EditField} id="edit-madress" class="material-icons-round edit-icon">edit</span>
                                    <span onClick={EditField} id="save-madress" class="material-icons-round edit-icon" style={{display: "none"}}>done</span>
                                </div>
                            </div>


                            <div className="spacing-7">
                                <div className="g-font-1">State</div>
                                <div type="text"  onClick={toggleUnitField("dropdown")}  id="container-mstate" className="d-flex select-dropdown dropdown-adjust-2">
                                    <div id="text-mstate" className="select-exercise-text-2 bold-font">{mstate==""?"Select State":mstate}</div>
                                    <img id="icon-mstate" src={ArrowUp} className="select-exercise-icon"/>
                                </div>

                                <div id="menu-mstate" className="measurement-container adjust-container-1" style={{display: "none"}}>
                                    {
                                        statelist.map((data,index)=>{
                                            return(
                                                <div onClick={toggleUnitField("menuItem",data)} id={index+"on-mstate"} className="measurement-container-item">{data}</div>
                                            )
                                        })
                                    }
                                    {/* <div onClick={toggleUnitField} id="one-stateField" className="measurement-container-item">Tripura</div>
                                    <div onClick={toggleUnitField} id="two-stateField" className="measurement-container-item">Assam</div>
                                    <div onClick={toggleUnitField} id="three-stateField" className="measurement-container-item">Mizoram</div> */}
                                </div>
                            </div>

                            <div className="spacing-8">
                                <div className="g-font-1">City</div>
                                <div onClick={toggleUnitField("dropdown")}  id="container-mcity" type="text" className="d-flex select-dropdown dropdown-adjust-2">
                                    <div  id="text-mcity" className="select-exercise-text-2 bold-font">{mcity==""?"Select City":mcity}</div>
                                    <img  id="icon-mcity" src={ArrowUp} className="select-exercise-icon"/>
                                </div>

                                <div id="menu-mcity" className="measurement-container adjust-container-1" style={{display: "none"}}>
                                   {
                                        citylist.map((data,index)=>{
                                            return(
                                                <div onClick={toggleUnitField("menuItem",data)} id={index+"on-mcity"} className="measurement-container-item">{data}</div>
                                            )
                                        })
                                    }
                                    {/* <div onClick={toggleUnitField} id="one-cityField" className="measurement-container-item">Updaipur</div>
                                    <div onClick={toggleUnitField} id="two-cityField" className="measurement-container-item">Ramnagar</div>
                                    <div onClick={toggleUnitField} id="three-cityField" className="measurement-container-item">Abhoynagar</div> */}
                                </div>
                            </div>

                            <div className="spacing-15">
                                <div className="g-font-1">Location</div>
                                <div onClick={toggleUnitField("dropdown")}  id="container-mlocation" type="text" className="d-flex select-dropdown dropdown-adjust-2">
                                    <div  id="text-mlocation" className="select-exercise-text-2 bold-font">{mlocation==""?"Select Location":mlocation}</div>
                                    <img  id="icon-mlocation" src={ArrowUp} className="select-exercise-icon"/>
                                </div>

                                <div id="menu-mlocation" className="measurement-container adjust-container-1" style={{display: "none"}}>
                                    {
                                        locationlist.map((data,index)=>{
                                            return(
                                                <div onClick={toggleUnitField("menuItem",data)} id={index+"on-mlocation"} className="measurement-container-item">{data}</div>
                                            )
                                        })
                                    }
                                    {/* <div onClick={toggleUnitField} id="one-locationField" className="measurement-container-item">Kunjaban Colony</div>
                                    <div onClick={toggleUnitField} id="two-locationField" className="measurement-container-item">Bhati Abhoynagar</div>
                                    <div onClick={toggleUnitField} id="three-locationField" className="measurement-container-item">Ujan Abhoynagar</div> */}
                                </div>
                            </div>
                            
                            {/* <div className="form-spacing"></div> */}


                            <div className="spacing-7">
                                <div className="g-font-1">Date of Birth</div>
                                <div className="d-flex">
                                    <input id="input-dateofbirth"  onChange={handleMemberChange("dateofbirth")}  className="my-profile-field pointer-event-toggle field-collapse" value={dateofbirth} />
                                    <span onClick={EditField} id="edit-dateofbirth" class="material-icons-round edit-icon">edit</span>
                                    <span onClick={EditField} id="save-dateofbirth" class="material-icons-round edit-icon" style={{display: "none"}}>done</span>
                                </div>
                            </div>

                            <div className="spacing-8">
                                <div className="d-flex"  onClick={toggleUnitField("dropdown")} id="unit-heightUnit">
                                    <div className="g-font-1"   id="text-heightUnit">Height {heightUnit}</div>
                                    <img src={ArrowUp}  id="icon-heightUnit" className="arrow-icon-select"/>
                                    <div id="menu-heightUnit" className="measurement-container" style={{display: "none"}}>
                                        {
                                            ["Feet (ft)","Centimeter (cm)"].map((data,index)=>{
                                                return (
                                                    <div onClick={toggleUnitField("menuItem",data)} id={index+"on-heightUnit"} className="measurement-container-item">{data}</div>
                                                )
                                            })
                                        }
                                        {/* <div onClick={toggleUnitField} id="one-heightUnit" className="measurement-container-item">Feet (ft)</div>
                                        <div onClick={toggleUnitField} id="two-heightUnit" className="measurement-container-item">Centimeter (cm)</div> */}
                                    </div>
                                </div>
                               
                                <div className="d-flex">
                                    <input id="input-height"  onChange={handleMemberChange("height")}   className="my-profile-field pointer-event-toggle field-collapse" value={height} />
                                    <span onClick={EditField} id="edit-height" class="material-icons-round edit-icon">edit</span>
                                    <span onClick={EditField} id="save-height" class="material-icons-round edit-icon" style={{display: "none"}}>done</span>
                                </div>
                            </div>

                            <div className="spacing-7">
                                <div onClick={toggleUnitField("dropdown")} className="d-flex" id="unit-weightUnit">
                                    <div className="g-font-1"   id="text-weightUnit">Weight {weightUnit}</div>
                                    <img src={ArrowUp}  id="icon-weightUnit"  className="arrow-icon-select"/>
                                    <div id="menu-weightUnit" className="measurement-container" style={{display: "none"}}>
                                        {
                                            ['Kilogram (KG)','Pound (lbs)'].map((data,index)=>{
                                                return (
                                                    <div onClick={toggleUnitField("menuItem",data)} id={index+"on-weightUnit"} className="measurement-container-item">{data}</div>
                                                )
                                            })
                                        }
                                        {/* <div onClick={toggleUnitField("menuItem",)} id="one-weightUnit" className="measurement-container-item">Kilogram (KG)</div>
                                        <div onClick={toggleUnitField} id="two-weightUnit" className="measurement-container-item">Pound (lbs)</div> */}
                                    </div>
                                </div>
                                <div className="d-flex">
                                    <input  onChange={handleMemberChange("weight")} id="input-weight" className="my-profile-field pointer-event-toggle field-collapse" value={weight} />
                                    <span onClick={EditField} id="edit-weight" class="material-icons-round edit-icon">edit</span>
                                    <span onClick={EditField} id="save-weight" class="material-icons-round edit-icon" style={{display: "none"}}>done</span>
                                </div>
                            </div>

                            <div className="spacing-8">
                                <div className="g-font-1">Emergency Contact No.</div>
                                <div className="d-flex">
                                    <input  onChange={handleMemberChange("moptional_phone")} id="input-moptional_phone" className="my-profile-field pointer-event-toggle field-collapse" value={moptional_phone} />
                                    <span onClick={EditField} id="edit-moptional_phone" class="material-icons-round edit-icon">edit</span>
                                    <span onClick={EditField} id="save-moptional_phone" class="material-icons-round edit-icon" style={{display: "none"}}>done</span>
                                </div>
                            </div>


                            <div className="spacing-7">
                                <div className="g-font-1">Workout Experience</div>
                                <div className="d-flex">
                                    <input  onChange={handleMemberChange("workout_experience")}  id="input-workout_experience" className="my-profile-field pointer-event-toggle field-collapse" value={workout_experience} />
                                    <span onClick={EditField} id="edit-workout_experience" class="material-icons-round edit-icon">edit</span>
                                    <span onClick={EditField} id="save-workout_experience" class="material-icons-round edit-icon" style={{display: "none"}}>done</span>
                                </div>
                            </div>

                            
                            <div className="spacing-8">
                                <div className="g-font-1">Emergency Contact Name</div>
                                <div className="d-flex">
                                    <input onChange={handleMemberChange("moptional_contactperson")} id="input-moptional_contactperson" className="my-profile-field pointer-event-toggle field-collapse" value={moptional_contactperson} />
                                    <span onClick={EditField} id="edit-moptional_contactperson" class="material-icons-round edit-icon">edit</span>
                                    <span onClick={EditField} id="save-moptional_contactperson" class="material-icons-round edit-icon" style={{display: "none"}}>done</span>
                                </div>
                            </div>

                            

                            <div className="spacing-7">
                                <div className="g-font-1">Body Type</div>
                                <div type="text" id="container-body_type" onClick={toggleUnitField("dropdown")} className="d-flex select-dropdown dropdown-adjust">
                                    <div  id="text-body_type" className="select-exercise-text-2 bold-font">{(!body_type||body_type=="")?`Select Body Type`:body_type}</div>
                                    <img   id="icon-body_type"src={ArrowUp} className="select-exercise-icon"/>
                                </div>
                                <div id="menu-body_type" className="measurement-container adjust-container-1" style={{display: "none"}}>
                                    {
                                        ["Lean","Athleatic","Over Weight"].map((data,index)=>{
                                            return(
                                                <div onClick={toggleUnitField("menuItem",data)} id={index+"on-body_type"} className="measurement-container-item">{data}</div>        
                                            )
                                        })
                                    }
                                    {/* <div onClick={toggleUnitField} id="one-bodyField" className="measurement-container-item">Lean</div>
                                    <div onClick={toggleUnitField} id="two-bodyField" className="measurement-container-item">Athleatic</div>
                                    <div onClick={toggleUnitField} id="three-bodyField" className="measurement-container-item">Over Weight</div> */}
                                    
                                </div>
                            </div>

                            <div className="spacing-8">
                                <div className="g-font-1">Fitnes Goal</div>
                                <div className="d-flex">
                                    <input onChange={handleMemberChange("fitness_goal")}  id="input-fitness_goal" className="my-profile-field pointer-event-toggle field-collapse" value={fitness_goal} />
                                    <span onClick={EditField} id="edit-fitness_goal" class="material-icons-round edit-icon">edit</span>
                                    <span onClick={EditField} id="save-fitness_goal" class="material-icons-round edit-icon" style={{display: "none"}}>done</span>
                                </div>
                            </div>

                            <div className="spacing-7">
                                <div className="g-font-1">Upload member id proof</div>
                                <div className="d-flex">
                                    <div className="d-flex">
                                        <form>
                                            <input onInput={handleMemberChange("id_document")} type="file" id="file-upload"/>
                                            <label for="file-upload" style={{whiteSpace: "nowrap"}}>
                                                <div id="file-upload-text" className="my-profile-field pointer-event-toggle field-collapse">{(id_document==""||!id_document)?`Upload File`:id_document.substring(0,17)}{(id_document&&id_document.length>17)?"...":""}</div>
                                                <div id="file-upload-filename" className="my-profile-field pointer-event-toggle field-collapse" style={{display:"none"}}></div>
                                            </label>
                                            
                                        </form>
                                        <span id="edit-fileUpload" class="material-icons-round edit-icon spacing-19">file_download</span>
                                        <span id="edit-fileUpload" class="material-icons-round edit-icon" style={{marginBottom:"2%"}}>visibility</span>
                                        

                                        
                                    </div>

                                </div>
                            </div>

                            <div className="spacing-17">
                                <div className="d-flex">
                                    <input id="input-other_detail" className="my-profile-field pointer-event-toggle field-expand" value={other_detail} />
                                    <span onClick={EditField}  id="edit-other_detail" class="material-icons-round edit-icon">edit</span>
                                    <span onClick={EditField} id="save-other_detail" class="material-icons-round edit-icon" style={{display: "none"}}>done</span>
                                </div>
                            </div>
                        </div>
                    </div>
                        
                        
                    </div>
                        
                   
                    <div id="medical-health-container" className="flex-item-2 dashboard-section-container-1 collapsed-container">
                        <div className="d-flex" style={{marginBottom : "4%"}}>
                            <div className="bold-font my-profile-heading" style={{marginRight : "70%"}}>Medical Health</div>
                            <span onClick={toggleExpandDashboard} id="medical-open" class="material-icons-round edit-icon flex-item-2">open_in_full</span>
                            <span onClick={toggleExpandDashboard} id="medical-close" style={{display:"none"}} class="material-icons-round edit-icon flex-item-2">close_fullscreen</span>
                        </div>

                        <div id="medical-heath-content" className="form-scroll-container" style={{display:"none"}}>
                    
                            
                          
                                <div className="d-flex spacing-12">
                                        <div className="form-question">{Conditions[0].question}</div>
                                        <div className="form-toggle-button">
                                            <div role="button" onClick={handleMedicalHealth("Conditions",{index:0,itemName:"isMarked"})} id="mode-toggle1" className={`d-flex ${(Conditions[0].isMarked)?"form-toggle-ball-active":"form-toggle-ball"}`}>
                                                <div id="text-toggle1" className="flex-item-2">{(Conditions[0].isMarked)?`Yes`:`No`}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="data-toggle1" style={{display:(Conditions[0].isMarked)?'block':'none'}}>
                                        <div className="d-flex">
                                            <div className="spacing-20">
                                                <div className="g-font-1">Doctor</div>
                                                <div className="d-flex">
                                                    <input id="input-doctorName" className="my-profile-field pointer-event-toggle field-collapse" value={Conditions[0].attributes[0].itemValue} />
                                                    <span onClick={EditField} id="edit-doctorName" class="material-icons-round edit-icon">edit</span>
                                                    <span onClick={EditField} id="save-doctorName" class="material-icons-round edit-icon" style={{display: "none"}}>done</span>
                                                </div>
                                            </div>
        
                                            <div className="spacing-20" style={{margin: "0 0 0 10%"}}>
                                                <div className="g-font-1">Condition</div>
                                                <div className="d-flex">
                                                    <input id="input-medCondition" className="my-profile-field pointer-event-toggle field-collapse" value={Conditions[0].attributes[1].itemValue} />
                                                    <span onClick={EditField} id="edit-medCondition" class="material-icons-round edit-icon">edit</span>
                                                    <span onClick={EditField} id="save-medCondition" class="material-icons-round edit-icon" style={{display: "none"}}>done</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                 
                     
                         <div className="d-flex spacing-12">
                                <div className="form-question">Have you ever had an exercise stress test ?</div>
                                <div className="form-toggle-button">
                                    <div role="button" id="mode-toggle2"  onClick={ handleMedicalHealth("Conditions",{index:1,itemName:"isMarked"})} className={`d-flex ${(Conditions[1].isMarked)?"form-toggle-ball-active":"form-toggle-ball"}`}>
                                        <div id="text-toggle2" className="flex-item-2">{(Conditions[1].isMarked)?`Yes`:`No`}</div>
                                    </div>
                                </div>
                            </div>
                            <div id="data-toggle2"  style={{display:(Conditions[1].isMarked)?'block':'none'}}>
                                <div className="d-flex">
                                    <div className="spacing-20">
                                        <div className="g-font-1">Doctor</div>
                                        <div className="d-flex">
                                            <input id="input-doctorName" className="my-profile-field pointer-event-toggle field-collapse" value={Conditions[1].attributes[0].itemValue} />
                                            <span onClick={EditField} id="edit-doctorName" class="material-icons-round edit-icon">edit</span>
                                            <span onClick={EditField} id="save-doctorName" class="material-icons-round edit-icon" style={{display: "none"}}>done</span>
                                        </div>
                                    </div>

                                    <div className="spacing-20" style={{margin: "0 0 0 10%"}}>
                                        <div className="g-font-1">Condition</div>
                                        <div className="d-flex">
                                            <input id="input-medCondition" className="my-profile-field pointer-event-toggle field-collapse" value={Conditions[1].attributes[1].itemValue} />
                                            <span onClick={EditField} id="edit-medCondition" class="material-icons-round edit-icon">edit</span>
                                            <span onClick={EditField} id="save-medCondition" class="material-icons-round edit-icon" style={{display: "none"}}>done</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="d-flex spacing-12">
                                <div className="form-question">Do you smoke ?</div>
                                <div className="form-toggle-button">
                                    <div role="button" id="mode-toggle3"  onClick={ handleMedicalHealth("Conditions",{index:2,itemName:"isMarked"})} className={`d-flex  ${(Conditions[2].isMarked)?"form-toggle-ball-active":"form-toggle-ball"}`}>
                                        <div id="text-toggle3" className="flex-item-2">{(Conditions[2].isMarked)?`Yes`:`No`}</div>
                                    </div>
                                </div>
                            </div>
                            <div id="data-toggle3"  style={{display:(Conditions[2].isMarked)?'block':'none'}}>
                                <div className="d-flex">
                                    <div className="spacing-20">
                                        <div className="g-font-1">Frequency</div>
                                        <div className="d-flex">
                                            <input id="input-freqTime" className="my-profile-field pointer-event-toggle field-collapse" value={Conditions[2].attributes[0].itemValue} />
                                            <span onClick={EditField} id="edit-freqTime" class="material-icons-round edit-icon">edit</span>
                                            <span onClick={EditField} id="save-freqTime" class="material-icons-round edit-icon" style={{display: "none"}}>done</span>
                                        </div>
                                    </div>

                                    <div className="spacing-20" style={{margin: "0 0 0 10%"}}>
                                        <div className="g-font-1">Since</div>
                                        <div className="d-flex">
                                            <input id="input-freqDate" className="my-profile-field pointer-event-toggle field-collapse" value={Conditions[2].attributes[1].itemValue} />
                                            <span onClick={EditField} id="edit-freqDate" class="material-icons-round edit-icon">edit</span>
                                            <span onClick={EditField} id="save-freqDate" class="material-icons-round edit-icon" style={{display: "none"}}>done</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                           
                            <div className="d-flex spacing-12">
                                <div className="form-question">Do you take alcohol?</div>
                                <div className="form-toggle-button">
                                    <div role="button" id="mode-toggle4" onClick={handleMedicalHealth("Conditions",{index:3,itemName:"isMarked"})}  className={`d-flex ${(Conditions[3].isMarked)?"form-toggle-ball-active":"form-toggle-ball"}`}>
                                        <div id="text-toggle4" className="flex-item-2">{(Conditions[3].isMarked)?`Yes`:`No`}</div>
                                    </div>
                                </div>
                            </div>
                            <div id="data-toggle4" style={{display:(Conditions[3].isMarked)?'block':'none'}}>
                                <div className="d-flex">
                                    <div className="spacing-20" style={{width :"45%"}}>
                                        <div className="d-flex" style={{margin:"0 0 5% -3.5%"}}>
                                            
                                                <input className="flex-item-2" checked={Conditions[3].attributes[0].itemValue=="Ocationally"} value={'Ocationally'} type="radio"/>
                                                <div className="flex-item-2" style={{margin: "0 15% 0 0"}}>Ocationally</div>
                                                
                                                <input className="flex-item-2" value={Conditions[3].attributes[0].itemValue=="Regular"} type="radio"/>
                                                <div className="flex-item-2">Regular</div>
                                           
                                        </div>
                                        <div className="g-font-1">Since</div>
                                        <div className="d-flex">
                                            <input id="input-alcoholFreq" className="my-profile-field pointer-event-toggle field-collapse" value={Conditions[3].attributes[1].itemValue} />
                                            <span onClick={EditField} id="edit-alcoholFreq" class="material-icons-round edit-icon">edit</span>
                                            <span onClick={EditField} id="save-alcoholFreq" class="material-icons-round edit-icon" style={{display: "none"}}>done</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            


                            <div className="d-flex spacing-12">
                                <div className="form-question">Are you pregnant?</div>
                                <div className="form-toggle-button">
                                    <div role="button" id="mode-toggle5"  onClick={handleMedicalHealth("Conditions",{index:4,itemName:"isMarked"})} className={`d-flex ${(Conditions[4].isMarked)?"form-toggle-ball-active":"form-toggle-ball"}`}>
                                        <div id="text-toggle5" className="flex-item-2">{(Conditions[4].isMarked)?`Yes`:`No`}</div>
                                    </div>
                                </div>
                            </div>

                            <div id="data-toggle5" style={{display:(Conditions[4].isMarked)?'block':'none'}}>
                                <div className="d-flex">
                                    <div className="spacing-20">
                                        <div className="g-font-1">Phase</div>
                                        <div type="text" className="d-flex select-dropdown dropdown-adjust-2">
                                            <div onClick={toggleUnitField} id="text-pragField" className="select-exercise-text-2 bold-font">{Conditions[4].attributes[0].itemValue}</div>
                                            <img onClick={toggleUnitField} id="icon-pragField" src={ArrowUp} className="select-exercise-icon"/>
                                        </div>

                                        <div id="menu-pragField" className="measurement-container adjust-container-1" style={{display: "none"}}>
                                            <div onClick={toggleUnitField} id="one-pragField" className="measurement-container-item">Phase 1</div>
                                            <div onClick={toggleUnitField} id="two-pragField" className="measurement-container-item">Phase 2</div>
                                            <div onClick={toggleUnitField} id="three-pragField" className="measurement-container-item">Phase 3</div>
                                        </div>

                                    </div>

                                </div>
                            </div>
                           



                            <div className="d-flex spacing-12">
                                <div className="form-question">Is your stress level high?</div>
                                <div className="form-toggle-button">
                                    <div role="button" id="mode-toggle6"  onClick={handleMedicalHealth("Conditions",{index:5,itemName:"isMarked"})} className={`d-flex ${(Conditions[5].isMarked)?"form-toggle-ball-active":"form-toggle-ball"}`}>
                                        <div id="text-toggle6" className="flex-item-2">{(Conditions[5].isMarked)?`Yes`:`No`}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex spacing-13">
                                <div className="form-question bold-font">Do you have :</div>
                            </div>

                            <div className="d-flex spacing-12">
                                <div className="form-question">High Blood Pressure ?</div>
                                <div className="form-toggle-button">
                                    <div role="button" id="mode-toggle7"  onClick={handleMedicalHealth("Conditions",{index:6,itemName:"isMarked"})} className={`d-flex ${(Conditions[6].isMarked)?"form-toggle-ball-active":"form-toggle-ball"}`}>
                                        <div id="text-toggle7"  className="flex-item-2">{(Conditions[6].isMarked)?`Yes`:`No`}</div>
                                    </div>
                                </div>

                            </div>

                            <div id="data-toggle7" style={{display:(Conditions[6].isMarked)?'block':'none'}}>
                                <div className="d-flex" style={{flexWrap :"wrap"}}>
                                    <div className="spacing-20">
                                        <div className="g-font-1">SBP</div>
                                        <div className="d-flex">
                                            <input id="input-sbp" className="my-profile-field pointer-event-toggle field-collapse" value={Conditions[6].attributes[0].value} />
                                            <span onClick={EditField} id="edit-sbp" class="material-icons-round edit-icon">edit</span>
                                            <span onClick={EditField} id="save-sbp" class="material-icons-round edit-icon" style={{display: "none"}}>done</span>
                                        </div>
                                    </div>

                                    <div className="spacing-20" style={{margin: "0 0 0 10%"}}>
                                        <div className="g-font-1">Date</div>
                                        <div className="d-flex">
                                            <input id="input-sbpDate" className="my-profile-field pointer-event-toggle field-collapse" value={Conditions[6].attributes[1].value} />
                                            <span onClick={EditField} id="edit-sbpDate" class="material-icons-round edit-icon">edit</span>
                                            <span onClick={EditField} id="save-sbpDate" class="material-icons-round edit-icon" style={{display: "none"}}>done</span>
                                        </div>
                                    </div>

                                    <div className="spacing-20">
                                        <div className="g-font-1">DBP</div>
                                        <div className="d-flex">
                                            <input id="input-dbp" className="my-profile-field pointer-event-toggle field-collapse" value={Conditions[6].attributes[2].value} />
                                            <span onClick={EditField} id="edit-dbp" class="material-icons-round edit-icon">edit</span>
                                            <span onClick={EditField} id="save-dbp" class="material-icons-round edit-icon" style={{display: "none"}}>done</span>
                                        </div>
                                    </div>

                                    <div className="spacing-20" style={{margin: "0 0 0 10%"}}>
                                        <div className="g-font-1">Date</div>
                                        <div className="d-flex">
                                            <input id="input-dbpDate" className="my-profile-field pointer-event-toggle field-collapse" value={Conditions[6].attributes[3].value} />
                                            <span onClick={EditField} id="edit-dbpDate" class="material-icons-round edit-icon">edit</span>
                                            <span onClick={EditField} id="save-dbpDate" class="material-icons-round edit-icon" style={{display: "none"}}>done</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                           

                            <div className="d-flex spacing-12">
                                <div className="form-question">High cholestrol ?</div>
                                <div className="form-toggle-button">
                                    <div role="button" id="mode-toggle8"  onClick={handleMedicalHealth("Conditions",{index:7,itemName:"isMarked"})} className={`d-flex ${(Conditions[7].isMarked)?"form-toggle-ball-active":"form-toggle-ball"}`}>
                                        <div id="text-toggle8" className="flex-item-2">{(Conditions[7].isMarked)?`Yes`:`No`}</div>
                                    </div>
                                </div>
                            </div>

                            <div id="data-toggle8" style={{display:(Conditions[7].isMarked)?`block`:`none`}}>
                                <div className="d-flex">
                                    <div className="spacing-20">
                                        <div className="g-font-1">Result</div>
                                        <div className="d-flex">
                                            <input id="input-cholestrol" className="my-profile-field pointer-event-toggle field-collapse" value={Conditions[7].attributes[0].itemValue} />
                                            <span onClick={EditField} id="edit-cholestrol" class="material-icons-round edit-icon">edit</span>
                                            <span onClick={EditField} id="save-cholestrol" class="material-icons-round edit-icon" style={{display: "none"}}>done</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                           

                            <div className="d-flex spacing-12">
                                <div className="form-question">Diabetes ?</div>
                                <div className="form-toggle-button">
                                    <div role="button" id="mode-toggle9" onClick={handleMedicalHealth("Conditions",{index:8,itemName:"isMarked"})} className={`d-flex ${(Conditions[8].isMarked)?"form-toggle-ball-active":"form-toggle-ball"}`}>
                                        <div id="text-toggle9" className="flex-item-2">{(Conditions[8].isMarked)?`Yes`:`No`}</div>
                                    </div>
                                </div>
                            </div>

                            <div id="data-toggle9" style={{display:Conditions[8].isMarked?'block':'none'}}>
                                <div className="d-flex">
                                    <div className="spacing-20">
                                        <div className="g-font-1">Result</div>
                                        <div className="d-flex">
                                            <input id="input-diabetes" className="my-profile-field pointer-event-toggle field-collapse" value={Conditions[8].attributes[0].itemValue}/>
                                            <span onClick={EditField} id="edit-diabetes" class="material-icons-round edit-icon">edit</span>
                                            <span onClick={EditField} id="save-diabetes" class="material-icons-round edit-icon" style={{display: "none"}}>done</span>
                                        </div>
                                    </div>

                                    <div className="spacing-20" style={{margin: "0 0 0 10%"}}>
                                        <div className="g-font-1">Type</div>
                                      
                                        <div type="text" className="d-flex select-dropdown dropdown-adjust-2">
                                            <div onClick={toggleUnitField} id="text-diabetesField" className="select-exercise-text-2 bold-font">{Conditions[8].attributes[1].itemValue}</div>
                                            <img onClick={toggleUnitField} id="icon-diabetesField" src={ArrowUp} className="select-exercise-icon"/>
                                        </div>

                                        <div id="menu-diabetesField" className="measurement-container adjust-container-1" style={{display: "none"}}>
                                            <div onClick={toggleUnitField} id="one-diabetesField" className="measurement-container-item">Type 1</div>
                                            <div onClick={toggleUnitField} id="two-diabetesField" className="measurement-container-item">Type 2</div>
                                        </div>
                                    </div>
                                    
                                
                                </div>
                            </div>

                            <div className="d-flex spacing-12">
                                <div className="form-question">Any bone or joint injury in the past ?</div>
                                <div className="form-toggle-button">
                                    <div role="button" id="mode-toggle10" onClick={handleMedicalHealth("Conditions",{index:9,itemName:"isMarked"})} className={`d-flex ${(Conditions[9].isMarked)?"form-toggle-ball-active":"form-toggle-ball"}`}>
                                        <div id="text-toggle10" className="flex-item-2">{(Conditions[9].isMarked)?`Yes`:`No`}</div>
                                    </div>
                                </div>
                            </div>


                            <div id="data-toggle10" style={{display:Conditions[9].isMarked?'block':'none'}}>
                                <div className="d-flex">
                                    <div className="spacing-20">
                                        <div className="g-font-1">Mention in details</div>
                                        <div className="d-flex">
                                            <input id="input-injuryDetails" className="my-profile-field pointer-event-toggle field-expand" value={Conditions[9].attributes[0].itemValue} />
                                            <span onClick={EditField} id="edit-injuryDetails" class="material-icons-round edit-icon">edit</span>
                                            <span onClick={EditField} id="save-injuryDetails" class="material-icons-round edit-icon" style={{display: "none"}}>done</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex spacing-12">
                                <div className="form-question">Any muscle or ligament injury in the past?</div>
                                <div className="form-toggle-button">
                                    <div role="button" id="mode-toggle11" onClick={handleMedicalHealth("Conditions",{index:10,itemName:"isMarked"})} className={`d-flex ${(Conditions[10].isMarked)?"form-toggle-ball-active":"form-toggle-ball"}`}>
                                        <div id="text-toggle11" className="flex-item-2">{(Conditions[10].isMarked)?`Yes`:`No`}</div>
                                    </div>
                                </div>
                            </div>

                            <div id="data-toggle11" style={{display:Conditions[10].isMarked?'block':'none'}}>
                                <div className="d-flex">
                                    <div className="spacing-20">
                                        <div className="g-font-1">Mention in details</div>
                                        <div className="d-flex">
                                            <input id="input-jointDetails" className="my-profile-field pointer-event-toggle field-expand" value={Conditions[10].attributes[0].itemValue} />
                                            <span onClick={EditField} id="edit-jointDetails" class="material-icons-round edit-icon">edit</span>
                                            <span onClick={EditField} id="save-jointDetails" class="material-icons-round edit-icon" style={{display: "none"}}>done</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="spacing-18">
                                <div onClick={toggleUnitField} id="text-MedicalField"  style={{marginBottom: "1%"}} className="g-font-1">Medical Clearence certificate <span><img id="image-MedicalField" src={MoreInfo} className="more-icon" /> </span></div>
                                <div onClick={toggleUnitField} id="menu-MedicalField" className="measurement-container adjust-container-1" style={{display: "none", width: "16.5vw", zIndex :"2",marginTop: "-5.5%", marginLeft :"42%", paddingLeft: "2%"}}>Incase of member with medical condition </div>
                                
                                <div className="d-flex">
                                    <div className="d-flex">
                                        <form>
                                            <input onInput={showFileName} type="file" id="file-upload"/>
                                            <label for="file-upload" style={{whiteSpace: "nowrap"}}>
                                                <div id="file-upload-text" className="my-profile-field pointer-event-toggle field-collapse">Upload File</div>
                                                <div id="file-upload-filename" className="my-profile-field pointer-event-toggle field-collapse" style={{display:"none"}}></div>
                                            </label>
                                            
                                        </form>
                                        <span id="edit-fileUpload" class="material-icons-round edit-icon spacing-19">file_download</span>
                                        <span id="edit-fileUpload" class="material-icons-round edit-icon" style={{marginBottom:"2%"}}>visibility</span>
                                        

                                        
                                    </div>

                                </div>
                            </div>


                            <div className="spacing-18">
                                <div className="d-flex">
                                    <input id="input-othersMedical" className="my-profile-field pointer-event-toggle field-expand" value="Specify any other medical conditions" />
                                    <span onClick={EditField}  id="edit-othersMedical" class="material-icons-round edit-icon">edit</span>
                                    <span onClick={EditField} id="save-othersMedical" class="material-icons-round edit-icon" style={{display: "none"}}>done</span>
                                </div>
                            </div>
                      *
                        </div>
                    </div>
                </div>
                
            </div>
        </Dashboard>
    )
}