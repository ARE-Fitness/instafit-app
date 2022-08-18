import { Dialog } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { isAuthenticated } from '../../auth';
import { API } from '../../backend';
import { getBranch, totalActiveBranchPage  } from '../../branch/helper/api';
import {getAllActiveBranchAdmin,checkBranchAdminStatus,getAllInActiveBranchAdmin,addBranchAdmin,updateBranchAdmin,getBranchAdmin,activeinactiveOperationBranchAdmin, totalinactiveBranchAdminPage} from '../helper/api';
import Dashboard from '../../core/Dashboard';
import { getGym } from '../../gym/helper/api';
import Slide from '@material-ui/core/Slide';
import SwapIcon from "../../assets/swap.svg";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Flatpickr from "flatpickr";
import ArrowDown from '../../assets/arrow-down.svg';
import Cross from "../../assets/cross.svg";
import _ from 'lodash';
import FilterIcon from "../../assets/filter.svg";
import ArrowLeft from "../../assets/arrow-left.svg";
import ArrowRight from "../../assets/arrow-right.svg";
import BlockIcon from "../../assets/block.svg";
import SuccessIcon from "../../assets/success.png";
// import AddIcon from "../../assets/add-icon.png";
import ExtendIcon from "../../assets/extend.png";
import ScheduleIcon from "../../assets/schedule.png"; 
import UpdateIcon from "../../assets/edit.svg";
import DownloadIcon from "../../assets/download.svg";
import ArrowUp from "../../assets/arrow-sign.svg";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


