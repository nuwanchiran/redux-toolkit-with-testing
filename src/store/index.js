import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import reducer from './reducers'
import logger from './middleware/logger'
import api from './middleware/api';

// go through middleware before going to reducer.
export default () => configureStore( {
  reducer,
  middleware: [
    ...getDefaultMiddleware(),
    api,
    logger
  ]
} )
