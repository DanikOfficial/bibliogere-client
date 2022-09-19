import { api } from '../../features/api/apiSlice'
import axios from 'axios'

export interface ErrorState {
  error: true | false
  message: string | null
  errors: {
    username: string | null
  }
}

export interface LoginRequest {
  username: string
  password: string
}

export interface UserData {
  nome: string
  username: string
  token: string
  permissoes: []
}

interface ApiResponse {
  status: number
  error: boolean
  message: string
  data: UserData | Error
}

export const userApi = api.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation({
      queryFn: async (args: LoginRequest) => {
        const request = await axios.post('/api/v1/utilizador/entrar', args)
        const data = request.data

        return data.error ? { error: data } : data
      },
    }),
  }),
})

export const { useLoginMutation } = userApi
