import React, {useState,useEffect} from 'react';
import { isAuthenticated } from '../../auth';
import Dashboard from '../../core/Dashboard';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import { getAllActiveMainExercise,addExercise,createPlanner,updatePlanner,getPlanner,getAllPlanner, getAllExercise, getExercise, getContent } from '../helper/api';
import { getBranch } from '../../branch/helper/api';
import { getGym } from '../../gym/helper/api';
import { Card, CardContent } from '@material-ui/core';
import {useHistory} from 'react-router-dom'

//TODO task
//1.on click open button view content
//2.edit day display exercise name
//3.add restruction so that user can not add data skipping a field in add exercise 

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="right" ref={ref} {...props} timeout={{enter: 300, exit: 400}}/>;
});

const ManagePlanner = (props) => {

    // Hooks call for getting Dashboard Info 

    const history=useHistory();

    const [MainExercise, setMainExercise] = useState([]);
    const [Branch,setBranch]=useState({
        branchName:"",
        branchId:"",
        phone:"",
        email:"",
        gymId:"",
        gymName:"",
        totaladminusers:0,
        totalmembers:0
    });

    const {branchName,totaladminusers,totalmembers,branchId,phone,email,gymId,gymName}=Branch;

    //API calls
    const ActiveMainExercise = gymId => {
        getAllActiveMainExercise(user._id, token, gymId).then(data => {
            if(data.error){
              console.log("error in DB")
            }else{ 
              setMainExercise(data);
            }
        });
    }

    //add exercise
    //todo add data to server
    const AddExercise=event=>{
        event.preventDefault();
        let optionalEx=[];
        let freq_number=row;
        let day_number=day;
        if(freq_number>0&&document.getElementById(`exdoc-${day_number}-${freq_number-1}`).getAttribute("data-Id")==null){
            alert(`Day ${day+1} cell ${freq_number} field should not be empty`);
        }else{
            optionalEx.push(optionalEx1);
            optionalEx.push(optionalEx2);
            addExercise(user._id,token,props.match.params.itemId,{freq_number,day_number,rep,set,content,optionalEx,active:true}).then(data=>{
                if(data.error){
                    throw "Something went wrong please wait"
                }else{
                    setState([]);
                    GetPlanner();
                    handleClose()
                }
            }).catch(err=>console.log(err));
        }
    }



    const onLoadExerciseMark=(day,index)=>{
        getAllExercise(user._id,token,props.match.params.itemId).then(data=>{
            if(data.error){
                throw "Something went wrong try again";
            }else{
              //  console.log(data)---------------------------------------------------------+---------------
                for(var item in data){
                    if(data[item].freq_number==index&&data[item].day_number==day&&data[item].active){
                        document.getElementById(`img-exdoc-${day}-${index}`).src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAABmJLR0QA/wD/AP+gvaeTAAADw0lEQVR4nO2c34sTVxTHv2cys06yFvZhFcUHoX1b8ElwUaksqKBJsAttn9qKWndFkMri32GlIv7+hS+i+7JLd1NBCwptUdAnpX2SClpKW0HFmkwykzk+1GxmsvVH9tyMk93zecq9dzj38MmZX5k7ARRFURRFURRFaRt63cCirYs+CsgatIgWJ5lQ2giZ/7U5vFX9oXr//8ZnCxzu67P96ikAn3U6uS6CiXHZr7l7cO3Js+hAXOBqOPay7A0Aa5PMrov4OXhRGcJ1BI0OOzrqLHO/4ri8vwA8Siq7NlkJoD/hOdc7OfdLH975RkdMIIM+abboapArFzGOWnL5vTuZgnuCQKNJz/vK0YxAq2V0eeMjARNplfeeWRFtxAVSrB1AmU3cUYtApW1UoBAVKEQFClGBQlSgEBUoRAUKUYFCVKAQFShEBQpRgUJUoBD77Zu0Tyaf/ZSANXaGj3vfe793Yo60YFygk8+OMeFbAAhCWgtgg+k50oTRXdgpZvcz4eBMByM0GT+NGKtAp5jdx4xDaDzpI/xtob7XVPy0YqQCnXxuNzMOo/mY9B8rtDbVpmu/mYifZsQV6BTcrxl8Ak15jy22NtZKL+5KY3cDogp0Cu4uBp2MxHlKoC0LRR4gEOgU3Z0MOoWoPKbN/nT5jpnUuoM57cJO3t3BTKcR/wJ+DSkcyRTcEROJEdGzIOCjuOI9MBGvU7QtMFN0tzPTGcyu3nUEWmcmLQAM2DZ9HKR8nY7eyglpuwLrU94FJ+9aTLOq8BcG3zOVGDE9Dep8zFS8TjGnY6Bf8s47RZdajoMDFlv7/VL5trn00s+cd2F/yjtH4BFg5natj4mvOoXcajOpdQeiY6A/7Z0l8CiiEsFXevK9q+SpdQfik4g/7Z0hpj0A+FVXf0jhjwtFopGzsF8qnybCN2hKXBJa4bWerT0DJuKnGWOXMf5U5QgRxtCQyFgaWpmTpuKnFaPXgf5U5TtiHIh0deQX7zRh/ELaL1UOMdMwgIOZMPzCdPy00ZEKqZfKkwAmF8IaYb2VE6IChahAISpQiAoUogKFqEAhKlCIChSiAoWoQCEqUIgKFKIChbS+8h9dEDnvfwydEy2LRltf+f+zuR2G8Tl6Ekqrm/gj2ohVGRFPMNO2/1q82a5kH6KAh8nl1hYr38ekTDwRbcf/eGcItt2bvQHA3CKh+cVPQa4yhHHUGx3xXfg6gqDq5olxCc1HlArABFwMqm4xKg94w5+PuQX3Q59p0CL6oPP5pZeQ+bmT4Zvz/X0XRVEURVEURUmUlzesBMe8RtQ3AAAAAElFTkSuQmCC";
                        document.getElementById(`exdoc-${day}-${index}`).setAttribute("data-Id",data[item]._id);
                    }
                }
            }
        }).catch(err=>console.log(err));
    }

    const EditData=()=>{
        let planner_name=document.getElementById("planner_name_id").value;
        let planner_freq=document.getElementById("planner_freq_id").value;
        updatePlanner(user._id,token,props.match.params.itemId,{planner_name,planner_freq}).then(data=>{
            if(data.error){
             throw "Something went wrong please try again"
            }else{
              GetPlanner();
            }
         }).catch(err=>console.log(err));
    }


    const debounce=(fun,d)=>{
        let timer;
        return function(){
            let context=this,args=arguments;
            clearTimeout(timer);
            timer=setTimeout(()=>{
                fun.apply(context,args);
            },d);
        }
    };


    const day1 = 0;
    const day2 = 1;
    const day3 = 2;
    const day4 = 3;
    const day5 = 4;
    const day6 = 5;
    const day7 = 6;

    const [currentDay, setCurrentDay] = useState("");
    const [currentId, setCurrentId] = useState("");

    // Dialog box for sets
    const [open, setOpen] = useState(false);

    const handleOpen = (day, row) => {
        alert(day)
        setOpen(true);
        setCurrentDay(`Day ${day+1}`);
        setCurrentId(row);
        if(document.getElementById(`exdoc-${day}-${row}`).getAttribute("data-Id")){
            getExercise(user._id,token,document.getElementById(`exdoc-${day}-${row}`).getAttribute("data-Id")).then(data=>{
                if(data.error){
                    throw data.error
                }else{
                    setExercise({
                        ...Exercise,
                        day,
                        row,
                        set:data.set,
                        rep:data.rep,
                        content:data.content,
                        optionalEx1:data.optionalEx[0],
                        optionalEx2:data.optionalEx[1]
                    });
                 //   console.log(data)
                }
            }).catch(err=>console.log(err))
        }else{
            setExercise({
                ...Exercise,
                day:day,
                row:row,
                set:5,
                rep:15,
                content:"",
                optionalEx1:"",
                optionalEx2:""
            });
        }
    }

    const handleClose = () => {
        setOpen(false);
    }

    // User Authentication
    const {user,token} = isAuthenticated();

    //save display name
    const saveDisplayName=day=>event=>{
        event.preventDefault();
        days_display_names[day]=document.getElementById(`displaynameinputbox${day}`).textContent==""?"Untitled Exercise":document.getElementById(`displaynameinputbox${day}`).textContent;
        updatePlanner(user._id,token,props.match.params.itemId,{days_display_names}).then(data=>{
            if(data.error){
                throw "Something went wrong please try again"
            }else{
                GetPlanner();
            }
        }).catch(err=>console.log(err));
    }

    // Hooks call for Create, Update & Delete
    const [planner, setPlanner] = useState({
        planner_name: "",
        warmup: "",
        cooldown: "",
        planner_freq:10,
        days_display_names:[],
        workDays:"",
        error: "",
        success: false,
        loading: false
    });

    const {planner_name, warmup, cooldown, workDays,days_display_names} = planner;

    const [Exercise,setExercise]=useState({
        row:0,
        day:0,
        set:5,
        rep:15,
        content:"",
        optionalEx1:"",
        optionalEx2:""
    });
    const {row,day,set,rep,content,optionalEx1,optionalEx2}=Exercise;

  
    const item = {
        name: "Select"
    };
  
    const {name} = item; 
  
    const [rows, setState] = useState([])
  
    const handleAddRow = () => {
        if(rows.length == 20){
            alert("Cannot Create Frequency more than 20")
        }
        else{
             setTimeout(()=>{
                let ex_frequency=rows.length+1;
                updatePlanner(user._id,token,props.match.params.itemId,{ex_frequency}).then(data=>{
                    if(data.error){
                     throw "Something went wrong please try again"
                    }else{
                        setState(oldrow=>[...oldrow,item]);
                    }
                 }).catch(err=>console.log(err));
                
             },100);
        }
    };
  
    const handleRemoveSpecificRow = () => {
       
        setTimeout(()=>{
            let ex_frequency=rows.length-1;
            updatePlanner(user._id,token,props.match.params.itemId,{ex_frequency}).then(data=>{
                if(data.error){
                 throw "Something went wrong please try again"
                }else{
                    setState(rows => rows.slice(0, -1));
                }
             }).catch(err=>console.log(err));
            
         },100);
    };
  



    //handle ex in forms
    const handleExercise=name=>event=>{
       setExercise({...Exercise,[name]:event.target.value});
    };

    //API
    const GetBranch=()=>{
    
        getBranch(user._id,token,props.match.params.accountId).then(branch=>{
            if(branch.error){
                console.log("error to  featch data try after some time")
            }else{
               
                ActiveMainExercise(branch.gymId);
                getGym(user._id,token,branch.gymId).then(gym=>{
                    if(gym.error){console.log(gym.error)}else{
                        setBranch({branchName:branch.branchName,totalmembers:branch.memberList.length,totaladminusers:branch.branchAdminList.length,branchId:branch._id,phone:gym.phone,email:gym.email,gymId:gym._id,gymName:gym.gymName})
                    }
                })
            }
        })
    }

    const GetPlanner=()=>{
        getPlanner(user._id,token,props.match.params.plannerId).then(data=>{
             if(data.error){
                 throw "Something went wrong please try again"
             }else{
                document.getElementById("planner_name_id").value=data.planner_name;
                document.getElementById("planner_freq_id").value=data.planner_freq;
                setState([]);
                for(var i=0;i<data.ex_frequency;i++){
                    setState(oldrow=>[...oldrow,item]);
                }
                if(data.wormup){
                    document.getElementById("wormupview").setAttribute('data-contentId',data.wormup)
                }
                if(data.cooldown){
                    document.getElementById("cooldownview").setAttribute("data-contentId",data.cooldown);
                }
            
                return {wormup:data.wormup,cooldown:data.cooldown,days_display_names:data.days_display_names,planner_name:data.planner_name,planner_freq:data.planner_freq}
             }
        }).then(data=>{
                getContent(user._id,token,data.cooldown).then(d=>{
                    if(d.error){
                        return {value1:"Select Cooldown",days_display_names:data.days_display_names,planner_name:data.planner_name,planner_freq:data.planner_freq};
                    }else{
                        return {value1:d.exName,days_display_names:data.days_display_names,planner_name:data.planner_name,planner_freq:data.planner_freq};
                    }
                }).then(d=>{
                            getContent(user._id,token,data.wormup).then(d2=>{
                                if(d2.error){
                                    setPlanner({...planner,cooldown:d.value1,warmup:"Select Wormup",days_display_names:d.days_display_names,planner_name:d.planner_name,planner_freq:d.planner_freq})
                                }else{
                                    setPlanner({...planner,cooldown:d.value1,warmup:d2.exName,days_display_names:d.days_display_names,planner_name:d.planner_name,planner_freq:d.planner_freq});
                                }
                            })
                });
        }).catch(err=>{
            window.location.reload()
        })
    }


    useEffect(()=>{

        console.log(JSON.stringify(props.match.params))
        // GetBranch();
        
         //GetPlanner();
         //document.getElementById("planner_name_id").onkeyup=debounce(EditData,800);
         //document.getElementById("planner_freq_id").onkeyup=debounce(EditData,800);
    },[])
 
    return(
        <Dashboard flag={2} data={{
            branchId,
            branchName,
            gymId,
            gymName,
            email,
            phone,
            totaladminusers,
            totalmembers
          }}>


        <div>
          <input id="planner_name_id" className="mt-4 ml-4" style={{borderLeft:'none',height:30,width:150,paddingInlineStart:5,paddingInlineEnd:5,fontSize:18,borderRight:'none',borderTop:'none',caretColor:'grey',borderBottom:'1px solid inherit',color:'inherit',outline:'none'}}/>
          <label for="planner_freq_id" className="mt-4 ml-4" style={{fontSize:18,color:'inherit'}}>Week Freq:</label>
          <input id="planner_freq_id" onInput={e=>{
              if(e.target.value>7){
                  document.getElementById("planner_freq_id").value=7;
              }
              if(e.target.value<0){
                document.getElementById("planner_freq_id").value=0;
              }
          }} className="mt-4 ml-1" type="number" style={{textAlign:'center',height:30,width:50,paddingInlineStart:5,paddingInlineEnd:5,fontSize:18,caretColor:'grey',border:'1px solid inherit',color:'inherit',outline:'none'}}/>
          <div style={{width:'100%',display:'flex',flexDirection:'row-reverse'}}> 
          <span onClick={handleRemoveSpecificRow} className="material-icons btn shadow p-1" style={{fontSize:20,fontWeight:'bold', marginLeft:5,marginRight:50,borderRadius:100, color :"#000000",border:'1px dashed black'}}>remove</span>   
          <span onClick={handleAddRow} className="material-icons btn shadow p-1" style={{fontWeight:'bold',border:'1px dashed black',fontSize:20 ,borderRadius:100, color :"#000000"}}>add</span>    
          </div>

          <div class="col-12 mt-2" style={{height:250,margin:10,overflow:'auto',width:800}}>
                    <div className="container">
                        <div className="row clearfix">
                            <div className="col-md-12 column">
                              <table
                                className="table borderless"
                                id="tab_logic"
                            >
                                <tr>
                                    <th className="text-center  table-header pt-3"> S/L </th>
                                    <th className="text-center  table-header pt-3"> 
                                       <span>
                                          <div style={{display:'flex',alignItems:'center',alignContent:'center',justifyContent:'center'}}>
                                           Day 1 <span style={{fontSize:18,color:'#03203C',marginLeft:2}} onClick={()=>{
                                            document.getElementById("day1popup").style.display="block";
                                            document.getElementById("day1popup").addEventListener('mouseleave',onMOuseLeave);
                                            function onMOuseLeave(e){
                                                document.getElementById("day1popup").style.display="none";
                                                document.getElementById("day1popup").removeEventListener('mouseleave',onMOuseLeave);;
                                                e.stopPropagation();
                                            }
                                        }} role="button" class="material-icons">
                                        launch
                                        <div id="day1popup" className="dropdowndisplaypoupview">
                                            &nbsp;
                                                <h6  contentEditable={true} id="displaynameinputbox0" style={{border:"1px dashed blue",height:30,outline:'none',overflow:'hidden',marginTop:5,marginBottom:5,width:"80%",margin:'0 auto 0 auto',width:180,color:"black",textAlign:"center"}}>{days_display_names[0]}</h6>
                                                <span role="button" onClick={saveDisplayName(0)}>
                                                    <h6 className="shadow" style={{width:80,border:"none",outline:'none',fontSize:16,color:'white',float:"right",marginRight:"10px",borderRadius:5,backgroundColor:'blue'}}>Save</h6>
                                                </span>
                                            &nbsp;
                                        </div>
                                        </span>
                                        </div>
                                          <center><p style={{width:100,height:20,fontSize:10,overflow:"hidden"}}>{days_display_names[0]}</p></center> 
                                       </span>
                                    </th>
                                    <th className="text-center  table-header pt-3"> 
                                      <span>
                                       <div style={{display:'flex',alignItems:'center',alignContent:'center',justifyContent:'center'}}>
                                        Day 2 <span onClick={()=>{
                                          document.getElementById("day2popup").style.display="block";
                                          document.getElementById("day2popup").addEventListener('mouseleave',onMOuseLeave);
                                          function onMOuseLeave(e){
                                            document.getElementById("day2popup").style.display="none";
                                            document.getElementById("day2popup").removeEventListener('mouseleave',onMOuseLeave);;
                                            e.stopPropagation();
                                          }
                                      }} style={{fontSize:18,color:'#03203C',marginLeft:2}} role="button" class="material-icons">launch
                                     <div id="day2popup" className="dropdowndisplaypoupview">
                                           &nbsp;
                                            <h6  id="displaynameinputbox1" contentEditable={true} style={{border:"1px dashed blue",height:30,outline:'none',overflow:'hidden',marginTop:5,marginBottom:5,width:"80%",margin:'0 auto 0 auto',width:180,color:"black",textAlign:"center"}}>{days_display_names[1]}</h6>
                                            <span role="button" onClick={saveDisplayName(1)}>
                                                <h6 className="shadow" style={{width:80,border:"none",outline:'none',fontSize:16,color:'white',float:"right",marginRight:"10px",borderRadius:5,backgroundColor:'blue'}}>Save</h6>
                                            </span>
                                           &nbsp;
                                     </div>
                                     </span>
                                       </div>
                                        <center><p style={{width:100,height:20,fontSize:10,overflow:"hidden"}}>{days_display_names[1]}</p></center> 
                                       </span>
                                    </th>
                                    <th className="text-center   table-header pt-3">
                                      <span>
                                       <div style={{display:'flex',alignItems:'center',alignContent:'center',justifyContent:'center'}}>
                                        Day 3 <span onClick={()=>{
                                          document.getElementById("day3popup").style.display="block";
                                          document.getElementById("day3popup").addEventListener('mouseleave',onMOuseLeave);
                                          function onMOuseLeave(e){
                                            document.getElementById("day3popup").style.display="none";
                                            document.getElementById("day3popup").removeEventListener('mouseleave',onMOuseLeave);;
                                            e.stopPropagation();
                                          }
                                      }} style={{fontSize:18,color:'#03203C',marginLeft:2}} role="button" class="material-icons">launch
                                     <div id="day3popup" className="dropdowndisplaypoupview">
                                           &nbsp;
                                            <h6 id="displaynameinputbox2" contentEditable={true} style={{border:"1px dashed blue",height:30,outline:'none',overflow:'hidden',marginTop:5,marginBottom:5,width:"80%",margin:'0 auto 0 auto',width:180,color:"black",textAlign:"center"}}>{days_display_names[2]}</h6>
                                            <span role="button" onClick={saveDisplayName(2)}>
                                                <h6 className="shadow" style={{width:80,border:"none",outline:'none',fontSize:16,color:'white',float:"right",marginRight:"10px",borderRadius:5,backgroundColor:'blue'}}>Save</h6>
                                            </span>
                                           &nbsp;
                                     </div>
                                     </span>
                                     </div>
                                       <center><p style={{width:100,height:20,fontSize:10,overflow:"hidden"}}>{days_display_names[2]}</p></center> 
                                      </span>
                                    </th>
                                    <th className="text-center  table-header pt-3"> 
                                      <span>
                                       <div style={{display:'flex',alignItems:'center',alignContent:'center',justifyContent:'center'}}>
                                       Day 4 <span onClick={()=>{
                                          document.getElementById("day4popup").style.display="block";
                                          document.getElementById("day4popup").addEventListener('mouseleave',onMOuseLeave);
                                          function onMOuseLeave(e){
                                            document.getElementById("day4popup").style.display="none";
                                            document.getElementById("day4popup").removeEventListener('mouseleave',onMOuseLeave);;
                                            e.stopPropagation();
                                          }
                                      }} style={{fontSize:18,color:'#03203C',marginLeft:2}} role="button" class="material-icons">launch
                                     <div id="day4popup" className="dropdowndisplaypoupview">
                                           &nbsp;
                                            <h6 id="displaynameinputbox3" contentEditable={true} style={{border:"1px dashed blue",height:30,outline:'none',overflow:'hidden',marginTop:5,marginBottom:5,width:"80%",margin:'0 auto 0 auto',width:180,color:"black",textAlign:"center"}}>{days_display_names[3]}</h6>
                                            <span role="button" onClick={saveDisplayName(3)}>
                                                <h6 className="shadow" style={{width:80,border:"none",outline:'none',fontSize:16,color:'white',float:"right",marginRight:"10px",borderRadius:5,backgroundColor:'blue'}}>Save</h6>
                                            </span>
                                           &nbsp;
                                       </div>
                                     </span>
                                     </div> 
                                     <center><p style={{width:100,height:20,fontSize:10,overflow:"hidden"}}>{days_display_names[3]}</p></center> 
                                     </span>
                                     </th>
                                    <th className="text-center  table-header pt-3"> 
                                       <span>
                                         <div style={{display:'flex',alignItems:'center',alignContent:'center',justifyContent:'center'}}>
                                         Day 5 <span onClick={()=>{
                                          document.getElementById("day5popup").style.display="block";
                                          document.getElementById("day5popup").addEventListener('mouseleave',onMOuseLeave);
                                          function onMOuseLeave(e){
                                            document.getElementById("day5popup").style.display="none";
                                            document.getElementById("day5popup").removeEventListener('mouseleave',onMOuseLeave);;
                                            e.stopPropagation();
                                          }
                                      }} style={{fontSize:18,color:'#03203C',marginLeft:2}} role="button" class="material-icons">launch
                                     <div id="day5popup" className="dropdowndisplaypoupview">
                                           &nbsp;
                                            <h6 id="displaynameinputbox4" contentEditable={true} style={{border:"1px dashed blue",height:30,outline:'none',overflow:'hidden',marginTop:5,marginBottom:5,width:"80%",margin:'0 auto 0 auto',width:180,color:"black",textAlign:"center"}}>{days_display_names[4]}</h6>
                                            <span role="button" onClick={saveDisplayName(4)}>
                                                <h6 className="shadow" style={{width:80,border:"none",outline:'none',fontSize:16,color:'white',float:"right",marginRight:"10px",borderRadius:5,backgroundColor:'blue'}}>Save</h6>
                                            </span>
                                           &nbsp;
                                       </div>
                                     </span>
                                        </div> 
                                         <center><p style={{width:100,height:20,fontSize:10,overflow:"hidden"}}>{days_display_names[4]}</p></center>        
                                       </span>
                                    </th>
                                    <th className="text-center table-header pt-3"> 
                                     <span>
                                       <div style={{display:'flex',alignItems:'center',alignContent:'center',justifyContent:'center'}}>
                                     Day 6 <span  onClick={()=>{
                                          document.getElementById("day6popup").style.display="block";
                                          document.getElementById("day6popup").addEventListener('mouseleave',onMOuseLeave);
                                          function onMOuseLeave(e){
                                            document.getElementById("day6popup").style.display="none";
                                            document.getElementById("day6popup").removeEventListener('mouseleave',onMOuseLeave);;
                                            e.stopPropagation();
                                          }
                                      }} style={{fontSize:18,color:'#03203C',marginLeft:2}} role="button" class="material-icons">launch
                                     <div id="day6popup"  className="dropdowndisplaypoupview">
                                           &nbsp;
                                            <h6 id="displaynameinputbox5" contentEditable={true} style={{border:"1px dashed blue",height:30,outline:'none',overflow:'hidden',marginTop:5,marginBottom:5,width:"80%",margin:'0 auto 0 auto',width:180,color:"black",textAlign:"center"}}>{days_display_names[5]}</h6>
                                            <span role="button" onClick={saveDisplayName(5)}>
                                                <h6 className="shadow" style={{width:80,border:"none",outline:'none',fontSize:16,color:'white',float:"right",marginRight:"10px",borderRadius:5,backgroundColor:'blue'}}>Save</h6>
                                            </span>
                                           &nbsp;
                                       </div>
                                     </span>
                                     </div> 
                                       <center><p style={{width:100,height:20,fontSize:10,overflow:"hidden"}}>{days_display_names[5]}</p></center>      
                                     </span>
                                    </th>
                                    <th className="text-center  table-header pt-3"> 
                                      <span>
                                       <div style={{display:'flex',alignItems:'center',alignContent:'center',justifyContent:'center'}}>
                                        Day 7 <span onClick={()=>{
                                          document.getElementById("day7popup").style.display="block";
                                          document.getElementById("day7popup").addEventListener('mouseleave',onMOuseLeave);
                                          function onMOuseLeave(e){
                                            document.getElementById("day7popup").style.display="none";
                                            document.getElementById("day7popup").removeEventListener('mouseleave',onMOuseLeave);;
                                            e.stopPropagation();
                                          }
                                      }} style={{fontSize:18,color:'#03203C',marginLeft:2}} role="button" class="material-icons">launch
                                     <div id="day7popup"  className="dropdowndisplaypoupview">
                                           &nbsp;
                                            <h6 id="displaynameinputbox6"  contentEditable={true} style={{border:"1px dashed blue",height:30,outline:'none',overflow:'hidden',marginTop:5,marginBottom:5,width:"80%",margin:'0 auto 0 auto',width:180,color:"black",textAlign:"center"}}>{days_display_names[6]}</h6>
                                            <span role="button" onClick={saveDisplayName(6)}>
                                                <h6 className="shadow" style={{width:80,border:"none",outline:'none',fontSize:16,color:'white',float:"right",marginRight:"10px",borderRadius:5,backgroundColor:'blue'}}>Save</h6>
                                            </span>
                                           &nbsp;
                                       </div>
                                     </span>
                                       </div> 
                                       <center><p style={{width:100,height:20,fontSize:10,overflow:"hidden"}}>{days_display_names[6]}</p></center> 
                                       </span>
                                    </th>
                                </tr>
                                
                                <tbody>
                                  
                                  {rows.map((item, idx) => (
                                    <tr id="addr0" key={idx} >
                                    <td className="text-center table-row-number pt-3">{idx + 1}.</td>
                                    <td>
                                        <center>
                                            <button data-open={false}  id={`exdoc-${day1}-${idx}`} className="btn shadow-sm btn-sm" style={{border:'1px solid black',borderRadius:5,backgroundColor:'whitesmoke'}} onClick={() => handleOpen(day1, idx)} onLoad={onLoadExerciseMark(day1,idx)}>
                                              <img id={`img-exdoc-${day1}-${idx}`} style={{width:15,height:20}} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAABmJLR0QA/wD/AP+gvaeTAAAFC0lEQVR4nO2cy4sdRRSHvxaZaIwL8YWaLDSZWZiFSzcmBjVqNqJBDRoE8U8QNBERNAky7kXRrETwtVP0KoPKOMGlGsVImIAuJIpEJdGYzGy8LioDTk1X366uqj6nu+uDs7g99546p35T/ThVXZDJZDKZTCaTyWQycdgJHAaOA2eBcUt2EpgF1qVPUSczwBe01+EuGzFAEbYDfyLf+YMUYQZdnT84ET5HvrNd9glwSbrU5dmJfCcPeiQcpjzpZeBp4PrE7Q9ehOOUJ7yvpfYHPxL+pjzZ61pqf/DXBFei0u0PRgStAowq/tar05FWAaaADyr+3puRoFUAGIgImgWAAYigXQDouQhdEAB6LEJXBICeitAlAaCHInRNAOiZCF0UAHokQlcFgJ6I0GUBoAcidF0A6LgI0gK4yuG+E0GdFUFaANeE0P4GvtbRwSqqtACvO9pfBp4BbvD01zkRpAW4qyKGlKZGBGkBAOYr4khps20kNwkNAtwInKqIJZX92kZyk9AgAMA24I+KeFKZOJoC20L7q/TE0RjYncBrwA+4nxNUCFCEOqgIIoZvTSTJ86KQH2fCyQIIkwUQJgtQnyeBd4AfpQOx0XgXlJrNwLPAd6GO8l2QMPkUJMzF0gEIswHzdud2YCswDVxz4TiYd5x/A04Ax4AF4MiF42ro2jWgAHYB7wFL+D/5ngfeBe5FyWk2VIAp4CXglwpfPnYEuMLR1kOYC2esMsRRYLdHrkkIFWC2woevfUz5nO008GnEdmybwxQCRQgV4GSFDx9bANaX+N9L+oLcGPgLeMQj72hoEOAn4GrLbwE8H8G3r83S8rUhVIDQU9AScIvlswBebejvQ8xE/kYmT8677BVaFCFUgCmMCE1HwlMlPl9s6GuM6fgVNgX4OejRB0GEChCbPRUx1TGbEF97E+RXO0AJpgm/4NqE+DqDqRslRZMAMW41bUL9zUXPsmaAbfNgRSySAoyBByLnWivANimI94RrE8PnURLeFWkQYFdFHBoEGAP3lAXel3L0E9IB1ODxVI6lR8DlNKtqtj0CzlFSKtEwAnyroW9Yv78NJauUJ3ApJtZVaBDgAGZrs7obPNnzsLfHDScpO+wDGgR4zPP731qft8YKpAXWxKpBAF9+tj7PiETRjDWxahDgTc/vn7E+X+n43keYwlrhaTa+v9+EmRgq46pJyTUh9C7Itxpqz3gtO763ETlcVdSlFI1J34ZmARzWFr872h8hI8LKKagsplMpGpQWwPWesLYHsTHmhZFVaLgIh3JCOgAPFu0DfRDge+kAPDhmH+iDAAvSAXgwn8Kp9DVgA2a5oPZrwD8oLcaFchazy4l23sdURKMjPQLALJTVPgLujprx/4i1X08IBfCVIw4NAnxDwinJmPv1hLDbEYcGAe6LnOsqqvbr2U+7I2HOEYukAKPoWVpI7dfzL3CHFcsWzCplLQKcBm6q1YuBfBYYaFNbZG119OFAnzYhvh6t2X/BTCOzVcwYeK4knkMB/mItzn3Bo/+iILVfz3ngViuWArNEvIm/lSpqVVVzkr3crAvDkdivZ4xZUWGXngvMEvG2Y2n9P7+MNvfrWbGvgctKYtmDmcZM3f5pzEuAmRI2YzZdTdX5I8y+dZkJ3I95Ko056pI+ZPWRArNQ9m1Mccy3088Bb2FqO8HlBRVveguyHrNccAdwM2bdzrWs3apgETOZMg98SaKqZiaTyWSGxX8Vdq5TA4WBpQAAAABJRU5ErkJggg=="/>
                                            </button>
                                        </center>
                                    </td>
                                    <td>
                                        <center>
                                            <button data-open={false}  id={`exdoc-${day2}-${idx}`}   style={{border:'1px solid black',borderRadius:5,backgroundColor:'whitesmoke'}} onClick={() => handleOpen(day2, idx)} className="btn shadow-sm btn-sm"  onLoad={onLoadExerciseMark(day2,idx)}>
                                              <img id={`img-exdoc-${day2}-${idx}`} style={{width:15,height:20}} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAABmJLR0QA/wD/AP+gvaeTAAAFC0lEQVR4nO2cy4sdRRSHvxaZaIwL8YWaLDSZWZiFSzcmBjVqNqJBDRoE8U8QNBERNAky7kXRrETwtVP0KoPKOMGlGsVImIAuJIpEJdGYzGy8LioDTk1X366uqj6nu+uDs7g99546p35T/ThVXZDJZDKZTCaTyWQycdgJHAaOA2eBcUt2EpgF1qVPUSczwBe01+EuGzFAEbYDfyLf+YMUYQZdnT84ET5HvrNd9glwSbrU5dmJfCcPeiQcpjzpZeBp4PrE7Q9ehOOUJ7yvpfYHPxL+pjzZ61pqf/DXBFei0u0PRgStAowq/tar05FWAaaADyr+3puRoFUAGIgImgWAAYigXQDouQhdEAB6LEJXBICeitAlAaCHInRNAOiZCF0UAHokQlcFgJ6I0GUBoAcidF0A6LgI0gK4yuG+E0GdFUFaANeE0P4GvtbRwSqqtACvO9pfBp4BbvD01zkRpAW4qyKGlKZGBGkBAOYr4khps20kNwkNAtwInKqIJZX92kZyk9AgAMA24I+KeFKZOJoC20L7q/TE0RjYncBrwA+4nxNUCFCEOqgIIoZvTSTJ86KQH2fCyQIIkwUQJgtQnyeBd4AfpQOx0XgXlJrNwLPAd6GO8l2QMPkUJMzF0gEIswHzdud2YCswDVxz4TiYd5x/A04Ax4AF4MiF42ro2jWgAHYB7wFL+D/5ngfeBe5FyWk2VIAp4CXglwpfPnYEuMLR1kOYC2esMsRRYLdHrkkIFWC2woevfUz5nO008GnEdmybwxQCRQgV4GSFDx9bANaX+N9L+oLcGPgLeMQj72hoEOAn4GrLbwE8H8G3r83S8rUhVIDQU9AScIvlswBebejvQ8xE/kYmT8677BVaFCFUgCmMCE1HwlMlPl9s6GuM6fgVNgX4OejRB0GEChCbPRUx1TGbEF97E+RXO0AJpgm/4NqE+DqDqRslRZMAMW41bUL9zUXPsmaAbfNgRSySAoyBByLnWivANimI94RrE8PnURLeFWkQYFdFHBoEGAP3lAXel3L0E9IB1ODxVI6lR8DlNKtqtj0CzlFSKtEwAnyroW9Yv78NJauUJ3ApJtZVaBDgAGZrs7obPNnzsLfHDScpO+wDGgR4zPP731qft8YKpAXWxKpBAF9+tj7PiETRjDWxahDgTc/vn7E+X+n43keYwlrhaTa+v9+EmRgq46pJyTUh9C7Itxpqz3gtO763ETlcVdSlFI1J34ZmARzWFr872h8hI8LKKagsplMpGpQWwPWesLYHsTHmhZFVaLgIh3JCOgAPFu0DfRDge+kAPDhmH+iDAAvSAXgwn8Kp9DVgA2a5oPZrwD8oLcaFchazy4l23sdURKMjPQLALJTVPgLujprx/4i1X08IBfCVIw4NAnxDwinJmPv1hLDbEYcGAe6LnOsqqvbr2U+7I2HOEYukAKPoWVpI7dfzL3CHFcsWzCplLQKcBm6q1YuBfBYYaFNbZG119OFAnzYhvh6t2X/BTCOzVcwYeK4knkMB/mItzn3Bo/+iILVfz3ngViuWArNEvIm/lSpqVVVzkr3crAvDkdivZ4xZUWGXngvMEvG2Y2n9P7+MNvfrWbGvgctKYtmDmcZM3f5pzEuAmRI2YzZdTdX5I8y+dZkJ3I95Ko056pI+ZPWRArNQ9m1Mccy3088Bb2FqO8HlBRVveguyHrNccAdwM2bdzrWs3apgETOZMg98SaKqZiaTyWSGxX8Vdq5TA4WBpQAAAABJRU5ErkJggg=="/>
                                            </button>

                                        </center>
                                    </td>
                                    <td>
                                        <center>
                                            <button data-open={false}  id={`exdoc-${day3}-${idx}`}   style={{border:'1px solid black',borderRadius:5,backgroundColor:'whitesmoke'}} onClick={() => handleOpen(day3,idx)} className="btn shadow-sm btn-sm" onLoad={onLoadExerciseMark(day3,idx)}>
                                              <img id={`img-exdoc-${day3}-${idx}`} style={{width:15,height:20}} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAABmJLR0QA/wD/AP+gvaeTAAAFC0lEQVR4nO2cy4sdRRSHvxaZaIwL8YWaLDSZWZiFSzcmBjVqNqJBDRoE8U8QNBERNAky7kXRrETwtVP0KoPKOMGlGsVImIAuJIpEJdGYzGy8LioDTk1X366uqj6nu+uDs7g99546p35T/ThVXZDJZDKZTCaTyWQycdgJHAaOA2eBcUt2EpgF1qVPUSczwBe01+EuGzFAEbYDfyLf+YMUYQZdnT84ET5HvrNd9glwSbrU5dmJfCcPeiQcpjzpZeBp4PrE7Q9ehOOUJ7yvpfYHPxL+pjzZ61pqf/DXBFei0u0PRgStAowq/tar05FWAaaADyr+3puRoFUAGIgImgWAAYigXQDouQhdEAB6LEJXBICeitAlAaCHInRNAOiZCF0UAHokQlcFgJ6I0GUBoAcidF0A6LgI0gK4yuG+E0GdFUFaANeE0P4GvtbRwSqqtACvO9pfBp4BbvD01zkRpAW4qyKGlKZGBGkBAOYr4khps20kNwkNAtwInKqIJZX92kZyk9AgAMA24I+KeFKZOJoC20L7q/TE0RjYncBrwA+4nxNUCFCEOqgIIoZvTSTJ86KQH2fCyQIIkwUQJgtQnyeBd4AfpQOx0XgXlJrNwLPAd6GO8l2QMPkUJMzF0gEIswHzdud2YCswDVxz4TiYd5x/A04Ax4AF4MiF42ro2jWgAHYB7wFL+D/5ngfeBe5FyWk2VIAp4CXglwpfPnYEuMLR1kOYC2esMsRRYLdHrkkIFWC2woevfUz5nO008GnEdmybwxQCRQgV4GSFDx9bANaX+N9L+oLcGPgLeMQj72hoEOAn4GrLbwE8H8G3r83S8rUhVIDQU9AScIvlswBebejvQ8xE/kYmT8677BVaFCFUgCmMCE1HwlMlPl9s6GuM6fgVNgX4OejRB0GEChCbPRUx1TGbEF97E+RXO0AJpgm/4NqE+DqDqRslRZMAMW41bUL9zUXPsmaAbfNgRSySAoyBByLnWivANimI94RrE8PnURLeFWkQYFdFHBoEGAP3lAXel3L0E9IB1ODxVI6lR8DlNKtqtj0CzlFSKtEwAnyroW9Yv78NJauUJ3ApJtZVaBDgAGZrs7obPNnzsLfHDScpO+wDGgR4zPP731qft8YKpAXWxKpBAF9+tj7PiETRjDWxahDgTc/vn7E+X+n43keYwlrhaTa+v9+EmRgq46pJyTUh9C7Itxpqz3gtO763ETlcVdSlFI1J34ZmARzWFr872h8hI8LKKagsplMpGpQWwPWesLYHsTHmhZFVaLgIh3JCOgAPFu0DfRDge+kAPDhmH+iDAAvSAXgwn8Kp9DVgA2a5oPZrwD8oLcaFchazy4l23sdURKMjPQLALJTVPgLujprx/4i1X08IBfCVIw4NAnxDwinJmPv1hLDbEYcGAe6LnOsqqvbr2U+7I2HOEYukAKPoWVpI7dfzL3CHFcsWzCplLQKcBm6q1YuBfBYYaFNbZG119OFAnzYhvh6t2X/BTCOzVcwYeK4knkMB/mItzn3Bo/+iILVfz3ngViuWArNEvIm/lSpqVVVzkr3crAvDkdivZ4xZUWGXngvMEvG2Y2n9P7+MNvfrWbGvgctKYtmDmcZM3f5pzEuAmRI2YzZdTdX5I8y+dZkJ3I95Ko056pI+ZPWRArNQ9m1Mccy3088Bb2FqO8HlBRVveguyHrNccAdwM2bdzrWs3apgETOZMg98SaKqZiaTyWSGxX8Vdq5TA4WBpQAAAABJRU5ErkJggg=="/>
                                            </button>
                                        </center>
                                    </td>
                                    <td>
                                        <center>
                                            <button data-open={false}  id={`exdoc-${day4}-${idx}`}   style={{border:'1px solid black',borderRadius:5,backgroundColor:'whitesmoke'}} onClick={() => handleOpen(day4,idx)} onLoad={onLoadExerciseMark(day4,idx)} className="btn shadow-sm btn-sm" >
                                              <img id={`img-exdoc-${day4}-${idx}`} style={{width:15,height:20}} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAABmJLR0QA/wD/AP+gvaeTAAAFC0lEQVR4nO2cy4sdRRSHvxaZaIwL8YWaLDSZWZiFSzcmBjVqNqJBDRoE8U8QNBERNAky7kXRrETwtVP0KoPKOMGlGsVImIAuJIpEJdGYzGy8LioDTk1X366uqj6nu+uDs7g99546p35T/ThVXZDJZDKZTCaTyWQycdgJHAaOA2eBcUt2EpgF1qVPUSczwBe01+EuGzFAEbYDfyLf+YMUYQZdnT84ET5HvrNd9glwSbrU5dmJfCcPeiQcpjzpZeBp4PrE7Q9ehOOUJ7yvpfYHPxL+pjzZ61pqf/DXBFei0u0PRgStAowq/tar05FWAaaADyr+3puRoFUAGIgImgWAAYigXQDouQhdEAB6LEJXBICeitAlAaCHInRNAOiZCF0UAHokQlcFgJ6I0GUBoAcidF0A6LgI0gK4yuG+E0GdFUFaANeE0P4GvtbRwSqqtACvO9pfBp4BbvD01zkRpAW4qyKGlKZGBGkBAOYr4khps20kNwkNAtwInKqIJZX92kZyk9AgAMA24I+KeFKZOJoC20L7q/TE0RjYncBrwA+4nxNUCFCEOqgIIoZvTSTJ86KQH2fCyQIIkwUQJgtQnyeBd4AfpQOx0XgXlJrNwLPAd6GO8l2QMPkUJMzF0gEIswHzdud2YCswDVxz4TiYd5x/A04Ax4AF4MiF42ro2jWgAHYB7wFL+D/5ngfeBe5FyWk2VIAp4CXglwpfPnYEuMLR1kOYC2esMsRRYLdHrkkIFWC2woevfUz5nO008GnEdmybwxQCRQgV4GSFDx9bANaX+N9L+oLcGPgLeMQj72hoEOAn4GrLbwE8H8G3r83S8rUhVIDQU9AScIvlswBebejvQ8xE/kYmT8677BVaFCFUgCmMCE1HwlMlPl9s6GuM6fgVNgX4OejRB0GEChCbPRUx1TGbEF97E+RXO0AJpgm/4NqE+DqDqRslRZMAMW41bUL9zUXPsmaAbfNgRSySAoyBByLnWivANimI94RrE8PnURLeFWkQYFdFHBoEGAP3lAXel3L0E9IB1ODxVI6lR8DlNKtqtj0CzlFSKtEwAnyroW9Yv78NJauUJ3ApJtZVaBDgAGZrs7obPNnzsLfHDScpO+wDGgR4zPP731qft8YKpAXWxKpBAF9+tj7PiETRjDWxahDgTc/vn7E+X+n43keYwlrhaTa+v9+EmRgq46pJyTUh9C7Itxpqz3gtO763ETlcVdSlFI1J34ZmARzWFr872h8hI8LKKagsplMpGpQWwPWesLYHsTHmhZFVaLgIh3JCOgAPFu0DfRDge+kAPDhmH+iDAAvSAXgwn8Kp9DVgA2a5oPZrwD8oLcaFchazy4l23sdURKMjPQLALJTVPgLujprx/4i1X08IBfCVIw4NAnxDwinJmPv1hLDbEYcGAe6LnOsqqvbr2U+7I2HOEYukAKPoWVpI7dfzL3CHFcsWzCplLQKcBm6q1YuBfBYYaFNbZG119OFAnzYhvh6t2X/BTCOzVcwYeK4knkMB/mItzn3Bo/+iILVfz3ngViuWArNEvIm/lSpqVVVzkr3crAvDkdivZ4xZUWGXngvMEvG2Y2n9P7+MNvfrWbGvgctKYtmDmcZM3f5pzEuAmRI2YzZdTdX5I8y+dZkJ3I95Ko056pI+ZPWRArNQ9m1Mccy3088Bb2FqO8HlBRVveguyHrNccAdwM2bdzrWs3apgETOZMg98SaKqZiaTyWSGxX8Vdq5TA4WBpQAAAABJRU5ErkJggg=="/>
                                            </button>
                                        </center>
                                    </td>
                                    <td>
                                        <center>
                                            <button data-open={false}  id={`exdoc-${day5}-${idx}`}  style={{border:'1px solid black',borderRadius:5,backgroundColor:'whitesmoke'}} onClick={() => handleOpen(day5,idx)} onLoad={onLoadExerciseMark(day5,idx)} className="btn shadow-sm btn-sm">
                                              <img id={`img-exdoc-${day5}-${idx}`} style={{width:15,height:20}} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAABmJLR0QA/wD/AP+gvaeTAAAFC0lEQVR4nO2cy4sdRRSHvxaZaIwL8YWaLDSZWZiFSzcmBjVqNqJBDRoE8U8QNBERNAky7kXRrETwtVP0KoPKOMGlGsVImIAuJIpEJdGYzGy8LioDTk1X366uqj6nu+uDs7g99546p35T/ThVXZDJZDKZTCaTyWQycdgJHAaOA2eBcUt2EpgF1qVPUSczwBe01+EuGzFAEbYDfyLf+YMUYQZdnT84ET5HvrNd9glwSbrU5dmJfCcPeiQcpjzpZeBp4PrE7Q9ehOOUJ7yvpfYHPxL+pjzZ61pqf/DXBFei0u0PRgStAowq/tar05FWAaaADyr+3puRoFUAGIgImgWAAYigXQDouQhdEAB6LEJXBICeitAlAaCHInRNAOiZCF0UAHokQlcFgJ6I0GUBoAcidF0A6LgI0gK4yuG+E0GdFUFaANeE0P4GvtbRwSqqtACvO9pfBp4BbvD01zkRpAW4qyKGlKZGBGkBAOYr4khps20kNwkNAtwInKqIJZX92kZyk9AgAMA24I+KeFKZOJoC20L7q/TE0RjYncBrwA+4nxNUCFCEOqgIIoZvTSTJ86KQH2fCyQIIkwUQJgtQnyeBd4AfpQOx0XgXlJrNwLPAd6GO8l2QMPkUJMzF0gEIswHzdud2YCswDVxz4TiYd5x/A04Ax4AF4MiF42ro2jWgAHYB7wFL+D/5ngfeBe5FyWk2VIAp4CXglwpfPnYEuMLR1kOYC2esMsRRYLdHrkkIFWC2woevfUz5nO008GnEdmybwxQCRQgV4GSFDx9bANaX+N9L+oLcGPgLeMQj72hoEOAn4GrLbwE8H8G3r83S8rUhVIDQU9AScIvlswBebejvQ8xE/kYmT8677BVaFCFUgCmMCE1HwlMlPl9s6GuM6fgVNgX4OejRB0GEChCbPRUx1TGbEF97E+RXO0AJpgm/4NqE+DqDqRslRZMAMW41bUL9zUXPsmaAbfNgRSySAoyBByLnWivANimI94RrE8PnURLeFWkQYFdFHBoEGAP3lAXel3L0E9IB1ODxVI6lR8DlNKtqtj0CzlFSKtEwAnyroW9Yv78NJauUJ3ApJtZVaBDgAGZrs7obPNnzsLfHDScpO+wDGgR4zPP731qft8YKpAXWxKpBAF9+tj7PiETRjDWxahDgTc/vn7E+X+n43keYwlrhaTa+v9+EmRgq46pJyTUh9C7Itxpqz3gtO763ETlcVdSlFI1J34ZmARzWFr872h8hI8LKKagsplMpGpQWwPWesLYHsTHmhZFVaLgIh3JCOgAPFu0DfRDge+kAPDhmH+iDAAvSAXgwn8Kp9DVgA2a5oPZrwD8oLcaFchazy4l23sdURKMjPQLALJTVPgLujprx/4i1X08IBfCVIw4NAnxDwinJmPv1hLDbEYcGAe6LnOsqqvbr2U+7I2HOEYukAKPoWVpI7dfzL3CHFcsWzCplLQKcBm6q1YuBfBYYaFNbZG119OFAnzYhvh6t2X/BTCOzVcwYeK4knkMB/mItzn3Bo/+iILVfz3ngViuWArNEvIm/lSpqVVVzkr3crAvDkdivZ4xZUWGXngvMEvG2Y2n9P7+MNvfrWbGvgctKYtmDmcZM3f5pzEuAmRI2YzZdTdX5I8y+dZkJ3I95Ko056pI+ZPWRArNQ9m1Mccy3088Bb2FqO8HlBRVveguyHrNccAdwM2bdzrWs3apgETOZMg98SaKqZiaTyWSGxX8Vdq5TA4WBpQAAAABJRU5ErkJggg=="/>
                                            </button>
                                        </center>
                                    </td>
                                    <td>
                                        <center>
                                            <button data-open={false}  id={`exdoc-${day6}-${idx}`} onLoad={onLoadExerciseMark(day6,idx)}   style={{border:'1px solid black',borderRadius:5,backgroundColor:'whitesmoke'}} onClick={() => handleOpen(day6,idx)} className="btn shadow-sm btn-sm">
                                              <img id={`img-exdoc-${day6}-${idx}`} style={{width:15,height:20}} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAABmJLR0QA/wD/AP+gvaeTAAAFC0lEQVR4nO2cy4sdRRSHvxaZaIwL8YWaLDSZWZiFSzcmBjVqNqJBDRoE8U8QNBERNAky7kXRrETwtVP0KoPKOMGlGsVImIAuJIpEJdGYzGy8LioDTk1X366uqj6nu+uDs7g99546p35T/ThVXZDJZDKZTCaTyWQycdgJHAaOA2eBcUt2EpgF1qVPUSczwBe01+EuGzFAEbYDfyLf+YMUYQZdnT84ET5HvrNd9glwSbrU5dmJfCcPeiQcpjzpZeBp4PrE7Q9ehOOUJ7yvpfYHPxL+pjzZ61pqf/DXBFei0u0PRgStAowq/tar05FWAaaADyr+3puRoFUAGIgImgWAAYigXQDouQhdEAB6LEJXBICeitAlAaCHInRNAOiZCF0UAHokQlcFgJ6I0GUBoAcidF0A6LgI0gK4yuG+E0GdFUFaANeE0P4GvtbRwSqqtACvO9pfBp4BbvD01zkRpAW4qyKGlKZGBGkBAOYr4khps20kNwkNAtwInKqIJZX92kZyk9AgAMA24I+KeFKZOJoC20L7q/TE0RjYncBrwA+4nxNUCFCEOqgIIoZvTSTJ86KQH2fCyQIIkwUQJgtQnyeBd4AfpQOx0XgXlJrNwLPAd6GO8l2QMPkUJMzF0gEIswHzdud2YCswDVxz4TiYd5x/A04Ax4AF4MiF42ro2jWgAHYB7wFL+D/5ngfeBe5FyWk2VIAp4CXglwpfPnYEuMLR1kOYC2esMsRRYLdHrkkIFWC2woevfUz5nO008GnEdmybwxQCRQgV4GSFDx9bANaX+N9L+oLcGPgLeMQj72hoEOAn4GrLbwE8H8G3r83S8rUhVIDQU9AScIvlswBebejvQ8xE/kYmT8677BVaFCFUgCmMCE1HwlMlPl9s6GuM6fgVNgX4OejRB0GEChCbPRUx1TGbEF97E+RXO0AJpgm/4NqE+DqDqRslRZMAMW41bUL9zUXPsmaAbfNgRSySAoyBByLnWivANimI94RrE8PnURLeFWkQYFdFHBoEGAP3lAXel3L0E9IB1ODxVI6lR8DlNKtqtj0CzlFSKtEwAnyroW9Yv78NJauUJ3ApJtZVaBDgAGZrs7obPNnzsLfHDScpO+wDGgR4zPP731qft8YKpAXWxKpBAF9+tj7PiETRjDWxahDgTc/vn7E+X+n43keYwlrhaTa+v9+EmRgq46pJyTUh9C7Itxpqz3gtO763ETlcVdSlFI1J34ZmARzWFr872h8hI8LKKagsplMpGpQWwPWesLYHsTHmhZFVaLgIh3JCOgAPFu0DfRDge+kAPDhmH+iDAAvSAXgwn8Kp9DVgA2a5oPZrwD8oLcaFchazy4l23sdURKMjPQLALJTVPgLujprx/4i1X08IBfCVIw4NAnxDwinJmPv1hLDbEYcGAe6LnOsqqvbr2U+7I2HOEYukAKPoWVpI7dfzL3CHFcsWzCplLQKcBm6q1YuBfBYYaFNbZG119OFAnzYhvh6t2X/BTCOzVcwYeK4knkMB/mItzn3Bo/+iILVfz3ngViuWArNEvIm/lSpqVVVzkr3crAvDkdivZ4xZUWGXngvMEvG2Y2n9P7+MNvfrWbGvgctKYtmDmcZM3f5pzEuAmRI2YzZdTdX5I8y+dZkJ3I95Ko056pI+ZPWRArNQ9m1Mccy3088Bb2FqO8HlBRVveguyHrNccAdwM2bdzrWs3apgETOZMg98SaKqZiaTyWSGxX8Vdq5TA4WBpQAAAABJRU5ErkJggg=="/>
                                            </button>
                                        </center>
                                    </td>
                                    <td>
                                        <center>
                                            <button data-open={false}  id={`exdoc-${day7}-${idx}`} onLoad={onLoadExerciseMark(day7,idx)} style={{border:'1px solid black',borderRadius:5,backgroundColor:'whitesmoke'}} onClick={() => handleOpen(day7,idx)} className="btn shadow-sm btn-sm">
                                              <img id={`img-exdoc-${day7}-${idx}`}  style={{width:15,height:20}} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAABmJLR0QA/wD/AP+gvaeTAAAFC0lEQVR4nO2cy4sdRRSHvxaZaIwL8YWaLDSZWZiFSzcmBjVqNqJBDRoE8U8QNBERNAky7kXRrETwtVP0KoPKOMGlGsVImIAuJIpEJdGYzGy8LioDTk1X366uqj6nu+uDs7g99546p35T/ThVXZDJZDKZTCaTyWQycdgJHAaOA2eBcUt2EpgF1qVPUSczwBe01+EuGzFAEbYDfyLf+YMUYQZdnT84ET5HvrNd9glwSbrU5dmJfCcPeiQcpjzpZeBp4PrE7Q9ehOOUJ7yvpfYHPxL+pjzZ61pqf/DXBFei0u0PRgStAowq/tar05FWAaaADyr+3puRoFUAGIgImgWAAYigXQDouQhdEAB6LEJXBICeitAlAaCHInRNAOiZCF0UAHokQlcFgJ6I0GUBoAcidF0A6LgI0gK4yuG+E0GdFUFaANeE0P4GvtbRwSqqtACvO9pfBp4BbvD01zkRpAW4qyKGlKZGBGkBAOYr4khps20kNwkNAtwInKqIJZX92kZyk9AgAMA24I+KeFKZOJoC20L7q/TE0RjYncBrwA+4nxNUCFCEOqgIIoZvTSTJ86KQH2fCyQIIkwUQJgtQnyeBd4AfpQOx0XgXlJrNwLPAd6GO8l2QMPkUJMzF0gEIswHzdud2YCswDVxz4TiYd5x/A04Ax4AF4MiF42ro2jWgAHYB7wFL+D/5ngfeBe5FyWk2VIAp4CXglwpfPnYEuMLR1kOYC2esMsRRYLdHrkkIFWC2woevfUz5nO008GnEdmybwxQCRQgV4GSFDx9bANaX+N9L+oLcGPgLeMQj72hoEOAn4GrLbwE8H8G3r83S8rUhVIDQU9AScIvlswBebejvQ8xE/kYmT8677BVaFCFUgCmMCE1HwlMlPl9s6GuM6fgVNgX4OejRB0GEChCbPRUx1TGbEF97E+RXO0AJpgm/4NqE+DqDqRslRZMAMW41bUL9zUXPsmaAbfNgRSySAoyBByLnWivANimI94RrE8PnURLeFWkQYFdFHBoEGAP3lAXel3L0E9IB1ODxVI6lR8DlNKtqtj0CzlFSKtEwAnyroW9Yv78NJauUJ3ApJtZVaBDgAGZrs7obPNnzsLfHDScpO+wDGgR4zPP731qft8YKpAXWxKpBAF9+tj7PiETRjDWxahDgTc/vn7E+X+n43keYwlrhaTa+v9+EmRgq46pJyTUh9C7Itxpqz3gtO763ETlcVdSlFI1J34ZmARzWFr872h8hI8LKKagsplMpGpQWwPWesLYHsTHmhZFVaLgIh3JCOgAPFu0DfRDge+kAPDhmH+iDAAvSAXgwn8Kp9DVgA2a5oPZrwD8oLcaFchazy4l23sdURKMjPQLALJTVPgLujprx/4i1X08IBfCVIw4NAnxDwinJmPv1hLDbEYcGAe6LnOsqqvbr2U+7I2HOEYukAKPoWVpI7dfzL3CHFcsWzCplLQKcBm6q1YuBfBYYaFNbZG119OFAnzYhvh6t2X/BTCOzVcwYeK4knkMB/mItzn3Bo/+iILVfz3ngViuWArNEvIm/lSpqVVVzkr3crAvDkdivZ4xZUWGXngvMEvG2Y2n9P7+MNvfrWbGvgctKYtmDmcZM3f5pzEuAmRI2YzZdTdX5I8y+dZkJ3I95Ko056pI+ZPWRArNQ9m1Mccy3088Bb2FqO8HlBRVveguyHrNccAdwM2bdzrWs3apgETOZMg98SaKqZiaTyWSGxX8Vdq5TA4WBpQAAAABJRU5ErkJggg=="/>
                                            </button>
                                        </center>
                                    </td>
                                    </tr>
                                ))}
                            
                                </tbody>
                            </table>
                            </div>
                        </div>
                    </div>
           </div>

         
          <div className="container mt-4" style={{display:'flex',flexDirection:'row'}}>
               <Card style={{paddingInlineStart:10,paddingInlineEnd:10,backgroundColor:"whitesmoke",border:'1px dashed black',width:200,height:80}}>
                  
                    <div style={{display:'flex',alignItems:'center',fontSize:14,fontWeight:'bolder',alignContent:'center',justifyContent:'center'}}>
                        Warmup<span id="wormupview" onClick={()=>{
                             if(document.getElementById("wormupview").getAttribute("data-contentId")!=null){
                                history.push(`/admin/${gymId}/content/${document.getElementById("wormupview").getAttribute("data-contentId")}`);
                              }else{
                                alert("Please select content");
                              }
                        }} style={{fontSize:18,color:'#03203C',marginLeft:2}} role="button" class="material-icons">launch</span>
                    </div>
                    &nbsp;
                   <Card  
                   onClick={()=>{
                       document.getElementById("wormupdrop").style.display="block";
                       document.getElementById("wormupdrop").addEventListener('mouseleave',onMouseLeave);

                       function onMouseLeave(e){
                         document.getElementById("wormupdrop").style.display="none";
                         document.getElementById("wormupdrop").removeEventListener('mouseleave',onMouseLeave);
                       }
                   }} style={{display:'flex',justifyContent:'space-between',paddingInlineStart:10,paddingInlineEnd:2,height:30,flexDirection:'row'}}>
                        <span>
                            <p style={{fontWeight:'bold',paddingTop:2,overflow:'hidden',color:'black',fontSize:12}}>{warmup}</p>
                        </span>
                        <span role='button' style={{paddingTop:2}}>
                          <img style={{height:25,width:25}} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAABmJLR0QA/wD/AP+gvaeTAAADXUlEQVR4nO2dS2vUUBiGH60ouHJEcCGCLf4NRbzsXGiRDpYq4sKFS0EpLkX8F4oLQfBPtKv+iba2XjbipYJ2wAutiyQyDElOZk6S75zJ+8Ch7UzyzZf3aU5CGzgghBBCCCFE6xzw3H8OOAWcrKFWbOwDn4CPwFabH3wceAZspk1oJFk8BXoeuVZiEdgxPNDQxzegP3G6Dh4DewEcZOhjD1ieMONCFlH440pYqBJslQtnD9ggmftFdXaAsyTTUiEHKxR6iMKfhB7wwLVRlTPgLTDr3U432SQ5CwpxCZhLi4jJmQW2i950TUGn6+2lk5Rm6BKgud+fE2VvugR07c8LTVCaYZW7INEgEmCMBBgjAcZIgDESYIwEGCMBxkiAMRJgjAQYIwHGSIAxEmCMBBgjAcZIgDGHGq4/AJ4DR4A7wOGGP68ufgMv0693gaNWjczj94TY9aFaF4Bdz3ptjN2014xrnvXmywJuegpaG/p+FbhKclaEyoCkx9Wh19YKtq2FpgXcHPl5hXAlZOGvjLy+aNDLf3ynoL/AUk7dc8APz9p1TzsXc/pcAP541i6dglz4CohBQpPhByEgk3Arp761hKbDD0ZAiBJ2gUs5/dQZflACQpLQVvjBCQhBQpvhBynAUkLb4QcrwEKCRfhBC2hTglX4wQtoQ8IAu/CjEFAm4Tx+EgbA5Zy6bYUfjYAmJIQQflQC6pQQSvjRCXBJ+Flh/5DCj1KAj4TQwo9WQCbhdk5PRRKKwu9jF37UAsaREGr40QuoIiHk8KdCQCYh7586V9IxylK6j3XfUyMgk5B3JowSym9+JQExPZg1A7ygXEIfeEXzzzvVRkwCoFxCdOFDfAIgX0KU4UOEDadkEgB+EWn4EGnTKcMSZiwb8SFmARBx8BkxXgOmCgkwRgKMkQBjJMAYCTBGAoyRAGMkwBgJMEYCjJEAY1wC9lvpYropzdAl4GuNjXSVz2VvugR8qLGRrlKaoUvAFrBeXy+dYwN4V7ZBlYvwm3p66SSvXRtUWaDhGMk6MlpNYzxqW8bqO3Af3RGNwz5wD0f447KMVtOrMvaARxNm7KRPcmtqfZChji/AjYnTrUiPZOnWDcMDDW2sA09Irpdj4btK0hmSdbK6vKDzexy3mkIIIYQQQgTGP3Ff72m1ufBTAAAAAElFTkSuQmCC"/>
                        </span>
                   </Card>
                   <div id="wormupdrop" class="dropdowncontent">
                     {
                         MainExercise.map(data=>{
                             return(
                                 <a id={`a-${data._id}`} data-name={data.exName} onClick={e=>{
                                    e.preventDefault();
                                    updatePlanner(user._id,token,props.match.params.itemId,{wormup:data._id}).then(data=>{
                                        if(data.error){
                                            throw "Something went wrong please try again"
                                        }else{
                                          if(data.wormup){
                                            document.getElementById("wormupview").setAttribute('data-contentId',data.wormup)
                                          }
                                          return {wormup:data.wormup}   
                                        }
                                    }).then(data=>{
                                        if(data.wormup){
                                            getContent(user._id,token,data.wormup).then(data=>{
                                                if(data.error){
                                                    throw "Something went wrong please try again"
                                                }else{
                                                    setPlanner({...planner,warmup:data.exName})
                                                }
                                            })
                                        }else{
                                                    setPlanner({...planner,warmup:"Select Cooldown"})
                                        }
                                    }).catch(err=>console.log(err))
                                 }}>{data.exName}</a>
                             )
                         })
                     }     
                   </div>
               
               </Card>
               <Card style={{marginLeft:15,paddingInline:10,width:200,backgroundColor:"whitesmoke",border:'1px dashed black',height:80}}>
                    <div style={{display:'flex',alignItems:'center',fontSize:14,fontWeight:'bolder',alignContent:'center',justifyContent:'center'}}>
                        Cooldown<span id="cooldownview" onClick={()=>{
                             if(document.getElementById("cooldownview").getAttribute("data-contentId")!=null){
                                history.push(`/admin/${gymId}/content/${document.getElementById("cooldownview").getAttribute("data-contentId")}`);
                              }else{
                                alert("Please select content");
                              }
                        }} style={{fontSize:18,color:'#03203C',marginLeft:2}} role="button" class="material-icons">launch</span>
                    </div>
                    &nbsp;
                   <Card 
                    onClick={()=>{
                       document.getElementById("cooldndrop").style.display="block";
                       document.getElementById("cooldndrop").addEventListener('mouseleave',onMouseLeave);

                       function onMouseLeave(e){
                         document.getElementById("cooldndrop").style.display="none";
                         document.getElementById("cooldndrop").removeEventListener('mouseleave',onMouseLeave);
                       }
                    }} style={{display:'flex',justifyContent:'space-between',paddingInlineStart:10,paddingInlineEnd:2,height:30,flexDirection:'row'}}>
                        <span>
                            <p style={{fontWeight:'bold',paddingTop:2,overflow:'hidden',color:'black',fontSize:12}}>{cooldown}</p>
                        </span>
                        <span role='button' style={{paddingTop:2}}>
                          <img style={{height:25,width:25}} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAABmJLR0QA/wD/AP+gvaeTAAADXUlEQVR4nO2dS2vUUBiGH60ouHJEcCGCLf4NRbzsXGiRDpYq4sKFS0EpLkX8F4oLQfBPtKv+iba2XjbipYJ2wAutiyQyDElOZk6S75zJ+8Ch7UzyzZf3aU5CGzgghBBCCCFE6xzw3H8OOAWcrKFWbOwDn4CPwFabH3wceAZspk1oJFk8BXoeuVZiEdgxPNDQxzegP3G6Dh4DewEcZOhjD1ieMONCFlH440pYqBJslQtnD9ggmftFdXaAsyTTUiEHKxR6iMKfhB7wwLVRlTPgLTDr3U432SQ5CwpxCZhLi4jJmQW2i950TUGn6+2lk5Rm6BKgud+fE2VvugR07c8LTVCaYZW7INEgEmCMBBgjAcZIgDESYIwEGCMBxkiAMRJgjAQYIwHGSIAxEmCMBBgjAcZIgDGHGq4/AJ4DR4A7wOGGP68ufgMv0693gaNWjczj94TY9aFaF4Bdz3ptjN2014xrnvXmywJuegpaG/p+FbhKclaEyoCkx9Wh19YKtq2FpgXcHPl5hXAlZOGvjLy+aNDLf3ynoL/AUk7dc8APz9p1TzsXc/pcAP541i6dglz4CohBQpPhByEgk3Arp761hKbDD0ZAiBJ2gUs5/dQZflACQpLQVvjBCQhBQpvhBynAUkLb4QcrwEKCRfhBC2hTglX4wQtoQ8IAu/CjEFAm4Tx+EgbA5Zy6bYUfjYAmJIQQflQC6pQQSvjRCXBJ+Flh/5DCj1KAj4TQwo9WQCbhdk5PRRKKwu9jF37UAsaREGr40QuoIiHk8KdCQCYh7586V9IxylK6j3XfUyMgk5B3JowSym9+JQExPZg1A7ygXEIfeEXzzzvVRkwCoFxCdOFDfAIgX0KU4UOEDadkEgB+EWn4EGnTKcMSZiwb8SFmARBx8BkxXgOmCgkwRgKMkQBjJMAYCTBGAoyRAGMkwBgJMEYCjJEAY1wC9lvpYropzdAl4GuNjXSVz2VvugR8qLGRrlKaoUvAFrBeXy+dYwN4V7ZBlYvwm3p66SSvXRtUWaDhGMk6MlpNYzxqW8bqO3Af3RGNwz5wD0f447KMVtOrMvaARxNm7KRPcmtqfZChji/AjYnTrUiPZOnWDcMDDW2sA09Irpdj4btK0hmSdbK6vKDzexy3mkIIIYQQQgTGP3Ff72m1ufBTAAAAAElFTkSuQmCC"/>
                        </span>
                   </Card>
                   <div id="cooldndrop" class="dropdowncontent">
                     {
                         MainExercise.map(data=>{
                             return(
                                 <a id={`a-${data._id}`} data-name={data.exName} onClick={e=>{
                                    e.preventDefault();
                                    updatePlanner(user._id,token,props.match.params.itemId,{cooldown:data._id}).then(data=>{
                                        if(data.error){
                                            throw "Something went wrong please try again"
                                        }else{
                                          if(data.cooldown){
                                              document.getElementById("cooldownview").setAttribute("data-contentId",data.cooldown);
                                          }
                                          return {cooldown:data.cooldown}   
                                        }
                                    }).then(data=>{
                                        if(data.cooldown){
                                            getContent(user._id,token,data.cooldown).then(data=>{
                                                if(data.error){
                                                    throw "Something went wrong please try again"
                                                }else{
                                                    
                                                    setPlanner({...planner,cooldown:data.exName})
                                                }
                                            })
                                        }else{
                                                    setPlanner({...planner,cooldown:"Select Cooldown"})
                                        }
                                    }).catch(err=>console.log(err))
                                }}>{data.exName}</a>
                             )
                         })
                     }     
                   </div>
               
               </Card>           
          </div>
          

        </div>        
           


          
            <Dialog open={open} onClose={handleClose} TransitionComponent={Transition}>
                <div>
                    <div className="row ml-5 mt-4 mr-5 mb-4" style={{justifyContent: "space-between"}}> 
                        <div className="pl-4 pr-4 pb-2 pt-2 mb-3 mt-3 shadow-sm text-center" style={{outline: "none", borderRadius: 30, width: "50%", border: "none", color: "#ffffff", fontWeight: "bolder",backgroundColor: "rgb(255, 81, 0)", }}>
                            Set Exercise for {currentDay}
                        </div>
                        <button className="mt-1" style={{outline: "none", border: "0px",backgroundColor:"#ffffff"}} onClick={AddExercise}>
                            <span className="material-icons shadow" style={{fontSize:36,borderRadius:100, color :"rgb(255, 81, 0)"}}>add</span>
                        </button>
                    </div>
                    <select onChange={handleExercise("content")} value={content} className="pb-2 pl-4 pt-3 pb-3 mb-3 mt-1 ml-5 shadow" id="exMode" name="exMode" placeholder="Exercise Mode" style={{outline: "none", borderRadius: 30, width: "40%", border: "none", color: "#000", backgroundColor:"#ffffff"}}>
                        <option>Select Exercise</option>
                        {
                            MainExercise.map((data)=>{
                                return(
                                    <option value={data._id}>{data.exName}</option>
                                )
                            })
                        }
                    </select>
             
                    <input onChange={handleExercise("set")} value={set} className="pl-4 pb-2 pt-3 pb-3 mb-3 mt-1 ml-5 shadow" id="exLevel" name="exLevel" placeholder="Exercise Sets" style={{outline: "none", borderRadius: 30, width: "40%", border: "none", color: "#000", backgroundColor:"#ffffff"}}/>
                    <input onChange={handleExercise("rep")} value={rep} className="pl-4 pb-2 pt-3 pb-3 mb-3 mt-1 ml-5 shadow" id="exLevel" name="exLevel" placeholder="Exercise Repetition" style={{outline: "none", borderRadius: 30, width: "40%", border: "none", color: "#000", backgroundColor:"#ffffff"}}/>
                    <div style={{margin:5,fontSize:18,textAlign:'center'}}>Optional Exercise</div>
                    &nbsp;
                    <div style={{display:'flex',flexDirection:'row'}}>
                    <select  onChange={handleExercise("optionalEx1")} value={optionalEx1} className="pb-2 pl-4 pt-3 pb-3 mb-5 mt-1 ml-5 shadow" id="exMode" name="exMode" placeholder="Exercise Mode" style={{outline: "none", borderRadius: 30, width: "40%", border: "none", color: "#000", backgroundColor:"#ffffff"}}>
                        <option>Exercise 1</option>
                        {
                            MainExercise.map((data)=>{
                                return(
                                    <option value={data._id}>{data.exName}</option>
                                );
                            })
                        }
                    </select>                 
                    <select  onChange={handleExercise("optionalEx2")} value={optionalEx2} className="pb-2 pl-4 pt-3 pb-3 mb-5 mt-1 ml-5 shadow" id="exMode" name="exMode" placeholder="Exercise Mode" style={{outline: "none", borderRadius: 30, width: "40%", border: "none", color: "#000", backgroundColor:"#ffffff"}}>
                        <option>Exercise 2</option>
                        {
                            MainExercise.map((data)=>{
                                return(
                                    <option value={data._id}>{data.exName}</option>
                                )
                            })
                        }
                    </select>
                    </div>
              
                </div>
            </Dialog>

        </Dashboard>
    )
}

export default ManagePlanner;