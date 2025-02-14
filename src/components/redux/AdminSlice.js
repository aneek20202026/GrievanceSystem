// OfficialSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  admingrievances: [],
};

const sortGrievances = (grievances) => {
  return grievances.sort((a, b) => {
    // Sort by date descending
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    if (dateB - dateA !== 0) return dateB - dateA;
    
    // Sort by urgency (customize as needed)
    // const urgencyOrder = { high: 3, medium: 2, low: 1, "": 0 };
    // const urgencyA = urgencyOrder[a.aiAnalysis.urgency] || 0;
    // const urgencyB = urgencyOrder[b.aiAnalysis.urgency] || 0;
    // if (urgencyB - urgencyA !== 0) return urgencyB - urgencyA;
    

    // Sort by status (customize as needed)
    const statusOrder = { pending: 1, in_progress: 2, escalated: 3, resolved: 4 };
    const statusA = statusOrder[a.status] || 0;
    const statusB = statusOrder[b.status] || 0;
    return statusA - statusB;
  });
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAdmingrievances: (state, action) => {
      state.admingrievances = sortGrievances(action.payload);
    },
    addAdminGrievance: (state, action) => {
      state.admingrievances.push(action.payload);
      state.admingrievances = sortGrievances(action.payload)
    },
    updateAdminGrievance: (state, action) => {
      const updated = action.payload;
      const index = state.admingrievances.findIndex(g => g._id === updated._id);
      if (index !== -1) {
        state.admingrievances[index] = updated;
      }
      state.admingrievances = sortGrievances(action.payload)
    },
  },
});

export const { 
    setAdmingrievances, 
    addAdminGrievance, 
    updateAdminGrievance 
} = adminSlice.actions;
export default adminSlice.reducer;
