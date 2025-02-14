import React, { useState, useEffect } from 'react'
import Navbar from '../ui/shared/Navbar'
import Otpinput from '../verify/Otpinput'
import axios from 'axios'
import { toast } from 'sonner';
import { GRIEVANCE_API_END_POINT } from '../../utils/constant';
import useVerifyOTP from '../../hooks/useVerifyOTP';

function Getcitizengrievances() {

  const [showOtpInput, setShowOtpInput] = useState(false);
  const verifyOTP = useVerifyOTP(); // Custom hook returns the function
  const [input, setInput] = useState({
    contact: "",
  });

  const [otp, setotp] = useState("")

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const regex = /[^0-9]/g;
    // if (e.target.contact.length < 10 || regex.test(e.target.contact)) {
    //   alert("Invalid Phone Number")
    //   return;
    // }

    const data = {
      contact: input.contact,
    };

    try {
      const res = await axios.post(`${GRIEVANCE_API_END_POINT}/getcitizengrievances`, data, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success(res.data.message);
      }

    } catch (error) {
      console.log(error);
      toast.error("Error in sending the otp, please try again");
    }


    // Here you would typically send the data to your backend
    // try {
    //   const res = await axios.post(`${GRIEVANCE_API_END_POINT}/grievancesubmission`,formdata,{
    //     headers:{
    //       "Content-Type":"multipart/form-data"
    //     },
    //     withCredentials:true,
    //   });

    //   console.log(formdata);
    //   if (res.data.success) {
    //     toast.success(res.data.message);
    //   }

    // } catch (error) {
    //   console.log(error);
    // }



    //show OTP field
    setShowOtpInput(true);

  };

  const onOtpSubmit = (otp) => {
    setotp(otp);
    verifyOTP(otp); // Call the function returned from the hook with the OTP
  };

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center bg-gray-50 mt-4">
        <div className="shadow-xl rounded-lg sm:w-[350px] md:w-[350px] lg:w-[650px] p-8 bg-white">
          <h1 className="text-center font-bold text-2xl mb-4 mt-4">Enter your number</h1>
          {!showOtpInput ? <form onSubmit={handleSubmit} className="space-y-6">

            {/* Phone Input */}
            <div className="flex-y space-y-2">
              <label htmlFor="contact" className="block mb-2 text-md font-bold">Phone</label>
              <input
                id="contact"
                type="text"
                value={input.contact}
                name="contact"
                onChange={changeEventHandler}
                placeholder="Enter Your Phone number"
                required
                className="px-4 py-2 rounded-lg outline-none w-full bg-gray-200"
              />
            </div>

            <div className="text-center ">
              <button type="submit" className="w-full button">Submit</button>
            </div>
          </form> : <div className="flex items-center justify-between">
            <p className="block mb-2 text-md font-bold mt-2">Enter The OTP sent to {input.contact}</p>
            <Otpinput length={4} onOtpSubmit={onOtpSubmit} />
          </div>
          }
        </div>
      </div>
    </div>
  )
}

export default Getcitizengrievances