import { createSlice } from '@reduxjs/toolkit'
import moment from 'moment'
import { createSelector } from 'reselect'
import { apiCallBegan } from './api'

const slice = createSlice( {

  name: "bugs",
  initialState: {
    list: [],
    loading: false,
    lastFetch: null
  },

  reducers: {
    bugRequested: ( bugs, action ) =>
    {
      bugs.loading = true
    },

    bugRequestedFailed: ( bugs, action ) =>
    {
      bugs.loading = false
    },

    bugReceived: ( bugs, { payload } ) =>
    {
      bugs.list = payload
      bugs.loading = false
      bugs.lastFetch = Date.now()
    },

    bugAdded: ( bugs, { payload } ) =>
    {
      bugs.list.push( payload )
    },

    bugResolved: ( bugs, { payload } ) =>
    {
      const index = getIndex( bugs["list"], payload, "id" )
      bugs.list[index].resolved = true
    },

    bugRemoved: ( bugs, { payload } ) =>
    {
      const index = getIndex( bugs["list"], payload, "id" )
      bugs.list.splice( index, 1 )
    },

    bugAssigned: ( bugs, { payload } ) =>
    {
      const index = getIndex( bugs["list"], payload, "id" )
      bugs.list[index].userId = payload.userId
    }

  }
} )

const { bugAdded, bugResolved, bugAssigned, bugReceived, bugRequested, bugRequestedFailed } = slice.actions

const getIndex = ( state, payload, key ) => state.findIndex( i => i[key] === payload[key] )

// selectors
export const bugUnresolvedSelector = createSelector(
  state => state.entities.bugs,
  bugs => bugs.list.filter( bug => !bug.resolved )
)

export const bugAssignedSelector = createSelector(
  state => state.entities.bugs,
  bugs => bugs.list.filter( bug => bug.userId )
)

export const bugAssignedToUser = userId => createSelector(
  state => state.entities.bugs,
  bugs => bugs.list.filter( bug => bug.userId === userId )
)

// action creators
const URL = '/bugs'

// add bugs
export const addBug = bug => apiCallBegan(
  {
    url: URL,
    method: 'post',
    data: bug,
    onSuccess: bugAdded.type,
  }
)

// load bugs function
export const loadBugs = () => ( dispatch, getState ) =>
{
  const { lastFetch } = getState().entities.bugs

  const minute = moment().diff( moment( lastFetch ), 'minutes' )

  if ( minute < 10 ) return

  return dispatch( apiCallBegan( {
    url: URL,
    onStart: bugRequested.type,
    onSuccess: bugReceived.type,
    onError: bugRequestedFailed.type
  } ) )
}

// resolve bug request
export const resolveBug = id => apiCallBegan( {
  url: URL + '/' + id,
  method: 'patch',
  data: { resolved: true },
  onSuccess: bugResolved.type,
} )

// add user to bug request
export const addUserToBug = ( id, userId ) => apiCallBegan( {
  url: URL + '/' + id,
  method: 'patch',
  data: { userId },
  onSuccess: bugAssigned.type
} )


export default slice.reducer