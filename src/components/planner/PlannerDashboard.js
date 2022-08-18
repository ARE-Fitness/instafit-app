import React, {useState,useEffect} from 'react';
import Link from 'react-router-dom/Link';
import { isAuthenticated } from '../../auth';
import { getBranch } from '../../branch/helper/api';
import Dashboard from '../../core/Dashboard';
import { getGym } from '../../gym/helper/api';
import { checkPlannerStatus, createPlanner, deletePlanner, getAllPlanner, getAllPlanners, getPlanner, updatePlanner } from '../helper/api';
import { useHistory } from "react-router-dom";
import ArrowDown from '../../assets/arrow-down.svg';
import Cross from "../../assets/cross.svg";
import SwapIcon from "../../assets/swap.svg";
import FilterIcon from "../../assets/filter.svg";
import ArrowLeft from "../../assets/arrow-left.svg";
import ArrowRight from "../../assets/arrow-right.svg";
import BlockIcon from "../../assets/block.svg";
import UpdateIcon from "../../assets/edit.svg";
import DownloadIcon from "../../assets/download.svg";
import ArrowUp from "../../assets/arrow-sign.svg";
import _, { map } from 'lodash';

const PlannerDashBoard = (props) => {
    // Hooks call for getting Dashboard Info 
    const ItemId = props.match.params.itemId;
    // User Authentication
    const {user,token} = isAuthenticated();
    const history=useHistory();
    const [Branch,setBranch]=useState({
        branchName:"",
        branchId:"",
        branch_active:false,
        totaladminusers:0,
        totalmembers:0,
        phone:"",
        email:"",
        gymId:"",
        gymName:""
    });
    const {branchName,totaladminusers,totalmembers,branchId,phone,email,gymId,branch_active,gymName}=Branch;
    const [currentExId,setcurrentExId]=useState(null);
    const [Planners,setPlanners]=useState({
            workoutPlanner:[],
            fitnessPlanner:[]
    });
    const {workoutPlanner,fitnessPlanner}=Planners;//planner list
    const [plannerType,setplannerType]=useState(0) // 0-workout planner 1-fitness planner test
    const [mapAction,setmapAction]=useState(0);
    const [plannerRole,setplannerRole]=useState(0); // 0- workout planner 1 - fitness planner

    const [dialogform,setdialogform]=useState({
        formtitle:"Create Planner",
        formrole:0 //0 create 1 update 2 block
    });
    const {formtitle,formrole}=dialogform;
    const [Planner,setPlanner]=useState({
        planner_name:"",
        level:"",
        plannerId:0,
        active:false
    });
    const {planner_name,plannerId,level,active}=Planner;
    const [isOpen,setisOpen]=useState(false);
    const [exerciseLevel,setexerciseLevel]=useState([
        "Beginner 1",
        "Beginner 2",
        "Intermediate 1",
        "Advanced",
        "Pro"
    ]);
   
    const [selectedUnit, setSelectedUnit] = useState("Distance");
    const distance = "Distance";
    const time = "Time";
    const number = "Number";
    const weight = "Weight";

   


    const [selectedContentList, setSelectedContentList] = useState([]);
    const [instafitContentList, setInstafitContentList] =  useState([
        {
            id: "ins-content-1",
            contentName: "Instafit-Content-1",
        },
        {
            id: "ins-content-2",
            contentName: "Instafit-Content-2",
        }
    ])
    const handleChange=name=>event=>{
        setPlanner({...Planner,[name]:event.target.value});
    }
    const handleOpen=()=>{
        setisOpen(true);
    }
    const handleClose=()=>{
        setisOpen(false);
    }
       
    const vlidateField=(name,value)=>{
    
        if(name=="planner_name"){
            return value.length>1&&value.length<=30
        }
        
    }
    
      const OnBlurFieldChecker=name=>()=>{
        let checker=vlidateField(name,Planner[name]);
        checkPlannerStatus(user._id,token,ItemId,{field:name,value:Planner[name]}).then(data=>{
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

    const GetBranch=branchId=>{
        return getBranch(user._id,token,branchId).then(branch=>{
            if(branch.error){
               return false;
            }else{
                return branch;
            }
        }).catch(()=>{
            return false;
        });

        // getGym(user._id,token,branch.gymId).then(gym=>{
        //     if(gym.error){
        //         throw "Something went wrong please try again";
        //     }else{
        //        setBranch({branchName:branch.branchName,branch_active:branch.active,branchId:branch._id,totalmembers:branch.memberList.length,totaladminusers:branch.branchAdminList.length,phone:gym.phone,email:gym.email,gymId:gym._id,gymName:gym.gymName});
        //        return branch;
        //     }
        // }).then(branch=>{
        //     getAllPlanner(user._id,token,branch._id,8,1).then(data=>{
        //         if(data.error){
        //             throw "Something went wrong please try again";
        //         }else{
        //             setPlanners(data)
        //         }
        //     })
        // }).catch(err=>console.log(err));
    };

    const GetGym=gymId=>{
        return getGym(user._id,token,gymId).then(data=>{
            if(data.error){
                return false;
            }else{
                return data;
            }
        }).catch((err)=>{
            return false;
        })
    }

    const GetPlanner=plannerId=>{
        return getPlanner(user._id,token,plannerId).then(data=>{
            if(data.error){
                return false;
            }else{
                return data;
            }
        }).catch(err=>{
            return false;
        })
    }

    const GetAllPlanners=active=>{
        return getAllPlanners(user._id,token,{active}).then(data=>{
            if(data.error){
                return false;
            }else{
                return data;
            }
        }).catch(()=>{
            return false;
        })
    }

    const CreatePlanner=event=>{
        event.preventDefault();
        switch(plannerType){
            case 0:
            createPlanner(user._id,token,{planner_name,level}).then(async data=>{
                if(data.error){
                    throw "error creating planner something went wrong";
                }else{
                    try{
                        let planners=await GetAllPlanners(true)
                        if(planners!=false){
                           setPlanners({...Planners,workoutPlanner:planners});
                           setisOpen(false)
                        }else{
                            console.log('err')
                        }
                        
                    }catch(err){
                        console.log('please try again')
                    }
                }
            }).catch(err=>console.log(err))
            break;
            case 1:
            break;
            default:
                console.log('something went wrong')
        }
        // let bol=window.confirm("Are you sure you want to create new planner");
        // if(bol){
        //     document.body.style.cursor="wait";
        //     createPlanner(user._id,token,ItemId,{planner_name:"untitled planner"}).then(data=>{
        //         if(data.error){
        //             throw "error creating planner something went wrong";
        //         }else{
        //             return data;
        //         }
        //     }).then(data=>{
        //         setTimeout(()=>{
        //              document.body.style.cursor="default";
        //              history.push(`/${ItemId}/${data._id}/manage-planner`);
        //         },1500);
        //     }).catch(err=>console.log(err))
        // }
        event.stopPropagation();
    };
    const DeletePlanner=(plannerId,name)=>e=>{
        e.preventDefault();
        let bol=window.confirm(`Are you sure you want to delete ${name}`);
        if(bol){
            document.body.style.cursor="wait";
            deletePlanner(user._id,token,ItemId,plannerId).then(data=>{
                if(data.error){
                    throw 'Something went wrong please try again'
                }else{
                    getAllPlanner(user._id,token,ItemId,8,1).then(data=>{
                        if(data.error){
                            throw "Something went wrong please try again";
                        }else{
                            setTimeout(()=>{
                                document.body.style.cursor="default";
                                setPlanners(data);
                            },1500);
                        }
                    })
                }
            }).catch(err=>console.log(err));
        }
       e.stopPropagation();
    };
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
    const handleDropdownItem=(name,value)=>event=>{
        event.preventDefault();
        switch(name){
            case "plannertype":
                setplannerType(value);
            break;
            default:
                setPlanner({...Planner,[name]:value});
        }
        document.getElementById(name+"-list").style.display="none";
        document.getElementById(name+"-list-icon").style.transform='rotate(-180deg)';

    }

    const toggleSelectedPlanner = () => {
        if(document.getElementById("select-planner").style.display == "none"){
            document.getElementById("select-planner").style.display = "block";
            document.getElementById("icon-planner").style.transform = "rotate(-180deg)";

            document.getElementById("workout-planner").addEventListener("click", function(){
                let plannerType = document.getElementById("workout-planner").innerHTML; 
                document.getElementById("selected-plannerType").innerHTML = plannerType;    
                document.getElementById("select-planner").style.display = "none"; 
                document.getElementById("icon-planner").style.transform = "rotate(0deg)";
                document.getElementById("workout-plannerList").style.display = "table";
                document.getElementById("fitness-plannerList").style.display = "none";
            })

            document.getElementById("fitness-planner").addEventListener("click", function(){
                let plannerType = document.getElementById("fitness-planner").innerHTML; 
                document.getElementById("selected-plannerType").innerHTML = plannerType;
                document.getElementById("select-planner").style.display = "none"; 
                document.getElementById("icon-planner").style.transform = "rotate(0deg)";
                document.getElementById("workout-plannerList").style.display = "none";
                document.getElementById("fitness-plannerList").style.display = "table";       
            })

        }else{
            document.getElementById("select-planner").style.display = "none";
            document.getElementById("icon-planner").style.transform = "rotate(0deg)";
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

    const toggleFitnessPlannerView = (currentTarget) => {
        let currentTargetValue = currentTarget.split('-')[1];
        if(document.getElementById("view-" + currentTargetValue).style.display == "none"){
            document.getElementById("view-" + currentTargetValue).style.display = "block";
        }else{
            document.getElementById("view-" + currentTargetValue).style.display = "none";
        }
    }

    const toggleFitnessPlannerCreate = (event) => {
        let createFitnessPlanner = event.split('-')[1];
        if(document.getElementById("add-" + createFitnessPlanner).style.display == "none"){
            document.getElementById("add-" + createFitnessPlanner).style.display = "block";
        }else{
            document.getElementById("add-" + createFitnessPlanner).style.display = "none";
        }
        // alert(createFitnessPlanner);
    }

    const togglePlannerAction = (currentPlanner)=>event => {
        event.preventDefault()
        let currentPlannerName = currentPlanner.split('-')[1];
        if(document.getElementById('action-' + currentPlannerName).style.display == "none"){
            document.getElementById('action-' + currentPlannerName).style.display = "block";
        }else{
            document.getElementById('action-' + currentPlannerName).style.display = "none";
        }
        // alert(currentPlannerName);
    }

    const toggleContentList = (event) => {
        let currentContentList  =  event.target.id.split('-')[1];
        let instafit = currentContentList.includes('instafit');
        let gym = currentContentList.includes('gym');
        let my = currentContentList.includes('my');

        if(instafit && !gym && !my){
            if(document.getElementById('contentList-instafit').style.display == "none"){
                document.getElementById('contentList-instafit').style.display = "block";
                document.getElementById('icon-instafit').style.transform = "rotate(180deg)";
                document.getElementById('contentList-gym').style.display = "none";
                document.getElementById('contentList-my').style.display = "none";
            }else{
                document.getElementById('contentList-instafit').style.display = "none";
                document.getElementById('icon-instafit').style.transform = "rotate(0deg)";
                document.getElementById('contentList-gym').style.display = "block";
                document.getElementById('contentList-my').style.display = "none";
            }
        }

        if(gym && !instafit && !my){
            if(document.getElementById('contentList-gym').style.display == "none"){
                document.getElementById('contentList-gym').style.display = "block";
                document.getElementById('iconList-gym').style.transform = "rotate(180deg)";
                document.getElementById('contentList-instafit').style.display = "none";
                document.getElementById('contentList-my').style.display = "none";
            }else{
                document.getElementById('contentList-instafit').style.display = "none";
                document.getElementById('iconList-gym').style.transform = "rotate(0deg)";
                document.getElementById('contentList-gym').style.display = "none";
                document.getElementById('contentList-my').style.display = "block";
            }
        }

        if(my && !instafit && !gym){
            if(document.getElementById('contentList-my').style.display == "none"){
                document.getElementById('contentList-my').style.display = "block";
                document.getElementById('icon-my').style.transform = "rotate(180deg)";
                document.getElementById('contentList-gym').style.display = "none";
                document.getElementById('contentList-instafit').style.display = "none";
            }else{
                document.getElementById('contentList-my').style.display = "none";
                document.getElementById('icon-my').style.transform = "rotate(0deg)";
                document.getElementById('contentList-gym').style.display = "none";
                document.getElementById('contentList-instafit').style.display = "block";
            }
        }
    }

    const handleToggle = (data) => event => {
        event.preventDefault();
        let currentIndex = selectedContentList.findIndex(doc => doc.id == data.id);
        let newChecked = [...selectedContentList];
        if(currentIndex == -1){
            data['unit'] = "Select";
            newChecked.push(data)
        }else{
            newChecked.splice(currentIndex, 1);
        }
        setSelectedContentList(newChecked);
    }

    const handleDropdownItemClick = (data, index, value) => event => {
        event.preventDefault();
        let newArray = [...selectedContentList];
        newArray[index]['unit'] = data;
        setSelectedContentList(newArray);
        document.getElementById("exercise-unit-" + value.contentName).style.display = "none";
    }

    const toggleUnitList = (data) => event => {
        if(document.getElementById("exercise-unit-" + data.contentName).style.display == "none"){
            document.getElementById("exercise-unit-" + data.contentName).style.display = "block";
        }else{
            document.getElementById("exercise-unit-" + data.contentName).style.display = "none";
        }
    }

    const  handleActiveInactiveList=async event=>{
        event.preventDefault();
        let activeprop=false;
        if(mapAction==0){
            await setmapAction(1);
            setPlanner({
                ...Planner,
                active:true
            })
        }else{
            await setmapAction(0);
            activeprop=true;
            setPlanner({
                ...Planner,
                active:false
            })
        }

        if(plannerRole==0){
             try{
                let planners=await GetAllPlanners(activeprop);
                setPlanners({...Planners,workoutPlanner:planners})
             }catch(err){
                 console.log('something went wrong please try again')
             }
        }
        else alert("not yet")
    }

    const handleActiveInActiveOperation=planner=>async event=>{
        event.preventDefault();
        await setdialogform({
            ...dialogform,
            formrole:2,
            formtitle:`Are you sure you want to ${mapAction==0?'inactive':`active`} this planner ?`
        })
        await setPlanner({
            ...Planner,
            plannerId:planner._id
        })
        
        setisOpen(true)
    }

    const ActiveInactivePlanner=event=>{
    
        event.preventDefault();
        if(plannerRole==0){
            updatePlanner(user._id,token,plannerId,{active}).then(async data=>{
                if(data.error){
                    console.log("unable to update the planner")
                }else{
                    let active=mapAction==0?true:false;
                    try{
                        let planners=await GetAllPlanners(active);
                        setPlanners({
                            ...Planners,
                            workoutPlanner:planners
                        });
                        setisOpen(false);
                    }catch(err){
                        console.log('unable tyo fetch data new data')
                    }
                }
            }).catch(err=>{
                console.log('unable to  update the planner')
            })
        }else{
            console.log('not yet')
        }
        
    }

   

    useEffect(async ()=>{
      //  GetBranch();
        try{
            let planners=await GetAllPlanners(true)
            if(planners!=false){
               setPlanners({...Planners,workoutPlanner:planners});
            }else{
                console.log('err')
            }
            
        }catch(err){
            console.log('please try again')
        }
        if(props.location.state&&props.location.state.action=="create")  setisOpen(true);
        document.body.style.cursor="default";
    },[])
 
    return(
        <Dashboard  flag={2} data={{
            branchId,
            branchName,
            gymId,
            gymName,
            email,
            totaladminusers,
            totalmembers,
            phone,
            active:branch_active,
            state:props.location.state
          }}>


        <div className="header-bar">
                <div>
                    <div className="dashboard-name-container">
                        <div className="dashboard-name">Planner</div>
                        <span onClick={handleOpen} class="material-icons-round" style={{color:"#bdbdbd", margin:"-0.8% 0 0 8%", cursor:"pointer"}}>add_circle_outline</span>
                    </div>
                    <div role="button" onClick={handleActiveInactiveList} className="active-inactive-container">
                        <img src={SwapIcon} className="active-inactive-icon"/>
                        <div id="switch-gym" className="active-inactive-text">{mapAction==0?"Active":"Inactive"}</div>
                    </div>
                </div>
                <div>
                    <div className="d-flex">
                        <div>
                            <div id="selected-planner" onClick={toggleSelectedPlanner} role="button" style={{alignSelf:'center',marginLeft:'0',width:'12vw',border:'none'}} className="popup-button-wrapper">
                                <div className="popup-wrapper-item">
                                    <div className="d-flex" style={{marginBottom:"-2%"}}>
                                        <div style={{fontWeight:400,fontSize:'0.8vw'}} className="popup-wrapper-item-text flex-item">Selected Type</div>
                                        <img id="icon-planner" className="flex-item" style={{marginLeft:"10%"}} src={ArrowDown} />
                                    </div>

                                    <div id="selected-plannerType" className="popup-wrapper-item-text">Workout</div>
                                    {/* <div className="popup-wrapper-item-text">Fitness Test</div> */}
                                    {/* {gymName==""?`Select Gym`:gymName.toString().substring(0,12)}{gymName.toString().length>12?"....":""} */}
                                </div>
                            </div>
                            <div id="select-planner" className="select-type-dropdown" style={{display:"none"}}>
                                <div id="workout-planner" className="popup-wrapper-item-text" style={{fontWeight:"normal"}}>Workout</div>
                                <div className="item-divider"/>
                                <div id="fitness-planner" className="popup-wrapper-item-text" style={{fontWeight:"normal"}}>Fitness Test</div>
                            </div>
                        </div>
                        <div className="search-field-container">
                            <input type="text" className="search-field" placeholder="search" />
                            <div className="filter-container" onClick={toggleFilter}>
                                <img src={FilterIcon} className="filter-icon" />
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
                            </div>

                        </div>

                    </div>

                    <div className="pagination-container">
                        <div className="pagination-tracker">
                            1 - 9  of  56 
                        </div>
                        <img src={ArrowLeft}  className="pagination-icon"/>
                        <img src={ArrowRight} className="pagination-icon"/>
                    </div>
                </div>
                </div>

            <table id="workout-plannerList" className="body-container">
                <thead>
                    <tr>
                    <th style={{textAlign:"left", padding :"0 0 0 4.7%", width: "20%"}}>Planner Name</th>
                    <th>Level</th>
                    <th>Frequency</th>
                    <th>Created by</th>
                    <th>Status</th>
                    <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                   {
                        workoutPlanner.map((planner,index)=>{
                           return (

                        <tr>
                        <td style={{textAlign:"left", padding :"0 0 0 1.4%", width: "20%", fontWeight : "bold"}}>
                            <div className="d-flex">
                                <span class="material-icons-round action-icon">check_circle</span>
                                <div onClick={()=>history.push(`/planner/${planner.account_id}/${planner._id}`)} style={{padding :"2% 0 0 2%"}}>{planner.planner_name}</div>
                            </div>
                        </td>
                        <td>{planner.level}</td>
                        <td style={{fontFamily:"sans-serif"}}>{planner.planner_freq} Days</td>
                        <td>{planner.created_by}</td>
                        <td>
                            <div className="d-flex" style={{padding :"0 0 0 17%"}}>
                                <span className={`material-icons-round action-icon ${planner.active?"active":"inactive"}`}>circle</span>
                                <div style={{padding :"2.2% 0 0 2%"}} className={planner.active?"active":"inactive"}>{planner.active?"Active":"Inactive"}</div>
                            </div>
                        </td>
                        <td>
                        <span onClick={togglePlannerAction("toggleAction-plannerList_workout"+index)} class="material-icons-outlined edit-icon" style={{marginTop:"4%"}}>more_horiz</span>
                            <div id={"action-plannerList_workout"+index} className="table-action-container" style={{display:"none",zIndex:1}}>
                                <div onClick={() => {alert("not  yet")}} role="button" className="d-flex spacing-22">
                                    <img src={UpdateIcon} className="body-content-two-action-icon" />
                                    <div className="spacing-24">Update</div>
                                </div>
                                <div style={{margin:"2% 0", width:"100%", height:"1px", backgroundColor:"#f5f5f5"}}></div>
                                <div role="button" onClick={handleActiveInActiveOperation(planner)}  className="d-flex spacing-22">
                                    <img src={BlockIcon} className="body-content-two-action-icon" />
                                    <div className="spacing-24">Inactive</div>
                                </div>
                            </div>
                        </td>
                    </tr>
            
                           )
                       })
                   }
                </tbody>
            </table>


            <table id="fitness-plannerList"  className="body-container" style={{display:"none"}}>
                <thead>
                    <tr>
                        <th style={{textAlign:"left", padding :"0 0 0 4.7%", width: "20%"}}>Planner Name</th>
                        <th>Level</th>
                        <th>No. of Level</th>
                        <th>Created by</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={{textAlign:"left", padding :"0 0 0 1.4%", width: "20%", fontWeight : "bold"}}>
                            <div onClick={() => {toggleFitnessPlannerView("target-plannerList")}} className="d-flex">
                                <span class="material-icons-round action-icon">check_circle</span>
                                <div style={{padding :"2% 0 0 2%"}}>Planner Name</div>
                            </div>
                        </td>
                        <td>Beginner</td>
                        <td style={{fontFamily:"sans-serif"}}>10</td>
                        <td>Jodu Modhu</td>
                        <td>
                            <div className="d-flex" style={{padding :"0 0 0 17%"}}>
                                <span className="material-icons-round action-icon active">circle</span>
                                <div style={{padding :"2.2% 0 0 2%"}} className="active">Active</div>
                            </div>
                        </td>
                        <td>
                            <span onClick={togglePlannerAction("toggleAction-fitness_plannerList")} class="material-icons-outlined edit-icon" style={{marginTop:"4%"}}>more_horiz</span>
                            <div id="action-fitness_plannerList" className="table-action-container" style={{display:"none"}}>
                                <div onClick={() => {toggleFitnessPlannerCreate("target-plannerContent")}} role="button" className="d-flex spacing-22">
                                    <img src={UpdateIcon} className="body-content-two-action-icon" />
                                    <div className="spacing-24">Update</div>
                                </div>
                                <div style={{margin:"2% 0", width:"100%", height:"1px", backgroundColor:"#f5f5f5"}}></div>
                                <div role="button" className="d-flex spacing-22">
                                    <img src={BlockIcon} className="body-content-two-action-icon" />
                                    <div className="spacing-24">Inactive</div>
                                </div>
                            </div>
                        </td>

                    </tr>
                </tbody>
            </table>


            <div id="view-plannerList" className="popup-container" style={{display:"none"}}>
                <div className="popup-view">
                    <div className="d-flex" style={{justifyContent:"space-between"}}>
                        <div className="bold-font my-profile-heading flex-item">Planner Name</div>
                        <span onClick={() => {toggleFitnessPlannerView("close-plannerList")}} class="material-icons-round edit-icon">close</span>
                    </div>
                    <div className="table-scroll-container">
                        <table className="popup-fitness-test-table">
                            <thead>
                                <tr>
                                    <th style={{width:"12%", background:"#f5f5f5"}}>Sl No.</th>
                                    <th style={{width:"62%"}}>Content Name</th>
                                    <th style={{width:"20%", textAlign:"center"}}>Unit</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={{width:"12%", textAlign:"center"}}>1.</td>
                                    <td style={{width:"62%", color:"#0052af"}}>Hips Workout</td>
                                    <td style={{width:"20%", textAlign:"center"}}>KG</td>
                                </tr>
                                <tr>
                                    <td style={{width:"12%", textAlign:"center"}}>2.</td>
                                    <td style={{width:"62%", color:"#0052af"}}>Legs Workout</td>
                                    <td style={{width:"20%", textAlign:"center"}}>KG</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>



            <div id="add-plannerContent" className="popup-container" style={{display:"none"}}>    
                <div className="popup-view" style={{width:"50vw"}}>
                    <div className="d-flex" style={{justifyContent:"space-between"}}>
                        <div className="bold-font my-profile-heading flex-item">Planner Name</div>
                        <span onClick={() => {toggleFitnessPlannerCreate("close-plannerContent")}} class="material-icons-round edit-icon">close</span>
                    </div>
                    <div className="d-flex" style={{justifyContent:"space-between", width:"100%"}}>
                        <div className="table-scroll-container" style={{marginTop:"2%", width:"55%"}}>

                            <table className="popup-fitness-test-table">
                                <thead>
                                    <tr>
                                        <th style={{width:"15%", background:"#f5f5f5"}}>Sl No.</th>
                                        <th style={{width:"55%", paddingLeft:"3.3%"}}>Content Name</th>
                                        <th style={{width:"30%", textAlign:"center"}}>Unit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedContentList.map((data, index) => {
                                        return(
                                            <tr draggable="true">
                                                <td style={{width:"15%", textAlign:"center"}}>{index+1}.</td>
                                                <td style={{width:"55%", color:"#0052af"}}>
                                                    <div className="d-flex">
                                                        <div style={{fontWeight:400}} className="popup-wrapper-item-text flex-item">{data.contentName}</div>
                                                    </div>
                                                </td>
                                                <td style={{width:"30%", textAlign:"center"}}>
                                                    <div onClick={toggleUnitList(data)} className="d-flex" style={{justifyContent:"right", margin:"0 0.1% 0 0"}}>
                                                        <div id={"selected-unit-" + data.id} style={{fontWeight:400}} className="flex-item">{data.unit}</div>
                                                        <img id="icon-planner" className="flex-item" style={{marginLeft:"10%"}} src={ArrowUp} />
                                                    </div>

                                                    <div id={"exercise-unit-" + data.contentName}  className="select-exercise-list" style={{display:"none", height:'auto',position:'absolute', margin:"auto", width:"10vw", marginLeft:"-3.5%"}}>
                                                        <div onClick={handleDropdownItemClick(distance, index, data)} id={"distance-" + data.contentName} role="button" className="exercise-list-container">
                                                            <div className="exercise-list">{distance}</div>
                                                        </div>
                                                        <div onClick={handleDropdownItemClick(time, index, data)} id={"time-" + data.contentName} role="button" className="exercise-list-container">
                                                            <div className="exercise-list">{time}</div>
                                                        </div>
                                                        <div onClick={handleDropdownItemClick(number, index, data)} role="button" className="exercise-list-container">
                                                            <div className="exercise-list">{number}</div>
                                                        </div>
                                                        <div onClick={handleDropdownItemClick(weight, index, data)} role="button" className="exercise-list-container">
                                                            <div className="exercise-list">{weight}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <div className="content-selection-container">

                            <div onClick={toggleContentList} id="contentView-instafit" className="d-flex select-menu-container" style={{borderRadius:"5px 5px 0 0"}}>
                                <div id="contentName-instafit">Instafit Content</div>
                                <img id="icon-instafit" className="flex-item" style={{marginLeft:"10%", transition:"0.2s", transform:"rotate(180deg)"}} src={ArrowUp} />
                            </div>

                            <div id="contentList-instafit" className="selected-menu">
                            {instafitContentList.map((data, index) => {
                                return(
                                    <div>
                                        {/* <div className="d-flex" style={{margin:"1% 0 1% 0"}}>
                                            <span class="material-icons-round selected-icon" style={{color:"#0077ff"}}>check_circle</span>
                                            <div className="flex-item selected-menu-text">Content Name</div>
                                        </div> */}
                                        <div className="d-flex" onClick={handleToggle(data)}>
                                            <span id={"icon-" + data.id} style={{color:selectedContentList.findIndex(doc => doc.id == data.id)!==-1?"#0077ff":"#b6b6b6"}}  class="material-icons-round selected-icon">check_circle</span>
                                            <div id={data.id} style={{color:selectedContentList.findIndex(doc => doc.id == data.id)!==-1?"#0077ff":"#b6b6b6"}} className="flex-item unSelected-menu-text">{data.contentName}</div>
                                        </div>
                                    </div>

                                )

                            })}
                            </div>



                            <div onClick={toggleContentList} id="contentView-gym" className="d-flex select-menu-container">
                                <div id="contentName-gym">Gym Content</div>
                                <img id="iconList-gym" className="flex-item" style={{marginLeft:"10%", transition:"0.2s"}} src={ArrowUp} />
                            </div>

                            <div id="contentList-gym" className="selected-menu" style={{display:"none"}}>
                                <div className="d-flex" style={{margin:"1% 0 1% 0"}}>
                                    <span id="contentIconId1-gym" class="material-icons-round selected-icon" style={{color:"#0077ff"}}>check_circle</span>
                                    <div className="flex-item selected-menu-text">Content Name</div>
                                </div>
                                <div className="d-flex">
                                <span class="material-icons-round selected-icon">check_circle</span>
                                    <div className="flex-item unSelected-menu-text">Content Name</div>
                                </div>
                            </div>

                            <div onClick={toggleContentList} id="contentView-my" className="d-flex select-menu-container"  style={{borderRadius:"0 0 5px 5px"}}>
                                <div id="contentName-my">My Content</div>
                                <img id="icon-my" className="flex-item" style={{marginLeft:"10%", transition:"0.2s"}} src={ArrowUp} />
                            </div>
                            <div id="contentList-my" className="selected-menu" style={{display:"none"}}>
                                <div className="d-flex" style={{margin:"1% 0 1% 0"}}>
                                    <span class="material-icons-round selected-icon" style={{color:"#0077ff"}}>check_circle</span>
                                    <div className="flex-item selected-menu-text">Content Name</div>
                                </div>
                                <div className="d-flex">
                                <span class="material-icons-round selected-icon">check_circle</span>
                                    <div className="flex-item unSelected-menu-text">Content Name</div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                </div>

                <div  className={`content-add-section content-add-section-rs-size`} style={{display:isOpen?"block":"none"}}>
                <div className="exerise-header-bar">
                    <div style={{display:"flex", alignSelf:"center"}} >
                        <div className="exercise-header-text" style={{marginRight:"6%", alignSelf:"center", whiteSpace:"nowrap"}}>{formtitle}</div>
                    </div>

                    <img  src={Cross} role="button" onClick={handleClose} className="exercise-header-close"/>
                </div>


                {
                    formrole==2?[
                        <div className="ml-5 mt-4 mr-5 mb-4">
                            <p className="pt-2" style={{fontWeight: "bold"}}>Important Note:
                                <p style={{fontWeight:"lighter", color:"#757575"}}>Branch's & member's under this gym will  <br/>  not be able to access  this planner.</p></p>

                                <div className="row mt-2" style={{justifyContent: "flex-end"}}>
                                    <button  onClick={ActiveInactivePlanner} className="mt-1 mr-3 shadow-sm popup-button">
                                        <p className="pt-1" style={{color: "#000"}}>Yes</p>
                                    </button>
                                    <button onClick={handleClose} className="mt-1 shadow-sm popup-button">
                                        <p  className="pt-1" style={{color: "#000"}}>No</p>
                                    </button>
                                </div>
                        </div>
                    ]:[
                        <div style={{transition:'0.5s',overflowY:'hidden'}} className="exercise-body-container">
                             <div id="planner-info-container" className="popcontainer-wrapper">
                                <div className="popcontainer-sub-wrapper" style={{width:"95%", marginLeft:"2%",}}>
                                    <div style={{position:'relative'}} className="input-popup-space">
                                        <div onClick={()=>hanleDropDown("plannertype-list")} id="plannertype-wrapper" style={{width:'90%',cursor:'pointer'}} type="text" className="input-popup-flex input-popup">
                                            <div id="plannertype-txt" className="select-exercise-text">{plannerType==0?"Workout":"Fitness Test"}</div>
                                            <img id="plannertype-list-icon" src={ArrowDown} style={{transition:'0.3s',transform:'rotate(-180deg)'}} className="select-exercise-icon"/>
                                        </div>
                                        <div id="plannertype-list" className="select-exercise-list" style={{display:"none", height:'auto',position:'absolute', margin:"auto"}}>
                                            <div role="button" onClick={handleDropdownItem("plannertype",0)} className="exercise-list-container">
                                                <div className="exercise-list">Workout</div>
                                            </div>
                                            <div  role="button" onClick={handleDropdownItem("plannertype",1)} className="exercise-list-container">
                                                <div className="exercise-list">Fitness Test</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{position:'relative'}} className="input-popup-space">
                                    <div onClick={()=>hanleDropDown("level-list")} id="level-wrapper" style={{width:'90%', cursor:'pointer', marginLeft:"9%"}} type="text" className="input-popup-flex input-popup">
                                            <div id="level-txt" className="select-exercise-text">{level==""?"Level":level}</div>
                                            <img id="level-list-icon" src={ArrowDown} style={{transition:'0.3s',transform:'rotate(-180deg)'}} className="select-exercise-icon"/>
                                        </div>

                                        <div id="level-list" className="select-exercise-list" style={{display:"none",height:'7.5vw',position:'absolute'}}>
                                        {
                                            exerciseLevel.map((data,index)=>{
                                                return (
                                                    <div onClick={handleDropdownItem("level",data)}  role="button"   className="exercise-list-container">
                                                        <div className="exercise-list">
                                                        {index+1}. {data}
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                        </div>
                                        </div>
                                        </div>

<div className="input-popup-space">
    <input type="text" onChange={_.debounce(OnBlurFieldChecker("planner_name"),300)} id="planner_name" onInput={handleChange("planner_name")} value={planner_name}   style={{width:'100%'}}  className="input-popup" placeholder="Planner Name"/>  
</div>

<div style={{fontSize:"1.02vw",textAlign:'center',paddingInline:'10%'}}>The planner name shoud ne unique & level should be selected</div>
<div onClick={CreatePlanner} style={{marginBottom:'2%'}} className="register-button">
    <div>Create</div>
</div>
</div>
</div>
]
}
</div>

        </Dashboard>
    )
}

export default PlannerDashBoard;
