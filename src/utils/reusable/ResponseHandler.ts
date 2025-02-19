import React, { SetStateAction } from 'react'
import { ErrorResponse } from '../../app/interfaces/ErrorResponse'

/**
 * Handles error responses from the API
 * @param error Error returned from the API response, this is usually caught on the catch block
 * @param setUIErrorState Used to modify the error state in the UI
 */
export const handleErrorResponse = <E extends ErrorResponse<T>, T>(
  error: E,
  setUIErrorState: React.Dispatch<SetStateAction<T>>
): void => {
  const { data } = error

  console.log("Error Data ", data )

  setUIErrorState(data as T)
}
