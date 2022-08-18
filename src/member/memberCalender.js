import React,{useEffect,useState} from 'react';
import Dashboard from '../core/Dashboard';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Dialog from '@material-ui/core/Dialog';
import {createWorkOutReport, findWorkoutReport, getAllWorkoutReportsOFMember, getMember, updateWorkOutReport} from './helper/api'
import {getBranch} from '../branch/helper/api';
import Slide from '@material-ui/core/Slide';
import {API} from '../backend';
import { isAuthenticated } from '../auth';
import { getGym } from '../gym/helper/api';
import { getAllSelecdContents, getAllSelectedexercise, getPlanner } from '../components/helper/api';

export default function Member(props) {

    const [Exercises,setExercises]=useState([]);
    const weekdays=["Sun","Mon","Tue","Wed","Thus","Fri","Sat"];
    const [formateExercises,setformateExercises]=useState({Sun:[],Mon:[],Tue:[],Wed:[],Thus:[],Fri:[],Sat:[]});
    const [Member,setMember]=useState({
        memberId:"",
        mfnam:"",
        mlname:"",
        memail:"",
        mphone:"",
        calender:"",
        active:false
    });
    const {memberId,mfname,mlname,memail,mphone,calender,active}=Member;
    const [workoutReport,setworkoutReport]=useState({
        ex_day_display_name:"",
        ex_day:"",
        date:"",
        exerciseslist:[],
        workout_counter:0,
        optionSwapList:[]//used to swap exercise
    });
    const {ex_day_display_name,workout_counter,ex_day,date,exerciseslist,optionSwapList}=workoutReport;
    const [branchId,setbranchId]=useState("");
    const [Planner,setPlanner]=useState({
        plannerId:"",
        planner_name:"",
        planner_duration:0,
        planner_startDate:"",
        planneroffdays:[]
    });
    const {plannerId,planner_name,planner_duration,planner_startDate,planneroffdays}=Planner;
    const {user,token}=isAuthenticated()
    const [chcekworkoutStatus,setcheckworkoutStatus]=useState(false);
    const [workoutreportId,setworkoutreportId]=useState("");
    const [weeklist,setweeklist]=useState([]);
    const [weeknumber,setWeekNumber]=useState(0);
    const [allDatesFromDuration,setAllDatesFromDuration]=useState([]);

    //TODO write a get fuction to load data in the list
    const CheckTheWorkoutChartStatus=datecheck=>{
          
            findWorkoutReport(user._id,token,props.match.params.memberId,{date:datecheck}).then(data=>{
                if(data.error){
                    setcheckworkoutStatus(false);
                }else{
                    setworkoutreportId(data._id);
                    setworkoutReport({
                        ...workoutReport,
                        exerciseslist:data.exerciseslist
                    })
                    setcheckworkoutStatus(true);
                }
            }).catch(err=>{
                console.log('error  handled')
            })
            
        
    }

    const selectMenu = (e) => {
        var id = e.target.id,date=e.target.dataset.date;
        var currentMenu = document.getElementById('menu-items').getElementsByTagName('div');
        for (var i=0; i<currentMenu.length; i++) {
            if(currentMenu[i].style.pointerEvents=="auto")
               currentMenu[i].style.backgroundColor = "#ffffff";
        }
        document.getElementById(id).style.backgroundColor = '#ff8800';
        

       
       

        if(formateExercises[id].length!=0){
            let data=formateExercises[id].find(obj=>obj.date==date);
            GetAllSelectedExercises(data)
            console.log(data)
            setTimeout(()=>{
              CheckTheWorkoutChartStatus(date);
            },100)
        }else{
            setworkoutReport({
                ...workoutReport,
                ex_day_display_name:"",
                ex_day:"",
                date:"",
                exerciseslist:[]
            });
        }

        // if(id === "Mon"){
        //     document.getElementById('Mon-exercise').style.display = "block";
        //     document.getElementById('Tue-exercise').style.display = "none";
        //     document.getElementById('Wed-exercise').style.display = "none";
        //     document.getElementById('Thu-exercise').style.display = "none";
        //     document.getElem-+entById('Fri-exercise').style.display = "none";
        //     document.getElementById('Sat-exercise').style.display = "none";
        //     document.getElementById('Sun-exercise').style.display = "none";
        // }

        // if(id === "Tue"){
        //     document.getElementById('Mon-exercise').style.display = "none";
        //     document.getElementById('Tue-exercise').style.display = "block";
        //     document.getElementById('Wed-exercise').style.display = "none";
        //     document.getElementById('Thu-exercise').style.display = "none";
        //     document.getElementById('Fri-exercise').style.display = "none";
        //     document.getElementById('Sat-exercise').style.display = "none";
        //     document.getElementById('Sun-exercise').style.display = "none";
        // }

        // if(id === "Wed"){
        //     document.getElementById('Mon-exercise').style.display = "none";
        //     document.getElementById('Tue-exercise').style.display = "none";
        //     document.getElementById('Wed-exercise').style.display = "block";
        //     document.getElementById('Thu-exercise').style.display = "none";
        //     document.getElementById('Fri-exercise').style.display = "none";
        //     document.getElementById('Sat-exercise').style.display = "none";
        //     document.getElementById('Sun-exercise').style.display = "none";
        // }

        // if(id === "Thus"){
        //     document.getElementById('Mon-exercise').style.display = "none";
        //     document.getElementById('Tue-exercise').style.display = "none";
        //     document.getElementById('Wed-exercise').style.display = "none";
        //     document.getElementById('Thu-exercise').style.display = "block";
        //     document.getElementById('Fri-exercise').style.display = "none";
        //     document.getElementById('Sat-exercise').style.display = "none";
        //     document.getElementById('Sun-exercise').style.display = "none";
        // }

        // if(id === "Fri"){
        //     document.getElementById('Mon-exercise').style.display = "none";
        //     document.getElementById('Tue-exercise').style.display = "none";
        //     document.getElementById('Wed-exercise').style.display = "none";
        //     document.getElementById('Thu-exercise').style.display = "none";
        //     document.getElementById('Fri-exercise').style.display = "block";
        //     document.getElementById('Sat-exercise').style.display = "none";
        //     document.getElementById('Sun-exercise').style.display = "none";
        // }

        // if(id === "Sat"){
        //     document.getElementById('Mon-exercise').style.display = "none";
        //     document.getElementById('Tue-exercise').style.display = "none";
        //     document.getElementById('Wed-exercise').style.display = "none";
        //     document.getElementById('Thu-exercise').style.display = "none";
        //     document.getElementById('Fri-exercise').style.display = "none";
        //     document.getElementById('Sat-exercise').style.display = "block";
        //     document.getElementById('Sun-exercise').style.display = "none";
        // }

        // if(id === "Sun"){
        //     document.getElementById('Mon-exercise').style.display = "none";
        //     document.getElementById('Tue-exercise').style.display = "none";
        //     document.getElementById('Wed-exercise').style.display = "none";
        //     document.getElementById('Thu-exercise').style.display = "none";
        //     document.getElementById('Fri-exercise').style.display = "none";
        //     document.getElementById('Sat-exercise').style.display = "none";
        //     document.getElementById('Sun-exercise').style.display = "block";
        // }
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
                  sortWeekDates(data);
                  
                }
            }).catch(err=>{
                console.log(err);
            })
    }

    const GetAllSelectedExercises=exercise=>{
       

      
        getAllSelectedexercise(user._id,token,{exercisesId:exercise.exercise}).then(data=>{
            if(data.error){
                console.log(data.error)
            }else{
                getAllSelecdContents(user._id,token,{exerciselist:exercise.exercise}).then(contents=>{
                    if(data.error){
                        console.log(data.error)
                    }else{
                        setExercises(data);
                        findAndForMatWorkoutReport(contents,exercise,data);
                    }
                });
            }
        }).catch(err=>console.log(err))
    }


    const findAndForMatWorkoutReport=(contents,exercise,exercises)=>{
       
            let weekDays=["Sunday","Monday","Tuesday","Wednesday","Thusday","Friday","Saturday"]
            let dateObj=new Date(exercise.date);
            setworkoutReport(oldstate=>{
                oldstate.ex_day_display_name=exercise.ex_name;
                oldstate.date=exercise.date;
                oldstate.ex_day=weekDays[dateObj.getDay()]
                oldstate.exerciseslist=[];
                exercises.forEach(exercise=>{
                     let list=[];
                     let contentIds=[];
                     contentIds.push(exercise.content)
                     contentIds.push(exercise.optionalEx[0]['content'])
                     contentIds.push(exercise.optionalEx[1]['content'])
                     for(let i=0;i<contentIds.length;i++){
                        if(contentIds[i]!=""){
                          let content=contents.find(content=>content._id==contentIds[i]);
                          list.push({ex_set_name:content.exName,value:i==0?exercise.defaultvalue:exercise.optionalEx[i-1]['defaultvalue'],unit:i==0?exercise.unit:exercise.optionalEx[i-1]['unit'],rep:i==0?exercise.rep:exercise.optionalEx[i-1]['rep'],set:i==0?exercise.set:exercise.optionalEx[i-1]['set']})
                        }
                     }
                   
                     oldstate.optionSwapList.push({list,counter:0})
                     oldstate.exerciseslist.push(list[0])
                });
                return ({...oldstate});
            })
            
    }

    const GetThisMember=()=>{
      
        getMember(user._id,token,props.match.params.memberId).then(async data=>{
            if(data.error){
                console.log(data.error)
            }else{
                let allDates=await findAllDateByDuration(data.planner_startDate,data.planner_duration);
                let weeks=await findWeekByDuration(data.planner_duration)
                let weeklist=await setWeekList(weeks,allDates,data.planner_startDate);
                setweeklist(weeklist);
                setAllDatesFromDuration(allDates)
                setDateInWeekDayElement(allDates,weeklist,0);

                //TODO initial assign
                  
                // let dateobj=new Date(findCurrentDate());
                // let dataex=formateExercises[weekdays[dateobj.getDay()]].find(doc=>doc.date==findCurrentDate());
                // if(Boolean(dataex)){
                //     document.querySelector(`#${weekdays[dateobj.getDay()]}`).style.backgroundColor="#ff8800";
                //     if(formateExercises[weekdays[dateobj.getDay()]].length!=0){
                //         GetAllSelectedExercises(dataex)
                //         setTimeout(()=>{
                //         CheckTheWorkoutChartStatus(findCurrentDate());
                //         },100)
                //     }else{
                //         setworkoutReport({
                //             ...workoutReport,
                //             ex_day_display_name:"",
                //             ex_day:"",
                //             date:"",
                //             exerciseslist:[]
                //         });
                //     }
                // }

             
                

               
               
                document.querySelector(`#week-date-range`).innerHTML= `w- ${weeklist[weeknumber].weekno}-[ ${weeklist[weeknumber].startdate} ${weeklist[weeknumber].enddate!=""?`to ${weeklist[weeknumber].enddate}`:""} ]`.substring(0,21)+"..."
               

                setMember({
                    ...Member,
                    mfname:data.mfname,
                    mlname:data.mlname,
                    memail:data.memail,
                    mphone:data.mphone,
                    memberId:data._id,
                    calender:data.calender
                    ,active:data.active
                });
                setPlanner({
                    ...Planner,
                    planner_duration:data.planner_duration,
                    planner_startDate:data.planner_duration
                });
                setbranchId(data.branchId);
                GetThisPlanner(data.planner)
                GetAllEvents(data.calender);
            }
        })
    }

    const GetThisPlanner=plannerId=>{
        getPlanner(user._id,token,plannerId).then(data=>{
            if(data.error){
                console.log(data.error)
            }else{
                setPlanner({
                    ...Planner,
                    planner_duration:data.planner_duration,
                    plannerId:data._id,
                    planner_startDate:data.planner_startDate,
                    planneroffdays:data.planneroffdays,
                    planner_name:data.planner_name
                });

            }
        }).catch(err=>console.log(err));
    }

    const chooseWeek=index=>async event=>{
        event.preventDefault();
       
        document.querySelector(`#week-date-range`).innerHTML=`w- ${weeklist[index].weekno}-[ ${weeklist[index].startdate} ${weeklist[index].enddate!=""?`to ${weeklist[index].enddate}`:""} ]`.substring(0,21)+"...";
        setWeekNumber(index);
        setDateInWeekDayElement(allDatesFromDuration,weeklist,index);
    }


    

      //sort weeks date
      const sortWeekDates=exercises=>{
        let weekDays=["Sun","Mon","Tue","Wed","Thus","Fri","Sat"];
       
        setformateExercises(oldstate=>{
            exercises.forEach(exercise => {
                let d=new Date(exercise.date);
                oldstate[weekDays[d.getDay()]].push(exercise);
            });
            return ({...oldstate})
        });

      
     }
 

    const expandDisplyName = () => {
        if( document.getElementById("expand").style.display == "none"){
            document.getElementById("expand").style.display = "block";
        }else{
            document.getElementById("expand").style.display = "none";
        }
    }

    

    const SaveWorkOutReport=event=>{
            event.preventDefault();
            if(chcekworkoutStatus){
                updateWorkOutReport(user._id,token,workoutreportId,{ex_day_display_name,date,ex_day,exerciseslist}).then(data=>{
                    if(data.error){
                        console.log(data.error);
                    }else{
                        console.log("sucessfully updated")
                    }
                })
            }else{
                createWorkOutReport(user._id,token,props.match.params.memberId,{ex_day_display_name,date,ex_day,exerciseslist}).then(data=>{
                    if(data.error){
                        console.log(data.error)
                    }else{
                        setworkoutreportId(data._id);
                        setcheckworkoutStatus(true);
                        console.log("successfully created")
                    }
                })
            }
    }

    const handleUserInput = index =>() => {
        let icon=document.querySelector(`#user-input-hadle-icon${index}`);
        if( document.getElementById("user-input-"+index).style.display == "none"){
            icon.style.transform='rotate(0deg)';
            document.getElementById("user-input-"+index).style.display = "table-row";
        }else{
            icon.style.transform='rotate(180deg)';
            document.getElementById("user-input-"+index).style.display = "none";
        }
    }

    const GenerateReport = () => {
        if(document.getElementById("generate-report").style.display == "none"){
            document.getElementById("generate-report").style.display = "block";
            document.getElementById("generate-report").style.display = "block";
        }else{
            document.getElementById("generate-report").style.display = "none";
            document.getElementById("generate-report").style.display = "none";
        }
    }


  
    //---TODO Check and review
    const HighlightTheCurrentDate=()=>{
        let dateObj=new Date();
        let month = dateObj.getMonth()+1;
        if(month.toString().length==1){
            month="0"+month.toString();
        }
        let day = String(dateObj.getDate()).padStart(2, '0');
        let year = dateObj.getFullYear();
        let output = year+"-"+month+"-"+day;
        //highlight the element
       // document.getElementById().style.color="4444"
    }

  
    const handleChange=(index,name)=>event=>{
        setworkoutReport(oldstate=>{
            oldstate.exerciseslist[index][name]=event.target.value;
            return ({...oldstate})
        });
    }

    const ControllDateDropdown=event=>{
        //event.preventDefault();
      //  let dropdown=document.getElementById('date-dropdown-id');
        // if(dropdown.style.display=="none"){
        //     dropdown.style.display=="block"
        //     setTimeout(()=>{
        //         window.addEventListener('click',CloseFun)
        //     },0)
        // }else{
        //     dropdown.style.display="none";
        // }

        //function CloseFun(){
          //  dropdown.style.display="none";
         //   window.removeEventListener('click',CloseFun)
        //}
        //event.stopPropagation()
    }

    const swapExercise=(index)=>event=>{
        event.preventDefault();
        setworkoutReport(oldstate=>{
            let counter=oldstate.optionSwapList[index]['counter'];
            counter++;
            if(counter==oldstate.optionSwapList[index]['list'].length){
                counter=0;
            }
            oldstate.optionSwapList[index]['counter']=counter;
            oldstate.exerciseslist[index]=oldstate.optionSwapList[index]['list'][counter];
            return ({...oldstate})
        })

    }


    //find month days
    const getDaysInMonth = (month,year)=>{
        return new Date(year, month, 0).getDate();
    };
    const findAllDateByDuration=(planner_startDate,planner_duration)=>{
            
        let splitDate=planner_startDate.split("-");
        let allDates=[],duration_tracker=0,M=splitDate[1],D=splitDate[2],Y=splitDate[0],date="",dateobj,mDays=0;
        while(planner_duration>duration_tracker){
            date=Y+"-"+M+"-"+D;
            splitDate=date.split("-");
            mDays=getDaysInMonth(splitDate[1],splitDate[0]);
            dateobj=new Date(date);
            allDates.push(date);
            duration_tracker++;
            D=parseInt(D)+1;
            if(D>mDays){
                D=1;
                M=(parseInt(M)+1);
                if(M==13){
                M=1;
                Y=(parseInt(Y)+1);
                }
            }
            if(D<10){
                D=parseInt(D)+0;
                D="0"+D;
            }
            if(M<10){
                M=parseInt(M)+0;
                M="0"+M;
            }
        }

    return allDates;

    }
    const findWeekByDuration=(planner_duration)=>{
        return Math.ceil(parseInt(planner_duration)/7);
    }

    const setDateInWeekDayElement=(allDates,weeklist,weeknumber)=>{

            let startdateIndex=allDates.findIndex(date=>date==weeklist[weeknumber].startdate);
            let enddateIndex=weeklist[weeknumber].enddate?allDates.findIndex(date=>date==weeklist[weeknumber].enddate):0;
            weekdays.forEach(day=>{
                document.querySelector(`#${day}`).style.pointerEvents="none";
                document.querySelector(`#${day}`).style.backgroundColor="#dddddd";
            })
            setTimeout(()=>{
                for(let i=startdateIndex;i<=enddateIndex;i++){
                    let dateobj=new Date(allDates[i]);
                    console.log(formateExercises[weekdays[dateobj.getDay()]])
                    let datefound=formateExercises[weekdays[dateobj.getDay()]].find(obj=>obj.date==allDates[i]);
                    if(Boolean(datefound)){
                        document.querySelector(`#${weekdays[dateobj.getDay()]}`).style.pointerEvents="auto";
                        document.querySelector(`#${weekdays[dateobj.getDay()]}`).style.backgroundColor="#ffffff";
                        document.querySelector(`#${weekdays[dateobj.getDay()]}`).setAttribute("data-date",allDates[i]);
                        if(findCurrentDate()==allDates[i]){
                            document.querySelector(`#${weekdays[dateobj.getDay()]}`).style.backgroundColor="#ff8800";
                            if(formateExercises[weekdays[dateobj.getDay()]].length!=0){
                                let data=formateExercises[weekdays[dateobj.getDay()]].find(obj=>obj.date==allDates[i]);
                                GetAllSelectedExercises(data)
                                setTimeout(()=>{
                                  CheckTheWorkoutChartStatus(allDates[i]);
                                },100)
                            }else{
                                setworkoutReport({
                                    ...workoutReport,
                                    ex_day_display_name:"",
                                    ex_day:"",
                                    date:"",
                                    exerciseslist:[]
                                });
                            }
                        }
                    }
                }
            },100)


           

            setTimeout(()=>{
                setworkoutReport({
                    ...workoutReport,
                    exerciseslist:[]
                })
            },0);
 
    }

    const findCurrentDate=()=>{
        let today = new Date();
        let dd = today.getDate(), mm = today.getMonth() + 1, yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        return yyyy+"-"+mm+"-"+dd;
    }


   

    const setWeekList=(weeks,allDates,startdate)=>{
        let list=[],weekno=1,startd=startdate;
        let initialcheck=0;
        for(let i=0;i<allDates.length;i++){

            if(initialcheck==0){
                initialcheck=1;
                if(new Date(allDates[0]).getDay()==0){
                    list.push({
                        weekno,
                        startdate:startd,
                        enddate:""
                    });
                    if(i<allDates.length){
                        startd=allDates[i+1];
                        weekno++;
                    }
                    initialcheck=2;
                }
                
            }

            if(initialcheck!=0&&new Date(allDates[i==0?(initialcheck==2?i+1:i):i]).getDay()==0){
                list.push({
                    weekno,
                    startdate:startd,
                    enddate:allDates[i]
                });
                if(i<allDates.length){
                    startd=allDates[i+1];
                    weekno++;
                    if(initialcheck!=0&&new Date(startd).getDay()==1&&new Date(allDates.length-1).getDay()!=0){
                        list.push({
                            weekno,
                            startdate:startd,
                            enddate:allDates[allDates.length-1]
                        });  
                    }
                }
            }

          
        }
        return list;
    }    


    useEffect(()=>{
        GetThisMember();
    },[])


    return(
        <Dashboard flag={3} itemId={memberId} data={{
            branchId,
            memberId,
            mfname,
            planner:plannerId,
            mlname,
            mphone,
            memail,
            active,
            state:"none",
            calender,
            formrole:0
          }}>
            <div className="member-calender-header">
                <div style={{display:'flex'}}>
                    <div  style={{alignSelf:'center'}} className="member-calender-title">
                        Member  Exercise Chart
                    </div>
                    <div  className="action-button-save" style={{width:100,alignSelf:'center'}}>
                        <div onClick={SaveWorkOutReport} className="action-button-txt">Save</div>
                    </div>  
                </div>
             
                <div  className="member-calender-display-name dropdown-week" style={{width:"15vw"}}>
                 <div  style={{borderRadius:5,boxShadow:"-1px 2px 3px #e0e0e0",backgroundColor:'whitesmoke',cursor:'pointer',display:'flex',width:'100%',alignItems:'flex-start',flexDirection:'row',justifyContent:'space-between', margin:"0 -0.6vw 0 0", color:"black"}}>
                    <div id="week-date-range" style={{textAlign:'center',fontSize:14,color:'#000',margin:"1px 5px",alignSelf:'center'}}>
                       Choose Week
                    </div>
                    <div style={{alignSelf:'center',margin:"5px 1px 1px 1px"}}>
                        <span class="material-icons-outlined">
                        keyboard_arrow_down
                        </span>
                    </div>
                 </div>
                 <div class="dropdown-week--content">
                    {
                        weeklist.map((data,index)=>{
                            return (
                                <div onClick={chooseWeek(index)} role="button" className="dropdown-week--content--item-container">
                                     <div className="active-elemnt-hover">{`w- ${data.weekno}-[ ${data.startdate} ${data.enddate!=""?`to ${data.enddate}`:""} ]`}</div>
                                </div>
                            )
                        })
                    }
                 </div>    
                </div>
            
 
              
                
            </div>
            <div className="member-calender-body">
                <div id="menu-items" className="member-calender-days-container">
                    <div id="Mon"  onClick={selectMenu} className="member-calender-days" style={{backgroundColor:"#ff8800"}}>Mon</div>
                    <div id="Tue" onClick={selectMenu} className="member-calender-days">Tue</div>
                    <div id="Wed" onClick={selectMenu} className="member-calender-days">Wed</div>
                    <div id="Thus" onClick={selectMenu} className="member-calender-days">Thu</div>
                    <div id="Fri" onClick={selectMenu} className="member-calender-days">Fri</div>
                    <div id="Sat" onClick={selectMenu} className="member-calender-days">Sat</div>
                    <div id="Sun" onClick={selectMenu} className="member-calender-days">Sun</div>
                </div>

                <div className="member-calender-exercise-container">
                    <div style={{justifyContent:"space-between", display:"flex", alignSelf:"center", alignItems:"flex-start"}}>
                        <div className="action-button-container" style={{width:'100%'}}>
                    
                            <div className="exercise-action-button-container">
                                <div className="action-button">
                                    <div className="action-button-txt">COOL DOWN</div>
                                </div>
                                <div className="action-button">
                                    <div className="action-button-txt">WARM UP</div>
                                </div>
                                
                            </div>
                        
                
                            
                        </div>
                        <div className="member-calender-display-name">{ex_day_display_name}</div>
                    </div>
                    {/*ex_set_name:"",ex_names,value:"",unit:"",rep:exercise.rep,set:exercise.set */}
                    <div id="Week-exercise" style={{display:"block"}}>
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
                                    <th>Action</th>
                                </tr>

                                {
                                    exerciseslist.map((data,index)=>{
                                        return [
                                            <tr>
                                            <td>{index+1}.</td>
                                            <td>
                                                <div style={{display:'flex',justifyContent:'center',alignItems:'flex-start',margin:"auto", maxWidth: "8vw",borderRadius:"5px", boxShadow:"-1px 2px 3px #e0e0e0", padding: "0.4vw 0"}}>
                                                    <div style={{alignSelf:'center',cursor:'pointer'}}>{`${data.ex_set_name}`.substring(0,4)}..</div>
                                                    <div style={{alignSelf:'center',marginLeft:10}}>
                                                          <span role="button" style={{border:'1px solid grey',borderRadius:100,fontSize:20}} onClick={swapExercise(index)} class="material-icons-outlined shadow-sm">swap_horiz</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{data['unit']=="weight[KG]"||data['unit']=="weight[LBS]"?data["set"]:0}</td>
                                            <td>{data['unit']=="weight[KG]"||data['unit']=="weight[LBS]"?data["rep"]:0}</td>
                                            <td>{data["unit"]=="weight[KG]"||data['unit']=="weight[LBS]"?`${data["value"]}${data["unit"]=="weight[KG]"?"kg":"lbs"}`:"0kg"}</td>
                                            <td>{data["unit"]=="distance"?data['value']:0}km</td>
                                            <td>{data["unit"]=="number"?data['value']:0}</td>
                                            <td>{data["unit"]=="duration"?data['value']:0}min</td>
                                            <td onClick={handleUserInput(index)}><span id={"user-input-hadle-icon"+index} style={{border:'1px solid grey',transition:'.3s ease',borderRadius:100,fontSize:20,cursor:"pointer",transform:'rotate(180deg)'}} class="material-icons-outlined shadow-sm">keyboard_arrow_down</span></td>
                                            </tr>
                                                ,                       
                                            <tr id={`user-input-${index}`} style={{display:"none"}}>
                                            <td></td>
                                            <td></td>
                                            <td><input disabled={data['unit']=="weight[KG]"||data['unit']=="weight[LBS]"?false:true} onChange={handleChange(index,"set")} value={data['unit']=="weight[KG]"||data['unit']=="weight[LBS]"?workoutReport.exerciseslist[index]["set"]:0} className="input-field" style={{textAlign:'center'}} type="number"/></td>
                                            <td><input disabled={data['unit']=="weight[KG]"||data['unit']=="weight[LBS]"?false:true} onChange={handleChange(index,"rep")} value={data['unit']=="weight[KG]"||data['unit']=="weight[LBS]"?workoutReport.exerciseslist[index]["rep"]:0} className="input-field" style={{textAlign:'center'}} type="number"/></td>
                                            <td><input disabled={data['unit']=="weight[KG]"||data['unit']=="weight[LBS]"?false:true} onChange={handleChange(index,"value")} value={data['unit']=="weight[KG]"||data['unit']=="weight[LBS]"?workoutReport.exerciseslist[index]["value"]:0} className="input-field" style={{textAlign:'center'}} type="number"/></td>
                                            <td><input disabled={data["unit"]=="distance"?false:true} onChange={handleChange(index,"value")} value={data["unit"]=="distance"?workoutReport.exerciseslist[index]["value"]:0} style={{textAlign:'center'}} className="input-field" type="number"/></td>
                                            <td><input disabled={data["unit"]=="number"?false:true} onChange={handleChange(index,"value")} value={data["unit"]=="number"?workoutReport.exerciseslist[index]["value"]:0} style={{textAlign:'center'}} className="input-field" type="number"/></td>
                                            <td><input disabled={data["unit"]=="duration"?false:true} onChange={handleChange(index,"value")} value={data["unit"]=="duration"?workoutReport.exerciseslist[index]["value"]:0} style={{textAlign:'center'}} className="input-field" type="number"/></td>
                                            <td>
                                               
                                            </td>
                                            </tr>
         
                                        ]
                                    })
                                }  
                             </table>
                           
                        </div>       
                    </div>
                </div>
             
                
            </div>
           
           
        </Dashboard>
    )
}