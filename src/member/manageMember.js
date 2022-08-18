import React,{useEffect,useState} from 'react';
import Dashboard from '../core/Dashboard';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Dialog from '@material-ui/core/Dialog';
import {getAllActiveMember,getAllInActiveMember,getAllMember,getMember,createMember,updateMember,activeInactiveMemberOperation,totalActiveMemberPage,totalInActiveMemberPage} from './helper/api'
import {getAllActiveBranch, getBranch} from '../branch/helper/api';
import Slide from '@material-ui/core/Slide';
import {API} from '../backend';
import { isAuthenticated } from '../auth';
import { getGym,getAllActiveGym } from '../gym/helper/api';
import { Menu, MenuItem } from '@material-ui/core';
import ArrowDown from '../assets/arrow-down.svg';
import Cross from "../assets/cross.svg";
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
import {useHistory} from 'react-router-dom'

//TODO::work on Member Create, Update and Delete.....

//styles
const useStyles = makeStyles((theme) => ({
    appBar: {
      position: 'relative',
      background:"#fff"
    },
    title: {
      marginLeft: theme.spacing(2),
      color:"#000",
      flex: 1,
    },
    
}));

//transition animation method
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


function useQuery() {
  return new URLSearchParams(useLocation().search);
}


export default function Member(props) {
const history=useHistory()
const query=useQuery();
const classes = useStyles();
const [openDialog,setopenDialog]=useState(false);//Dialog hooks
const [currentpage,setcurrentpage]=useState(1);//hooks for saving current member list page
const [page,setpage]=useState(1);//hooks for saving member page after fetched from the server page
const [total,settotal]=useState(0);//save total member
const [limit,setlimit]=useState(8);//get limited number of member document
const [Members,setMembers]=useState([]);//save members after fetched from the server
const [Member,setMember]=useState({ mfname:"",planner:"",mlname:"",memail:"",mphone:"",calender:"",memberId:"",active:false,formData:new FormData()});//save member info ( name,phone,email )
const { mfname,mlname,memail,mphone,calender,planner,memberId,active,mphoto,formData }=Member;//destrucuring member
const [Branch,setBranch]=useState({branchName:"",gymId:"",branchId:""});//storing branch after getting 
const {branchName,gymId,branchId}=Branch;//destructuring branch data
const [Gym,setGym]=useState({gymName:"",phone:"",email:""});//store gym basic info
const {gymName,phone,email}=Gym;//destructureing gym hooks
const [flag,setflag]=useState(0);
const [medicalReports,setMedicalReports]=useState([]);//saves medical reports
const [MediCalReport,setMedicalReport]=useState({
  reportName:"",
  reportLink:"",
  reportDes:""
});
const [memberRegistered,setmemberRegistered]=useState(false);
const {reportName,reportLink,reportDes}=MediCalReport;
const [isMedicalContion,setIsMedicalCondition]=useState(1);
const [dialogProperty,setdialogProperty]=useState({title:"Create Member",dialogfun:0});//dialog property controll hooks: 0- create 1- update member 2- select planner dashboard
const {title,dialogfun}=dialogProperty;//destructureing the dialogProperty hooks
const [firstValue,setfirstValue]=useState(true);//checks fisrt load or not
const [confirm,setconfirm]=useState(false);//action confirmation hooks
const [dashboardData,setdashboardData]=useState({dashfirstname:"",dashlastname:"",dashemail:"",dashphone:"",dashactive:true});
const {dashfirstname,dashlastname,dashemail,dashphone,dashactive}=dashboardData;
const [mapAction,setmapAction]=useState(0);
const [openFilterDialog, setOpenFilterDialog] = useState(null); // Filter Dialog Box;
const [Gyms,setGyms]=useState([]);
const [Branchs,setBranchs]=useState([]);


//handler functions
const handleChange=name=>event=>{
const value=name==="mphoto"?event.target.files[0]:event.target.value;
formData.set(name,value);
setMember({...Member,[name]:event.target.value});
};//handler function to controll from
const handleChangeMedicalReport=name=>event=>{
  setMedicalReport({...MediCalReport,[name]:event.target.value});
};
const AddMedicalReport=event=>{
  event.preventDefault();
  setMedicalReports([...medicalReports,{reportName,reportLink,reportDes}]);
} 
const RemoveMedicalReport=index=>event=>{
  event.preventDefault();
  setMedicalReports(oldmedicalreports=>{
      if(index>-1){
        oldmedicalreports.splice(index,1);
      }
      return ([...oldmedicalreports]);
  });
  event.stopPropagation();
}
const handleIsMedicalConditionChange=event=>{
  setIsMedicalCondition(event.target.value);
}
const handleOpenDialog=()=>{
  setopenDialog(true);
};//open dialog handler-open
const handleCloseDialog=event=>{
  event.preventDefault()
  setopenDialog(false);
  event.stopPropagation()
};//close dialog handler -close
const handleConfirmOpen=event=>{
  event.preventDefault();
  setconfirm(true);
}//controll confirm dialog -opening
const handleConfirmClose=()=>{
  setconfirm(false);
}//controll confirm dialog (used for block and other operation)-closing
const handleManageProfile=member=>event=>{
  event.preventDefault();
  alert("dashboard is getting ready")
  // setMember({...Member,mfname:member.mfname,mlname:member.mlname,mphone:member.mphone,memail:member.memail,calender:member.calender,planner:member.planner,memberId:member._id});
  // setdialogProperty({...dialogProperty,title:"Update Member",dialogfun:1});
  // setopenDialog(true);
};//update member dialog handlhelloer

const handleActiveaction=event=>{
  event.preventDefault();
  setMember({...Member,active:false});
  setmapAction(0);
  GetAllActiveMembers(currentpage,props.match.params.branchId);
  setOpenFilterDialog(null);
}
const handleInActiveaction=event=>{
  event.preventDefault();
  setMember({...Member,active:true});
  setmapAction(1);
  GetAllInActiveMembers(currentpage,props.match.params.branchId);
  setOpenFilterDialog(null)
}
const handleOpenFilterDialog = (e) => {
  setOpenFilterDialog(e.currentTarget);
}; // Open Active Inactive dialog box

const handleOpenActiveInactive=event=>{
  event.preventDefault()
  setopenDialog(true);
  setdialogProperty({
    ...dialogProperty,
    title:"Are you sure, you want to "+(mapAction==0?"inactive":"active")+" this member ?",
    dialogfun:2
  })
  event.stopPropagation();
}

  //API functions
const {user,token}=isAuthenticated();
const GetThisBranch=branchId=>{

        getBranch(user._id,token,branchId).then(data=>{
            if(data.error){
                throw data.error
            }else{
              GetThisGym(data.gymId);
              GetAllActiveMembers(currentpage,data._id);//fetching gym data
              setBranch({...Branch,branchName:data.branchName,gymId:data.gymId,branchId:data._id});
            }
        })
}
const GetThisGym=gymId=>{
      getGym(user._id,token,gymId).then(data=>{
        if(data.error){
          console.log('error in db');
        }else{
          setGym({...Gym,gymName:data.gymName,phone:data.phone,email:data.email});
        }
      })
}
const GetThisMember=()=>{
      getMember(user._id,token,memberId).then(data=>{
        if(data.error){
          throw data.error;
        }else{
          setMember({
          ...Member,
          mfname:data.mfname,
          mlname:data,mlname,
          mphone:data.mphone,
          memail:data.memail,
          planner:data.planner,
          calender:data.calender,
          memberId:data._id,
          active:data.active
          });
        }
      }).catch(err=>console.log(err))
};
const GetAllActiveMembers=(currentpage,branchId)=>{
      getAllActiveMember(user._id,token,branchId,currentpage,limit).then(data=>{
        if(data.error){
            console.log(data.error)
        }else{
            TotalActiveMemberPage();
            setMembers(data);
        }
      }).catch(err=>console.log(err));
};
const GetAllInActiveMembers=(currentpage,branchId)=>{
  getAllInActiveMember(user._id,token,branchId,currentpage,limit).then(data=>{
    if(data.error){
        console.log(data.error)
    }else{
        TotalInActiveMemberPage();
        setMembers(data);
    }
  }).catch(err=>console.log(err));
};
const TotalActiveMemberPage=()=>{
      totalActiveMemberPage(user._id,token,props.match.params.branchId,limit).then(data=>{
         if(data.error){
           console.log(`error in db`)
         }else{
          setpage(data.page);
          settotal(data.total);   
         }     
      }).catch(err=>console.log(err));
};
const TotalInActiveMemberPage=()=>{
  totalInActiveMemberPage(user._id,token,props.match.params.branchId,limit).then(data=>{
    if(data.error){
      console.log(`error in db`)
    }else{
     setpage(data.page);
     settotal(data.total);   
    }     
 }).catch(err=>console.log(err));
}
const ActiveInActiveOperation=memberId=>event=>{
      event.preventDefault();
     
      formData.set('active',active)
      updateMember(user._id,token,memberId,formData).then(async data=>{
        if(data.error){
           console.log('something went wrong please try again')
        }else{
         setdashboardData({...dashboardData,dashactive:data.active});
         let active=mapAction==0?true:false;
          if(user.role==0){
            let members=await GetAllMember(active);
            setMembers(members);
            setopenDialog(false);
          }
        }
      }).catch(err=>{
        console.log('something went wrong please try again')
      })
    
};
const CreateMember=event=>{
      event.preventDefault();

      // formData.set("medicalReports",JSON.stringify(medicalReports));
      // alert(branchId)
      createMember(user._id,token,branchId,formData).then(async data=>{
        if(data.error){
          console.log(data.error)
        }else{
          setMember({...Member,mfname:"",mlname:"",mphone:"",memail:"",active:true});
          let active=mapAction==0?true:false;
        
          if(user.role==0){
            try{
              let members=await GetAllMember(active);
              await setMembers(members)
              setopenDialog(false);
            }catch(err){
              console.log("error fetching data")
            }
          }
          //GetAllActiveMembers(currentpage,props.match.params.branchId);
         
        }
      })
};
const UpdateThisMember=event=>{
      event.preventDefault();
      formData.set("medicalReports",JSON.stringify(medicalReports));
      updateMember(user._id,token,memberId,formData).then(data=>{
        if(data.error){
          console.log(data.error)
        }else{
          setMember({...Member,mfname:"",mlname:"",phone:"",memail:"",active:true});
          setdashboardData({...dashboardData,dashfirstname:data.mfname,dashlastname:data.mlname,dashemail:data.memail,dashphone:data.mphone,dashactive:data.active});
          //GetAllActiveMembers(currentpage,props.match.params.branchId);
          setopenDialog(false);
        }
      })
};


 //gym and branch pagination function
const prev=event=>{
      event.preventDefault();
      if(currentpage<=page&&currentpage!=1){
        GetAllActiveMembers(currentpage-1,props.match.params.branchId);
        setcurrentpage(currentpage-1);
      }
};
const next=event=>{
      event.preventDefault();
      if(currentpage<page){
         GetAllActiveMembers(currentpage+1,props.match.params.branchId);	
         setcurrentpage(currentpage+1);
      }
};
   



const openAddMemberForm=event=>{
  event.preventDefault();
  setdialogProperty({
    ...dialogProperty,
    title:"Add Member",
    dialogfun:0
   });
   setIsMedicalCondition(1);
   setMember({...Member,mfname:"",mlname:"",mphone:"",memail:"",active:true});
   setopenDialog(true);
}
const vlidateField=(name,value)=>{
  if(name=="memail"){
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(value).toLowerCase());
  }
  if(name=="mphone"){
      return  value.length&&value.match(/\d/g).length==10;
  }
  if(name=="mfname"){
      return value.length>1&&value.length<=30
  }
  if(name=="mlname"){
      return value.length>1&&value.length<=30
  }
  
};
const OnBlurFieldChecker=name=>()=>{
  // let checker=vlidateField(name,Member[name]);
  //  if(checker){
  //     document.getElementById(name).style.border="1px dashed green";
  //  }else{
  //     document.getElementById(name).style.border="1px dashed red";
  //  }
};
const onSelectMember=member=>event=>{
  event.preventDefault();
  setMember({...Member,mfname:member.mfname,calender:member.calender,planner:member.planner,mlname:member.mlname,memail:member.memail,mphone:member.mphone,memberId:member._id})
  setdashboardData({...dashboardData,dashfirstname:member.mfname,dashlastname:member.mlname,dashemail:member.memail,dashphone:member.mphone,dashactive:member.active});
  setflag(3);
};

