import { set } from 'lodash';
import React, {useState, useEffect} from 'react';
import { isAuthenticated } from '../../auth';
import Dashboard from '../../core/Dashboard';
import { getGym, gettotalMembers } from '../../gym/helper/api';
import { assignExerciseLable, popExerciseLable,getAllParameters, addParameter, updateParameter, getParameter, deleteParameter } from '../helper/api';

export default function ContentAttribute(props){

    // User Authentication
    const {user,token} = isAuthenticated();

    // Hooks call for getting Dashboard Info 
    const [flag]=useState(1);
    const [Parameter,setParameter]=useState({
        type:"",
        parameterId:"",
        name:"",
        remark:"",
        photo:"",
        targetMuscleList:[],
        exerciseLevelList:[],
        exerciseTypeList:[],
        exerciseImageList:[],
        formData:new FormData()
    })
    const {type,parameterId,name,remark,photo,targetMuscleList,exerciseImageList,exerciseTypeList,exerciseLevelList,formData}=Parameter;

    
    




    const toggleContentAttribute = (event) => {
        event.preventDefault();
        let toggleField = event.target.id.split('-')[1];
        if(document.getElementById("data-" + toggleField).style.display == "none"){
            document.getElementById("data-" + toggleField).style.display = "block";
            document.getElementById("radio-" + toggleField).checked = true; 
        }else{
            document.getElementById("data-" + toggleField).style.display = "none";
            document.getElementById("radio-" + toggleField).checked = false;
        }
    }

    const toggleUpdateAttribute = (event) => {
        event.preventDefault();
        let currentField = event.target.id.split('-')[1];
        console.log(currentField)
        if(document.getElementById("update-" + currentField).style.display === "none"){
            document.getElementById("edit-" + currentField).style.display = "none";
            document.getElementById("update-" + currentField).style.display = "block";
            document.getElementById("container-" + currentField).style.background = "#ffffff";
            document.getElementById("field-" + currentField+"name").style.pointerEvents = "auto";
            document.getElementById("field-" + currentField+"name").focus();
        }else{
            document.getElementById("edit-" + currentField).style.display = "block";
            document.getElementById("update-" + currentField).style.display = "none";
            document.getElementById("field-" + currentField+"name").style.pointerEvents = "none";
            document.getElementById("container-" + currentField+"name").style.background = "linear-gradient(to top, #f0f0f0, #ffffff)";
        }
    }


    //files data fetcher
    function getFile(filePath) {
        return filePath.substr(filePath.lastIndexOf('\\') + 1).split('.')[0];
    }

    //handler methods
    const handleChange=(variablename,name,index)=>event=>{
        setParameter(oldstate=>{
            oldstate[variablename][index][name]=event.target.value;
            return ({
                ...oldstate
            })
        })
    }

    const handleFileUpload=event=>{
        let fileTextContainer=document.getElementById(event.target.id+"-textcontainer");
        let filename=getFile(event.target.value)+"."+event.target.value.split('.')[1];
        if(event.target.files[0]&&event.target.value){
            fileTextContainer.innerHTML=filename.substring(0,25)+`${filename.length>25?"...":""}`;
        }
    }
   



    

    //API Methods 
    const GetAllParameters=type=>{
        getAllParameters(user._id,token,{type}).then(data=>{
            if(data.error){
                console.log(data.error)
            }else{
                setParameter(oldstate=>{
                    if(type==0) oldstate['exerciseLevelList']=data;
                    else if(type==1) oldstate['exerciseTypeList']=data;
                    else if(type==2) oldstate['targetMuscleList']=data;
                    else if(type==3) oldstate['exerciseImageList']=data;
                    return ({...oldstate})
                })
            }
        })
    };

    const AddParametersData=(elemntId,type)=>event=>{
        event.preventDefault();
        formData.set("type",type);
        if(document.getElementById(elemntId+"name")) formData.set("name",document.getElementById(elemntId+"name").value);
        if((type==2||type==3)&&document.getElementById(elemntId+"photo")){
             formData.set("photo",document.getElementById(elemntId+"photo").files[0]);
             formData.set("isPhotoUploaded",true)
        }else{
            formData.set("isPhotoUploaded",false)
        }
       
        if(document.getElementById(elemntId+"name")&&document.getElementById(elemntId+"name").value!=""){

                addParameter(user._id,token,formData).then(data=>{
                    if(data.error){
                        console.log(data.error)
                    }else{
                        GetAllParameters(type);
                    }
                }).catch(err=>console.log(err))
        }else{
            console.log('please include name')
        }
    }

    const UpdateParameter=(elemntId,parameterId,type)=>event=>{
        event.preventDefault()
        formData.set("type",type);
        if(document.getElementById(elemntId+"name")) formData.set("name",document.getElementById(elemntId+"name").value);
        if((type==2||type==3)&&document.getElementById(elemntId+"photo")){
             formData.set("photo",document.getElementById(elemntId+"photo").files[0]);
             formData.set("isPhotoUploaded",true)
        }else{
            formData.set("isPhotoUploaded",false)
        }
      
        if(document.getElementById(elemntId+"name")&&document.getElementById(elemntId+"name").value!=""){
            updateParameter(user._id,token,parameterId,formData).then(data=>{
                if(data.error){
                    console.log(data.error)
                }else{
                    GetAllParameters(type);
                    CloseEditBox();
                }
            }).catch(err=>{
                console.log('something went wrong please try again')
                CloseEditBox();
            })
        }
    


        function CloseEditBox(){
            let currentField = event.target.id.split('-')[1];
            document.getElementById("edit-" + currentField).style.display = "block";
            document.getElementById("update-" + currentField).style.display = "none";
            document.getElementById("field-" + currentField+"name").style.pointerEvents = "none";
            document.getElementById("container-" + currentField).style.background = "linear-gradient(to top, #f0f0f0, #ffffff)";
        }
    }

    const DeleteParameter=(parameterId,type)=>event=>{
        event.preventDefault()
        deleteParameter(user._id,token,parameterId).then(data=>{
            if(data.error){
                console.log('something went wrong please try again')
            }else{
                GetAllParameters(type)
            }
        })
    }

    const GetParameter=parameterId=>{
        getParameter(user._id,token,parameterId).then(data=>{
            if(data.error){
                console.log(data.error)
            }else{
                setParameter({
                    ...Parameter,
                    name:data.name,
                    type:data.type,
                    parameterId:data._id,
                    remark:data.remark
                });
            }
        })
    }

    const GetAllParameterDataset=()=>{
        for(let type=0;type<4;type++){
            GetAllParameters(type);
        }
    }

    

   


    useEffect(()=>{
        document.querySelector("main").addEventListener("wheel", (evt) => {
            evt.preventDefault();
            document.querySelector("main").scrollLeft += evt.deltaY;
        });
        GetAllParameterDataset()
    },[]);


    return(
        <Dashboard flag={flag} data={{state:"none"}} navItemData={"Gym"}>

            <div className="header-bar">
                <div className="dashboard-name-container">
                    <div className="dashboard-name">Parameters</div>
                </div>
            </div>

            <main className="d-flex content-attribute-scroller">
                <div className="flex-item content-attribute-section">
                    <div className="attribute-header bold-font">Exercise Level</div>
                    <div className="d-flex" style={{marginBottom:"5%"}}>
                        <input id="addexlevelname" className="my-profile-field" style={{width:"13vw", margin:"2% 0 0 4.4%"}} placeholder="Add New Exercise Level"/>
                        <button onClick={AddParametersData("addexlevel",0)} className="flex-item attribute-add">Add</button>
                    </div>
                    <div style={{height:"27.5vw", overflowY:"scroll"}}>
                        {
                            exerciseLevelList.map((data,index)=>{
                                return (
                                    <div  className="d-flex" style={{flexWrap:"wrap", margin:"1% 0 0 4.4%"}}>
                                            <div id={"container-exLevel"+data._id} className="attribute-field d-flex" style={{justifyContent:"space-between"}}>
                                                <input id={"field-exLevel"+data._id+"name"} onChange={handleChange("exerciseLevelList","name",index)}  value={exerciseLevelList[index]["name"]} type="text"  className="flex-item attribute-edit-field"/> 
                                                <span onClick={toggleUpdateAttribute} id={"edit-exLevel"+data._id} class="material-icons-round edit-icon flex-item">edit</span>
                                                <span onClick={UpdateParameter("field-exLevel"+data._id,data._id,0)} id={"update-exLevel"+data._id} class="material-icons-round edit-icon flex-item" style={{display: "none"}}>done</span>
                                            </div>
                                            <span onClick={DeleteParameter(data._id,0)} id={"delete-exLevel"+data._id} class="material-icons-round delete-icon flex-item" style={{marginLeft:"2%"}}>delete</span>
                                     </div>
                                )
                            })
                        }
                        {/* Demo Field */}
                        {/* <div className="d-flex" style={{flexWrap:"wrap", margin:"1% 0 0 4.4%"}}>
                            <div className="attribute-field d-flex" style={{justifyContent:"space-between"}}>
                                <div className="flex-item">Paisi</div> <span id="edit-others" class="material-icons-round edit-icon flex-item">edit</span>
                            </div>
                        </div> */}
                    </div>
                </div>
                <div className="flex-item content-attribute-section">
                    <div className="attribute-header bold-font">Exercise Type</div>
                    <div className="d-flex">
                        <input  id="addextypename"  className="my-profile-field" style={{width:"13vw", margin:"2% 0 0 4.4%"}} placeholder="Add New Exercise Type"/>
                        <button onClick={AddParametersData("addextype",1)} className="flex-item attribute-add">Add</button>
                    </div>
                    <div style={{height:"27.5vw", overflowY:"scroll"}}>
                        {
                            exerciseTypeList.map((data,index)=>{
                                return (
                                    <div  className="d-flex" style={{flexWrap:"wrap", margin:"1% 0 0 4.4%"}}>
                                            <div id={"container-exType"+data._id} className="attribute-field d-flex" style={{justifyContent:"space-between"}}>
                                                <input id={"field-exType"+data._id+"name"} onChange={handleChange("exerciseTypeList","name",index)}  value={exerciseTypeList[index]["name"]} type="text"  className="flex-item attribute-edit-field"/> 
                                                <span onClick={toggleUpdateAttribute} id={"edit-exType"+data._id} class="material-icons-round edit-icon flex-item">edit</span>
                                                <span onClick={UpdateParameter("field-exType"+data._id,data._id,1)} id={"update-exType"+data._id} class="material-icons-round edit-icon flex-item" style={{display: "none"}}>done</span>
                                            </div>
                                            <span onClick={DeleteParameter(data._id,1)} id={"delete-exType"+data._id} class="material-icons-round delete-icon flex-item" style={{marginLeft:"2%"}}>delete</span>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <div className="flex-item content-attribute-section">
                    <div className="attribute-header bold-font">Target Muscle</div>
                    {/* <div className="input-file d-flex">
                        <button class="btn">Upload a file</button>
                        <input type="file" name="myfile" />
                    </div> */}
                    <div class="upload-btn-wrapper">
                        <button   id={"addtargetmusclephoto-textcontainer"} class="btn">Upload a file</button>
                        <input id="addtargetmusclephoto" onInput={handleFileUpload} type="file"  />
                    </div>
                    <div className="d-flex">
                        <input   id="addtargetmusclename" className="my-profile-field" style={{width:"13vw", margin:"2% 0 0 4.4%"}} placeholder="Add New Target Muscle"/>
                        <button onClick={AddParametersData("addtargetmuscle",2)} className="flex-item attribute-add">Add</button>
                    </div>
                    <div style={{height:"27.5vw", overflowY:"scroll"}}>
                        {
                            targetMuscleList.map((data,index)=>{
                                return (
                                    <div  className="d-flex" style={{flexWrap:"wrap", margin:"1% 0 0 4.4%"}}>
                                            <div id={"container-Targetmuscle"+data._id} className="attribute-field d-flex" style={{justifyContent:"space-between"}}>
                                                <input id={"field-Targetmuscle"+data._id+"name"} onChange={handleChange("targetMuscleList","name",index)}  value={targetMuscleList[index]["name"]} type="text"  className="flex-item attribute-edit-field"/> 
                                                <span onClick={toggleUpdateAttribute} id={"edit-Targetmuscle"+data._id} class="material-icons-round edit-icon flex-item">edit</span>
                                                <span onClick={UpdateParameter("field-Targetmuscle"+data._id,data._id,2)} id={"update-Targetmuscle"+data._id} class="material-icons-round edit-icon flex-item" style={{display: "none"}}>done</span>
                                            </div>
                                            <span onClick={DeleteParameter(data._id,2)} id={"delete-Targetmuscle"+data._id} class="material-icons-round delete-icon flex-item" style={{marginLeft:"2%"}}>delete</span>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <div className="flex-item content-attribute-section">
                    <div className="attribute-header bold-font">Exercise Image</div>
                    <div class="upload-btn-wrapper">
                        <button id={"addexerciseimagephoto-textcontainer"} class="btn">Upload a file</button>
                        <input id="addexerciseimagephoto" onInput={handleFileUpload} type="file"  />
                    </div>
                    <div className="d-flex">
                        <input   id="addexerciseimagename" className="my-profile-field" style={{width:"13vw", margin:"2% 0 0 4.4%"}} placeholder="Image Name"/>
                        <button onClick={AddParametersData("addexerciseimage",3)} className="flex-item attribute-add">Add</button>
                    </div>
                    <div style={{height:"27.5vw", overflowY:"scroll"}}>
                        {
                            exerciseImageList.map((data,index)=>{
                                return (
                                    <div  className="d-flex" style={{flexWrap:"wrap", margin:"1% 0 0 4.4%"}}>
                                            <div id={"container-exerciseImage"+data._id} className="attribute-field d-flex" style={{justifyContent:"space-between"}}>
                                                <input id={"field-exerciseImage"+data._id+"name"} onChange={handleChange("exerciseImageList","name",index)}  value={exerciseImageList[index]["name"]} type="text"  className="flex-item attribute-edit-field"/> 
                                                <span onClick={toggleUpdateAttribute} id={"edit-exerciseImage"+data._id} class="material-icons-round edit-icon flex-item">edit</span>
                                                <span onClick={UpdateParameter("field-exerciseImage"+data._id,data._id,3)} id={"update-exerciseImage"+data._id} class="material-icons-round edit-icon flex-item" style={{display: "none"}}>done</span>
                                            </div>
                                            <span onClick={DeleteParameter(data._id,3)} id={"delete-exerciseImage"+data._id} class="material-icons-round delete-icon flex-item" style={{marginLeft:"2%"}}>delete</span>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </main>


          
        </Dashboard>
    )
}