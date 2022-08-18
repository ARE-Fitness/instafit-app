import React from "react";
import { withRouter } from "react-router-dom";
import {  SignOut, isAuthenticated } from "../auth/index";
import OpenInNewIcon from '@material-ui/icons/OpenInNew';


const Menu = ({ history }) => (
    <div>
        {!isAuthenticated() && (
            <p className="my-auto" style={{textDecoration: 'none', color: "#00e5ff"}} >Sign In</p>
        )}
        {isAuthenticated() &&(
            <p className="my-auto" style={{textDecoration: "none", color: "#ffffff"}} onClick={() => 
              {
              SignOut(() => {
                  history.push("/");
                });
              }}
            >
            Signout
            </p> 
        )}
        
    
    </div>
  );
  
  export default withRouter(Menu);