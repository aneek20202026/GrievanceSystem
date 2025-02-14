import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { setOfficialgrievances } from '../components/redux/OfficialSlice';
import { loginSuccess } from '../components/redux/AuthSlice'; // import the new action
import { USER_API_END_POINT } from '../utils/constant';
import { setAdmingrievances } from '../components/redux/AdminSlice';

function useVerifyUserOTP() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const VerifyUserOTP = async (OTP, role) => {
    let endpoint = (role === "admin")
      ? `${USER_API_END_POINT}/loginadmin`
      : `${USER_API_END_POINT}/loginofficial`;

    try {
      let res = await axios.post(`${endpoint}/verify`, { otp: OTP }, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      if (res.data.success) {
        if (role === 'official') {
          // Dispatch loginSuccess to store official details (assuming res.data includes official info)
          dispatch(loginSuccess(res.data)); // ensure your backend sends official info
          // Fetch grievances for the official
          res = await axios.get(`${endpoint}/verify/getgrievances`, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          });
          if (res.data.success) {
            dispatch(setOfficialgrievances(res.data.grievances));
            navigate('/officialdashboard');
            toast.success(res.data.message);
          }
        } else {
           // Dispatch loginSuccess to store official details (assuming res.data includes official info)
           dispatch(loginSuccess(res.data)); // ensure your backend sends official info
           // Fetch grievances for the official
           res = await axios.get(`${endpoint}/verify/getadmingrievances`, {
             headers: { "Content-Type": "application/json" },
             withCredentials: true,
           });
           if (res.data.success) {
             dispatch(setAdmingrievances(res.data.grievances));
             navigate('/adminDashboard');
             toast.success(res.data.message);
           }
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Verification Failed");
    }
  };

  return VerifyUserOTP;
}

export default useVerifyUserOTP;
