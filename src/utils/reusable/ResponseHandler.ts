import React, { SetStateAction } from 'react'
import { ErrorResponse } from '../../app/interfaces/ErrorResponse'

/**
 * Safely handles error responses from the API.
 * Works even if:
 *  - The API is offline
 *  - The error does not contain a "data" field
 *  - The error comes from Axios, Fetch, or a custom error type
 *
 * @param error Error returned from the API response (usually inside catch)
 * @param setUIErrorState React state setter used to update the UI error state
 */
export const handleErrorResponse = <E extends ErrorResponse<T>, T>(
  error: unknown, // 🔒 safer: the error from a catch block can be anything
  setUIErrorState: React.Dispatch<SetStateAction<T>>
): void => {

  /**
   * Many libraries (like Axios) wrap the backend error
   * inside `error.response.data`.
   *
   * Example structure when API is offline:
   *   error = { message: "Network Error" }
   *
   * Example structure when API returns HTTP error:
   *   error = { response: { data: {...} } }
   */

  // Try extracting data in the safest way possible
  const extractedData =
    (typeof error === "object" &&
      error !== null &&
      "response" in error &&
      (error as any).response?.data) ||
    // fallback: if your backend returns error.data
    (typeof error === "object" &&
      error !== null &&
      "data" in error &&
      (error as any).data) ||
    // final fallback for offline errors or unexpected errors
    null

  if (!extractedData) {
    // 🔥 When the API is OFF, you end up here
    // Create a generic fallback error object
    const fallbackError = {
      message: "Could not connect to server. Please try again later."
    }

    // Cast ensures T receives correct type without breaking your app
    setUIErrorState(fallbackError as T)
    return
  }

  // If everything is fine, update the UI with the extracted error
  setUIErrorState(extractedData as T)
}
