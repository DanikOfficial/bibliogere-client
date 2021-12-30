import { apiSlice } from '../../features/api/apiSlice'
import axios from 'axios'
import { BaseQueryApi } from '@reduxjs/toolkit/dist/query/baseQueryTypes'
import { createApi, FetchArgs } from '@reduxjs/toolkit/dist/query'

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

export interface Error {
  status: number
  campos?: {
    username: string
  }
}

interface ApiResponse {
  status: number
  error: boolean
  message: string
  data: UserData | Error
}

export const userApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation({
      queryFn: async (args: LoginRequest, api, extraOptions, baseQuery) => {
        const request = await axios.post('/api/v1/utilizador/entrar', args)
        const data = request.data

        console.log(data)

        return data.error ? { error: data } : data
      },
    }),
  }),
})

export const { useLoginMutation } = userApi
