import React, {useState, useEffect} from "react";
import Dashboard from '../../core/Dashboard';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import {createContent, getAllInActiveCoolDownExercise, getAllInActiveMainExercise, getAllinActiveFitnessContents, getAllInActiveWarmUpExercise, getContent, updateContent, checkPlannerStatus} from "../helper/api";
import {getAllActiveMainExercise,checkContentStatus,getAllContents,getAllActiveCoolDownExercise,getAllActiveWarmUpExercise,getAllActiveFitnessConents,getAllParameters} from "../helper/api";
import { isAuthenticated } from "../../auth";
import { getAllActiveGym, getGym, gettotalMembers } from "../../gym/helper/api";
import List from "@material-ui/core/List";
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import Link from "react-router-dom/Link";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ArrowDown from '../../assets/arrow-down.svg';
import Cross from "../../assets/cross.svg";
import _ from 'lodash';
import FilterIcon from "../../assets/filter.svg";
import ArrowLeft from "../../assets/arrow-left.svg";
import ArrowRight from "../../assets/arrow-right.svg";
import BlockIcon from "../../assets/block.svg";
import UpdateIcon from "../../assets/edit.svg";
import DownloadIcon from "../../assets/download.svg";
import ArrowUp from "../../assets/arrow-sign.svg";
import SwapIcon from "../../assets/swap.svg";
import { useHistory } from "react-router-dom";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="right" ref={ref} {...props} timeout={{enter: 300, exit: 400}}/>;
});

