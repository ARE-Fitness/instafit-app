import React,{useEffect,useState} from 'react';
import Dashboard from '../core/Dashboard';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Dialog from '@material-ui/core/Dialog';
import {getAllActiveGym,getGym,totalActiveGym} from '../gym/helper/api';
import {getAllActiveBranch,createBranch,getAllBranch,updateBranch,activeInactiveBranchOperation,totalActiveBranchPage, getBranch, getAllInActiveBranch, totalInActiveBranchPage, chcekBranchStaus} from './helper/api'
import Slide from '@material-ui/core/Slide';
import {API} from '../backend';
import { isAuthenticated } from '../auth';
import { Menu, MenuItem } from '@material-ui/core';
import Cross from "../assets/cross.svg";
import ArrowDown from '../assets/arrow-down.svg';
import _ from 'lodash'; 
import SwapIcon from "../assets/swap.svg";
import FilterIcon from "../assets/filter.svg";
import ArrowLeft from "../assets/arrow-left.svg";
import ArrowRight from "../assets/arrow-right.svg";
import BlockIcon from "../assets/block.svg";
import UpdateIcon from "../assets/edit.svg";
import DownloadIcon from "../assets/download.svg";
import ArrowUp from "../assets/arrow-sign.svg";
import { useHistory } from 'react-router-dom';


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


