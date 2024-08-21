import { createSlice } from "@reduxjs/toolkit";

const joyrideSlice = createSlice({
  name: "joyrideSlice",
  initialState: {
    run: false,
    stepIndex: 0,
    steps: [],
    tourActive: false,
  },
  reducers: {
    setRun(state, action) {
      state.run = action.payload;
    },
    setStepIndex(state, action) {
      state.stepIndex = action.payload;
    },
    setSteps(state, action) {
      state.steps = action.payload;
    },
    setStepsAdd(state, action) {
      return [...state.steps, ...action.payload];
    },
    setStepIndexNext(state, _) {
      state.stepIndex += 1;
    },
    setTourActive(state, action) {
        state.tourActive = action.payload
    }
  },
});

export const { setRun, setStepIndex, setSteps, setStepsAdd, setStepIndexNext, setTourActive } =
  joyrideSlice.actions;
export const joyrideSliceReducer = joyrideSlice.reducer;