const toggleMemberAction = (branchId) => () => {
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
    if(document.getElementById("action-" + branchId)) document.getElementById("action-" + branchId).style.display = "none";
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


const togleStateList = () => {
if(document.getElementById("state-list").style.display == "none"){
  document.getElementById("state-list").style.display = "block";
  document.getElementById("select-state-icon").style.transform = "rotate(-180deg)"
}else{
  document.getElementById("state-list").style.display = "none";
  document.getElementById("select-state-icon").style.transform = "rotate(0deg)"
}
}

const toggleCityLst = () => {
if(document.getElementById("city-list").style.display == "none"){
  document.getElementById("city-list").style.display = "block";
  document.getElementById("select-city-icon").style.transform = "rotate(-180deg)"
}else{
  document.getElementById("city-list").style.display = "none";
  document.getElementById("select-city-icon").style.transform = "rotate(0deg)"
}
}


const toggleLocationLst = () => {
if(document.getElementById("location-list").style.display == "none"){
  document.getElementById("location-list").style.display = "block";
  document.getElementById("select-location-icon").style.transform = "rotate(-180deg)"
}else{
  document.getElementById("location-list").style.display = "none";
  document.getElementById("select-location-icon").style.transform = "rotate(0deg)"
}
}
let  closeAllPopup_2;
const toggleGlobalActionContainer = e => {
  closeAllPopup_2=()=>{
   
     document.getElementById("global-action-container").style.display = "none";
     window.removeEventListener("click", closeAllPopup_2);

  }

  if(document.getElementById("global-action-container").style.display == "none"){
    document.getElementById("global-action-container").style.display = "block";

    setTimeout(() => {
      window.addEventListener("click", closeAllPopup_2);
    }, 10);

  }else{
    document.getElementById("global-action-container").style.display = "none"
  }

  e.stopPropagation()

}

const handleActiveInactiveMemberList=async event=>{
  event.preventDefault();
  if(mapAction==0){
    setmapAction(1);
    if(user.role==0){
      let data=await GetAllMember(false);
      setMember({...Member,active:true});
      setMembers(data);
    }
  }else{
    setmapAction(0);
    if(user.role==0){
      let data=await GetAllMember(true);
      setMember({...Member,active:false})
      setMembers(data)
    }
  }
 
}

// const handleOpenBranchSelectPopup=event=>{
//   event.preventDefault()
//   setdialogProperty({
//     ...dialogProperty,
//     title:"Select Branch",
//     dialogfun:2
//   });
//   setopenDialog(true);  
// }

// const selectBranch=(branchId,branchName,)=>event=>{
//   event.preventDefault();

//   setBranch({...Branch,branchName:branchName,branchId:branchId});
//   GetAllActiveMembers(currentpage,branchId);//fetching branch data
//   setopenDialog(false);
// }


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
      case "BranchUser":
        window.removeEventListener('click',closeAllPopup_2);
        history.push({
             pathname:`/branch/admin/users`,
             state:{
                 branchId:"",
                 action:"create"
             }
        })
     break;
      default:
        
          alert("hi")
      break;
  }
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
}//handle dropdown


