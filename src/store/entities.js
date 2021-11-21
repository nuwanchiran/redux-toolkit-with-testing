import { combineReducers } from '@reduxjs/toolkit'
import bugReducer from './bugs'
import projectReducer from './projects'
import userReducer from './users'

// second level store
export default combineReducers( {
  bugs: bugReducer,
  projects: projectReducer,
  users: userReducer
} )