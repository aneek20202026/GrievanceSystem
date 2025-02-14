import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { LogOut, User2 } from 'lucide-react'
import { toast } from 'sonner';
import axios from 'axios';
import { USER_API_END_POINT } from '../../../utils/constant';
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/AuthSlice";
 

function Navbarmain() {
    const dispatch = useDispatch();
    const {user} = useSelector(state=>state.auth)
    const navigate = useNavigate();

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`,{withCredentials:true});
            if(res.data.success){
                dispatch(logout());
                navigate("/govt");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }

    return (
        <div className='bg-white shadow-md'>
            <div className='flex items-center justify-between mx-auto p-5 max-w-7xl h-20'>
                <div>
                    <h1 className='text-2xl font-bold'>Grievance<span className='text-[#f83002]'>Portal</span></h1>
                </div>
                <div className='flex items-center gap-8'>
                    <ul className='flex font-medium item-center gap-5'>
                        <li>Home</li>
                    </ul>
                    {
                        !user ? (
                            <div className='flex items-center gap-2'>
                                <Link to={"/govt/login"}><Button variant="outline">Login</Button></Link>
                                <Link to={"/govt/signup"}><Button className="bg-[#FC6238] hover:bg-[#FF8C00]">Signup</Button></Link>
                            </div>
                        ) : (
                            <div className='flex items-center gap-2 cursor-pointer'>
                                <LogOut />
                                <Button onClick={logoutHandler} variant="outline">Logout</Button>
                            </div>
                        )
                    }



                </div>
            </div>
        </div>
    )
}

export default Navbarmain