const handleDropdownItem=(name,value)=>event=>{
  event.preventDefault();
  if(name=="gym"){
      setGym({
        ...Gym,
        gymName:value.gymName
      });
      setBranch({
        ...Branch,
        gymId:value._id
      })
      GetAllActiveBranchs(value._id)
  }
  if(name=="branch"){
      setBranch({...Branch,
        branchId:value._id,
        branchName:value.branchName
      });
  }
  
  document.getElementById(name+"-list").style.display="none";
  document.getElementById(name+"-list-icon").style.transform='rotate(-180deg)';

}


const GetActiveGyms=()=>{
  return getAllActiveGym(user._id,token,currentpage,limit).then(data=>{
    if(data.error){
      return false;
    }else{
      return data;   
    }
  }).catch(err=>{
      return false;
  }); 
}

const GetAllActiveBranchs=gymId=>{
  getAllActiveBranch(user._id,token,gymId,currentpage,limit).then(data=>{
    if(data.error){
      console.log(data.error)
    }else{
      setBranchs(data);
    }
  }).catch(err=>console.log(err))
}

const GetAllMember=active=>{
  return getAllMember(user._id,token,{active}).then(data=>{
    if(data.error){
      return false;
    }else{
      return data;
    }
  }).catch(()=>{return false;})
}

