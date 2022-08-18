import React, {useEffect, useState} from 'react';
import Dashboard from '../core/Dashboard';
import {getAllActiveGym} from '../gym/helper/api';
import {getAllActiveBranch, getBranch} from '../branch/helper/api';
import Cross from "../assets/cross.svg";
import ArrowDown from '../assets/arrow-down.svg';
import _, { set } from 'lodash';
import FilterIcon from "../assets/filter.svg";
import ArrowLeft from "../assets/arrow-left.svg";
import ArrowRight from "../assets/arrow-right.svg";
import BlockIcon from "../assets/block.svg";
import UpdateIcon from "../assets/edit.svg";
import DownloadIcon from "../assets/download.svg";
import SwapIcon from "../assets/swap.svg";
import ArrowUp from "../assets/arrow-sign.svg";
import {useLocation} from 'react-router-dom';
import {getAllActiveMember} from '../member/helper/api'
import {useHistory} from 'react-router-dom'
import {isAuthenticated} from '../auth/index';
import Flatpickr from "flatpickr";

export default function MemberReport() {


    const history=useHistory()
    const [Branch,setBranch]=useState({
        branchName:"",
        branchId:""
    });
    const [ReportList,setReportList]=useState([]);
    const [Report,setReport]=useState({
       test_name:"",
       date:"",
       time:"",
       test_list:[
          
       ],
       sync_test:"",
       branchadmin:"",
       member:""   
    });
    const {date,time,test_list,sync_test,branchadmin,member}=Report;
    const [page,setpage]=useState(1);
    const [TestValueList,setTestValueField]=useState({
        Fitness:{
            remark:"this is a remark",
            sync_test:"",
            test_list:[
                {
                    name:"Chest",
                    result:"10",
                    unit:"CM",
                    Goal:"This is a goal",
                    flag:"Good",
                }
            ]
        },
        FitnessMeasurement:{
            remark:"this is a remark",
            sync_test:"",
            test_list:[
                {
                    name:"Chest",
                    result:"10",
                    unit:"CM",
                    Goal:"This is a goal",
                    flag:"Good",
                },
                {
                    name:"Mid Arm",
                    result:"10",
                    unit:"CM",
                    Goal:"This is a goal",
                    flag:"Good",
                },
                {
                    name:"Wiast",
                    result:"10",
                    unit:"CM",
                    Goal:"This is a goal",
                    flag:"Good",
                },
                {
                    name:"Hip",
                    result:"10",
                    unit:"CM",
                    Goal:"This is a goal",
                    flag:"Good",
                },
                {
                    name:"Calf",
                    result:"10",
                    unit:"CM",
                    Goal:"This is a goal",
                    flag:"Good",
                }
            ]
        },
        PhyBody:{
            remark:"this is a remark",
            sync_test:"",
            test_list:[
                {
                    name:"Systolic BP",
                    result:"10",
                    unit:"Hg",
                    flag:"Good",
                },
                {
                    name:"Diastolic BP",
                    result:"10",
                    unit:"Hg",
                    flag:"Good",
                },
                {
                    name:"Resting Heart Rate",
                    result:"10",
                    unit:"BPM",
                    flag:"Good",
                },
                {
                    name:"Besal Metabolic Rate",
                    result:"10",
                    unit:"kcal",
                    flag:"Good",
                },
                {
                    name:"Body Weight",
                    result:"10",
                    unit:"kcal",
                    flag:"Good",
                },
                {
                    name:"Percent Body Fate",
                    result:"10",
                    unit:"%",
                    flag:"Good",
                }
            ]
        }
    });

    const [currentpage,setcurrentpage]=useState(1)
    const [limit,setlimit]=useState(8);
    const {branchName,branchId}=Branch;
    const [Gym,setGym]=useState({
        gymId:"",
        gymName:""
    });
    const {gymId,gymName}=Gym;
    const [Member,setMember]=useState({
        mfname:"",
        mlname:"",
        memail:"",
        mphone:"",
        memberId:""
    })
    const {mfname,mlname,memail,mphone,memberId}=Member;
    const [Branchs,setBranchs]=useState([]);
    const [Gyms,setGyms]=useState([]);
    const [Members,setMembers]=useState([]);
    const [isOpen,setisOpen]=useState(false);
    const {user,token}=isAuthenticated();
    const [sortedReports,setSortedReports]=useState({
        sorted_fitness:[],
        sorted_fitnessmeasurement:[],
        sorted_phybodycomp:[]
    });
    const {sorted_fitness,sorted_fitnessmeasurement,sorted_phybodycomp}=sortedReports;



    //handler functions
    const handleOpenPopup=()=>{
        setisOpen(true);
    }
    const handleClosePopup=()=>{
        setisOpen(false)
    }
    const handleReportCreatePopup=event=>{
        handleOpenPopup()
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

        if(user.role==0&&`${id}`.toLowerCase().includes("gym")) getActiveGyms();
    }
    const handleDropdownItem=(name,value)=>event=>{
        event.preventDefault();
        if(name=="gym"){
            setGym({
                ...Gym,
                gymId:value._id,
                gymName:value.gymName
            })
          
            if(user.role==0){
                getActiveBranchs(value._id);
                setBranch({
                    ...Branch,
                    branchId:"",
                    branchName:""
                });
                setMember({
                    ...Member,
                    mfname:"",
                    mlname:"",
                    memail:"",
                    mphone:"",
                    memberId:""
                })
                setMembers([]);
            }
        }
        if(name=="branch"){
            setBranch({
                ...Branch,
                branchId:value._id,
                branchName:value.branchName
            })
            if(user.role==0) getActiveMembers(value._id)
        }
        if(name=="member"){
            setMember({
                ...Member,
                mfname:value.mfname,
                mlname:value.mlname,
                memail:value.memail,
                mphone:value.mphone,
                memberId:value._id
            })
        }
        document.getElementById(name+"-list").style.display="none";
        document.getElementById(name+"-list-icon").style.transform='rotate(-180deg)';

    }

    const toggleMemberReport = id =>(event) => {
        event.preventDefault();
        // let idDatas=["fitnessTestData","fitnessMeasurement","PhysiologicalBody"];
        // idDatas.forEach(IDmenu=>{
        //     if(IDmenu!=id){
        //         document.getElementById("data-" + IDmenu).style.display = "none";
        //         document.getElementById("radio-" + IDmenu).checked = false;
        //         document.getElementById("menu-" + IDmenu).style.border= "none"; 
        //         document.getElementById("tag-" + IDmenu).style.color="#949494";
        //     }
        // })
        if(document.getElementById("data-" + id).style.display == "none"){
            document.getElementById("data-" + id).style.display = "block";
            document.getElementById("radio-" + id).checked = true; 
            document.getElementById("menu-" + id).style.border= "1px solid #42a5f5"; 
            document.getElementById("tag-" + id).style.color="#0077ff";
        }else{
            document.getElementById("data-" + id).style.display = "none";
            document.getElementById("radio-" + id).checked = false;
            document.getElementById("menu-" + id).style.border= "none"; 
            document.getElementById("tag-" + id).style.color="#949494";
        }
        event.preventDefault();
    }


    //APIS
    const getActiveGyms=()=>{
        getAllActiveGym(user._id,token,currentpage,limit).then(data=>{
            if(data.error){
                console.log(data.error)
            }else{
                setGyms(data)
            }
        }).catch(err=>console.log(err))
    }
    const getActiveBranchs=gymId=>{
        getAllActiveBranch(user._id,token,gymId,currentpage,limit).then(data=>{
            if(data.error){
               console.log(data.error)  
            }else{
                setBranchs(data)
            }
        }).catch(err=>console.log(err))
    }

    const getActiveMembers=branchId=>{
        getAllActiveMember(user._id,token,branchId,currentpage,limit).then(data=>{
            if(data.error){
                console.log(data.error)
            }else{
                setMembers(data)
            }
        }).catch(err=>console.log(err))
    }

 
        
        const toggleGymList = () => {
        if(document.getElementById("sortgym-list").style.display == "none"){
          document.getElementById("sortgym-list").style.display = "block";
          document.getElementById("select-sortgym-icon").style.transform = "rotate(-180deg)"
        }else{
          document.getElementById("sortgym-list").style.display = "none";
          document.getElementById("select-sortgym-icon").style.transform = "rotate(0deg)"
        }
        }
        
        
        const toggleBranchList = () => {
        if(document.getElementById("sortbranch-list").style.display == "none"){
          document.getElementById("sortbranch-list").style.display = "block";
          document.getElementById("select-sortbranch-icon").style.transform = "rotate(-180deg)"
        }else{
          document.getElementById("sortbranch-list").style.display = "none";
          document.getElementById("select-sortbranch-icon").style.transform = "rotate(0deg)"
        }
        }
        
        const toggleGlobalActionContainer = () => {
        if(document.getElementById("global-action-container").style.display == "none"){
        document.getElementById("global-action-container").style.display = "block";
        
        setTimeout(() => {
          window.addEventListener("click", closeAllPopup);
        }, 10);
        
        }else{
        document.getElementById("global-action-container").style.display = "none"
        }
        
        function closeAllPopup(){
        document.getElementById("global-action-container").style.display = "none";
        window.removeEventListener("click", closeAllPopup);
        }
        }

    const prev=event=>{
        event.preventDefault();
        if(currentpage<=page&&currentpage!=1){
         //   GetAllActiveMembers(currentpage-1,props.match.params.branchId);
          setcurrentpage(currentpage-1);
        }
  };
  const next=event=>{
        event.preventDefault();
        if(currentpage<page){
         //  GetAllActiveMembers(currentpage+1,props.match.params.branchId);	
           setcurrentpage(currentpage+1);
        }
  };

  //

  //test action button
  const toggleReportAction = (branchId) => () => {
    if(document.getElementById("action-" + branchId).style.display == "none"){
      document.getElementById("action-" + branchId).style.display = "block";
  
      setTimeout(() => {
        window.addEventListener("click", closeAllPopup);
      }, 10);
  
    }else{
      document.getElementById("action-" + branchId).style.display = "none";
    }
    setBranch({...Branch,branchId:branchId});
    function closeAllPopup(){
      document.getElementById("action-" + branchId).style.display = "none";
      window.removeEventListener("click", closeAllPopup);
    }
  }
  
  
  const toggleFilter = () => {
  if(document.getElementById("filter-container-toggle").style.display == "none"){
    document.getElementById("filter-container-toggle").style.display = "block";
  }else{
    document.getElementById("filter-container-toggle").style.display = "none";
  }
  }
  
  
  const togleTestList = () => {
  if(document.getElementById("sorttest-list").style.display == "none"){
    document.getElementById("sorttest-list").style.display = "block";
    document.getElementById("select-sorttest-icon").style.transform = "rotate(-180deg)"
  }else{
    document.getElementById("sorttest-list").style.display = "none";
    document.getElementById("select-sorttest-icon").style.transform = "rotate(0deg)"
  }
  }
  
  const toggleMemberList = () => {
    if(document.getElementById("sortmember-list").style.display == "none"){
        document.getElementById("sortmember-list").style.display = "block";
        document.getElementById("select-sortmember-icon").style.transform = "rotate(-180deg)"
    }else{
        document.getElementById("sortmember-list").style.display = "none";
        document.getElementById("select-sortmember-icon").style.transform = "rotate(0deg)"
    }
  }
  

 
  

  const NavigateToRoute=(route)=>event=>{
    event.preventDefault()
    switch(route){
        case "Gym":
            history.push({
              pathname: `/admin/gym`,
              state:{action:'create'}
            });
        break;
        case "Branch":
          history.push({
            pathname: `/admin/branch`,
            state:{action:'create',gymId:""}
          });
        break;
        default:
          
            alert("hi")
        break;
    }
  }


    useEffect(()=>{
      
    },[])


    return(
        <Dashboard flag={0} data={{lowconnection : false}}>
            {/* <div className="header-bar">
                <div>
                    <div className="dashboard-name-container">
                        <div className="dashboard-name">Member Report</div>

                        <span class="material-icons-round"
                        onClick={handleReportCreatePopup}
                        style={{
                            color: "#bdbdbd",
                            margin: "-0.8% 0 0 8%",
                            cursor: "pointer",
                        }}
                        >
                        add_circle_outline
                        </span>

                    </div>
                </div>

            </div> */}




<div className="header-bar">
                        <div>
                            <div className="dashboard-name-container">
                                <div className="dashboard-name">Gym Accounts</div>
                            
                                <span onClick={toggleGlobalActionContainer} class="material-icons-round" style={{color:"#bdbdbd", margin:"-0.8% 0 0 8%", cursor:"pointer"}}>add_circle_outline</span>
                                <div id="global-action-container" className="add-global-action-container" style={{display:"none"}}>
                                <div role="button" onClick={NavigateToRoute("Gym")} className="action-item d-flex">
                                    <span class="material-icons-round flex-item">fitness_center</span>
                                    <div className="flex-item spacing-19">Add Gym</div>
                                </div>
                                <div role="button" onClick={NavigateToRoute("Branch")} className="action-item d-flex">
                                    <span class="material-icons-round flex-item">store</span>
                                    <div className="flex-item spacing-19">Add Branch</div>
                                </div>
                                <div role="button"    onClick={handleReportCreatePopup} className="action-item d-flex">
                                    <span class="material-icons-round flex-item">person_add_alt</span>
                                    <div className="flex-item spacing-19">Add Member</div>
                                </div>
                                <div className="action-item d-flex">
                                    <span class="material-icons-round flex-item">playlist_add</span>
                                    <div className="flex-item spacing-19">Add Member Report</div>
                                </div>
                                <div className="action-item d-flex">
                                    <span class="material-icons-round flex-item">group_add</span>
                                    <div className="flex-item spacing-19">Add User</div>
                                </div>
                                <div className="action-item d-flex">
                                    <span class="material-icons-round flex-item">post_add</span>
                                    <div className="flex-item spacing-19">Add Content</div>
                                </div>
                                <div className="action-item d-flex">
                                    <span class="material-icons-round flex-item">addchart</span>
                                    <div className="flex-item spacing-19">Create Planner</div>
                                </div>
                                <div className="action-item d-flex">
                                    <span class="material-icons-round flex-item">insert_chart</span>
                                    <div className="flex-item spacing-19">Assign Planner</div>
                                </div>

                            </div>

                            </div>
                            <div  className="active-inactive-container">
                                <img src={SwapIcon} className="active-inactive-icon"/>
                                <div id="switch-gym" className="active-inactive-text">Pending</div>
                            </div>
                        </div>
                        
                        <div>
                            <div className="search-field-container">
                                <input type="text" className="search-field" placeholder="search" />
                                <div className="filter-container" onClick={toggleFilter}>
                                   <img src={FilterIcon} className="filter-icon" />
                                </div>
                                <div id="filter-container-toggle" className="filter-dropdown" style={{display: "none"}}>
                                  <div className="d-flex">
                                    <div className="flex-item container-spacing bold-font">
                                    Sort By
                                    </div>
                                    <input
                                    className="flex-item"
                                    type="checkbox"
                                    style={{ marginTop: "4%" }}
                                    />
                                </div>
                                  <div className="container-spacing">
                                    <span className="g-font-1 inactive">Test</span>
                                    <div
                                    onClick={togleTestList}
                                    type="text"
                                    className="d-flex select-dropdown"
                                    >
                                    <div className="select-exercise-text">Select Test</div>
                                    <img
                                        id="select-sorttest-icon"
                                        src={ArrowUp}
                                        className="select-exercise-icon"
                                    />
                                    </div>
                                    <div id="sorttest-list" className="dropdown-menu-items" style={{display: "none"}}>
                                    <div className="menu-text-spacing">Andhra Pradesh</div>
                                    <div className="menu-text-spacing">Aurnachal Pradesh</div>
                                    <div className="menu-text-spacing">Assam</div>
                                    <div className="menu-text-spacing">Bihar</div>
                                    <div className="menu-text-spacing">Chattisgarh</div>
                                    <div className="menu-text-spacing">Goa</div>
                                    <div className="menu-text-spacing">Gujarat</div>
                                    <div className="menu-text-spacing">Haryana</div>
                                    <div className="menu-text-spacing">Himachal Pradesh</div>
                                    <div className="menu-text-spacing">Jarkhand</div>
                                    <div className="menu-text-spacing">Karnataka</div>
                                    <div className="menu-text-spacing">Kerela</div>
                                    <div className="menu-text-spacing">Madhya Pradesh</div>
                                    <div className="menu-text-spacing">Maharashtra</div>
                                    <div className="menu-text-spacing">Manipur</div>
                                    <div className="menu-text-spacing">Meghalaya</div>
                                    <div className="menu-text-spacing">Mizoram</div>
                                    <div className="menu-text-spacing">Nagaland</div>
                                    <div className="menu-text-spacing">Odisha</div>
                                    <div className="menu-text-spacing">Punjab</div>
                                    <div className="menu-text-spacing">Rajasthan</div>
                                    <div className="menu-text-spacing">Sikkim</div>
                                    <div className="menu-text-spacing">Tamil Nadu</div>
                                    <div className="menu-text-spacing">Telengana</div>
                                    <div className="menu-text-spacing">Tripura</div>
                                    <div className="menu-text-spacing">Uttarakhand</div>
                                    <div className="menu-text-spacing">Uttar Pradesh</div>
                                    <div className="menu-text-spacing">West Bengal</div>
                                    </div>
                                </div>
                                  <div className="container-spacing">
                                    <span className="g-font-1 inactive">Gym</span>
                                    <div onClick={toggleGymList}
                                    id="select-Exercise"
                                    type="text"
                                    className="d-flex select-dropdown"
                                    >
                                    <div className="select-exercise-text">Select Gym</div>
                                    <img
                                        id="select-sortgym-icon"
                                        src={ArrowUp}
                                        className="select-exercise-icon"
                                    />
                                    </div>
                                    <div id="sortgym-list" className="dropdown-menu-items" style={{display: "none"}}>
                                        <div className="menu-text-spacing">Andhra Pradesh</div>
                                    <div className="menu-text-spacing">Aurnachal Pradesh</div>
                                    </div>
                                </div>
                               
                                 <div className="container-spacing">
                                    <span className="g-font-1 inactive">Branch</span>
                                    <div onClick={toggleBranchList}
                                    id="select-Exercise"
                                    type="text"
                                    className="d-flex select-dropdown"
                                    >
                                    <div className="select-exercise-text">Select Branch</div>
                                    <img
                                        id="select-sortbranch-icon"
                                        src={ArrowUp}
                                        className="select-exercise-icon"
                                    />
                                    </div>
                                    <div id="sortbranch-list" className="dropdown-menu-items" style={{display: "none"}}>
                                        <div className="menu-text-spacing">Andhra Pradesh</div>
                                    <div className="menu-text-spacing">Aurnachal Pradesh</div>
                                    </div>
                                </div>
                            

                                <div className="container-spacing">
                                    <span className="g-font-1 inactive">Member</span>
                                    <div onClick={toggleMemberList}
                                    id="select-Exercise"
                                    type="text"
                                    className="d-flex select-dropdown"
                                    >
                                    <div className="select-exercise-text">Select Member</div>
                                    <img
                                        id="select-sortmember-icon"
                                        src={ArrowUp}
                                        className="select-exercise-icon"
                                    />
                                    </div>
                                    <div id="sortmember-list" className="dropdown-menu-items" style={{display: "none"}}>
                                        <div className="menu-text-spacing">Andhra Pradesh</div>
                                    <div className="menu-text-spacing">Aurnachal Pradesh</div>
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






                        {/* report list */}
                        <table  className="body-container">
                         <thead>
                            <tr>
                            <th style={{textAlign:"left", padding :"0 0 0 4.7%", width: "20%"}}>Test</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Synced with</th>
                            <th>Member Name</th>
                            <th>Status</th>
                            <th>Action</th>
                            </tr>
                        </thead>
                         <tbody>
                            {[0,1,2,3,4,5,6].map((report) => {
                            return (
                                <tr    style={{ backgroundColor:false?"rgb(0, 0, 0, 0.08)":"#ffffff", boxShadow:false?"none":"0px 0.01px 3px 3px rgb(0, 0, 0, 0.05)"}}>
                                <td style={{textAlign:"left", padding :"0 0 0 1.4%", width: "20%", fontWeight : "bold"}}>
                                    <div className="d-flex">
                                    <span class="material-icons-round action-icon" style={{ color:false?"#0077ff":"#cacaca"}}>check_circle</span>
                                    <div style={{padding :"2% 0 0 2%"}}>Fitness</div>
                                    </div>
                                </td>
                                <td>20/08/2021</td>
                                <td>10:00 AM</td>
                                <td>FT-20/02/2021</td>
                                <td style={{fontFamily:"sans-serif"}}>Anik Roy</td>
                                <td>
                                    <div className="d-flex" style={{padding :"0 0 0 12%"}}>
                                    <span class={`material-icons-round action-icon ${true?`active`:`inactive`}`}>circle</span>
                                    <div style={{padding :"2.2% 0 0 2%"}} className={true?`active`:`inactive`}>{true?`Complete`:`Pending`}</div>
                                    </div>
                                </td>
                                <td>
                                    <span onClick={toggleReportAction}  class="material-icons-outlined edit-icon">more_horiz</span>
                                    <div id={"action-" + report} className="table-action-container" style={{display:"none"}}>
                                    <div role="button" className="d-flex spacing-22">
                                        <img src={UpdateIcon} className="body-content-two-action-icon" />
                                        <div className="spacing-24">Update</div>
                                    </div>
                                    
                                 <div style={{margin:"2% 0", width:"100%", height:"1px", backgroundColor:"#f5f5f5"}}></div>
                                    <div role="button" className="d-flex spacing-22">
                                        <img src={BlockIcon} className="body-content-two-action-icon" />
                                        <div className="spacing-24">{true?`Block`:`Unblock`}</div>
                                    </div>

                                    </div> 
                                </td>
                                </tr>
                            );
                            })}

                        </tbody>
                        </table>


                        {/* popup */}
                        <div id="set-exercise" className="content-add-section" style={{overflowY:"hidden",display:true?"block":'none'}}>
                            <div className="exerise-header-bar">
                                <div style={{display:"flex", alignSelf:"center"}}>
                                    <div className="exercise-header-text" style={{marginRight:"6%", alignSelf:"center", whiteSpace:"nowrap"}}>Create Member Report</div>
                                </div>
                                <img  src={Cross} onClick={handleClosePopup} role="button"  className="exercise-header-close"/>
                            </div>

                            
                              <div style={{width:"94%",margin:'0 auto 0 auto', justifyContent:"space-between"}} className="popcontainer-sub-wrapper d-flex">
                                <div style={{zIndex:2,position:'relative',width:'45%',marginLeft:'1%'}} className="input-popup-space">

                                    

                                    <div onClick={()=>hanleDropDown("gym-list")} id="state-wrapper" style={{cursor:'pointer',width:'100%',border:'none',  boxShadow: '0 4px 8px 0 rgb(214, 214, 214), 0 6px 20px 0 rgb(224, 224, 224)', borderRadius: '5px'}} type="text" className="input-popup-flex input-popup select-exercise-block">
                                        <div id="gym-txt" className="select-exercise-text">{gymName==""?"Select Gym":gymName}</div>
                                        <img id="gym-list-icon" src={ArrowDown} style={{transition:'0.3s',transform:'rotate(-180deg)'}} className="select-exercise-icon"/>
                                    </div>

                                    <div id="gym-list" className="select-exercise-list" style={{display:"none",position:'absolute'}}>
                                            {
                                                Gyms.map((gym,index)=>{
                                                    return (
                                                        <div  role="button" onClick={handleDropdownItem("gym",gym)}  className="exercise-list-container">
                                                            <div className="exercise-list">
                                                                {index+1}. {gym.gymName}
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                    </div>
                                
                                </div>

                                <div style={{position:'relative',width:'45%'}} className="input-popup-space" >
                                        <div onClick={()=>hanleDropDown("branch-list")} id="branch-Exercise" style={{width:'100%',cursor:'pointer',border:'none',  boxShadow: '0 4px 8px 0 rgb(214, 214, 214), 0 6px 20px 0 rgb(224, 224, 224)', borderRadius: '5px'}} type="text" className="input-popup-flex input-popup">
                                            <div id="branch-txt" className="select-exercise-text">{branchName==""?"Select Branch":branchName}</div>
                                            <img id="branch-list-icon" src={ArrowDown} style={{transition:'0.3s',transform:'rotate(-180deg)'}} className="select-exercise-icon"/>
                                        </div>

                                        <div id="branch-list" className="select-exercise-list" style={{display:"none",position:'absolute'}}>
                                              {
                                                  Branchs.map((branch,index)=>{
                                                      return (
                                                          <div  role="button"  onClick={handleDropdownItem("branch",branch)}  className="exercise-list-container">
                                                              <div className="exercise-list">
                                                                  {index+1}. {branch.branchName}
                                                              </div>
                                                          </div>
                                                      )
                                                  })
                                              }
                                        </div>
                                        
                                    </div>
                               </div> 


                            
                               <div style={{width:"94%",margin:'2% auto 0 auto', justifyContent:"space-between"}} className="popcontainer-sub-wrapper d-flex">
                                 <div style={{zIndex:1,position:'relative',width:'45%',marginLeft:'1%'}} className="input-popup-space">

                                    

                                    <div onClick={()=>hanleDropDown("member-list")} id="member-wrapper" style={{cursor:'pointer',width:'100%',border:'none',  boxShadow: '0 4px 8px 0 rgb(214, 214, 214), 0 6px 20px 0 rgb(224, 224, 224)', borderRadius: '5px'}} type="text" className="input-popup-flex input-popup select-exercise-block">
                                        <div id="member-txt" className="select-exercise-text">{mfname==""?"Select Member":`${mfname} ${mlname}`}</div>
                                        <img id="member-list-icon" src={ArrowDown} style={{transition:'0.3s',transform:'rotate(-180deg)'}} className="select-exercise-icon"/>
                                    </div>

                                    <div id="member-list" className="select-exercise-list" style={{display:"none",position:'absolute'}}>
                                            {
                                                Members.map((member,index)=>{
                                                    return (
                                                        <div  role="button" onClick={handleDropdownItem("member",member)}  className="exercise-list-container">
                                                            <div className="exercise-list">
                                                                {index+1}. {member.mfname} {member.mlname}
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                    </div>
                                
                                </div>

                                 <input id="select-test-date"  onMouseDown={()=>{
                                    Flatpickr("#select-test-date",{
                                        onChange:()=>{
                                            setReport({
                                                ...Report,
                                                date:document.getElementById("select-test-date").value
                                            })
                                           // setplannerProp({...plannerProp,planner_startDate:document.getElementById("startdate").value})
                                        }
                                    }).open()
                                }} type="text" value={date} placeholder="Date" className="select-exercise-block" style={{width:"45%",margin:'0'}}></input>
                               </div> 


                               <div style={{width:"94%",margin:'2% auto 0 auto', justifyContent:"space-between"}} className="popcontainer-sub-wrapper d-flex">
                   
                               <input id="select-test-time"  onMouseDown={()=>{
                                    Flatpickr("#select-test-time",{
                                        enableTime: true,
                                        noCalendar: true,
                                        dateFormat: "H:i",
                                        time_24hr: false,
                                        onChange:()=>{
                                            setReport({
                                                ...Report,
                                                time:document.getElementById("select-test-time").value
                                            })
        
                                        }
                                    }).open()
                                }} type="text" value={time} placeholder="Time" className="select-exercise-block" style={{width:"45%",marginLeft:"1%"}}></input>

                               
                               </div> 



                         

                           
                            <div className="exercise-body-container" style={{margin:"2% 0 0 0", height:"68%"}}>
                       
                       
                                <div id="menu-fitnessTestData" role="button" onClick={toggleMemberReport("fitnessTestData")} className="select-unit-container">
                                    <div className="row" style={{padding: "0 5% 0 5%"}}>
                                        <div className="select-unit-header" >
                                            <div style={{display:"flex", justifyContent:"space-between", width:"100%"}}>
                                                <div style={{display:"flex"}}>
                                                    <input value="fitness-test" id="radio-fitnessTestData"  type="radio" style={{alignSelf:"center", margin :"0 1vw 0 0"}} checked/>
                                                    <div id="tag-fitnessTestData" className="select-unit-text">Fitness Test</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div onClick={e=>e.stopPropagation()}  id="data-fitnessTestData">
                                                                    
                                            <div style={{width:"94%",margin:'2% auto 2% auto', justifyContent:"space-between"}} className="popcontainer-sub-wrapper d-flex">
                                                <div style={{zIndex:2,position:'relative',width:'45%',marginLeft:'1%'}} className="input-popup-space">

                                                    

                                                    <div onClick={()=>hanleDropDown("fitnesssynctest-list")} id="fitnesssynctest-wrapper" style={{cursor:'pointer',width:'100%',border:'none',  boxShadow: '0 4px 8px 0 rgb(214, 214, 214), 0 6px 20px 0 rgb(224, 224, 224)', borderRadius: '5px'}} type="text" className="input-popup-flex input-popup select-exercise-block">
                                                        <div id="fitnesssynctest-txt" className="select-exercise-text">{TestValueList.FitnessMeasurement.sync_test==""?"Sync Test":TestValueList.Fitness.sync_test}</div>
                                                        <img id="fitnesssynctest-list-icon" src={ArrowDown} style={{transition:'0.3s',transform:'rotate(-180deg)'}} className="select-exercise-icon"/>
                                                    </div>

                                                    <div id="fitnesssynctest-list" className="select-exercise-list" style={{display:"none",position:'absolute'}}>
                                                            {
                                                                sorted_fitness.map((report,index)=>{
                                                                    return (
                                                                        <div  role="button" onClick={handleDropdownItem("fitnesssynctest",report)}  className="exercise-list-container">
                                                                            <div className="exercise-list">
                                                                                {index+1}. ft-{report.date}
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                    </div>
                                                
                                                </div>

                                            </div> 


               
                                        <div className="d-flex" style={{flexWrap:"wrap"}}>
                                            <div className="spacing-26">
                                                <div className="g-font-1">Chest</div>
                                                <div className="d-flex">
                                                    <input id="input-doctorName" className="my-profile-field field-collapse" placeholder="value in cm" />
                                                </div>
                                            </div>
                                            <div className="spacing-26 flex-item-end">
                                                <div className="d-flex">
                                                    <input id="input-doctorName" className="my-profile-field field-collapse" placeholder="goal" />
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{margin:"3% 2% 0 5%"}}>
                                            <div className="d-flex">
                                                <input id="input-others" className="my-profile-field field-expand" placeholder="Other Details" />
                                                <span id="edit-others" class="material-icons-round edit-icon">edit</span>
                                                <span id="save-others" class="material-icons-round edit-icon" style={{display: "none"}}>done</span>
                                            </div>
                                        </div> 
                                    </div>
                                </div>
                              
                                <div role="button" id="menu-fitnessMeasurement"  className="select-unit-container">
                                    <div  onClick={toggleMemberReport("fitnessMeasurement")}  className="row" style={{padding: "0 5% 0 5%"}}>
                                        <div className="select-unit-header" >
                                            <div style={{display:"flex", justifyContent:"space-between", width:"100%"}}>
                                                <div style={{display:"flex"}}>
                                                    <input value="fitness-measurement" id="radio-fitnessMeasurement"  type="radio" style={{alignSelf:"center", margin :"0 1vw 0 0"}} />
                                                    <div id="tag-fitnessMeasurement" className="select-unit-text">Fitness Measurement</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div  onClick={e=>e.stopPropagation()}  id="data-fitnessMeasurement" style={{display:"none"}}>
                                                                       
                                    <div style={{width:"94%",margin:'2% auto 2% auto', justifyContent:"space-between"}} className="popcontainer-sub-wrapper d-flex">
                                                <div style={{zIndex:2,position:'relative',width:'45%',marginLeft:'1%'}} className="input-popup-space">

                                                    

                                                    <div onClick={()=>hanleDropDown("fitnessmeasurementsynctest-list")} id="fitnessmeasurementsynctest-wrapper" style={{cursor:'pointer',width:'100%',border:'none',  boxShadow: '0 4px 8px 0 rgb(214, 214, 214), 0 6px 20px 0 rgb(224, 224, 224)', borderRadius: '5px'}} type="text" className="input-popup-flex input-popup select-exercise-block">
                                                        <div id="fitnessmeasurementsynctest-txt" className="select-exercise-text">{TestValueList.FitnessMeasurement.sync_test==""?"Sync Test":TestValueList.FitnessMeasurement.sync_test}</div>
                                                        <img id="fitnessmeasurementsynctest-list-icon" src={ArrowDown} style={{transition:'0.3s',transform:'rotate(-180deg)'}} className="select-exercise-icon"/>
                                                    </div>

                                                    <div id="fitnessmeasurementsynctest-list" className="select-exercise-list" style={{display:"none",position:'absolute'}}>
                                                            {
                                                                sorted_fitnessmeasurement.map((report,index)=>{
                                                                    return (
                                                                        <div  role="button" onClick={handleDropdownItem("fitnessmeasurementsynctest",report)}  className="exercise-list-container">
                                                                            <div className="exercise-list">
                                                                                {index+1}. fmt-{report.date}
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                    </div>
                                                
                                                </div>

                                            </div> 


                                        <div className="d-flex" style={{flexWrap:"wrap", display:"none"}}>
                                            <div className="spacing-26">
                                                <div className="g-font-1">Chest</div>
                                                <div className="d-flex">
                                                    <input id="input-doctorName" className="my-profile-field field-collapse" placeholder="value in cm" />
                                                </div>
                                            </div>
                                            <div className="spacing-26 flex-item-end">
                                                <div className="d-flex">
                                                    <input id="input-doctorName" className="my-profile-field field-collapse" placeholder="goal" />
                                                </div>
                                            </div>
                                            <div className="spacing-26">
                                                <div className="g-font-1">Mid Arm</div>
                                                <div className="d-flex">
                                                    <input id="input-doctorName" className="my-profile-field field-collapse" placeholder="value in cm" />
                                                </div>
                                            </div>
                                            <div className="spacing-26 flex-item-end">
                                                <div className="d-flex">
                                                    <input id="input-doctorName" className="my-profile-field field-collapse" placeholder="goal" />
                                                </div>
                                            </div>
                                            <div className="spacing-26">
                                                <div className="g-font-1">Waist</div>
                                                <div className="d-flex">
                                                    <input id="input-doctorName" className="my-profile-field field-collapse" placeholder="value in cm" />
                                                </div>
                                            </div>
                                            <div className="spacing-26 flex-item-end">
                                                <div className="d-flex">
                                                    <input id="input-doctorName" className="my-profile-field field-collapse" placeholder="goal" />
                                                </div>
                                            </div>
                                            <div className="spacing-26">
                                                <div className="g-font-1">Hip</div>
                                                <div className="d-flex">
                                                    <input id="input-doctorName" className="my-profile-field field-collapse" placeholder="value in cm" />
                                                </div>
                                            </div>
                                            <div className="spacing-26 flex-item-end">
                                                <div className="d-flex">
                                                    <input id="input-doctorName" className="my-profile-field field-collapse" placeholder="goal" />
                                                </div>
                                            </div>
                                            <div className="spacing-26">
                                                <div className="g-font-1">Calf</div>
                                                <div className="d-flex">
                                                    <input id="input-doctorName" className="my-profile-field field-collapse" placeholder="value in cm" />
                                                </div>
                                            </div>
                                            <div className="spacing-26 flex-item-end">
                                                <div className="d-flex">
                                                    <input id="input-doctorName" className="my-profile-field field-collapse" placeholder="goal" />
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{margin:"3% 2% 0 5%"}}>
                                            <div className="d-flex">
                                                <input id="input-others" className="my-profile-field field-expand" placeholder="Other Details" />
                                                <span id="edit-others" class="material-icons-round edit-icon">edit</span>
                                                <span id="save-others" class="material-icons-round edit-icon" style={{display: "none"}}>done</span>
                                            </div>
                                        </div> 
                                    </div>
                                </div>
                               
                                <div  role="button" id="menu-PhysiologicalBody" style={{marginBottom:'25%'}}  className="select-unit-container">
                                    <div onClick={toggleMemberReport("PhysiologicalBody")} className="row" style={{padding: "0 5% 0 5%"}}>
                                        <div className="select-unit-header">
                                            <div style={{display:"flex", justifyContent:"space-between", width:"100%"}}>
                                                <div style={{display:"flex"}}>
                                                    <input value="physiological-and-body" id="radio-PhysiologicalBody"  type="radio" style={{alignSelf:"center", margin :"0 1vw 0 0"}} />
                                                    <div id="tag-PhysiologicalBody" className="select-unit-text">Physiological Parameter & Body composition</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div onClick={e=>e.stopPropagation()}  id="data-PhysiologicalBody" style={{display:"none"}}>
                                                                        
                                    <div style={{width:"94%",margin:'2% auto 2% auto', justifyContent:"space-between"}} className="popcontainer-sub-wrapper d-flex">
                                                <div style={{zIndex:2,position:'relative',width:'45%',marginLeft:'1%'}} className="input-popup-space">

                                                    

                                                    <div onClick={()=>hanleDropDown("phybodysynctest-list")} id="phybodysynctest-wrapper" style={{cursor:'pointer',width:'100%',border:'none',  boxShadow: '0 4px 8px 0 rgb(214, 214, 214), 0 6px 20px 0 rgb(224, 224, 224)', borderRadius: '5px'}} type="text" className="input-popup-flex input-popup select-exercise-block">
                                                        <div id="phybodysynctest-txt" className="select-exercise-text">{TestValueList.PhyBody.sync_test==""?"Sync Test":TestValueList.PhyBody.sync_test}</div>
                                                        <img id="phybodysynctest-list-icon" src={ArrowDown} style={{transition:'0.3s',transform:'rotate(-180deg)'}} className="select-exercise-icon"/>
                                                    </div>

                                                    <div id="phybodysynctest-list" className="select-exercise-list" style={{display:"none",position:'absolute'}}>
                                                            {
                                                                sorted_fitnessmeasurement.map((report,index)=>{
                                                                    return (
                                                                        <div  role="button" onClick={handleDropdownItem("phybodysynctest",report)}  className="exercise-list-container">
                                                                            <div className="exercise-list">
                                                                                {index+1}. phybody-{report.date}
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                    </div>
                                                
                                                </div>

                                            </div> 


                                        <div className="d-flex" style={{flexWrap:"wrap"}}>
                                            
                                            <div className="spacing-26">
                                                <div className="g-font-1">Systolic BP</div>
                                                <div className="d-flex">
                                                    <input id="input-doctorName" className="my-profile-field field-collapse" placeholder="Value in mm Hg" />
                                                </div>
                                            </div>
                                            <div className="spacing-26">
                                                <div className="g-font-1">Diastolic BP</div>
                                                <div className="d-flex">
                                                    <input id="input-doctorName" className="my-profile-field field-collapse" placeholder="Value in mm Hg" />
                                                </div>
                                            </div>
                                            <div className="spacing-26">
                                                <div className="g-font-1">Resting Heart Rate</div>
                                                <div className="d-flex">
                                                    <input id="input-doctorName" className="my-profile-field field-collapse" placeholder="Value in BPM" />
                                                </div>
                                            </div>
                                            <div className="spacing-26">
                                                <div className="g-font-1">Basal Metabolic Rate</div>
                                                <div className="d-flex">
                                                    <input id="input-doctorName" className="my-profile-field field-collapse" placeholder="Value in kcal" />
                                                </div>
                                            </div>
                                            <div className="spacing-26">
                                                <div className="g-font-1">Body Weight</div>
                                                <div className="d-flex">
                                                    <input id="input-doctorName" className="my-profile-field field-collapse" placeholder="Value in kcal" />
                                                </div>
                                            </div>
                                            <div className="spacing-26">
                                                <div className="g-font-1">Percent Body Fat</div>
                                                <div className="d-flex">
                                                    <input id="input-doctorName" className="my-profile-field field-collapse" placeholder="Value in %" />
                                                </div>
                                            </div>
                                            <div className="spacing-26">
                                                <div className="g-font-1">Upload body composition</div>
                                                <div className="d-flex">
                                                    <div className="d-flex">
                                                        <form>
                                                            <input type="file" id="file-upload"/>
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
                                        </div>
                                        <div style={{margin:"3% 2% 0 5%"}}>
                                            <div className="d-flex">
                                                <input id="input-others" className="my-profile-field field-expand" placeholder="Other Details" />
                                                <span id="edit-others" class="material-icons-round edit-icon">edit</span>
                                                <span id="save-others" class="material-icons-round edit-icon" style={{display: "none"}}>done</span>
                                            </div>
                                        </div> 
                                    </div>
                                </div>
                              


                               
                            </div>
                            
                             
                            {/* <div className="register-button">
                                  <div>Register</div>
                            </div> */}

                        </div>
                        


        </Dashboard>   
    )
}