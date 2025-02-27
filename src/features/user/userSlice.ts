import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'

export type AuthState = {
  currentUser: string
  token: string
  loggedIn: boolean
  role: {
    codigo: number
    nome: string
  }
}

// Load authentication state from sessionStorage
const loadAuthState = (): AuthState => {
  const storedAuth = sessionStorage.getItem("authState")
  return storedAuth
    ? JSON.parse(storedAuth)
    : {
        currentUser: '',
        token: '',
        loggedIn: false,
        role: {
          codigo: -1,
          nome: "",
        },
      }
}

const userSlice = createSlice({
  name: 'user',
  initialState: loadAuthState(),
  reducers: {
    setCredentials: (
      state,
      { payload: { currentUser, token, role } }: PayloadAction<AuthState>
    ) => {
      state.currentUser = currentUser
      state.token = token
      state.role = role
      state.loggedIn = true

      // Save to sessionStorage
      sessionStorage.setItem("authState", JSON.stringify(state))
    },
    signOut: (state) => {
      state.currentUser = ''
      state.token = ''
      state.role.codigo = -1
      state.role.nome = ""
      state.loggedIn = false

      // Remove from sessionStorage
      sessionStorage.removeItem("authState")
    },
  },
})

export const { setCredentials, signOut } = userSlice.actions

export default userSlice.reducer

export const selectCurrentUser = createSelector(
  (state: RootState) => state.user as AuthState,
  (authState) => authState.currentUser
)

export const isLoggedIn = createSelector(
  (state: RootState) => state.user as AuthState,
  (authState) => authState.loggedIn
)

export const selectRole = createSelector(
  (state: RootState) => state.user as AuthState,
  (authState) => authState.role
)
