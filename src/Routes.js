import React from 'react';
import {BrowserRouter, Switch, Route} from "react-router-dom";
import Signin from "./core/Signin";
import AdminRoutes from "./auth/AdminRoutes";
import GymAdminRoutes from "./auth/GymAdminRoutes";
import BranchRoutes from './auth/BranchRoutes';
import AdminGymBranchRoute from './auth/AdminGymBranchRoutes';
import InstafitGymAdminRoutes from './auth/InstafitGymAdminRoutes';
import Gym from './gym/ManageGym';
import GymDashboard from './gym/Dashboard';
import Branch from './branch/ManageBranch';
import ManageContent from './components/content/ManageContent';
import ContentView from './components/content/ContentViewer';
import ExerciseType from './components/content/ManageExerciseType';
import ExerciseLevel from './components/content/ManageExerciseLevel';
import TargetMuscle from './components/content/ManageTargetMuscle';
import TestDashboard from './components/TestDashboard';
import BranchAdmin from './components/admin/ManageBranchInstructor';
import Member from './member/manageMember';
import MemberTestDashboard from './member/memberTestDashboard';
import ManagePlanner from './components/planner/ManagePlanner';
import PlannerDashboard from './components/planner/PlannerDashboard';
import WorkoutReportDashboard from './member/workoutReportDashboard';
import PlannerHistoryDashboard from './member/plannerHistoryDashboard';
import MemberCalender from "./member/memberCalender";
import TestManagePlanner from "./components/planner/TestManagePlanner";
import GymProfile from './gym/GymProfile';
import BranchProfile from './branch/BranchProfile';
import AdminGym from './auth/AdminGymRoutes';
import Appointment from './components/Appointment/ManageAppointment';
import MemberAppointmentView from './member/memberAppointment';


//new components
import Parameters from './components/Parameters/Parameters';
import MemberHistory from './member/memberHistory';
import MemberProfile from './member/MemberProfile';
import memberReport from './member/memberReport';




const Routes = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Signin}/>
                <AdminRoutes path="/admin/gym" exact component={Gym}/>
                <InstafitGymAdminRoutes path="/gym/profile/:gymId" exact component={GymProfile} />
                <InstafitGymAdminRoutes path="/branch/profile/:branchId" exact component={BranchProfile}/>
                <AdminRoutes path="/admin/branch" exact component={Branch}/>
                <InstafitGymAdminRoutes path="/contents" exact component={ManageContent}/>
                <AdminGymBranchRoute path="/content/:gymId/:contentId" exact component={ContentView}/>
                <AdminGymBranchRoute path="/:itemId/exercise-type" exact component={ExerciseType}/>
                <AdminGymBranchRoute path="/:itemId/exercise-level" exact component={ExerciseLevel}/>
                <AdminGymBranchRoute path="/:itemId/target-muscle" exact component={TargetMuscle}/>
                <AdminGymBranchRoute path="/:itemId/test-list" exact  component={TestDashboard}/>
                <AdminGymBranchRoute path="/members" exact component={Member}/>
                <AdminGymBranchRoute path="/member/tests/:gymId/:branchId/:memberId" exact component={MemberTestDashboard}/>
                <AdminGymBranchRoute path="/manage/planner" exact component={PlannerDashboard}/>
                <AdminGymBranchRoute path="/planner/:accountId/:plannerId" exact component={TestManagePlanner}/>
                <AdminGymBranchRoute path="/workout/reports/:branchId/:memberId" exact component={WorkoutReportDashboard}/>
                <AdminGymBranchRoute path="/branch/admin/users" exact component={BranchAdmin}/>
                <GymAdminRoutes path="/gym/dashboard" exact component={GymDashboard}/>
                <AdminGymBranchRoute path="/planner/historys/:branchId/:memberId" exact component={PlannerHistoryDashboard}/>            
                <AdminGymBranchRoute path="/member/calender/:memberId" exact component={MemberCalender}/>
                <AdminGymBranchRoute path="/test-manage/planner/:branchId/:itemId" exact component={TestManagePlanner}/>
                <AdminGymBranchRoute path="/manage/appointment" exact component={Appointment}/>
                <AdminGymBranchRoute path="/member/appointment/:memberId" exact component={MemberAppointmentView}/>
                {/* new routes */}
                <AdminGymBranchRoute path="/member/history" exact component={MemberHistory}/>
                <AdminGymBranchRoute path="/member/profile/:memberId" exact component={MemberProfile}/>
                <AdminGymBranchRoute path="/member-report" exact component={memberReport}/>
                <AdminGymBranchRoute path="/parameters/:userId" exact component={Parameters} /> 
                </Switch>
        </BrowserRouter>
    )
};

export default Routes;