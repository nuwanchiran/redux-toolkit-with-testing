import { combineReducers } from '@reduxjs/toolkit'
import entityReducer from './entities'

// top level store
export default combineReducers( {
  entities: entityReducer,
} )