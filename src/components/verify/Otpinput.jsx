import React, { useEffect, useState } from 'react'
import { useRef } from 'react';

function Otpinput({length=4,onOtpSubmit=()=>{}}) {
  const [otp, setotp] =useState(new Array(length).fill(""));
  
  const inputRefs = useRef([]);
  
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [])
  
  const handleChange = (index, e) => {
    const value = e.target.value;
    if(isNaN(value)) return

    const newOtp = [...otp];
    //alow only one i/p
    newOtp[index] = value.substring(value.length -1);
    setotp(newOtp);

    //submit trigger
    const combineOtp = newOtp.join("");
    if(combineOtp.length === length) onOtpSubmit(combineOtp);

    // Move to next input if current field is filled
    if(value && index<length-1 && inputRefs.current[index+1]){
      inputRefs.current[index+1].focus()
    }
  };
  const handleKeyDown = (index, e) => {
    if(e.key === "Backspace" && !otp[index] && index>0 && inputRefs.current[index-1] )
      inputRefs.current[index-1].focus();
  };

  const handleClick = (index) => {
    inputRefs.current[index].setSelectionRange(1,1);
    if(index>0 && !otp[input-1]){
      inputRefs.current[otp.indexOf("")].focus();
    }
  };

  return (
    <div className="flex items-center justify-center">
      {
        otp.map((value,index) => {
          return (
            <input
            key={index}
            type='text'
            ref={(input) => inputRefs.current[index] = input}
            value={value}
            onChange={(e) => handleChange(index, e)}
            onClick={() => handleClick(index)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className='otpInput'
            />
          );
        })
      }
    </div>
  );
}

export default Otpinput