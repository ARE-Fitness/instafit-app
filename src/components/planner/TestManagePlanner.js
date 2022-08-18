import React, {useState,useEffect} from 'react';
import { isAuthenticated } from '../../auth';
import Dashboard from '../../core/Dashboard';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import { getAllActiveMainExercise,getAllActiveCoolDownExercise,getAllActiveWarmUpExercise,addExercise,createPlanner,updatePlanner,getPlanner,getAllPlanner, getAllExercise, getExercise, getContent, updateExercise, deleteSelectedExercises, getAllContents } from '../helper/api';
import { getBranch } from '../../branch/helper/api';
import { getGym } from '../../gym/helper/api';
import { Card, CardContent } from '@material-ui/core';
import ArrowUp from "../../assets/arrow-sign.svg";
import ArrowDown from '../../assets/arrow-down.svg';
import Cross from "../../assets/cross.svg";
import {useHistory} from 'react-router-dom'
import ArrowExpand from "../../assets/arrow-expand.svg";
import ArrowCollapse from "../../assets/arrow-collapse.svg";

import ReactPlayer from 'react-player';

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

    const [currentVideo, setCurrentVideo] = useState("https://www.youtube.com/watch?v=lWXhih3xbVc");
    const [currentContent, setCurrentContent] = useState("Content Name");
    const [currentTitle, setCurrentTitle] = useState("10 Best Chest Exercises YOU Should Be Doing");

    const ItemId = props.match.params.branchId;
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
    const [optionalExNumber,setoptionalExNumber]=useState(2); // 0 means optional exercise one 1 means optional exercise two and 2 means optional execise 2
    // Hooks call for Create, Update & Delete
    const [planner, setPlanner] = useState({
        planner_name: "",
        warmup: "",
        cooldown: "",
        planner_freq:7,
        ex_frequency:[0,0,0,0,0,0,0],
        days_display_names:[],
        workDays:"",
        error: "",
        success: false,
        loading: false
    });
    const {planner_name,planner_freq, warmup, cooldown, workDays,ex_frequency,days_display_names} = planner;
    const [Exercise,setExercise]=useState({
        row:0,
        day:0,
        unit:"weight[KG]",
        defaultvalue:"",
        set:0,
        rep:0,
        content:"",
        optionalEx:[
            {
                unit:"weight[KG]",
                defaultvalue:"",
                set:0,
                rep:0,
                content:""
            },
            {
                unit:"weight[KG]",
                defaultvalue:"",
                set:0,
                rep:0,
                content:""
            }
        ]
    });
    const {row,day,unit,defaultvalue,set,rep,content,optionalEx}=Exercise;
    
    const [rows, setState] = useState({
        day1:[],
        day2:[],
        day3:[],
        day4:[],
        day5:[],
        day6:[],
        day7:[]
    });
    const [selectedContentList, setSelectedContentList] = useState([]);
    const [selecteddaynumber,setSelecteddaynumber]=useState(1);
    const [Excercises,setExercises]=useState([]);
    const [wormcoolContents,setwormcoolContents]=useState([]);
    const [isOpenContentModal,setIsOpenContentModal]=useState(false);
    // User Authentication
    const {user,token} = isAuthenticated();
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

    //API calls
    const ActiveMainExercise = gymId => {
        getAllActiveMainExercise(user._id, token, gymId).then(data => {
            if(data.error){
                console.log("error in DB")
            }else{ 
                setMainExercise(data);
                GetPlanner(data);
            }
        }).catch(err=>console.log(err));
    };
    const GetAllCoolDownExercise=gymId=>{
        getAllActiveCoolDownExercise(user._id, token, gymId).then(data => {
            if(data.error){
                console.log("error in DB")
            }else{ 
                let item=data.find(doc=>doc._id==cooldown);
                if(item){
                    document.getElementById('id-selected-exercise-name').innerHTML=item.exName;
                }
                setwormcoolContents(data);
            }
        }).catch(err=>console.log(err));
    }
    const GetAllWormUpExercise=gymId=>{
        getAllActiveWarmUpExercise(user._id, token, gymId).then(data => {
            if(data.error){
                console.log("error in DB")
            }else{ 
                let item=data.find(doc=>doc._id==warmup);
                if(item){
                    document.getElementById('id-selected-exercise-name').innerHTML=item.exName;
                }
                setwormcoolContents(data);
            }
        }).catch(err=>console.log(err));
    }
    //add exercise
    //todo add data to server
    const AddExercise=event=>{
        event.preventDefault();
        console.log("clicked")
        console.log(Exercise)
        let freq_number=row;
        let day_number=selecteddaynumber;
        if(rows['day'+day_number][freq_number].id==""){
            addExercise(user._id,token,props.match.params.itemId,{freq_number,day_number,rep,set,content,unit,defaultvalue,optionalEx,active:true}).then(data=>{
                if(data.error){
                    throw "Something went wrong please wait"
                }else{
                    GetPlanner(MainExercise);
                    handleClose()
                }
            }).catch(err=>console.log(err));
        }else{
            updateExercise(user._id,token,rows['day'+day_number][freq_number].id,{freq_number,day_number,rep,set,content,unit,defaultvalue,optionalEx,active:true}).then(data=>{
                if(data.error){
                    throw "Something wesnt wrong please wait"
                }else{
                    GetPlanner(MainExercise);
                    handleClose()
                }
            }).catch(err=>console.log(err));
        }
    };
    const onLoadExerciseMark=(ex_frequency,contents,selecteddaynumber)=>{
        getAllExercise(user._id,token,props.match.params.plannerId).then(data=>{
            if(data.error){
                throw "Something went wrong try again";
            }else{
                setState(oldstate=>{
                    oldstate["day"+selecteddaynumber]=[];
                    for(let index=0;index<ex_frequency[selecteddaynumber-1];index++){ 
                        let item=data.find(doc=>doc.freq_number==index&&doc.day_number==selecteddaynumber&&doc.active);
                        if(item){
                            oldstate["day"+selecteddaynumber].push({
                                id:item._id,
                                freq_number: item.freq_number,
                                day_number:item.day_number,
                                unit:item.unit,
                                defaultvalue:item.defaultvalue,
                                set:item.set,
                                rep:item.rep,
                                content:item.content,
                                optionalEx:item.optionalEx,
                                active:item.active
                            })
                        }else{
                            oldstate["day"+selecteddaynumber].push({
                                id:"",
                                freq_number: 0,
                                day_number:1,
                                unit:"weight[KG]",
                                defaultvalue:0,
                                set:0,
                                rep:0,
                                content:"",
                                optionalEx:[
                                    {
                                        unit:"weight[KG]",
                                        defaultvalue:"",
                                        set:0,
                                        rep:0,
                                        content:""
                                    },
                                    {
                                        unit:"weight[KG]",
                                        defaultvalue:0,
                                        set:0,
                                        rep:0,
                                        content:""
                                    }
                                ],
                                active:true
                            });
                        }
                    
                    }
                    return ({...oldstate});
                }); 
            }
        }).catch(err=>console.log(err));
    };
    const EditData=fieldname=>()=>{
        var value,startupdating=false;
        value=document.getElementById(fieldname+"_id").value;
        startupdating=true;
       
        DisablePlannerDay(value);
        setTimeout(()=>{
           if(startupdating){
                updatePlanner(user._id,token,props.match.params.plannerId,{[fieldname]:value}).then(data=>{
                    if(data.error){
                        throw "Something went wrong please try again"
                    }else{
                        GetPlanner(MainExercise);
                    }
                }).catch(err=>console.log(err));
           }
        },0);
    };
    const saveDispplayNames=()=>{
        setTimeout(()=>{
            updatePlanner(user._id,token,props.match.params.plannerId,{days_display_names}).then(data=>{
                if(data.error){
                    throw "Something went wrong please try again"
                }else{
                    GetPlanner(MainExercise);
                }
            }).catch(err=>console.log(err));
        },0);
    }
    const onKeyDownUpdateExerciseFreq=event=>{
        event.preventDefault();
        let value=parseInt(document.getElementById('ex_frequency_id').value),fieldname="ex_frequency";
        let counter=value-1;
        if(counter>=0){
            let array=[];
            array=ex_frequency;
            array[selecteddaynumber-1]=counter;
            let exerciseids =findAndReturnExerciseIdForDeletion(counter);

            updatePlanner(user._id,token,props.match.params.plannerId,{[fieldname]:array}).then(data=>{
                if(data.error){
                    throw "Something went wrong please try again"
                }else{
                    document.getElementById('ex_frequency_id').value=counter;
                     if(exerciseids.length>0){
                        DeleteSelectedExercise(exerciseids);
                     }
                    onLoadExerciseMark(array,MainExercise,selecteddaynumber);
                    setPlanner({...planner,ex_frequency:data.ex_frequency});
                    DisablePlannerDay(planner_freq)
                }
            }).catch(err=>console.log(err));
            
        }
    }
    const onKeyUpUpdateExerciseFreq=event=>{
        event.preventDefault();
        let value=parseInt(document.getElementById('ex_frequency_id').value),fieldname="ex_frequency";
        let counter=value+1;
        if(counter<20){
            let array=[];
            array=ex_frequency;
            array[selecteddaynumber-1]=counter;
          
            updatePlanner(user._id,token,props.match.params.plannerId,{[fieldname]:array}).then(data=>{
                if(data.error){
                    throw "Something went wrong please try again"
                }else{
                    document.getElementById('ex_frequency_id').value=counter;
                    onLoadExerciseMark(array,MainExercise,selecteddaynumber);
                    setPlanner({...planner,ex_frequency:data.ex_frequency});
                }
            }).catch(err=>console.log(err));
            
       }
    }
    const onKeyPressEditData=event=>{
        var value=[],fieldname="ex_frequency";
        if(event.keyCode==13){
            value=ex_frequency;
            let ententeredvalue=value[selecteddaynumber-1];
            value[selecteddaynumber-1]=parseInt(document.getElementById(fieldname+"_id").value);
            let exerciseids =findAndReturnExerciseIdForDeletion(value[selecteddaynumber-1])
            setTimeout(()=>{
                    updatePlanner(user._id,token,props.match.params.plannerId,{[fieldname]:value}).then(data=>{
                        if(data.error){
                            throw "Something went wrong please try again";
                        }else{
                            if(data.ex_frequency[selecteddaynumber-1]<ententeredvalue&&exerciseids.length>0){
                                DeleteSelectedExercise(exerciseids);
                            }
                            document.getElementById("ex_frequency_id").value=data.ex_frequency[selecteddaynumber-1];
                            onLoadExerciseMark(data.ex_frequency,MainExercise,selecteddaynumber);
                            setPlanner({...planner,ex_frequency:data.ex_frequency});
                        }
                    }).catch(err=>console.log(err));
            },0)
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


    const toggleActiveMenu = data => {

        if(data.target.id == "main-exercise-tab"){
            document.getElementById("main-exercise-tab").classList.add("active-background");
            document.getElementById("optional-exercise-tab-1").classList.remove("active-background");
            document.getElementById("optional-exercise-tab-2").classList.remove("active-background");

            setCurrentVideo("https://www.youtube.com/watch?v=lWXhih3xbVc");
            setCurrentContent("Chest Press");
            setCurrentTitle("10 Best Chest Exercises YOU Should Be Doing");
        }

        if(data.target.id == "optional-exercise-tab-1"){
            document.getElementById("main-exercise-tab").classList.remove("active-background");
            document.getElementById("optional-exercise-tab-1").classList.add("active-background");
            document.getElementById("optional-exercise-tab-2").classList.remove("active-background");

            setCurrentVideo("https://youtu.be/GvRgijoJ2xY");
            setCurrentContent("Leg Press");
            setCurrentTitle("What Other Trainers Will Not Tell You: Building Huge Quads. Leg Press Done Right");
        }

        if(data.target.id == "optional-exercise-tab-2"){
            document.getElementById("main-exercise-tab").classList.remove("active-background");
            document.getElementById("optional-exercise-tab-1").classList.remove("active-background");
            document.getElementById("optional-exercise-tab-2").classList.add("active-background");

            setCurrentVideo("https://www.youtube.com/watch?v=INNtN1cMG9A");
            setCurrentContent("Squat");
            setCurrentTitle("SQUATS- 7 MISTAKES |DEEP INFO");
        }
    }

    const DeleteSelectedExercise=exercisesId=>{
        deleteSelectedExercises(user._id,token,props.match.params.plannerId,{exercisesId}).then(data=>{
            if(data.error){
                console.log('error in deletion')
            }else{
                alert('successfully deleted')
            }
        }).catch(err=>console.log(err))
    }
    const handleChange=event=>{
        event.preventDefault();
        setPlanner(oldstate=>{
            oldstate.days_display_names[selecteddaynumber-1]=event.target.value;
            return ({...planner})
        })
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
    const handleOpen = (day, row,exerciseId) => {
        setOpen(true);
        document.getElementById("main-ex").style.color = "#00a2ff";
        document.getElementById("main-ex").style.backgroundColor = "#f5f5f5";
        
        document.getElementById("option-1-ex").style.color = "#000000";
        document.getElementById("option-1-ex").style.backgroundColor = "transparent";
        
        document.getElementById("option-2-ex").style.color = "#000000";
        document.getElementById("option-2-ex").style.backgroundColor = "transparent";

        if(exerciseId!=""){
            getExercise(user._id,token,exerciseId).then(data=>{
                if(data.error){
                    throw data.error
                }else{
                    if(data.unit=="weight[KG]"||data.unit=="weight[LBS]"){
                        document.getElementById('weight-dropdown').value=data.unit;
                        document.getElementById("weight-unit").style.display = "flex";
                        document.getElementById("weight-unit-value").style.display = "flex";
                        document.getElementById("weight").style.border = "1px solid #42a5f5";
                        document.getElementById("Time").style.border = "1px solid #e2e2e2";
                        document.getElementById("Number").style.border = "1px solid #e2e2e2";
                        document.getElementById("Distance").style.border = "1px solid #e2e2e2";
                        document.getElementById("time-unit").style.display = "none";
                        document.getElementById("number-unit").style.display = "none";
                        document.getElementById("distance-unit").style.display = "none"; 
                        document.getElementById('weight-radio').checked=true;
                    }
                    if(data.unit=="number"){
                        document.getElementById("weight").style.border = "1px solid #e2e2e2";
                        document.getElementById("Time").style.border = "1px solid #e2e2e2";
                        document.getElementById("Number").style.border = "1px solid #42a5f5";
                        document.getElementById("Distance").style.border = "1px solid #e2e2e2";
                        document.getElementById("weight-unit").style.display = "none";
                        document.getElementById("time-unit").style.display = "none";
                        document.getElementById("number-unit").style.display = "flex";
                        document.getElementById("weight-unit-value").style.display = "none";
                        document.getElementById("distance-unit").style.display = "none";
                        document.getElementById('number-radio').checked=true;
                    }
                    if(data.unit=="duration"){
                        document.getElementById("weight").style.border = "1px solid #e2e2e2";
                        document.getElementById("Time").style.border = "1px solid #42a5f5";
                        document.getElementById("Number").style.border = "1px solid #e2e2e2";
                        document.getElementById("Distance").style.border = "1px solid #e2e2e2";
                        document.getElementById("weight-unit").style.display = "none";
                        document.getElementById("weight-unit-value").style.display = "none";
                        document.getElementById("time-unit").style.display = "flex";
                        document.getElementById("number-unit").style.display = "none";
                        document.getElementById("distance-unit").style.display = "none";
                        document.getElementById('time-radio').checked=true;
                    }
                    if(data.unit=="distance"){
                        document.getElementById("weight").style.border = "1px solid #e2e2e2";
                        document.getElementById("Time").style.border = "1px solid #e2e2e2";
                        document.getElementById("Number").style.border = "1px solid #e2e2e2";
                        document.getElementById("Distance").style.border = "1px solid #42a5f5";
                        document.getElementById("weight-unit").style.display = "none";
                        document.getElementById("weight-unit-value").style.display = "none";
                        document.getElementById("time-unit").style.display = "none";
                        document.getElementById("number-unit").style.display = "none";
                        document.getElementById("distance-unit").style.display = "flex";
                        document.getElementById('distance-radio').checked=true;
                    }
                    setExercise({
                        ...Exercise,
                        day:data.day_number,
                        row:data.freq_number,
                        set:data.set,
                        rep:data.rep,
                        defaultvalue:data.defaultvalue,
                        unit:data.unit,
                        optionalEx:data.optionalEx,
                        content:data.content,
                    });
                }
            }).catch(err=>console.log(err))
        }else{
            document.getElementById('weight-dropdown').value="weight[KG]";
            document.querySelector(".select-exercise-text").innerHTML="Select Main Exercise";
            document.getElementById("weight-unit").style.display = "flex";
            document.getElementById("weight-unit-value").style.display = "flex";
            document.getElementById("weight").style.border = "1px solid #42a5f5";
            document.getElementById("Time").style.border = "1px solid #e2e2e2";
            document.getElementById("Number").style.border = "1px solid #e2e2e2";
            document.getElementById("Distance").style.border = "1px solid #e2e2e2";
            document.getElementById("time-unit").style.display = "none";
            document.getElementById("number-unit").style.display = "none";
            document.getElementById("distance-unit").style.display = "none"; 
            document.getElementById('weight-radio').checked=true;
            setExercise({
                ...Exercise,
                day,
                row,
                set:0,
                rep:0,
                unit:'weight[KG]',
                defaultvalue:0,
                optionalEx:[
                    {
                        unit:"weight[KG]",
                        defaultvalue:0,
                        set:0,
                        rep:0,
                        content:""
                    },
                    {
                        unit:"weight[KG]",
                        defaultvalue:0,
                        set:0,
                        rep:0,
                        content:""
                    }
                ],
                content:"",
            });
        }
    };
    const handleClose = () => {
        setOpen(false);
    };
    //handle ex in forms
    const handleExercise=(name,optype,data)=>event=>{
       let value=optype==0?event.target.value:data._id;

       setExercise(oldstate=>{
            if(optionalExNumber==2){
                oldstate[name]=value;
            }else{
                oldstate.optionalEx[optionalExNumber][name]=value
            }
            return ({...oldstate});
        });
        if(optype==1){
            document.querySelector(".select-exercise-text").innerHTML=data.exName;
        }
        console.log(event)
        event.stopPropagation();
    };
    //API
    const GetBranch=()=>{
        getBranch(user._id,token,props.match.params.accountId).then(async branch=>{
            if(branch.error){
                console.log("error to  featch data try after some time")
                // try{
                //     let data=await GetAllContents(true);
                //     if(data!=false){
                       GetPlanner([]);
                //     }
                // }catch(err){
   
                // }
            }else{

                // try{
                // let contents=await GetAllContents(true);
                // if(contents!=false){
                //     let mainexercise=await sortArrayList(1,contents);
                //     if(mainexercise&&mainexercise.length>0){
                //         setMainExercise(mainexercise)
                //     }
                

                // }
                // }catch(err){

                // }
                getGym(user._id,token,branch.gymId).then(gym=>{
                    if(gym.error){console.log(gym.error)}else{
                        setBranch({branchName:branch.branchName,totalmembers:branch.memberList.length,totaladminusers:branch.branchAdminList.length,branchId:branch._id,phone:gym.phone,email:gym.email,gymId:gym._id,gymName:gym.gymName})
                        ActiveMainExercise(gym._id);
                    }
                })
            }
        }).catch(async ()=>{
            //  try{
            //      let data=await GetAllContents(true);
            //      if(data!=false){
                    GetPlanner([]);
            //      }
            //  }catch(err){

            //  }
        })
    };

    const sortArrayList=(exMode,contents)=>{
        let list=[];
        let counter=0;
        contents.forEach(doc=>{
            counter++;
            if(doc.exMode==exMode){
                list.push(doc);
            }
            if(counter==contents.length){
                return list;
            }
        })
        
    }

    const GetAllContents=active=>{
        return getAllContents(user._id,token,).then(data=>{
            if(data.error){
                return false;
            }else{
               return data;
            }
        }).catch(err=>{
            return false;
        })
    }
    const GetPlanner=contents=>{
        getPlanner(user._id,token,props.match.params.plannerId).then(data=>{
                if(data.error){
                    throw "Something went wrong please try again"
                }else{
                    document.getElementById("planner_name_id").value=data.planner_name.substring(0,15)+`${data.planner_name.length>15?"...":""}`;
                    document.getElementById("planner_freq_id").value=data.planner_freq;
                    DisablePlannerDay(data.planner_freq)
                    document.getElementById("ex_frequency_id").value=data.ex_frequency[selecteddaynumber-1];
                    if(data.wormup){
                        document.getElementById("wormupview").setAttribute('data-contentId',data.wormup)
                    }
                    if(data.cooldown){
                        document.getElementById("cooldownview").setAttribute("data-contentId",data.cooldown);
                    }
                    return {wormup:data.wormup,cooldown:data.cooldown,days_display_names:data.days_display_names,planner_name:data.planner_name,planner_freq:data.planner_freq,ex_frequency:data.ex_frequency}
                }
        }).then(data=>{
                getContent(user._id,token,data.cooldown).then(d=>{
                   
                    if(d.error){
                        return {value1:"",days_display_names:data.days_display_names,planner_name:data.planner_name,planner_freq:data.planner_freq,ex_frequency:data.ex_frequency};
                    }else{

                        return {value1:d._id,days_display_names:data.days_display_names,planner_name:data.planner_name,planner_freq:data.planner_freq,ex_frequency:data.ex_frequency};
                    }
                }).then(d=>{
                        getContent(user._id,token,data.wormup).then(d2=>{
                            if(d2.error){
                                setPlanner({...planner,cooldown:d.value1,warmup:"",days_display_names:d.days_display_names,planner_name:d.planner_name,planner_freq:d.planner_freq,ex_frequency:d.ex_frequency})
                            }else{
                               setPlanner({...planner,cooldown:d.value1,warmup:d2._id,days_display_names:d.days_display_names,planner_name:d.planner_name,planner_freq:d.planner_freq,ex_frequency:d.ex_frequency});
                            }
                        })
                });
                onLoadExerciseMark(data.ex_frequency,contents,selecteddaynumber);
        }).catch(err=>console.log(err))
    };
    const selectMenu =day_number=>e=> {
        e.preventDefault();
        var id = e.target.id;
        var currentMenu = document.getElementById('menu-items').getElementsByTagName('div');
        for (var i=0; i<currentMenu.length; i++) {
            currentMenu[i].style.backgroundColor = "#ffffff";
        }
        document.getElementById(id).style.backgroundColor = '#ff8800';
        setSelecteddaynumber(day_number);
        document.getElementById("ex_frequency_id").value=ex_frequency[day_number-1];
        DisablePlannerDay(planner_freq)
        onLoadExerciseMark(ex_frequency,MainExercise,day_number);
    };
    const selectExercise = () => {
        if(document.getElementById("Exercise-list").style.display == "none"){
            document.getElementById("Exercise-list").style.display = "block";
            document.getElementById("Select-Exercise").src = ArrowDown;
        }else{
            document.getElementById("Exercise-list").style.display = "none";
            document.getElementById("Select-Exercise").src =ArrowUp;
        }
    };
    function weight(event){ 
        document.getElementById("weight-unit").style.display = "flex";
        document.getElementById("weight-unit-value").style.display = "flex";
        document.getElementById("weight").style.border = "1px solid #42a5f5";
        document.getElementById("Time").style.border = "1px solid #e2e2e2";
        document.getElementById("Number").style.border = "1px solid #e2e2e2";
        document.getElementById("Distance").style.border = "1px solid #e2e2e2";
        document.getElementById("time-unit").style.display = "none";
        document.getElementById("number-unit").style.display = "none";
        document.getElementById("distance-unit").style.display = "none"; 
        document.getElementById('weight-radio').checked=true;
        setExercise(oldstate=>{
            if(optionalExNumber==2){
                oldstate["unit"]="weight[KG]"
            }else{
                oldstate.optionalEx[optionalExNumber]["unit"]="weight[KG]";
            }
            return ({...oldstate});
        });
        event.stopPropagation()
    }
    function time(){
        document.getElementById("weight").style.border = "1px solid #e2e2e2";
        document.getElementById("Time").style.border = "1px solid #42a5f5";
        document.getElementById("Number").style.border = "1px solid #e2e2e2";
        document.getElementById("Distance").style.border = "1px solid #e2e2e2";
        document.getElementById("weight-unit").style.display = "none";
        document.getElementById("weight-unit-value").style.display = "none";
        document.getElementById("time-unit").style.display = "flex";
        document.getElementById("number-unit").style.display = "none";
        document.getElementById("distance-unit").style.display = "none";
        document.getElementById('time-radio').checked=true;
        setExercise(oldstate=>{
            if(optionalExNumber==2){
                oldstate["unit"]="duration";
            }else{
                oldstate.optionalEx[optionalExNumber]["unit"]="duration";
            }
            return ({...oldstate});
        });

    };
    function number(){
        document.getElementById("weight").style.border = "1px solid #e2e2e2";
        document.getElementById("Time").style.border = "1px solid #e2e2e2";
        document.getElementById("Number").style.border = "1px solid #42a5f5";
        document.getElementById("Distance").style.border = "1px solid #e2e2e2";
        document.getElementById("weight-unit").style.display = "none";
        document.getElementById("time-unit").style.display = "none";
        document.getElementById("number-unit").style.display = "flex";
        document.getElementById("weight-unit-value").style.display = "none";
        document.getElementById("distance-unit").style.display = "none";
        document.getElementById('number-radio').checked=true;
        setExercise(oldstate=>{
            if(optionalExNumber==2){
                oldstate["unit"]="number";
            }else{
                oldstate.optionalEx[optionalExNumber]["unit"]="number";
            }
            return ({...oldstate});
        });
    };
    function distance(){
        document.getElementById("weight").style.border = "1px solid #e2e2e2";
        document.getElementById("Time").style.border = "1px solid #e2e2e2";
        document.getElementById("Number").style.border = "1px solid #e2e2e2";
        document.getElementById("Distance").style.border = "1px solid #42a5f5";
        document.getElementById("weight-unit").style.display = "none";
        document.getElementById("weight-unit-value").style.display = "none";
        document.getElementById("time-unit").style.display = "none";
        document.getElementById("number-unit").style.display = "none";
        document.getElementById("distance-unit").style.display = "flex";
        document.getElementById('distance-radio').checked=true;
        setExercise(oldstate=>{
            if(optionalExNumber==2){
                oldstate["unit"]="distance";
            }else{
                oldstate.optionalEx[optionalExNumber]["unit"]="distance";
            }
            return ({...oldstate});
        });
    };

    

    const [exerciseId,setExerciseId]=useState("");
    const [Index,setIndex]=useState(0);



    const AssignExercie =(exerciseId,index)=>async ()=> {
        if(document.getElementById("set-exercise").style.display == "none"){
            await setIsOpenContentModal(true)
            await setExerciseId(exerciseId);
            await setIndex(index);
            document.getElementById("set-exercise").style.display = "block";
            
        }
    };

    const HandleNextPopup=async event=>{
        event.preventDefault();
        await setIsOpenContentModal(false)
        handleOpen(selecteddaynumber,Index,exerciseId);
      
    }

    const CloseExerciseBox = () => {
        if(document.getElementById("set-exercise").style.display == "block"){
            document.getElementById("set-exercise").style.display = "none";
        }
    };
    const checkNumberInputRange=range=>event=>{
        if(parseInt(event.target.value)>range){
            document.getElementById(event.target.id).value=range;
            }
            if(parseInt(event.target.value)<0){
            document.getElementById(event.target.id).value=0;
            }
    };

    const findandSetExercise=data=>{
       
        if(data._id==content){
            document.querySelector(`.select-exercise-text`).innerHTML=data.exName;
        }

    }

    const findAndSetContetInExerciseView=contentId=>{
        let item=MainExercise.find(doc=>doc._id==contentId);
        if(item){
            return item.exName;
        }else{
            return "Select Exercise"
        }
    }

    const OpenCoolWarmEx=optype=>event=> {  
        
        event.preventDefault()
        console.log(optype)
        if(document.getElementById("toggle-selected-exercise-container").style.display == "none"){
            if(optype==0){
                document.querySelector('.selected-exercise-type').innerHTML="Worm Up";
                document.querySelector('.selected-exercise-type').setAttribute("data-field","wormup");
                if(warmup==""){
                   document.getElementById("id-selected-exercise-name").innerHTML="Select Exercise"
                }
                GetAllWormUpExercise(gymId);
            }
            if(optype==1){
                
                document.querySelector('.selected-exercise-type').innerHTML="Cool Down";
                document.querySelector('.selected-exercise-type').setAttribute("data-field","cooldown");
                if(cooldown==""){
                   document.getElementById("id-selected-exercise-name").innerHTML="Select Exercise"
                }
                GetAllCoolDownExercise(gymId);
                
            }
            document.getElementById("toggle-selected-exercise-container").style.display = "block";
        }else{
            document.getElementById("toggle-selected-exercise-container").style.display = "none";
        }
    }

    const findAndReturnExerciseIdForDeletion=ex_frequency=>{
        let docs=rows['day'+selecteddaynumber];
        let docscopy=docs.slice(ex_frequency);
        let allids=[];
        docscopy.forEach(ele=>{
          if(ele.id!=""){
            allids.push(ele.id);
          }
        });
        console.log("ids",allids);
        return allids;
    }

    function OpenCoolWarmExList() {
        if(document.getElementById("exercise-list").style.display == "block"){
            document.getElementById("exercise-list").style.display = "none";
            document.getElementById("arrow-expand").style.display = "block";
            document.getElementById("arrow-collapse").style.display = "none";
        }else{
            document.getElementById("exercise-list").style.display = "block";
            document.getElementById("arrow-expand").style.display = "none";
            document.getElementById("arrow-collapse").style.display = "block";
        }
    }

    const selectMainEx = () => {

        setoptionalExNumber(2);
        setTimeout(()=>{


            let item = MainExercise.find(doc=>doc._id==content);
            if(item){
            document.querySelector(`.select-exercise-text`).innerHTML=item.exName;
            }else{
                document.querySelector(`.select-exercise-text`).innerHTML=`Select Main Exercise`;
            }
            
            document.getElementById("main-ex").style.color = "#00a2ff";
            document.getElementById("main-ex").style.backgroundColor = "#f5f5f5";
            
            document.getElementById("option-1-ex").style.color = "#000000";
            document.getElementById("option-1-ex").style.backgroundColor = "transparent";
            
            document.getElementById("option-2-ex").style.color = "#000000";
            document.getElementById("option-2-ex").style.backgroundColor = "transparent";

            if(unit=="weight[KG]"||unit=="weight[LBS]"){
                document.getElementById("weight-unit").style.display = "flex";
                document.getElementById("weight-unit-value").style.display = "flex";
                document.getElementById("weight").style.border = "1px solid #42a5f5";
                document.getElementById("Time").style.border = "1px solid #e2e2e2";
                document.getElementById("Number").style.border = "1px solid #e2e2e2";
                document.getElementById("Distance").style.border = "1px solid #e2e2e2";
                document.getElementById("time-unit").style.display = "none";
                document.getElementById("number-unit").style.display = "none";
                document.getElementById("distance-unit").style.display = "none"; 
                document.getElementById('weight-radio').checked=true;
            }
            if(unit=="number"){
                document.getElementById("weight").style.border = "1px solid #e2e2e2";
                document.getElementById("Time").style.border = "1px solid #e2e2e2";
                document.getElementById("Number").style.border = "1px solid #42a5f5";
                document.getElementById("Distance").style.border = "1px solid #e2e2e2";
                document.getElementById("weight-unit").style.display = "none";
                document.getElementById("time-unit").style.display = "none";
                document.getElementById("number-unit").style.display = "flex";
                document.getElementById("weight-unit-value").style.display = "none";
                document.getElementById("distance-unit").style.display = "none";
                document.getElementById('number-radio').checked=true;
            }
            if(unit=="duration"){
                document.getElementById("weight").style.border = "1px solid #e2e2e2";
                document.getElementById("Time").style.border = "1px solid #42a5f5";
                document.getElementById("Number").style.border = "1px solid #e2e2e2";
                document.getElementById("Distance").style.border = "1px solid #e2e2e2";
                document.getElementById("weight-unit").style.display = "none";
                document.getElementById("weight-unit-value").style.display = "none";
                document.getElementById("time-unit").style.display = "flex";
                document.getElementById("number-unit").style.display = "none";
                document.getElementById("distance-unit").style.display = "none";
                document.getElementById('time-radio').checked=true;
            }
            if(unit=="distance"){
                document.getElementById("weight").style.border = "1px solid #e2e2e2";
                document.getElementById("Time").style.border = "1px solid #e2e2e2";
                document.getElementById("Number").style.border = "1px solid #e2e2e2";
                document.getElementById("Distance").style.border = "1px solid #42a5f5";
                document.getElementById("weight-unit").style.display = "none";
                document.getElementById("weight-unit-value").style.display = "none";
                document.getElementById("time-unit").style.display = "none";
                document.getElementById("number-unit").style.display = "none";
                document.getElementById("distance-unit").style.display = "flex";
                document.getElementById('distance-radio').checked=true;
            }


        },0);
    }

    const selectOptionalExOne = () => {

        setoptionalExNumber(0);
        
        setTimeout(()=>{
            let item = MainExercise.find(doc=>doc._id==optionalEx[0]['content']);
            if(item){
             document.querySelector(`.select-exercise-text`).innerHTML=item.exName;
            }else{
                document.querySelector(`.select-exercise-text`).innerHTML=`Select Optional Exercise 1`
            }
    
            console.log(rows['day'+selecteddaynumber][0].optionalEx[0]);
            document.getElementById("main-ex").style.color = "#000000";
            document.getElementById("main-ex").style.backgroundColor = "transparent";
            
            document.getElementById("option-1-ex").style.color = "#00a2ff";
            document.getElementById("option-1-ex").style.backgroundColor = "#f5f5f5";
            
            document.getElementById("option-2-ex").style.color = "#000000";
            document.getElementById("option-2-ex").style.backgroundColor = "transparent";

            if(optionalEx[0]['unit']=="weight[KG]"||optionalEx[0]['unit']=="weight[LBS]"){
                document.getElementById("weight-unit").style.display = "flex";
                document.getElementById("weight-unit-value").style.display = "flex";
                document.getElementById("weight").style.border = "1px solid #42a5f5";
                document.getElementById("Time").style.border = "1px solid #e2e2e2";
                document.getElementById("Number").style.border = "1px solid #e2e2e2";
                document.getElementById("Distance").style.border = "1px solid #e2e2e2";
                document.getElementById("time-unit").style.display = "none";
                document.getElementById("number-unit").style.display = "none";
                document.getElementById("distance-unit").style.display = "none"; 
                document.getElementById('weight-radio').checked=true;

            }
            if(optionalEx[0]['unit']=="number"){
                document.getElementById("weight").style.border = "1px solid #e2e2e2";
                document.getElementById("Time").style.border = "1px solid #e2e2e2";
                document.getElementById("Number").style.border = "1px solid #42a5f5";
                document.getElementById("Distance").style.border = "1px solid #e2e2e2";
                document.getElementById("weight-unit").style.display = "none";
                document.getElementById("time-unit").style.display = "none";
                document.getElementById("number-unit").style.display = "flex";
                document.getElementById("weight-unit-value").style.display = "none";
                document.getElementById("distance-unit").style.display = "none";
                document.getElementById('number-radio').checked=true;
            }
            if(optionalEx[0]['unit']=="duration"){
                document.getElementById("weight").style.border = "1px solid #e2e2e2";
                document.getElementById("Time").style.border = "1px solid #42a5f5";
                document.getElementById("Number").style.border = "1px solid #e2e2e2";
                document.getElementById("Distance").style.border = "1px solid #e2e2e2";
                document.getElementById("weight-unit").style.display = "none";
                document.getElementById("weight-unit-value").style.display = "none";
                document.getElementById("time-unit").style.display = "flex";
                document.getElementById("number-unit").style.display = "none";
                document.getElementById("distance-unit").style.display = "none";
                document.getElementById('time-radio').checked=true;
            }
            if(optionalEx[0]['unit']=="distance"){
                document.getElementById("weight").style.border = "1px solid #e2e2e2";
                document.getElementById("Time").style.border = "1px solid #e2e2e2";
                document.getElementById("Number").style.border = "1px solid #e2e2e2";
                document.getElementById("Distance").style.border = "1px solid #42a5f5";
                document.getElementById("weight-unit").style.display = "none";
                document.getElementById("weight-unit-value").style.display = "none";
                document.getElementById("time-unit").style.display = "none";
                document.getElementById("number-unit").style.display = "none";
                document.getElementById("distance-unit").style.display = "flex";
                document.getElementById('distance-radio').checked=true;
            }
        },0);

    }

    const selectOptionalExTwo  = () => {
        setoptionalExNumber(1);
        setTimeout(()=>{
            let item = MainExercise.find(doc=>doc._id==optionalEx[1]['content']);
            if(item){
             document.querySelector(`.select-exercise-text`).innerHTML=item.exName;
            }else{
                document.querySelector(`.select-exercise-text`).innerHTML=`Select Optional Exercise 2`
            }
    
        
            document.getElementById("main-ex").style.color = "#000000";
            document.getElementById("main-ex").style.backgroundColor = "transparent";
            
            document.getElementById("option-1-ex").style.color = "#000000";
            document.getElementById("option-1-ex").style.backgroundColor = "transparent";
            
            document.getElementById("option-2-ex").style.color = "#00a2ff";
            document.getElementById("option-2-ex").style.backgroundColor = "#f5f5f5";

            if(optionalEx[1]['unit']=="weight[KG]"||optionalEx[1]['unit']=="weight[LBS]"){
                document.getElementById("weight-unit").style.display = "flex";
                document.getElementById("weight-unit-value").style.display = "flex";
                document.getElementById("weight").style.border = "1px solid #42a5f5";
                document.getElementById("Time").style.border = "1px solid #e2e2e2";
                document.getElementById("Number").style.border = "1px solid #e2e2e2";
                document.getElementById("Distance").style.border = "1px solid #e2e2e2";
                document.getElementById("time-unit").style.display = "none";
                document.getElementById("number-unit").style.display = "none";
                document.getElementById("distance-unit").style.display = "none"; 
                document.getElementById('weight-radio').checked=true;
            }
            if(optionalEx[1]['unit']=="number"){
                document.getElementById("weight").style.border = "1px solid #e2e2e2";
                document.getElementById("Time").style.border = "1px solid #e2e2e2";
                document.getElementById("Number").style.border = "1px solid #42a5f5";
                document.getElementById("Distance").style.border = "1px solid #e2e2e2";
                document.getElementById("weight-unit").style.display = "none";
                document.getElementById("time-unit").style.display = "none";
                document.getElementById("number-unit").style.display = "flex";
                document.getElementById("weight-unit-value").style.display = "none";
                document.getElementById("distance-unit").style.display = "none";
                document.getElementById('number-radio').checked=true;
            }
            if(optionalEx[1]['unit']=="duration"){
                document.getElementById("weight").style.border = "1px solid #e2e2e2";
                document.getElementById("Time").style.border = "1px solid #42a5f5";
                document.getElementById("Number").style.border = "1px solid #e2e2e2";
                document.getElementById("Distance").style.border = "1px solid #e2e2e2";
                document.getElementById("weight-unit").style.display = "none";
                document.getElementById("weight-unit-value").style.display = "none";
                document.getElementById("time-unit").style.display = "flex";
                document.getElementById("number-unit").style.display = "none";
                document.getElementById("distance-unit").style.display = "none";
                document.getElementById('time-radio').checked=true;
            }
            if(optionalEx[1]['unit']=="distance"){
                document.getElementById("weight").style.border = "1px solid #e2e2e2";
                document.getElementById("Time").style.border = "1px solid #e2e2e2";
                document.getElementById("Number").style.border = "1px solid #e2e2e2";
                document.getElementById("Distance").style.border = "1px solid #42a5f5";
                document.getElementById("weight-unit").style.display = "none";
                document.getElementById("weight-unit-value").style.display = "none";
                document.getElementById("time-unit").style.display = "none";
                document.getElementById("number-unit").style.display = "none";
                document.getElementById("distance-unit").style.display = "flex";
                document.getElementById('distance-radio').checked=true;
            }
        },0);
    }

  

    
    const updateCoolDownWormUp=(name,contentId)=>event=>{
        event.preventDefault();
        let field=document.querySelector(`.selected-exercise-type`).getAttribute('data-field');
        updatePlanner(user._id,token,props.match.params.itemId,{[field]:contentId}).then(data=>{
            if(data.error){
                console.log(data.error)
            }else{
                setPlanner({...planner,[field]:data[field]});
                document.getElementById('id-selected-exercise-name').innerHTML=name;
            }
        })

    }
 

    const DisablePlannerDay=value=>{
    
        if(value!=""&&value>-1&&value<=7){
            let planner_freq=value;
     
            if(planner_freq<7){
                for(let i=1;i<=7;i++){
                    let tab=document.getElementById('tabday'+i);
                    console.log(tab)
                    if(i>planner_freq){
                        tab.style.backgroundColor="#dddddd";
                        tab.style.pointerEvents="none";
                    }else{
                        if(selecteddaynumber==i)
                           tab.style.backgroundColor="#ff8800";
                        else
                           tab.style.backgroundColor="#ffffff";
                           
                        tab.style.pointerEvents="auto";
                    }
                }
            }
        }
    }



    useEffect(()=>{
        GetBranch();
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

            <div className="member-calender-header">
                <div style={{display:"flex", alignSelf:"center", alignItems:"flex-start"}}>
                    <input type="text" onBlur={EditData("planner_name")} className="name-text-field" id="planner_name_id"/>
                    <div style={{display:"flex", alignSelf:"center", alignItems:"flex-start", padding:"0.5vw 1vw", borderRadius: "8px", boxShadow: "0px 1px 2px #e0e0e0", margin: "0 1vw 0 0"}}>
                        <div style={{fontSize:"1vw", padding: "0 0.5vw 0 0"}}>Week Frequency</div>
                        <input onInput={checkNumberInputRange(7)} onBlur={EditData("planner_freq")} id="planner_freq_id" type="number" style={{width:"2vw", height:"1.5vw", textAlign:"center"}}/>
                    </div>
                    <div style={{display:"flex", alignSelf:"center", alignItems:"flex-start", padding:"0.5vw 1vw", borderRadius: "8px", boxShadow: "0px 1px 2px #e0e0e0"}}>
                        <div style={{fontSize:"1vw", padding: "0 0.5vw 0 0"}}>Exercise Frequency</div>
                        <input id="ex_frequency_id" onKeyUp={onKeyPressEditData} onInput={checkNumberInputRange(20)} defaultValue={0} type="number" style={{width:"2vw", height:"1.5vw", textAlign:"center"}}/>
                        <div style={{display:"block", width:"1vw", height:"1.5vw", margin:"-0.65vw 0 0 0.5vw"}}>
                            <span onClick={onKeyUpUpdateExerciseFreq} role="button"><img id="ex_frequency_arrowup_id" src={ArrowUp} style={{width:"1.2vw"}}></img></span>
                            <span onClick={onKeyDownUpdateExerciseFreq} role="button"><img id="ex_frequency_arrowdown_id" src={ArrowDown} style={{width:"1.2vw", margin:"-0.8vw 0 0 0"}}></img></span>
                        </div>
                    </div>
                </div>
                
                    
                <div className="exercise-action-button-container" style={{margin: "0 -1.6vw 0 0"}}>
                    <div role="button" onClick={OpenCoolWarmEx(0)} id="wormupview" data-contentId="" className="action-button">
                        <div className="action-button-txt">WARM UP</div>
                    </div>
                    <div role="button" onClick={OpenCoolWarmEx(1)} id="cooldownview" data-contentId="" className="action-button">
                        <div className="action-button-txt">COOL DOWN</div>
                    </div>
                   
                    

                    <div id="toggle-selected-exercise-container" className="select-exercise-container" style={{display:"none"}}>
                        <div className="select-exercise-header">
                            <div data-field="wormup" className="selected-exercise-type">Cool Down</div>
                            <img role="button" onClick={OpenCoolWarmEx(2)}  src={Cross} className="selected-exercise-logo"/>
                        </div>
                        <div className="content-divider"></div>
                        <div className="select-exercise-body">
                            <input type="radio" className="selected-exercise-name" checked style={{margin:"0 2% 0 0"}}/>
                            <div id="id-selected-exercise-name" className="selected-exercise-name">Selected Exercise</div>
                        </div>
                        <div className="select-exercise-body" style={{margin: "4% auto 2%"}}>
                            <img id="arrow-expand"  onClick={OpenCoolWarmExList} src={ArrowCollapse} className="selected-exercise-name" checked style={{margin:"0 2% 0 -1%"}}/>
                            <img id="arrow-collapse"  onClick={OpenCoolWarmExList} src={ArrowExpand} className="selected-exercise-name" checked style={{margin:"0 2% 0 -1%", display: "none"}}/>
                            <div className="selected-exercise-name">Exercise List</div>
                        </div>
                        <div id="exercise-list" className="selected-exercise-list-container" style={{display:"none"}}>
                           {
                               wormcoolContents.map((data,index)=>{
                                   return (
                                    <div role="button" onClick={updateCoolDownWormUp(data.exName,data._id)} className="selected-esercise-list-text">{index+1}. {data.exName}</div>
                                   )
                               })
                           }
                        </div>
                    </div>
                </div>
                
            </div>
            <div className="member-calender-body">
                <div id="menu-items" className="member-calender-days-container">
                     {
                         ["day1","day2","day3","day4","day5","day6","day7"].map((data,index)=>{
                             return(
                                <div id={"tab"+data}   role="button" onClick={selectMenu(index+1)} className="member-calender-days" style={{
                                    backgroundColor:selecteddaynumber==(index+1)?"#ff8800":"#ffffff",pointerEvents:'auto'
                                }}>Day {index+1}</div>
                             )
                         })
                     }
                </div>

                <div className="member-calender-exercise-container">
                    <div style={{justifyContent:"space-between", display:"flex", alignSelf:"center", alignItems:"flex-start"}}>
                        <input className="member-calender-display-name" onBlur={saveDispplayNames} onChange={handleChange} value={days_display_names[selecteddaynumber-1]}></input>
                    </div>

                    <div id="Mon-exercise" style={{display:"block"}}>
                        <div className="member-exercise-container">
                            <table className="member-exercise-title-container">
                                <tr>
                                    <th>SL No.</th>
                                    <th>Exercise Name</th>
                                    <th>Set</th>
                                    <th>Repetation</th>
                                    <th>Weight</th>
                                    <th>Distance</th>
                                    <th>Count</th>
                                    <th>Duration</th>
                                </tr>

                          

                                {
                                    rows['day'+selecteddaynumber].map((data,index)=>{
                                        return (
                                            <tr>
                                            <td>{index+1}.</td>
                                            <td>
                                                <div id={`ex_set-${selecteddaynumber}-${index}`} data-Id={data["id"]} onClick={AssignExercie(data["id"],index)} style={{margin:"auto", maxWidth: "8vw", alignSelf:"center", alignItems:"flex-start", justifyContent:"center", textAlign:"center", borderRadius:"5px", boxShadow:"1px 2px 3px #e0e0e0", padding: "0.4vw 0"}}>
                                                    <div style={{fontSize:"1vw", alignSelf:"center"}}>{findAndSetContetInExerciseView(data['content'])}</div>
                                                </div>
                                                
                                            </td>
                                            <td >{data['set']}</td>
                                            <td>{data['rep']}</td>
                                            <td>{data['unit']=="weight[KG]"?data['defaultvalue']+" kg":data['unit']=="weight[LBS]"?data['defaultvalue']+" lbs":"0 KG"}</td>
                                            <td>{data['unit']=="distance"?data['defaultvalue']:0} km</td>
                                            <td>{data['unit']=="number"?data['defaultvalue']:0}</td>
                                            <td>{data['unit']=="duration"?data['defaultvalue']:0} min</td>
                                        </tr>
                                        )
                                    })
                                }

                            </table>                         
                        </div>       
                    </div>
                    
                </div>
                    
            </div>
    
            <div id="set-exercise" className={isOpenContentModal?"popup-container":"content-add-section"} style={{display:"none"}}>
                 {
                     !isOpenContentModal?[
                                    
                            <div className="exerise-header-bar">
                            <div style={{display:"flex", alignSelf:"center"}} onClick={CloseExerciseBox}>
                                <div className="exercise-header-text" style={{marginRight:"6%", alignSelf:"center", whiteSpace:"nowrap"}}>Mon - Exercise 1</div>
                                <span role="button" onClick={AddExercise} class="material-icons-outlined" style={{fontSize:"1.8vw", alignSelf:"center", color:"#e0e0e0"}}>add_circle_outline</span>
                            </div>
                            
                            <img onClick={CloseExerciseBox} src={Cross} className="exercise-header-close"/>
                        </div>
                        ,
                            <div className="exercise-body-container">
                                <div>

                                    <div onClick={selectExercise} id="select-Exercise" type="text" className="select-exercise-block">
                                        <div className="select-exercise-text">Select Main Exercise</div>
                                        <img id="Select-Exercise" src={ArrowDown} className="select-exercise-icon"/>
                                    </div>


                                    <div id="Exercise-list" className="select-exercise-list" style={{display:"none"}}>
                                        {
                                            MainExercise.map((data,index)=>{
                                                return (
                                                    <div  role="button" onClick={handleExercise('content',1,data)} onLoad={findandSetExercise(data)}  className="exercise-list-container">
                                                    <div className="exercise-list">
                                                        {index+1}. {data.exName}
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>

                                    <div id="weight" onClick={weight} className="select-unit-container" style={{border: "1px solid #42a5f5"}}>
                                        <div className="row" style={{padding: "0 5% 0 5%"}}>
                                            <div className="select-unit-header" >
                                                <div style={{display:"flex", justifyContent:"space-between", width:"100%"}}>
                                                    <div style={{display:"flex"}}>
                                                        <input  onChange={handleExercise('unit',0)} value="weight[KG]" id="weight-radio" name="unit" type="radio" style={{alignSelf:"center", margin :"0 1vw 0 0"}} />
                                                        <div className="select-unit-text">Unit - Weight</div>
                                                    </div>
                                                    
                                                    <div style={{float:"right"}}>
                                                        <select onClick={e=>e.stopPropagation()}  name="weight" id="weight-dropdown" onChange={handleExercise('unit',0)} style={{border:"0", outline:"none", width:"3vw", justifyContent:"center", padding: "0 0 0 8px", borderRadius:"8px"}}>
                                                            <option value="weight[LBS]">LBS</option>
                                                            <option value="weight[KG]">KG</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                {/* <img src={ArrowDown} className="select-unit-dropdown"/> */}
                                            </div>
                                            
                                            <div id="weight-unit" className="select-unit-header" style={{padding: "3% 2% 0 0"}}>
                                                <div className="select-unit-body">
                                                    <div className="select-unit-name">
                                                        <div className="select-unit-name-text">Set</div>
                                                    </div>
                                                    <input type="text" onChange={handleExercise('set',0)}  value={optionalExNumber==2?set:optionalEx[optionalExNumber]["set"]} className="select-unit-text-container"/>
                                                </div>

                                                <div className="select-unit-body">
                                                    <div className="select-unit-name">
                                                        <div className="select-unit-name-text" >Rep</div>
                                                    </div>
                                                    <input type="text" className="select-unit-text-container" onChange={handleExercise('rep',0)}  value={optionalExNumber==2?rep:optionalEx[optionalExNumber]["rep"]}/>
                                                </div>
                                                
                                            </div>
                                            <div id="weight-unit-value" className="select-unit-header" style={{padding: "3% 2% 0 0"}}>
                                                <div className="select-unit-body">
                                                        <div className="select-unit-name">
                                                            <div className="select-unit-name-text">{unit=="weight[KG]"?"KG":"LBS"}</div>
                                                        </div>
                                                        <input onChange={handleExercise("defaultvalue",0)} value={optionalExNumber==2?defaultvalue:optionalEx[optionalExNumber]["defaultvalue"]} type="text" className="select-unit-text-container"/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div id="Time" onClick={time} className="select-unit-container">
                                        <div className="row" style={{padding: "0 5% 0 5%"}}>
                                            <div className="select-unit-header">
                                                <div style={{display:"flex"}}>
                                                    <input onChange={handleExercise('unit',0)} value="duration" id="time-radio" name="unit" type="radio" style={{alignSelf:"center", margin :"0 1vw 0 0"}}/>
                                                    <div className="select-unit-text">Unit - Time</div>
                                                </div>
                                            </div>
                                            
                                            <div id="time-unit" className="select-unit-header" style={{padding: "3% 2% 0 0", display:"none"}}>
                                                <div className="select-unit-body">
                                                    <div className="select-unit-name">
                                                        <div className="select-unit-name-text">Min</div>
                                                    </div>
                                                    <input type="text" onChange={handleExercise('defaultvalue',0)}  value={optionalExNumber==2?defaultvalue:optionalEx[optionalExNumber]["defaultvalue"]} className="select-unit-text-container"/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div id="Number" onClick={number} className="select-unit-container">
                                        <div className="row" style={{padding: "0 5% 0 5%"}}>
                                            <div className="select-unit-header">
                                                <div style={{display:"flex"}}>
                                                    <input onChange={handleExercise('unit',0)} value="number" id="number-radio" name="unit" type="radio" style={{alignSelf:"center", margin :"0 1vw 0 0"}}/>
                                                    <div className="select-unit-text">Unit - Number</div>
                                                </div>
                                                {/* <img src={ArrowDown} className="select-unit-dropdown"/> */}
                                            </div>
                                            
                                            <div id="number-unit" className="select-unit-header" style={{padding: "3% 2% 0 0", display:"none"}}>
                                                <div className="select-unit-body">
                                                    <input type="text" onChange={handleExercise('defaultvalue',0)}  value={optionalExNumber==2?defaultvalue:optionalEx[optionalExNumber]["defaultvalue"]} className="select-unit-text-container"/>
                                                </div>
                                                
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div id="Distance" onClick={distance} className="select-unit-container">
                                        <div className="row" style={{padding: "0 5% 0 5%"}}>
                                            <div className="select-unit-header">
                                                <div style={{display:"flex"}}>
                                                    <input onClick={handleExercise('unit',0)} value="distance" id="distance-radio" name="unit" type="radio" style={{alignSelf:"center", margin :"0 1vw 0 0"}}/>
                                                    <div className="select-unit-text">Unit - Distance</div>
                                                </div>
                                                {/* <img src={ArrowDown} className="select-unit-dropdown"/> */}
                                            </div>
                                            
                                            <div id="distance-unit" className="select-unit-header" style={{padding: "3% 2% 0 0", display:"none"}}>
                                                <div className="select-unit-body">
                                                    <div className="select-unit-name">
                                                        <div className="select-unit-name-text">Km</div>
                                                    </div>
                                                    <input type="text"  onChange={handleExercise('defaultvalue',0)}  value={optionalExNumber==2?defaultvalue:optionalEx[optionalExNumber]["defaultvalue"]} className="select-unit-text-container"/>
                                                </div>     
                                            </div>
                                        </div>
                                    </div>
                                

                                </div>
                            
                            </div>
                        ,
                        <div className="member-exercise-toggle-container">
                            <div role="button" onClick={selectMainEx} id="main-ex" style={{backgroundColor:"#f5f5f5", color:"#00a2ff", padding:"1.1% 5%", cursor:"pointer"}}>Main Exercise</div>
                            <div style={{padding:"1.1% 5%", color:"#757575"}}>Optional Exercise</div>
                            <div role="button" onClick={selectOptionalExOne} id="option-1-ex" style={{padding:"1.1% 3.89%", cursor:"pointer"}}>One</div>
                            <div role="button" onClick={selectOptionalExTwo} id="option-2-ex" style={{padding:"1.1% 3.89%", cursor:"pointer"}}>Two</div>
                        </div>
                    
                     ]:[
                        <div className="popup-view" style={{width:"50vw"}}>
                        <div className="d-flex" style={{justifyContent:"space-between"}}>
                        <div style={{display:"flex", alignSelf:"center"}}>
                          <div className="bold-font my-profile-heading flex-item" style={{marginRight:"6%", alignSelf:"center", whiteSpace:"nowrap"}}>Planner Name</div>
                          <span role="button" onClick={HandleNextPopup} class="material-icons-outlined" style={{fontSize:"1.8vw", alignSelf:"center", color:"#e0e0e0"}}>add_circle_outline</span>
                        </div>
                        
                        <span onClick={CloseExerciseBox} class="material-icons-round edit-icon">close</span>
                        </div>
                        <div className="d-flex" style={{justifyContent:"space-between", width:"100%"}}>
                        <div style={{marginTop:"2%", width:"55%"}}>
                        <div className="d-flex">
                        <div id="main-exercise-tab" onClick={toggleActiveMenu} className="toggle-chips-menu active-background">Main Exercise</div>
                        <div id="optional-exercise-tab-1" onClick={toggleActiveMenu} className="toggle-chips-menu" >Optional 1</div>
                        <div id="optional-exercise-tab-2" onClick={toggleActiveMenu} className="toggle-chips-menu">Optional 2</div>
                    </div>
    
               <div style={{fontWeight:"bold", fontSize:"1.1vw", marginTop:"4%", marginBottom:"3%"}}>{currentContent}</div>
    
                        <div className="video-container">
                        <ReactPlayer 
                            id = "react-player-id"
                            style={{borderRadius:"5px", overflow: "hidden"}} 
                            width="340px" height="190px" 
                            controls url={currentVideo}
                            onReady = {() => {console.log("onReady Callback")}}
                            onStart = {() => {console.log("onStart Callback")}}
                            onPause = {() => {console.log("onPause Callback")}}
                            onEnded = {() => {console.log("onEnded Callback")}}
                            onError = {() => {console.log("onError Callback")}}
                        />
                        </div>
    
                        <div style={{marginTop:"6%", fontSize:"1vw", fontWeight:"bold"}}>{currentTitle}</div>
                        {/* <div className="d-flex" style={{marginTop:"3%"}}>
                        <button style={{background:"#e0e0e0", marginRight:"1vw"}}>
                            <div style={{alignSelf:"center"}}>Previous</div>
                        </button>
                        <button onClick={HandleNextPopup} style={{background:"#e0e0e0"}}>
                            <div style={{alignSelf:"center"}}>Next</div>
                        </button>
                        </div> */}
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
                     ]
                 }
            </div>
            

            {/* <div id="add-plannerContent" className="popup-container" style={{display:'block'}}>    
                   
            </div>
            */}


        </Dashboard>
    )
}

export default ManagePlanner;