useEffect(async()=>{
  if(props.location.state&&props.location.state.action=="create")  setopenDialog(true);
  console.log(props.location.state)
  if(props.location.state&&props.location.state.branchId!=""){
    setBranch({...Branch,branchId:props.location.state.branchId});
    GetThisBranch(props.location.state.branchId);
  }
  if(user.role==0){
    let gyms=await GetActiveGyms();
    setGyms(gyms)
    let members=await GetAllMember(true)
    setMembers(members)
    
  }
  

},[]);

    return(
        <Dashboard itemId={memberId} data={{
          branchId,
          gymId,
          memberId,
          mfname:dashfirstname,
          planner,
          mlname:dashlastname,
          mphone:dashphone,
          memail:dashemail,
          active:dashactive,
          calender,
          formrole:0
        }} navItemData={"Member"} flag={flag}>

             


                <div className="header-bar">
                                          <div>
                                              <div className="dashboard-name-container">
                                                  <div className="dashboard-name">Member Account's</div>
                                              
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
                                                  <div role="button" onClick={openAddMemberForm} className="action-item d-flex">
                                                      <span class="material-icons-round flex-item">person_add_alt</span>
                                                      <div className="flex-item spacing-19">Add Member</div>
                                                  </div>
                                                  <div className="action-item d-flex">
                                                      <span class="material-icons-round flex-item">playlist_add</span>
                                                      <div className="flex-item spacing-19">Add Member Report</div>
                                                  </div>
                                                  <div role="button" onClick={NavigateToRoute("BranchUser")} className="action-item d-flex">
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
                                              <div onClick={handleActiveInactiveMemberList} className="active-inactive-container">
                                                  <img src={SwapIcon} className="active-inactive-icon"/>
                                                  <div id="switch-gym" className="active-inactive-text">{mapAction==0?`Active`:`InActive`}</div>
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
                                                      <span className="g-font-1 inactive">State</span>
                                                      <div
                                                      onClick={togleStateList}
                                                      type="text"
                                                      className="d-flex select-dropdown"
                                                      >
                                                      <div className="select-exercise-text">Select State</div>
                                                      <img
                                                          id="select-state-icon"
                                                          src={ArrowUp}
                                                          className="select-exercise-icon"
                                                      />
                                                      </div>
                                                      <div id="state-list" className="dropdown-menu-items" style={{display: "none"}}>
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
                                                      <span className="g-font-1 inactive">City</span>
                                                      <div onClick={toggleCityLst}
                                                      id="select-Exercise"
                                                      type="text"
                                                      className="d-flex select-dropdown"
                                                      >
                                                      <div className="select-exercise-text">Select City</div>
                                                      <img
                                                          id="select-city-icon"
                                                          src={ArrowUp}
                                                          className="select-exercise-icon"
                                                      />
                                                      </div>
                                                      <div id="city-list" className="dropdown-menu-items" style={{display: "none"}}>
                                                          <div className="menu-text-spacing">Andhra Pradesh</div>
                                                      <div className="menu-text-spacing">Aurnachal Pradesh</div>
                                                      </div>
                                                  </div>
                                                    <div className="container-spacing">
                                                      <span className="g-font-1 inactive">Location</span>
                                                      <div onClick={toggleLocationLst}
                                                      id="select-Exercise"
                                                      type="text"
                                                      className="d-flex select-dropdown"
                                                      >
                                                      <div className="select-exercise-text">Select Location</div>
                                                      <img
                                                          id="select-location-icon"
                                                          src={ArrowUp}
                                                          className="select-exercise-icon"
                                                      />
                                                      </div>
                                                      <div id="location-list" className="dropdown-menu-items" style={{display: "none"}}>
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


                {/* Get All Member List*/}
                <table  className="body-container">
                      <thead>
                        <tr>
                          <th style={{textAlign:"left", padding :"0 0 0 4.7%", width: "20%"}}>Member Name</th>
                          <th>City</th>
                          <th>Location</th>
                          <th>Contact Email</th>
                          <th>Contact No.</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Members.map((member) => {
                          return (
                            <tr onClick={onSelectMember(member)}   style={{ backgroundColor:memberId == member._id?"rgb(0, 0, 0, 0.08)":"#ffffff", boxShadow:memberId == member._id?"none":"0px 0.01px 3px 3px rgb(0, 0, 0, 0.05)"}}>
                              <td style={{textAlign:"left", padding :"0 0 0 1.4%", width: "20%", fontWeight : "bold"}}>
                                <div className="d-flex">
                                  <span class="material-icons-round action-icon" style={{ color:memberId == member._id?"#0077ff":"#cacaca"}}>check_circle</span>
                                  <div style={{padding :"2% 0 0 2%"}}>{member.mfname} {member.mlname}</div>
                                </div>
                              </td>
                              <td style={{fontFamily:"sans-serif"}}>{member.mcity?member.mcity:"---"}</td>
                              <td>{member.mlocation?member.mlocation:"---"}</td>
                              <td>{member.memail}</td>
                              <td style={{fontFamily:"sans-serif"}}>{member.mphone}</td>
                              <td>
                                <div className="d-flex" style={{padding :"0 0 0 12%"}}>
                                  <span class={`material-icons-round action-icon ${member.active?`active`:`inactive`}`}>circle</span>
                                  <div style={{padding :"2.2% 0 0 2%"}} className={member.active?`active`:`inactive`}>{member.active?`Active`:`Inactive`}</div>
                                </div>
                              </td>
                              <td>
                                <span onClick={toggleMemberAction(member._id)} class="material-icons-outlined edit-icon">more_horiz</span>
                                <div id={"action-" + member._id} className="table-action-container" style={{display:"none"}}>
                                  <div role="button" onClick={()=> history.push(`/member/profile/${member._id}`)} className="d-flex spacing-22">
                                    <img src={UpdateIcon} className="body-content-two-action-icon" />
                                    <div className="spacing-24">Edit Profile</div>
                                  </div>
                                  
                                  <div style={{margin:"2% 0", width:"100%", height:"1px",zIndex:1, backgroundColor:"#f5f5f5"}}></div>
                                  <div role="button" onClick={handleOpenActiveInactive} className="d-flex spacing-22">
                                    <img src={BlockIcon} className="body-content-two-action-icon" />
                                    <div className="spacing-24">{member.active?`Block`:`Unblock`}</div>
                                  </div>

                                </div>
                              </td>
                            </tr>
                          );
                        })}

                      </tbody>
                    </table>

                

                {/* popup section code */}    
                <div  className={`content-add-section content-add-section-rs-size`} style={{display:openDialog?"block":"none"}}>
                   {
                     memberRegistered?(null):(
                      <div className="exerise-header-bar">
                      <div style={{display:"flex", alignSelf:"center"}} >
                        
                            <div className="exercise-header-text" style={{marginRight:"6%", alignSelf:"center", whiteSpace:"nowrap"}}>{title}</div>
                            <div>
                              <div></div>
                            </div>
            
                      </div>
                      
                      <img  src={Cross} role="button" onClick={handleCloseDialog} className="exercise-header-close"/>
                  </div>
                     )
                   }
                    

                    {
                        dialogfun==2?[
               
                            <div className="ml-5 mt-4 mr-5 mb-4">
                                <p className="pt-2" style={{fontWeight: "bold"}}>Important Note:
                                    <p style={{fontWeight:"lighter", color:"#757575"}}>Member's will not be able to access their profile and functions.</p></p>
                                
                                    <div className="row mt-2" style={{justifyContent: "flex-end"}}>
                                        <button onClick={ActiveInActiveOperation(memberId)} className="mt-1 mr-3 shadow-sm popup-button">
                                            <p className="pt-1" style={{color: "#000"}}>Yes</p>
                                        </button>
                                        <button onClick={handleCloseDialog} className="mt-1 shadow-sm popup-button">
                                            <p  className="pt-1" style={{color: "#000"}}>No</p>
                                        </button>
                                    </div>
                            </div>
                        ]:[

                            <div style={{transition:'0.5s',overflowY:'hidden'}} className="exercise-body-container">

                            


                            <div id="member-info-container" className="popcontainer-wrapper">
                            
                              
                               {
                                 memberRegistered?(
                                  <div className="verify-message">
                                    <div>Thanks!</div>
                                
                                    <div>An email have sent to verify</div>

                                    <div style={{marginTop:"5%"}} className="register-button">
                                      <div>Done</div>
                                    </div>

                                  </div>
                                 ):[

                                <div className="popcontainer-sub-wrapper">
                                
                                <div style={{marginRight:5,zIndex:1,position:'relative'}} className="input-popup-space">

                                    

                                    <div onClick={()=>hanleDropDown("gym-list")} id="state-wrapper" style={{width:'100%',cursor:'pointer'}} type="text" className="input-popup-flex input-popup">
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

                                <div style={{position:'relative'}} className="input-popup-space" >
                                        <div onClick={()=>hanleDropDown("branch-list")} id="branch-Exercise" style={{width:'100%',cursor:'pointer'}} type="text" className="input-popup-flex input-popup">
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
                            
                            ,
                                      
                                <div className="popcontainer-sub-wrapper">
                                <input type="text" onChange={_.debounce(OnBlurFieldChecker("mfname"),300)} id="mfname"  onInput={handleChange("mfname")} value={mfname} style={{marginRight:5}} className="input-popup input-popup-space" placeholder="Firstname"/>
                                <input onChange={_.debounce(OnBlurFieldChecker("mlname"),300)} id="mlname" onInput={handleChange("mlname")} value={mlname}  className="input-popup input-popup-space" placeholder="Lastname" />
                                </div>,
                                <div className="popcontainer-sub-wrapper">
                                    <input type="number" onChange={_.debounce(OnBlurFieldChecker("mphone"),300)} id="mphone"  onInput={handleChange("mphone")} value={mphone} style={{marginRight:5}} className="input-popup input-popup-space" placeholder="Phone"/>
                                    <input onChange={_.debounce(OnBlurFieldChecker("memail"),300)} id="memail" onInput={handleChange("memail")} value={memail}  className="input-popup input-popup-space" placeholder="Email" />
                                </div>,
                                <div className="terms-condition-class w-100">   
                                  <input id="terms-condition" type="checkbox"/>
                                  <div> Kindly accept the <a href="#">terms and conditions</a></div>  
                                </div>
                                ,
                                <div onClick={CreateMember} className="register-button">
                                  <div>Register</div>
                                </div>
                                 ]
                               }

                               
                        
                            


                            </div>
                                


                            
                        </div>
                  
                    
                        ]
                    }


                </div>


                
        </Dashboard>
    )
}
