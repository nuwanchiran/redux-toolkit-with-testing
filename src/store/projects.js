import { createSlice } from '@reduxjs/toolkit'

let lastId = 0

const slice = createSlice( {
  name: "projects",
  initialState: [],
  reducers: {
    addProject: ( projects, { payload } ) =>
    {
      projects.push( {
        id: ++lastId,
        name: payload.name
      } )
    },
    removeProject: ( projects, { payload } ) =>
    {
      const index = projects.indexOf( project => project.id === payload.id )
      projects.splice( index, 1 )
    }
  }
} )

export const { addProject, removeProject } = slice.actions
export default slice.reducer