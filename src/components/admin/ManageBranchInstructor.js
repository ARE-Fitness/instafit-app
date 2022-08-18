import { Dialog } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { isAuthenticated } from '../../auth';
import { API } from '../../backend';
import { getAllActiveBranch, getBranch, totalActiveBranchPage  } from '../../branch/helper/api';
import {getAllActiveBranchAdmin,checkBranchAdminStatus,getAllBranchAdminUsers,getAllInActiveBranchAdmin,addBranchAdmin,updateBranchAdmin,getBranchAdmin,activeinactiveOperationBranchAdmin, totalinactiveBranchAdminPage} from './../helper/api';
import Dashboard from '../../core/Dashboard';
import { getAllActiveGym, getGym } from '../../gym/helper/api';
import Slide from '@material-ui/core/Slide';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ArrowDown from '../../assets/arrow-down.svg';
import Cross from "../../assets/cross.svg";
import _, { set } from 'lodash';
import FilterIcon from "../../assets/filter.svg";
import ArrowLeft from "../../assets/arrow-left.svg";
import ArrowRight from "../../assets/arrow-right.svg";
import BlockIcon from "../../assets/block.svg";
import UpdateIcon from "../../assets/edit.svg";
import SwapIcon from "../../assets/swap.svg";
import ArrowUp from "../../assets/arrow-sign.svg";
import {useHistory} from 'react-router-dom'
import DownloadIcon from "../../assets/download.svg";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


