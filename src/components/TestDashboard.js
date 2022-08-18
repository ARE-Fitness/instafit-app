import React,{useEffect,useState} from 'react';
import Dashboard from '../core/Dashboard';
import { getGym, gettotalMembers } from '../gym/helper/api';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import { isAuthenticated } from '../auth';
import { addTestToGym, popTestFromGym,getAllMeasurementTestGym,getAllFitnessTestGym,totalPageBranchTest,totalPageGymTest } from './helper/api';




const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="right" ref={ref} {...props} timeout={{enter: 300, exit: 400}}/>;
});


const TestList = (props) => {

    // Hooks call for getting Dashboard Info 
    const ItemId = props.match.params.itemId;  
    const [limit,setlimit]=useState(9);
    const [page,setpage]=useState(1);
    const [total,settotal]=useState(0);
    const [currentpage,setcurrentpage]=useState(1);
    const [Gym,setGym]=useState({totalBranch:0,totalMembers:0});
    const {totalBranch,totalMembers}=Gym;

    // User Authentication
    const {user,token} = isAuthenticated();

    // Hooks call for using the same form to create & block
    const [switchForm, setSwitchForm] =  useState({
        formName : "",
        formType : 0,
        testId : "",
        listtype:0
    });

    const {formName, formType, testId,listtype} = switchForm;

    // Get All Exercise Type
    const [TestList,setTestList]=useState([]);

    // Hooks call to Open Create, & Delete Exercise Level Dialog Form
    const [open, setOpen] = useState(false);

    const handleCreateOpen = () => {
        setSwitchForm({
            ...switchForm,
            formName: "Add Test",
            formType: 0
        });
        setTest({
            ...Test,
            test_name:"",
            unit_type:"Weight"
        })
        setOpen(true);
    }

    const handleSelectTestListOpen=event=>{
        setSwitchForm({
            ...switchForm,
            formName:"Select Test Type",
            formType:2
        });
        setOpen(true);
    }

    const handleDelete = test=>event => {
        event.preventDefault();
        setSwitchForm({
            ...switchForm,
            formType: 1,
            testId:test._id
        });
        setTest({
            ...Test,
            test_name:test.test_name
        });
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    };

    const handleSelectTestType=(name,role)=>event=>{
        event.preventDefault();

      setSwitchForm({
         ...switchForm,
         formName:name,
         listtype:role
      });
      if(role==0){GetAllMeasurementTest(currentpage)}
      else{GetAllFitnessTest(currentpage)}
    };
    
    const handleChange=name=>event=>{
        setTest({...Test,[name]:event.target.value});
    };

 

    // Hook's Call for Test List
    const [Test, setTest] = useState({
        test_name : "",
        unit_type:"",
        test_type : 0,
        error: "",
        loading: false,
        success: false
    });

    const {test_name,unit_type, test_type} = Test;


    //API calls
    const AddTest=event=>{
        event.preventDefault();
        if(user.role==0||user.role==1){
            addTestToGym(user._id,token,ItemId,{test_name,test_type:listtype,unit_type}).then(data=>{
                if(data.error){
                   console.log(data.error); 
                }else{
                    if(listtype==0){GetAllMeasurementTest(currentpage)}
                    else{GetAllFitnessTest(currentpage)}
                    handleClose();
                }
            }).catch(err=>console.log(err))
        }else{
           // do some thing
        }
    };
    
    const PopTest=event=>{
        event.preventDefault();
        if(user.role==0||user.role==1){
            popTestFromGym(user._id,token,ItemId,testId).then(data=>{
                if(data.error){
                    console.log(data.error)
                }else{
                    if(listtype==0){GetAllMeasurementTest(currentpage)}
                    else{GetAllFitnessTest(currentpage)}
                  //  handleClose();
                }
            });
       }else{
           // do somethig
       }
    
    };

    const GetAllMeasurementTest=currentpage=>{
        if(user.role==0||user.role==1){
            getAllMeasurementTestGym(user._id,token,ItemId,limit,currentpage).then(data=>{
                if(data.error){
                    console.log(data.error);
                }else{
                    TotalPage(limit,0,data);
                }
            }).catch(err=>{
                alert("Something went wrong please try again")
            });
        }else{

        }
    }

    const GetAllFitnessTest=currentpage=>{
        if(user.role==0||user.role==1){
            getAllFitnessTestGym(user._id,token,ItemId,limit,currentpage).then(data=>{
                if(data.error){
                    console.log(data.error);
                }else{
                    TotalPage(limit,1,data);
                }
            }).catch(err=>{
                alert("Something went wrong please try again")
            });
        }else{

        }
    }

    const TotalPage=(limit,listtype,testlist)=>{
        if(user.role==0||user.role==1){
            totalPageGymTest(user._id,token,ItemId,limit,listtype).then(data=>{
                if(data.error){
                   throw "Something went wrong please try again";
                }else{
                    settotal(data.total);
                    setpage(data.page);
                    document.getElementById("testname").textContent=listtype==0?"Measurement Test":"Fitness Test";
                    setTestList(testlist);
                    handleClose();
                }
            }).catch(err=>{
                alert(err);
            })
        }else{
            totalPageBranchTest(user._id,token,ItemId,limit,listtype).then(data=>{
                if(data.error){
                    throw "Something went wrong please try again";
                }else{
                    settotal(data.total);
                    setpage(data.page);
                    document.getElementById("testname").textContent=listtype==0?"Measurement Test":"Fitness Test";
                    setTestList(testlist);
                    handleClose();
                }
            }).catch(err=>{
                alert(err);
            })
        }
        
    }



    //pagination
   
    const prev=()=>{
		if(currentpage<=page&&currentpage!=1){
            GetAllFitnessTest(currentpage-1);
		 	setcurrentpage(currentpage-1);
	    }
	};
	const next=()=>{
		if(currentpage<page){
		   GetAllMeasurementTest(currentpage+1);	
		   setcurrentpage(currentpage+1);
		}
	};


    //functional components

    useEffect(()=>{
        GetAllMeasurementTest(currentpage);
        gettotalMembers(user._id,token,ItemId).then(data=>{
            setGym({...Gym,totalMembers:data.totalmembers,totalBranch:data.totalbranch})
        }).catch(err=>console.log(err))
    },[]) 
  

    return(
        <Dashboard flag={1} itemId={ItemId} data={{totalMembers,totalBranch,state:"none"}}>
           
               
           <div className="row" style={{justifyContent: "space-between"}}>
                <div className="row">
                    <input className="ml-5 pl-4 pr-4 pb-2 pt-2 mb-3 mt-3 shadow-sm" placeholder="Search for names.." style={{outline: "none", borderRadius: 30, width: "60%", border: "none", color: "#757575", backgroundColor: "#e0e0e0"}}/>
                    <span className="material-icons mt-3 ml-3" style={{fontSize: 32}}>sort</span>
                    
                    {/* Create Exercise Level Form Open request */}
                    <button onClick={handleCreateOpen} className="mt-1" style={{outline: "none", border: "0px",backgroundColor:"#ffffff"}}>
                        <span className="material-icons shadow" style={{fontSize:32, borderRadius:100, color :"rgb(255, 81, 0)"}}>add_circle</span>
                    </button>
                </div>
                     
                 <button onClick={handleSelectTestListOpen}  className="row mr-5 mt-3 shadow-sm" style={{background:"#CAD5E2",border:"none",outline:"none", borderRadius:20,height:40}}>                     
                     <p id="testname" className="m-2" style={{fontSize:18}}>Measurement Test</p>
                     <p className="mr-2 mt-2 mb-2" style={{color:'black',fontSize:15,fontFamily:'cursive',marginTop:20}}>( {total} )</p>
                     <span class="material-icons mr-2 mt-2 mb-2">open_in_full</span>
                 </button>
            
            </div>

            <div className="pt-3 pl-3 pr-3">
            {
              TestList.map((data,index)=>{
                return(
                    <div onClick={()=>console.log(data.test_name)}   className="shadow mb-2" style={{ backgroundColor:testId == data?"#f5f5f5":"#ffffff",width: "100%", height: 33, borderRadius: 10}}>
                        <div className="row pl-4 pr-4" style={{justifyContent: "space-between"}}>
                            <div className="row">
                                <p className="pt-1 pl-4" style={{fontSize: 15}}>
                                 {index+1}. <strong>name:</strong> {data.test_name}, <strong>unit type:</strong> {data.unit_type}
                                </p>
                            </div>
                            <div className="row">
                                <span onClick={handleDelete(data)} className="material-icons pt-1 btn pr-4" style={{color: "#FF6060"}}>block</span>
                            </div>
                        </div>
                    </div>
                    
                )
              })
            }


            <Dialog open={open} onClose={handleClose} TransitionComponent={Transition}>
                {
                    (formType === 0)?(
                        <div className="pr-4 pl-2">
                            <div className="row ml-4 mt-4 mr-2 mb-4" style={{justifyContent: "space-between"}}>
                                <div className="pl-4 pr-4 pb-2 pt-2 mb-3 mt-3 shadow-sm text-center" style={{outline: "none", borderRadius: 30, width: "70%", border: "none", color: "#ffffff", fontWeight: "bolder",backgroundColor: "rgb(255, 81, 0)", }}>
                                    {formName}
                                </div>
                                <button onClick={AddTest} className="mt-1" style={{outline: "none", border: "0px",backgroundColor:"#ffffff"}}>
                                    <span className="material-icons shadow" style={{fontSize:36,borderRadius:100, color :"rgb(255, 81, 0)"}}>add</span>
                                </button>
                            </div>
                            <div>
                                <input onChange={handleChange('test_name')} value={test_name}  className="pl-4 pr-4 pb-3 pt-3 mb-3 ml-4 shadow" type="text" id="gymName" name="gymName" autoFocus="true" placeholder="Name" style={{outline: "none", borderRadius: 30, width: "90%", border: "none", color: "rgb(255, 81, 0)"}}/>
                                <center>
                                   <div style={{margin:10}}>
                                     <label style={{fontSize:14,fontWeight:'bold'}} for="unittype">Unit Type</label>
                                     <select className="shadow-sm"  onChange={handleChange('unit_type')} value={unit_type} style={{
                                        fontSize:14,
                                        marginLeft:5,
                                        border:"1px dashed rgb(255, 81, 0)",
                                        outline:"none",
                                        backgroundColor:'transparent',
                                        height:30,
                                        paddingInline:5,
                                        width:120,
                                        borderRadius:5
                                    }} id="unittype">
                                        {
                                            ["Weight","Size","Length","Distance","Number","Time"].map((name,index)=>{
                                                return (
                                                    <option>{name}</option>
                                                )
                                            })
                                        }
                                    </select>
                                   </div>
                                </center>
                                {/* use if needed in future */}
                                {/* <div className="shadow ml-4 mt-2 mb-2 mr-2" style={{height:145,borderRadius:8,backgroundColor:"#fff"}}>
                                    &nbsp;
                                    <p className="ml-4" style={{fontSize:20,color:"#263238",fontWeight:'bold'}}>Type</p>
                                    <label class="container ml-4">Mesurement
                                    <input type="radio" onChange={handleChange('test_type')} value={0} checked="checked" name="radio"/>
                                    <span class="checkmark"></span>
                                    </label>
                                    <label class="container ml-4">Fitness
                                    <input type="radio" onChange={handleChange('test_type')} value={1}  name="radio"/>
                                    <span class="checkmark"></span>
                                    </label>
                                    &nbsp;
                                </div> */}
                            </div>
                        </div>
                    )
                    : (formType === 1)?(
                        
                        <div className="ml-5 mt-4 mr-5 mb-4">
                           {/* Delete Exercise Type */}
                            <p style={{fontWeight: "bold", fontSize: 17, color :"rgb(255, 81, 0)"}}>{test_name}</p>
                            Do you really want to delete this <br/> Test ?
                            <div className="row mt-2" style={{justifyContent: "flex-end"}}>
                                <button onClick={PopTest} className="mt-1 mr-3 shadow-sm" style={{borderRadius: 20, width: 40, height: 30, outline: "none", border: "0px",backgroundColor:"#ffffff"}}>
                                    <p className="pt-1" style={{color: "#FF6060"}}>Yes</p>
                                </button>
                                <button onClick={handleClose} className="mt-1 shadow-sm" style={{borderRadius: 20, width: 40, height: 30, outline: "none", border: "0px",backgroundColor:"#ffffff"}}>
                                    <p  className="pt-1" style={{color: "#43a047"}}>No</p>
                                </button>
                            </div>

                        </div>
                    )
                    : (
                        <div className="ml-5 mt-4 mr-5 mb-4">
                            <center><p style={{fontSize:18,fontWeight:'bold',color:"#6A1B4D"}}>TEST TYPE</p></center>
                            <div className="col">
                                <button onClick={handleSelectTestType("Add Measurement Test",0)} className="shadow" style={{margin:5,fontSize:16,width:120,height:40,outline:'none',border:'none',borderRadius:5,background:"#5A20CB",color:"#fff"}}>
                                    Measurement
                                </button><br/>
                                <button  onClick={handleSelectTestType("Add Fitness Test",1)} className="shadow" style={{margin:5,fontSize:16,width:120,height:40,outline:'none',border:'none',borderRadius:5,background:"#5A20CB",color:"#fff"}}>
                                    Fitness
                                </button>
                            </div>

                          </div>
                    )
                }
            </Dialog>
     

            </div>

        </Dashboard>
    )
}

export default TestList;