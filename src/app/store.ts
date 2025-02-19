import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import { api } from '../features/api/apiSlice'
import userReducer from '../features/user/userSlice'
import obraReducer from '../features/obra/data/obraSlice'
import estanteReducer from '../features/estantes/data/estanteSlice'
import tipoEstanteReducer from '../features/tipoEstante/tipoEstanteSlice'
import emprestimoReducer from "../features/emprestimo/data/emprestimoSlice"

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    user: userReducer,
    obra: obraReducer,
    emprestimo: emprestimoReducer,
    estante: estanteReducer,
    tipoEstante: tipoEstanteReducer,
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
