import configureStore from './store'
import { loadBugs, resolveBug, addUserToBug } from './store/bugs'

const store = configureStore()
store.dispatch( loadBugs() )

setTimeout( () =>
{
  store.dispatch( resolveBug( 4 ) )
}, 2000 )
setTimeout( () =>
{
  store.dispatch( addUserToBug( 3, 10 ) )
}, 4000 )