import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { setGrievances } from '../components/redux/CitizenSlice';
import { GRIEVANCE_API_END_POINT } from '.././utils/constant';

function useVerifyOTP() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const verifyOTP = async (otp) => {
    try {
      const res = await axios.post(
        `${GRIEVANCE_API_END_POINT}/getcitizengrievances/verifyOTP`,
        { otp },
        { 
          headers: { "Content-Type": "application/json" },
          withCredentials: true 
        }
      );
      if (res.data.success) {
        dispatch(setGrievances(res.data.grievances));
        navigate('/citizendashboard');
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Verification Failed");
    }
  };

  return verifyOTP;
}

export default useVerifyOTP;
