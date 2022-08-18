import React,{useState, useEffect} from 'react';
import { isAuthenticated } from '../../auth';
import Dashboard from '../../core/Dashboard';
import { assignExerciseType, popExerciseType } from '../helper/api';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import { getGym, gettotalMembers } from '../../gym/helper/api';


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="right" ref={ref} {...props} timeout={{enter: 300, exit: 400}}/>;
});

const ManageExerciseType = (props) => {

    // Hooks call for getting Dashboard Info 
    const [flag]=useState(1);
    const ItemId = props.match.params.itemId;

    const [currentExId, setCurrentExId] =  useState("");

    // User Authentication
    const {user,token} = isAuthenticated();

    // Hooks call for using the same form to create & block
    const [switchForm, setSwitchForm] =  useState({
        formName : "",
        formType : "",
        exId : "",
    });

    const {formName, formType, exId} = switchForm;

    const [Gym,setGym]=useState({
       totalBranch:0,
       totalMembers:0
    });
    const {totalBranch,totalMembers}=Gym;
    // Get All Exercise Type
    const [ExtypeList,setExtypeList]=useState([]);

    const getThisGym=()=>{
        getGym(user._id,token,ItemId).then(data=>{
          if (data.error){
            console.log("error in db")
          }else{
             setExtypeList(data.extypeList);
          }
        })
    }

    // Hooks call to Open Create, & Delete Exercise Type Dialog Form
    const [open, setOpen] = useState(false);

    const handleCreateOpen = () => {
        setSwitchForm({
            formName: "Exercise Type",
            formType: 0,
        });
        setOpen(true);
    }

    const handleDeleteOpen = exId => {
        setSwitchForm({
            formName: "Delete",
            formType: 1,
            exId: exId
        });
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    };

    // Hook's Call for Exercise Type
    const [ExerciseType, setExerciseType] = useState({
        exType : "",
        error: "",
        loading: false,
        success: false
    });

    const {exType} = ExerciseType;

    const onCreate = event => {
        event.preventDefault();

        // Create Request to Backend 
        assignExerciseType(user._id,token,ItemId,{exType}).then(data => {
            if(data.error){
                console.log(data.error)
            }else{
                setExerciseType({
                    exType:"",
                    success: true
                });
                handleClose();
                getThisGym();
            }
        })
    }
    

    const onDelete =item=>event=> {
        
        event.preventDefault();

        // Delete Request to Backend 
        popExerciseType(user._id,token,ItemId,{item}).then(data=>{
            if(data.error){
              console.log('error in db')
            }else{
                handleClose();
                setExtypeList(data.extypeList);
                getThisGym();
            } 
        })
    }

    useEffect(()=>{
        getThisGym();
        gettotalMembers(user._id,token,ItemId).then(data=>{
            setGym({...Gym,totalMembers:data.totalmembers,totalBranch:data.totalbranch})
        }).catch(err=>console.log(err))
    },[])

    // Handle Request to accept Exercise Type from input fields
    const handleChange = name => event => {
        setExerciseType({...ExerciseType,[name]:event.target.value});
    }

    return(
        <Dashboard flag={flag} itemId={ItemId} data={{totalMembers,totalBranch,state:"none"}}>
            <div className="row" style={{justifyContent: "space-between"}}>
                <div className="row">
                    <input className="ml-5 pl-4 pr-4 pb-2 pt-2 mb-3 mt-3 shadow-sm" placeholder="Search for names.." style={{outline: "none", borderRadius: 30, width: "60%", border: "none", color: "#757575", backgroundColor: "#e0e0e0"}}/>
                    <span className="material-icons mt-3 ml-3" style={{fontSize: 32}}>sort</span>
                    
                    {/* Create Exercise Type Form Open request */}
                    <button onClick={handleCreateOpen} className="mt-1" style={{outline: "none", border: "0px",backgroundColor:"#ffffff"}}>
                        <span className="material-icons shadow" style={{fontSize:32, borderRadius:100, color :"rgb(255, 81, 0)"}}>add_circle</span>
                    </button>
                </div>
                <p className="mr-5 pt-4" style={{fontSize: 16}}>Exercise Type</p>
            </div>
            <div className="pt-3 pl-3 pr-3">
            {
              ExtypeList.map((data)=>{
                return(
                    <div onClick={()=>{setCurrentExId(data); }}   className="shadow mb-2" style={{ backgroundColor:currentExId == data?"#f5f5f5":"#ffffff",width: "100%", height: 33, borderRadius: 10}}>
                        <div className="row pl-4 pr-4" style={{justifyContent: "space-between"}}>
                            <div className="row">
                                <p className="pt-1 pl-4" style={{fontSize: 15}}>{data}</p>
                            </div>
                            <div className="row">
                                <span onClick={() => {handleDeleteOpen(data)}} className="material-icons pt-1 btn pr-4" style={{color: "#FF6060"}}>block</span>
                            </div>
                        </div>
                    </div>
                    
                )
              })
            }
            </div>

            <Dialog open={open} onClose={handleClose} TransitionComponent={Transition}>
                {
                    (formType === 0)?(
                        <div className="pr-4 pl-2">
                            <div className="row ml-4 mt-4 mr-2 mb-4" style={{justifyContent: "space-between"}}>
                                <div className="pl-4 pr-4 pb-2 pt-2 mb-3 mt-3 shadow-sm text-center" style={{outline: "none", borderRadius: 30, width: "70%", border: "none", color: "#ffffff", fontWeight: "bolder",backgroundColor: "rgb(255, 81, 0)", }}>
                                    {formName}
                                </div>
                                <button onClick={onCreate} className="mt-1" style={{outline: "none", border: "0px",backgroundColor:"#ffffff"}}>
                                    <span className="material-icons shadow" style={{fontSize:36,borderRadius:100, color :"rgb(255, 81, 0)"}}>add</span>
                                </button>
                            </div>
                            <div>
                                <input onChange={handleChange("exType")} value={exType} className="pl-4 pr-4 pb-3 pt-3 mb-3 ml-4 shadow" type="text" id="gymName" name="gymName" autoFocus="true" placeholder="Name" style={{outline: "none", borderRadius: 30, width: "90%", border: "none", color: "rgb(255, 81, 0)"}}/>
                            </div>
                        </div>
                    )
                    : (formType === 1)?(
                        
                        <div className="ml-5 mt-4 mr-5 mb-4">
                           {/* Delete Exercise Type */}
                            <p style={{fontWeight: "bold", fontSize: 17, color :"rgb(255, 81, 0)"}}>{exId}</p>
                            Do you really want to delete this <br/> Exercise Type?
                            <div className="row mt-2" style={{justifyContent: "flex-end"}}>
                                <button onClick={onDelete(exId)} className="mt-1 mr-3 shadow-sm" style={{borderRadius: 20, width: 40, height: 30, outline: "none", border: "0px",backgroundColor:"#ffffff"}}>
                                    <p className="pt-1" style={{color: "#FF6060"}}>Yes</p>
                                </button>
                                <button onClick={handleClose} className="mt-1 shadow-sm" style={{borderRadius: 20, width: 40, height: 30, outline: "none", border: "0px",backgroundColor:"#ffffff"}}>
                                    <p  className="pt-1" style={{color: "#43a047"}}>No</p>
                                </button>
                            </div>

                        </div>
                    )
                    : (null)
                }
            </Dialog>
        </Dashboard>
    )
}

export default ManageExerciseType;