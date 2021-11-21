const func = ( { dispatch, getState } ) => next => action =>
{
  return typeof action === "function" ? action( dispatch, getState ) : next( action );
}

export default func