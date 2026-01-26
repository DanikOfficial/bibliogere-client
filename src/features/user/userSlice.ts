import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'
import { Questoes } from './data/userInterfaces'

export interface AuthState {
  codigo?: number
  currentUser: string
  token: string
  loggedIn: boolean
  isFirstLogin: boolean
  isActive: boolean
  role: {
    codigo: number
    nome: string
  }
  questoes: Questoes
}

const loadAuthState = (): AuthState => {
  const storedAuth = sessionStorage.getItem("authState")
  return storedAuth
    ? JSON.parse(storedAuth)
    : {
      currentUser: '',
      token: '',
      loggedIn: false,
      isFirstLogin: false,
      isActive: false,
      role: {
        codigo: -1,
        nome: "",
      },
      questoes: {
        primeiraQuestao: "",
        segundaQuestao: "",
      }
    }
}

const userSlice = createSlice({
  name: 'user',
  initialState: loadAuthState(),
  reducers: {
    setCredentials: (state, action: PayloadAction<AuthState>) => {
      // Assign all fields from payload
      state.codigo = action.payload.codigo
      state.currentUser = action.payload.currentUser
      state.token = action.payload.token
      state.role = action.payload.role
      state.loggedIn = true // Always set to true when credentials are provided
      state.questoes = action.payload.questoes
      state.isActive = action.payload.isActive
      state.isFirstLogin = action.payload.isFirstLogin

      // Save to sessionStorage
      sessionStorage.setItem("authState", JSON.stringify(state))
    },
    setUserQuestoes: (state, { payload }: PayloadAction<Questoes>) => {
      state.questoes = payload

      // Update sessionStorage
      sessionStorage.setItem("authState", JSON.stringify(state))
    },
    signOut: (state) => {
      state.currentUser = ''
      state.token = ''
      state.role = { codigo: -1, nome: "" }
      state.loggedIn = false
      state.isActive = false
      state.isFirstLogin = false
      state.codigo = undefined
      state.questoes = { primeiraQuestao: "", segundaQuestao: "" }

      // Remove from sessionStorage
      sessionStorage.removeItem("authState")
    },
  },
})

export const { setCredentials, signOut, setUserQuestoes } = userSlice.actions

export default userSlice.reducer

// Simple selectors - no need for createSelector when just accessing properties
export const selectCurrentUser = (state: RootState) => state.user.currentUser

export const selectQuestoes = (state: RootState) => state.user.questoes

export const selectCurrentUserData = (state: RootState) => state.user

export const isLoggedIn = (state: RootState) => state.user.loggedIn

export const selectRole = (state: RootState) => state.user.role
