import React, { useEffect, useState, useContext } from "react";
import styled from 'styled-components'
import WheelPicker from 'react-simple-wheel-picker';
import {map , toString} from 'lodash'
const WheelWrapper = styled.div`
    position: relative;
    ul{
        box-shadow: none;
        position: relative;
        z-index: 1;
        background: none;
        li{
            justify-content: center;
            span{
                display: none;
            }
        }
    }
    .wheel-over {
        box-shadow: 0 1px 24px rgba(0, 0, 0, 0.06);
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 100%;
        height: 36px;
    }
`


const Wheel = (props) => {
    const { options , selected , onChange} = props

    let val = toString(selected)
    const handleOnChange = target => {
   
    };

    const newBalData = map(options, (obj , i ) =>{
        return { 
          id: toString(i),
          value : obj
        }
    }) 

    // console.log(val)

    return (
        <WheelWrapper className="wheelwrap">
            <WheelPicker
                data={newBalData}
                onChange={handleOnChange}
                height={180}
                itemHeight={36}
                // selectedID={val}
                selectedID={val}
                color="#ccc"
                activeColor="#000"
                backgroundColor="#fff"
            />
            <div className="wheel-over" />
        </WheelWrapper>
    );
};

export default Wheel