const ManageContent = (props) => {

    const history =useHistory();
    const [flag]=useState(1);
    const ItemId = props.match.params.itemId;
    const [currentpage,setcurrentpage]=useState(1);
    const [page,setpage]=useState(1);
    const [limit,setlimit]=useState(9);
    const ContentTypeList=[
        {
            name:"Warm Up",
            role:0
        },
        {
            name:"Main Exercise",
            role:1
        },
        {
            name:"Cool Down",
            role:2
        },
        {
            name:"Fitness Test",
            role:3
        }
    ]
    const [currentExId, setCurrentExId] =  useState("");
    const [Contents,setContents]=useState([])
    // User Authentication
    const {user,token} = isAuthenticated();
    // Hooks call for using the same form to create & update & block
    const [switchForm, setSwitchForm] =  useState({
        formName : "Create Content",
        formType : 0,
        contentName: "Main Exercise",
        contentType : 1,
        switchExMode: "",
        switchBtn: 1,
        formBlock: 0
    });
    const {formName, formType, contentName, contentType, switchExMode, switchBtn, formBlock} = switchForm;
    // Get All Exercise Type, Level & Target Muscle
    const [Gym,setGym]=useState({
        gymName:"",
        phone:"",
        email:"",
        gymId:"",
        totalBranch:0,
        totalMembers:0
    });
    const {totalBranch,totalMembers,gymName,phone,email,gymId}=Gym;
    const [Gyms,setGyms]=useState([]);
    const [active,setactive]=useState(false)
    const [extypeList, setExTypeList] = useState([]);
    const [exlevelList, setExLevelList] = useState([]);
    const [tgmsclList, setTargetMuscleList] = useState([]);
    // Hooks call to create, Update & Block Content
    const [Content, setContent] = useState({
        contentId:"",
        exMode:0,
        exName:"",
        Instructions:"",
        exercise_Steps:[
            {
                title:"",
                description:""
            }
        ],
        exType:"",
        primary_muscle:"",
        secondary_muscle:[],
        exLevels:[],
        fileupload:false,
        videoList:[
            {
                title:"",
                url:""
            }
        ],
        audioList:[
            {
                title:"",
                url:""
            }
        ],
    });
    const {contentId,exMode, exName,Instructions,exercise_Steps,exType,primary_muscle,secondary_muscle,exLevels,fileupload,videoList,audioList } = Content;
    const [WarmUp, setWarmUp] = useState([]);
    const [MainExercise, setMainExercise] = useState([]);
    const [CoolDown, setCoolDown] = useState([]);
    const [FitnessContents,setFitnessContents]=useState([]);
    const [mapAction,setmapAction]=useState(0); //used for active and inactive operation

  

    
 

    //select list
    const handleToggle = (name,value) => event => {
       
       

        const currentIndex = Content[name].findIndex(id=>id==value);
        const newChecked = [...Content[name]];
      
        
         
        if (currentIndex === -1) {
           newChecked.push(value);
        } else {
           newChecked.splice(currentIndex, 1);
        }



       
       setContent(oldstate=>{
           oldstate[name]=newChecked;
        return ({...oldstate})
       })

    };


    const handleSingleDataSelect=(id,data)=>event=>{
        event.preventDefault();
        let dataFields=id.split('-');
        let value=data._id;
        if(value==Content[dataFields[0]]) value="";
        setContent({...Content,[dataFields[0]]:value});
    }

    // Hooks call to Open Register, Update & Block Gym Content Form
    const [open, setOpen] = useState(false);
    const handleCreateOpen = () => {
        setSwitchForm({
            ...switchForm,
            formName: "Create Content",
            switchBtn: 0,
            formType: 0,
            formBlock: 0
        });
        setContent({
            ...Content,
            contentId:"",
            exMode:0,
            exName:"",
            Instructions:"",
            exercise_Steps:[
                {
                    title:"",
                    description:""
                }
            ],
            exType:"",
            primary_muscle:"",
            secondary_muscle:[],
            exLevels:[],
            fileupload:false,
            videoList:[
                {
                    title:"",
                    url:""
                }
            ],
            audioList:[
                {
                    title:"",
                    url:""
                }
            ],
        })
        setOpen(true);
    };

    const handleOpenActiveInactivePopup=content=>event=>{
        event.preventDefault()
        setOpen(true);
        setSwitchForm({
            ...switchForm,
            formName: "Are you sure, you want to "+(mapAction==0?"inactive":"active")+" this content ?",
            formType: 2
        });
        setContent({
            ...Content,
            contentId:content._id,
            exName:content.exName
        })
        event.stopPropagation()
      }

    const handleClose = event => {
        event.preventDefault();
        setOpen(false);
        event.stopPropagation();
    };


  

  




   


    const handleUpdateContent=data=>event=>{
        event.preventDefault()
        console.log(data)
        setSwitchForm({
            ...switchForm,
            formType: 1,
            switchExMode: 3,
            switchBtn: 1,
            formName: "Update Content",
        });
        setOpen(true);

      
     
        setContent({
            ...Content,
            contentId: data._id,
            exMode:data.exMode,
            exName:data.exName,
            Instructions:data.Instructions,
            exercise_Steps:data.exercise_Steps,
            exType:data.exType[0],
            primary_muscle:data.primary_muscle[0],
            secondary_muscle:data.secondary_muscle,
            exLevels:data.exLevels,
            fileupload:data.fileupload,
            videoList:data.videoList,
            audioList:data.audioList,
        });

        setGym({
            ...Gym,
            gymId:data.gymId,
            gymName:data.gymName
        })
        
        event.stopPropagation()
       
    }

   


    // Handle Request to accept Gym Information from input fields
    const handleGymContent = name => event => {
        setContent({...Content,  [name]: event.target.value});
    }

    const addPopupListDataItem=name=>event=>{
        event.preventDefault();

        setContent(oldcontent=>{
            
                let data={};
                data["title"]="";
                data[(name=="videoList"?"url":"description")]="";
                oldcontent[name].push(data);
            
            return ({...oldcontent})
        })

    }

    const handlePopupListItem=(variablename,name,index)=>event=>{
        setContent(oldstate=>{
            oldstate[variablename][index][name]=event.target.value;
            return ({
                ...oldstate
            })
        })
    }

    const handleRemovePopupListItems=(name,index)=>event=>{
        event.preventDefault()
        setContent(oldstate=>{
            if(index>-1){
                oldstate[name].splice(index,1)
            }
            return ({...oldstate})
        })
    }




    const handleActiveInactiveContentList=async event=>{
        event.preventDefault();
        if(mapAction==0){
          setmapAction(1);
          let data= await GetAllContents(false);
          formContentsDataList(data,extypeList,tgmsclList);
          setactive(true)
        }else{
          setmapAction(0);
          let data= await GetAllContents(true);
          formContentsDataList(data,extypeList,tgmsclList);
          setactive(false)
        }

        setContent({...Content,contentId:""})
    }

    const ActiveInActiveOperation=event=>{
        event.preventDefault();
        updateContent(user._id,token,contentId,{active}).then(async data=>{
          if(data.error){
            console.log('error in db');
          }else{
             let active=mapAction==0?true:false; 
             if(user.role==0){
                let data= await GetAllContents(active);
                formContentsDataList(data,extypeList,tgmsclList);
             }
             setOpen(false)
          }
        })
  };


   

    const selectContent=content=>event=>{
        event.preventDefault();
        
        history.push({
            pathname:`/content/${content.gymId}/${content._id}`
        })

     

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

        if(id=="gym-list"&&user.role==0) GetActiveGyms()
    }


    const vlidateField=(name,value)=>{
       
        if(name=="exName"){
            return value.length>1&&value.length<=30
        }
        if(name=="exDes"){
            return value.length>1&&value.length<=140;
        }
        if(name=="videoLinkOneTitle"){
            return value.length>1&&value.length<=100;
        }
        if(name=="videoLinkTwoTitle"){
            return value.length>1&&value.length<=30
        }
        if(name=="videoLinkThreeTitle"){
            return value.length>1&&value.length<=30
        }
        if(name=="audioTitle"){
            return value.length>1&&value.length<=30
        }

        
    }
    
      const OnBlurFieldChecker=name=>()=>{
        let checker=vlidateField(name,Content[name]);
        checkContentStatus(user._id,token,gymId,{field:name,value:Content[name]}).then(data=>{
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


    const handleDropdownItem=(name,value)=>event=>{
        event.preventDefault();
        if(name=="gym"){
            setGym({...Gym,gymName:value.gymName,gymId:value._id});
        }else{
            setContent({...Content,[name]:value});
        }
            document.getElementById(name+"-list").style.display="none";
            document.getElementById(name+"-list-icon").style.transform='rotate(-180deg)';

    }

    const toggleFilter = () => {
        if(document.getElementById("filter-container-toggle").style.display == "none"){
            document.getElementById("filter-container-toggle").style.display = "block";
        }else{
            document.getElementById("filter-container-toggle").style.display = "none";
        }
    }



    //handle sort section 
    const togleFilterList = name=>event => {
        event.preventDefault();
        if(document.getElementById(name+"-list").style.display == "none"){
            document.getElementById(name+"-list").style.display = "block";
            document.getElementById("select-"+name+"-icon").style.transform = "rotate(-180deg)"

            switch(name){
                case "sortgym":
                    GetActiveGyms()
                break;
                default:
                    console.log("nothing to load")
            }
        }else{
            document.getElementById(name+"-list").style.display = "none";
            document.getElementById("select-"+name+"-icon").style.transform = "rotate(0deg)"
        }
        event.stopPropagation();
      }





    const toggleContentAction = contentId=> event => {
        event.preventDefault()
        if(document.getElementById("action-" + contentId).style.display == "none"){
          document.getElementById("action-" + contentId).style.display = "block";
    
          setTimeout(() => {
            window.addEventListener("click", closeAllPopup);
          }, 10);
    
        }else{
          document.getElementById("action-" + contentId).style.display = "none";
        }
        setContent({...Content,contentId});
        function closeAllPopup(){
          document.getElementById("action-" + contentId).style.display = "none";
          window.removeEventListener("click", closeAllPopup);
        }
      }



      const FindParametersName=(name,id)=>{
           let doc;
           if(name=="exType") doc=extypeList.find(data=>data._id==id);
           else doc=tgmsclList.find(data=>data._id==id);

           return doc.name
      }




    //API Calls



    const onUpdate =  event => {
        event.preventDefault();

        updateContent(user._id,token,contentId,{exMode, exName, exType,exercise_Steps, Instructions, exLevels, primary_muscle,secondary_muscle, videoList, audioList}).then(async data=>{
            if(data.error){
                console.log("error in DB")
            }else{
                setContent({...Content,
                    exMode:0,
                    exName:"",
                    Instructions:"",
                    exercise_Steps:[],
                    exType:"",
                    primary_muscle:"",
                    secondary_muscle:[],
                    exLevels:[],
                    fileupload:false,
                    videoList:[],
                    audioList:[{
                        title:"",
                        url:""
                    }],
                });
                setOpen(false);
                let active=mapAction==0?true:false;
                if(user.role==0){
                     let data=await GetAllContents(active);
                     formContentsDataList(data,extypeList,tgmsclList);
                }
              
            }
        }).catch(()=>console.log("err"))
    }
    // Post Request to Create Gym Content
    const onCreate =  event => {
        event.preventDefault();
       // setRegContent({...regContent, error:"", success:false});
        createContent(user._id, token, gymId, {exMode, exName, exType,exercise_Steps, Instructions, exLevels, primary_muscle,secondary_muscle, videoList, audioList}).then(async data=>{
          if(data.error){
            console.log(data.error)
          }else{
            setContent({...Content,
                exMode:0,
                exName:"",
                Instructions:"",
                exercise_Steps:[],
                exType:"",
                primary_muscle:"",
                secondary_muscle:[],
                exLevels:[],
                fileupload:false,
                videoList:[],
                audioList:[{
                    title:"",
                    url:""
                }],
            });
            setOpen(false);
            let active=mapAction==0?true:false;
            if(user.role==0){
                 let data=await GetAllContents(active);
                 formContentsDataList(data,extypeList,tgmsclList);
            }
           
            
          }
        }).catch(()=>console.log("Error in DB"));
    };
    

    const GetActiveGyms=()=>{
        getAllActiveGym(user._id,token,currentpage,limit).then(data=>{
            if(data.error){
                console.log(data.error)
            }else{
                setGyms(data)
            }
        }).catch(err=>console.log(err))
    }

    const GetTotalMembers=()=>{
        gettotalMembers(user._id,token,ItemId).then(data=>{
            if(data.error){
             console.log(data.error)
            }else{
             setGym({...Gym,totalMembers:data.totalmembers,totalBranch:data.totalbranch})
            }
         }).catch(err=>console.log(err))
    }

    const GetAllActiveCoolDownExercises=()=>{
        getAllActiveCoolDownExercise(user._id, token, ItemId).then(data => {
            if(data.error){
              console.log("error in DB")
            }else{
              setCoolDown(data);
            }
        }).catch(err=>{
           console.log(err);
        })
    }

    const GetAllInActiveCoolDownExercises=()=>{
        getAllInActiveCoolDownExercise(user._id,token,ItemId).then(data=>{
            if(data.error){
                console.log(data.error);
            }else{
                setCoolDown(data);
            }
        })
    }
    
    const GetAllActiveWamrUps=()=>{
        getAllActiveWarmUpExercise(user._id, token, ItemId).then(data => {
            if(data.error){
              console.log("error in DB")
            }else{
              setWarmUp(data);
            }
        }).catch(err=>{
            console.log(err)
        });
    }
    
    const GetAllInActiveWarmUps=()=>{
        getAllInActiveWarmUpExercise(user._id,token,ItemId).then(data=>{
            if(data.error){
                console.log(data.error)
            }else{
                setWarmUp(data)
            }
        }).catch(err=>console.log(err))
    }

    const ActiveMainExercise = () => {
        getAllActiveMainExercise(user._id, token, ItemId).then(data => {
            if(data.error){
              console.log("error in DB")
            }else{ 
              setMainExercise(data);
            }
        }).catch(err=>{
            console.log(err);
        });
    }

    const InActiveMainExercise=()=>{
        getAllInActiveMainExercise(user._id,token,ItemId).then(data=>{
            if(data.error){
                console.log(data.error)
            }else{
                setMainExercise(data);
            }
        }).catch(err=>console.log(err))
    }

    const GetAllActiveFitnessContents=()=>{
        getAllActiveFitnessConents(user._id,token,ItemId).then(data=>{
            if(data.error){
                console.log("error in db")
            }else{
                setFitnessContents(data);
            }
        }).catch(err=>{
            console.log(err);
        });
    }

    const GetAllInActiveFitnessContents=()=>{
        getAllinActiveFitnessContents(user._id,token,ItemId).then(data=>{
            if(data.error){
                console.log(data.error)
            }else{
                setFitnessContents(data)
            }
        }).catch(err=>{
            console.log(err);
        })
    }

    const GetAllContents=active=>{
        return getAllContents(user._id,token,{active}).then(data=>{
            if(data.error){
                return false;
            }else{
               return data;
            }
        }).catch(err=>{
            return false;
        })
    }


    const GetAllParameters=type=>{
        return getAllParameters(user._id,token,{type}).then(data=>{
            if(data.error){
                return false;
            }else{
             
                return data
                
            }
        }).catch(err=>{
            return false;
        })
    };

    const formContentsDataList=(data,exercisetypelist,targetmusclelist)=>{
        let contentlist=[];
        let parameterData={};
         if(data.length==0){
             setContents([])
         }else{
            for(let i=0;i<data.length;i++){
                let newData=data[i];
                let newDataList=[];
                if(newData["exType"]){
                    newDataList=[];
                    parameterData=exercisetypelist.find(data=>data._id==newData['exType']);
                    newDataList.push(parameterData._id);
                    newDataList.push(parameterData.name);
                    newData['exType']=newDataList;
                }
                if(newData['primary_muscle']){
                       newDataList=[];
                       parameterData=targetmusclelist.find(data=>data._id==newData['primary_muscle']);
                       newDataList.push(parameterData._id);
                       newDataList.push(parameterData.name);
                       newData['primary_muscle']=newDataList;
                }
               
                contentlist.push(newData);
                if(i==(data.length-1)){
                    setContents(contentlist)
                }
            }
         }
    }


    useEffect(async ()=>{
        if(user.role==0){
            let data= await GetAllContents(true); 
            let extypelist=await GetAllParameters(1);
            let exlevellist=await GetAllParameters(0);
            let targetMuscleList=await GetAllParameters(2);
            setTargetMuscleList(targetMuscleList);
            setExTypeList(extypelist);
            setExLevelList(exlevellist)
            
            formContentsDataList(data,extypelist,targetMuscleList);
            
            
        }
        if(user.role==0&&props.location.state&&props.location.state.action=="create")  setOpen(true);
    },[])

    return(
        <Dashboard  navItemData={"nonavItem"} flag={flag} data={{
            state:props.location.state,
            totalBranch,
            totalMembers
        }} itemId={ItemId}>


<div className="header-bar">
                        <div>
                            <div className="dashboard-name-container">
                                <div className="dashboard-name">Contents</div>
                            
                                <span  onClick={handleCreateOpen} class="material-icons-round" style={{color:"#bdbdbd", margin:"-0.8% 0 0 8%", cursor:"pointer"}}>add_circle_outline</span>
               
                            </div>
                            <div onClick={handleActiveInactiveContentList} className="active-inactive-container">
                                <img src={SwapIcon} className="active-inactive-icon"/>
                                <div id="switch-gym" className="active-inactive-text">{mapAction==0?`Active`:`Inactive`}</div>
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
                                  {/*sorting dropdown*/}
                                    
                                  <div className="container-spacing">
                                    <span className="g-font-1 inactive">Gym</span>
                                    <div onClick={togleFilterList("sortgym")}
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
                                        
                                        {
                                            Gyms.map(gym=>{
                                                return(
                                                    <div className="menu-text-spacing">{gym.gymName}</div>
                                                )
                                            })
                                        }
                                
                                    </div>
                                </div>
                                  <div className="container-spacing">
                                    <span className="g-font-1 inactive">Content Type</span>
                                    <div
                                    onClick={togleFilterList("sortcontenttype")}
                                    type="text"
                                    className="d-flex select-dropdown"
                                    >
                                    <div className="select-exercise-text">Select Types</div>
                                    <img
                                        id="select-sortcontenttype-icon"
                                        src={ArrowUp}
                                        className="select-exercise-icon"
                                    />
                                    </div>
                                    <div id="sortcontenttype-list" className="dropdown-menu-items" style={{display: "none"}}>
                                        {
                                            ContentTypeList.map(type=>{
                                                return(
                                                    <div className="menu-text-spacing">{type.name}</div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                                  <div className="container-spacing">
                                    <span className="g-font-1 inactive">Exercise Level</span>
                                    <div onClick={togleFilterList("sortexlevel")}
                                    id="select-Exercise"
                                    type="text"
                                    className="d-flex select-dropdown"
                                    >
                                    <div className="select-exercise-text">Select Levels</div>
                                    <img
                                        id="select-sortexlevel-icon"
                                        src={ArrowUp}
                                        className="select-exercise-icon"
                                    />
                                    </div>
                                    <div id="sortexlevel-list" className="dropdown-menu-items" style={{display: "none"}}>
                                       
                                       {
                                            exlevelList.map(level=>{
                                                <div className="menu-text-spacing">{level.name}</div>
                                            })
                                       }
                                 
                                    </div>
                                </div>
                                  <div className="container-spacing">
                                    <span className="g-font-1 inactive">Exercise Type</span>
                                    <div onClick={togleFilterList("sortextype")}
                                    id="select-Exercise"
                                    type="text"
                                    className="d-flex select-dropdown"
                                    >
                                    <div className="select-exercise-text">Select Types</div>
                                    <img
                                        id="select-sortextype-icon"
                                        src={ArrowUp}
                                        className="select-exercise-icon"
                                    />
                                    </div>
                                    <div id="sortextype-list" className="dropdown-menu-items" style={{display: "none"}}>
                                       
                                       {
                                           extypeList.map(type=>{
                                               return(
                                                <div className="menu-text-spacing">{type.name}</div>
                                               )
                                           })
                                       }
                                    
                                    </div>
                                </div>
                                  <div className="container-spacing">
                                    <span className="g-font-1 inactive">Target Muscle</span>
                                    <div onClick={togleFilterList("sorttargetmuscle")}
                                    id="select-Exercise"
                                    type="text"
                                    className="d-flex select-dropdown"
                                    >
                                    <div className="select-exercise-text">Select Muscles</div>
                                    <img
                                        id="select-sorttargetmuscle-icon"
                                        src={ArrowUp}
                                        className="select-exercise-icon"
                                    />
                                    </div>
                                    <div id="sorttargetmuscle-list" className="dropdown-menu-items" style={{display: "none"}}>
                                        
                                        {
                                            tgmsclList.map(muscle=>{
                                                return(
                                                    <div className="menu-text-spacing">{muscle.name}</div>
                                                )
                                            })
                                        }
                                
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



{/* 
            {
                (contentType == 0)?(  
                    <div className="pt-3 pl-3 pr-3">
                        {
                            WarmUp.map((data)=>{
                                return(
                                    <div onClick={()=>{setCurrentExId(data); }}  className="shadow mb-2" style={{ backgroundColor:currentExId == data?"#f5f5f5":"#ffffff",width: "100%", height: 33, borderRadius: 10}}>
                                        
                                        <div className="row pl-4 pr-4" style={{justifyContent: "space-between"}}>
                                            <Link to={`/${ItemId}/content/${data._id}`} style={{textDecoration: "none"}}>
                                                <div className="row">
                                                    <p className="pt-1 pl-4" style={{fontSize: 15,  color : "#000000"}}>{data.exName}</p>
                                                </div>
                                            </Link>
                                            <div className="row">
                                                <span onClick={() => {handleUpdateWarmUpExercise(data._id)}} class="material-icons pt-1 btn pr-0" style={{color: "#43a047"}}>update</span>
                                                <span className="material-icons pt-1 btn pr-4" style={{color: "#FF6060"}}>block</span>
                                            </div>
                                        </div>
                                        
                                    </div>
                                )
                            })
                        }
                    </div>
                )
                :(contentType == 2)?(
                    <div className="pt-3 pl-3 pr-3">
                        {
                            CoolDown.map((data)=>{
                                return(
                                    <div onClick={()=>{setCurrentExId(data); }}   className="shadow mb-2" style={{ backgroundColor:currentExId == data?"#f5f5f5":"#ffffff",width: "100%", height: 33, borderRadius: 10}}>
                                        
                                        <div className="row pl-4 pr-4" style={{justifyContent: "space-between"}}>
                                            <Link to={`/${ItemId}/content/${data._id}`} style={{textDecoration: "none"}}>
                                                <div className="row">
                                                    <p className="pt-1 pl-4" style={{fontSize: 15, color : "#000000"}}>{data.exName}</p>
                                                </div>
                                            </Link>
                                            <div className="row">
                                                <span onClick={() => {handleUpdateCoolDownExercise(data._id)}} class="material-icons pt-1 btn pr-0" style={{color: "#43a047"}}>update</span>
                                                <span className="material-icons pt-1 btn pr-4" style={{color: "#FF6060"}}>block</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                )
                            })
                        }
                    </div>
                ):(contentType == 1)?(
                    <div className="pt-3 pl-3 pr-3">
                        {
                            MainExercise.map((data)=>{
                                return(
                                    <div className="shadow mb-2" style={{ backgroundColor:currentExId == data?"#f5f5f5":"#ffffff",width: "100%", height: 33, borderRadius: 10}}>
                                        <div className="row pl-4 pr-4" style={{justifyContent: "space-between"}}>
                                            <Link to={`/${ItemId}/content/${data._id}`} style={{textDecoration: "none"}}>
                                                <div className="row">
                                                    <p className="pt-1 pl-4" style={{fontSize: 15, color : "#000000"}}>{data.exName}</p>
                                                </div>
                                            </Link>
                                            <div className="row">
                                                <span onClick={() => {handleUpdateMainExercise(data._id)}} class="material-icons pt-1 btn pr-0" style={{color: "#43a047"}}>update</span>
                                                <span className="material-icons pt-1 btn pr-4" style={{color: "#FF6060"}}>block</span>
                                            </div>
                                        </div>
                                       
                                    </div> 
                                )
                            })
                        }
                    </div>
                ):(
                    <div className="pt-3 pl-3 pr-3">
                        {
                            FitnessContents.map((data)=>{
                                return(
                                    <div className="shadow mb-2" style={{ backgroundColor:currentExId == data?"#f5f5f5":"#ffffff",width: "100%", height: 33, borderRadius: 10}}>
                                        <div className="row pl-4 pr-4" style={{justifyContent: "space-between"}}>
                                            <Link to={`/${ItemId}/content/${data._id}`} style={{textDecoration: "none"}}>
                                                <div className="row">
                                                    <p className="pt-1 pl-4" style={{fontSize: 15, color : "#000000"}}>{data.exName}</p>
                                                </div>
                                            </Link>
                                            <div className="row">
                                                <span onClick={() => {handleUpdateTestContent(data._id)}} class="material-icons pt-1 btn pr-0" style={{color: "#43a047"}}>update</span>
                                                <span className="material-icons pt-1 btn pr-4" style={{color: "#FF6060"}}>block</span>
                                            </div>
                                        </div>
                                       
                                    </div> 
                                )
                            })
                        }
                    </div>
                )
            }
 */}


        


        {/* Get All Content List*/}
        <table  className="body-container">
          <thead>
            <tr>
              <th style={{textAlign:"left", padding :"0 0 0 4.7%", width: "20%"}}>Exercise Name</th>
              <th>Exercise Type</th>
              <th>Primary Muscle</th>
              <th>Content Type</th>
              <th >Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {Contents.map((content) => {
              return (
                <tr onClick={()=>{setContent({...Content,contentId:content._id});}} style={{ backgroundColor:contentId == content._id?"rgb(0, 0, 0, 0.08)":"#ffffff", boxShadow:contentId == content._id?"none":"0px 0.01px 3px 3px rgb(0, 0, 0, 0.05)"}}>
                  <td style={{textAlign:"left", padding :"0 0 0 1.4%", width: "20%", fontWeight : "bold"}}>
                    <div className="d-flex">
                      <span class="material-icons-round action-icon" style={{ color:contentId == content._id?"#0077ff":"#cacaca"}}>check_circle</span>
                      <div role="button" onClick={selectContent(content)}  style={{padding :"2% 0 0 2%"}}>{`${content.exName}`.substring(0,20)+(`${content.exName}`.length>15?"....":"")}</div>
                    </div>
                  </td>
                  <td >{content.exType[1]}</td>
                  <td>{content.primary_muscle[1]}</td>
                  <td>{content.exMode==0?`Warm Up`:content.exMode==1?`Main Exercise`:content.exMode==2?`Cool Down`:`Fitness Test`}</td>
                  <td>
                    <div className="d-flex" style={{padding :"0 0 0 20%"}}>
                      <span class={`material-icons-round action-icon ${content.active?`active`:`inactive`}`}>circle</span>
                      <div style={{padding :"2.2% 0 0 2%"}} className={content.active?`active`:`inactive`}>{content.active?`Active`:`Inactive`}</div>
                    </div>
                  </td>
                  <td>
                    <span onClick={toggleContentAction(content._id)} class="material-icons-outlined edit-icon">more_horiz</span>
                    <div id={"action-" + content._id} className="table-action-container" style={{display:"none",zIndex:1}}>
                      <div role="button" onClick={handleUpdateContent(content)} className="d-flex spacing-22">
                        <img src={UpdateIcon} className="body-content-two-action-icon" />
                        <div className="spacing-24">Update</div>
                      </div>
                      <div style={{margin:"2% 0", width:"100%", height:"1px", backgroundColor:"#f5f5f5"}}></div>
                      <div role="button" onClick={handleOpenActiveInactivePopup(content)}  className="d-flex spacing-22">
                        <img src={BlockIcon} className="body-content-two-action-icon" />
                        <div className="spacing-24">{content.active?`Block`:`Unblock`}</div>
                      </div>

                    </div>
                  </td>
                </tr>
              );
            })}

          </tbody>
        </table>




       
        {/* popup section code */}    
        <div  className={`content-add-section ${formType==2?`content-add-section-rs-size`:'content-add-section-bg-size'}`} style={{display:open?"block":"none",width:'32vw'}}>
            <div className="exerise-header-bar">
                <div style={{display:"flex", alignSelf:"center",width:'70%'}} >
                    <div className="exercise-header-text" style={{marginRight:"6%", alignSelf:"center", whiteSpace:"nowrap"}}>{formName}</div>
                    {
                        formType!=2?(
                                
                 <div style={{position:'relative'}} className="input-popup-space" >
                    <div onClick={()=>hanleDropDown("exMode-list")} id="select-exMode" style={{width:'100%',boxShadow:'none',cursor:'pointer'}} type="text" className="input-popup-flex input-popup">
                        <div id="exMode-txt" className="select-exercise-text">{exMode==0?"Warm Up":exMode==1?"Main Exercise":exMode==2?"Cool Down":"Fitness Test"}</div>
                        <img id="exMode-list-icon" src={ArrowDown} style={{transition:'0.3s',transform:'rotate(-180deg)'}} className="select-exercise-icon"/>
                    </div>

                    <div id="exMode-list" className="select-exercise-list" style={{display:"none",zIndex:2,position:'absolute'}}>
                                {
                                    ["Warm Up","Main Exercise","Cool Down","Fitness Test"].map((data,index)=>{
                                        return (
                                            <div  role="button"  onClick={handleDropdownItem("exMode",index)}  className="exercise-list-container">
                                            <div className="exercise-list">
                                                {index+1}. {data}
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                    </div>
                    
                </div>

                        ):(null)
                    }    
                </div>
                
                <img  src={Cross} role="button" onClick={handleClose} className="exercise-header-close"/>
            </div>
            

            {
                formType==2?[
                    <div className="ml-5 mt-4 mr-5 mb-4">
                         <p className="pt-2" style={{fontWeight: "bold"}}>Important Note:
                            <p style={{fontWeight:"lighter", color:"#757575"}}>Branch's & member's under this gym will  <br/>  not be able to access the content.</p></p>
                          
                            <div className="row mt-2" style={{justifyContent: "flex-end"}}>
                                <button onClick={ActiveInActiveOperation} className="mt-1 mr-3 shadow-sm popup-button">
                                    <p className="pt-1" style={{color: "#000"}}>Yes</p>
                                </button>
                                <button onClick={handleClose} className="mt-1 shadow-sm popup-button">
                                    <p  className="pt-1" style={{color: "#000"}}>No</p>
                                </button>
                            </div>
                    </div>
                ]:[

                    <div style={{transition:'0.5s',height:"65%"}} className="exercise-body-container">


                    <div id="content-info-container" className="popcontainer-wrapper">


                        <div className="popcontainer-sub-wrapper">
                                                        
                                                        <div style={{width:'50%',position:'relative'}} className="input-popup-space">

                                                            

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

                                                    </div>
                                            


                        <input  id="exName" onInput={handleGymContent("exName")} value={exName} className="input-popup" placeholder="Exercise Name"/>
                        <textarea   id="Instructions" onInput={handleGymContent("Instructions")} value={Instructions} style={{height:'80px'}} className="input-popup input-message-box" placeholder="Instructions"/>

                        
                    </div>

                    <div  id="exdescription-info-container" className="popcontainer-wrapper">
                        <div className="popcontainer-sub-wrapper">
                            <div className="input-popup-space">
                                <div style={{alignSelf:'center'}} className="popup-header-one">
                                    <div  style={{display:'flex',flexDirection:'row',alignItems:'flex-start',width:'100%'}}>
                                        <div style={{alignSelf:'center'}}> Exercise Steps</div>
                                        <div role="button" onClick={addPopupListDataItem("exercise_Steps")} style={{alignSelf:'center',marginBottom:"-3%",marginLeft:'3%'}}>  <span role="button"  class="material-icons-outlined" style={{fontSize:"1.6vw", alignSelf:"center", color:"#e0e0e0"}}>add_circle_outline</span></div>

                                    </div>
                                  
                                </div>
                            </div>

                        </div>
                       <div style={{width:'94%',margin:'1% 5%',overflowY:'scroll',maxHeight:'20vw',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                       {
                            exercise_Steps.map((data,index)=>{
                                return ( 
                                    <div className="popcontainer-sub-wrapper">
                                        <div style={{alignSelf:'center',display:'flex',width:index==0?'100%':'95%',alignItems:'center'}}>
                                                <div style={{alignSelf:'center', margin: "1% 1%",width:'5%',fontSize:'1.2vw'}}>{index+1}.</div>
                                                <div style={{alignSelf:'center',width:'95%',justifyContent:'space-between',display:'flex',alignItems:'flex-start',flexDirection:'row'}}>
                                                    <input onChange={handlePopupListItem("exercise_Steps","title",index)}  value={exercise_Steps[index]["title"]} style={{borderRadius:'8px',width:'30%',border:'1px solid #e2e2e2'}} className="input-popup-two input-popup-space" placeholder="Title"/>
                                                    <input  onChange={handlePopupListItem("exercise_Steps","description",index)} value={exercise_Steps[index]["description"]} style={{borderRadius:'8px',width:'70%',border:'1px solid #e2e2e2'}} className="input-popup-two input-popup-space" placeholder="Description"/>
                                                </div>
                                        </div>
                                        <div style={{alignSelf:'center',display:index==0?'none':'block',width:'5%'}}>
                                            <center>
                                            <span role="button" onClick={handleRemovePopupListItems("exercise_Steps",index)}  class="material-icons-outlined" style={{fontSize:"1.6vw", alignSelf:"center", color:"#e0e0e0"}}>clear</span>
                                            </center>
                                        </div>
                                    </div>
                                )
                            })
                        }
                       </div>
                    </div>
                        

                    <div id="parameters-container" className="popcontainer-wrapper">
                                
                                <div className="popcontainer-sub-wrapper">
                                   <div className="input-popup-space">
                                      <div className="popup-header-one">Parameters</div>
                                   </div>
                                </div>
                
                                <div className="popcontainer-sub-wrapper">

                                    <div style={{marginRight:"5%"}} className="input-popup-space">

                                    <div className="selected-popop-item__wrapper">
                                           {/* <div>
                                               <div id="exType-popup">Exercise Type</div>
                                           </div>
                                           <div className="mt-1">
                                               {
                                                    extypeList.map(data=>{
                                                       return(
                                                        <div onClick={handleSingleDataSelect('exType-popup',data)}>
                                                            <div>{data.name}</div>
                                                        </div>
                                                       )
                                                   })
                                               }
                                           </div> */}
                                           
                                            <div style={{background:"transparent", border:"none", margin: "0 0 4% -1%"}}>Exercise Type</div>
                                           
                                           <div className="mt-1">
                                               {
                                                    extypeList.map((data,index)=>{
                                                       return(
                                                        <div onClick={handleSingleDataSelect('exType-popup',data)} style={{display:'flex',flexDirection:'row', paddingLeft:"2%"}}>
                                                            <div>
                                                                <input checked={ exType == data._id } name="my-extype" style={{alignSelf:'center'}}  id={"ex_level"+data._id.trim()+index} type="checkbox"/><span className="bold-font" style={{alignSelf:'center',marginTop:'1%',marginLeft:'4%'}}>{data.name}</span>
                                                            </div>
                                                        </div>
                                                       )
                                                   })
                                               }
                                           </div>
                                       </div>
                                    </div>

                                    <div  className="input-popup-space" >
                                        <div className="selected-popop-item__wrapper">
                                            <div style={{background:"transparent", border:"none", margin: "0 0 4% -1%", borderBottom:"0px"}}>Exercise Level</div>
                                            <div className="mt-1">
                                                {
                                                        exlevelList.map((data,index)=>{
                                                        return(
                                                            <div onClick={handleToggle("exLevels",data._id)}    style={{display:'flex',flexDirection:'row',paddingLeft:"2%"}}>
                                                            
                                                                    <div>
                                                                        <input checked={exLevels.indexOf(data._id) !== -1} style={{alignSelf:'center'}}  id={"ex_level"+data._id.trim()+index} type="checkbox"/><span className="bold-font" style={{alignSelf:'center',marginTop:'1%',marginLeft:'4%'}}>{data.name}</span>
                                                                    </div>
                                                            
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>
                                            
                                    </div>
                            
                                </div>
                                <div className="popcontainer-sub-wrapper">
                                    <div style={{marginRight:"5%"}} className="input-popup-space">
                                    <div className="selected-popop-item__wrapper">
                                            {/* <div>
                                               <div id="primary_muscle-popup">Primary Muscle</div>
                                            </div>
                                            <div className="mt-1">
                                               {
                                                    tgmsclList.map(data=>{
                                                       return(
                                                        <div onClick={handleSingleDataSelect('primary_muscle-popup',data)}>
                                                            <div>{data.name}</div>
                                                        </div>
                                                       )
                                                   })
                                               }
                                            </div> */}
                                           <div style={{background:"transparent", border:"none", margin: "0 0 4% -1%", borderBottom:"0px"}}>Primary Muscle</div>
                                            <div className="mt-1">
                                                {
                                                        tgmsclList.map((data,index)=>{
                                                        return(
                                                            <div  onClick={handleSingleDataSelect('primary_muscle-popup',data)}   style={{display:'flex',flexDirection:'row',paddingLeft:"2%"}}>
                                                                    <div>
                                                                        <input checked={ primary_muscle == data._id } name="my-extype" style={{alignSelf:'center'}}  id={"ex_level"+data._id.trim()+index} type="checkbox"/><span className="bold-font" style={{alignSelf:'center',marginTop:'1%',marginLeft:'4%'}}>{data.name}</span>
                                                                    </div>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                       </div>
                                    
                                    </div>

                                    <div className="input-popup-space">
                                    <div className="selected-popop-item__wrapper">
                                            <div style={{background:"transparent", border:"none", margin: "0 0 4% -1%", borderBottom:"0px"}}>Secondary Muscle</div>
                                            <div className="mt-1">
                                               {
                                                    tgmsclList.map((data,index)=>{
                                                       return(
                                                        <div onClick={handleToggle("secondary_muscle",data._id)}  style={{display:'flex',flexDirection:'row', paddingLeft:"2%"}}>
                                                             <div>
                                                                <input checked={secondary_muscle.indexOf(data._id) !== -1} style={{alignSelf:'center'}}  id={"ex_level"+data._id.trim()+index} type="checkbox"/><span className="bold-font" style={{alignSelf:'center',marginTop:'1%',marginLeft:'4%'}}>{data.name}</span>
                                                            </div>
                                                        </div>
                                                       )
                                                   })
                                               }
                                           </div>
                                       </div>
                                    </div>
                                    
                                    
                                </div>
                               
                                
                    

                        </div>


                    <div id="video-info-container" className="popcontainer-wrapper"> 
                        <div className="popcontainer-sub-wrapper">
                                <div className="input-popup-space">
                                    <div style={{alignSelf:'center'}} className="popup-header-one">
                                        <div  style={{display:'flex',flexDirection:'row',alignItems:'flex-start',width:'100%'}}>
                                            <div style={{alignSelf:'center'}}>Videos</div>
                                            <div role="button" onClick={addPopupListDataItem("videoList")} style={{alignSelf:'center',marginBottom:"-3%",marginLeft:'3%'}}>  <span role="button"  class="material-icons-outlined" style={{fontSize:"1.6vw", alignSelf:"center", color:"#e0e0e0"}}>add_circle_outline</span></div>

                                        </div>
                                    
                                    </div>
                                </div>

                            </div>
                            <div style={{width:'94%',margin:'1% 5%',overflowY:'scroll',maxHeight:'20vw',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
                       {
                           videoList.map((data,index)=>{
                                return ( 
                                    <div className="popcontainer-sub-wrapper">
                                        <div style={{alignSelf:'center',display:'flex',width:index==0?'100%':'95%',alignItems:'center'}}>
                                                <div style={{alignSelf:'center', margin: "1% 1%",width:'5%',fontSize:'1.2vw'}}>{index+1}.</div>
                                                <div style={{alignSelf:'center',width:'95%',justifyContent:'space-between',display:'flex',alignItems:'flex-start',flexDirection:'row'}}>
                                                    <input  onChange={handlePopupListItem("videoList","title",index)}  value={videoList[index]["title"]}  style={{width:'30%'}} className="input-popup-two input-popup-space" placeholder="Title"/>
                                                    <input onChange={handlePopupListItem("videoList","url",index)}  value={videoList[index]["url"]}  style={{borderRadius:'8px',width:'70%',border:'1px solid #e2e2e2'}} className="input-popup-two input-popup-space" placeholder="https://"/>
                                                </div>
                                        </div>
                                        <div style={{alignSelf:'center',display:index==0?'none':'block',width:'5%'}}>
                                            <center>
                                            <span role="button" onClick={handleRemovePopupListItems("videoList",index)}  class="material-icons-outlined" style={{fontSize:"1.6vw", alignSelf:"center", color:"#e0e0e0"}}>clear</span>
                                            </center>
                                        </div>
                                    </div>
                                )
                            })
                        }
                       </div>
                      
                    </div>


                    <div id="audio-info-container" className="popcontainer-wrapper"> 
                    <div className="popcontainer-sub-wrapper">
                                <div className="input-popup-space">
                                    <div className="popup-header-one">
                                         Audio
                                    </div>
                                </div>

                            </div>
                            
                            <div className="popcontainer-sub-wrapper">
                                <div style={{alignSelf:'center',display:'flex',width:'100%',alignItems:'center'}}>
                                        
                                        <div style={{alignSelf:'center',width:'100%',justifyContent:'space-between',display:'flex',alignItems:'flex-start',flexDirection:'row'}}>
                                            <input  onChange={handlePopupListItem("audioList","title",0)} value={audioList[0]['title']} style={{width:'30%'}} className="input-popup-two input-popup-space" placeholder="Title"/>
                                            <input  onChange={handlePopupListItem("audioList","url",0)} value={audioList[0]['url']} style={{borderRadius:'8px',width:'70%',border:'1px solid #e2e2e2'}} className="input-popup-two input-popup-space" placeholder="https://"/>
                                        </div>
                                </div>
                            
                            </div>
        
                        
                    </div>
                    


                    
                </div>,
                <hr/>,

               <center> 
                <div onClick={formType==0?onCreate:onUpdate} style={{marginTop:"-1.5%"}} className="register-button">
                   <div>{formType==0?`Create`:`Update`}</div>
               </div>
               </center>
             
            
                ]
            }


        </div>




        </Dashboard>
    )
}

export default ManageContent;
