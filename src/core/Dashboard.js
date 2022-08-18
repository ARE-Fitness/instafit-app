import React, {useEffect, useRef, useState} from 'react';
import Logo from '../assets/logo-bg.png'; 
import Bell from '../assets/bell.png';
import Grid from '@material-ui/core/Grid/Grid';
import Link from 'react-router-dom/Link';
import { getGym } from '../gym/helper/api';
import Slide from '@material-ui/core/Slide';
import { isAuthenticated } from '../auth';
import {updateMember,assignPlannerToMember} from '../member/helper/api';
import {getPlanner,getAllPlanner} from '../components/helper/api';
import {API} from '../backend';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { useHistory } from "react-router-dom";
import Dialog from '@material-ui/core/Dialog';
import Flatpickr from "flatpickr";
import Calender from '../components/calender';
import Signout from './Signout';
import SelectIcon from '../assets/select.png';
import ProgressLoader from '../components/Loader/Loader';
import '../components/Loader/Loader.css'
import ArrowDown from '../assets/arrow-down.svg';
import Cross from "../assets/cross.svg";
import _, { set } from 'lodash';
import FilterIcon from "../assets/filter.svg";
import ArrowLeft from "../assets/arrow-left.svg";
import ArrowRight from "../assets/arrow-right.svg";
import BlockIcon from "../assets/block.svg";
import UpdateIcon from "../assets/edit.svg";
import DownloadIcon from "../assets/download.svg";
import GymLogo from "../assets/sumo.png";
//TODO:Tasks
//1.add calender
//2.check calender backend functions + routes.
//3.show calender info
//4.calender view [add restriction if its empty]
//5.edit assign check + update 


//transition animation method
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const TransitionRight=React.forwardRef(function Transition(props,ref){
    return <Slide direction="right" ref={ref} {...props}/>;
});


