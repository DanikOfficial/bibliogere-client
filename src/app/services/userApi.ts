import { api } from '../../features/api/baseApi'
import { BasePasswordRequest, CreatePasswordRequest, UpdatePasswordRequest } from '../../features/definicoes/data/DefinicoesInterfaces'
import { AtualizarQuestoesRequest, LoginRequest, LoginResponse, Questoes, ValidarQuestoesFromRecoveryRequest, ValidarQuestoesRequest, ValidarQuestoesResponse } from '../../features/user/data/userInterfaces'
import { atendenteAdded, atendenteDeleted, atendenteEnabled, atendentesAdded } from '../../features/user/management/data/atendenteSlice'
import { AtendenteRequest, AtendenteResponse } from '../../features/user/management/data/atendenteInterfaces'
import { AuthState, setCredentials, setUserQuestoes } from '../../features/user/userSlice'
import Logger from '../../utils/reusable/Logger'
import { FetchUserQuestoesByUsernameRequest, FetchUserQuestoesByUsernameResponse } from '../../features/user/recovery/data/interfaces'
import CreatePassword from '../../features/user/common/CreatePassword'

const logger = Logger.getInstance()

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
          const { codigo, nome, token, permissoes, questoes, isActive, firstLogin: isFirstLogin } = data

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

    createPassword: build.mutation<LoginResponse, CreatePasswordRequest>({
      query: (request: CreatePasswordRequest) => ({
        url: `/utilizadores/activate`,
        body: request,
        method: 'POST',
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled

          if (data) {
            const { codigo, username, nome, token, permissoes, questoes, isActive, firstLogin } = data

            const authState: AuthState = {
              codigo,
              currentUser: nome || username, // Use nome if available, fallback to username
              token,
              role: permissoes[0],
              loggedIn: true,
              questoes,
              isActive,
              isFirstLogin: firstLogin
            }

            dispatch(setCredentials(authState))
            console.log('CreatePassword request successfully sent!')
          }
        } catch (error) {
          console.error('CreatePassword failed:', error)
        }
      }
    }),

    ativarUtilizador: build.mutation<LoginResponse, CreatePasswordRequest>({
      query: (request: CreatePasswordRequest) => ({
        url: `/admin/utilizadores/activate`,
        body: request,
        method: 'POST',
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled

        if (data) {
          const { codigo, nome, token, permissoes, questoes, isActive, firstLogin: isFirstLogin } = data

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


          dispatch(setCredentials(authState))
          console.log('Login request successfully sent!')
        } else {
          console.warn('Login Request could not be sent!')
        }
      }
    }),

    validarQuestoes: build.mutation<ValidarQuestoesResponse, ValidarQuestoesRequest>({
      query: (validarQuestoesRequest: ValidarQuestoesRequest) => {
        const { codigoUtilizador, ...body } = validarQuestoesRequest;
        return {
          url: `/utilizadores/${codigoUtilizador}/questoes/validate`,
          method: 'PUT',
          body
        };
      },
    }),

    validateQuestoesFromRecovery: build.mutation<ValidarQuestoesResponse, ValidarQuestoesFromRecoveryRequest>({
      query: (validarQuestoesRequest: ValidarQuestoesFromRecoveryRequest) => ({
        url: `/recovery/utilizadores/questoes/validate`,
        method: 'POST',
        body: validarQuestoesRequest
      })
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
          dispatch(setUserQuestoes(data));
        } else {
          console.warn('Failed to update questoes')
        }
      }
    }),
    listAtendentes: build.query<AtendenteResponse[], void>({
      query: () => ({
        url: '/admin/utilizadores',
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled

        if (data) {
          console.log("Atendentes fetched successfully")
          dispatch(atendentesAdded(data))
        }
      }
    }),

    createAtendente: build.mutation<AtendenteResponse, AtendenteRequest>({
      query: (atendente: AtendenteRequest) => ({
        url: "/admin/utilizadores",
        method: "POST",
        body: atendente
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled

        if (data) {
          logger.log('Create Atendente request successfully sent!')
          dispatch(atendenteAdded(data))
        } else {
          logger.warn('Create Atendente Request could not be sent!')
        }
      }
    }),

    deleteAtendente: build.mutation<AtendenteResponse, number>({
      query: (codigoAtendente: number) => ({
        url: `/admin/utilizadores/${codigoAtendente}`,
        method: "DELETE"
      }),
      onQueryStarted: async (__dirname, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled

        if (data) {
          logger.log('Delete Atendente request successfully sent!')
          dispatch(atendenteDeleted(data.codigo))
        } else {
          logger.warn('Delete Atendente Request could not be sent!')
        }
      }
    }),

    disableAtendente: build.mutation<AtendenteResponse, number>({
      query: (codigoAtendente: number) => ({
        url: `/admin/utilizadores/disable/${codigoAtendente}`,
        method: "POST"
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled
        if (data) {
          logger.log('Disable Atendente request successfully sent!')
          dispatch(atendenteEnabled(data))
        } else {
          logger.warn('Disable Atendente Request could not be sent!')
        }
      }
    }),

    fetchUserQuestoes: build.mutation<FetchUserQuestoesByUsernameResponse, FetchUserQuestoesByUsernameRequest>({
      query: (request: FetchUserQuestoesByUsernameRequest) => ({
        url: `/recovery/utilizadores/questoes`,
        method: 'POST',
        body: request,
      })
    }),
  })
})



export const {
  useLoginMutation,
  useAlterarSenhaMutation,
  useAtivarUtilizadorMutation,
  useValidarQuestoesMutation,
  useSaveQuestoesMutation,
  useListAtendentesQuery,
  useCreateAtendenteMutation,
  useDeleteAtendenteMutation,
  useDisableAtendenteMutation,
  useFetchUserQuestoesMutation,
  useValidateQuestoesFromRecoveryMutation,
  useCreatePasswordMutation
} = userApi