const Appoienment = (props) => {
    const [total,settotal]=useState(0);
    const [limit,setlimit]=useState(8);
    const [page,setpage]=useState(1);
    const [currentpage,setcurrentpage]=useState(1);
    const [Gym,setGym]=useState({ gymName:"",email:"",phone:""});//save gym info ( name,phone,email )
    const { gymName,email,phone}=Gym;//destrucuring gym
    const [Branch,setBranch]=useState({branchName:"",totalmembers:0,totaladminusers:0,state:"",location:"",area:"",address:"",branchactive:true,branchId:"", gymId:"",error:"",success:""});//save branch info
    const {branchName,branchactive,totalmembers,totaladminusers,state,location,address,branchId, gymId}=Branch;//destructuring the branch info 
    const [openDialog,setopenDialog]=useState(false);//Dialog hooks
    const [appoientment,setappoientment]=useState({
        isComplete:false,
        complete:{
            date:"",
            time:"",
            remark:""
        }
    })
    const {isComplete,complete}=appoientment;
    const [branchadmin,setbranchadmin]=useState({
        bfname:"",
        blname:"",
        bemail:"",
        bphone:"",
    });//branch admin hooks
    const [Planner,setPlanner]=useState({
        planner_name:"",
        planner_startDate:"",
        planner_duration:"",
        reason:""
    })
    const {planner_name,planner_duration,planner_startDate,reason}=Planner;

    const {bfname,blname,bemail,bphone}=branchadmin;//branch admin hooks
    const [mapAction,setmapAction]=useState(0);//0 complete 1 pending
    const [formdialog,setformdialog]=useState({formrole:0,title:"Planner Re Assign"});
    const {formrole,title}=formdialog;


    const [Member,setMember]=useState({
        memberId:"",
        mfname:"",
        mlname:"",
        mphone:"",
        memail:""
    });

    const {memberId,mlname,mfname,memail}=Member;


    const [Branchs,setBranchs]=useState([]);
    const [Gyms,setGyms]=useState([]);
    const [Members,setMembers]=useState([])

    const {user, token} = isAuthenticated();
    const handleOpenDialog=()=>{
        setopenDialog(true);
    };//open dialog handler
    const handleCloseDialog=()=>{
        setopenDialog(false);
    };//close dialog handle


    //pagination

    const prev=()=>{
		if(currentpage<=page&&currentpage!=1){
			//mapAction==0?GetAllActiveBranchAdmin(currentpage-1,limit):GetAllInactiveBranchAdmin(currentpage-1,limit);
		 	setcurrentpage(currentpage-1);
	    }
	};
	const next=()=>{
		if(currentpage<page){
		  // mapAction==0?GetAllActiveBranchAdmin(currentpage+1,limit):GetAllInactiveBranchAdmin(currentpage+1,limit);	
		   setcurrentpage(currentpage+1);
		}
	};

    //branchadmin handler
    const handleChange=name=>event=>{
        const value =  event.target.value;
        setappoientment(oldstate=>{

            if(name=="date") oldstate['complete'][name]=value;
            else [name]=value;

            return ({...oldstate})
        })
    };



    //branchadmin handler
    const getCurrentBranch = () => {
        getBranch(user._id, token, props.match.params.branchId).then(data => {
            if(data.error){
                throw "Somthing went wrong please try again"
            }else{
                setBranch({
                    ...Branch,
                    branchId : props.match.params.branchId,
                    branchName : data.branchName,
                    gymId : data.gymId,
                    totaladminusers:data.branchAdminList.length,
                    totalmembers:data.memberList.length,
                    branchactive : data.active 
                });
                return data.gymId
            }
        }).then(gymId=>{
            getGym(user._id, token,gymId).then(data=>{
                if(data.error){
                  throw "Something went wrong please try again";
                }else{
                  setGym({...Gym,
                  gymName:data.gymName,
                  email:data.email,
                  phone:data.phone
                  });
                }
            })
        }).catch(err=>alert(err))
    }
    const GetBranchAdmin=branchadminId=>{
        getBranchAdmin(user._id,token,branchadminId).then(data=>{
            if(data.error){
                console.log(data.error)
            }else{
                setbranchadmin({
                    ...branchadmin,
                    bfname:data.bfname,
                    blname:data.blname,
                    bemail:data.bemail,
                    bphone:data.bphone,
                    role:data.role
                });
            }
        }).catch(err=>console.log(err))
    }

    const handleDropdownItem=(name,value)=>event=>{
        event.preventDefault();
        switch(name){
            case "branch":
                setBranch({
                    ...Branch,
                    branchName:value
                })
                break;
            case "member":
                setMember({
                    ...Member,
                    mfname:value
                })
                break;
            case "gym":
                setGym({
                    ...Gym,
                    gymName:value
                })
                break;
            case "reason":
                setPlanner({
                    ...Planner,
                    reason:value
                })
              break;
            default:
                console.log('something went wrong')
        }
        document.getElementById(name+"-list").style.display="none";
        document.getElementById(name+"-list-icon").style.transform='rotate(-180deg)';

    }


    const hanleDropDown=id=>{
        let dropdown=document.querySelector('#'+id);
        let arrowicon=document.querySelector("#"+id+"-icon");

        if(dropdown.style.display=="none"){
            dropdown.style.display="block";
            arrowicon.style.transform='rotate(0deg)';
        }else {
            dropdown.style.display="none";
            arrowicon.style.transform='rotate(-180deg)';
        }
    }






    const vlidateField=(name,value)=>{
        if(name=="bemail"){
            const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(value).toLowerCase());
        }
        if(name=="bphone"){
            return  value.length&&value.match(/\d/g).length==10;
        }
        if(name=="bfname"){
            return value.length>1&&value.length<=30
        }
        if(name=="blname"){
            return value.length>1&&value.length<=30
        }
        if(name=="baddress"){
            return value.length>1&&value.length<=140;
        }
        if(name=="bpincode"){
            return  value.length&&value.match(/\d/g).length==6;
        }
    }
    const OnBlurFieldChecker=name=>()=>{
        let checker=vlidateField(name,branchadmin[name]);
        checkBranchAdminStatus(user._id,token,branchId,{field:name,value:branchadmin[name]}).then(data=>{
            if(data.error){
                console.log(data.error);
            }else{
                if(data.found){
                    document.getElementById(name).style.borderColor="#EF5354";
                }else{
                    if(checker){
                        document.getElementById(name).style.borderColor="#02B290";
                     }else{
                        document.getElementById(name).style.borderColor="#EF5354";
                     }
                }
                console.log(data)
            }
        });

      }






      const toggleAppointmentAction = () => {
          if(document.getElementById("action-memberAppointmentId").style.display == "block"){
              document.getElementById("action-memberAppointmentId").style.display = "none"
          }else{
              document.getElementById("action-memberAppointmentId").style.display = "block";
          }
      }




    const toggleFilter = () => {
        if(document.getElementById("filter-container-toggle").style.display == "none"){
            document.getElementById("filter-container-toggle").style.display = "block";
        }else{
            document.getElementById("filter-container-toggle").style.display = "none";
        }
    }

    const toggleSortingItem = (event) => {
        event.preventDefault();
        let currentSortingItem = event.target.id.split('-')[1];
        if(document.getElementById("list-" + currentSortingItem).style.display == "none"){
            document.getElementById("icon-" + currentSortingItem).style.transform = "rotate(-180deg)";
            document.getElementById("list-" + currentSortingItem).style.display = "block";

            document.getElementById("itemId-" + currentSortingItem).addEventListener("click", function(event) {
                let currentSelectedItem = event.target.innerHTML;
                document.getElementById("text-" + currentSortingItem).innerHTML = currentSelectedItem;
                document.getElementById("icon-" + currentSortingItem).style.transform = "rotate(0deg)";
                document.getElementById("list-" + currentSortingItem).style.display = "none";
            })
        }else{
            document.getElementById("icon-" + currentSortingItem).style.transform = "rotate(0deg)";
            document.getElementById("list-" + currentSortingItem).style.display = "none";
        }
    }

    const handleAppointment=value=>event=>{
        event.preventDefault();
        let title="";
        if(value==1) title="Book New";
        if(value==0) title="Extand Planner";
        if(value==2) title="Reschedule";
        if(value==4) title="Complete";
        if(value==5) title="Cancel";
        if(value==3) title="Book Appointment";

        
        setformdialog({
            ...formdialog,
            formrole:value,
            title
        });
        setopenDialog(true)
    }




    useEffect(() => {
       // getCurrentBranch();
       // GetAllActiveBranchAdmin(currentpage,limit);
    },[])

    return(
        <Dashboard itemId={gymId} 
        navItemData={"Gym"} 
        data={{ 
            branchId, 
            branchName,
            active:branchactive, 
            gymId, 
            gymName, 
            email, 
            phone,
            totalmembers,
            totaladminusers 
        }} 
        flag={2}>

        <div className="header-bar">
            <div>
                <div className="dashboard-name-container">
                    <div className="dashboard-name">Appointments</div>
                </div>
                <div onClick={handleAppointment(1)}   role="button" className="active-inactive-container d-flex" style={{margin:"2% 0 0 -3%"}}>
                    <span class="material-icons-round active-inactive-icon flex-item" style={{color:"#bdbdbd"}}>add_circle_outline</span>
                    {/* <img src={AddIcon} className="active-inactive-icon"/> */}
                    <div id="switch-gym" className="active-inactive-text flex-item" style={{margin: "4% 0 0 3%"}}>Book New</div>
                </div>
            </div>

            <div>
                <div className="search-field-container">
                    <input type="text" className="search-field" placeholder="search"/>
                    <div className="filter-container" onClick={toggleFilter}>
                        <img src={FilterIcon} className="filter-icon"/>
                    </div>
                    <div id="filter-container-toggle" className="filter-dropdown" style={{display:"none"}}>
                        <div className="d-flex">
                            <div className="flex-item container-spacing bold-font field-text">Sort By</div>
                            <input className="flex-item" type="checkbox" style={{ marginTop: "4%" }}/>
                        </div>
                        <div className="container-spacing">
                            <span className="g-font-1 inactive">Gym</span>
                            <div onClick={toggleSortingItem} id="select-gym" type="text" className="d-flex select-dropdown">
                                <div id="text-gym" className="select-sort-text">Select</div>
                                <img id="icon-gym" src={ArrowUp} className="select-sort-icon"/>
                            </div>
                            <div id="list-gym" className="dropdown-menu-items" style={{display:"none"}}>
                                <div id="itemId-gym" className="menu-text-spacing">Red Gold</div>
                                <div className="menu-text-spacing">Black Panther</div>
                                <div className="menu-text-spacing">Fitter</div>
                                <div className="menu-text-spacing">Instafit</div>
                            </div>
                        </div>
                        <div className="container-spacing">
                            <span className="g-font-1 inactive">Branch</span>
                            <div onClick={toggleSortingItem} id="select-branch" type="text" className="d-flex select-dropdown">
                                <div id="text-branch" className="select-sort-text">Select</div>
                                <img id="icon-branch" src={ArrowUp} className="select-sort-icon"/>
                            </div>
                            <div id="list-branch" className="dropdown-menu-items" style={{display:"none"}}>
                                <div id="itemId-branch" className="menu-text-spacing">Red Gold Branch</div>
                                <div className="menu-text-spacing">Black Panther Branch</div>
                                <div className="menu-text-spacing">Fitter Branch</div>
                                <div className="menu-text-spacing">Instafit Branch</div>
                            </div>
                        </div>
                        <div className="container-spacing">
                            <span className="g-font-1 inactive">Appointment Type</span>
                            <div onClick={toggleSortingItem} id="select-appointmentType" type="text" className="d-flex select-dropdown">
                                <div id="text-appointmentType" className="select-exercise-text">Select</div>
                                <img id="icon-appointmentType" src={ArrowUp} className="select-exercise-icon"/>
                            </div>
                            <div id="list-appointmentType" className="dropdown-menu-items" style={{display:"none"}}>
                                <div id="itemId-appointmentType" className="menu-text-spacing">auto</div>
                                <div className="menu-text-spacing">self</div>
                            </div>
                        </div>
                        <div className="container-spacing">
                            <span className="g-font-1 inactive">Appointment Status</span>
                            <div onClick={toggleSortingItem} id="select-appointmentStatus" type="text" className="d-flex select-dropdown">
                                <div id="text-appointmentStatus" className="select-exercise-text">Select</div>
                                <img id="icon-appointmentStatus" src={ArrowUp} className="select-exercise-icon"/>
                            </div>
                            <div id="list-appointmentStatus" className="dropdown-menu-items" style={{display:"none"}}>
                                <div id="itemId-appointmentStatus" className="menu-text-spacing">pending</div>
                                <div className="menu-text-spacing">cancelled</div>
                                <div className="menu-text-spacing">done</div>
                            </div>
                        </div>
                        <div className="container-spacing">
                            <span className="g-font-1 inactive">Date</span>
                           <div className="d-flex" style={{width:"100%", justifyContent: "space-between", marginTop:"2%"}}>
                                <div>
                                    <div className="g-font-1">From</div>
                                    <div className="d-flex">
                                        <input id="input-dob" className="my-profile-field" placeholder="DD-MM-YY" style={{width:"7vw", fontSize:"0.9vw"}}/>
                                        {/* <span id="edit-dob" class="material-icons-round edit-icon">edit</span>
                                        <span id="save-dob" class="material-icons-round edit-icon" style={{display: "none"}}>done</span> */}
                                    </div>
                                </div>
                                <div>
                                    <div className="g-font-1">To</div>
                                    <div className="d-flex">
                                        <input id="input-dob" className="my-profile-field" placeholder="DD-MM-YY" style={{width:"7vw", fontSize:"0.9vw"}} />
                                        {/* <span id="edit-dob" class="material-icons-round edit-icon">edit</span>
                                        <span id="save-dob" class="material-icons-round edit-icon" style={{display: "none"}}>done</span> */}
                                    </div>
                                </div>
                           </div>

                        </div>
                    </div>

                </div>

                <div className="pagination-container">
                    <div className="pagination-tracker">
                        1 - 9  of  56 
                    </div>
                    <img onClick={prev} src={ArrowLeft}  className="pagination-icon"/>
                    <img onClick={next} src={ArrowRight} className="pagination-icon"/>
                </div>
            </div>

        </div>


        <table  className="body-container">
          <thead>
            <tr>
              <th style={{textAlign:"left", padding: "0 0 0 4%"}}>Member Name</th>
              <th>Date</th>
              <th>Reason</th>
              <th>Appointment Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
                <td style={{padding :"0 0 0 1%", fontWeight : "bold"}}>
                    <div className="d-flex">
                        <span class="material-icons-round action-icon">check_circle</span>
                        <div style={{padding :"2% 0 0 2%"}}>Anik Roy</div>
                    </div>
                </td>
                <td style={{fontFamily:"sans-serif"}}>21 Jul 2021</td>
                <td>Councelling</td>
                <td style={{fontFamily:"sans-serif"}}>NA</td>
                <td style={{fontFamily:"sans-serif"}}>NA</td>
                <td>
                    <div className="d-flex" style={{padding :"0 0 0 12%"}}>
                        <span class="material-icons-round action-icon active flex-item">circle</span>
                        <div style={{padding :"2.2% 0 0 2%"}} className="active flex-item">Pending</div>
                    </div>
                </td>
                <span // onClick={toggleGymAction(gym._id)} 
                class="material-icons-outlined edit-icon" onClick={toggleAppointmentAction}>more_horiz</span>
                <div id="action-memberAppointmentId" className="table-action-container" style={{display:"none", width:"14.2vw",  margin: "-0.4% 0 0 -5.5%", zIndex:1}}>
                    <div onClick={handleAppointment(3)} role="button" className="d-flex spacing-22">
                        <img src={UpdateIcon} className="body-content-two-action-icon" />
                        <div className="spacing-24">Book Appointment</div>
                    </div>
                    <div style={{margin:"2% 0", width:"100%", height:"1px", backgroundColor:"#f5f5f5"}}></div>
                    <div  onClick={handleAppointment(2)}   role="button" className="d-flex spacing-22">
                        <img src={ScheduleIcon} className="body-content-two-action-icon" />
                        <div className="spacing-24">Reschedule</div>
                    </div>
                    <div style={{margin:"2% 0", width:"100%", height:"1px", backgroundColor:"#f5f5f5"}}></div>
                    <div onClick={handleAppointment(0)}  role="button" className="d-flex spacing-22">
                        <img src={ExtendIcon} className="body-content-two-action-icon" />
                        <div className="spacing-24">Extend Same Planner</div>
                    </div>
                    <div style={{margin:"2% 0", width:"100%", height:"1px", backgroundColor:"#f5f5f5"}}></div>
                    <div onClick={handleAppointment(4)}  role="button" className="d-flex spacing-22">
                        <img src={SuccessIcon} className="body-content-two-action-icon" />
                        <div className="spacing-24">Complete</div>
                    </div>
                    <div style={{margin:"2% 0", width:"100%", height:"1px", backgroundColor:"#f5f5f5"}}></div>
                    <div onClick={handleAppointment(5)} role="button" className="d-flex spacing-22">
                        <img src={BlockIcon} className="body-content-two-action-icon" />
                        <div className="spacing-24">Cancel</div>
                    </div>
                </div>
            </tr>
            <tr>
                <td style={{padding :"0 0 0 1%", fontWeight : "bold"}}>
                    <div className="d-flex">
                        <span class="material-icons-round action-icon">check_circle</span>
                        <div style={{padding :"2% 0 0 2%"}}>Raju Deb</div>
                    </div>
                </td>
                <td style={{fontFamily:"sans-serif"}}>09 Jul 2021</td>
                <td>Councelling</td>
                <td style={{fontFamily:"sans-serif"}}>NA</td>
                <td style={{fontFamily:"sans-serif"}}>NA</td>
                <td>
                    <div className="d-flex" style={{padding :"0 0 0 12%"}}>
                        <span class="material-icons-round action-icon complete flex-item">circle</span>
                        <div style={{padding :"2.2% 0 0 2%"}} className="complete flex-item">Completed</div>
                    </div>
                </td>
                <span 
                // onClick={toggleGymAction(gym._id)} 
                class="material-icons-outlined edit-icon">more_horiz</span>
            </tr>

            <tr>
                <td style={{padding :"0 0 0 1%", fontWeight : "bold"}}>
                    <div className="d-flex">
                        <span class="material-icons-round action-icon">check_circle</span>
                        <div style={{padding :"2% 0 0 2%", whiteSpace:"nowrap"}}>Debajyoti Debna..</div>
                    </div>
                </td>
                <td style={{fontFamily:"sans-serif"}}>08 Jul 2021</td>
                <td>Councelling</td>
                <td style={{fontFamily:"sans-serif"}}>NA</td>
                <td style={{fontFamily:"sans-serif"}}>NA</td>
                <td>
                    <div className="d-flex" style={{padding :"0 0 0 12%"}}>
                        <span class="material-icons-round action-icon cancel flex-item">circle</span>
                        <div style={{padding :"2.2% 0 0 2%"}} className="cancel flex-item">Cancelled</div>
                    </div>
                </td>
                <span 
                // onClick={toggleGymAction(gym._id)} 
                class="material-icons-outlined edit-icon">more_horiz</span>
            </tr>


          </tbody>
        </table>

        {/* popup section code */}    
        <div  className={`content-add-section content-add-section-rs-size`}  style={{display:openDialog?"block":"none"}}>
            <div className="exerise-header-bar">
                <div style={{display:"flex", alignSelf:"center"}} >

                     {
                         formrole!=5&&(
                            <div className="exercise-header-text" style={{marginRight:"6%", alignSelf:"center", whiteSpace:"nowrap"}}>{title}</div>
                         )
                     }
                    {
                        (formrole==0||formrole==5)&&(
                            <div className="popup-selected-item">
                              <div>{formrole==0?`Planner Name`:`Appointment`}</div>
                             </div>
                        )
                    }

                </div>

                <img  src={Cross} role="button" onClick={handleCloseDialog} className="exercise-header-close"/>
            </div>

            <div style={{transition:'0.5s',overflowY:'hidden'}} className="exercise-body-container">

            <div id="owner-info-container" className="popcontainer-wrapper"> 


                {
                    formrole==0?[

                    <input   onMouseDown={()=>{
                        Flatpickr("#date-planner",{
                            onChange:()=>{
                                setPlanner(oldstate=>{
                                    oldstate['planner_startDate']=document.getElementById("date-planner").value
                                    return ({...oldstate});
                                })
                            }
                        }).open()
                    }} id="date-planner" value={planner_startDate} style={{marginRight:5}} className="input-popup input-popup-space" placeholder="Start Date"/>
                    ,
                    <div style={{marginTop:'2%'}} className="workout-freq mb-4">
                        <div className="planner-assign-text-header">Weekly Workout Frequency</div>
                        <div className="mt-3 sliderrange-wrapper">
                            <div style={{alignSelf:'center'}} class="slidecontainer">
                                <input type="range" class="slider" id="myRange"></input>
                            </div>
                            <div style={{alignSelf:'center'}}>
                                30
                            </div>
                        </div>
                    </div>,

                    <div className="week-days-select" >
                        <div className="planner-assign-text-header">Mark Offdays</div>
                        <div class="weekDays-selector mt-3">
                                <input type="checkbox" id="weekday-mon" class="weekday" />
                                <label for="weekday-mon">M</label>
                                <input type="checkbox" id="weekday-tue" class="weekday" />
                                <label for="weekday-tue">T</label>
                                <input type="checkbox" id="weekday-wed" class="weekday" />
                                <label for="weekday-wed">W</label>
                                <input type="checkbox" id="weekday-thu" class="weekday" />
                                <label for="weekday-thu">T</label>
                                <input type="checkbox" id="weekday-fri" class="weekday" />
                                <label for="weekday-fri">F</label>
                                <input type="checkbox" id="weekday-sat" class="weekday" />
                                <label for="weekday-sat">S</label>
                                <input type="checkbox" id="weekday-sun" class="weekday" />
                                <label for="weekday-sun">S</label>
                        </div>
                    </div>


                    ]:formrole==5?[
                        <h6 style={{padding:'2% 5%',textAlign:'center'}}>
                            Are you sure you want to  cancel this appointment ?
                        </h6>
                    ]:[



                    formrole==1&&(

                        <div  className="popcontainer-sub-wrapper">
                                
                        <div style={{marginRight:5,position:'relative'}} className="input-popup-space">

                            

                            <div onClick={()=>hanleDropDown("gym-list")} id="branch-wrapper" style={{width:'100%',cursor:'pointer'}} type="text" className="input-popup-flex input-popup">
                                <div id="gym-txt" className="select-exercise-text">{gymName==""?"Select Gym":gymName}</div>
                                <img id="gym-list-icon" src={ArrowDown} style={{transition:'0.3s',transform:'rotate(-180deg)'}} className="select-exercise-icon"/>
                            </div>

                            <div id="gym-list" className="select-exercise-list" style={{display:"none",zIndex:1,position:'absolute'}}>
                                    {
                                        ['Gym 1', 'Gym 2', 'Gym 3'].map((gym,index)=>{
                                            return (
                                                <div  role="button" onClick={handleDropdownItem("gym",gym)}  className="exercise-list-container">
                                                    <div className="exercise-list">
                                                        {index+1}. {gym}
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                            </div>
                        
                        </div>

                        <div style={{position:'relative'}} className="input-popup-space">                          

                                <div onClick={()=>hanleDropDown("branch-list")} id="branch-wrapper" style={{width:'100%',cursor:'pointer'}} type="text" className="input-popup-flex input-popup">
                                    <div id="branch-txt" className="select-exercise-text">{branchName==""?"Select Branch":branchName}</div>
                                    <img id="branch-list-icon" src={ArrowDown} style={{transition:'0.3s',transform:'rotate(-180deg)'}} className="select-exercise-icon"/>
                                </div>

                                <div id="branch-list" className="select-exercise-list" style={{display:"none",zIndex:1,position:'absolute'}}>
                                        {
                                            ['branch 1', 'branch 2', 'branch 3'].map((branch,index)=>{
                                                return (
                                                    <div  role="button" onClick={handleDropdownItem("branch",branch)}  className="exercise-list-container">
                                                        <div className="exercise-list">
                                                            {index+1}. {branch}
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                </div>

                                </div>
                    
                       </div>
              
              
                    )
              ,
                   
                 formrole==1&&(
                    <div   className="popcontainer-sub-wrapper">
                                
                    <div  style={{marginRight:5,position:'relative'}} className="input-popup-space" >
                    <div onClick={()=>hanleDropDown("member-list")} id="member-Exercise" style={{width:'100%',cursor:'pointer'}} type="text" className="input-popup-flex input-popup">
                        <div id="member-txt" className="select-exercise-text">{mfname==""?"Select Member":mfname}</div>
                        <img id="member-list-icon" src={ArrowDown} style={{transition:'0.3s',transform:'rotate(-180deg)'}} className="select-exercise-icon"/>
                    </div>

                    <div id="member-list" className="select-exercise-list" style={{display:"none",position:'absolute'}}>
                          {
                              ['member 1', 'member 2', 'member 3'].map((member,index)=>{
                                  return (
                                      <div  role="button"  onClick={handleDropdownItem("member",member)}  className="exercise-list-container">
                                          <div className="exercise-list">
                                              {index+1}. {member}
                                          </div>
                                      </div>
                                  )
                              })
                          }
                    </div>
                    
            </div>

            <div  style={{position:'relative'}} className="input-popup-space" >
                    <div onClick={()=>hanleDropDown("reason-list")} id="reason-Exercise" style={{width:'100%',cursor:'pointer'}} type="text" className="input-popup-flex input-popup">
                        <div id="reason-txt" className="select-exercise-text">{reason==""?"Select Reason":reason}</div>
                        <img id="reason-list-icon" src={ArrowDown} style={{transition:'0.3s',transform:'rotate(-180deg)'}} className="select-exercise-icon"/>
                    </div>

                    <div id="reason-list" className="select-exercise-list" style={{display:"none",position:'absolute'}}>
                          {
                              ['Counciling', 'Planner Re-assign'].map((reason,index)=>{
                                  return (
                                      <div  role="button"  onClick={handleDropdownItem("reason",reason)}  className="exercise-list-container">
                                          <div className="exercise-list">
                                              {index+1}. {reason}
                                          </div>
                                      </div>
                                  )
                              })
                          }
                    </div>
                    
            </div>
    </div>
   
   
                 )
               ,

                    <div  className="popcontainer-sub-wrapper">
                    <input   onMouseDown={()=>{
                    Flatpickr("#date",{
                        onChange:()=>{
                            setappoientment(oldstate=>{
                                oldstate['complete']['date']=document.getElementById("date").value
                                return ({...oldstate});
                            })
                        }
                    }).open()
                    }} id="date" value={complete['date']} style={{marginRight:5}} className="input-popup input-popup-space" placeholder="Date"/>
                    <input onMouseDown={()=>{
                        Flatpickr("#time",{
                            enableTime: true,
                            noCalendar: true,
                            dateFormat: "H:i",
                            time_24hr: false,
                            onChange:()=>{
                                setappoientment(oldstate=>{
                                    oldstate['complete']['time']=document.getElementById("time").value
                                    return ({...oldstate});
                                })
                            }
                        }).open()
                    }} id="time" value={complete['time']}  className="input-popup input-popup-space" type="text" placeholder="Time" />
                    </div>,
                    (formrole!=2 && formrole!=1)&& (<textarea   id="remark" onInput={handleChange("remark")}  value={complete['remark']} className="input-popup input-message-box" placeholder="remark"/>),
                    formrole==4&&(
                        <div style={{   width: '80%',margin: '5% 0 1% 0',alignItems:'flex-start',justifyContent:'flex-start'}} className="terms-condition-class">   
                            <input id="terms-condition" type="checkbox"/>
                            <div>Member planner updated. ( <a href="#">Assign here</a> )</div>
                        </div>
                    ),
                    formrole==4&&(
                        <div style={{   width: '80%',margin: '1% 0',alignItems:'flex-start',justifyContent:'flex-start'}} className="terms-condition-class">   
                        <input id="terms-condition" type="checkbox"/>
                        <div >Member history updated. ( <a href="#">Add here</a> )</div>  
                        </div>
                    )



                    ]
                }



            </div>




            </div>

            <div>
                <center>
                    <div  className="register-button">
                        <div>{formrole==0?"Update":formrole==1?"Create":formrole==5?"Cancel":"Submit"}</div>
                    </div>  
                </center>
            </div>



        </div>



        </Dashboard>
    )
}

export default Appoienment;