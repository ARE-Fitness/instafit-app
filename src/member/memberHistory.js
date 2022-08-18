import React,{useState, useEffect} from 'react';
import Dashboard from '../core/Dashboard';
import MemberProfile from '../assets/gymnast (1).png';
import ContactMe from '../assets/id-card.png';
import ArrowCollapse from "../assets/arrow-sign.svg";
import ArrowExpand from "../assets/arrow-down.svg";
import FitnessIcon from "../assets/fitness.png";
import FitnessValue from "../assets/measurement.png";
import WorkoutHistory from "../assets/workout-history.png";
import PieChart from "../assets/free-pie-chart-icon-683-thumb.png";
import Flatpickr from "flatpickr";

export default function MemberBio() {

    const [switchBio, setSwitchBio] = useState("physiology");

    const [moreinfo, setMoreInfo] = useState();

    const selectMenu = (e) => {
        var id = e.target.id;
        // var value = e.target.value;
        var currentMenu = document.getElementById('menu-items').getElementsByTagName('div');
        for (var i=0; i<currentMenu.length; i++) {
            currentMenu[i].style.color = "#3a3a3a";
            currentMenu[i].style.borderBottom = "0";
            currentMenu[i].style.fontWeight = "normal";

        }
        document.getElementById(id).style.color = '#ff8800';
        document.getElementById(id).style.borderBottom = '1px solid #ff8800';
        document.getElementById(id).style.fontWeight = '600';

        setSwitchBio(id);
    }

    const toggleCardView = (e) => {
        var id = e.target.id;

        if(id == "arrow-collapse-1"){
            document.getElementById("arrow-collapse-1").style.display = "none";
            document.getElementById("arrow-expand-1").style.display = "block";
            setMoreInfo(id);
        }else{
            document.getElementById("arrow-collapse-1").style.display = "block";
            document.getElementById("arrow-expand-1").style.display = "none";
            setMoreInfo("");
        }
    }

    const toggleFitnessCard = (e) => {
        var id = e.target.id;

        if(id == "arrow-collapse-2"){
            document.getElementById("arrow-collapse-2").style.display = "none";
            document.getElementById("arrow-expand-2").style.display = "block";
            setMoreInfo(id);
        }else{
            document.getElementById("arrow-collapse-2").style.display = "block";
            document.getElementById("arrow-expand-2").style.display = "none";
            setMoreInfo("");
        }
    }


    const toggleFitnessTest = (e) => {
        var id = e.target.id;

        if(id == "arrow-collapse-3"){
            document.getElementById("arrow-collapse-3").style.display = "none";
            document.getElementById("arrow-expand-3").style.display = "block";
            setMoreInfo(id);
        }else{
            document.getElementById("arrow-collapse-3").style.display = "block";
            document.getElementById("arrow-expand-3").style.display = "none";
            setMoreInfo("");
        }
    }


    const toggleWorkoutHistory = (e) => {
        var id = e.target.id;

        if(id == "arrow-collapse-4"){
            document.getElementById("arrow-collapse-4").style.display = "none";
            document.getElementById("arrow-expand-4").style.display = "block";
            setMoreInfo(id);
        }else{
            document.getElementById("arrow-collapse-4").style.display = "block";
            document.getElementById("arrow-expand-4").style.display = "none";
            setMoreInfo("");
        }
    }


    const viewWorkoutHistory = () => {
        if(document.getElementById("workout-history-date-picker").style.display == "none"){
            document.getElementById("workout-history-date-picker").style.display = "block";
            document.getElementById("workout-history-data-list").style.display = "none";
        }else{
            document.getElementById("workout-history-date-picker").style.display = "none";
            document.getElementById("workout-history-data-list").style.display = "block";
        }
    }

    


    return(
        <Dashboard flag={0} navItemData={`Member`} data={{lowconnection : false}}>
            <div className="memeber-bio-header">
                {/* <div className="member-profile-container">
                    <div className="member-profile-image">
                        <img src={MemberProfile} style={{width:"100%", height:"100%", alignSelf:'center'}}/>
                    </div>
                    <div style={{alignSelf:"center"}}>
                        <div className="member-profile-txt">UserName</div>
                        <div className="member-profile-txt">user@gmail.com</div>
                    </div>
                </div>
                <div className="fitness-goal-container">
                    <div className="fitness-goal-header-container">
                    <span class="material-icons-outlined fitness-goal-icon">fitness_center</span>
                    <div className="fitness-goal-header">Workout card</div>
                    </div>
                    
                    <div className="fitness-goal-text">Duration - 20-10-20 to 22-10-20 </div>
                </div>
               <div>
                   <div className="contact-details">
                       <img src={ContactMe} className="contact-details-icon"/>
                       <div className="contact-details-text">Member Bio</div>
                   </div>
               </div> */}

               <div className="dashboard-header">Member History</div>
            </div>
            {/* <div className="member-profile-info-divider"></div> */}
            {/* <div id="member-menu" className="member-toggle-activity-container">
                
            </div> */}

            <div id="menu-items" className="member-toggle-activity-container">
                <div id="physiology" onClick={selectMenu} className="member-toggle-text-active">Physiological Parameters & Body Composition</div>
                <div id="measurement" onClick={selectMenu} className="member-toggle-text-inactive">Fitness Measurement</div>
                <div id="test" onClick={selectMenu} className="member-toggle-text-inactive">Fitness Test</div>
                <div id="history" onClick={selectMenu} className="member-toggle-text-inactive">Workout History</div>
                <div id="results" onClick={selectMenu} className="member-toggle-text-inactive">Results</div>
            </div>

            <div className="member-info-container">

                {
                   switchBio == "physiology" && (
                    <div className="member-info-scrollbar">
                        <div className="med-body-table"> 
                            <div style={{display:"flex", alignItems: "flex-start", justifyContent:"space-between"}}>
                                <div style={{display:"flex", alignItems: "flex-start", alignSelf:"center"}}>
                                    <span class="material-icons-round med-body-icon">accessibility_new</span>
                                    <div style={{alignSelf:"center"}}>
                                        <div className="med-body-name"> Physiological Parameters & Body Composition</div>
                                        <div className="med-body-date"> Date: 22-10-10</div>
                                    </div>
                                </div>
                                <img id="arrow-collapse-1" onClick={toggleCardView} className="arrow-icon" src={ArrowCollapse}/>
                                <img id="arrow-expand-1" onClick={toggleCardView} className="arrow-icon" src={ArrowExpand} style={{display:"none"}}/>
                            </div>
                            <div className="med-body-table-header">
                                <div className="med-body-table-body med-body-txt-header" style={{textAlign:"left"}}>Tests</div>
                                <div className="med-body-table-body med-body-txt-header">Results</div>
                                <div className="med-body-table-body med-body-txt-header">Flag</div>
                                <div className="med-body-table-body med-body-txt-header">Measuring Unit</div>
                                <div className="med-body-table-body med-body-txt-header">Ideal Range</div>
                            </div>
                            <div className="med-body-table-header">
                                <div className="med-body-table-body med-body-txt" style={{textAlign:"left"}}>Waist to Hip Ratio</div>
                                <div className="med-body-table-body med-body-txt">30</div>
                                <div className="med-body-table-body med-body-txt">Good</div>
                                <div className="med-body-table-body med-body-txt">Ratio</div>
                                <div className="med-body-table-body med-body-txt">14 - 22.2</div>
                            </div>

                            {
                                moreinfo == "arrow-collapse-1" && (
                                    <div>
                                        <div className="med-body-table-header">
                                            <div className="med-body-table-body med-body-txt" style={{textAlign:"left"}}>Systotic BP</div>
                                            <div className="med-body-table-body med-body-txt">128</div>
                                            <div className="med-body-table-body med-body-txt">High</div>
                                            <div className="med-body-table-body med-body-txt">mm Hg</div>
                                            <div className="med-body-table-body med-body-txt">&#60; 120</div>
                                        </div>
                                        <div className="med-body-table-header">
                                            <div className="med-body-table-body med-body-txt" style={{textAlign:"left"}}>Diastolic BP</div>
                                            <div className="med-body-table-body med-body-txt">77</div>
                                            <div className="med-body-table-body med-body-txt">Low</div>
                                            <div className="med-body-table-body med-body-txt">mm Hg</div>
                                            <div className="med-body-table-body med-body-txt">&#60; 80</div>
                                        </div>
                                        <div className="med-body-table-header">
                                            <div className="med-body-table-body med-body-txt" style={{textAlign:"left"}}>Heart Rate</div>
                                            <div className="med-body-table-body med-body-txt">75</div>
                                            <div className="med-body-table-body med-body-txt">Low</div>
                                            <div className="med-body-table-body med-body-txt">BPM</div>
                                            <div className="med-body-table-body med-body-txt">150 - 180</div>
                                        </div>
                                        <div className="med-body-table-header">
                                            <div className="med-body-table-body med-body-txt" style={{textAlign:"left"}}>Basal Metabolic Rate</div>
                                            <div className="med-body-table-body med-body-txt">40</div>
                                            <div className="med-body-table-body med-body-txt">Low</div>
                                            <div className="med-body-table-body med-body-txt">Kcal</div>
                                            <div className="med-body-table-body med-body-txt">33 - 46</div>
                                        </div>
                                        <div className="med-body-table-header">
                                            <div className="med-body-table-body med-body-txt" style={{textAlign:"left"}}>Body Mass Index</div>
                                            <div className="med-body-table-body med-body-txt">40</div>
                                            <div className="med-body-table-body med-body-txt">Morbidly Obese</div>
                                            <div className="med-body-table-body med-body-txt">Kcal</div>
                                            <div className="med-body-table-body med-body-txt">18.5 - 24.9</div>
                                        </div>
                                        <div className="med-body-table-header">
                                            <div className="med-body-table-body med-body-txt" style={{textAlign:"left"}}>Percent Body Fat</div>
                                            <div className="med-body-table-body med-body-txt">30</div>
                                            <div className="med-body-table-body med-body-txt">Good</div>
                                            <div className="med-body-table-body med-body-txt">Percent (%)</div>
                                            <div className="med-body-table-body med-body-txt">14 - 22.2</div>
                                        </div>
                                    </div>
                                
                                )
                            }
                        </div>
                       
                    </div>
                   )
                }

                {
                   switchBio == "measurement" && (
                    <div className="member-info-scrollbar">
                        <div className="med-body-table"> 
                            <div style={{display:"flex", alignItems: "flex-start", justifyContent:"space-between"}}>
                                <div style={{display:"flex", alignItems: "flex-start", alignSelf:"center"}}>
                                    <img src={FitnessValue} class="med-body-icon-png"/>
                                    <div style={{alignSelf:"center"}}>
                                        <div className="med-body-name"> Fitness Measurement</div>
                                        <div className="med-body-date"> Date: 22-10-10</div>
                                    </div>
                                </div>
                                <img id="arrow-collapse-2" onClick={toggleFitnessCard} className="arrow-icon" src={ArrowCollapse}/>
                                <img id="arrow-expand-2" onClick={toggleFitnessCard} className="arrow-icon" src={ArrowExpand} style={{display:"none"}}/>
                            </div>
                            <div className="med-body-table-header">
                                <div className="med-body-table-body med-body-txt-header" style={{textAlign:"left"}}>Parameters</div>
                                <div className="med-body-table-body med-body-txt-header">Results</div>
                                <div className="med-body-table-body med-body-txt-header">Unit</div>
                                <div className="med-body-table-body med-body-txt-header">Goal</div>
                                <div className="med-body-table-body med-body-txt-header">Remark</div>
                            </div>
                            <div className="med-body-table-header">
                                <div className="med-body-table-body med-body-txt" style={{textAlign:"left"}}>Chest</div>
                                <div className="med-body-table-body med-body-txt">12</div>
                                <div className="med-body-table-body med-body-txt">cm</div>
                                <div className="med-body-table-body med-body-txt">I have no goal</div>
                                <div className="med-body-table-body med-body-txt-header"></div>
                            </div> 

                            {
                                moreinfo == "arrow-collapse-2" && (
                                    <div>
                                        <div className="med-body-table-header">
                                            <div className="med-body-table-body med-body-txt" style={{textAlign:"left"}}>Thigh Circumference</div>
                                            <div className="med-body-table-body med-body-txt">cm</div>
                                            <div className="med-body-table-body med-body-txt">32</div>
                                            <div className="med-body-table-body med-body-txt">I have no goal</div>
                                            <div className="med-body-table-body med-body-txt-header"></div>
                                        </div> 
                                        <div className="med-body-table-header">
                                            <div className="med-body-table-body med-body-txt" style={{textAlign:"left"}}>Mid Arm Circumference</div>
                                            <div className="med-body-table-body med-body-txt">cm</div>
                                            <div className="med-body-table-body med-body-txt">20</div>
                                            <div className="med-body-table-body med-body-txt">I have no goal</div>
                                            <div className="med-body-table-body med-body-txt-header"></div>
                                        </div>    
                                        <div className="med-body-table-header">
                                            <div className="med-body-table-body med-body-txt" style={{textAlign:"left"}}>Waist</div>
                                            <div className="med-body-table-body med-body-txt">cm</div>
                                            <div className="med-body-table-body med-body-txt">67</div>
                                            <div className="med-body-table-body med-body-txt">I have no goal</div>
                                            <div className="med-body-table-body med-body-txt-header"></div>
                                        </div> 
                                        <div className="med-body-table-header">
                                            <div className="med-body-table-body med-body-txt" style={{textAlign:"left"}}>Hip</div>
                                            <div className="med-body-table-body med-body-txt">cm</div>
                                            <div className="med-body-table-body med-body-txt">100</div>
                                            <div className="med-body-table-body med-body-txt">I have no goal</div>
                                            <div className="med-body-table-body med-body-txt-header"></div>
                                        </div> 
                                        <div className="med-body-table-header">
                                            <div className="med-body-table-body med-body-txt" style={{textAlign:"left"}}>Calf</div>
                                            <div className="med-body-table-body med-body-txt">cm</div>
                                            <div className="med-body-table-body med-body-txt">28</div>
                                            <div className="med-body-table-body med-body-txt">I have no goal</div>
                                            <div className="med-body-table-body med-body-txt-header"></div>
                                        </div> 
                                    </div>
                                )
                            }
                        </div>
                       
                    </div>
                   )
                }

                {
                   switchBio == "test" && (
                    <div className="member-info-scrollbar">
                        <div className="med-body-table"> 
                            <div style={{display:"flex", alignItems: "flex-start", justifyContent:"space-between"}}>
                                <div style={{display:"flex", alignItems: "flex-start", alignSelf:"center"}}>
                                    <img src={FitnessIcon} class="med-body-icon-png"/>
                                    <div style={{alignSelf:"center"}}>
                                        <div className="med-body-name"> Fitness Test</div>
                                        <div className="med-body-date"> Date: 22-10-10</div>
                                    </div>
                                </div>
                                <img id="arrow-collapse-3" onClick={toggleFitnessTest} className="arrow-icon" src={ArrowCollapse}/>
                                <img id="arrow-expand-3" onClick={toggleFitnessTest} className="arrow-icon" src={ArrowExpand} style={{display:"none"}}/>
                            </div>
                            <div className="med-body-table-header">
                                <div className="med-body-table-body med-body-txt-header" style={{textAlign:"left"}}>Parameters</div>
                                <div className="med-body-table-body med-body-txt-header">Results</div>
                                <div className="med-body-table-body med-body-txt-header">Unit</div>
                                <div className="med-body-table-body med-body-txt-header">Goal</div>
                                <div className="med-body-table-body med-body-txt-header">Remark</div>
                            </div>
                            <div className="med-body-table-header">
                                <div className="med-body-table-body med-body-txt" style={{textAlign:"left"}}>Muscle Endurance</div>
                                <div className="med-body-table-body med-body-txt">12</div>
                                <div className="med-body-table-body med-body-txt">cm</div>
                                <div className="med-body-table-body med-body-txt">15</div>
                                <div className="med-body-table-body med-body-txt-header"></div>
                            </div> 

                            {
                                moreinfo == "arrow-collapse-3" && (
                                    <div>
                                        
                                    </div>
                                )
                            }
                        </div>
                       
                    </div>
                   
                   )
                }

                {
                   switchBio == "history" && (
                       <div>
                        <div id="workout-history-date-picker">
                            <div className="member-history-pannel">
                                <div className="d-flex">
                                    <div className="flex-item" style={{margin: "2% 2% 0 0"}}>Start Date</div>
                                    <input id="startdate" type="date" className="flex-item select-dropdown date-field"  onMouseDown={()=>{
                                    Flatpickr("#startdate",{
                                    
                                    }).open()
                                }} /> 
                                    <div className="flex-item" style={{margin: "2% 2% 0 4%"}}>End Date</div>
                                    <input id="enddate" type="date" className="flex-item select-dropdown date-field" onMouseDown={()=>{
                                Flatpickr("#enddate",{
                                    
                                    }).open()
                                }}/>
                                </div>
                                <div className="imp-note inactive spacing-2">Please select a date range to view your workout history</div>
                            </div>
                            <button onClick={viewWorkoutHistory} class="spacing-3 active-btn">View</button>
                        </div>

                        <div id="workout-history-data-list"  className="member-info-scrollbar" style={{display: "none"}}>
                            <div className="med-body-table"> 
                                <div style={{display:"flex", alignItems: "flex-start", justifyContent:"space-between"}}>
                                    <div style={{display:"flex", alignItems: "flex-start", alignSelf:"center"}}>
                                        <img src={WorkoutHistory} class="med-body-icon-png"/>
                                        <div style={{alignSelf:"center"}}>
                                            <div className="med-body-name"> Date</div>
                                            <div className="med-body-date"> 22 jul to 24 aug</div>
                                        </div>
                                    </div>
                                    <div style={{alignSelf:"center"}}>
                                        <div className="med-body-name">Display Name</div>
                                        <div className="med-body-date" style={{textAlign:"center"}}>Planner One</div>
                                    </div>
                                    <div style={{alignSelf:"center"}}>
                                        <div className="med-body-name"> Instructor</div>
                                        <div className="med-body-date" style={{textAlign:"center"}}> Anik Roy</div>
                                    </div>
                                    <div style={{alignSelf:"center"}}>
                                        <div className="med-body-name"> Total Exercise</div>
                                        <div className="med-body-date" style={{textAlign:"center"}}> 5</div>
                                    </div>
                                    <img id="arrow-collapse-4" onClick={toggleWorkoutHistory} className="arrow-icon" src={ArrowCollapse}/>
                                    <img id="arrow-expand-4" onClick={toggleWorkoutHistory} className="arrow-icon" src={ArrowExpand} style={{display:"none"}}/>
                                </div>
                                {
                                    moreinfo == "arrow-collapse-4" && (

                                        <div style={{display:"flex", alignSelf:"center"}}>
                                            <div>
                                                <div className="member-exercise-container">
                                                    <table className="member-exercise-title-container"  style={{width: "63vw", marginTop: "3%"}}>
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
                                                        <tr>
                                                            <td>1.</td>
                                                            <td>Planner 1 ex</td>
                                                            <td>3</td>
                                                            <td>2</td>
                                                            <td>7</td>
                                                            <td>5</td>
                                                            <td>2</td>
                                                            <td>2</td>
                                                        </tr>
                                                    </table>
                                                </div>
                                                {/* <div className="med-body-table-header">
                                                    <div className="planner-body-table med-body-txt-header" style={{textAlign:"left"}}>Sl No.</div>
                                                    <div className="planner-body-table med-body-txt-header">Exercise Name</div>
                                                    <div className="planner-body-table med-body-txt-header">Set</div>
                                                    <div className="planner-body-table med-body-txt-header">Repetation</div>
                                                </div>
                                                <div className="med-body-table-header">
                                                    <div className="planner-body-table med-body-txt" style={{textAlign:"left"}}>Monday</div>
                                                    <div className="planner-body-table med-body-txt">Chest</div>
                                                    <div className="planner-body-table med-body-txt">22</div>
                                                </div>
                                                <div className="med-body-table-header">
                                                    <div className="planner-body-table med-body-txt" style={{textAlign:"left"}}>Tuesday</div>
                                                    <div className="planner-body-table med-body-txt">Legs</div>
                                                    <div className="planner-body-table med-body-txt">18</div>
                                                </div>
                                                <div className="med-body-table-header">
                                                    <div className="planner-body-table med-body-txt" style={{textAlign:"left"}}>Wednesday</div>
                                                    <div className="planner-body-table med-body-txt">Hips</div>
                                                    <div className="planner-body-table med-body-txt">12</div>
                                                </div>
                                                <div className="med-body-table-header">
                                                    <div className="planner-body-table med-body-txt" style={{textAlign:"left"}}>Friday</div>
                                                    <div className="planner-body-table med-body-txt">Chest</div>
                                                    <div className="planner-body-table med-body-txt">20</div>
                                                </div> */}
                                            </div>
                                            {/* <div className="progress-chart-container">
                                                <div className="med-body-txt-header" style={{color:"#00a2ff", textTransform:"uppercase"}}>PROGRESS</div>
                                                <div className="chart">
                                                    <img src={PieChart} className="chart-logo" />
                                                </div>
                                            </div> */}
                                        </div>
                                    
                                    )
                                }
                            </div>
                        </div>
                    </div>
                   )
                }
                
                
                
            </div>
        </Dashboard>
    )
}

