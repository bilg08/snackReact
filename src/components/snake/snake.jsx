import React, { useEffect, useState } from "react";
import css from "./snake.module.css"
export const Snake=(props)=>{
    let [styleForSnake,setStyleForSnake]=useState({})
    useEffect(()=>{
        setStyleForSnake(styleForSnake=props.style)
    },[props])
    return(
        <div style={{left:styleForSnake[0]+'px',
                     top:styleForSnake[1]+'px',
                     right:styleForSnake[2]+'px',
                     bottom:styleForSnake[3]+'px'}} className={css.Snake}>
        </div>
    )
}