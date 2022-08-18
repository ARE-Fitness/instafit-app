import React from "react";
import {Route, Redirect} from "react-router-dom";
import {isAuthenticated} from "./index";

const AdminGymRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated() && isAuthenticated().user.role === 0 || 1? (
          <Component  {...props}/>
        ) : (
          <Redirect
            to={{
              pathname: "/signin",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
}

export default AdminGymRoute;