import React,{useEffect,useState} from 'react';
import Dashboard from '../core/Dashboard';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Dialog from '@material-ui/core/Dialog';
import {getMember,totalPageMemberBodyCompositionTest,totalPageMemberFitnessTest,totalPageMemberMeasurementTest,takeMemberBodyCompositionTest,takeMemberFitnessTest,takeMemberMeasurementTest,getMemberMeasurementTest,getMemberFitnessTest,  getMemberBodyCompositionTest,getMemberAllBodyCompositionTest,getMemberAllFitnessTest,getMemberAllMeasurementTest,updateMemberBodyCompositionTest,updateMemberFitnessTest,updateMemberMeasurementTest,removeMemberBodyCompositionTest,removeMemberFitnessTest,removeMemberMeasurementTest} from './helper/api'
import {getAllMeasurementTestGym,getAllFitnessTestGym} from '../components/helper/api';
import {getBranch} from '../branch/helper/api';
import Slide from '@material-ui/core/Slide';
import {API} from '../backend';
import { isAuthenticated } from '../auth';
import { getGym } from '../gym/helper/api';
import Flatpickr from "flatpickr";
import { stringify } from 'query-string';

//TODO:work take measurement test,view,update and sort with pagination opeartion

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
    }
}));

//transition animation method
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function MemberTest(props) {
    const classes = useStyles();
    const [openDialog,setopenDialog]=useState(false);//Dialog hooks
    const [currentpage,setcurrentpage]=useState({
      mtcurrentPage:1,
      ftcurrentpage:1,
      btcurrentpage:1
    });//hooks for saving current member list page
    const {mtcurrentPage,ftcurrentpage,btcurrentpage}=currentpage;
    const [page,setpage]=useState({
      mtpage:1,
      ftpage:1,
      btpage:1
    });//hooks for saving member page after fetched from the server page
    const {mtpage,ftpage,btpage}=page;
    const [total,settotal]=useState({
      mttotal:0,
      fttotal:0,
      bttotal:0
    });//save total member
    const {mttotal,fttotal,bttotal}=total;
    const [limit,setlimit]=useState(8);//get limited number of member document
    const [TestList,setTestList]=useState({measurementlist:[],fitnesslist:[],bodycompositionlist:[]});//save members tests after fetched from the server
    const {measurementlist,fitnesslist,bodycompositionlist}=TestList;
    const [TestNameList,setTestNameList]=useState([]);//save measurement and fitness tests 
    const [Test,setTest]=useState({ mtName:"",mtId:"",ftId:"",ftName:"",unit_type:"",unit_list:["KG","LB"],unit:"",value:"",BMR:"",BMI:"",fat:"",water:"",muscle_mass:"",whr_ratio:"",date:"",testId:""});//measurement test hooks
    const { mtName,ftId,mtId,ftName,unit_list,unit,unit_type,value,date,BMR,BMI,fat,muscle_mass,water,whr_ratio,testId }=Test;//destrucuring measurement,fitness and bodycomposition test
    const [Member,setMember]=useState({mfname:"",calender:"",planner:"",mlname:"",active:false,mphone:"",memail:"",memberId:"",branchId:""});
    const {mfname,mlname,mphone,memail,active,calender,planner,branchId,memberId}=Member;
    const [dialogProperty,setdialogProperty]=useState({title:"",itemName:"",dialogfun:0});//dialog property controll hooks: 0-CREATE 1- UPDATE 2-DELETE select type-3
    const [testRole,settestRole]=useState(0)// Measurement-0 Fitness-1 bodyCompositon-2
    const {title,dialogfun,itemName}=dialogProperty;//destructureing the dialogProperty hooks
    const [firstValue,setfirstValue]=useState(true);//checks fisrt load or not
    const [flag,setflag]=useState(3);
    const [gymId,setgymId]=useState("");

    //handler functions
    const handleChange=name=>event=>{
       if(event.target.value!="Select Test:"){
          let data=event.target.value;
          let unit_type="";
          let unit_list=["KG","LB"];
          if(name=="mtName"||name=="ftName"){
            let doc=TestNameList.find(doc=>doc._id==event.target.value);
            data=doc.test_name;
            unit_type=doc.unit_type;
            document.querySelector(".test_value").setAttribute("type","text");
            if(doc.unit_type=="Weight"){
              unit_list=["KG","LB"];
            }
            if(doc.unit_type=="Length"){
              unit_list=["CM","IN","FT"];
            }
            if(doc.unit_type=="Distance"){
              unit_list=["Meter","KM"];
            }
            if(doc.unit_type=="Time"){
              unit_list=["Minute","Hour","Second"];
              document.querySelector(".test_value").setAttribute("type","time");
            }
            if(doc.unit_type=="Number"){
              unit_list=["Number"];
            }
          }
          setTest({...Test,[name]:data,unit_type:unit_type,mtId:name=="mtName"?data._id:"",ftId:name=="ftName"?data._id:"",unit_list:unit_list});
       }
    };//handler function to controll from
    const handleOpenDialog=()=>{
        setopenDialog(true);
    };//open dialog handler-open
    const handleCloseDialog=()=>{
        setopenDialog(false);
    };//close dialog handler -close
    const handleCliclUpdate=(test,role)=>event=>{
      event.preventDefault();
      setdialogProperty({...dialogProperty,title:"Update Test",dialogfun:1});
      setTest(oldTest=>{
        if(role==0){
          oldTest.mtName=test.mtName;
          oldTest.value=test.value;
          oldTest.unit=test.unit;
        }else if(role==1){
          oldTest.ftName=test.ftName;
          oldTest.number=test.number;
          oldTest.weight=test.weight;
        }else{
          oldTest.BMR=test.BMR;
          oldTest.BMI=test.BMI;
          oldTest.fat=test.fat;
          oldTest.water=test.water;
          oldTest.muscle_mass=test.muscle_mass;
          oldTest.whr_ratio=test.whr_ratio;
        }
        oldTest.testId=test._id;
        oldTest.date=test.date;
        return ({...oldTest});
      })
      handleOpenDialog();
    };//update test
    const handleDelete=(id,name)=>event=>{
      event.preventDefault();
      setdialogProperty({...dialogProperty,title:"Delete Test",itemName:name,dialogfun:2});
      setTest({...Test,testId:id});
      handleOpenDialog();
    };//delete test
    const handleSelectDialog=event=>{
      event.preventDefault();
      setdialogProperty({...dialogProperty,title:"Test Type",dialogfun:3});
      handleOpenDialog();
      // if(testRole==0){
      //    GetAllTest(mtcurrentPage);
      // }
      // if(testRole==1){
      //    GetAllTest(ftcurrentpage);
      // }
      // if(testRole==2){
      //   GetAllTest(btcurrentpage);
      // }
    };//select test type
    const onTypeSelect=role=>event=>{
     // event.preventDefault();
      settestRole(role);
      if(role==0){
        GetAllTest(mtcurrentPage,role);
     }
     if(role==1){
        GetAllTest(ftcurrentpage,role);
     }
     if(role==2){
      GetAllTest(ftcurrentpage,role);
     }
      handleCloseDialog();
    };
    const handleCreateDialog=event=>{
      event.preventDefault();
      
       setdialogProperty({
        ...dialogProperty,
        title:"Create Test",
        dialogfun:0
       });
       setTest({
         ...Test,
         date:"",
         value:"",
         unit:"",
         mtName:"",
         ftName:"",
         ftId:"",
         mtId:"",
         unit_type:"",
         unit_list:["KG","LG"]
       })
       if(testRole==0 || testRole==1){
        GetAllTestNames();
       }
       setopenDialog(true);
    };
    const handleInputs=event=>{
      if (event.which != 8 && event.which != 0 && event.which < 48 || event.which > 57)
      {
          event.preventDefault();
      }
    };



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
            active:data.active,
            memail:data.memail,
            calender:data.calender,
            planner:data.planner
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
    const takeTest=event=>{
        event.preventDefault();
        if(testRole==0){
          takeMemberMeasurementTest(user._id,token,props.match.params.memberId,{mtName,value,unit,unit_type,date}).then(data=>{
              if(data.error){
                  console.log('err to create db')
              }else{
                  setTest({
                      ...Test,
                      mtName:"",
                      unit:"",
                      unit_type:"",
                      value:"",
                      date:""
                  });
                  handleCloseDialog();
                  GetAllTest(mtcurrentPage,testRole);
              }
          })
        }
        if(testRole==1){
          takeMemberFitnessTest(user._id,token,props.match.params.memberId,{ftName,unit_type,unit,value,date}).then(data=>{
              if(data.error){
                  console.log('err to create db')
              }else{
                  setTest({
                      ...Test,
                      ftName:"",
                      unit:"",
                      unit_type:"",
                      value:"",
                      date:""
                  });
                  handleCloseDialog();
                  GetAllTest(ftcurrentpage,testRole);
              }
          })
        }
        if(testRole==2){
          takeMemberBodyCompositionTest(user._id,token,props.match.params.memberId,{BMR,BMI,fat,water,muscle_mass,whr_ratio,date}).then(data=>{
              if(data.error){
                  console.log('err to create db')
              }else{
                  setTest({
                      ...Test,
                      BMR:"",
                      BMI:"",
                      fat:"",
                      water:"",
                      muscle_mass:"",
                      whr_ratio:"",
                      date:""
                  });
                  handleCloseDialog();     
                  GetAllTest(btcurrentpage,testRole);
              }
          })
        }
    };
    const updateTest=event=>{
        event.preventDefault();
        if(testRole==0){
          updateMemberMeasurementTest(user._id,token,testId,{mtName,value,unit,unit_type,date}).then(data=>{
              if(data.error){
                  console.log('err to create db')
              }else{
                  setTest({
                      ...Test,
                      mtName:"",
                      value:"",
                      unit:"",
                      date:""
                  });
                  handleCloseDialog();
                  GetAllTest(currentpage,testRole)
              }
          })
        }
        if(testRole==1){
          updateMemberFitnessTest(user._id,token,testId,{ftName,value,unit,unit_type,date}).then(data=>{
              if(data.error){
                  console.log('err to create db')
              }else{
                  setTest({
                      ...Test,
                      ftName:"",
                      number:"",
                      weight:"",
                      date:""
                  });
                  handleCloseDialog();
                  GetAllTest(currentpage,testRole)


              }
          })
        }
        if(testRole==2){
          updateMemberBodyCompositionTest(user._id,token,testId,{BMR,BMI,fat,water,muscle_mass,whr_ratio,date}).then(data=>{
            if(data.error){
                  console.log('err to create db')
              }else{
                  setTest({
                      ...Test,
                      BMR:"",
                      BMI:"",
                      fat:"",
                      water:"",
                      muscle_mass:"",
                      whr_ratio:"",
                      date:""
                  });
                  handleCloseDialog();
                  GetAllTest(currentpage,testRole);
              }
          })
        }
    };
    const GetAllTest=(currentpage,role)=>{
      if(role==0){
        getMemberAllMeasurementTest(user._id,token,props.match.params.memberId,limit,currentpage).then(data=>{
            if(data.error){
                console.log('err to create db')
            }else{
                setTestList({...TestList,measurementlist:data});
                TotalPageTest(role);
            }
        });
      }
      if(role==1){
        getMemberAllFitnessTest(user._id,token,props.match.params.memberId,limit,currentpage).then(data=>{
            if(data.error){
                console.log('err to create db')
            }else{
                setTestList({...TestList,fitnesslist:data});
                TotalPageTest(role);
            }
        }).catch(err=>console.log(err));
      }
      if(role==2){
        getMemberAllBodyCompositionTest(user._id,token,props.match.params.memberId,limit,currentpage).then(data=>{
            if(data.error){
                console.log('err to create db')
            }else{
                setTestList({...TestList,bodycompositionlist:data});
                TotalPageTest(role);
            }
        }).catch(err=>console.log(err));
      };
    };
    const removeTest=event=>{
      event.preventDefault();
      if(testRole==0){
        removeMemberMeasurementTest(user._id,token,props.match.params.memberId,testId).then(data=>{
            if(data.error){
                console.log('err to create db')
            }else{
                GetAllTest(mtcurrentPage,testRole);
                handleCloseDialog()
            }
        })
      }

      if(testRole==1){
        removeMemberFitnessTest(user._id,token,props.match.params.memberId,testId).then(data=>{
            if(data.error){
                console.log('err to create db')
            }else{
                GetAllTest(ftcurrentpage,testRole);
                handleCloseDialog()

            }
        })
      }

      if(testRole==2){
        removeMemberBodyCompositionTest(user._id,token,props.match.params.memberId,testId).then(data=>{
            if(data.error){
                console.log('err to create db')
            }else{
              GetAllTest(btcurrentpage,testRole);
              handleCloseDialog()

            }
        })
      }
    };
    const GetTest=testId=>{
      if(testRole==0){
        getMemberMeasurementTest(user._id,token,testId).then(data=>{
            if(data.error){
                console.log('err to create db')
            }else{
              setTest({
                ...Test,
                mtName:data.mtName,
                value:data.value,
                unit:data.unit,
                date:data.date
            });
            }
        })
      }
      if(testRole==1){
        getMemberFitnessTest(user._id,token,testId).then(data=>{
            if(data.error){
                console.log('err to create db')
            }else{
              setTest({
                ...Test,
                ftName:data.ftName,
                number:data.number,
                weight:data.weight,
                date:data.date
            });
            }
        })
      }
      if(testRole==2){
        getMemberBodyCompositionTest(user._id,token,testId).then(data=>{
            if(data.error){
                console.log('err to create db')
            }else{
              setTest({
                ...Test,
                BMR:data.BMR,
                BMI:data.BMI,
                fat:data.fat,
                water:data.water,
                muscle_mass:data.muscle_mass,
                whr_ratio:data.whr_ratio,
                date:data.date
            });
            }
        })
      }
    };
    const TotalPageTest=role=>{
      if(role==0){
        totalPageMemberMeasurementTest(user._id,token,props.match.params.memberId).then(data=>{
            if(data.error){
                console.log('err to create db')
            }else{
              settotal({...total,mttotal:data.total});
              setpage({...page,mtpage:data.page});
            }
        }).catch(err=>console.log(err))
      }
      if(role==1){
        totalPageMemberFitnessTest(user._id,token,props.match.params.memberId).then(data=>{
          if(data.error){
              console.log('err to create db')
          }else{
            settotal({...total,fttotal:data.total});
            setpage({...page,ftpage:data.page});
          }
      }).catch(err=>console.log(err))
      }
      if(role==2){
        totalPageMemberBodyCompositionTest(user._id,token,props.match.params.memberId).then(data=>{
          if(data.error){
              console.log('err to create db')
          }else{
            settotal({...total,bttotal:data.total});
            setpage({...page,btpage:data.page});
          }
      }).catch(err=>console.log(err))
      }
    };
    const GetAllTestNames=()=>{
      if(testRole==0){
        getAllMeasurementTestGym(user._id,token,props.match.params.gymId).then(data=>{
          if(data.error){
            console.log(data.error);
          }else{
            setTestNameList(data);
          }
        }).catch(err=>console.log(err));
      }
      if(testRole==1){
        getAllFitnessTestGym(user._id,token,props.match.params.gymId).then(data=>{
          if(data.error){
            console.log(data.error);
          }else{
            setTestNameList(data);
          }
        }).catch(err=>console.log(err))
      }
    };


  




    //gym and branch pagination function
    const prev=event=>{
          event.preventDefault();
          var cp=0,name="mtcurrentpage";
          if(currentpage<=page&&currentpage!=1){
            if(testRole==0){
              cp=mtcurrentPage-1;
              name="mtcurrentpage";
            }
            if(testRole==1){
              cp=ftcurrentpage-1;
              name="ftcurrentpage";
            }
            if(testRole==2){
              cp=btcurrentpage-1;
              name="btcurrentpage";
            }
            GetAllTest(cp,testRole);
            setcurrentpage({...currentpage,[name]:cp});
          }
    };
    const next=event=>{
          event.preventDefault();
          var cp=0,name="mtcurrentpage";
          if(currentpage<page){
            if(testRole==0){
              cp=mtcurrentPage+1;
              name="mtcurrentpage";
            }
            if(testRole==1){
              cp=ftcurrentpage+1;
              name="ftcurrentpage";
            }
            if(testRole==2){
              cp=btcurrentpage+1;
              name="btcurrentpage";
            }
            GetAllTest(cp,testRole);
            setcurrentpage({...currentpage,[name]:cp});
          }
    };
      
    
    //functional components
    const MeasurementTestFormComp=()=>{
      //onChange={handleChange("mtName")} value={mtName}
      return(
        <div>
            <select onChange={handleChange("mtName")} value={mtId} className="pl-4 pb-2 pt-3 pb-3 mb-3 mt-1 ml-5 shadow" id="mtName" name="mtName" style={{outline: "none", borderRadius: 30, width: "40%", border: "none", color: "rgb(255, 81, 0)", backgroundColor:"#ffffff"}}>
                  <option value="Select Test:">Select Test:</option>
                  {
                    TestNameList.map(data=>{
                      return(
                        <option value={data._id}>{data.test_name}</option>
                      )
                    })
                  }
            </select>
            <input  onMouseDown={()=>{Flatpickr("#date",{
              onChange:()=>{
                setTest({...Test,date:document.getElementById("date").value})
              }
            }).open()}} value={date}  className="pl-4 pr-4 pb-3 pt-3 mb-3 mt-1 ml-5 shadow" id="date" placeholder="Date" style={{outline: "none", borderRadius: 30, width: "40%", border: "none", color: "rgb(255, 81, 0)"}}/>
            <input onChange={handleChange("value")} step="2"  value={value}   className="pl-4 pr-4 pb-3 pt-3 mb-3 mt-1 ml-5 shadow test_value" placeholder="value" style={{outline: "none", borderRadius: 30, width: "40%", border: "none", color: "rgb(255, 81, 0)"}}/>
            <select onChange={handleChange("unit")} value={unit} className="pl-4 pb-2 pt-3 pb-3 mb-3 mt-1 ml-5 shadow" id="mtName" name="mtName" style={{outline: "none", borderRadius: 30, width: "40%", border: "none", color: "rgb(255, 81, 0)", backgroundColor:"#ffffff"}}>
                  <option value="Select Test:">Select Unit:</option>
                  {
                    unit_list.map(unit=>{
                      return(
                        <option value={unit}>{unit}</option>
                      )
                    })
                  }
            </select>
        </div>
      )
    };
    const FitnessTestFormComp=()=>{
      return (
        <div>
           <select onChange={handleChange("ftName")} value={ftId}  className="pl-4 pb-2 pt-3 pb-3 mb-3 mt-1 ml-5 shadow" id="ftName" name="ftName" style={{outline: "none", borderRadius: 30, width: "40%", border: "none", color: "rgb(255, 81, 0)", backgroundColor:"#ffffff"}}>
                <option value="Select Test:">Select Test:</option>
                  {
                    TestNameList.map(data=>{
                      return(
                        <option value={data._id}>{data.test_name}</option>
                      )
                    })
                  }
            </select>
            <input  onMouseDown={()=>{Flatpickr("#date",{
              onChange:()=>{
                setTest({...Test,date:document.getElementById("date").value})
              }
            }).open()}} value={date}  className="pl-4 pr-4 pb-3 pt-3 mb-3 mt-1 ml-5 shadow" placeholder="Date" id="date"  style={{outline: "none", borderRadius: 30, width: "40%", border: "none", color: "rgb(255, 81, 0)"}}/>
            <input onChange={handleChange("value")}  step="2" value={value} id="ft_value"  className="pl-4 pr-4 pb-3 pt-3 mb-3 mt-1 ml-5 shadow test_value" type="text"  placeholder="value" style={{outline: "none", borderRadius: 30, width: "40%", border: "none", color: "rgb(255, 81, 0)"}}/>
            <select onChange={handleChange("unit")} value={unit} className="pl-4 pb-2 pt-3 pb-3 mb-3 mt-1 ml-5 shadow" id="mtName" name="mtName" style={{outline: "none", borderRadius: 30, width: "40%", border: "none", color: "rgb(255, 81, 0)", backgroundColor:"#ffffff"}}>
                  <option value="Select Test:">Select Unit:</option>
                  {
                    unit_list.map(unit=>{
                      return(
                        <option value={unit}>{unit}</option>
                      )
                    })
                  }
            </select>
        </div>
      )
    };
    const BMRTestFormComp=()=>{
      return (
        <div>
          <input onChange={handleChange("BMR")} value={BMR}  className="pl-4 pr-4 pb-3 pt-3 mb-3 ml-5 shadow" type="number" onKeyPress={handleInputs}  id="BMR" name="BMR" placeholder="BMR" style={{outline: "none", borderRadius: 30, width: "40%", border: "none", color: "rgb(255, 81, 0)"}}/>
          <input onChange={handleChange("BMI")} value={BMI}   className="pl-4 pr-4 pb-3 pt-3 mb-3 mt-1 ml-5 shadow" type="number" onKeyPress={handleInputs}  id="BMI" name="BMI" placeholder="BMI" style={{outline: "none", borderRadius: 30, width: "40%", border: "none", color: "rgb(255, 81, 0)"}}/>
          <input onChange={handleChange("fat")} value={fat}  className="pl-4 pr-4 pb-3 pt-3 mb-3 mt-1 ml-5 shadow" type="number" onKeyPress={handleInputs}  id="fat" name="fat" placeholder="FAT" style={{outline: "none", borderRadius: 30, width: "40%", border: "none", color: "rgb(255, 81, 0)"}}/>
          <input onChange={handleChange("water")} value={water}  className="pl-4 pr-4 pb-3 pt-3 mb-3 mt-1 ml-5 shadow" type="number" onKeyPress={handleInputs}  id="water" name="water" placeholder="WATER" style={{outline: "none", borderRadius: 30, width: "40%", border: "none", color: "rgb(255, 81, 0)"}}/>
          <input onChange={handleChange("muscle_mass")} value={muscle_mass}  className="pl-4 pr-4 pb-3 pt-3 mb-3 mt-1 ml-5 shadow" type="number" onKeyPress={handleInputs}  id="muscle_mass" name="muscle_mass" placeholder="Muscle Mass" style={{outline: "none", borderRadius: 30, width: "40%", border: "none", color: "rgb(255, 81, 0)"}}/>
          <input onChange={handleChange("whr_ratio")} value={whr_ratio}  className="pl-4 pr-4 pb-3 pt-3 mb-3 mt-1 ml-5 shadow" type="number" onKeyPress={handleInputs}  id="whr_ratio" name="whr_ratio" placeholder="Whr Ratio" style={{outline: "none", borderRadius: 30, width: "40%", border: "none", color: "rgb(255, 81, 0)"}}/>
          <input onChange={handleChange("date")} value={date}  className="pl-4 pr-4 pb-3 pt-3 mb-3 mt-1 ml-5 shadow" type="date"  id="whr_ratio" name="whr_ratio" placeholder="Whr Ratio" style={{outline: "none", borderRadius: 30, width: "40%", border: "none", color: "rgb(255, 81, 0)"}}/>
        </div>
      )
    };
    const RemoveTestComp=()=>{
      return (
        <div className="ml-5 mt-4 mr-5 mb-4">
        {/* Delete Exercise Type */}
            <p style={{fontWeight: "bold", fontSize: 17, color :"rgb(255, 81, 0)"}}>{`hey`}</p>
            Do you really want to delete {itemName}?
            <div className="row mt-2" style={{justifyContent: "flex-end"}}>
                <button onClick={removeTest}  className="mt-1 mr-3 shadow-sm" style={{borderRadius: 20, width: 40, height: 30, outline: "none", border: "0px",backgroundColor:"#ffffff"}}>
                    <p className="pt-1" style={{color: "#FF6060"}}>Yes</p>
                </button>
                <button onClick={handleCloseDialog}  className="mt-1 shadow-sm" style={{borderRadius: 20, width: 40, height: 30, outline: "none", border: "0px",backgroundColor:"#ffffff"}}>
                    <p  className="pt-1" style={{color: "#43a047"}}>No</p>
                </button>
            </div>
      </div>
      )
    };
    const SelectTestComp=()=>{
      return(
        <div className="ml-5 mt-4 mr-5 mb-4">
        <button onClick={onTypeSelect(0)} className="shadow" style={{margin:5,fontSize:16,width:140,height:40,outline:'none',border:'none',borderRadius:5,background:"#5A20CB",color:"#fff"}}>
            Measurement
        </button>
        <button  onClick={onTypeSelect(1)} className="shadow" style={{margin:5,fontSize:16,width:140,height:40,outline:'none',border:'none',borderRadius:5,background:"#5A20CB",color:"#fff"}}>
            Fitness
        </button>
        <button  onClick={onTypeSelect(2)} className="shadow" style={{margin:5,fontSize:16,width:140,height:40,outline:'none',border:'none',borderRadius:5,background:"#5A20CB",color:"#fff"}}>
            Bodycompostion
        </button>
        </div>
      )
    };
    const TestDialogForm=()=>{
      return (
        <Dialog open={openDialog} onClose={handleCloseDialog} TransitionComponent={Transition}>
        <div>
            <div className="row ml-5 mt-4 mr-5 mb-4" style={{justifyContent: "space-between"}}>
            <div className="pl-4 pr-4 pb-2 pt-2 mb-3 mt-3 shadow-sm text-center" style={{outline: "none", borderRadius: 30, width: "40%", border: "none", color: "#ffffff", fontWeight: "bolder",backgroundColor: "rgb(255, 81, 0)", }}>
              {title}
            </div>
            {
              dialogfun==0?(
                <button onClick={takeTest} className="mt-1" style={{outline: "none", border: "0px",backgroundColor:"#ffffff"}}>
                  <span className="material-icons shadow" style={{fontSize:36,borderRadius:100, color :"rgb(255, 81, 0)"}}>add</span>
                </button>
              ):dialogfun==1?(
                <button onClick={updateTest} className="mt-1" style={{outline: "none", border: "0px",backgroundColor:"#ffffff"}}>
                  <span className="material-icons shadow" style={{fontSize:36,borderRadius:100, color :"rgb(255, 81, 0)"}}>update</span>
                </button>
              ):null
            }
        </div>
        {
          dialogfun==0||dialogfun==1?(
                  <div>
                      {testRole==0?(
                        <div>
                          {MeasurementTestFormComp()}
                      </div>
                      ):testRole==1?(
                        <div>
                          {FitnessTestFormComp()}
                      </div>
                      ):(
                        <div>
                          {BMRTestFormComp()}
                        </div>
                      )}
            </div>
          ):dialogfun==2?(
            <div>
              {RemoveTestComp()}
            </div>
          ):(
            <div>
              {SelectTestComp()}
            </div>
          )}
        </div>    
        </Dialog>
      )
    };

  

    useEffect(()=>{
      GetThisMember();
      GetAllTest(mtcurrentPage,testRole);
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
          calender,
          state:props.location.state,
          planner,
          formrole:0
        }} flag={flag}>
            <div className="row" style={{justifyContent: "space-between"}}>
                <div className="row">
                    <input className="ml-5 pl-4 pr-4 pb-2 pt-2 mb-3 mt-3 shadow-sm" placeholder="Search for names.." style={{outline: "none", borderRadius: 30, width: "60%", border: "none", color: "#757575", backgroundColor: "#e0e0e0"}}/>
                    <span className="material-icons mt-3 ml-1" style={{fontSize: 32}}>sort</span>
                    <span className="material-icons mt-3 ml-1" onClick={handleCreateDialog} style={{fontSize: 32}}>add_circle</span>
                       {TestDialogForm()}
                </div>         
                <div onClick={handleSelectDialog}   className="row mr-5 mt-3" style={{background:"#CAD5E2", borderRadius:20,height:40}}>                     
                     <p  className="mr-2 mt-2 mb-2 pl-2" style={{fontSize: 15}}>{testRole==0?`Measurement Test`:testRole==1?`Fitness Test`:`Bodycompostion Test`}</p>
                     <p className="mr-2 mt-2 mb-2" style={{color:'black',fontSize:15,fontFamily:'cursive',marginTop:20,fontWeight:'bolder'}}>( {testRole==0?mttotal:testRole==1?fttotal:bttotal} )</p>
                </div>                 
            </div>
            <div className="pt-3 pl-3 pr-3">
                {
                   testRole==0?(
                     <div>
                       {
                          measurementlist.map((test,index)=>{
                            return(
                              <div key={test._id} style={{overflow:'hidden'}}>
                                    <div  className="shadow mb-2" style={{ backgroundColor: "#fafafa",width: "100%", height: 33, borderRadius: 10}}>
                                        <div className="row pl-4 pr-4" style={{justifyContent: "space-between"}}>
                                            <div className="row">
                                                <div className="mt-1 ml-4 mt-1" style={{ borderRadius: 100, width: 25, height: 25}} >
                                                    <span style={{fontSize:18,fontWeight:'bold',marginLeft:2}}>{index+1}.</span>  
                                                </div>
                                                <p className="pt-1 pl-2" style={{fontSize: 15}}><b>{test.mtName}</b> {`(result-${test.value}${test.unit},date-${test.date})`}</p>  
                                            </div>
                                            <div className="row">
                                                <span onClick={handleCliclUpdate(test,testRole)} class="material-icons pt-1 btn pr-0" style={{color: "#43a047"}}>update</span>
                                                <span onClick={handleDelete(test._id,test.mtName)} className="material-icons pt-1 btn pr-4" style={{color: "#FF6060"}}>block</span>
                                            </div>
                                            
                                        </div>
                                    </div>
                                </div>
                            )
                          })
                       }
                     </div>
                   ):testRole==1?(
                     <div>
                        {
                          fitnesslist.map((test,index)=>{
                            return(
                              <div style={{overflow:'hidden'}} key={test._id}>
                                    <div  className="shadow mb-2" style={{ backgroundColor: "#fafafa",width: "100%", height: 33, borderRadius: 10}}>
                                        <div className="row pl-4 pr-4" style={{justifyContent: "space-between"}}>
                                            <div className="row">
                                                <div className="mt-1 ml-4 mt-1" style={{ borderRadius: 100, width: 25, height: 25}} >
                                                    <span style={{fontSize:18,fontWeight:'bold',marginLeft:2}}>{index+1}.</span>  
                                                </div>
                                                <p className="pt-1 pl-2" style={{fontSize: 15}}><b>{test.ftName}</b> {`(number-${test.number},wight-${test.weight},date-${test.date})`}</p>
                                            </div>
                                            <div className="row">
                                                <span onClick={handleCliclUpdate(test,testRole)} class="material-icons pt-1 btn pr-0" style={{color: "#43a047"}}>update</span>
                                                <span onClick={handleDelete(test._id,test.ftName)} className="material-icons pt-1 btn pr-4" style={{color: "#FF6060"}}>block</span>
                                            </div>
                                            
                                        </div>
                                    </div>
                                </div>
                            )
                          })
                       }
                     </div>
                   ):(
                     <div>
                        {
                          bodycompositionlist.map((test,index)=>{
                            return(
                              <div style={{overflow:'hidden'}} key={test._id}>
                                    <div  className="shadow mb-2" style={{ backgroundColor: "#fafafa",width: "100%", height: 33, borderRadius: 10}}>
                                        <div className="row pl-4 pr-4" style={{justifyContent: "space-between"}}>
                                            <div className="row">
                                                <div className="mt-1 ml-4 mt-1" style={{ borderRadius: 100, width: 25, height: 25}} >
                                                    <span style={{fontSize:18,fontWeight:'bold',marginLeft:2}}>{index+1}.</span>  
                                                </div>
                                                <p className="pt-1 pl-2" style={{fontSize: 15}}><b>Bodycomposition</b> {`(BMR-${test.BMR},BMI-${test.BMI},fat-${test.fat},water-${test.water},muscle mass-${test.muscle_mass},whr ratio-${test.whr_ratio},date-${test.date}`}</p>
                                            </div>
                                            <div className="row">
                                                <span onClick={handleCliclUpdate(test,testRole)} class="material-icons pt-1 btn pr-0" style={{color: "#43a047"}}>update</span>
                                                <span onClick={handleDelete(test._id,`BodyComposition Test ${index}`)} className="material-icons pt-1 btn pr-4" style={{color: "#FF6060"}}>block</span>
                                            </div>
                                            
                                        </div>
                                    </div>
                                </div>
                            )
                          })
                       }
                     </div>
                   )
                }
                <div className="row pr-3" style={{marginTop: 23, float: "right"}}>
                <span onClick={prev} className="material-icons btn">skip_previous</span>
                <p className="pt-2">{testRole==0?mtcurrentPage:testRole==1?ftcurrentpage:btcurrentpage}</p>
                <span onClick={next} className="material-icons btn ">skip_next</span>
                </div>
            </div>
        </Dashboard>
    )
}
