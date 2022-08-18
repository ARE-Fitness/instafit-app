import React, {useEffect, useRef, useState} from 'react';
import './Loader.css';

const ProgressLoader=({isLoad})=>{


    useEffect(()=>{
          let timer;
          function startLoader(){
                  timer=setInterval(()=>{
                  
                        let counter=document.getElementById("progress").getAttribute("data-counter");
                        counter++;
                        if(`${document.getElementById("progress").style.width}`=="100%"){
                          counter=0;
                          clearInterval(timer);
                          setTimeout(()=>{
                            startLoader()
                          },300)
                        }
                        document.getElementById("progress").setAttribute("data-counter",counter);
                        document.getElementById("progress").style.width=counter+"%";
                      
                      
                  },100);
            }
            startLoader();
    },[]);

  return (
    <div style={{position:'absolute',width:'100%',bottom:"0",left:"0"}}>
        {
            isLoad?(
                <div className="loader-wrapper">
                  <div id="progress" style={{width:'0%'}} data-counter={0}  className="loader-spinner">
                  </div>
                </div>
            ):(null)
        }
    </div>
  )    

}


export default ProgressLoader;