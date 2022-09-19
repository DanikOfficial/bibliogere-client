import React, { SetStateAction } from 'react'
import { ErrorResponse } from '../../app/interfaces/ErrorResponse'

export const handleErrorResponse = <E extends ErrorResponse, T>(
  error: E,
  setState: React.Dispatch<SetStateAction<T>>
) => {
  const { data } = error
  setState(data as T)
}
