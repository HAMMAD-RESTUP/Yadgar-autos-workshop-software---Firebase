import { configureStore } from '@reduxjs/toolkit';


import jobSurveyReducer from "../redux/reducers/insuranceslice";


export const store = configureStore({
  reducer: {
    jobSurvey: jobSurveyReducer,
 
  },
});
