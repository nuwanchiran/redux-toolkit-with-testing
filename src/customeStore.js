export default function Store( reducer )
{
  // local state
  let state

  // subscribers list
  let subscribers = []

  // getter for state
  function getState() { return state }

  // do the action
  function dispatch( action )
  {
    action.type ?
      state = reducer( state, action ) :
      console.error( "action must have a type" )

    subscribers.forEach( ( i ) => i() )
  }

  // add functions to subscriber list
  function subscribe( listener )
  {
    subscribers.push( listener )

    // return a function to remove the subscribe function 
    // from the subscribers list
    return () =>
    {
      subscribers = subscribers.filter( ( i ) => i !== listener )
    };
  }

  // make public methods
  return {
    getState,
    dispatch,
    subscribe
  }
}