const Dashboard = ({
    name = "Instafit Admin",
    flag,
    data,
    itemId,
    navItemData,
    children
    }) => {
        const history=useHistory();
        const {user,token} = isAuthenticated();
        const [openDialog, setOpenDialog] = useState(null);
        const [isActive, setIsActive] = useState("Home");
        const [opendialogform,setopendialog]=useState(false);
        const [dialogformrole,setdialogformrole]=useState(0);//0-planner assign 1-calender 2-notification;
        const [Events,setEvents]=useState([]);
        const [formtitle,setformtitle]=useState("Assign Planner")
        const [Event,setEvent]=useState({
            event_name:"",
            date:""
        });
        const [message,setmessage]=useState({
            message_title:"Youre Offline",
            message_subtitle:"Please Check Your Connection"
        });
        const {message_title,message_subtitle}=message;
        const [plannerProp,setplannerProp]=useState({
            planner_startDate:"",
            planner_name:"",
            planneroffdays:[],
            planner_duration:"",
            exdayslength:0,
            planner_freq:0,
            plannerId:"",
            memberId:""
        });
        const {planner_startDate,planner_name,exdayslength, planner_freq,memberId,planneroffdays,planner_duration,plannerId}=plannerProp;
        const [planners,setplanners]=useState([]); 
        const [offline,setoffline]=useState(false);
        const [trackerValue, setTrackerValue] =  useState("50%");
        const [regGym, setRegGym] = useState({
            gymName: "",
            email: "",
            phone: "",
            photo: "",
            error: "",
            loading: "",
            success: "",
            formData:new FormData(),
        });
        const {gymName, email, phone, photo, error, loading, success, formData} = regGym;

        const getThisGym=(gymId)=>{
              if(gymId){
                getGym(user._id,token,gymId).then(data=>{
                    if(data.error){
                      console.log("error in DB")
                    }else{
                          setRegGym({...regGym,
                              gymName: data.gymName,
                              email: data.email,
                              phone: data.phone
                          });
                    }
                  })
              }
        }

        const handleActiveNavItem =(navdata)=> {
                
                let navItems=["Member","Branch","Gym"];
                navItems.forEach(id=>{
                      
                    let navItemicon=document.getElementById(id+"-icon");
                    let navItemtext=document.getElementById(id+"-txt");
                    if(navdata==id){
                        navItemicon.style.color="#ff9100";
                        navItemtext.style.color="#ff9100";
                    }else{
                        navItemicon.style.color="#818181";
                        navItemtext.style.color="#818181";
                    }
                })

        }

        const handleOpenProfile = () => {
            let profileContainer = document.querySelector(".profile-info-container");
            if(profileContainer.style.display === "block"){
                profileContainer.style.display = "none";
            }
            else{
                profileContainer.style.display = "block";
            }  
        }

        const handleNotificationPopup=()=>{
            let notificationPopup = document.querySelector(".bell-icon-container-info");
            if(notificationPopup.style.display === "block"){
                notificationPopup.style.display = "none";
            }
            else{
                notificationPopup.style.display = "block";
            }  
        }

        const handleOpenMoreItem = () => {
            let moreItem = document.querySelector(".more-items-container");
            if(moreItem.style.display === "block"){
                moreItem.style.display = "none";
            }
            else{
                moreItem.style.display = "block";
            }  
        }


        //set off days
        const GetPlanner=plannerId=>{
            if(plannerId){
                getPlanner(user._id,token,plannerId).then(data=>{
                    if(data.error){
                        throw "Something went wrong please try again"
                    }else{
                        setplannerProp({
                            ...plannerProp,
                            planner_name:data.planner_name,
                            plannerId:data._id
                        })
                    }
                }).catch(err=>{
                    console.log(err);
                })
            }
        }

        const setOffDays=value=>e=>{
            if(e.target.checked){
                planneroffdays.push(value);
            }else{
                let index=planneroffdays.indexOf(value);
                if(index>-1){
                    planneroffdays.splice(index,1);
                }
            }
            setplannerProp({...plannerProp,planneroffdays:planneroffdays});
            console.log(plannerProp);
        };

        const handleChangePlannerProp=name=>e=>{
            if(name=="plannerId"){
                setplannerProp({...plannerProp,plannerId:e.target.value,exdayslength:e.target.dataset.exlength,planner_freq:e.target.dataset.freq});
            }else{
                setplannerProp({...plannerProp,[name]:e.target.value});
            }
        }

        const getPlanners=(branchId)=>{
            getAllPlanner(user._id,token,branchId,8,1).then(data=>{
                if(data.error){
                   throw "Something went wrong please try again"
                }else{
                
                    setplanners(data)
                }
            }).catch(err=>console.log(err));
        }

        const AssignPlannerToMember=plannerId=>event=>{
            event.preventDefault();
            if(planner_freq>(7-planneroffdays.length)||planner_freq<(7-planneroffdays.length)){
                alert(`planner frequency is ${planner_freq}.`);
            }
            if(planner_freq==0){
                alert(`planner frequency is empty.`);
            }
            if(exdayslength==0){
                alert(`please add exercise in the planner before assignig`);
            }
            if((7-planneroffdays.length)==planner_freq&&exdayslength!=0){
                assignPlannerToMember(user._id,token,data.memberId,plannerId,{planner_startDate,planner_duration,planneroffdays}).then(data=>{
                    if(data.error){
                        throw "Something went wrong please try again"
                    }else{
                       alert("The Planner Successfully Sssigned")
                    }
                }).catch(err=>console.log(err))
            }
        }

      

        const handleOpenDialogForm=role=>()=>{
            setopendialog(true);
            setdialogformrole(role);
            if(role==0){
             //   getPlanners(data.branchId);
            }
            if(role==1){
               // GetAllEvents(data.calender);
            }
            if(role==2){

            }
            let titlevalue=role==0?"Assign Planner":"Notifications";
            setformtitle(titlevalue);
        }
        const handleCloseDialogForm=()=>{
            setopendialog(false);
        }

        const handleClick = (event) => {
            setOpenDialog(event.currentTarget);
        };

        const handleClose = () => {
            setOpenDialog(null);
        };


        //functional component 
        const GymImg=id=>{   
            return <img className="profile-image" src={`${API}/photo-gym/${id}`}/>;
        }

        const MemberImg=id=>{
            return <img className="mt-4 ml-5" src={`${API}/get-member-photo/${id}`} style={{width: 120, height: 120, borderRadius: 100}}/>;
        }



        const ForMatEvents=events=>{
            var weekDays=["Sunday","Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            let formatedEvents=[];
            events.forEach(event => {
                console.log(event.date)
                console.log(new Date(event.date).getDay());
                formatedEvents.push({
                        id: event._id,
                        title: event.ex_name,
                        allDay: false,
                        start: new Date(event.date),
                        end: new Date(event.date)
                });
            });
            console.log('done')
            
            return formatedEvents;
        }
       
        const GetAllEvents=calenderId=>{
             fetch(`${API}/get-all-dailyexerciseevent-calender/${user._id}/${calenderId}`,{
                 method:"get",
                 headers:{
                     Accept:"application/json",
                     Authorization:`bearer ${token}`
                 }
             }).then(response=>response.json()).then(data=>{
                 if(data.error){
                     throw "Something went wrong please try again"
                 }else{
                     let events=ForMatEvents(data);
                     setEvents(events)
                 }
             }).catch(err=>{
                 console.log(err);
             })
        }

      
      
        //functional components

        const NotificationDashBoard=()=>{
            function notifyMe(title) {
                var options = {
                    body: "Simply put, cloud computing is the delivery of computing services—including servers, storage, databases, networking, software, analytics, and intelligence",
                    icon: "https://picsum.photos/200/300"
                }
                if (!("Notification" in window)) {
                  alert("This browser does not support desktop notification");
                }
                else if (Notification.permission === "granted") {
                  var notification = new Notification(title,options);
                }
                else if (Notification.permission !== "denied") {
                  Notification.requestPermission().then(function (permission) {
                    if (permission === "granted") {
                      var notification = new Notification(title,options);
                    }
                  });
                }
              }
    
            return (
                <div style={{backgroundColor:'whitesmoke'}}>
                     <p
                     style={{
                         color:"black",
                         margin:10,
                         fontSize:20
                     }}
                     >Notifications</p>
                     <div style={{width:400,margin:10}}>
                          {[0,1,2,3,4,5,6,7,8,9].map((data)=>{
                              return (
                                  <div onClick={()=>notifyMe(`Notification name ${data}`)} style={{backgroundColor:'white',border:'1px dashed black'}} className="m-1 rounded shadow">
                                     <p style={{margin:4}}>Notification name {data}</p>
                                  </div>
                              )
                          })}  
                     </div>
                     &nbsp;
                </div>
            )
        } 

        const AssignPlannerDesignForm=()=>{
            return (

                <div style={{width:600}}>
       
                <div className="position-sticky shadow" style={{display:'flex',width:"100%",background:'#ff5722',justifyContent:'space-between',flexDirection:'row'}}>
                        <p style={{fontSize:18,margin:10,fontWeight:'bolder',color:'black'}}>Planner <input type="search" placeholder="Search..." style={{marginLeft:2,paddingInline:5,color:'black',backgroundColor:'transparent',outline:'none',borderRight:'none',borderTop:'none',borderLeft:'none',borderBottom:"1px solid black",marginRight:2}}/></p>
                        <button onClick={AssignPlannerToMember(plannerId)} className="shadow" style={{margin:10,paddingInlineStart:10,paddingInlineEnd:10,fontWeight:'bolder',backgroundColor:"black",color:"whitesmoke",fontSize:18,borderRadius:4,outline:'none',border:"none"}}>
                            +
                        </button>
                </div>
                
                <div className="row m-2">
                 
                  <div className="col-8" style={{
                        height:300,
                        borderRight:"1px dashed gainsboro",
                        overflowY:'auto'
                    }}>
                        {
                            planners.map((planner)=>{
                                return (
                                    <div className="shadow" style={{ backgroundColor:"white",margin:10, border:'1px solid #E0E0E0', borderRadius:5}}>
                                        <div style={{display:'flex',padding:5,flexDirection:"row"}}>
                                            <input type="radio" onChange={handleChangePlannerProp("plannerId")} data-exlength={planner.exdays.length} data-freq={planner.planner_freq} value={planner._id} name="planner" style={{margin:5,color:'#000'}}></input>
                                            <span role="button" onClick={()=>{
                                                let bol=window.confirm("Opening "+planner.planner_name);
                                                if(bol){
                                                    history.push(`/${data.branchId}/${planner._id}/manage-planner`);
                                                }
                                             }} style={{marginTop:2,textDecoration:'underline',fontSize:16}}>{planner.planner_name}</span>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>

                  
                  <div className="col-4">
                        <input id="startdate"   onMouseDown={()=>{
                            Flatpickr("#startdate",{
                             onChange:()=>{
                                 setplannerProp({...plannerProp,planner_startDate:document.getElementById("startdate").value})
                             }
                            }).open()
                        }} placeholder="Start Date"  style={{margin:5,paddingInline:5,textAlign:'center',border:'1px dashed black',outline:'none',width:150}}/>
                        <input type="number" onChange={handleChangePlannerProp("planner_duration")} value={planner_duration} placeholder="Days [EX-14]" style={{margin:5,paddingInline:5,textAlign:'center',border:'1px dashed black',outline:'none',width:150}}/>
                        <p style={{margin:5,fontSize:14,color:'inherit',fontWeight:'bold'}}>OFF DAYS</p>
                        {
                            ["Sunday","Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(data=>{
                                return (
                                  <div>
                                        &nbsp;
                                      <span style={{color:'inherit',fontSize:16}}><input type="checkbox" onChange={setOffDays(data)} style={{width:15,height:15}} value={data}/> &nbsp; {data}</span>
                                      &nbsp;
                                  </div>
                                )
                            })
                        }
                  </div>
                 
                 </div>

                </div>
        
            )
        }
        
        const DialogForm=()=>{
         
                
                return (
                    <Dialog open={opendialogform} onClose={handleCloseDialogForm} TransitionComponent={Transition}>
                        {
                            dialogformrole==0?(
                                <div>
                                {AssignPlannerDesignForm()}
                                </div>
                            ):dialogformrole==1?(
                                <Calender events={Events}/>
                            ):(
                              <div>
                                    {NotificationDashBoard()}
                              </div>
                            )
                        }
                    </Dialog>
                    )
           
            
        };

    
        const NetWorkStatus=()=>{

            return (
               <Dialog open={offline}>
                    <div className="ml-5 mt-4 mr-5 mb-4">
             
                        <p style={{fontWeight: "bold", fontSize: 17, color :"rgb(255, 81, 0)"}}>{message_title}</p>
                        <p className="pt-2" style={{fontWeight: "bold"}}>
                        <p style={{fontWeight:"lighter", color:"#757575"}}>{message_subtitle}</p></p>
                        
                    </div>
               </Dialog>
            )
        }




        function onChange(selectedDates, dateStr, instance) {
            console.log(selectedDates);
        }


      
        function startLoader(){
            let timer;
           
            if(data.startProgress&&parseInt(document.getElementById("progress-id").getAttribute("data-counter"))<120){
                document.getElementById("progress-id").setAttribute("data-counter",0);
                document.getElementById("progress-id").style.width="0%";
                timer=setInterval(()=>{
                    
                    let counter=parseInt(document.getElementById("progress-id").getAttribute("data-counter"));
                    
                    if(counter<120){ 
                        counter++;
                        document.getElementById("progress-id").setAttribute("data-counter",counter);
                        document.getElementById("progress-id").style.width=counter+"%";
                    }
                    else{
                        
                    
                        clearInterval(timer);
                        setTimeout(()=>{
                            document.getElementById("progress-id").setAttribute("data-counter",0);
                            document.getElementById("progress-id").style.width="0%";
                            setTimeout(()=>{
                               if(document.getElementById("progress-id").getAttribute("data-off")=="no") startLoader()
                            },300)
                          
                        },700)
                    }
                    
                },100);
             }
                 
              
        }


        const InterNetStatusChecker=()=>{

            window.addEventListener('online',()=>{
                setoffline(false);
            });

            window.addEventListener('offline',()=>{
                setoffline(true);
                setmessage({
                    ...message,
                    message_title:"You are offline",
                    message_subtitle:"Please check your connection"
                })
            });
        }


        const PopupForms=()=>{
            return (
                <div  className={`content-add-section ${dialogformrole==0?`planner-assign-section`:dialogformrole==2?`content-add-section-30-width`:`content-add-section-rs-size`}`} style={{display:opendialogform?"block":"none",paddingBottom:'3%'}}>
                   {
                     (dialogformrole==0||dialogformrole==2)?(
                       <div className="exerise-header-bar">
                            <div style={{display:"flex", alignSelf:"center"}} >
                        
                               <div className="exercise-header-text" style={{marginRight:"6%", alignSelf:"center", whiteSpace:"nowrap"}}>{formtitle}</div>

                            </div>
                            
                            <img  src={Cross} role="button" onClick={handleCloseDialogForm} className="exercise-header-close"/>
                        </div>
                     ):(null)
                   }
                    

                    {
                        dialogformrole==3?[
                            <div className="ml-5 mt-4 mr-5 mb-4">
                                <p className="pt-2" style={{fontWeight: "bold"}}>Important Note:
                                    <p style={{fontWeight:"lighter", color:"#757575"}}>Member's will not be able to access their profile and functions.</p></p>
                                
                                    <div className="row mt-2" style={{justifyContent: "flex-end"}}>
                                        <button className="mt-1 mr-3 shadow-sm popup-button">
                                            <p className="pt-1" style={{color: "#000"}}>Yes</p>
                                        </button>
                                        <button className="mt-1 shadow-sm popup-button">
                                            <p  className="pt-1" style={{color: "#000"}}>No</p>
                                        </button>
                                    </div>
                            </div>
                        ]:dialogformrole==2?[
                            <div style={{transition:'0.5s',overflowY:'hidden',margin:'1% auto', height:'85%'}} className="exercise-body-container">
                                    <div style={{overflowY:'auto',overflowX:'none',height:"100%"}}>
                                    {
                                                [1,2,3,4,54,5,6,7,8,8,8,8,8,9,9].map((gym)=>{
                                                    //onClick={selectGym(gym._id,gym.gymName,gym.email,gym.phone)}
                                                    return(
                                                    
                                                        <div style={{cursor:'pointer',display:'flex',alignItems:'flex-start',flexDirection:'row'}}   className="mt-1 mr-3 ml-3 card-item-wrapper">
                                                            <div style={{alignSelf:'center'}}>
                                                            <span style={{color:'#00a2ff'}} class="material-icons-outlined">
                                                                notifications
                                                                </span>
                                                            </div>
                                                            <div style={{alignSelf:'center'}}>
                                                                <div>Notification</div>
                                                            </div>
                                                            {/* <div className="m-1" style={{ borderRadius: 100, width: 25, height: 25}} >
                                                                <span style={{color:'#00a2ff'}} class="material-icons-outlined">
                                                                notifications
                                                                </span>
                                                            </div>
                                                            <p className="m-1" style={{fontSize: 15}}>Notification name<br/><span>Hello</span></p> */}
                                                        </div>
                                                    
                                                    
                                                    )
                                                })
                                        }
                                    </div>
                                </div>
                           
                        ]:[

                            <div style={{transition:'0.5s',marginBottom:"3%"}} className="exercise-body-container">

                            


                            <div id="member-info-container"  className="popcontainer-wrapper">
                            
                              
                               
                               <div style={{overflow:"hidden"}} className="row m-1 w-90">

                                   <div  className="col-6">

                                       
                                   {/* <div role="button" style={{border:'none',marginLeft:'0'}} className="popup-button-wrapper">
                                            
                                        <div className="popup-wrapper-item">
                                        <img className="popup-wrapper-item-img"  src={`${API}/photo-gym/${data.gymId}`}/>
                                        </div>
                                        <div style={{marginLeft:'-2%'}} className="popup-wrapper-item">
                                            <div style={{fontWeight:400,marginBottom:"-2%",fontSize:'0.8vw'}} className="popup-wrapper-item-text">Selected Member</div>
                                            <div className="popup-wrapper-item-text">Debajyoti Debnath</div>
                                        </div>
                                            
                                    </div>  */}

                                    <div className="selected-popop-item__wrapper">
                                           <div>
                                               <div>Select Member</div>
                                           </div>
                                           <div style={{height:'12vw'}}  className="mt-1">
                                               {
                                                   ["Debajyoti Debnath","Debajyoti Debnath","Debajyoti Debnath","Debajyoti Debnath","Anik Roy","Raju Deb","Isha Saha","Barsha Das"].map(data=>{
                                                       return(
                                                        <div  >
                                                            <label>{data}</label>
                                                        </div>
                                                       )
                                                   })
                                               }
                                           </div>
                                       </div>
                                      
                                      {/* <div className="mt-2 mb-2 popup-title-userinfo">
                                         <img  className="d-block img-fluid"  src={`${API}/photo-gym/${data.gymId}`}/> 
                                         <div>Debajyoti Debnath</div>
                                      </div> */}
                                       <input   onMouseDown={()=>{
                                        Flatpickr("#planner_startDate",{
                                            onChange:()=>{
                                                setplannerProp(oldstate=>{
                                                    oldstate['planner_startDate']=document.getElementById("date").value
                                                    return ({...oldstate});
                                                })
                                            }
                                        }).open()
                                        }} id="planner_startDate" value={planner_startDate} style={{margin:'15% 1% -6% 1%', width:'100%'}} className="input-popup input-popup-space" placeholder="Start Date"/>
                                     
                                      <div className="week-days-select" style={{marginTop:'15%'}}>
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
                                      
                                   </div>
                                   <div  className="col-6">
                                    <div className="workout-freq mt-1 mb-4">
                                          <div className="planner-assign-text-header">Weekly Workout Frequency</div>
                                          <div className="mt-3 sliderrange-wrapper">
                                            <div style={{alignSelf:'center'}} class="slidecontainer">
                                                <input type="range" class="slider" id="myRange"></input>
                                            </div>
                                            <div style={{alignSelf:'center'}}>
                                                30
                                            </div>
                                          </div>
                                      </div>
                                       <div className="selected-popop-item__wrapper">
                                           <div>
                                               <div>Select Level</div>
                                           </div>
                                           <div className="mt-1">
                                               {
                                                   ["Beginner","Intermediate","Advanced"].map(data=>{
                                                       return(
                                                        <div  >
                                                            <label>{data}</label>
                                                        </div>
                                                       )
                                                   })
                                               }
                                           </div>
                                       </div>

                                       <div className="selected-popop-item__wrapper mt-3">
                                           <div>
                                               <div>Select Planner</div>
                                           </div>
                                           <div  className="mt-1">
                                               {
                                                   ["Beginner Level 1","Beginner Level 2","Advanced Level 1","Intermediate Level 1"].map(data=>{
                                                       return(
                                                        <div  >
                                                            <label>{data}</label>
                                                        </div>
                                                       )
                                                   })
                                               }
                                           </div>
                                       </div>
                                   </div>

                               </div>
                               
                        
                                <div style={{position:'absolute',bottom:"-1%"}} className="register-button">
                                  <div>Assign</div>
                                </div>
                            


                            </div>
                                


                            
                        </div>,

                  
                    
                        ]
                    }

                    <div className="popupdivider-hr" style={{marginTop:"-1%"}}>
                    </div>

                </div>


            )
        }



      


     
        useEffect(()=>{
            if(flag==3){
              GetPlanner(data.planner);
            }
            setTimeout(()=>{
                let timer=setInterval(()=>{
                   if(navItemData){
                        clearInterval(timer);
                        handleActiveNavItem(navItemData)//for nav item
                   }
                },10)
            },0)
          

            let connection = window.navigator.connection || window.navigator.mozConnection || window.navigator.webkitConnection;
            let type;
            if (connection) {
                    type = connection.effectiveType;
                    if (parseFloat(connection.downlink) <= 0.6) {
                        setoffline(true);
                        setmessage({
                            ...message,
                            message_title:"Poor connection",
                            message_subtitle:"Internet is to low"
                        })
                    } else {
                        setoffline(false);
                        console.log(connection.downlink);
                    }
            } 
            function updateConnectionStatus() { 
                let type;
                console.log("Connection type changed from " + type + " to " + connection.effectiveType);
                type = connection.effectiveType;
                if (parseFloat(connection.downlink) <= 0.6) {
                    setoffline(true)
                    setmessage({
                        ...message,
                        message_title:"Poor connection",
                        message_subtitle:"Internet is to low"
                    })
                } else {
                    setoffline(false);
                }
              }
              
            connection.addEventListener('change', updateConnectionStatus);
            InterNetStatusChecker();



           
        },[]);



        return(

            <div className="dashboard">
                {/* {DialogForm()} */}
                {/* {NetWorkStatus()} */}
                <div className="sidebar">
                 
                    <img className="logo" src={Logo}/>
                 

                    <Link className="link-style" to={'/admin/gym'}>
                        <div className='action-button-container' id="Gym">
                            <span id="Gym-icon" className="material-icons action-button" style={{color:"#ff9100"}}>account_balance</span>
                            <div id="Gym-txt" className="action-txt" style={{color:"#ff9100"}}>Gym</div>
                        </div>
                    </Link>

                    <Link className="link-style" to={'/admin/branch'}>
                        <div className='action-button-container'  id="Branch" >
                            <span id="Branch-icon" className="material-icons action-button">device_hub</span>
                            <div id="Branch-txt" className="action-txt">Branch</div>
                        </div>
                    </Link>


                    <Link className="link-style" to={{
                            pathname:`/members`,
                            state:{
                                branchId:"",
                                action:"noaction"
                            }
                    }}>
                        <div className='action-button-container'  id="Member">
                            <span id="Member-icon" className="material-icons action-button">perm_identity</span>
                            <div id="Member-txt" className="action-txt">Member</div>
                        </div>
                    </Link>


                   
                   
                </div>
                
    
                <div className="main-body"> 
                    {/* <div className="row my-auto">  
                        <div className="ml-3 mr-3 pl-3 pr-3 pt-2 pb-2 shadow row" style={{backgroundColor: "#ffffff", borderRadius: 20}}>
                            {name}  
                        </div>
                        <img  className="mt-1" src={Bell} style={{width: 30, height: 30}}/>
                    </div> */}

                    <div className="my-account-container">
                        <div className="greeting-text">Hello, Mr. Anik Roy</div>
                        <div className="profile-notification-container">
                            <div className="bell-icon-container">
                                <span onClick={handleNotificationPopup} className="material-icons bell-icon">notifications</span>
                            </div>
                                  
                            <div className="bell-icon-container-info">
                            <div style={{fontSize:'1.3vw',fontWeight:'bold',width:'90%',margin:'1% auto'}}>Notifications</div>
                            <div style={{transition:'0.5s',overflowY:'hidden',margin:'5% auto 1% auto', height:'85%'}} className="exercise-body-container">
                                    <div style={{overflowY:'auto',overflowX:'none',height:"100%"}}>
                                    {
                                                [1,2,3,4,54,5,6,7,8,8,8,8,8,9,9].map(()=>{
                                                    return(
                                                    
                                                        <div style={{cursor:'pointer',display:'flex',alignItems:'flex-start',flexDirection:'column'}}   className="mt-1 mb-1 mr-1 ml-1 card-item-wrapper">
                                                            
                                                            <div className="ml-2 notification-sub-head">20/02/2021</div>
                                                            <div className="ml-2 notification-header">Appointment Alert</div>
                                                            <div className="ml-2 notification-description" >This is a description of the appoientment</div>
                                                            
                                                          
                                                        </div>
                                                    
                                                    
                                                    )
                                                })
                                        }
                                    </div>
                                </div>
                                

                            </div>
                        
                            <div className="profile-container" onClick={handleOpenProfile}>
                                <div className="profile-txt">AR</div>
                            </div>

                            <div className="profile-info-container">
                               
                               <span role="button" style={{right:10,top:10,position:'absolute'}} class="material-icons-outlined">
                                    manage_accounts
                               </span>
                              
                                <div className="profile-container">
                                    <div className="profile-txt">AR</div>
                                </div>
                                <div className="profile-info-text-container">
                                    <div className="profile-header-txt">Anik Roy</div>
                                    {/* <div className="profile-info-txt">anikroy@gmail.com</div> */}
                                    <div className="profile-info-txt">Branch Admin</div>
                                    {/* <div className="profile-header-txt">Anik Roy</div> */}
                                    {/*<div className="profile-header-txt">Anik Roy</div>
                                    <div className="profile-header-txt">Anik Roy</div> */}
                                    {/* <div className="profile-info-txt">Anik Roy</div> */}
                                    
                                    <div style={{width:'7vw'}} className="register-button">
                                    <div style={{fontSize:'1vw'}}> <Signout/></div>
                                    </div>
                                </div>

                                

                                {/* <div className="profile-info-text-container">
                                    <div className="profile-header-txt">Email :</div>
                                    <div className="profile-info-txt">anikroy@gmail.com</div> 
                                </div>
                                <div className="profile-info-text-container">
                                    <div className="profile-header-txt">Phone :</div>
                                    <div className="profile-info-txt">+91 8837329430</div>
                                </div>
                                <div className="profile-info-text-container">
                                    <div className="profile-header-txt">Address :</div>
                                    <div className="profile-info-txt">Kunjaban Colony, Agartala, Tripura (W)</div>
                                </div> */}
                            </div>
                        
                        </div>
                    </div>
                    <div className="main-container">
                        {children}
                    </div>       
                </div>
    
                {//use this flag value every screen for showing default container view - change image and text font
                   (flag === 0)? (
                        <div className="body-info" style={{backgroundColor: "#fafafa"}}>
                            <div className="select-icon-container">
                                <img src={SelectIcon} className="select-icon"/>
                                <div className="select-text">Please select to view account info</div>
                            </div>
                        </div>
                    ) 
                    : (flag === 1)? (
                        <div onLoad={getThisGym(itemId)} className="body-info">
                            <div className="infobar">
                            <div className="info-heading">Gym Details</div>
                            <div className="info-divider"/>
                            <div className="profile-info">
                                <div className="profile-name-container">
                                    <div className="profile-name">{data.gymName}</div>
                                    <div onClick={()=>{history.push(`/gym/profile/${itemId}`)}} className="d-flex" style={{ margin: "5% 0 0 0"}}>
                                        <button className="instafit-grey-btn spacing-21 flex-item">Edit Profile</button>
                                        <span id="edit-phone" class="material-icons-round edit-icon flex-item" style={{color:"rgb(0, 0, 0, 0.4)"}}>edit</span>
                                    </div>
                                    </div>
                                <div className="profile-image-container">
                                    {/* {GymImg(itemId)} */}
                                    <img src={`${API}/photo-gym/${itemId}`} className="profile-image"/>
                                </div>
                            </div> 
                            <div className="profile-data-container">
                                <div onClick={()=>{
                                     history.push({
                                        pathname:`/members`,
                                        state:{
                                            branchId:"",
                                            action:"noaction"
                                        }
                                    });
                                }} className="profile-data">
                                    <div className="profile-text-container">
                                        <div className="profile-number">{(data&&(data.totalMembers||data.totalMembers!=""))?data.totalMembers:"0"}</div>
                                        <div className='profile-txt'>Member</div>
                                    </div>
                                </div>
                                <Link to="/admin/branch" style={{textDecoration: "none"}}>
                                    <div className="profile-data">
                                        <div className="profile-text-container">
                                            <div className="profile-number">{(data&&(data.totalBranch||data.totalBranch!=""))?data.totalBranch:"0"}</div>
                                            <div className='profile-txt'>Branch</div>
                                        </div>
                                        </div>
                                </Link>

                            </div>
                           <div className="scroll-container" style={{maxHeight: "25vw", paddingRight:"1vw"}}>
                            <div className="bold-font">Attendance Tracker (weekly)</div>
                            <div className="inactive" style={{fontFamily:"sans-serif"}}>12 Jul 2021 - 17 Jul 2021</div>
                            <div className="tracker">
                                <div className="tracker-percentage tracker-percentage-color-1" style={{width:trackerValue}}>
                                    <div class="tracker-value">{trackerValue}</div>
                                </div>
                            </div>


                            <div className="bold-font">Appointment Tracker (Monthly)</div>
                            <div className="inactive" style={{fontFamily:"sans-serif"}}>12 Jul 2021 - 12 Aug 2021</div>
                            <div className="tracker">
                                <div className="tracker-percentage tracker-percentage-color-2" style={{width:trackerValue}}>
                                    <div class="tracker-value">{trackerValue}</div>
                                </div>
                                </div>
                                <div className="assets-action-container" onClick={()=>history.push(`/manage/appointment`)}>
                                    <div className="action-icon-container">
                                        <span class="material-icons action-icon">timeline</span>
                                    </div>
                                    <div className="action-text">Appointment</div>
                                </div>
                                {/* <Link to={{
                                    pathname:`/${itemId}/contents`,
                                    state:"contents"
                                }} style={{textDecoration: "none",}}> */}
                                    <div onClick={()=>history.push(`/contents`)} className="assets-action-container">
                                        <div className="action-icon-container">
                                            <span class="material-icons action-icon">show_chart</span>
                                        </div>
                                        <div  className="action-text">Content</div>
                                    </div>
                                {/* </Link> */}

                                <Link to={`/parameters/${user._id}`} style={{textDecoration: "none"}}>
                                    <div className="assets-action-container">
                                        <div className="action-icon-container">
                                            <span class="material-icons action-icon">timeline</span>
                                        </div>
                                        <div className="action-text">Parameters</div>
                                    </div>
                                </Link>
                            
                             
                                </div> 
                        </div>

                    </div> 
                   
                    ): (flag===2)?(
                        <div onLoad={getThisGym(itemId)} className="body-info">
                        <div className="infobar">
                            <div className="info-heading">Branch Details</div>
                            <div className="info-divider"/>
                            <div className="profile-info">
                                <div className="profile-name-container">
                                    <div className="profile-name">{data.branchName}</div>
                                    <div onClick={()=>{history.push(`/branch/profile/${data.branchId}`)}} className="d-flex" style={{ margin: "5% 0 0 0"}}>
                                        <button className="instafit-grey-btn spacing-21 flex-item">Edit Profile</button>
                                        <span id="edit-phone" class="material-icons-round edit-icon flex-item" style={{color:"rgb(0, 0, 0, 0.4)"}}>edit</span>
                                    </div>

                                </div>
                                <div className="profile-image-container">
                                    {/* {GymImg(itemId)} */}
                                    <img src={`${API}/photo-gym/${data.gymId}`} className="profile-image"/>
                                </div>
                            </div> 
                            <div className="profile-data-container">
                                <div className="profile-data">
                                    <div onClick={()=>{
                                        if(itemId!=""){
                                            history.push({
                                                pathname:`/members`,
                                                state:{
                                                    branchId:data.branchId,
                                                    action:"noaction"
                                                }
                                            })
                                        }
                                    }} role="button" className="profile-text-container">
                                        <div className="profile-number">{(data&&(data.totalmembers||data.totalmembers!=""))?data.totalmembers:"0"}</div>
                                        <div className='profile-txt'>Member</div>
                                    </div>
                                </div>

                                {/* <Link to="/admin/branch" style={{textDecoration: "none"}}> */}
                                <div onClick={()=>history.push(`/manage/appointment`)} className="profile-data">
                                            <div className="profile-text-container">
                                                <div className="profile-number">0</div>
                                                <div className='profile-txt'>Appointment</div>
                                            </div>
                                        </div>
                                {/* </Link> */}

                                </div>
                                <div className="scroll-container" style={{maxHeight: "25vw", paddingRight:"1vw"}}>
                                    <div className="bold-font">Attendance Tracker (weekly)</div>
                                    <div className="inactive" style={{fontFamily:"sans-serif"}}>12 Jul 2021 - 17 Jul 2021</div>
                                    <div className="tracker">
                                        <div className="tracker-percentage tracker-percentage-color-1" style={{width:trackerValue}}>
                                            <div class="tracker-value">{trackerValue}</div>
                                        </div>
                                    </div>


                                    <div className="bold-font">Appointment Tracker (Monthly)</div>
                                    <div className="inactive" style={{fontFamily:"sans-serif"}}>12 Jul 2021 - 12 Aug 2021</div>
                                    <div className="tracker">
                                        <div className="tracker-percentage tracker-percentage-color-2" style={{width:trackerValue}}>
                                            <div class="tracker-value">{trackerValue}</div>
                                        </div>
                                    </div>


                                    <div className="assets-action-container" onClick={()=>history.push(`/manage/appointment`)}>
                                        <div className="action-icon-container">
                                            <span class="material-icons action-icon">timeline</span>
                                        </div>
                                        <div className="action-text">Appointment</div>
                                    </div>

                                    {/* <Link to={{
                                        pathname:`/${itemId}/contents`,
                                        state:"contents"
                                    }} style={{textDecoration: "none",}}> */}
                                        <div onClick={()=>{history.push(`/contents`)}} className="assets-action-container">
                                            <div className="action-icon-container">
                                                <span class="material-icons action-icon">show_chart</span>
                                            </div>
                                            <div className="action-text">Content</div>
                                        </div>
                                    {/* </Link> */}
                                    <div className="assets-action-container" onClick={()=>{history.push(`/parameters/${user._id}`)}}>
                                        <div className="action-icon-container">
                                            <span class="material-icons action-icon">timeline</span>
                                        </div>
                                        <div className="action-text">Parameters</div>
                                    </div>

                                    <div className="assets-action-container" onClick={()=>{history.push(`/manage/planner`)}}>
                                        <div className="action-icon-container">
                                            <span class="material-icons action-icon">timeline</span>
                                        </div>
                                        <div className="action-text">Planner</div>
                                    </div>

                                    {/* <div className="assets-action-container" onClick={()=>{history.push(`/member-history`)}}>
                                        <div className="action-icon-container">
                                            <span class="material-icons action-icon">timeline</span>
                                        </div>
                                        <div className="action-text">Fitness Test</div>
                                    </div> */}

                                    {/* <div className="assets-action-container" onClick={()=>{history.push(`/member-history`)}}>
                                        <div className="action-icon-container">
                                            <span class="material-icons action-icon">timeline</span>
                                        </div>
                                        <div className="action-text">Member Feedback</div>
                                    </div> */}
                                    </div>
                                    </div>
                                    </div>

                    ):(
                     
                        <div className="body-info">
                        <div className="infobar">
                            <div className="info-heading">Member Details</div>
                            <div className="info-divider"/>
                            <div className="profile-info">
                                <div className="profile-name-container">
                                    <div className="profile-name">{data.mfname} {data.mlname}</div>
                                    <div onClick={()=>{history.push(`/member/profile/${data.memberId}`)}} className="d-flex" style={{ margin: "5% 0 0 0"}}>
                                        <button className="instafit-grey-btn  spacing-21 flex-item">Edit Profile</button>
                                        <span id="edit-phone" class="material-icons-round edit-icon flex-item" style={{color:"rgb(0, 0, 0, 0.4)"}}>edit</span>
                                    </div>

                                </div>
                                <div className="profile-image-container">
                                    <img src={GymLogo} 
                                    // src={`${API}/get-member-photo/${data.memberId}`} 
                                    className="profile-image"/>
                                </div>
                            </div> 
                            <div className="profile-data-container">
                                <div className="profile-data">
                                    <div className="profile-text-container">
                                        <div className="profile-number">125</div>
                                        <div className='profile-txt'>Days of Workout Completed</div>
                                    </div>
                                </div>
                                <div className="profile-data">
                                    <div className="profile-text-container">
                                        <div className="profile-number">100</div>
                                        <div className='profile-txt'>Exercises Done <br/> Till Date</div>
                                    </div>
                                </div>
                                </div>
                                <div className="bold-font">Planner Name starts from</div>
                            <div className="inactive">12/10/22 - 12/11/22</div>
                            <div className="tracker">
                                <div className="tracker-percentage tracker-percentage-color-1" style={{width:trackerValue}}>
                                    <div class="tracker-value">{trackerValue}</div>
                                </div>
                                </div>


                            <div className="bold-font">My Progress</div>
                            <div className="tracker">
                                <div className="tracker-percentage tracker-percentage-color-2" style={{width:trackerValue}}>
                                    <div class="tracker-value">{trackerValue}</div>
                                </div>
                            </div>

                            <div className="scroll-container">
                                {/* <div onClick={()=>{
                                    if(planner_name==""){
                                        alert(`please assign a planner there is no planner`)
                                    }else{
                                    let open=window.confirm(`are you sure you want to open ${planner_name}`);
                                    if(open){
                                        history.push(`/${data.branchId}/${plannerId}/manage-planner`);
                                    }} 
                                }} className="assets-action-container" >
                                    <div className="action-icon-container">
                                        <span class="material-icons action-icon">source</span>
                                    </div>
                                    <div className="action-text">Workout Planner</div>
                                </div> */}

                                <div className="assets-action-container" onClick={()=>{history.push(`/member/calender/${data.memberId}`)}}>
                                    <div className="action-icon-container">
                                        <span class="material-icons action-icon">show_chart</span>
                                    </div>
                                    <div className="action-text">Workout Chart</div>
                                </div>
                                <div className="assets-action-container" onClick={()=>{history.push('/member/history')}}>
                                    <div className="action-icon-container">
                                        <span class="material-icons action-icon">timeline</span>
                                    </div>
                                    <div className="action-text">Member History</div>
                                </div>

                                <div className="assets-action-container" onClick={handleOpenDialogForm(0)}>
                                    <div className="action-icon-container">
                                        <span class="material-icons action-icon">add</span>
                                    </div>
                                    <div className="action-text">Assign New Planner</div>
                                </div>



                                <div className="assets-action-container" onClick={()=>history.push(`/member/appointment/${data.memberId}`)}>
                                        <div className="action-icon-container">
                                            <span class="material-icons action-icon">timeline</span>
                                        </div>
                                        <div className="action-text">Appointment</div>
                                </div>
                                

                                <div className="assets-action-container">
                                    <div className="action-icon-container">
                                        <span class="material-icons action-icon">local_dining</span>
                                    </div>
                                    <div className="action-text">Diet & Nutrition</div>
                                </div>

{/* 
                                <div className="assets-action-container">
                                    <div className="action-icon-container">
                                        <span class="material-icons action-icon">local_dining</span>
                                    </div>
                                    <div className="action-text">FeedBack</div>
                                </div> */}


                               
                                </div>
                                </div>
                                </div>


                    )
                }

                
                <div style={{position:'absolute',width:'100%',bottom:"0",left:"0"}}>
                      
                      {/*onLoad={startLoader()} */}
                            <div 
                            className="loader-wrapper">
                            
                                <div id="progress-id" style={{width:'0%',display:'none'}} data-off={data.startProgress?'no':'yes'} data-counter={0}  className="loader-spinner">
                                </div>
                            
                            </div>
                    
                     
                </div>




            {PopupForms()}
              
            </div>
       
       )
}

export default Dashboard;


     