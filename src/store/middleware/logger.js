const logger = store => next => action =>
{
  return action.type === "error" ?
    console.error( action.payload.message ) :
    next( action )
}

export default logger