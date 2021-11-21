import { createSlice } from '@reduxjs/toolkit'

let lastId = 0

const slice = createSlice( {
  name: "users",
  initialState: [],
  reducers: {
    addUser: ( users, action ) =>
    {
      users.push( {
        id: ++lastId,
        name: action.payload.name
      } )
    },
    removeUser: ( users, action ) =>
    {
      const index = users.indexOf( user => user.id === action.payload.id )
      users.splice( index, 1 )
    }
  }
} )

export const { addUser, removeUser } = slice.actions
export default slice.reducer