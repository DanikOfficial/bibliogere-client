import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'

export type AuthState = {
  currentUser: string
  token: string
  loggedIn: boolean
  role: string
}

const userSlice = createSlice({
  name: 'user',
  initialState: {
    currentUser: '',
    token: '',
    loggedIn: false,
    role: '',
  } as AuthState,
  reducers: {
    setCredentials: (
      state,
      { payload: { currentUser, token, role } }: PayloadAction<AuthState>
    ) => {
      state.currentUser = currentUser
      state.token = token
      state.role = role
      state.loggedIn = true
    },
    signOut: (state) => {
      state.currentUser = ''
      state.token = ''
      state.role = ''
      state.loggedIn = false
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
