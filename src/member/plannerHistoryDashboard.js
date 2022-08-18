import React,{useEffect,useState} from 'react';
import Dashboard from '../core/Dashboard';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Dialog from '@material-ui/core/Dialog';
import {getBranch} from '../branch/helper/api';
import Slide from '@material-ui/core/Slide';
import {API} from '../backend';
import { isAuthenticated } from '../auth';
import { getGym } from '../gym/helper/api';
import {getMember,getPlannerHistory,getAllPlannerHistoryByMembers,totalPlannerHistoryAndPages} from './helper/api';
import { getAllSelectedexercise } from '../components/helper/api';

//styles
const useStyles = makeStyles((theme) => ({
    appBar: {
      position: 'relative',
      background:"#fff"
    },
    title: {
      marginLeft: theme.spacing(2),
      color:"#000",
      flex: 1,
    },
    
}));

//transition animation method
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


export default function Member(props) {
    const classes = useStyles();
    const [openDialog,setopenDialog]=useState(false);//Dialog hooks
    const [currentpage,setcurrentpage]=useState(1);//hooks for saving current member list page
    const [page,setpage]=useState(1);//hooks for saving member page after fetched from the server page
    const [total,settotal]=useState(0);//save total member
    const [limit,setlimit]=useState(8);//get limited number of member document
    const [Member,setMember]=useState({ mfname:"",calender:"",planner:"",mlname:"",memail:"",mphone:"",memberId:"",active:true});//save member info ( name,phone,email )
    const { mfname,mlname,memail,calender,planner,mphone,memberId,active,mphoto }=Member;//destrucuring member
    const [dialogProperty,setdialogProperty]=useState({title:"Add medical Report",dialogfun:0});//dialog property controll hooks: 0- create 1- update member 
    const {title,dialogfun}=dialogProperty;//destructureing the dialogProperty hooks
    const [confirm,setconfirm]=useState(false);//action confirmation hooks
    const [PlannerHistory,setPlannerHistory]=useState([]);
    const [gymId,setgymId]=useState("");
    const [PlannerhistoryView,setPlannerHistoryView]=useState({planner_name:"",planner_startDate:"",exdays:[],plannerhistoryId:""});
    const [exerciselist,setexerciselist]=useState([]);
    const {planner_name,planner_startDate,exdays,plannerhistoryId}=PlannerhistoryView;


    
    const handleOpenDialog=()=>{
        setopenDialog(true);
    };//open dialog handler-open
    const handleCloseDialog=()=>{
        setopenDialog(false);
    };//close dialog handler -close
  
  //API functions
  const {user,token}=isAuthenticated();
 
  const GetAllSelectedExercises=exdays=>{
    getAllSelectedexercise(user._id,token,{exercisesId:exdays}).then(data=>{
      if(data.error){
        console.log(data.error)
      }else{
        setexerciselist(data)
      }
    }).catch(err=>console.log(err))
  }

  const GetThisMember=()=>{
      getMember(user._id,token,props.match.params.memberId).then(data=>{
        if(data.error){
          throw data.error;
        }else{
          setMember({
          ...Member,
          mfname:data.mfname,
          mlname:data.mlname,
          mphone:data.mphone,
          memail:data.memail,
          calender:data.calender,
          planner:data.planner,
          memberId:data._id,
          active:data.active
          });
          return props.match.params.branchId;
        }
      }).then(Id=>{
        getBranch(user._id,token,Id).then(data=>{
          if(data.error){
            console.log(data.error);
          }else{
            setgymId(data.gymId);
          }
        })
      }).catch(err=>console.log(err))
  };

 const GetAllPlannerHistorys=(currentpage,memberId)=>{
   getAllPlannerHistoryByMembers(user._id,token,memberId,limit,currentpage).then(data=>{
     console.log(data)
     if(data.error){
       throw "Something went wrong please  try again";
     }
     else{
       setPlannerHistory(data);
       TotalPlannerHistorysAndPage();
     }
   }).catch(err=>alert(err))
 };

 const TotalPlannerHistorysAndPage=()=>{
      totalPlannerHistoryAndPages(user._id,token,props.match.params.memberId,limit).then(data=>{
        if(data.error){
          throw "Something went wrong please try again"
        }else{
          settotal(data.total);
          setpage(data.page);
        }
      }).catch(err=>alert(err));
 }



 //gym and branch pagination function
 const prev=event=>{
      event.preventDefault();
      if(currentpage<=page&&currentpage!=1){
        GetAllPlannerHistorys(currentpage-1,props.match.params.memberId);
        setcurrentpage(currentpage-1);
      }
 };
 const next=event=>{
      event.preventDefault();
      if(currentpage<page){
         GetAllPlannerHistorys(currentpage+1,props.match.params.memberId);	
         setcurrentpage(currentpage+1);
      }
 };
   


 const onClickWoekoutReportrListClick=plannerhistory=>event=>{
   event.preventDefault()
   handleOpenDialog()
   setPlannerHistoryView({
     ...PlannerhistoryView,
     plannerhistoryId:plannerhistory._id,
     planner_name:plannerhistory.planner_name,
     planner_startDate:plannerhistory.planner_startDate,
     exdays:plannerhistory.exdays
   });
   GetAllSelectedExercises(plannerhistory.exdays);
 }

 const DialogForm=()=>{
  return (
   <Dialog open={openDialog} onClose={handleCloseDialog} TransitionComponent={Transition}>
    <div>
       <h4 style={{margin:5,textDecoration:'underline',width:'100%'}}>PLanner History</h4>
        <div>
        <p style={{margin:5,fontSize:18}}><strong> Display Name:</strong> {planner_name}</p>
        <p style={{margin:5,fontSize:18}}><strong> Exercise Date:</strong> {planner_startDate}</p>
        <div style={{height:150}}>
        <h4 style={{textAlign:'center'}}>Exercises</h4>
        {
          exerciselist.map((data)=>{
            return (
              <div style={{display:'flex',margin:5,flexDirection:'row'}}>
                <input disabled  value={data["freq_number"]} placeholder="name" class="inpputenter"/>
                <input disabled  value={data["day_number"]}  placeholder="value" class="inpputenter"/>
                <input disabled  type="number" value={data["set"]}  placeholder="set" class="inpputenter"/>
                <input disabled type="number"  value={data["rep"]} placeholder="rep" class="inpputenter"/>
              </div>
            )
          })
        }
      </div> 
       </div>
    </div>
   </Dialog>
  )
}



 

  useEffect(()=>{
    GetThisMember();
    GetAllPlannerHistorys(currentpage,props.match.params.memberId);	
   //fetching gym data
  },[]);

    return(
        <Dashboard itemId={memberId} data={{
          gymId,
          branchId:props.match.params.branchId,
          memberId:props.match.params.memberId,
          mfname,
          mlname,
          state:props.location.state,
          mphone,
          memail,
          active,
          calender,
          planner,
          formrole:0
        }} flag={3}>
            <div className="row" style={{justifyContent: "space-between"}}>
              {DialogForm()}
                <div className="row">
                    <input className="ml-5 pl-4 pr-4 pb-2 pt-2 mb-3 mt-3 shadow-sm" placeholder="Search for names.." style={{outline: "none", borderRadius: 30, width: "60%", border: "none", color: "#757575", backgroundColor: "#e0e0e0"}}/>
                    <span className="material-icons mt-3 ml-1" style={{fontSize: 32}}>sort</span>
                    
                </div>              
                <div  className="row mr-5 mt-3" style={{background:"#CAD5E2", borderRadius:20,height:40}}>                     
                     <p  className="mr-2 mt-2 mb-2 pl-2" style={{fontSize: 15}}>Planner History's</p>
                     <p className="mr-2 mt-2 mb-2" style={{color:'black',fontSize:15,fontFamily:'cursive',marginTop:20,fontWeight:'bolder'}}>( {total} )</p>
                 </div>
            </div>
            <div className="pt-3 pl-3 pr-3">
                {
                  PlannerHistory.map((plannerhistory,index)=>{
                    return(
                      <div key={plannerhistory._id}>
                            <div onClick={onClickWoekoutReportrListClick(plannerhistory)} className="shadow mb-2" style={{ backgroundColor: "#fafafa",width: "100%", height: 33, borderRadius: 10}}>
                                <div className="row pl-4 pr-4" style={{justifyContent: "space-between"}}>        
                                    <p style={{margin:5}}><strong>{index+1}. </strong>{plannerhistory.planner_name} (Date-{plannerhistory.planner_startDate})</p>
                                </div>
                            </div>
                        </div>
                    )
                  })
                } 
                <div className="row pr-3" style={{marginTop: 23, float: "right"}}>
                <span onClick={prev} className="material-icons btn">skip_previous</span>
                <p className="pt-2">{currentpage}</p>
                <span onClick={next} className="material-icons btn ">skip_next</span>
                </div>
            </div>
        </Dashboard>
    )
}
