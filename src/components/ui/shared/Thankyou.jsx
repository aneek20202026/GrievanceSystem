import React from 'react'
import { Link, useNavigate } from "react-router-dom";


function Thankyou() {
    const navigate = useNavigate();

    return (
        <div className='bg-white flex items-center justify-center h-screen'>
            <div className='flex-y'>
                <p className='text-2xl font-bold'><h1>Your grievance has been submitted succesfully.<br /> We will try to ressolve it as soon as possible.</h1></p>
                <br />
                <div className='flex items-center gap-12'>
                    <Link to="/"><button className='thankyougo'>Go back to home</button></Link>
                    <Link to="/getSubmittedGrievances"><button className='thankyou'>Submitted grievances</button></Link>
                </div>

            </div>

        </div>
    )
}

export default Thankyou