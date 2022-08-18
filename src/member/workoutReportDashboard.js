import React,{useEffect,useState} from 'react';
import Dashboard from '../core/Dashboard';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Dialog from '@material-ui/core/Dialog';
import {getBranch} from '../branch/helper/api';
import Slide from '@material-ui/core/Slide';
import {API} from '../backend';
import { isAuthenticated } from '../auth';
import { getGym } from '../gym/helper/api';
import {getWorkOutReport,getAllWorkoutReportsOFMember,totalWorkOutReportPages,getMember} from './helper/api';

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
const [dialogProperty,setdialogProperty]=useState({title:"Add medical Report",formrole:0,dialogfun:0});//dialog property controll hooks: 0- create 1- update member 
const {title,dialogfun,formrole}=dialogProperty;//destructureing the dialogProperty hooks
const [confirm,setconfirm]=useState(false);//action confirmation hooks
const [Workoutreports,setWorkoutreports]=useState([]);
const [Workoutreport,setWorkoutreport]=useState({
  ex_day_display_name:"",
  ex_day:"",
  date:"",
  exerciseslist:[]
});
const {ex_day_display_name,ex_day,date,exerciseslist}=Workoutreport;
const [gymId,setgymId]=useState("");

  
const handleOpenDialog=()=>{
    setopenDialog(true);
};//open dialog handler-open
const handleCloseDialog=()=>{
    setopenDialog(false);
};//close dialog handler -close

//API functions
const {user,token}=isAuthenticated();
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
        calender:data.calender,
        planner:data.planner,
        memail:data.memail,
        memberId:data._id,
        active:data.active
        });
      }
    }).then(()=>{
      getBranch(user._id,token,props.match.params.branchId).then(data=>{
        if(data.error){
          console.log(data.error);
        }else{
          setgymId(data.gymId);
        }
      }).catch(err=>{
        console.log(err);
      })
    }).catch(err=>console.log(err))
};
const GetAllWorkOutReports=(currentpage,memberId)=>{
  getAllWorkoutReportsOFMember(user._id,token,memberId,currentpage,limit).then(data=>{
    if(data.error){
      throw "Something went wrong please  try again";
    }
    else{
      setWorkoutreports(data);
      TotalPagesWorkoutReports();
    }
  }).catch(err=>alert(err))
};
const TotalPagesWorkoutReports=()=>{
    totalWorkOutReportPages(user._id,token,props.match.params.memberId,limit).then(data=>{
      if(data.error){
        throw "Something went wrong please try again"
      }else{
        settotal(data.total);
        setpage(data.page);
      }
    }).catch(err=>alert(err));
};



//gym and branch pagination function
const prev=event=>{
    event.preventDefault();
    if(currentpage<=page&&currentpage!=1){
      GetAllWorkOutReports(currentpage-1,props.match.params.memberId);
      setcurrentpage(currentpage-1);
    }
};
const next=event=>{
    event.preventDefault();
    if(currentpage<page){
        GetAllWorkOutReports(currentpage+1,props.match.params.memberId);	
        setcurrentpage(currentpage+1);
    }
};
  

//handler method


const handleWorkOutreportSelect=workoutreport=>event=>{
  event.preventDefault();
  setWorkoutreport({
    ...Workoutreport,
    ex_day_display_name:workoutreport.ex_day_display_name,
    date:workoutreport.date,
    ex_day:workoutreport.ex_day,
    exerciseslist:workoutreport.exerciseslist
  });
  handleOpenDialog();
}

//functional component

const DialogForm=()=>{
  return (
   <Dialog open={openDialog} onClose={handleCloseDialog} TransitionComponent={Transition}>
    <div>
       <h4 style={{margin:5,textDecoration:'underline',width:'100%'}}>Report</h4>
       <div>
        <p style={{margin:5,fontSize:18}}><strong> Display Name:</strong> {ex_day_display_name}</p>
        <p style={{margin:5,fontSize:18}}><strong> Exercise Day:</strong> {ex_day}</p>
        <p style={{margin:5,fontSize:18}}><strong>Exercise Date:</strong> {date}</p>
        <div style={{overflowX:'auto',width:800,height:200}}>
        {
          exerciseslist.map((data)=>{
            return (
              <div style={{display:'flex',margin:5,flexDirection:'row'}}>
                <input disabled  value={data["ex_set_name"]} placeholder="name" class="inpputenter"/>
                <input disabled  value={data["value"]}  placeholder="value" class="inpputenter"/>
                <input disabled disabled value={data["unit"]}  class="inpputenter"/>
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
  GetAllWorkOutReports(currentpage,props.match.params.memberId);
  //fetching gym data
},[]);

return(
    <Dashboard itemId={memberId} data={{
      gymId,
      branchId:props.match.params.branchId,
      memberId:props.match.params.memberId,
      mfname,
      mlname,
      mphone,
      memail,
      active,
      state:props.location.state,
      calender,
      planner,
      formrole:0
    }} navItemData={`Member`} flag={3}>
        <div className="row" style={{justifyContent: "space-between"}}>
          {DialogForm()}
            <div className="row">
                <input className="ml-5 pl-4 pr-4 pb-2 pt-2 mb-3 mt-3 shadow-sm" placeholder="Search for names.." style={{outline: "none", borderRadius: 30, width: "60%", border: "none", color: "#757575", backgroundColor: "#e0e0e0"}}/>
                <span className="material-icons mt-3 ml-1" style={{fontSize: 32}}>sort</span>
                
            </div>              
            <div  className="row mr-5 mt-3" style={{background:"#CAD5E2", borderRadius:20,height:40}}>                     
                  <p  className="mr-2 mt-2 mb-2 pl-2" style={{fontSize: 15}}>Workout Reports</p>
                  <p className="mr-2 mt-2 mb-2" style={{color:'black',fontSize:15,fontFamily:'cursive',marginTop:20,fontWeight:'bolder'}}>( {total} )</p>
              </div>
        </div>
        <div className="pt-3 pl-3 pr-3">
            {
              Workoutreports.map((workoutreport,index)=>{
                return(
                  <div key={workoutreport._id}>
                        <div className="shadow mb-2" style={{ backgroundColor: "#fafafa",width: "100%", height: 33, borderRadius: 10}}>
                            <div onClick={handleWorkOutreportSelect(workoutreport)} className="row pl-4 pr-4" style={{justifyContent: "space-between"}}>
                                     <div className="row">
                                        <div className="mt-1 ml-4 mt-1" style={{ borderRadius: 100, width: 25, height: 25}} >
                                              <span style={{fontSize:18,fontWeight:'bold',marginLeft:2}}>{index+1}.</span>  
                                        </div>
                                        <p className="pt-1 pl-2" style={{fontSize: 15}}><b>{workoutreport.ex_day_display_name}</b> {`(Day-${workoutreport.ex_day},date-${workoutreport.date})`}</p>  
                                      </div>           
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
