import React, { useState } from 'react'
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup } from "@/components/ui/radio-group"
import Navbarmain from '../ui/shared/Navbarmain';
import { Button } from "@/components/ui/button"
import { Link, useNavigate } from 'react-router-dom';
import Otpinput from '../verify/Otpinput';
import { USER_API_END_POINT } from '../../utils/constant';
import { toast } from 'sonner';
import axios from 'axios';
import useVerifyUserOTP from '../../hooks/useVerifyUserOTP';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '../redux/AuthSlice';
import { Loader2 } from 'lucide-react';

function Signup() {
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
    ];

    const departments = ["NULL","SOLID_WASTE","ADMINISTRATIVE","SANITATION","SEWERAGE","ELECTRICITY","STRAY_ANIMALS","WATER","VIOLENCE","NOISE_POLLUTION","STREET_LIGHTING","INFRASTRUCTURE","HEALTH"];


    const [showOtpInput, setShowOtpInput] = useState(false);
    const [input, setInput] = useState({
        name: "",
        email: "",
        typedpassword: "",
        password: "",
        role: "",
        district: "",
        department: ""
    });
    const [otp, setotp] = useState("")
    const verifyuserotp = useVerifyUserOTP();
    const { loading } = useSelector(store=>store.auth);
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        const { name, value } = e.target;
        setInput({ ...input, [name]: value });

        // Only update showdistrict if the role field is changed.
        if (name === "role") {
            if (value === "official") {
                setShowdistrict(true);
            } else {
                setShowdistrict(false);
            }
        }
    };

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const dataadmin = {
            name: input.name,
            email: input.email,
            typedpassword: input.typedpassword,
            password: input.password,
            role: input.role,
        };
        const dataofficial = {
            name: input.name,
            email: input.email,
            typedpassword: input.typedpassword,
            password: input.password,
            role: input.role,
            department: input.department,
            district: input.district
        };

        try {
            dispatch(setLoading(true))
            if (input.role === "admin") {
                const res = await axios.post(`${USER_API_END_POINT}/registeradmin`, dataadmin, {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                });
                if (res.data.success) {
                    toast.success(res.data.message);
                }
            }
            else {
                const resofficial = await axios.post(`${USER_API_END_POINT}/registerofficial`, dataofficial, {
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



        // show OTP field

        setShowOtpInput(true);

    };

    const onOtpSubmit = async (OTP) => {
        // const data = {
        //   "otp": OTP
        // };
        setotp(OTP);
        // let endpoint = ``;
        // if (input.role === "admin") {
        //     endpoint = `${USER_API_END_POINT}/registeradmin`;
        // }
        // else {
        //     endpoint = `${USER_API_END_POINT}/registerofficial`;
        // }

        // try {
        //     const res = await axios.post(`${endpoint}/verify`, { otp: OTP }, {
        //         headers: { "Content-Type": "application/json" },
        //         withCredentials: true,
        //     });

        //     if (res.data.success) {
        //         navigate("/adminDashboard");
        //         toast.success(res.data.message);
        //     }
        // } catch (error) {
        //     console.log(error);
        //     toast.error("Verification Failed");
        // }
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
                    <h1 className='font-bold text-xl mb-5'>Sign Up</h1>
                    <div className='my-2'>
                        <Label>Full Name</Label>
                        <Input
                            id="name"
                            type="text"
                            value={input.name}
                            name="name"
                            onChange={changeEventHandler}
                            placeholder="Enter your full name"
                            required
                        />
                    </div>
                    <div className='my-2'>
                        <Label>Email</Label>
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
                        <Label>Password</Label>
                        <Input
                            id="typedpassword"
                            type="password"
                            value={input.typedpassword}
                            name="typedpassword"
                            onChange={changeEventHandler}
                            placeholder="Enter a strong password"
                            required
                        />
                    </div>
                    <div className='my-2'>
                        <Label>Confirm Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={input.password}
                            name="password"
                            onChange={changeEventHandler}
                            placeholder="Enter your password again"
                            required
                        />
                    </div>
                    <RadioGroup className="flex items-center gap-4 my-5">
                        <div className="flex items-center space-x-2">
                            <Input
                                type="radio"
                                name="role"
                                value="admin"
                                className="cursor-pointer"
                                checked={input.role === "admin"}
                                onChange={changeEventHandler}
                            />
                            <Label htmlFor="r1">Admin</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Input
                                type="radio"
                                name="role"
                                value="official"
                                className="cursor-pointer"
                                checked={input.role === "official"}
                                onChange={changeEventHandler}
                            />
                            <Label htmlFor="r2">Official</Label>
                        </div>
                    </RadioGroup>

                    {showdistrict && (
                        <div className="space-y-3">
                            <label htmlFor="district" className="block mb-2 text-md font-bold">District</label>
                            <select
                                id="district"
                                value={input.district}
                                name="district"
                                onChange={changeEventHandler}
                                className="px-4 py-2 rounded-md outline-none w-full"
                                required
                            >
                                <option value="">-- Select Your District --</option>
                                {districts.map((dist, index) => (
                                    <option key={index} value={dist}>{dist}</option>
                                ))}
                            </select>
                            <label htmlFor="district" className="block mb-2 text-md font-bold">Department</label>
                            <select
                                id="department"
                                value={input.department}
                                name="department"
                                onChange={changeEventHandler}
                                className="px-4 py-2 rounded-md outline-none w-full"
                                required
                            >
                                <option value="">-- Select Your Department --</option>
                                {departments.map((depart, index) => (
                                    <option key={index} value={depart}>{depart}</option>
                                ))}
                            </select>
                        </div>
                    )}
                    {
                        loading ? <button><Loader2 className='animate-spin' />Please wait..</button> : <button type="submit" className="w-full button">Signup</button>

                    }
                    <br></br>                 
                    <span>Already Registered? <Link to={"/govt/login"} className='text-blue-600'>Login</Link></span>
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

export default Signup;