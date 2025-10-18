import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'
import { Questoes } from './data/userInterfaces'


export interface AuthState {
  codigo?: number,
  currentUser: string
  token: string
  loggedIn: boolean
  isFirstLogin: boolean
  isActive: boolean
  role: {
    codigo: number
    nome: string
  },
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
    setCredentials: (
      state,
      { payload: { currentUser, token, role, codigo, questoes } }: PayloadAction<AuthState>
    ) => {
      state.currentUser = currentUser
      state.token = token
      state.role = role
      state.loggedIn = true
      state.codigo = codigo
      state.questoes = questoes

      // Save to sessionStorage
      sessionStorage.setItem("authState", JSON.stringify(state))
    },
    setUserQuestoes: (
      state,
      { payload }: PayloadAction<Questoes>
    ) => {
      state.questoes = payload

      // Update sessionStorage
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

export const { setCredentials, signOut, setUserQuestoes } = userSlice.actions

export default userSlice.reducer

export const selectCurrentUser = createSelector(
  (state: RootState) => state.user,
  (authState) => authState.currentUser
)

export const selectQuestoes = createSelector((state: RootState) => state.user,
  (authState) => authState.questoes
)

export const selectCurrentUserData = createSelector(
  (state: RootState) => state.user,
  (authState) => authState
)

export const isLoggedIn = createSelector(
  (state: RootState) => state.user,
  (authState) => authState.loggedIn
)

export const selectRole = createSelector(
  (state: RootState) => state.user,
  (authState) => authState.role
)
