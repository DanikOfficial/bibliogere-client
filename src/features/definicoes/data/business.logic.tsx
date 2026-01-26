import { SetStateAction } from "react"
import { ErrorResponse } from "../../../app/interfaces/ErrorResponse"
import { handleErrorResponse } from "../../../utils/reusable/ResponseHandler"
import { UpdatePasswordErrorResponse, UpdatePasswordRequest } from "./DefinicoesInterfaces"
import { AlterarQuestoesErroResponse, AtualizarQuestoesRequest, ValidarQuestoesErrorResponse, ValidarQuestoesRequest, ValidarQuestoesResponse } from "../../user/data/userInterfaces"

export const sendUpdatePasswordRequeet = async (
  updatePasswordRequest: UpdatePasswordRequest,
  updatePassword: any,
  setUiError: React.Dispatch<SetStateAction<UpdatePasswordErrorResponse>>,
  onUpdatePasswordSuccess: (isCreated: Boolean) => void
) => {
  let isCreated = false

  try {
    await updatePassword(updatePasswordRequest).unwrap()
    isCreated = true
  } catch (error: unknown) {
    handleErrorResponse(
      error as ErrorResponse<UpdatePasswordErrorResponse>,
      setUiError
    )
  }
  onUpdatePasswordSuccess(isCreated)
}

/**
 * Sends a request to validate questões (questions) and handles the response or errors.
 *
 * @param validarQuestoesRequest - The request payload containing the questions to be validated
 * @param validarQuestoes - The API function/mutation hook that performs the validation request
 * @param setUiError - State setter function to update UI error state when validation fails
 * @param onValidarQuestoesSuccess - Callback function invoked when validation succeeds. Receives a response object containing:
 *   - valid: overall validation status (true if both questions are correct)
 *   - message: "VÁLIDO" or "INVÁLIDO"
 *   - firstQuestionValid: validation status of the first security question
 *   - secondQuestionValid: validation status of the second security question
 *   - firstQuestionMessage: detailed message for first question validation result
 *   - secondQuestionMessage: detailed message for second question validation result
 */
export const sendValidarQuestoesRequest = async (
  validarQuestoesRequest: ValidarQuestoesRequest,
  validarQuestoes: any,
  setUiError: React.Dispatch<SetStateAction<ValidarQuestoesErrorResponse>>,
  onValidarQuestoesSuccess: (validarQuestoesResponse: ValidarQuestoesResponse) => void
) => {

  try {
    const response: ValidarQuestoesResponse = await validarQuestoes(validarQuestoesRequest).unwrap()
    onValidarQuestoesSuccess(response)

  } catch (wrappedError: unknown) {
    const error = wrappedError as ErrorResponse<ValidarQuestoesErrorResponse>
    handleErrorResponse<ErrorResponse<ValidarQuestoesErrorResponse>, ValidarQuestoesErrorResponse>(error, setUiError)
  }
}

export const sendUpdateQuestoesRequest = async (
  atualizarQuestoesRequest: AtualizarQuestoesRequest,
  atualizarQuestoes: any,
  setUiError: React.Dispatch<SetStateAction<AlterarQuestoesErroResponse>>,
  onAtualizarQuestoesSuccess: (isSuccess: Boolean) => void
) => {

  try {
    await atualizarQuestoes(atualizarQuestoesRequest).unwrap()
    onAtualizarQuestoesSuccess(true)
  } catch (error) {
    handleErrorResponse(error as ErrorResponse<AlterarQuestoesErroResponse>, setUiError);
  }
}
