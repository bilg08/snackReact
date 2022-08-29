import React, { useEffect, useState } from "react";
import { Snake } from "../snake/snake";
import css from "./board.module.css"
export const Board = () => {

    let [positionSnake,setSnakePosition]=useState([0,0]);
    let [direction,setDirection]=useState("");

    document.addEventListener('keyup', (e) => {
            if (e.keyCode === 37) {
                setDirection(direction='left')
            } else if (e.keyCode === 38) {
                setDirection(direction='top')
            } else if (e.keyCode === 39) {
                setDirection(direction='right')
            } else if (e.keyCode === 40) {
                setDirection(direction='bottom')
            }
    })
    
    useEffect(()=>{
        console.log('before direction',direction==="")
     if(direction==="bottom"){
        setSnakePosition(prevVal=>{
            let prevValACopy=prevVal;
            prevValACopy=[prevValACopy[0],prevValACopy[1]+39];
            setDirection(direction=null)
            return(
                prevVal=prevValACopy
            )
        })
       
    }else if(direction==="right"){
        setSnakePosition(prevVal=>{
            let prevValACopy=prevVal;
            prevValACopy=[prevValACopy[0]-39,prevValACopy[1]];
            setDirection(direction=null)
            return(
                prevVal=prevValACopy
            )
        })
   
    }else if(direction==="left"){
        setSnakePosition(prevVal=>{
            let prevValACopy=prevVal;
            prevValACopy=[prevValACopy[0]+39,prevValACopy[1]];
            setDirection(direction=null)
            return(
                prevVal=prevValACopy
            )
        })
   
    }else if(direction==="top"){
        setSnakePosition(prevVal=>{
            let prevValACopy=prevVal;
            prevValACopy=[prevValACopy[0],prevValACopy[1]-39];
            setDirection(direction=null)
            return(
                prevVal=prevValACopy
            )
        })
   
    }    
    },[direction])
  
    useEffect(()=>{
        console.log('========+====> direction')
        console.log(direction,'direction',positionSnake,'positionSnake','kkk')
    },[positionSnake]);
    return (
        <div className={css.Board}>
            <div style={{top:positionSnake[1],right:positionSnake[0]}} className={css.Snake}>
            </div>
        </div>
    )
}
