import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup } from "@/components/ui/radio-group";
import Navbarmain from '../ui/shared/Navbarmain';
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from 'react-router-dom';
import Otpinput from '../verify/Otpinput';
import axios from 'axios';
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner';
import { USER_API_END_POINT } from '../../utils/constant';
import useVerifyUserOTP from '../../hooks/useVerifyUserOTP';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '../redux/AuthSlice'
import store from '../redux/store';

function Login() {
  const [showdistrict, setShowdistrict] = useState(false);
  const districts = [
    "Agra",
    "Aligarh",
    "Ambedkar Nagar",
    "Amethi",
    "Amroha",
    "Auraiya",
    "Azamgarh",
    "Baghpat",
    "Bahraich",
    "Ballia",
    "Balrampur",
    "Banda",
    "Barabanki",
    "Bareilly",
    "Budaun",
    "Basti",
    "Bhadohi",
    "Bijnor",
    "Bulandshahr",
    "Chandauli",
    "Chitrakoot",
    "Deoria",
    "Etah",
    "Etawah",
    "Faizabad",
    "Farrukhabad",
    "Fatehpur",
    "Prayagraj",
    "Gautam Buddha Nagar",
    "Ghaziabad",
    "Ghazipur",
    "Gonda",
    "Gorakhpur",
    "Hamirpur",
    "Hapur",
    "Hardoi",
    "Hathras",
    "Jalaun",
    "Jaunpur",
    "Jhansi",
    "Kannauj",
    "Kanpur Dehat",
    "Kanpur Nagar",
    "Kasganj",
    "Kaushambi",
    "Kushinagar",
    "Kheri",
    "Lalitpur",
    "Lucknow",
    "Maharajganj",
    "Mahoba",
    "Mainpuri",
    "Mathura",
    "Mau",
    "Meerut",
    "Mirzapur",
    "Moradabad",
    "Muzaffarnagar",
    "Pilibhit",
    "Pratapgarh",
    "Raebareli",
    "Rampur",
    "Saharanpur",
    "Samastipur",
    "Sant Kabir Nagar",
    "Shahjahanpur",
    "Shamli",
    "Shravasti",
    "Siddharthnagar",
    "Sitapur",
    "Sonbhadra",
    "Sultanpur",
    "Unnao",
    "Varanasi",
    "Ayodhya",
    "Maha kumbh area of Prayagraj",
  ] // UP districts;

  
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "",
    district: "",
  });

  const verifyuserotp = useVerifyUserOTP();
  const { loading } = useSelector(store=>store.auth)
  const dispatch = useDispatch()

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
    if (name === "role") {
      setShowdistrict(value === "official");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataadmin = {
      email: input.email,
      password: input.password,
      role: input.role,
    };
    const dataofficial = {
      email: input.email,
      password: input.password,
      role: input.role,
      district: input.district
    };

    try {
      dispatch(setLoading(true))
      if (input.role === "admin") {
        const res = await axios.post(`${USER_API_END_POINT}/loginadmin`, dataadmin, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        if (res.data.success) {
          toast.success(res.data.message);
        }
      } else {
        const resofficial = await axios.post(`${USER_API_END_POINT}/loginofficial`, dataofficial, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        if (resofficial.data.success) {
          toast.success(resofficial.data.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Error in sending the otp, please try again");
    } finally {
      dispatch(setLoading(false));
    }
    setShowOtpInput(true);
  };

  // Pass the OTP value directly into the verification hook.
  const onOtpSubmit = async (OTP) => {
    try {
      verifyuserotp(OTP, input.role);
    } catch (error) {
      console.log(error);
      toast.error("Verification Failed");
    }
  };

  return (
    <div>
      <Navbarmain />
      <div className='flex items-center justify-center max-w-7xl mx-auto'>
        {!showOtpInput ? (
          <form onSubmit={handleSubmit} className='w-1/2 border border-gray-200 p-4 my-10'>
            <h1 className='font-bold text-xl mb-5'>Log In</h1>
            <div className='my-2'>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={input.email}
                name="email"
                onChange={changeEventHandler}
                placeholder="xyz@gmail.com"
                required
              />
            </div>
            <div className='my-2'>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={input.password}
                name="password"
                onChange={changeEventHandler}
                placeholder="Enter a strong password"
                required
              />
            </div>
            <RadioGroup className="flex items-center gap-4 my-5">
              <div className="flex items-center space-x-2">
                <Input
                  type="radio"
                  value="admin"
                  name="role"
                  checked={input.role === "admin"}
                  onChange={changeEventHandler}
                  className="cursor-pointer"
                />
                <Label htmlFor="r1">Admin</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  type="radio"
                  value="official"
                  name="role"
                  checked={input.role === "official"}
                  onChange={changeEventHandler}
                  className="cursor-pointer"
                />
                <Label htmlFor="r2">Official</Label>
              </div>
            </RadioGroup>
            {showdistrict && (
              <div className="space-y-2">
                <label htmlFor="district" className="block mb-2 text-md font-bold">District</label>
                <select
                  id="district"
                  value={input.district}
                  name="district"
                  onChange={changeEventHandler}
                  className="px-4 py-2 rounded-md outline-none w-full"
                  required
                >
                  <option value="">-- Select a District --</option>
                  {districts.map((dist, index) => (
                    <option key={index} value={dist}>{dist}</option>
                  ))}
                </select>
              </div>
            )}
            {
              loading ? <button className="w-full button"><Loader2 className='animate-spin flex items-center justify-center"' /></button> : <button type="submit" className="w-full button">Login</button>

            }
            <br></br>
            <span>Don't have an account? <Link to={"/govt/signup"} className='text-blue-600'>Sign Up</Link></span>
          </form>
        ) : (
          <div className="flex items-center justify-between">
            <p className="block mb-2 text-md font-bold mt-2">Enter The OTP sent to {input.email}</p>
            <Otpinput length={4} onOtpSubmit={onOtpSubmit} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
