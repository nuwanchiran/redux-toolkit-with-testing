import axios from 'axios'
import * as apiActions from '../api'

const api = ( { dispatch } ) => next => async action =>
{
  if ( action.type !== apiActions.apiCallBegan.type ) return next( action )

  const { url, method, data, onStart, onSuccess, onError } = action.payload

  if ( onStart ) dispatch( { type: onStart } )
  next( action )

  try
  {
    const response = await axios.request( {
      baseURL: "http://localhost:9001/api", url, method, data,
    } )

    dispatch( apiActions.apiCallSuccess( response.data ) )
    if ( onSuccess ) dispatch( { type: onSuccess, payload: response.data } )
  } catch ( error )
  {
    dispatch( apiActions.apiCallFailed( error.message ) )
    if ( onError ) dispatch( { type: onError, payload: error.message } )
  }
}

export default api