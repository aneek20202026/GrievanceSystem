import { createSlice } from "@reduxjs/toolkit";

const citizenSlice = createSlice({
    name:"citizenslice",
    initialState:{
        grievances:[],
    },
    reducers:{
        setGrievances:(state, action) => {
            state.grievances = action.payload;
        }
    }
});

export const {setGrievances} = citizenSlice.actions;
export default citizenSlice.reducer;