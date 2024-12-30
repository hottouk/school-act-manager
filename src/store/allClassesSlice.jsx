import { createSlice } from "@reduxjs/toolkit"

let allClasses = createSlice({
    name: 'allSubjClasses',
    initialState: [],
    reducers: {
        setAllSubjClasses(state, action) {
            const allClasses = action.payload
            return state = allClasses
        },
    }
})

export const { setAllSubjClasses } = allClasses.actions
export default allClasses