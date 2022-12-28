import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import { api } from '../features/api/apiSlice'
import userReducer from '../features/user/userSlice'
import obraReducer from '../features/obra/data/obraSlice'
import estanteReducer from '../features/estantes/estanteSlice'

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    user: userReducer,
    obra: obraReducer,
    estante: estanteReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
