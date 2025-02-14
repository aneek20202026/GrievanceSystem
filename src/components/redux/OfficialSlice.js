import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  officialgrievances: [],
};

const sortGrievances = (grievances) => {
  return grievances.sort((a, b) => {
    // Sort by date descending
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    if (dateB - dateA !== 0) return dateB - dateA;
    
    // Sort by urgency (customize as needed)
    // const urgencyOrder = { high: 3, medium: 2, low: 1, "": 0 };
    const urgencyA = a.aiAnalysis.urgency || 0;
    const urgencyB = b.aiAnalysis.urgency || 0;
    if (urgencyB - urgencyA !== 0) return urgencyB - urgencyA;
    

    // Sort by status (customize as needed)
    const statusOrder = { pending: 1, in_progress: 2, escalated: 3, resolved: 4 };
    const statusA = statusOrder[a.status] || 0;
    const statusB = statusOrder[b.status] || 0;
    return statusA - statusB;
  });
};

const officialSlice = createSlice({
  name: "official",
  initialState,
  reducers: {
    setOfficialgrievances: (state, action) => {
      state.officialgrievances = sortGrievances(action.payload);
    },
    addOfficialGrievance: (state, action) => {
      state.officialgrievances.push(action.payload);
      state.officialgrievances = sortGrievances(state.officialgrievances);
    },
    updateOfficialGrievance: (state, action) => {
      const updated = action.payload;
      const index = state.officialgrievances.findIndex(g => g._id === updated._id);
      if (index !== -1) {
        state.officialgrievances[index] = updated;
      }
      state.officialgrievances = sortGrievances(state.officialgrievances);
    },
  },
});

export const { 
  setOfficialgrievances, 
  addOfficialGrievance, 
  updateOfficialGrievance 
} = officialSlice.actions;
export default officialSlice.reducer;
