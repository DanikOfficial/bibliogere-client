import { api } from '../../features/api/apiSlice'
import { CreatePasswordRequest, UpdatePasswordRequest } from '../../features/definicoes/data/DefinicoesInterfaces'
import { AtualizarQuestoesRequest, LoginRequest, LoginResponse, Questoes, ValidarQuestoesRequest, ValidarQuestoesResponse } from '../../features/user/data/userInterfaces'
import { AuthState, setCredentials, setUserQuestoes } from '../../features/user/userSlice'


export const userApi = api.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<LoginResponse, LoginRequest>({
      query: (args: LoginRequest) => ({
        url: '/utilizador/entrar',
        method: 'POST',
        body: args,
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled

        if (data) {
          console.log("Login Response: " + JSON.stringify(data))
          const { codigo, nome, token, permissoes, questoes, isActive, isFirstLogin } = data

          const authState: AuthState = {
            codigo,
            currentUser: nome,
            token,
            role: permissoes[0],
            loggedIn: true,
            questoes,
            isActive,
            isFirstLogin
          }


          console.log("AuthState being dispatched:", authState) // Add this
          console.log("Questoes in authState:", authState.questoes) // Add this


          dispatch(setCredentials(authState))
          console.log('Login request successfully sent!')
        } else {
          console.warn('Login Request could not be sent!')
        }
      }

    }),

    alterarSenha: build.mutation({
      query: (request: UpdatePasswordRequest) => ({
        url: `/utilizadores/password/reset/${request.codigoUtilizador}`,
        method: 'PUT',
        body: request,
      }),
    }),

    ativarUtilizador: build.mutation({
      query: (request: CreatePasswordRequest) => ({
        url: `/admin/utilizadores/activate/${request.codigoUtilizador}`,
        body: request,
      }),
    }),

    validarQuestoes: build.mutation<ValidarQuestoesResponse, ValidarQuestoesRequest>({
      query: (validarQuestoesRequest: ValidarQuestoesRequest) => ({
        url: `/utilizadores/${validarQuestoesRequest.codigoUtilizador}/questoes/validate`,
        method: 'PUT',
        body: validarQuestoesRequest
      }),
    }),

    saveQuestoes: build.mutation<Questoes, AtualizarQuestoesRequest>({
      query: (alterarQuestoesRequest: AtualizarQuestoesRequest) => ({
        url: `/utilizadores/${alterarQuestoesRequest.codigoUtilizador}/questoes`,
        method: 'POST',
        body: alterarQuestoesRequest
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled 
        if (data) {
          console.log("Questoes updated successfully: " + JSON.stringify(data))
          // Optionally, you can dispatch an action to update the state with new questoes
          dispatch(setUserQuestoes(data));
        } else {
          console.warn('Failed to update questoes')
        }
      }
    }),
  })
})



export const {
  useLoginMutation,
  useAlterarSenhaMutation,
  useAtivarUtilizadorMutation,
  useValidarQuestoesMutation,
  useSaveQuestoesMutation
} = userApi