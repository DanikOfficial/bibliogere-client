import React, { SetStateAction } from 'react'
import {
  CreateEmprestimoRequest,
  EmprestimoFormErrorResponse,
} from './EmprestimoInterfaces'
import { handleErrorResponse } from '../../../utils/reusable/ResponseHandler'
import { ErrorResponse } from '../../../app/interfaces/ErrorResponse'

export const sendCreateEmprestimoRequest = async (
  emprestimoRequest: CreateEmprestimoRequest,
  createEmprestimo: any,
  setUiError: React.Dispatch<SetStateAction<EmprestimoFormErrorResponse>>,
  onCreateEmprestimoSuccess: (isCreated: Boolean) => void
) => {
  let isCreated = false

  try {
    await createEmprestimo(emprestimoRequest).unwrap()
    isCreated = true
  } catch (error: unknown) {
    handleErrorResponse(
      error as ErrorResponse<EmprestimoFormErrorResponse>,
      setUiError
    )
  }
  onCreateEmprestimoSuccess(isCreated)
}

export const sendDevolverEmprestimoRequest = async (
  codigoEmprestimo: number,
  devolverEmprestimo: any,
  setUiError: React.Dispatch<SetStateAction<EmprestimoFormErrorResponse>>,
  onSuccess: (isSuccess: Boolean) => void
) => {
  let isSuccess = false

  try {
    await devolverEmprestimo(codigoEmprestimo).unwrap()
    isSuccess = true
  } catch (error: unknown) {
    handleErrorResponse(
      error as ErrorResponse<EmprestimoFormErrorResponse>,
      setUiError
    )
  }
  onSuccess(isSuccess)
}
