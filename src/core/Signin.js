import React, {useState} from 'react';
import { Redirect } from 'react-router-dom';
import Logo from '../assets/logo-bg.png'; 
import Background from "../assets/background-login.png"
import { authenticate, isAuthenticated, SignIn } from '../auth/index';
import MailBox from '../assets/envelope.svg';
import Lock from '../assets/padlock.svg';
import Twitter from '../assets/twitter.png';
import Facebook from '../assets/facebook.png';
import Google from '../assets/google.png';
import Info from '../assets/info.svg';
import Play from "../assets/play.svg";

const SigninRoute = () => {

  const [values, setValues] = useState({
    email: "",
    password: "",
    error: "",
    didRedirect: false
  });
  
  const { email, password, error, didRedirect} = values;

  const [showInfo, setShowInfo] = useState(false);

  const [showError, setShowError] = useState(false);

  const [switchPage, setSwitchPage] = useState(false);
    
  const { user } = isAuthenticated();
  
  const handleChange = name => event => {
    setValues({ ...values, error: false, [name]: event.target.value });
  };
  
  const onSubmit = event => {
    let emailInput = document.querySelector("#email");
    let pswdInput = document.querySelector("#password");
    let headerDivider = document.querySelector(".header-divider");
    event.preventDefault();
    SignIn({ email, password })
      .then(data => {
        if (data.err) {
         setShowError(true);
         emailInput.style.border = "1.5px solid rgb(219, 0, 0)";
         pswdInput.style.border = "1.5px solid rgb(219, 0, 0)";
         headerDivider.style.margin = "1vw 0 1vw 0"
         console.log(data.err);
        } else {
          authenticate(data, () => {
            setValues({
              ...values,
              didRedirect: true
            });
          });
        }
    }).catch(err=>{
      console.log(err);
    });
  };
  
  const validateEmail=(email)=>{
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  const handleSwitchForgotPswd = () => {
    let signinId = document.querySelector("#signin");
    signinId.style.animationDuration = "1s";
    signinId.style.animationIterationCount =  "1";
    signinId.style.animation = "slide 1s";
    setTimeout(() => {
        setSwitchPage(true);
    }, 300);
  }

  const handleSwitchLogin = () => {
    let forgotPswd = document.querySelector("#forgot-pswd");
    forgotPswd.style.animationDuration = "1s";
    forgotPswd.style.animationIterationCount =  "1";
    forgotPswd.style.animation = "slide 1s";
    setTimeout(() => {
        setSwitchPage(false);
    }, 100);

  }

  const handleShowInfo = () => {
    setShowInfo(true);
  }

  window.onmouseup = () => {
    setShowInfo(false);
  }

  const OnBlurFieldChecker=()=>{
    setShowInfo(true);
    let checker=validateEmail(email);
    let emailInput = document.querySelector("#email");
    if(checker){
      emailInput.style.border = "1.5px solid rgb(1, 122, 11)";
      setShowInfo(false);
    }
    else{
      emailInput.style.border = "1.5px solid rgb(219, 0, 0)";
      setShowInfo(true);
    }
  }

  const performRedirect = () => {
    if (didRedirect) {
      
      if (user && user.role === 0) {
        return <Redirect to="/admin/gym" />;
      }
      if(user && user.role===1){
        return <Redirect to="/gym/dashboard"/>
      }
      if(user && user.role===2){
        return <Redirect to="/branch/dashboard"/>
      }
    
    }
    if (isAuthenticated()) {
       
      if (user && user.role === 0) {
        return <Redirect to="/admin/gym" />;
      }
      if(user && user.role===1){
        return <Redirect to="/gym/dashboard"/>
      }
      if(user && user.role===2){
        return <Redirect to="/branch/dashboard"/>
      }
    }
  };

  const onLoadFunctions=()=>{
     
      var onkeyPress=(event)=>{
      if(event.keyCode==13){
        SignIn({ email:document.getElementById("email").value, password:document.getElementById("password").value }).then(data => {
        if (data.err) {
        document.getElementById('password').style.border="1px dashed red";
        console.log(data.err); //print in error dialog or snakbar
        } else {
          authenticate(data, () => {
            setValues({
              ...values,
              didRedirect: true
            });
          });
        }
        }).catch(err=>{
          console.log(err);
        });
      }
    };
    window.addEventListener('keypress',onkeyPress);
    
  }


  return (     
    <div onLoad={onLoadFunctions} className="login-window">
      <div className="login-container">
        <div className="login-background">
          <img className="background-img" alt="bg-img" src={Background}/>
        </div>
        <div className="login-page">
          <img className="logo-instafit" src={Logo}/>
          <div className="welcome-message">Welcome</div>
          <div className="welcome-quote">Shift the focus from what your body looks like to what it can do.</div>
          <div className="header-divider"/>
          {
            showError === true && (
              <div className="alert-text">Incorrect Email or Password</div>
            )
          }

          {
            switchPage === false && (
              <div id="signin" className="pswd-recovery">
                <div className="login-user-data-container" >
                  <div className="login-user-name">E-mail</div>
                  <div onClick={handleShowInfo} className="login-info-icon">
                    <img className="icon-info" src={Info} />
                  </div>
                  {
                    showInfo === true && (
                      <div className="login-email-suggestion">
                        <img src={Play} className="arrow-logo"/>
                        <div className="text-input-field">
                          <div className="text-input">Please use @ in your email</div>
                        </div>
                      </div>
                    )
                  }
                  
                </div>
              
                <div className="input-field-container">
                 
                  <input onChange={handleChange("email")} onInput={OnBlurFieldChecker} value={email} className="input-field" id="email" type="email" placeholder="Type your email-id" autocomplete="off" autoFocus/>
                </div>
                <div className="login-user-data-container">
                  <div className="login-user-name">Password</div>
                </div>
                <div className="input-field-container">
                 
                  <input onChange={handleChange("password")} value={password} className="input-field" id="password" type="password" placeholder="Type your password"/>
                </div>
                <div className="signin-action-container">
                  <div className="forgot-password" onClick={handleSwitchForgotPswd}>forgot password?</div>
                  <div className="signin-button" onClick={onSubmit}>
                    <div className="signin-text">
                      Signin
                    </div>
                  </div>
                  <div className="or-saperator">Or Sign In Using</div>
                  <div className="social-media-container">
                    <img className="media-icon" alt="facebook" src={Facebook}/>
                    <img className="media-icon" alt="twitter" src={Twitter}/>
                    <img className="media-icon" alt="google" src={Google}/>
                  </div>
                </div>
        
              </div>
            )
          }

          {
            switchPage === true && (
              <div id="forgot-pswd" className="pswd-recovery">
                <div onClick={handleSwitchLogin} className="login-user-data-container" style={{cursor:"pointer"}}>
                  <img src={Play} className="icon-size"/>
                  <div className="login-user-name">Go Back</div>
                </div>
                <div className="login-user-data-container" style={{marginTop: "3vw"}}>
                  <div className="login-user-name">E-mail</div>
                </div>
                <div className="input-field-container">
                  <img className="field-icon" alt="mail-box" src={MailBox}/>
                  <input className="input-field" id="email" type="email" placeholder="Type your email-id" autocomplete="off" autoFocus/>
                </div>
                <div className="signin-action-container">
                  <div className="signin-button">
                    <div className="signin-text">
                      Submit
                    </div>
                  </div>
                </div>
              </div>
            ) 
          }
        
        </div>
      </div>
      {performRedirect()}
    </div>
  )
}


export default SigninRoute;













// import React, {useState} from 'react';
// import { Redirect } from 'react-router-dom';
// import Logo from '../assets/logo.png'; 
// import { authenticate, isAuthenticated, SignIn } from '../auth/index';


// const SigninRoute = () => {

//   const [values, setValues] = useState({
//     email: "",
//     password: "",
//     error: "",
//     didRedirect: false
//   });
  
//   const { email, password, error, didRedirect} = values;
    
//   const { user } = isAuthenticated();
  
//   const handleChange = name => event => {
//     setValues({ ...values, error: false, [name]: event.target.value });
//   };
  
//   const onSubmit = event => {
//     event.preventDefault();
//     SignIn({ email, password })
//       .then(data => {
//         if (data.err) {
//          document.getElementById('password').style.border="1px dashed red";
//          console.log(data.err); //print in error dialog or snakbar
//         } else {
//           authenticate(data, () => {
//             setValues({
//               ...values,
//               didRedirect: true
//             });
//           });
//         }
//     }).catch(err=>{
//       //document.getElementById('password').style.border="1px dashed red";
//       console.log(err);
//     });
//   };
  
//   const validateEmail=(email)=>{
//     const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//     return re.test(String(email).toLowerCase());
//   }

//   const OnBlurFieldChecker=()=>{
//     let checker=validateEmail(email);
//     if(checker){
//       document.getElementById('email').style.border="1px dashed green";
//     }else{
//       document.getElementById('email').style.border="1px dashed red";
//     }
//   }

//   const performRedirect = () => {
//     if (didRedirect) {
      
//       if (user && user.role === 0) {
//         return <Redirect to="/admin/gym" />;
//       }
//       if(user && user.role===1){
//         return <Redirect to="/gym/dashboard"/>
//       }
//       if(user && user.role===2){
//         return <Redirect to="/branch/dashboard"/>
//       }
    
//     }
//     if (isAuthenticated()) {
       
//       if (user && user.role === 0) {
//         return <Redirect to="/admin/gym" />;
//       }
//       if(user && user.role===1){
//         return <Redirect to="/gym/dashboard"/>
//       }
//       if(user && user.role===2){
//         return <Redirect to="/branch/dashboard"/>
//       }
//     }
//   };

//   const onLoadFunctions=()=>{
     
//       var onkeyPress=(event)=>{
//       if(event.keyCode==13){
//               SignIn({ email:document.getElementById("email").value, password:document.getElementById("password").value }).then(data => {
//               if (data.err) {
//               document.getElementById('password').style.border="1px dashed red";
//               console.log(data.err); //print in error dialog or snakbar
//               } else {
//                 authenticate(data, () => {
//                   setValues({
//                     ...values,
//                     didRedirect: true
//                   });
//                 });
//               }
//               }).catch(err=>{
//                 console.log(err);
//               });
//       }
//     };
//     window.addEventListener('keypress',onkeyPress);
    
//   }


//   return (
//     <div onLoad={onLoadFunctions} className="bg">

//       <div className="float-right pl-4 pr-4 pb-4 shadow-sm" style={{backgroundColor: "#f5f5f5", borderRadius: 40, marginTop:"9%", marginRight: "8%", width: "29%"}}> 
//         <center>
//             <img className="mt-4 mb-4" src={Logo} style={{width: 100, height: 100}}/>
//             <input onChange={handleChange("email")} onBlur={OnBlurFieldChecker} value={email} className="pl-4 pr-4 pb-3 pt-3 mb-3 mt-3 shadow" type="text" id="email" name="email" placeholder="Email" style={{outline: "none", borderRadius: 30, width: "100%", border: "none", color: "#757575"}}/>
//             <input onChange={handleChange("password")} value={password} className="pl-4 pr-4 pb-3 pt-3 mt-3 shadow" type="password" id="password" name="password" placeholder="Password" style={{outline: "none", borderRadius: 30, width: "100%", border: "none", color: "#757575"}}/>
//             <div className="row pl-4 pr-4 pt-3" style={{justifyContent: "space-between"}} >
//               <div>
//                 <input type="checkbox" id="Remeber Me" name="Remeber Me" value="Remeber Me"/>
//                 <label className="pl-2" for="Remember Me">Remember Me</label>
//               </div>
//               <p>Forgot Password?</p>
//             </div>
//             <button onClick={onSubmit} className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mt-4 mb-2" style={{ outline: "none",width : "60%", height: 40, borderRadius: 30, backgroundColor: "#ff6d00", fontSize: 16}}>
//               SIGN IN
//               <span style={{fontSize: 41}} className="pl-2 material-icons">
//                 arrow_right_alt
//               </span>
//             </button>
//         </center>
//       </div>
//       {performRedirect()}
//     </div>
//   )
// }


// export default SigninRoute;