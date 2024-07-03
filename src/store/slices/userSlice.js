import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: 'userSlice',
    initialState: {},
    reducers: {
        updateUser(state, action) {
            return {...state, ...action.payload};
        }
    }
})

export const {updateUser} = userSlice.actions
export const userSliceReducer = userSlice.reducer