export default function Branch(props) {
    const history=useHistory();
    const classes = useStyles();
    const [openDialog,setopenDialog]=useState(false);//Dialog hooks
    const [gymcurrentpage,setgymcurrentpage]=useState(1);//hooks for saving gym current page
    const [branchcurrentpage,setbranchcurrentpage]=useState(1);//hooks for saving branch current page
    const [gympage,setgympage]=useState(1);//save total gym page fetched from server
    const [branchpage,setbranchpage]=useState(1);//save total branch page fetched from server
    const [branchtotal,setbranchtotal]=useState(0);//save total branch unser this gym
    const [gymtotal,setgymtotal]=useState(0);//save total gym
    const [gymlimit,setgymlimit]=useState(5);//get limited number of gym document
    const [branchlimit,setbranchlimit]=useState(8)//get limited number of branch document
    const [Gyms,setGyms]=useState([]);//save gyms after fetched from the server
    const [Gym,setGym]=useState({ gymName:"",email:"",phone:"",gymId:"" });//save gym info ( name,phone,email )
    const { gymName,email,phone,gymId }=Gym;//destrucuring gym
    const [dialogProperty,setdialogProperty]=useState({title:"Create Branch",dialogfun:0});//dialog property controll hooks: 0- create branch 1- update branch 2-show gym list 
    const {title,dialogfun}=dialogProperty;//destructureing the dialogProperty hooks
    const [Branchs,setBranchs]=useState([]);//save branch list after fetched from the server
    const [Branch,setBranch]=useState({branchName:"",branchemail:"",branchphone:"",optional_branchemail:"",optional_branchphone:"",totaladminusers:0,totalmembers:0,state:"",location:"",city:"",pincode:"",address:"",active:true,branchId:"",branchmanagerFistname:"",branchmanagerLastname:"",branchmanagerEmail:"",branchmanangerPhone:"",branchmanagerActive:false,error:"",success:""});//save branch info
    const {branchName,branchemail,branchphone,optional_branchemail,optional_branchphone,state,location,totaladminusers,totalmembers,address,city,pincode,active,branchId,branchmanagerFistname,branchmanagerLastname,branchmanagerEmail,branchmanangerPhone,branchmanagerActive}=Branch;//destructuring the branch info 
    const [dashboardData,setdashboardData]=useState({ dashbranchId:"",dashactive:true, dashbranchName:"", dashgymId:"",  dashgymName:"",dashemail:"",dashphone:"",dashbranchemail:"",dashbranchphone:"",dashoptional_branchemail:"",dashoptional_branchphone:""});
    const {dashbranchId,dashactive,dashemail,dashbranchName,dashgymId,dashgymName,dashphone,dashbranchemail,dashbranchphone,dashoptional_branchemail,dashoptional_branchphone}=dashboardData; //used for sending data to gym dashboard
    const [firstValue,setfirstValue]=useState(true);//checks fisrt load or not
    const [confirm,setconfirm]=useState(false);
    const [openFilterDialog, setOpenFilterDialog] = useState(null); // Filter Dialog Box;
    const [flag,setflag]=useState(0);
    const [mapAction,setmapAction]=useState(0);//active or inactive track
    const [statelist,setstatelist]=useState([
      "Amaravati","Itanagar","Itanagar","Patna","Tripura","West Bengal","Maharastra"
    ]);
    const [citylist,setcitylist]=useState([
      "Pune","Mumbai","Aurangabad"
    ]);
    

    //handler functions
    const handleChange=name=>event=>{
      setBranch({...Branch,[name]:event.target.value});
    };//handler function to controll from
    const handleOpenDialog=()=>{
      setopenDialog(true);
    };//open dialog handler
    const handleCloseDialog=()=>{
      setopenDialog(false);
    };//close dialog handler
    const handleConfirmOpen=(branchName,branchId)=>event=>{
      event.preventDefault();
      setBranch({...Branch,branchName:branchName,branchId:branchId,active:mapAction==0?false:true});
      setdialogProperty({...dialogProperty,title:`Do you really want to ${mapAction==0?`inactive`:`active`} this Branch ?`,dialogfun:3});
      setopenDialog(true);
      event.stopPropagation();
    }//controll confirm dialog


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
        gymId:value._id,
        gymName:value.gymName
      })
    }else{
      setBranch({...Branch,[name]:value});
    }
    
    document.getElementById(name+"-list").style.display="none";
    document.getElementById(name+"-list-icon").style.transform='rotate(-180deg)';

}
    const handleBranchUpdate=branch=>event=>{
      event.preventDefault();
      console.log(branch.area)
      setBranch({...Branch,
       branchName:branch.branchName,
       branchId:branch._id,
       active:branch.active,
       branchemail:branch.branchemail,
       branchphone:branch.branchphone,
       optional_branchemail:branch.optional_branchemail,
       optional_branchphone:branch.optional_branchphone,
       state:branch.state,
       city:branch.city,
       location:branch.location,
       address:branch.address,
       pincode:branch.pincode,
       branchmanagerActive:branch.branchmanager.active,
       branchmanagerFistname:branch.branchmanager.firstname,
       branchmanagerLastname:branch.branchmanager.lastname,
       branchmanagerEmail:branch.branchmanager.email,
       branchmanangerPhone:branch.branchmanager.phone
      });
      setGym({
        ...Gym,
        gymName:branch.gymName,
        gymId:branch._id
      })
      setdialogProperty({...dialogProperty,title:"Update Branch",dialogfun:1});
      [
        "branchName",
        "state",
        "pincode",
        "location",
        "city",
        "address",
        "branchmanagerFistname",
        "branchmanagerLastname",
        "branchmanagerEmail",
        "branchmanangerPhone",
       ].forEach(id=>{
         if(document.getElementById(id)) document.getElementById(id).style.borderColor="#e2e2e2";
       })
      setopenDialog(true);
      event.stopPropagation();
    };//update branch dialog handlhelloer


    const handleActiveInactiveBranchList=async event=>{
      event.preventDefault();
      if(mapAction==0){
        setmapAction(1);
        if(user.role==0){
          let data=await GetAllBranch(false);
          setBranchs(data)
        }
        //GetAllInactiveBranch(branchcurrentpage,gymId);
      }else{
        setmapAction(0);
        if(user.role==0){
          let data=await GetAllBranch(true);
          setBranchs(data)
        }
        //GetAllActiveBranch(branchcurrentpage,gymId);
      }
    }


    //API functions
    const {user,token}=isAuthenticated();
    const GetThisgym=()=>{
      getGym(user._id,token).then(data=>{
        if(data.error){
          throw data.error;
        }else{
          setGym({...Gym,
          gymName:data.gymName,
          email:data.email,
          phone:data.phone
          });
        }
      }).catch(err=>console.log(err))
    };
    const GetAllActiveGyms=(currentpage)=>{
      getAllActiveGym(user._id,token,currentpage,gymlimit).then(data=>{
        if(data.error){
           console.log(data.error)
        }else{
            setGyms(data)
            TotalActiveGymPage();
        }
      }).catch(err=>console.log(err));
    };
    const TotalActiveGymPage=()=>{
      totalActiveGym(user._id,token,gymlimit).then(data=>{
         if(data.error){
           console.log(`error in db`)
         }else{
          setgympage(data.page)
          setgymtotal(data.total);   
         }     
      }).catch(err=>console.log(err));
    };
    const TotalInActiveBranchPage=gymId=>{
      totalInActiveBranchPage(user._id,token,gymId,branchlimit).then(data=>{
        if(data.error){
          console.log(`error in db`)
        }else{
          setbranchtotal(data.total);
          setbranchpage(data.page);  
        }     
     }).catch(err=>console.log(err));
    }
    const TotalActiveBranchPage=gymId=>{
      totalActiveBranchPage(user._id,token,gymId,branchlimit).then(data=>{
         if(data.error){
           console.log(data.error);
         }else{
          setbranchtotal(data.total);
          setbranchpage(data.page);  
         }
      });
    };
    const GetThisBranch=()=>{
      getBranch(user._id,token,branchId).then(data=>{
         if(data.error){
         console.log(data.error)
         }else{
          setBranch({...Branch,branchName:data.branchName,active:data.active,totalmembers:data.memberList.length,totaladminusers:data.branchAdminList.length});
         }
      }).catch(err=>console.log(err))
    };
    const GetAllActiveBranch=(currentpage,gymId)=>{
      getAllActiveBranch(user._id,token,gymId,currentpage,branchlimit).then(data=>{
        if(data.error){
          console.log(data.error)
        }else{
          setBranchs(data);
          TotalActiveBranchPage(gymId);
        }
      }).catch(err=>console.log(err))
    };
    const GetAllInactiveBranch=(currentpage,gymId)=>{
      getAllInActiveBranch(user._id,token,gymId,currentpage,branchlimit).then(data=>{
        if(data.error){
          console.log(data.error)
        }else{
          setBranchs(data);
          TotalInActiveBranchPage(gymId);
        }
      }).catch(err=>console.log(err))
    }
    const ActiveInActiveOperation=branchId=>event=>{
      event.preventDefault();
      updateBranch(user._id,token,branchId,{active}).then(async data=>{
        if(data.error){
          console.log('something went wrong please try again')
        }else{
          if(user.role==0){
            let active=mapAction==0?true:false;
            let data=await GetAllBranch(active);
            setBranchs(data)
          }
          setdashboardData({...dashboardData,dashactive:data.active})
          setopenDialog(false);

      //     mapAction==0?GetAllActiveBranch(branchcurrentpage,gymId):GetAllInactiveBranch(branchcurrentpage,gymId);;

        }
      }).catch(err=>console.log('something went wromng please try again'))

    };
    const CreateBranch=event=>{
      event.preventDefault();
      let branchmanager={
        firstname:branchmanagerFistname,
        lastname:branchmanagerLastname,
        email:branchmanagerEmail,
        phone:branchmanangerPhone,
        active:branchmanagerActive
      };
      createBranch(user._id,token,gymId,{branchName,branchemail,branchphone,optional_branchemail,optional_branchphone,pincode,state,location,city,address,active,branchmanager}).then(async data=>{
        if(data.error){
          console.log(data.error)
        }else{
          setBranch({...Branch,branchName:""});
          let active=mapAction==0?true:false;
          if(user.role==0){
            let data=await GetAllBranch(active);
            setBranchs(data)
          }
          // GetAllActiveBranch(branchcurrentpage,gymId);//fetching branch data
          setopenDialog(false);
        }
      }).catch(err=>console.log(err))
    };
    const UpdateThisBranch=event=>{
      event.preventDefault();
      let branchmanager={
        firstname:branchmanagerFistname,
        lastname:branchmanagerLastname,
        email:branchmanagerEmail,
        phone:branchmanangerPhone,
        active:branchmanagerActive
      };
      updateBranch(user._id,token,branchId,{branchName,branchemail,branchphone,optional_branchemail,optional_branchphone,state,pincode,location,city,address,active:mapAction==0?true:false,branchmanager}).then(async data=>{
        if(data.error){
          console.log(data.error)
        }else{
          setBranch({...Branch,branchName:"",active:true});
          setdashboardData({
            ...dashboardData,
            dashphone:phone,
            dashbranchemail:data.branchemail,
            dashbranchphone:data.branchphone,
            dashoptional_branchemail:data.optional_branchemail,
            dashoptional_branchphone:data.optional_branchphone,
            dashbranchId:data._id,
            dashgymName:gymName,
            dashemail:email,
            dashgymId:gymId,
            dashactive:data.active,
            dashbranchName:data.branchName
          });
          if(user.role==0){
            try{
              let active=mapAction==0?true:false;
              let branchs=await GetAllBranch(active);
              setBranchs(branchs);
            }catch(err){
              console.log("err getting data")
            }
          }
        //   mapAction==0?GetAllActiveBranch(branchcurrentpage,gymId):GetAllInactiveBranch(branchcurrentpage,gymId);//fetching branch data
          setopenDialog(false);
        }
      }).catch(err=>console.log(err))
    };


    //gym selection
    const selectGym=(gymId,gymName,email,phone)=>event=>{
      event.preventDefault();
      setGym({...Gym,gymName:gymName,gymId:gymId,phone:phone,email:email});
      GetAllActiveBranch(branchcurrentpage,gymId);//fetching branch data
      setopenDialog(false);
    }




    //gym and branch pagination function
    const gymprev=event=>{
      event.preventDefault();
      if(gymcurrentpage<=gympage&&gymcurrentpage!=1){
        GetAllActiveGyms(gymcurrentpage-1);
        setgymcurrentpage(gymcurrentpage=>gymcurrentpage-1);
      }
    };
    const gymnext=event=>{
      event.preventDefault();
      if(gymcurrentpage<gympage){
         GetAllActiveGyms(gymcurrentpage+1);	
         setgymcurrentpage(gymcurrentpage=>gymcurrentpage+1);
      }
    };
    const branchprev=event=>{
      event.preventDefault();
      if(branchcurrentpage<=branchpage&&branchcurrentpage!=1){
        mapAction==0?GetAllActiveBranch(branchcurrentpage-1,gymId):GetAllInactiveBranch(branchcurrentpage-1,gymId);
        setbranchcurrentpage(branchcurrentpage-1);
      }
    };
    const branchnext=event=>{
      event.preventDefault();
      if(branchcurrentpage<branchpage){
         mapAction==0?GetAllActiveBranch(branchcurrentpage+1,gymId):GetAllInactiveBranch(branchcurrentpage+1,gymId);	
         setbranchcurrentpage(branchcurrentpage+1);
      }
    };

    const vlidateField=(name,value)=>{
      if(name=="branchmanagerEmail"){
          const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return re.test(String(value).toLowerCase());
      }
      if(name=="branchmanangerPhone"){
          return  value.length&&value.match(/\d/g).length==10;
      }
      if(name=="branchName"){
          return value.length>1&&value.length<=30
      }
      if(name=="address"){
          return value.length>1&&value.length<=140;
      }
      if(name=="location"){
          return value.length>1&&value.length<=100;
      }
      if(name=="pincode"){
        return  value.length&&value.match(/\d/g).length==6;
    }
   
      if(name=="city"){
          return value.length>1&&value.length<=30
      }
      if(name=="branchmanagerFistname"){
          return value.length>1&&value.length<=30
      }
      if(name=="branchmanagerLastname"){
          return value.length>1&&value.length<=30
      }
      
  }
   
  const OnBlurFieldChecker=name=>()=>{
    // let checker=vlidateField(name,Branch[name]);
    // chcekBranchStaus(user._id,token,gymId,{field:name,value:Branch[name]}).then(data=>{
    //     if(data.error){
    //         console.log(data.error);
    //     }else{
    //         if(data.found){
    //             document.getElementById(name).style.borderColor="#EF5354";
    //         }else{
    //             if(checker){
    //                 document.getElementById(name).style.borderColor="#02B290";
    //              }else{
    //                 document.getElementById(name).style.borderColor="#EF5354";
    //              }
    //         }
    //         console.log(data)
    //     }
    // });
     
  }

 
  
  const SelectGym=event=>{
    event.preventDefault()
    setdialogProperty({
      ...dialogProperty,
      title:"Select Gym",
      dialogfun:2
     });
     console.log(Gyms)
     setopenDialog(true);  
  }

  const openAddBranchForm=event=>{
    event.preventDefault();
    setdialogProperty({
      ...dialogProperty,
      title:" Branch  Registration ",
      dialogfun:0
     });
     setBranch({
       ...Branch,
       branchName:"",
       state:"State",
       pincode:"",
       branchemail:"",
       branchphone:"",
       optional_branchemail:"",
       optional_branchphone:"",
       location:"Location",
       city:"City",
       address:"",
       active:true,
       branchmanagerFistname:"",
       branchmanagerLastname:"",
       branchmanagerEmail:"",
       branchmanangerPhone:"",
       branchmanagerActive:true,
     });
     [
      "branchName",
      "state",
      "pincode",
      "location",
      "city",
      "address",
      "branchmanagerFistname",
      "branchmanagerLastname",
      "branchmanagerEmail",
      "branchmanangerPhone",
     ].forEach(id=>{
       if(document.getElementById(id)) document.getElementById(id).style.borderColor="#e2e2e2";
     })
     setopenDialog(true);
  }

  const onBranchSelect=branch=>event=>{
    event.preventDefault();
    setflag(2); 
    setBranch({...Branch,branchId:branch._id,branchName:branch.branchName, totalmembers:branch.memberList.length,totaladminusers:branch.branchAdminList.length});
    setdashboardData({
      ...dashboardData,
      dashphone:phone,
      dashbranchemail:branch.branchemail,
      dashbranchphone:branch.branchphone,
      dashoptional_branchemail:branch.optional_branchemail,
      dashoptional_branchphone:branch.optional_branchphone,
      dashactive:branch.active,
      dashbranchId:branch._id,
      dashgymName:branch.gymName,
      dashemail:branch.email,
      dashgymId:branch.gymId,
      dashbranchName:branch.branchName
    });

   // event.stopPropagation();
  }

  const handleClose=event=>{
    event.preventDefault()
    setopenDialog(false);
    event.stopPropagation()
  }


  const toggleBranchAction = (branchId) => () => {
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


const togleStateList = () => {
if(document.getElementById("state-list-sort").style.display == "none"){
    document.getElementById("state-list-sort").style.display = "block";
    document.getElementById("select-state-icon").style.transform = "rotate(-180deg)"
}else{
    document.getElementById("state-list-sort").style.display = "none";
    document.getElementById("select-state-icon").style.transform = "rotate(0deg)"
}
}

const toggleCityLst = () => {
if(document.getElementById("city-list-sort").style.display == "none"){
    document.getElementById("city-list-sort").style.display = "block";
    document.getElementById("select-city-icon").style.transform = "rotate(-180deg)"
}else{
    document.getElementById("city-list-sort").style.display = "none";
    document.getElementById("select-city-icon").style.transform = "rotate(0deg)"
}
}


const toggleLocationLst = () => {
if(document.getElementById("location-list-sort").style.display == "none"){
    document.getElementById("location-list-sort").style.display = "block";
    document.getElementById("select-location-icon").style.transform = "rotate(-180deg)"
}else{
    document.getElementById("location-list-sort").style.display = "none";
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

const NavigateToRoute=(route)=>event=>{
  event.preventDefault()
  switch(route){
      case "Gym":
          history.push({
            pathname: `/admin/gym`,
            state:{action:'create'}
          });
      break;
      case "Member":
          history.push({
              pathname:`/members`,
              state:{
                  branchId:"",
                  action:"create"
              }
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


  const GetAllBranch=active=>{
    return getAllBranch(user._id,token,{active}).then(data=>{
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
    if(props.location.state&&props.location.state.action=="create")  setopenDialog(true);
    if(user.role==0){ 
      GetAllActiveGyms(gymcurrentpage);
      let data=await GetAllBranch(true);
      setBranchs(data)
    }//fetching gym data
    if(user.role==1){ 
     GetAllActiveBranch(gymcurrentpage,user.pannelAccessId)
     setGym({...Gym,gymId:user.pannelAccessId}) 
     getGym(user._id,token,user.pannelAccessId).then(data=>{if(data.error){throw "Something went wrong please try again"}else{setGym({gymId:data._id,gymName:data.gymName,phone:data.phone,email:data.email})}}).catch(err=>alert(err))
    }
  },[]);

    return(
        <Dashboard data={{
          branchId:dashbranchId,
          branchName:dashbranchName,
          gymId:dashgymId,
          gymName:dashgymName,
          email:dashemail,
          totaladminusers,
          totalmembers,
          phone:dashphone,
          active:dashactive
        }} navItemData={"Branch"} flag={flag}>
             {/* header */}


        <div className="header-bar">
            <div>
                <div className="dashboard-name-container">
                    <div className="dashboard-name">Branch Accounts</div>
                
                    <span onClick={toggleGlobalActionContainer} class="material-icons-round" style={{color:"#bdbdbd", margin:"-0.8% 0 0 8%", cursor:"pointer"}}>add_circle_outline</span>
                    <div id="global-action-container" className="add-global-action-container" style={{display:"none"}}>
                                <div onClick={NavigateToRoute("Gym")} className="action-item d-flex">
                                    <span class="material-icons-round flex-item">fitness_center</span>
                                    <div className="flex-item spacing-19">Add Gym</div>
                                </div>
                                <div role="button" onClick={openAddBranchForm} className="action-item d-flex">
                                    <span class="material-icons-round flex-item">store</span>
                                    <div className="flex-item spacing-19">Add Branch</div>
                                </div>
                                <div onClick={NavigateToRoute("Member")} className="action-item d-flex">
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
                <div>
                <div onClick={handleActiveInactiveBranchList} className="active-inactive-container">
                    <img src={SwapIcon} className="active-inactive-icon"/>
                    <div id="switch-gym" className="active-inactive-text">{mapAction==0?`Active`:`Inactive`}</div>
                </div>
             
                </div>

            </div>

         
            
            <div>
              
                <div style={{display:"flex",flexDirection:'row',alignItems:'flex-end'}}>
                <div role="button" onClick={SelectGym} style={{alignSelf:'center',marginLeft:'0',width:'12vw',border:'none'}} className="popup-button-wrapper">
                         
                         <div className="popup-wrapper-item">
                           <img className="popup-wrapper-item-img" src={gymId!=""?`${API}/photo-gym/${gymId}`:"https://img.icons8.com/doodle/48/000000/empty-box.png"}/>
                         </div>
                         <div className="popup-wrapper-item">
                           <div style={{fontWeight:400,marginBottom:"-2%",fontSize:'0.8vw'}} className="popup-wrapper-item-text">Selected Gym</div>
                           <div className="popup-wrapper-item-text">{gymName==""?`Select Gym`:gymName.toString().substring(0,12)}{gymName.toString().length>12?"....":""}</div>
                         </div>
                        
                </div> 
                <div style={{alignSelf:'center'}} className="search-field-container">
                
                    <input style={{alignSelf:'center'}} type="text" className="search-field" placeholder="search"/>
                    <div style={{alignSelf:'center'}} onClick={toggleFilter} className="filter-container">
                        <img src={FilterIcon} className="filter-icon"/>
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
                                    <div id="state-list-sort" className="dropdown-menu-items" style={{display: "none"}}>
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
                                    <div id="city-list-sort" className="dropdown-menu-items" style={{display: "none"}}>
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
                                    <div id="location-list-sort" className="dropdown-menu-items" style={{display: "none"}}>
                                        <div className="menu-text-spacing">Andhra Pradesh</div>
                                    <div className="menu-text-spacing">Aurnachal Pradesh</div>
                                    </div>
                                </div>
                                </div>
              
                
                    </div>
                </div>
            
                <div className="pagination-container">
                    <div className="pagination-tracker">
                        1 - 9  of  56 
                    </div>
                    <img  src={ArrowLeft}  className="pagination-icon"/>
                    <img  src={ArrowRight} className="pagination-icon"/>
                </div>
            </div>
            
        </div>





        
        {/* Get All Gym List*/}
        <table  className="body-container">
          <thead>
            <tr>
              <th style={{textAlign:"left", padding :"0 0 0 4.7%", width: "20%"}}>Branch Name</th>
              <th>City</th>
              <th>Location</th>
              <th>Contact Name</th>
              <th>Contact No.</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {Branchs.map((branch) => {
              return (
                <tr  onClick={onBranchSelect(branch)}  key={branch._id} style={{ backgroundColor:branchId == branch._id?"rgb(0, 0, 0, 0.08)":"#ffffff", boxShadow:branchId == branch._id?"none":"0px 0.01px 3px 3px rgb(0, 0, 0, 0.05)"}}>
                  <td style={{textAlign:"left", padding :"0 0 0 1.4%", width: "20%", fontWeight : "bold"}}>
                    <div className="d-flex">
                      <span class="material-icons-round action-icon" style={{ color:branchId == branch._id?"#0077ff":"#cacaca"}}>check_circle</span>
                      <div style={{padding :"2% 0 0 2%"}}>{branch.branchName}</div>
                    </div>
                  </td>
                  <td style={{fontFamily:"sans-serif"}}>{branch.city}</td>
                  <td>Wagholi</td>
                  <td>{branch.branchmanager['firstname']} {branch.branchmanager['lastname']}</td>
                  <td style={{fontFamily:"sans-serif"}}>{branch.branchmanager['phone']}</td>
                  <td>
                    <div className="d-flex" style={{padding :"0 0 0 12%"}}>
                      <span class={`material-icons-round action-icon ${branch.active?`active`:`inactive`}`}>circle</span>
                      <div style={{padding :"2.2% 0 0 2%"}} className={branch.active?`active`:`inactive`}>{branch.active?`Active`:`Inactive`}</div>
                    </div>
                  </td>
                  <td>
                    <span onClick={toggleBranchAction(branch._id)} class="material-icons-outlined edit-icon">more_horiz</span>
                    <div id={"action-" + branch._id} className="table-action-container" style={{display:"none",zIndex:1}}>
                      <div role="button" onClick={handleBranchUpdate(branch)}  className="d-flex spacing-22">
                        <img src={UpdateIcon} className="body-content-two-action-icon" />
                        <div className="spacing-24">Update</div>
                      </div>
                      <div style={{margin:"2% 0", width:"100%", height:"1px", backgroundColor:"#f5f5f5"}}></div>
                      <div role="button" onClick={handleConfirmOpen(branch.branchName,branch._id)} className="d-flex spacing-22">
                        <img src={BlockIcon} className="body-content-two-action-icon" />
                        <div className="spacing-24">{branch.active?`Block`:`Unblock`}</div>
                      </div>

                    </div>
                  </td>
                </tr>
              );
            })}

          </tbody>
        </table>






     
        {/* popup section code */}    
        <div  className={`content-add-section ${dialogfun==2?`content-add-section-rs-height content-add-section-rs-width`:dialogfun==3?`content-add-section-rs-size`:'content-add-section-bg-size'}`} style={{display:openDialog?"block":"none"}}>
            <div className="exerise-header-bar">
                <div style={{display:"flex", alignSelf:"center"}} >
                    <div className="exercise-header-text" style={{marginRight:"6%", alignSelf:"center", whiteSpace:"nowrap"}}>{title}</div>
                    {
                        dialogfun==0?(
                            <span role="button" onClick={CreateBranch}  class="material-icons-outlined" style={{fontSize:"1.8vw", alignSelf:"center", color:"#e0e0e0"}}>add_circle_outline</span>
                        ):dialogfun==1?(
                            <span role="button"  onClick={UpdateThisBranch} class="material-icons-outlined" style={{fontSize:"1.8vw", alignSelf:"center", color:"#e0e0e0"}}>update</span>
                        ):(null)
                    }
                  
                </div>
                
                <img  onClick={handleClose}  src={Cross} role="button"  className="exercise-header-close"/>
            </div>
            

            {
                dialogfun==2?[
                    <div style={{ height: "25vw"}} className="ml-3 mt-3 mr-3 mb-3">
                            <input style={{alignSelf:'center'}} type="text" className="search-field popup-search-field" placeholder="search"/>
                            <div style={{overflowY:'auto',overflowX:'none',marginBottom:"2%",height:"80%"}} className="mt-4 mb-2">
                            {Gyms.map((gym)=>{
                                //onClick={selectGym(gym._id,gym.gymName,gym.email,gym.phone)}
                                return(
                                  
                                    <div style={{cursor:'pointer'}} onClick={selectGym(gym._id,gym.gymName,gym.email,gym.phone)}  className="row mt-1 mr-3 ml-3 card-item-wrapper">
                                    <div className="m-1" style={{ borderRadius: 100, width: 25, height: 25}} >
                                        <img style={{borderRadius:"100%"}} className="d-block w-100 h-100 img-fluid"  src={`${API}/photo-gym/${gym._id}`}/>  
                                    </div>
                                    <p className="m-1" style={{fontSize: 15}}>{gym.gymName}</p>
                                    </div>
                                 
                                
                                )
                              })
                            }
                            </div>
                    </div>
                ]:dialogfun==3?[
                  <div className="ml-5 mt-4 mr-5 mb-4">
                  <p className="pt-2" style={{fontWeight: "bold"}}>Important Note:
                     <p style={{fontWeight:"lighter", color:"#757575"}}>Member and Branch Admin  <br/>  {mapAction==1?`will`:`will not`} be able to access the app features.</p></p>
                        
                          <div className="row mt-2" style={{justifyContent: "flex-end"}}>
                              <button style={{outline:'none'}}  onClick={ActiveInActiveOperation(branchId)}  className="mt-1 mr-3 shadow-sm popup-button">
                                  <p className="pt-1" style={{color: "#000"}}>Yes</p>
                              </button>
                              <button style={{outline:'none'}} onClick={handleCloseDialog} className="mt-1 shadow-sm popup-button">
                                  <p  className="pt-1" style={{color: "#000"}}>No</p>
                              </button>
                          </div>
                  </div>
                ]:[

                    <div style={{transition:'0.5s'}} className="exercise-body-container">

                    <div id="branch-info-container" className="popcontainer-wrapper">
                        

                    
                           <div className="popcontainer-sub-wrapper">
                                    <div style={{marginRight:5,zIndex:2,width:'60%',position:'relative'}} className="input-popup-space">

                                        

                                        <div onClick={()=>hanleDropDown("gym-list")} id="gym-wrapper" style={{width:'100%',cursor:'pointer'}} type="text" className="input-popup-flex input-popup">
                                            <div id="gym-txt" className="select-exercise-text">{gymName==""?"Select Gym":gymName}</div>
                                            <img id="gym-list-icon" src={ArrowDown} style={{transition:'0.3s',transform:'rotate(-180deg)'}} className="select-exercise-icon"/>
                                        </div>

                                        <div id="gym-list" className="select-exercise-list" style={{display:"none",position:'absolute'}}>
                                                {Gyms.map((gym,index)=>{
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

                                    
                                </div>


                          <input onChange={_.debounce(OnBlurFieldChecker("branchName"),300)} id="branchName" onInput={handleChange("branchName")} value={branchName} className="input-popup" placeholder="Branch Name"/>
                  
                          <div className="popcontainer-sub-wrapper">
                            <input onChange={_.debounce(OnBlurFieldChecker("branchmanagerFistname"),300)} onInput={handleChange("branchphone")} id="branchphone" value={branchphone} style={{marginRight:5}} className="input-popup input-popup-space" type="number" placeholder="Phone"/>
                            <input onChange={_.debounce(OnBlurFieldChecker("optional_branchphone"),300)} onInput={handleChange("optional_branchphone")} id="optional_branchphone" value={optional_branchphone}  className="input-popup input-popup-space" type="number" placeholder="Optional Phone" />
                        </div>
                        <div className="popcontainer-sub-wrapper">
                            <input onChange={_.debounce(OnBlurFieldChecker("branchemail"),300)} onInput={handleChange("branchemail")} id="branchemail" value={branchemail} style={{marginRight:5}} className="input-popup input-popup-space" type="email" placeholder="Email"/>
                            <input onChange={_.debounce(OnBlurFieldChecker("optional_branchemail"),300)} onInput={handleChange("optional_branchemail")} id="optional_branchemail" value={optional_branchemail}  className="input-popup input-popup-space" type="email" placeholder="Optional Email" />
                        </div>
                    </div>
                        

                 
                    <div id="address-container" className="popcontainer-wrapper">
                               <div className="popcontainer-sub-wrapper">
                                   <div className="input-popup-space">
                                      <div className="popup-header-one">Address</div>
                                   </div>
                               </div>
                
                                <div className="popcontainer-sub-wrapper">
                                    <div style={{marginRight:5,zIndex:1,position:'relative'}} className="input-popup-space">

                                        

                                        <div onClick={()=>hanleDropDown("state-list")} id="state-wrapper" style={{width:'100%',cursor:'pointer'}} type="text" className="input-popup-flex input-popup">
                                            <div id="state-txt" className="select-exercise-text">{state==""?"State":state}</div>
                                            <img id="state-list-icon" src={ArrowDown} style={{transition:'0.3s',transform:'rotate(-180deg)'}} className="select-exercise-icon"/>
                                        </div>

                                        <div id="state-list" className="select-exercise-list" style={{display:"none",position:'absolute'}}>
                                                {
                                                    statelist.map((data,index)=>{
                                                        return (
                                                            <div  role="button" onClick={handleDropdownItem("state",data)}  className="exercise-list-container">
                                                                <div className="exercise-list">
                                                                    {index+1}. {data}
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                }
                                        </div>
                                    
                                    </div>

                                        <div style={{position:'relative'}} className="input-popup-space" >
                                            <div onClick={()=>hanleDropDown("city-list")} id="select-Exercise" style={{width:'100%',cursor:'pointer'}} type="text" className="input-popup-flex input-popup">
                                                <div id="city-txt" className="select-exercise-text">{city==""?"City":city}</div>
                                                <img id="city-list-icon" src={ArrowDown} style={{transition:'0.3s',transform:'rotate(-180deg)'}} className="select-exercise-icon"/>
                                            </div>

                                            <div id="city-list" className="select-exercise-list" style={{display:"none",position:'absolute'}}>
                                                        {
                                                            citylist.map((data,index)=>{
                                                                return (
                                                                    <div  role="button"  onClick={handleDropdownItem("city",data)}  className="exercise-list-container">
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
                                
                                <div className="popcontainer-sub-wrapper">
                                    <div style={{marginRight:5,position:'relative'}} className="input-popup-space">

                                        <div onClick={()=>hanleDropDown("location-list")} id="state-wrapper" style={{width:'100%',cursor:'pointer'}} type="text" className="input-popup-flex input-popup">
                                            <div id="location-txt" className="select-exercise-text">{location==""?"Location":location}</div>
                                            <img id="location-list-icon" src={ArrowDown} style={{transition:'0.3s',transform:'rotate(-180deg)'}} className="select-exercise-icon"/>
                                        </div>

                                        <div id="location-list" className="select-exercise-list" style={{display:"none",position:'absolute'}}>
                                                {
                                                    statelist.map((data,index)=>{
                                                        return (
                                                            <div onClick={handleDropdownItem("location",data)}  role="button"   className="exercise-list-container">
                                                                <div className="exercise-list">
                                                                {index+1}. {data}
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                }
                                        </div>
                                    
                                    </div>

                                    <div className="input-popup-space">
                                        <input type="number" onChange={_.debounce(OnBlurFieldChecker("pincode"),300)} id="pincode" onInput={handleChange("pincode")} value={pincode}   style={{width:'100%'}}  className="input-popup" placeholder="Pincode"/>  
                                    </div>
                                    
                                    
                                </div>
                                <textarea  onChange={_.debounce(OnBlurFieldChecker("address"),300)} id="address" onInput={handleChange("address")} value={address} className="input-popup input-message-box" placeholder="address"/>
                                
                    

                        </div>



                    <div id="manager-info-container" className="popcontainer-wrapper"> 
                        <div className="popcontainer-sub-wrapper">
                            <div className="input-popup-space">
                              <div className="popup-header-one">Admin Info</div>
                            </div>
                        </div>

                        <div className="popcontainer-sub-wrapper">
                            <input onChange={_.debounce(OnBlurFieldChecker("branchmanagerFistname"),300)} onInput={handleChange("branchmanagerFistname")} id="branchmanagerFistname" value={branchmanagerFistname} style={{marginRight:5}} className="input-popup input-popup-space" placeholder="First Name"/>
                            <input onChange={_.debounce(OnBlurFieldChecker("branchmanagerLastname"),300)} onInput={handleChange("branchmanagerLastname")} id="branchmanagerLastname" value={branchmanagerLastname}  className="input-popup input-popup-space" placeholder="Last Name" />
                        </div>
                        <div className="popcontainer-sub-wrapper">
                            <input type="number" onChange={_.debounce(OnBlurFieldChecker("branchmanangerPhone"),300)} onInput={handleChange("branchmanangerPhone")} id="branchmanangerPhone" value={branchmanangerPhone} style={{marginRight:5}} className="input-popup input-popup-space" placeholder="Phone"/>
                            <input  onChange={_.debounce(OnBlurFieldChecker("branchmanagerEmail"),300)} onInput={handleChange("branchmanagerEmail")} id="branchmanagerEmail" value={branchmanagerEmail}  className="input-popup input-popup-space" placeholder="Email" />
                        </div>
                    </div>
 
                </div>
                    ,
                <div className="member-exercise-toggle-container">
                    <div role="button" id="main-ex" style={{backgroundColor:"#f5f5f5", color:"#00a2ff", padding:"1.1% 5%", cursor:"pointer"}}><a style={{textDecoration:'none'}} href="#branch-info-container" className="popup-input-a">Branch Info</a></div>
                    <div style={{padding:"1.1% 5%", color:"#757575"}}>Navigate</div>
                    <div role="button"  id="option-1-ex" style={{padding:"1.1% 3.89%", cursor:"pointer"}}><a className="popup-input-a" style={{textDecoration:'none'}} href="#address-container">Address</a></div>
                    <div role="button"  id="option-2-ex" style={{padding:"1.1% 3.89%", cursor:"pointer"}}><a className="popup-input-a" style={{textDecoration:'none'}} href="#manager-info-container">Manager</a></div>
                </div>
            
                ]
            }


        </div>




 
        
        
        </Dashboard>
    )
}