const BranchAdmin = (props) => {
    const history=useHistory();
    const [total,settotal]=useState(0);
    const [limit,setlimit]=useState(8);
    const [page,setpage]=useState(1);
    const [currentpage,setcurrentpage]=useState(1);
    const [Gym,setGym]=useState({ gymName:"",email:"",phone:""});//save gym info ( name,phone,email )
    const { gymName,email,phone}=Gym;//destrucuring gym
    const [Branch,setBranch]=useState({branchName:"",totalmembers:0,totaladminusers:0,state:"",location:"",area:"",address:"",branchactive:true,branchId:"", gymId:"",error:"",success:""});//save branch info
    const {branchName,branchactive,totalmembers,totaladminusers,state,location,address,branchId, gymId}=Branch;//destructuring the branch info 
    const [openDialog,setopenDialog]=useState(false);//Dialog hooks
    const [branchadmin,setbranchadmin]=useState({
        bfname:"",
        blname:"",
        bemail:"",
        branchadminId:"",
        bphone:"",
        bphoto:"",
        baddress:"",
        blocation:"",
        bstate:"",
        bcity:"",
        bpincode:"",
        specialization:[
            ""
        ],
        bio:"",
        role:4,//manager 4 5 programmer 6 instrauctor 
        formData:new FormData()
    });//branch admin hooks

    const {bfname,blname,bemail,bphone,bphoto,bpincode,blocation,baddress,bcity,bstate,bio,specialization,role,branchadminId,formData}=branchadmin;//branch admin hooks
    const [branchadminList,setbranchadminList]=useState([]);
    const [mapAction,setmapAction]=useState(0);//0 active 1 inactive
    const [openFilterDialog, setOpenFilterDialog] = useState(null);
    const [formdialog,setformdialog]=useState({formrole:0,title:"Create User"});
    const {formrole,title}=formdialog;
    const [active,setactive]=useState(false);
    const [Gyms,setGyms]=useState([]);
    const [Branchs,setBranchs]=useState([]);
    const [Filterdata,setFilterdata]=useState({
        filter_gymName:"",
        filter_gymId:"",
        filter_branchName:"",
        filter_branchId:"",
        filter_state:"",
        filter_city:"",
        filter_location:""
    });
    const {filter_gymName,filter_gymId,filter_branchId,filter_branchName,filter_city,filter_state,filter_location}=Filterdata;
    const [statelist,setstatelist]=useState([
        "Amaravati","Itanagar","Itanagar","Patna","Tripura","West Bengal","Maharastra"
    ])

    const [citylist,setcitylist]=useState([
        "Pune",
        "Mumbai",
        "Aurangabad"
    ]);


    const {user, token} = isAuthenticated();
    const handleOpenDialog=()=>{
        setopenDialog(true);
    };//open dialog handler
    const handleCloseDialog=()=>{
        setopenDialog(false);
    };//close dialog handle
    const handleBranchAdminUpdate=badmin=>event=>{
        event.preventDefault();
        setformdialog({
            ...formdialog,
            title:"Update Admin",
            formrole:1
        });
        setbranchadmin({
            ...branchadmin,
            bfname:badmin.bfname,
            blname:badmin.blname,
            bphone:badmin.bphone,
            bemail:badmin.bemail,
            role:badmin.role,
            branchadminId:badmin._id,
            specialization:badmin.specialization
        });
        formData.set('specialization',JSON.stringify(badmin.specialization))
        setBranch({
            ...Branch,
            branchId:badmin.branchId,
            branchName:badmin.branchName
        })
        fetch(`${API}/branchadmin-photo/${badmin._id}`).then(data=>data.arrayBuffer()).then(data=>{
            if(data.byteLength!=35){
                console.log(data)
                document.getElementById("image-profile-pic").src=``;
                document.getElementById("image-profile-pic").src=`${API}/branchadmin-photo/${badmin._id}?${new Date().getTime()}`;
            }else{
                throw "image not found"
            }
          
        }).catch(err=>{
              document.getElementById("image-profile-pic").src=`https://img.icons8.com/ios/50/000000/camera--v1.png?${new Date().getTime()}`;
        });
        handleOpenDialog();
    }
    const handleCreateBranchAdmin=event=>{
        event.preventDefault();
        setformdialog({
            ...formdialog,
            title:"Create User",
            formrole:0
        });
        setbranchadmin({
            ...branchadmin,
            bfname:"",
            blname:"",
            bphone:"",
            bemail:"",
            role:4
        })
        handleOpenDialog();
    }


    //pagination

    const prev=()=>{
		if(currentpage<=page&&currentpage!=1){
			mapAction==0?GetAllActiveBranchAdmin(branchId,currentpage-1,limit):GetAllInactiveBranchAdmin(branchId,currentpage-1,limit);
		 	setcurrentpage(currentpage-1);
	    }
	};
	const next=()=>{
		if(currentpage<page){
		   mapAction==0?GetAllActiveBranchAdmin(branchId,currentpage+1,limit):GetAllInactiveBranchAdmin(branchId,currentpage+1,limit);	
		   setcurrentpage(currentpage+1);
		}
	};

    //branchadmin handler
    const handleChange=name=>event=>{
        const value = name === "bphoto" ? event.target.files[0] : event.target.value;
        if(name=="bphoto") document.getElementById("image-profile-pic").src=  URL.createObjectURL(event.target.files[0]);
        formData.set(name,value);
        setbranchadmin({...branchadmin,  [name]: event.target.value});
    };
    const handleOpenFilterDialog = (e) => {
        setOpenFilterDialog(e.currentTarget);
    };
    const handleActiveUsers=event=>{
        event.preventDefault();
        setmapAction(0);
        GetAllActiveBranchAdmin(branchId,currentpage,limit);
        setOpenFilterDialog(null);
    };
    const handleInActiveUsers=event=>{
        setmapAction(1);
        GetAllInactiveBranchAdmin(branchId,currentpage,limit);
        setOpenFilterDialog(null);
    };
    

    //branchadmin handler
    const getCurrentBranch = branchId => {
        getBranch(user._id, token, branchId).then(data => {
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
                GetAllActiveBranchAdmin(branchId,currentpage,limit);
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
    const GetAllActiveBranchAdmin=(branchId,currentpage,limit)=>{
        getAllActiveBranchAdmin(user._id,token,branchId,currentpage,limit).then(data=>{
            if(data.error){
                console.log(data.error)
            }else{
                setbranchadminList(data);
            }
        }).catch(err=>{
            console.log(err)
        });
    }
    const GetAllInactiveBranchAdmin=(branchId,currentpage,limit)=>{
        getAllInActiveBranchAdmin(user._id,token,branchId,currentpage,limit).then(data=>{
            if(data.error){
                console.log(data.error)
            }else{
                setbranchadminList(data);
            }
        }).catch(err=>console.log(err))
    }
    const AddBranchAdmin=event=>{
        event.preventDefault();
        addBranchAdmin(user._id,token,branchId,formData).then(data=>{
            if(data.error){
                console.log(data.error);
            }else{
                setbranchadmin({
                    ...branchadmin,
                    bfname:data.bfname,
                    blname:data.blname,
                    bemail:data.bemail,
                    bphone:data.bphone
                });
                GetAllActiveBranchAdmin(branchId,currentpage,limit);
                handleCloseDialog()
            }
        })
    }
    const editBranchAdmin=event=>{
        event.preventDefault();
   
 
        updateBranchAdmin(user._id,token,branchadminId,formData).then(data=>{
            if(data.error){
                console.log(data.error)
            }else{
                console.log("done")
                setbranchadmin({
                    ...branchadmin,
                    bfname:data.bfname,
                    blname:data.blname,
                    bemail:data.bemail,
                    specialization:data.specialization,
                    bphone:data.bphone
                });
                let active=mapAction==0?true:false;
                if(user.role==0) GetAllBranchAdminUsers(active);
                handleCloseDialog()

            }
        }).catch(err=>console.log(err))
     

    }
    const TotalActiveBranchAdminPages=limit=>{
        totalActiveBranchPage(user._id,token,props.match.params.branchId,limit).then(data=>{
            if(data.error){
                console.log(data.error);
            }else{
                settotal(data.total);
                setpage(data.page);
            }
        }).catch(err=>console.log(err))
    }
    const TotalInActiveBranchAdminPages=limit=>{
        totalinactiveBranchAdminPage(user._id,token,props.match.params.branchId,limit).then(data=>{
            if(data.error){
                console.log(data.error);
            }else{
                settotal(data.total);
                setpage(data.page);
            }
        }).catch(err=>console.log(err))
    }
    const ActiveInActiveOperation=event=>{
        event.preventDefault();
        console.log(event.target);
        activeinactiveOperationBranchAdmin(user._id,token,branchadminId,{active}).then(data=>{
            if(data.error){
                console.log(data.error)
            }else{
                //if()mapAction==0?GetAllActiveBranchAdmin(branchId,currentpage,limit):GetAllInactiveBranchAdmin(branchId,currentpage,limit);
                let active=mapAction==0?true:false;
                if(user.role==0) GetAllBranchAdminUsers(active)
                handleCloseDialog()
            }
        }).catch(err=>console.log(err))
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
    const handleBlockOpen = branchadmin => {
        setformdialog({
        ...formdialog,
        title:"Do you really want to inactive this User ?",
        formrole:2
        });
        setbranchadmin({
        ...branchadmin,
        bfname:branchadmin.bfname,
        blname:branchadmin.blname,
        branchadminId:branchadmin._id,
        role:branchadmin.role
        })
        setactive(false);
        setopenDialog(true);
    }
    const handleUnblockOpen = branchadmin => {
        setformdialog({
        ...formdialog,
        title:"Do you really want to active this User ?",
        formrole:2
        })
        setbranchadmin({
        ...branchadmin,
        bfname:branchadmin.bfname,
        blname:branchadmin.blname,
        role:branchadmin.role,
        branchadminId:branchadmin._id
        });
        setactive(true);
        setopenDialog(true);
    }

    




    const hanleDropDown=id=>{
        let dropdown=document.querySelector('#'+id);
        let arrowicon=document.querySelector("#"+id+"-icon");

        if(dropdown.style.display=="none"){
            dropdown.style.display="block";
            arrowicon.style.transform='rotate(0deg)';
            if(`${id}`.toLowerCase().includes("gym")&&user.role==0) GetActiveGyms();
        }else {
            dropdown.style.display="none";
            arrowicon.style.transform='rotate(-180deg)';
        }

     
    }


    const handleDropdownItem=(name,value)=>event=>{
        event.preventDefault();
        if(name=="gym"){
            setGym({
                ...Gym,
                gymName:value.gymName,
                phone:value.phone,
                email:value.email
            });
            setBranch({
                ...Branch,
                gymId:value._id,
                location:"",
                branchId:"",
                branchName:""
            });
            GetActiveBranchs(value._id);
        }else if(name=="branch"){
            setBranch({
                ...Branch,
                branchName:value.branchName,
                branchId:value._id
            })
            formData.set("branchName",value.branchName)
        }else{
            setbranchadmin({...branchadmin,[name]:value});
            formData.set(name,value);
            name="sort"+name.toString().slice(1,name.toString().length);
        }
        
        document.getElementById(name+"-list").style.display="none";
        document.getElementById(name+"-list-icon").style.transform='rotate(-180deg)';

    }


    const handleSpecialization=index=>event=>{
        setbranchadmin(oldtstate=>{
            oldtstate.specialization[index]=event.target.value;
            return ({...oldtstate});
        });
        formData.set('specialization',JSON.stringify(specialization))
    }

    const AddSpecialization=event=>{
        event.preventDefault();
        setbranchadmin(oldtstate=>{
            oldtstate.specialization.push("");
            return ({...oldtstate});
        })
    }

    const RemoveSpecialization=index=>event=>{
        event.preventDefault();
        setbranchadmin(oldtstate=>{
            if(index>-1) oldtstate.specialization.splice(index,1); 
            return ({...oldtstate})
        })
    }

    const GetActiveGyms=()=>{
        getAllActiveGym(user._id,token,currentpage,limit).then(data=>{
            if(data.error){
                console.log(data.error)
            }else{
                console.log(data)
                setGyms(data);
            }
        }).catch(err=>console.log(err))
    }

    const GetActiveBranchs=gymId=>{
        getAllActiveBranch(user._id,token,gymId,currentpage,limit).then(data=>{
            if(data.error){
                console.log(data.error)
            }else{
                setBranchs(data);
            }
        }).catch(err=>{
            console.log(err)
        })
    }

    //new handlers 



  const handleActiveInactiveUsersList=event=>{
        event.preventDefault();
        if(mapAction==0){
          setmapAction(1);
          if(user.role==0) GetAllBranchAdminUsers(false)
          setactive(true);
        }else{
          setmapAction(0);
          if(user.role==0) GetAllBranchAdminUsers(true)
          setactive(false);
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


      
    const toggleGymList =event=> {
        event.preventDefault()
        if(document.getElementById("gymsort-list").style.display == "none"){
          document.getElementById("gymsort-list").style.display = "block";
          document.getElementById("select-gymsort-icon").style.transform = "rotate(-180deg)"
        }else{
          document.getElementById("gymsort-list").style.display = "none";
          document.getElementById("select-gymsort-icon").style.transform = "rotate(0deg)"
        }
        if(user.role==0) GetActiveGyms();
    }
    
    const handleFilterItems=(field,data)=>event=>{
        event.preventDefault()
         setFilterdata(olddata=>{
             if(field=="gym"){
                 olddata['filter_gymId']=data._id;
                 olddata['filter_gymName']=data.gymName
                if(user.role==0||user.role==1) GetActiveBranchs(data._id);
                document.getElementById("gymsort-list").style.display = "none";
                document.getElementById("select-gymsort-icon").style.transform = "rotate(0deg)"
             }else if(field=="branch"){
                 olddata['filter_branchId']=data._id;
                 olddata['filter_branchName']=data.branchName;
                 document.getElementById("branchsort-list").style.display = "none";
                 document.getElementById("select-branchsort-icon").style.transform = "rotate(0deg)"
             }else{
                 olddata[field]=data;
             }
             return ({...olddata})
         })
    }
         
    const toggleBranchList = event => {
        event.preventDefault()
        if(document.getElementById("branchsort-list").style.display == "none"){
          document.getElementById("branchsort-list").style.display = "block";
          document.getElementById("select-branchsort-icon").style.transform = "rotate(-180deg)"
        }else{
          document.getElementById("branchsort-list").style.display = "none";
          document.getElementById("select-branchsort-icon").style.transform = "rotate(0deg)"
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

    const onUserSelect=data=>event=>{
        setbranchadmin({
            ...branchadmin,
            branchadminId:data._id,
            bfname:data.bfname,
            blname:data.blname,
            bemail:data.bemail,
            bphone:data.bphone,
            baddress:data.baddress,
            blocation:data.blocation,
            bstate:data.bstate,
            bcity:data.bcity,
            bpincode:data.bpincode,
            specialization:data.specialization,
            bio:data.bio,
            role:data.role //manager 4 5 programmer 6 instrauctor 
        })
    }


const toggleUserAction = (branchId) => () => {
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


  
     const GetAllBranchAdminUsers=active=>{
        getAllBranchAdminUsers(user._id,token,{active}).then(data=>{
            if(data.error){
                console.log(data.error)
            }else{
                setbranchadminList(data)
            }
        }).catch(err=>console.log(err))
     }
  
  

    useEffect(() => {
        if(props.location.state&&props.location.state.action=="create")  setopenDialog(true);
        if(props.location.state&&props.location.state.branchId!=""&&user.role==2){
          setBranch({...Branch,branchId:props.location.state.branchId});
          getCurrentBranch(props.location.state.branchId)
        }
        if(user.role==0){
            GetAllBranchAdminUsers(true)
        }
        // getCurrentBranch();
        // GetAllActiveBranchAdmin(currentpage,limit);
    },[])

    return(
        <Dashboard 
        itemId={gymId} navItemData={"noItem"}
        data={{ branchId, branchName,active:branchactive, gymId, gymName, email, phone,totalmembers,totaladminusers }} 
        flag={2}>



                <div className="header-bar">
                                        <div>
                                            <div className="dashboard-name-container">
                                                <div className="dashboard-name">Users Account's</div>
                                            
                                                <span role="button" onClick={handleCreateBranchAdmin} class="material-icons-round" style={{color:"#bdbdbd", margin:"-0.8% 0 0 8%", cursor:"pointer"}}>add_circle_outline</span>
                                             
                                            </div>
                                            <div onClick={handleActiveInactiveUsersList} className="active-inactive-container">
                                                <img src={SwapIcon} className="active-inactive-icon"/>
                                                <div id="switch-gym" className="active-inactive-text">{mapAction==0?"Active":"InActive"}</div>
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
                                            {
                                                   user.role==0?(
                                                                      
                                                <div className="container-spacing">
                                                <span className="g-font-1 inactive">Gym</span>
                                                <div role="button" onClick={toggleGymList}
                                                id="gymsort-accounts"
                                                type="text"
                                                className="d-flex select-dropdown"
                                                >
                                                <div className="select-exercise-text">{filter_gymName==""?`Select Gym`:filter_gymName}</div>
                                                <img
                                                    id="select-gymsort-icon"
                                                    src={ArrowUp}
                                                    className="select-exercise-icon"
                                                />
                                                </div>
                                                <div id="gymsort-list" className="dropdown-menu-items" style={{display: "none"}}>
                                                   {
                                                        Gyms.map(data=>{
                                                            return (
                                                                <div onClick={handleFilterItems("gym",data)} className="menu-text-spacing">{data.gymName}</div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                             
                                                   ):(null)
                                               }     


                                                {
                                                   user.role==0||user.role==1?(     
                                                <div className="container-spacing">
                                                    <span className="g-font-1 inactive">Branch</span>
                                                    <div onClick={toggleBranchList}
                                                    id="branchsort-accounts"
                                                    type="text"
                                                    className="d-flex select-dropdown"
                                                    >
                                                    <div className="select-exercise-text">{filter_branchName==""?`Select Branch`:filter_branchName}</div>
                                                    <img
                                                        id="select-branchsort-icon"
                                                        src={ArrowUp}
                                                        className="select-exercise-icon"
                                                    />
                                                    </div>
                                                    <div id="branchsort-list" className="dropdown-menu-items" style={{display: "none"}}>
                                                        
                                                        {
                                                            Branchs.map(data=>{
                                                                return (
                                                                    <div role="button" onClick={handleFilterItems("branch",data)} className="menu-text-spacing">{data.branchName}</div>
                                                                )
                                                            })
                                                        }
                                                  
                                                    </div>
                                                </div>
                                                   ):(null)
                                                   }
                                         
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


                        
                {/* <div className="pt-3 pl-3 pr-3">
                   {
                       branchadminList.map((branchadmin)=>{
                           return (
                            <div className="shadow mb-2" style={{ backgroundColor: "#fafafa",width: "100%", height: 33, borderRadius: 10}}>
                            <div className="row pl-4 pr-4" style={{justifyContent: "space-between"}}>
                                <div className="row">
                                    <div className="shadow mt-1 ml-4" style={{ borderRadius: 100, width: 25, height: 25}} >
                                        <img className="d-block w-100 h-100 img-fluid"  src={`${API}/branchadmin-photo/${branchadmin._id}`}/>  
                                    </div>
                                    <p className="pt-1 pl-2" style={{fontSize: 15}}>{branchadmin.bfname} {branchadmin.blname}</p>
                                </div>
                                <div className="row">
                                   {
                                        (mapAction === 0)? (
                                            <span onClick={() => {handleBlockOpen(branchadmin)}} className="material-icons pt-1 btn pr-0" style={{color: "#FF6060"}}>block</span>
                                        ) : (mapAction === 1)? (
                                            <span onClick={() => {handleUnblockOpen(branchadmin)}} className="material-icons pt-1 btn pr-0" style={{color: "#0277bd", fontSize: 23}}>add_task</span>
                                        ) : null
                                    }
                                   <span onClick={handleBranchAdminUpdate(branchadmin)} className="material-icons pt-1 btn pr-4" style={{color: "#43a047"}}>update</span>
                                </div>
                                </div>
                            </div>
                           )
                       })
                   }
                   <div className="row pr-3" style={{marginBottom: 8, float: "right"}}> 
                    <span onClick={prev} className="material-icons btn">skip_previous</span>
                    <p className="pt-2">{currentpage}</p>
                    <span onClick={next} className="material-icons btn ">skip_next</span>
                   </div>
                </div>
 */}


                {/* uers list */}
    <table  className="body-container">
          <thead>
            <tr>
              <th style={{textAlign:"left", padding :"0 0 0 4.7%", width: "20%"}}>User Name</th>
              <th>Location</th>
              <th>Contact Email</th>
              <th>Contact No.</th>
              <th>Branch Name</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {branchadminList.map((data) => {
              return (
                <tr onClick={onUserSelect(data)}   style={{ backgroundColor:branchadminId == data._id?"rgb(0, 0, 0, 0.08)":"#ffffff", boxShadow:branchadminId == data._id?"none":"0px 0.01px 3px 3px rgb(0, 0, 0, 0.05)"}}>
                  <td style={{textAlign:"left", padding :"0 0 0 1.4%", width: "20%", fontWeight : "bold"}}>
                    <div className="d-flex">
                      <span class="material-icons-round action-icon" style={{ color:branchadminId == data._id?"#0077ff":"#cacaca"}}>check_circle</span>
                      <div style={{padding :"2% 0 0 2%"}}>{data.bfname} {data.blname}</div>
                    </div>
                  </td>
                  <td>{data.blocation}</td>
                  <td>{data.bemail}</td>
                  <td style={{fontFamily:"sans-serif"}}>{data.bphone}</td>
                  <td>{data.branchName}</td>
                  <td>
                    <div className="d-flex" style={{padding :"0 0 0 12%"}}>
                      <span class={`material-icons-round action-icon ${data.active?`active`:`inactive`}`}>circle</span>
                      <div style={{padding :"2.2% 0 0 2%"}} className={data.active?`active`:`inactive`}>{data.active?`Active`:`Inactive`}</div>
                    </div>
                  </td>
                  <td>
                    <span onClick={toggleUserAction(data._id)} class="material-icons-outlined edit-icon">more_horiz</span>
                    <div id={"action-" + data._id} className="table-action-container" style={{display:"none"}}>
                      <div role="button" onClick={handleBranchAdminUpdate(data)} className="d-flex spacing-22">
                        <img src={UpdateIcon} className="body-content-two-action-icon" />
                        <div className="spacing-24">Update</div>
                      </div>
                      
                      <div style={{margin:"2% 0", width:"100%", height:"1px", backgroundColor:"#f5f5f5"}}></div>
                      <div onClick={()=>data.active?handleBlockOpen(data):handleUnblockOpen(data)} role="button"  className="d-flex spacing-22">
                        <img src={BlockIcon} className="body-content-two-action-icon" />
                        <div className="spacing-24">{data.active?`Block`:`Unblock`}</div>
                      </div>

                    </div>
                  </td>
               
                </tr>
              );
            })}

          </tbody>
        </table>

            


            


                {/* popup section code */}    
                <div  className={`content-add-section ${formrole==2?`content-add-section-rs-size`:'content-add-section-bg-size'}`} style={{display:openDialog?"block":"none"}}>
                    <div className="exerise-header-bar">
                        <div style={{display:"flex", alignSelf:"center"}} >
                            <div className="exercise-header-text" style={{marginRight:"6%", alignSelf:"center", whiteSpace:"nowrap"}}>{title}</div>
                            {
                                formrole==0?(
                                    <span role="button" onClick={AddBranchAdmin}  class="material-icons-outlined" style={{fontSize:"1.8vw", alignSelf:"center", color:"#e0e0e0"}}>add_circle_outline</span>
                                ):formrole==1?(
                                    <span role="button" onClick={editBranchAdmin}  class="material-icons-outlined" style={{fontSize:"1.8vw", alignSelf:"center", color:"#e0e0e0"}}>update</span>
                                ):(null)
                            }
                        </div>
                        
                        <img  src={Cross} role="button" onClick={handleCloseDialog} className="exercise-header-close"/>
                    </div>
                    

                    {
                        formrole==2?[
                            <div className="ml-5 mt-4 mr-5 mb-4">
                                <p className="pt-2" style={{fontWeight: "bold"}}>Important Note:
                                    <p style={{fontWeight:"lighter", color:"#757575"}}>Branch's & member's under this gym will  <br/>  not be able to access their profile.</p></p>
                                
                                    <div className="row mt-2" style={{justifyContent: "flex-end"}}>
                                        <button onClick={ActiveInActiveOperation} className="mt-1 mr-3 shadow-sm popup-button">
                                            <p className="pt-1" style={{color: "#000"}}>Yes</p>
                                        </button>
                                        <button onClick={handleCloseDialog} className="mt-1 shadow-sm popup-button">
                                            <p  className="pt-1" style={{color: "#000"}}>No</p>
                                        </button>
                                    </div>
                            </div>
                        ]:[

                            <div style={{transition:'0.5s'}} className="exercise-body-container">

                            
                            


                            <div id="gym-info-container" className="popcontainer-wrapper">
                            
                                <div className="image-profile">
                                        <img id="image-profile-pic" src="https://img.icons8.com/ios/50/000000/camera--v1.png" className="image-popup"/>
                                        <input type="file" name="file" id="file" accept="image/*" onChange={handleChange("bphoto")} value={bphoto} className="image-input-field"/> 
                                </div>
                                

                                {
                                    formrole==0?(

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
                                    

                                    ):(null)
                                }

                                <div className="popcontainer-sub-wrapper">
                                    <input type="text" onChange={_.debounce(OnBlurFieldChecker("bfname"),300)} id="bfname"  onInput={handleChange("bfname")} value={bfname} style={{marginRight:5}} className="input-popup input-popup-space" placeholder="Firstname"/>
                                    <input onChange={_.debounce(OnBlurFieldChecker("blname"),300)} id="blname" onInput={handleChange("blname")} value={blname}  className="input-popup input-popup-space" placeholder="Lastname" />
                                </div>
                                <div className="popcontainer-sub-wrapper">
                                    <input type="number" onChange={_.debounce(OnBlurFieldChecker("bphone"),300)} id="bphone"  onInput={handleChange("bphone")} value={bphone} style={{marginRight:5}} className="input-popup input-popup-space" placeholder="Phone"/>
                                    <input onChange={_.debounce(OnBlurFieldChecker("bemail"),300)} id="bemail" onInput={handleChange("bemail")} value={bemail}  className="input-popup input-popup-space" placeholder="Email" />
                                </div>
                                <div className="popup-checkbox-wrapper">
                                    <p className="popup-gym-type-text">User Type</p>
                                    <div className="row">
                                        
                                    <div className="col-6">
                                        <label className="input-popup p-2" style={{width:'100%'}} for="op1">
                                            <input onChange={handleChange("role")} value={4} id="op1" name="role" checked={role==4} type="radio"/>
                                            <span className="ml-2">Manager</span>
                                        </label>
                                    </div>
                                    <div className="col-6">
                                        <label className="input-popup p-2"  style={{width:'100%'}} for="op2">
                                            <input onChange={handleChange("role")} value={5} id="op2" name="role" checked={role==5} type="radio"/>
                                            <span className="ml-2">Programmer</span>
                                        </label>
                                    </div>
                                    <div className="col-6 mt-2">
                                        <label className="input-popup p-2" style={{width:'100%'}} for="op3">
                                            <input onChange={handleChange("role")} value={6} id="op3" name="role" checked={role==6} type="radio"/>
                                            <span className="ml-2">Instructor</span>
                                        </label>
                                    </div>


                                    </div>
                                </div>


                            </div>
                                

                            <div id="address-container" className="popcontainer-wrapper">
                                        
                                    <div className="popcontainer-sub-wrapper">
                                        <div className="input-popup-space">
                                            <div className="popup-header-one">Address</div>
                                        </div>
                                    </div>

                                    <textarea  onChange={_.debounce(OnBlurFieldChecker("baddress"),300)} id="baddress" onInput={handleChange("baddress")} value={baddress} className="input-popup input-message-box" placeholder="address"/>

                        
                                        <div className="popcontainer-sub-wrapper">
                                            <div style={{marginRight:5,zIndex:1,position:'relative'}} className="input-popup-space">

                                                

                                                <div onClick={()=>hanleDropDown("sortstate-list")} id="sortstate-wrapper" style={{width:'100%',cursor:'pointer'}} type="text" className="input-popup-flex input-popup">
                                                    <div id="sortstate-txt" className="select-exercise-text">{bstate==""?"State":bstate}</div>
                                                    <img id="sortstate-list-icon" src={ArrowDown} style={{transition:'0.3s',transform:'rotate(-180deg)'}} className="select-exercise-icon"/>
                                                </div>

                                                <div id="sortstate-list" className="select-exercise-list" style={{display:"none",position:'absolute'}}>
                                                        {
                                                            statelist.map((data,index)=>{
                                                                return (
                                                                    <div  role="button" onClick={handleDropdownItem("bstate",data)}  className="exercise-list-container">
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
                                                    <div onClick={()=>hanleDropDown("sortcity-list")} id="select-Exercise" style={{width:'100%',cursor:'pointer'}} type="text" className="input-popup-flex input-popup">
                                                        <div id="sortcity-txt" className="select-exercise-text">{bcity==""?"City":bcity}</div>
                                                        <img id="sortcity-list-icon" src={ArrowDown} style={{transition:'0.3s',transform:'rotate(-180deg)'}} className="select-exercise-icon"/>
                                                    </div>

                                                    <div id="sortcity-list" className="select-exercise-list" style={{display:"none",position:'absolute'}}>
                                                                {
                                                                    citylist.map((data,index)=>{
                                                                        return (
                                                                            <div  role="button"  onClick={handleDropdownItem("bcity",data)}  className="exercise-list-container">
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

                                                <div onClick={()=>hanleDropDown("sortlocation-list")} id="sortlocation-wrapper" style={{width:'100%',cursor:'pointer'}} type="text" className="input-popup-flex input-popup">
                                                    <div id="sortlocation-txt" className="select-exercise-text">{blocation==""?"Location":blocation}</div>
                                                    <img id="sortlocation-list-icon" src={ArrowDown} style={{transition:'0.3s',transform:'rotate(-180deg)'}} className="select-exercise-icon"/>
                                                </div>

                                                <div id="sortlocation-list" className="select-exercise-list" style={{display:"none",position:'absolute'}}>
                                                        {
                                                            statelist.map((data,index)=>{
                                                                return (
                                                                    <div onClick={handleDropdownItem("blocation",data)}  role="button"   className="exercise-list-container">
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
                                                <input type="number" onChange={_.debounce(OnBlurFieldChecker("bpincode"),300)} id="bpincode" onInput={handleChange("bpincode")} value={bpincode}   style={{width:'100%'}}  className="input-popup" placeholder="Pincode"/>  
                                            </div>
                                            
                                            
                                        </div>
                                        
                            

                                </div>



                            <div id="specialization-container" className="popcontainer-wrapper">
                                        
                                    <div className="popcontainer-sub-wrapper">
                                        <div className="input-popup-space" style={{display:'flex',width:"5vw",alignItems:'flex-start',flexDirection:"row"}}>
                                            <div className="popup-header-one">
                                                  <div style={{width:'40%',alignItems:'flex-start',display:'flex'}}>
                                                      <div style={{alignSelf:'center'}}>
                                                         Sepecializations
                                                      </div>
                                                      <div style={{alignSelf:'center',marginBottom:'-15%'}}>
                                                         <span  onClick={AddSpecialization} role="button" className="ml-2 material-icons">add_circle</span>
                                                      </div>
                                                  </div>
                                            </div>
                                            
                                            
                                        </div>
                                        
                                    </div>

                                    {/* <input role="button"  onClick={AddSpecialization}  id="specialization" style={{backgroundColor:'whitesmoke'}}  className="input-popup" placeholder="Add Specialization"/> */}

                                    <div className="container-fluid" style={{maxHeight:120,margin:10, width:'98%',overflowX:'none',overflowY:"auto"}}>
                                        {
                                            specialization.map((data,index)=>{
                                                return(
                                                     <div style={{width:"100%",display:"flex",flexDirection:'row',alignItems:'flex-start'}}>
                                                       
                                                           <div style={{alignSelf:'center',width:'95%',display:'flex',justifyContent:'center',alignItems:"center"}}>
                                                             <input id="specialization" style={{width:'98%'}} onChange={handleSpecialization(index)}   className="input-popup" placeholder={"Add Specialization"} value={specialization[index]}/>
                                                           </div>
                                                        
                                                           <div style={{alignSelf:'center',display:'flex',justifyContent:'center',alignItems:"center",width:'5%'}}>
                                                               <span onClick={RemoveSpecialization(index)} data-index={index} role="button" className="ml-3 material-icons-outlined">
                                                                delete
                                                                </span>
                                                           </div>
                                                        
                                                     </div>
                                                )
                                            })
                                        }
                                    </div>

                            </div>


                            
                        </div>
                            ,
                        <div className="member-exercise-toggle-container">
                                <div role="button" id="main-ex" style={{backgroundColor:"#f5f5f5", color:"#00a2ff", padding:"1.1% 5%", cursor:"pointer"}}><a style={{textDecoration:'none'}} href="#gym-info-container" className="popup-input-a">User Info</a></div>
                                <div style={{padding:"1.1% 5%", color:"#757575"}}>Navigate</div>
                                <div role="button"  id="option-1-ex" style={{padding:"1.1% 3.89%", cursor:"pointer"}}><a className="popup-input-a" style={{textDecoration:'none'}} href="#address-container">Address</a></div>
                                <div role="button"  id="option-1-ex" style={{padding:"1.1% 3.89%", cursor:"pointer"}}><a className="popup-input-a" style={{textDecoration:'none'}} href="#specialization-container">specialization</a></div>
                        </div>
                    
                        ]
                    }


                </div>


                    
        </Dashboard>
    )
}

export default BranchAdmin;