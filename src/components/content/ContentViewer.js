import React, {useState, useEffect} from 'react';
import { isAuthenticated } from '../../auth';
import Dashboard from '../../core/Dashboard';
import { getContent } from '../helper/api';
import ReactPlayer from 'react-player';
import Spinner from '../../assets/Spinner.svg';
import { gettotalMembers } from '../../gym/helper/api';
import PlayButton from "../../assets/play.png";
import {getAllParameters} from '../helper/api'
import Image from "../../assets/abdominals.png";
import defaultVideoThumbnail from "../../assets/default.jpg";

const ContentViewer = (props) => {

    // Hooks call for getting Dashboard Info 
    const synth = window.speechSynthesis;
    const voices = synth.getVoices();
   
    const [flag]=useState(1);
    const ItemId = props.match.params.itemId;
    const ContentId = props.match.params.contentId;
    const [Gym,setGym]=useState({
        totalBranch:0,
        totalMembers:0
    });
    const [currentExerciseVideo, setCurrentExerciseVideo] = useState("https://youtu.be/7sDY4m8KNLc");
    const [currentExerciseVideoTitle,setCurrentExerciseVideoTitle]=useState("Demo Title");

    const dummyText = "Lorem Ipsum is simply dummy text of the printing and typesetting industry and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. Why do we use it hello h?"
    const dummyLink = "https://www.youtube.com/watch?v=iw_MFkAnSGA";

    const [getPreviousStep, setPreviousStep] =  useState(``);
    const {totalBranch,totalMembers}=Gym;

    // User Authentication
    const {user,token} = isAuthenticated();

    const [exStep,setexStep]=useState({
        step:"Step 1",
        title:"",
        description:""
    });
    const {step,title,description}=exStep;

    // Hooks call to Get Content
    const [Content, setContent] = useState({
        contentId:"",
        exMode:0,
        exName:"",
        Instructions:"",
        exercise_Steps:[],
        exType:[],
        primary_muscle:[],
        secondary_muscle:[],
        exLevels:[],
        fileupload:false,
        videoList:[],
        audioList:[
            {
                title:"",
                url:""
            }
        ],
    });

    const {exMode,exName,exLevels,Instructions,contentId,exType,exercise_Steps,primary_muscle,secondary_muscle,audioList,videoList}=Content;



    // Get Content 
    const GetTheContent = () => {
        return getContent(user._id,token,ContentId).then(data=>{
            if(data.error){
                 return false;
            }else{
                return data;
            }
        }).catch(()=>{
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

    const GetAllParameterDataset=()=>{
        for(let type=0;type<4;type++){
            GetAllParameters(type);
        }
    }

    const textToAudio = text=>event => {
     
        setTimeout(()=>{
            let utterThis = new SpeechSynthesisUtterance(text);
            utterThis.voice = voices["en-US"];
            utterThis.rate=0.9;
            synth.speak(utterThis);
            // if(synth.speaking){
            //  //  synth.pause()
            //  alert("speaking")
            // }else{
            //     alert("not speaking")
            // }
        },100)
    }

    const toggleContentDetails = event => {
       event.preventDefault();
       let currentId = event.target.id;

        if(document.getElementById("details-open").style.display == "block"){
            document.getElementById("content-details-list-data").classList.add("content-section-expanded");
            document.getElementById("content-details-list-data").style.boxShadow = "none";
            document.getElementById("content-details-data").style.display = "none";
            document.getElementById("video-content-list").style.display = "none";
            document.getElementById("content-expand-details-data").style.display = "flex";
            document.getElementById("details-open").style.display = "none";
            document.getElementById("details-close").style.display = "block";
        }else{
            document.getElementById("content-details-list-data").classList.remove("content-section-expanded");
            document.getElementById("content-details-list-data").style.boxShadow = "0px -0.01px 4px 4px rgb(0, 0, 0, 0.03)";
            document.getElementById("content-details-data").style.display = "block";
            document.getElementById("content-expand-details-data").style.display = "none";
            document.getElementById("video-content-list").style.display = "block";
            document.getElementById("details-open").style.display = "block";
            document.getElementById("details-close").style.display = "none";
        }
    }


    const handleSteps = (step,index)=>event => {
        event.preventDefault()
        setexStep({
            ...exStep,
            step:`Step `+(index+1),
            description:step.description,
            title:step.title
        })
        setPreviousStep(`step`+index);
    }



   const loaderPreview = videoList => {
        setTimeout(() => {
            if(document.getElementById("player-loader-id")) document.getElementById("player-loader-id").style.display = "none";
            if(document.getElementById("react-player-id")) document.getElementById("react-player-id").style.display = "block";
            for(let i=0;i<videoList.length;i++){
                if(videoList[i].title){
                    if(document.getElementById("sub-video-content-"+i)) document.getElementById("sub-video-content-"+i).style.display = "block";
                    if(document.getElementById("sub-loader-"+i)) document.getElementById("sub-loader-"+i).style.display = "none";
                }
            }
        }, 2000);
   }

   const getCurrentVideo =video=> event => {
       setCurrentExerciseVideo(video.url);
       setCurrentExerciseVideoTitle(video.title);
   }

  

    useEffect(async ()=>{
        let data=await GetTheContent();
        console.log(data)
        let timer = setInterval(async ()=>{
            if(data!=false){
                clearInterval(timer)
                let videolist=data.videoList;
                if(videolist.length<4){
                    for(let i=0;i<5-videolist.length;i++){
                        videolist.push({})
                    }
                }
                let exerciseTypeList=await GetAllParameters(1);
                let exType=[];
                if(exerciseTypeList!=false){
                    let d=exerciseTypeList.find(doc=>doc._id==data.exType);
                    exType.push(d._id);
                    exType.push(d.name)
                }

                let exerciseLevelList=await GetAllParameters(0);
                let exlevellist=[];
                if(exerciseTypeList!=false&&data.exLevels&&data.exLevels.length!=0&&exerciseLevelList.length!=0){
                    data.exLevels.forEach(id => {
                        let data=exerciseLevelList.find(doc=>doc._id==id);
                        exlevellist.push(data);
                    });
                }

                let targetmsclelist=await GetAllParameters(2);
                let seconadarymscllist=[];
                if(targetmsclelist!=false&&data.secondary_muscle&&data.secondary_muscle.length!=0&&targetmsclelist.length!=0){
                    data.secondary_muscle.forEach(id => {
                        let data=targetmsclelist.find(doc=>doc._id==id);
                        seconadarymscllist.push(data);
                    });
                }

                let PrmaryMuscle=[];
                if(targetmsclelist!=false){
                    let d=targetmsclelist.find(doc=>doc._id==data.primary_muscle);
                    PrmaryMuscle.push(d._id);
                    PrmaryMuscle.push(d.name)
                }

             
                setContent({
                    ...Content,
                    contentId:data._id,
                    exMode:data.exMode,
                    exName:data.exName,
                    Instructions:data.Instructions,
                    exercise_Steps:data.exercise_Steps,
                    exType:exType,
                    primary_muscle:PrmaryMuscle,
                    secondary_muscle:seconadarymscllist,
                    exLevels:exlevellist,
                    fileupload:data.fileupload,
                    videoList:data.videoList,
                    audioList:data.audioList
                });
                setexStep({
                    ...exStep,
                    title:data.exercise_Steps[0].title,
                    description:data.exercise_Steps[0].description,
                    step:`Step 1`
                });
                setPreviousStep(`step0`)
                setCurrentExerciseVideo(data.videoList[0].url);
                setCurrentExerciseVideoTitle(data.videoList[0].title);
                loaderPreview(videolist);


               // GetAllParameterDataset();
            }
        },100)
       
        gettotalMembers(user._id,token,ItemId).then(data=>{
            setGym({...Gym,totalMembers:data.totalmembers,totalBranch:data.totalbranch})
        }).catch(err=>console.log(err))
        document.querySelector("main").addEventListener("wheel", (evt) => {
            evt.preventDefault();
            document.querySelector("main").scrollLeft += evt.deltaY;
        });
     
       
     
    },[])

    return(
        <Dashboard data={{
            state:props.location.state,
            totalMembers,
            totalBranch
        }} flag={flag} itemId={ItemId}>
            <div className="content-viewer-description-container d-flex">
                <div id="video-content-list" className="video-container">
                    <div className="video-play-section d-flex">
                        {/* <img src={PlayButton} className="play-button"/> */}
                        <div id="player-loader-id" class="lds-ellipsis play-button" style={{margin: "4% 0 0 43%"}}><div></div><div></div><div></div><div></div></div>
                        <ReactPlayer 
                            id = "react-player-id"
                            style={{borderRadius:"5px", overflow: "hidden", display:"none"}} 
                            width="558px" height="320px" 
                            controls url={currentExerciseVideo}
                            onReady = {() => {console.log("onReady Callback")}}
                            onStart = {() => {console.log("onStart Callback")}}
                            onPause = {() => {console.log("onPause Callback")}}
                            onEnded = {() => {console.log("onEnded Callback")}}
                            onError = {() => {console.log("onError Callback")}}
                        />
                    </div>

                    
                    

                    <div className="video-details">
                        <div className="video-title bold-font">{currentExerciseVideoTitle}</div>
                        {/* <div className="video-description-heading">Description</div>
                        <div className="video-description-txt">Description text will go here</div> */}
                    </div>

                    <main className="content-video-list d-flex" style={{position:'relative'}} >
                        {
                            videoList.map((video,index)=>{
                                  if(video.title){
                                    return (
                                        <div id={"videocontainer"+index} className="video-content-preview d-flex flex-item"  onClick={getCurrentVideo(video)}>
                                            <div id={"sub-loader-"+index} class="lds-ellipsis play-button small-btn" style={{margin: "10% 0 0 25%"}}><div></div><div></div><div></div><div></div></div>
                                            <ReactPlayer 
                                                id={"sub-video-content-"+index}
                                                style={{borderRadius:"5px", overflow: "hidden", position:"absolute", display:"none", pointerEvents:"none"}}
                                                width="160px" height="115px"
                                                controls url={video.url}
                                                onReady = {() => {console.log("onReady Callback")}}
                                                onStart = {() => {console.log("onStart Callback")}}
                                                onPause = {() => {console.log("onPause Callback")}}
                                                onEnded = {() => {console.log("onEnded Callback")}}
                                                onError = {() => {console.log("onError Callback")}}
                                            />
                                            <div className="video-title-popup" style={{pointerEvents:"none"}}>
                                            {video.title}
                                            </div>
                                        </div>
                                    )
                                  }else{
                                      return (
                                        <div className="video-content-preview d-flex flex-item">
                                          <img id={"videocontainer-"+index} src={defaultVideoThumbnail} style={{width: "100%", height:"100%", borderRadius: "5px", display:"block"}}/>
                                        </div>
                                      )
                                  }
                            })
                        }
                     
                        {/* <div className="video-content-preview d-flex flex-item">
                            <img id="default-thubnail-id-2" src={defaultVideoThumbnail} style={{width: "100%", height:"100%", borderRadius: "5px", display:"none"}}/>
                        </div>
                        <div className="video-content-preview d-flex flex-item">
                            <img id="default-thubnail-id-3" src={defaultVideoThumbnail} style={{width: "100%", height:"100%", borderRadius: "5px", display:"none"}}/>
                        </div> */}
                    </main>

                </div>
               
               
                <div id="content-details-list-data" className="content-details-section">
                    <div className="d-flex" style={{width:"100%", justifyContent:"space-between", margin: "0 0 2% 0"}}>
                        <div className="content-details-heading flex-item">Content Details</div>
                        <span id="details-open" onClick={toggleContentDetails} class="material-icons-round edit-icon flex-item">open_in_full</span>
                        <span id="details-close" onClick={toggleContentDetails} style={{display:"none"}} class="material-icons-round edit-icon">close_fullscreen</span>
                    </div>
                    
                    <div id="content-details-data">
                        <div className="d-flex" style={{justifyContent:"space-between"}}>
                            <div className="content-scroll-container">
                                <div className="content-details-tag bold-font">Name</div>
                                <div className="content-details-items">{exName}</div>
                                <div className="content-details-tag bold-font">Exercise Type</div>
                                <div className="content-details-items">{exType.length==0?`NaN`:exType[1]}</div>
                                <div className="content-details-tag bold-font">Exercise Level(s)</div>
                                <div className="content-details-items">{exLevels.length==0?"NaN":""}</div>
                                <div className="d-flex spacing-27" style={{flexWrap:"wrap"}}>
                                    {
                                        exLevels.map(data=>{
                                            return (
                                            <div className="content-chips">{data.name}</div>
                                            )
                                        })
                                    }
                                </div>
                                
                                <div className="content-details-tag bold-font">Target Muscle(s)</div>
                                <div className="spacing-27">
                                    
                                        <div className="content-details-items" style={{marginBottom:"1%"}}>Primary</div>
                                        <div className="d-flex" style={{flexWrap: "wrap", marginBottom:"3%"}}>
                                            <div className="content-details-items">{primary_muscle.length==0?"NaN":""}</div>
                                            <div style={{display:primary_muscle.length==0?"none":"block"}} className="content-chips">{primary_muscle[1]}</div>
                                        </div>
                                       
                                        <div className="content-details-items" style={{marginBottom:"1%"}}>Secondary</div>
                                        <div className="d-flex" style={{flexWrap: "wrap", marginBottom:"3%"}}>
                                        <div className="content-details-items">{secondary_muscle.length==0?"NaN":""}</div>
                                            {
                                                secondary_muscle.map((data)=>{
                                                    return(
                                                       <div   className="content-chips">{data.name}</div>
                                                    )
                                                })
                                            }
                                            
                                        </div>
                                        
                                   
                                                                             
                                </div>

                                <div className="d-flex" >
                                    <div className="content-details-tag bold-font flex-item">Instructions</div>
                                    <span role="button" onClick={textToAudio(Instructions)}  style={{color:'black'}} class="material-icons-round speech-icon flex-item">volume_up</span>
                                </div>
                                <div id="text-to-speech" value="Instruction details will go here" className="content-details-items" style={{fontSize:"0.9vw", textAlign:"justify"}}>{Instructions.slice(0, 180)}<span role="button" onClick={toggleContentDetails} style={{color:"#1b85ff",cursor:'pointer'}}>..more</span>
                                </div>
                                
                               </div>
                        </div>
                    </div>

                    <div id="content-expand-details-data" style={{display:"none"}}>
                        <div className="d-flex" style={{justifyContent:"space-between", width:"64vw"}}>
                            <div className="content-view-container-2 flex-item">
                                <div className="content-details-container">
                                    <div className="d-flex">
                                        <div style={{margin:"0 8% 0 0"}}>
                                            <div className="content-details-tag bold-font">Name</div>
                                            <div className="content-details-items">{exName==""?"NaN":exName}</div>
                                        </div>
                                        <div>
                                            <div className="content-details-tag bold-font">Exercise Type</div>
                                            <div className="content-details-items">{exType.length==0?`NaN`:exType[1]}</div>
                                        </div>
                                    </div>
                                    <div style={{margin:"2% 0 0 0"}}>
                                        <div className="content-details-tag bold-font">Exercise Level</div>
                                        {
                                            exLevels.length==0?(
                                                <div className="content-details-items">NaN</div>
                                            ):(null)
                                        }
                                        <div className="d-flex" style={{flexWrap:"wrap"}}>
                                           {
                                               exLevels.map(data=>{
                                                
                                                   return (
                                                     <div className="content-chips">{data.name}</div>
                                                   )
                                               })
                                           }
                                        </div>
                                    </div>
                                </div>
                                <div className="content-body-composition-container">
                                    <div className="content-expand-heading bold-font" style={{margin: "0 0 4% 0"}}>Target Muscles</div>
                                    <div className="d-flex">
                                        <div style={{width:"40%"}}>
                                            <div className="content-details-tag" style={{whiteSpace : "nowrap", margin: "0 0 6% 2%"}}>Primary Muscle(s)</div>
                                            {
                                              primary_muscle.length==0?(
                                                <div className="content-details-items">NaN</div>
                                                ):(<div className="target-muscle-list-active">{primary_muscle[1]}</div>)
                                            }
                                        
                                            <div className="content-details-tag" style={{whiteSpace : "nowrap", margin: "10% 0 6% 2%"}}>Secondary Muscle(s)</div>
                                            {
                                                secondary_muscle.length!=0?(null):(  <div className="content-details-items">NaN</div>)
                                            }
                                            {
                                                secondary_muscle.map((data)=>{
                                                    return (
                                                        <div className="target-muscle-list">{data.name}</div>
                                                    )
                                                })
                                            }
                                          
                                        </div>
                                        
                                        <div style={{width:"60%",}}>
                                             <img src={Image} style={{width:"100%"}}/>
                                        </div>
                                        
                                    </div>
                                </div>
                            </div>
                            <div className="content-view-container-1 flex-item">
                                <div className="instruction-container">
                                <div className="d-flex" >
                                    <div className="content-expand-heading bold-font">Instructions</div>
                                    <span role="button" onClick={textToAudio(Instructions)}  style={{color:'black'}} class="material-icons-round speech-icon flex-item">volume_up</span>
                                </div>
                                    {/* <div className="content-expand-title bold-font" style={{margin: "2% 0 1% 0"}}>Title</div> */}
                                    <div className="content-expand-heading mt-1 instrauction-container">{Instructions}</div>
                                </div>
                                <div className="instruction-steps-container">

                               
                                <div className="content-expand-heading bold-font" style={{margin: "0 0 4% 0"}}>Exercise Steps</div>
                                <div className="d-flex" style={{width:"26vw", height:"100%"}}>
                                    <div className="flex-item" style={{width:"100%", height: "100%"}}>
                                        
                                        <div className="d-flex">
                                          <div id="tracker-name" style={{margin: "0 0 5% 0", color: "#ff8800", fontWeight: "bold"}}>{step}</div>
                                          <div><span role="button" onClick={textToAudio(title+"."+description)} style={{color:'black'}} class="material-icons-round speech-icon flex-item">volume_up</span></div>
                                        </div>
                                         
                                        <div className="flex-item current-tracker-container">
                                            <div id="tracker-title" className="content-expand-title bold-font" style={{margin: "0 0 1% 0"}}>{title}</div>
                                            <div id="tracker-description" className="tracker-description-wrapper">{description}</div>
                                        </div>
                                    </div>
                                    <div className="content-tracker d-flex">
                                        <div className="tracker-line flex-item">
                                            <div className="tracker-progress"></div>
                                        </div>
                                        <div className="flex-item">
                                            {
                                                exercise_Steps.map((steps,index) => {
                                                    return(
                                                        <div role="button" id={`step`+index} onClick={handleSteps(steps,index)} className={(`step`+index) == getPreviousStep?"tracker-step-active":"tracker-step"}></div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                </div>
                                </div>
                            </div>
                           
                        </div>
                    </div>
                </div>
            </div>
            
            {/* <div className="ml-4" style={{position:"fixed", backgroundColor:"#ffffff", width: 365}}>
                <p className="pt-3" style={{fontSize: 20,  color:"#e65100"}}>{exName}</p>
            </div>
            <div className="row ml-4 mr-4 mt-4" style={{justifyContent: "space-between"}}>

                <div className="scroll" style={{overflow: "scroll", maxHeight: 450, maxWidth: 365}}>    

                {
                        (exMode == 1)?(
                            <div className="mt-3">
                                <div className="row pl-2 pr-3 pt-4">
                                    <div className="pl-1 mr-4 my-auto">
                                        <p className="pl-2">Exercise Type:
                                        <div className="pl-3 pr-3 pt-1 pb-1 shadow-sm mr-2 mt-2" style={{borderRadius: 100,backgroundColor: "#1b5e20", color: "#ffffff"}}>{exType}</div></p>
                                    </div>
                                    <div className="pl-1 mr-4 my-auto">
                                        <p className="pl-2">Exercise Level:
                                        <div className="pl-3 pr-3 pt-1 pb-1 shadow-sm mr-2 mt-2" style={{borderRadius: 100,backgroundColor: "#673ab7", color: "#ffffff"}}>{exLevel}</div></p>
                                    </div>
                                </div>
                                 
                                <p className="pl-1">Target Muscle(s):

                                <div className="container">
                                <div className="row">

                                {
                                    targetMscl.map((data, index)=>{
                                        return(
                                        
                                            <div className="pl-3 pr-3 pt-1 pb-1 shadow-sm mr-2 mt-2" style={{borderRadius: 100,backgroundColor: "#e65100", color: "#ffffff"}}>
                                                {data}
                                            </div>
                                
                                        )
                                    })
                                }
                                </div>

                                </div>
                                </p>

                            </div>
                        ):(null)
                    }

                    <div className="shadow p-2 scroll mt-4 mb-3" style={{borderRadius: 10, width: 350, height: 200, backgroundColor:"#ffffff", overflow: "scroll"}}>
                        <p className="pb-2">Description:
                        <p style={{color:"#616161"}}>{exDes}</p></p>
                    </div>
                    
                   
                    <p className="m-3" style={{color: "#000000"}}>Audio Lecture: {audioTitle}</p>
                    <ReactPlayer className="pb-2 pl-3 pr-3"
                        style={{color: "#b0bec5"}}
                        url={audioLink}
                        width="100%"
                        height="50px"
                        playing={false}
                        controls={true}
                        pip={true}
                        />
                   


                   
                </div>
                
                <div className="scroll" style={{overflow: "scroll", maxHeight: 450,  color:"#e65100", scrollBehavior:"smooth"}}>
                    
                    <a className="pl-3" style={{fontWeight: "bold"}}>Title 1: {videoLinkOneTitle}</a>
                    <div className="shadow-lg p-2 ml-2 mr-2 loader" style={{borderRadius: 10, width: 400, height: 200, marginBottom:15, marginTop: 5}}>
                        <ReactPlayer width="100%" height="100%"  controls='true' url={videoLinkOne} />
                    </div>
                    

                    <a className="pl-3" style={{fontWeight: "bold"}}>Title 2: {videoLinkTwoTitle}</a>
                    <div  className="shadow-lg p-2 ml-2 mr-2 loader" style={{borderRadius: 10, width: 400, height: 200, marginBottom:15, marginTop: 5}}>
                      
                        <ReactPlayer width="100%" height="100%" url={videoLinkTwo} />
                    </div>

                    {
                        (exMode == 1)?(
                            <div>
                                 <a className="pl-3" style={{fontWeight: "bold"}}>Title 3: {videoLinkThreeTitle}</a>
                                <div  className="shadow-lg p-2 ml-2 mr-2 loader" style={{borderRadius: 10, width: 400, height: 200, marginTop: 5}}>
                                    <ReactPlayer width="100%" height="100%" url={videoLinkThree} />
                                </div>
                            </div>
                        ): (null)
                    }
                   
                    
                </div>
            </div> */}
        </Dashboard>
    )

}

export default ContentViewer;