import React, {useEffect, useState} from 'react';
import Dashboard from '../core/Dashboard';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import { getAllActiveGym, getGym,getAllInActiveGym,totalInActiveGym, registerGym, totalActiveGym, updateGym, blockOpGym, gettotalMembers, checkGymStatus } from './helper/api';
import { isAuthenticated } from '../auth';
import {API} from '../backend';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { jsPDF } from "jspdf";
import SwapIcon from "../assets/swap.svg";
import html2canvas from 'html2canvas';
import ArrowDown from '../assets/arrow-down.svg';
import Cross from "../assets/cross.svg";
import _ from 'lodash';
import FilterIcon from "../assets/filter.svg";
import ArrowLeft from "../assets/arrow-left.svg";
import ArrowRight from "../assets/arrow-right.svg";
import BlockIcon from "../assets/block.svg";
import UpdateIcon from "../assets/edit.svg";
import DownloadIcon from "../assets/download.svg";
import ArrowUp from "../assets/arrow-sign.svg";
import { useHistory } from "react-router-dom";


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="right" ref={ref} {...props} timeout={{enter: 300, exit: 400}}/>;
});


const Branch = (props) => {

    // Hooks call for Dashboard Info Switching 
    let interval;
    const history=useHistory();
    const [flag,setflag]=useState(0);
    const [gymId, setGymId] = useState("");
    const [mapAction,setmapAction]=useState(0);//USE TO GET ACTIVE AND INACTIVE GYMLIST
    // Filter Dialog Box
    const [startProgress,setstartProgress]=useState(false);
    const [lowconnection,setlowconnection]=useState(false);
    const [openFilterDialog, setOpenFilterDialog] = useState(null);
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
    // Hooks call for using the same form for create & update & block
    const [switchForm, setSwitchForm] =  useState({
        formName : "",
        formType : 0, //0 -create, 1- update and 2- alert dialog 3 - add member report
        GymId : "",
        formBlock: 0
    });
    const {formName, formType, GymId, formBlock} = switchForm;

    const [statelist,setstatelist]=useState([
            "Amaravati","Itanagar","Itanagar","Patna","Tripura","West Bengal","Maharastra"
    ])

    const [citylist,setcitylist]=useState([
        "Pune",
        "Mumbai",
        "Aurangabad"
    ]);


    const [totalListAttr,settotalListAttr]=useState({
        totalBranch:0,
        totalMembers:0
    })
    const {totalMembers,totalBranch}=totalListAttr;

    //Pagination
    const [page,setpage]=useState(1);
    const [total,settotal]=useState(0);
    const [limit,setlimit]=useState(9);


 
    const pdfGeneration = (gym) => {
        const doc = new jsPDF();
        doc.setFontSize(14);
        doc.text("Invoice for " + gym.gymName + " Gym", 105, 10, null, null, "center", "bold");
        doc.save(gym.gymName + "-invoice.pdf");
    }




    const prev=()=>{
		if(currentpage<=page&&currentpage!=1){
			mapAction==0?getActiveGyms(currentpage-1):getInActiveGyms(currentpage-1);
		 	setcurrentpage(currentpage-1);
	    }
	};
	const next=()=>{
		if(currentpage<page){
		   mapAction==1?getActiveGyms(currentpage+1):getInActiveGyms(currentpage+1);	
		   setcurrentpage(currentpage+1);
		}
	};

    const [currentpage,setcurrentpage]=useState(1);


    const TotalActivePages = () => {
        totalActiveGym(user._id, token,limit).then(data => {
            if(data.error){
                console.log("Error in Loading")
            }else{
                setpage(data.page);
                settotal(data.total);
                setOpenFilterDialog(null)
            }
        }).catch(err=>{
            console.log(err);
        });
    }

    const TotalInactivePages=()=>{
        totalInActiveGym(user._id,token,limit).then(data=>{
            if(data.error){
                console.log("Error something went wrong please try again");
            }else{
                setpage(data.page);
                settotal(data.total);
                setOpenFilterDialog(null)

            }
        }).catch(err=>{
            console.log(err);
        });
    }


    const toggleGymAction = (gymId) => () => {
        if(document.getElementById("action-" + gymId).style.display == "none"){
          document.getElementById("action-" + gymId).style.display = "block";
    
          setTimeout(() => {
            window.addEventListener("click", closeAllPopup);
          }, 10);
    
        }else{
          document.getElementById("action-" + gymId).style.display = "none";
        }
        setGymId(gymId);
        function closeAllPopup(){
          document.getElementById("action-" + gymId).style.display = "none";
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
    if(document.getElementById("sortstate-list").style.display == "none"){
        document.getElementById("sortstate-list").style.display = "block";
        document.getElementById("select-sortstate-icon").style.transform = "rotate(-180deg)"
    }else{
        document.getElementById("sortstate-list").style.display = "none";
        document.getElementById("select-sortstate-icon").style.transform = "rotate(0deg)"
    }
  }

  const toggleCityLst = () => {
    if(document.getElementById("sortcity-list").style.display == "none"){
        document.getElementById("sortcity-list").style.display = "block";
        document.getElementById("select-sortcity-icon").style.transform = "rotate(-180deg)"
    }else{
        document.getElementById("sortcity-list").style.display = "none";
        document.getElementById("select-sortcity-icon").style.transform = "rotate(0deg)"
    }
  }


  const toggleLocationLst = () => {
    if(document.getElementById("sortlocation-list").style.display == "none"){
        document.getElementById("sortlocation-list").style.display = "block";
        document.getElementById("select-sortlocation-icon").style.transform = "rotate(-180deg)"
    }else{
        document.getElementById("sortlocation-list").style.display = "none";
        document.getElementById("select-sortlocation-icon").style.transform = "rotate(0deg)"
    }
  }

  let  closeAllPopup_2;
  const toggleGlobalActionContainer = e => {
    closeAllPopup_2=()=>{
     
       if(document.getElementById("global-action-container")) document.getElementById("global-action-container").style.display = "none";
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

    

    //Get All Gym's
    const [Gyms,setGyms]=useState([]);

    const getActiveGyms=currentpage=>{
        getAllActiveGym(user._id,token,currentpage,limit).then(data=>{
            if(data.error){
               console.log(data.error);
            }else{
                setGyms(data);
                TotalActivePages();
            }
            
        }).catch(err=>{
            console.log(err);
        }); 
    }

    const getInActiveGyms=currentpage=>{
        getAllInActiveGym(user._id,token,currentpage,limit).then(data=>{
            if(data.error){
               console.log(data.error);
            }else{
                setGyms(data);
                TotalInactivePages();
            }
            
        }).catch(err=>{
            console.log(err);
        }); 
    }

    // Hooks call to Open Register, Update & Block Gym Dialog Form
    const [open, setOpen] = useState(false);

    const handleCreateOpen = () => {
        setSwitchForm({
            ...switchForm,
            formName: "Create Gym",
            formType: 0,
            formBlock: 0
        })
        setRegGym({...regGym,
            gymName: "",
            email: "",
            phone: "",
            address: "",
            location: "",
            city: "",
            gymtype:0,
            state: "",
            pincode: "",
            photo: "",
            ownerFirstname:"",
            ownerLastname:"",
            ownerphone:"",
            ownerEmail: "",
            managerEmail:"",
            managerPhone:"",
            managerLastname:"",
            managerFirstname:""
        });
        setOpen(true);
    };

    const handleUpdateOpen=gym=>event=>{
        event.preventDefault()
        setSwitchForm({
            ...switchForm,
            formName: "Update Gym",
            formType: 1,
            GymId : gym._id,
            formBlock: 0
        });

        getGym(user._id,token,gym._id).then(data=>{
            if(data.error){
              console.log(data.error)
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
                fetch(`${API}/photo-gym/${gym._id}`).then(data=>data.arrayBuffer()).then(data=>{
                    if(data.byteLength!=35){
                        if(document.getElementById("image-profile-pic")) document.getElementById("image-profile-pic").src=``;
                        if(document.getElementById("image-profile-pic")) document.getElementById("image-profile-pic").src=`${API}/photo-gym/${gym._id}?${new Date().getTime()}`;
                    }else{
                        throw "image not found"
                    }
                  
                }).catch(err=>{
                    if(document.getElementById("image-profile-pic"))  document.getElementById("image-profile-pic").src=`https://img.icons8.com/ios/50/000000/camera--v1.png?${new Date().getTime()}`;
                });
  
                
            }
          })
        setOpen(true);
    };

    const handleBlockOpen = gym => {
        setSwitchForm({
            ...switchForm,
            formName: "Do you really want to inactive this Gym ?",
            formType: 2,
            GymId : gym._id,
            formBlock: 1
        });
        setactive(false);
        getGym(user._id,token,gym._id).then(data=>{
            if(data.error){
              console.log("error in DB")
            }else{
                setRegGym({...regGym,
                    gymName: data.gymName,
                    gymtype:0,
                    email: data.email,
                    phone: data.phone,
                    photo: data.photo
                });
            }
        })
        setOpen(true);
    }


    const handleUnblockOpen = gym => {
        setSwitchForm({
            ...switchForm,
            formName: "Do you really want to active this Gym ?",
            formType: 2,
            GymId : gym._id,
            formBlock: 1
        })
        setactive(true)
        getGym(user._id,token,gym._id).then(data=>{
            if(data.error){
              console.log("error in DB")
            }else{
                setRegGym({...regGym,
                    gymName: data.gymName,
                    email: data.email,
                    phone: data.phone,
                    photo: data.photo
                });
            }
        })
        setOpen(true);
    }


    const handleClose = () => {
        setOpen(false);
    };

    // User Authentication
    const {user,token} = isAuthenticated();


    // Post Request to Create Gym Account
    const onCreate =  event => {
        event.preventDefault();
       // if(checkInputField()){
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
          
            setRegGym({...regGym, error:"", success:false});
            registerGym(user._id, token, formData).then(data=>{
              if(data.error){
                setRegGym({...regGym, error:data.error, success:false});
              }else{
                setRegGym({...regGym,
                  gymName: "",
                  email: "",
                  phone: "",
                  gymtype:0,
                  photo: "",
                  error: false,
                  success:true
                });
                setOpen(false);
                getActiveGyms(currentpage);
              }
            }).catch(()=>console.log("Error in DB"));
        //}

    };

    //checks input field empty or not
    const checkInputField=()=>{
        let validField=true;
        if(gymName=="") document.querySelector(`#gymName`).style.border="1px dashed red";
        if(email=="") document.querySelector(`#email`).style.border="1px dashed red";
        if(phone=="") document.querySelector(`#phone`).style.border="1px dashed red";
        if(address=="") document.querySelector(`#address`).style.border="1px dashed red";
        if(ownerFirstname=="") document.querySelector(`#ownerFirstname`).style.border="1px dashed red";
        if(ownerLastname=="") document.querySelector(`#ownerLastname`).style.border="1px dashed red";
        if(ownerEmail=="") document.querySelector(`#ownerEmail`).style.border="1px dashed red";
        if(ownerphone=="") document.querySelector(`#ownerphone`).style.border="1px dashed red";
        if(gymName==""||email==""||phone==""||address==""||ownerFirstname==""||ownerLastname==""||ownerEmail==""||ownerphone=="") validField=false;

        return validField;
    }

    // Put request to Update Gym
    const onUpdate=event=>{
        event.preventDefault();
      //  if(checkInputField()){
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
        updateGym(user._id,token,gymId,formData).then(data=>{
          if(data.error){
            console.log(data.error)
          }else{
            setRegGym({...regGym,
                gymName: "",
                email: "",
                phone: "",
                gymtype:0,
                photo: "",
                error: false,
                success:true
              });
              setOpen(false);
              getActiveGyms(currentpage);
          }
          
        });
  //  }
      }

    // Handle Request to accept Gym Information from input fields
    const handleRegisterGym = name => event => {
        const value = name === "photo" ? event.target.files[0] : event.target.value;
        if(name=="photo") document.getElementById("image-profile-pic").src=  URL.createObjectURL(event.target.files[0]);
        formData.set(name, value);
        setRegGym({...regGym,  [name]: event.target.value});
    }

    //Block Gym
    const [active,setactive]=useState(false);

    const BlockThisGym = () =>{
        blockOpGym(user._id,token,gymId, {active}).then(data=>{
          if(data.error){
            console.log("Error in Db");
          }else{
            setactive(active?false:true);
            setOpen(false);
            active?getInActiveGyms(currentpage):getActiveGyms(currentpage);
            //window.location.reload();
          }
        })
    } 

   
    const vlidateField=(name,value)=>{
        if(name=="email"){
            const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(value).toLowerCase());
        }
        if(name=="ownerEmail"){
            const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(value).toLowerCase());
        }
        if(name=="phone"){
            return  value.length&&value.match(/\d/g).length==10;
        }
        if(name=="ownerphone"){
            return  value.length&&value.match(/\d/g).length==10;
        }
        if(name=="gymName"){
            return value.length>1&&value.length<=30
        }
        if(name=="address"){
            return value.length>1&&value.length<=140;
        }
        if(name=="location"){
            return value.length>1&&value.length<=100;
        }
        if(name=="city"){
            return value.length>1&&value.length<=30
        }
        if(name=="pincode"){
            return  value.length&&value.match(/\d/g).length==6;
        }
        if(name=="ownerFirstname"){
            return value.length>1&&value.length<=30
        }
        if(name=="ownerLastname"){
            return value.length>1&&value.length<=30
        }
        
    }
    
      const OnBlurFieldChecker=name=>()=>{
        // let checker=vlidateField(name,regGym[name]);
        // checkGymStatus(user._id,token,{field:name,value:regGym[name]}).then(data=>{
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

      const ongymSelect=gym=>event=>{
        event.preventDefault();
        setstartProgress(true);
        setflag(1); 
        setGymId(gym._id);
        getGym(user._id,token,gym._id).then(data=>{
            if(data.error){
                console.log("something went wrong")
            }else{
             
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
              gettotalMembers(user._id,token,gym._id).then(data=>{
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

      

     

    


      const handleActiveInactiveGym = event => {
        if(document.getElementById("switch-gym").textContent == "Active"){
            document.getElementById("switch-gym").textContent = "Inactive";
            setmapAction(1);
            setflag(0);
            setGymId("");
            getInActiveGyms(currentpage); 
        }else{
            document.getElementById("switch-gym").textContent = "Active";
            setmapAction(0);
            setflag(0);
            setGymId("");
            getActiveGyms(currentpage);
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
    }


    const handleDropdownItem=(name,value)=>event=>{
        event.preventDefault();
        setRegGym({...regGym,[name]:value});
        formData.set(name,value);
        document.getElementById(name+"-list").style.display="none";
        document.getElementById(name+"-list-icon").style.transform='rotate(-180deg)';

    }

    const [skip,setskip]=useState(0);


    const handleScroll=event=>{
        const { offsetHeight, scrollTop, scrollHeight} = event.target;

        if (offsetHeight + scrollTop === scrollHeight) {
           setskip(Gyms.length);
           getActiveGyms(Gyms.length);
        }
    }

    


    const NavigateToRoute=(route)=>event=>{
        event.preventDefault()
        if(closeAllPopup_2) window.removeEventListener('click',closeAllPopup_2);
        switch(route){
            case "Branch":
                history.push({
                  pathname: `/admin/branch`,
                  state:{action:'create',gymId:""}
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
            case "MemberReport":
                // window.removeEventListener('click',closeAllPopup_2);
                // history.push({
                //     pathname:`/member-report`,
                //     state:{
                //         branchId:"",
                //         action:"create"
                //     }
                // });
                alert("hello not ready yet")
                
             
            break;
            case "Planner":
                history.push({
                    pathname:`/manage/planner`,
                    state:{
                        accountId:"",
                        account_name:"InstaAdmin",
                        action:"create"
                    }
               })
            break;
            case "BranchUser":
               history.push({
                    pathname:`/branch/admin/users`,
                    state:{
                        branchId:"",
                        action:"create"
                    }
               })
            break;
            case  "Content":
            
                history.push({
                    pathname:`/contents`,
                    state:{
                        gymId:"",
                        action:"create"
                    }
                })
            break;
            default:
              
                alert("hi")
            break;
        }
        event.preventDefault()
    }
 


    
    useEffect(()=>{
        if(props.location.state&&props.location.state.action=="create")  setOpen(true);
        setmapAction(0);
        setflag(0);
        setGymId("");
        getActiveGyms(currentpage);
        
    },[])
    


    return(
        <Dashboard  flag={flag} data={{
            state:"none",
            totalMembers,
            totalBranch,
            optional_phone:display_optional_phone,
            gymName:display_gymName,
            email:display_email,
            phone:display_phone,
            optional_email:display_optional_email,
            address:display_adress,
            city:display_city,
            location:display_location,
            state:display_state,
            pincode:display_pincode,
            ownerFirstname:display_ownerFirstName,
            ownerLastname:display_ownerLastName,
            ownerEmail:display_ownerEmail,
            ownerphone:display_ownerphone,
            managerEmail:display_managerEmail,
            managerPhone:display_managerPhone,
            managerFirstname:display_managerFirstname,
            managerLastname:display_managerLastname,
            startProgress:startProgress,
            lowconnection:lowconnection,
            
        }} navItemData={"Gym"} itemId={gymId}>

        <div className="header-bar">
                        <div>
                            <div className="dashboard-name-container">
                                <div className="dashboard-name">Gym Accounts</div>
                            
                                <span onClick={toggleGlobalActionContainer} class="material-icons-round" style={{color:"#bdbdbd", margin:"-0.8% 0 0 8%", cursor:"pointer"}}>add_circle_outline</span>
                                <div id="global-action-container" className="add-global-action-container" style={{display:"none"}}>
                                <div role="button" onClick={handleCreateOpen} className="action-item d-flex">
                                    <span class="material-icons-round flex-item">fitness_center</span>
                                    <div className="flex-item spacing-19">Add Gym</div>
                                </div>
                                <div role="button" onClick={NavigateToRoute("Branch")} className="action-item d-flex">
                                    <span class="material-icons-round flex-item">store</span>
                                    <div className="flex-item spacing-19">Add Branch</div>
                                </div>
                                <div role="button" onClick={NavigateToRoute("Member")}  className="action-item d-flex">
                                    <span class="material-icons-round flex-item">person_add_alt</span>
                                    <div className="flex-item spacing-19">Add Member</div>
                                </div>
                                <div role="button" onClick={NavigateToRoute("MemberReport")} className="action-item d-flex">
                                    <span class="material-icons-round flex-item">playlist_add</span>
                                    <div className="flex-item spacing-19">Add Member Report</div>
                                </div>
                                <div role="button" onClick={NavigateToRoute("BranchUser")} className="action-item d-flex">
                                    <span class="material-icons-round flex-item">group_add</span>
                                    <div className="flex-item spacing-19">Add User</div>
                                </div>
                                <div role="button" onClick={NavigateToRoute('Content')} className="action-item d-flex">
                                    <span class="material-icons-round flex-item">post_add</span>
                                    <div className="flex-item spacing-19">Add Content</div>
                                </div>
                                <div role="button" onClick={NavigateToRoute("Planner")} className="action-item d-flex">
                                    <span class="material-icons-round flex-item">addchart</span>
                                    <div className="flex-item spacing-19">Create Planner</div>
                                </div>
                                <div className="action-item d-flex">
                                    <span class="material-icons-round flex-item">insert_chart</span>
                                    <div className="flex-item spacing-19">Assign Planner</div>
                                </div>

                            </div>

                            </div>
                            <div onClick={handleActiveInactiveGym} className="active-inactive-container">
                                <img src={SwapIcon} className="active-inactive-icon"/>
                                <div id="switch-gym" className="active-inactive-text">Active</div>
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
                                        id="select-sortstate-icon"
                                        src={ArrowUp}
                                        className="select-exercise-icon"
                                    />
                                    </div>
                                    <div id="sortstate-list" className="dropdown-menu-items" style={{display: "none"}}>
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
                                    id="sortcity-Exercise"
                                    type="text"
                                    className="d-flex select-dropdown"
                                    >
                                    <div className="select-exercise-text">Select City</div>
                                    <img
                                        id="select-sortcity-icon"
                                        src={ArrowUp}
                                        className="select-exercise-icon"
                                    />
                                    </div>
                                    <div id="sortcity-list" className="dropdown-menu-items" style={{display: "none"}}>
                                        <div className="menu-text-spacing">Andhra Pradesh</div>
                                    <div className="menu-text-spacing">Aurnachal Pradesh</div>
                                    </div>
                                </div>
                                  <div className="container-spacing">
                                    <span className="g-font-1 inactive">Location</span>
                                    <div onClick={toggleLocationLst}
                                    id="sortlocation-Exercise"
                                    type="text"
                                    className="d-flex select-dropdown"
                                    >
                                    <div className="select-exercise-text">Select Location</div>
                                    <imgt
                                        id="select-sortlocation-icon"
                                        src={ArrowUp}
                                        className="select-exercise-icon"
                                    />
                                    </div>
                                    <div id="sortlocation-list" className="dropdown-menu-items" style={{display: "none"}}>
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




        {/* Get All Gym List*/}
        <table  className="body-container">
          <thead>
            <tr>
              <th style={{textAlign:"left", padding :"0 0 0 4.7%", width: "20%"}}>Gym Name</th>
              <th>City</th>
              <th>Location</th>
              <th>Email Address</th>
              <th>Contact No.</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {Gyms.map((gym) => {
              return (
                <tr onClick={ongymSelect(gym)} style={{ backgroundColor:gymId == gym._id?"rgb(0, 0, 0, 0.08)":"#ffffff", boxShadow:gymId == gym._id?"none":"0px 0.01px 3px 3px rgb(0, 0, 0, 0.05)"}}>
                  <td style={{textAlign:"left", padding :"0 0 0 1.4%", width: "20%", fontWeight : "bold"}}>
                    <div className="d-flex">
                      <span class="material-icons-round action-icon" style={{ color:gymId == gym._id?"#0077ff":"#cacaca"}}>check_circle</span>
                      <div style={{padding :"2% 0 0 2%"}}>{gym.gymName}</div>
                    </div>
                  </td>
                  <td >{gym.city}</td>
                  <td>{gym.location}</td>
                  <td>{gym.email}</td>
                  <td >{gym.phone}</td>
                  <td>
                    <div className="d-flex" style={{padding :"0 0 0 12%"}}>
                      <span class={`material-icons-round action-icon ${gym.active?`active`:`inactive`}`}>circle</span>
                      <div style={{padding :"2.2% 0 0 2%"}} className={gym.active?`active`:`inactive`}>{gym.active?`Active`:`Inactive`}</div>
                    </div>
                  </td>
                  <td>
                    <span onClick={toggleGymAction(gym._id)} class="material-icons-outlined edit-icon">more_horiz</span>
                    <div id={"action-" + gym._id} className="table-action-container" style={{display:"none"}}>
                      <div role="button" onClick={handleUpdateOpen(gym)} className="d-flex spacing-22">
                        <img src={UpdateIcon} className="body-content-two-action-icon" />
                        <div className="spacing-24">Update</div>
                      </div>
                      <div style={{margin:"2% 0", width:"100%", height:"1px", backgroundColor:"#f5f5f5"}}></div>
                      <div role="button" onClick={()=>gym.active?handleBlockOpen(gym):handleUnblockOpen(gym)} className="d-flex spacing-22">
                        <img src={BlockIcon} className="body-content-two-action-icon" />
                        <div className="spacing-24">{gym.active?`Block`:`Unblock`}</div>
                      </div>

                    </div>
                  </td>
                </tr>
              );
            })}

          </tbody>
        </table>




        {/* popup section code */}    
        <div  className={`content-add-section ${formType==2?`content-add-section-rs-size`:'content-add-section-bg-size'}`} style={{display:open?"block":"none"}}>
            <div className="exerise-header-bar">
                <div style={{display:"flex", alignSelf:"center"}} >
                    <div className="exercise-header-text" style={{marginRight:"6%", alignSelf:"center", whiteSpace:"nowrap"}}>{formName}</div>
                    {
                        formType==0?(
                            <span role="button" onClick={onCreate}  class="material-icons-outlined" style={{fontSize:"1.8vw", alignSelf:"center", color:"#e0e0e0"}}>add_circle_outline</span>
                        ):formType==1?(
                            <span role="button" onClick={onUpdate}  class="material-icons-outlined" style={{fontSize:"1.8vw", alignSelf:"center", color:"#e0e0e0"}}>update</span>
                        ):(null)
                    }
                </div>
                
                <img  src={Cross} role="button" onClick={handleClose} className="exercise-header-close"/>
            </div>
            

            {
                formType==2?[
                    <div className="ml-5 mt-4 mr-5 mb-4">
                         <p className="pt-2" style={{fontWeight: "bold"}}>Important Note:
                            <p style={{fontWeight:"lighter", color:"#757575"}}>Branch's & member's under this gym will  <br/>  not be able to access their profile.</p></p>
                          
                            <div className="row mt-2" style={{justifyContent: "flex-end"}}>
                                <button onClick={BlockThisGym} className="mt-1 mr-3 shadow-sm popup-button">
                                    <p className="pt-1" style={{color: "#000"}}>Yes</p>
                                </button>
                                <button onClick={handleClose} className="mt-1 shadow-sm popup-button">
                                    <p  className="pt-1" style={{color: "#000"}}>No</p>
                                </button>
                            </div>
                    </div>
                ]:[

                    <div style={{transition:'0.5s'}} className="exercise-body-container">

                    


                    <div id="gym-info-container" className="popcontainer-wrapper">
                    
                        <div className="image-profile">
                                <img id="image-profile-pic" src="https://img.icons8.com/ios/50/000000/camera--v1.png" className="image-popup"/>
                                <input type="file" name="file" id="file" accept="image/*" onChange={handleRegisterGym("photo")} value={photo} className="image-input-field"/> 
                        </div>


                        {/* <img src="https://img.icons8.com/ios/50/000000/camera--v1.png" className="image-profile"/> */}
                        {/* <input  className="image-input-field" type="file" />  */}

                        

                        

                        <input onChange={_.debounce(OnBlurFieldChecker("gymName"),300)} id="gymName" onInput={handleRegisterGym("gymName")} value={gymName} className="input-popup" placeholder="Gym Name"/>
                        <div className="popcontainer-sub-wrapper">
                            <input type="number" onChange={_.debounce(OnBlurFieldChecker("phone"),300)} id="phone"  onInput={handleRegisterGym("phone")} value={phone} style={{marginRight:5}} className="input-popup input-popup-space" placeholder="Phone"/>
                            <input onChange={_.debounce(OnBlurFieldChecker("email"),300)} id="email" onInput={handleRegisterGym("email")} value={email}  className="input-popup input-popup-space" placeholder="Email" />
                        </div>
                        <div className="popcontainer-sub-wrapper">
                            <input onChange={_.debounce(OnBlurFieldChecker("optional_email"),300)} id="optional_email" onInput={handleRegisterGym("optional_email")} style={{width:'49%',marginTop:-2}} value={optional_email}  className="input-popup input-popup-space" placeholder="Optional Email" />
                        </div>
                        <div className="popup-checkbox-wrapper">
                            <p className="popup-gym-type-text">Gym Type</p>
                            <div className="row">
                                
                            <div className="col-6">
                                <label className="input-popup p-2" style={{width:'100%'}} for="op1">
                                    <input onChange={handleRegisterGym("gymtype")} value={0} id="op1" name="gymtype" checked type="radio"/>
                                    <span className="ml-2">Comercial</span>
                                </label>
                            </div>
                            <div className="col-6">
                                <label className="input-popup p-2"  style={{width:'100%'}} for="op2">
                                    <input onChange={handleRegisterGym("gymtype")} value={1} id="op2" name="gymtype" type="radio"/>
                                    <span className="ml-2">Corporate</span>
                                </label>
                            </div>
                            <div className="col-6 mt-2">
                                <label className="input-popup p-2" style={{width:'100%'}} for="op3">
                                    <input onChange={handleRegisterGym("gymtype")} value={2} id="op3" name="gymtype" type="radio"/>
                                    <span className="ml-2">Residential</span>
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
                                        <input type="number" onChange={_.debounce(OnBlurFieldChecker("pincode"),300)} id="pincode" onInput={handleRegisterGym("pincode")} value={pincode}   style={{width:'100%'}}  className="input-popup" placeholder="Pincode"/>  
                                    </div>
                                    
                                    
                                </div>
                                <textarea  onChange={_.debounce(OnBlurFieldChecker("address"),300)} id="address" onInput={handleRegisterGym("address")} value={address} className="input-popup input-message-box" placeholder="address"/>
                                
                    

                        </div>


                    <div id="owner-info-container" className="popcontainer-wrapper">
                         
                        <div className="popcontainer-sub-wrapper">
                            <div className="input-popup-space">
                                <div className="popup-header-one">Manager Info</div>
                            </div>
                        </div>

                        <div className="popcontainer-sub-wrapper">
                            <input onChange={_.debounce(OnBlurFieldChecker("managerFirstname"),300)} onInput={handleRegisterGym("managerFirstname")} id="managerFirstname" value={managerFirstname} style={{marginRight:5}} className="input-popup input-popup-space" placeholder="First Name"/>
                            <input onChange={_.debounce(OnBlurFieldChecker("managerLastname"),300)} onInput={handleRegisterGym("managerLastname")} id="managerLastname" value={managerLastname}  className="input-popup input-popup-space" placeholder="Last Name" />
                        </div>
                        <div className="popcontainer-sub-wrapper">
                            <input type="number" onChange={_.debounce(OnBlurFieldChecker("managerPhone"),300)} onInput={handleRegisterGym("managerPhone")} id="managerPhone" value={managerPhone} style={{marginRight:5}} className="input-popup input-popup-space" placeholder="Phone"/>
                            <input  onChange={_.debounce(OnBlurFieldChecker("managerEmail"),300)} onInput={handleRegisterGym("managerEmail")} id="managerEmail" value={managerEmail}  className="input-popup input-popup-space" placeholder="Email" />
                        </div>


                        <div className="popcontainer-sub-wrapper">
                            <div className="input-popup-space">
                                <div className="popup-header-one">Owner Info</div>
                            </div>
                        </div>

                        <div className="popcontainer-sub-wrapper">
                            <input onChange={_.debounce(OnBlurFieldChecker("ownerFirstname"),300)} onInput={handleRegisterGym("ownerFirstname")} id="ownerFirstname" value={ownerFirstname} style={{marginRight:5}} className="input-popup input-popup-space" placeholder="First Name"/>
                            <input onChange={_.debounce(OnBlurFieldChecker("ownerLastname"),300)} onInput={handleRegisterGym("ownerLastname")} id="ownerLastname" value={ownerLastname}  className="input-popup input-popup-space" placeholder="Last Name" />
                        </div>
                        <div className="popcontainer-sub-wrapper">
                            <input type="number" onChange={_.debounce(OnBlurFieldChecker("ownerphone"),300)} onInput={handleRegisterGym("ownerphone")} id="ownerphone" value={ownerphone} style={{marginRight:5}} className="input-popup input-popup-space" placeholder="Phone"/>
                            <input  onChange={_.debounce(OnBlurFieldChecker("ownerEmail"),300)} onInput={handleRegisterGym("ownerEmail")} id="ownerEmail" value={ownerEmail}  className="input-popup input-popup-space" placeholder="Email" />
                        </div>
                    </div>  
            </div>,
            <div className="member-exercise-toggle-container">
                <div role="button" id="main-ex" style={{backgroundColor:"#f5f5f5", color:"#00a2ff", padding:"1.1% 5%", cursor:"pointer"}}><a style={{textDecoration:'none'}} href="#gym-info-container" className="popup-input-a">Gym Info</a></div>
                <div style={{padding:"1.1% 5%", color:"#757575"}}>Navigate</div>
                <div role="button"  id="option-1-ex" style={{padding:"1.1% 3.89%", cursor:"pointer"}}><a className="popup-input-a" style={{textDecoration:'none'}} href="#address-container">Address</a></div>
                <div role="button"  id="option-2-ex" style={{padding:"1.1% 3.89%", cursor:"pointer"}}><a className="popup-input-a" style={{textDecoration:'none'}} href="#owner-info-container">User Info</a></div>
            </div>
            
                ]
            }


        </div>




 
        </Dashboard>
    )
}

export default Branch;