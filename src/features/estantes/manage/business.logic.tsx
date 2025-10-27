import { AnyAction, Dispatch } from '@reduxjs/toolkit'
import { estanteSelected, estanteUpdateCanceled } from '../data/estanteSlice'
import {
  EstanteEntity,
  EstanteForm,
  EstanteFormErrorResponse,
  EstanteRequest,
  UpdateEstanteRequest,
} from '../data/EstanteInterfaces'
import { SetStateAction } from 'react'
import { handleErrorResponse } from '../../../utils/reusable/ResponseHandler'
import { ErrorResponse } from '../../../app/interfaces/ErrorResponse'

/**
 *
 * @param estante  will be parsed to Request object
 * @param createEstante sends request to the server, this cannot be used as type due to redux toolkit restrictions
 * @param setUIError displays error in the UI
 * @param onCreateEstanteSuccess callback that will be triggered when successfully created estante
 */
export const sendCreateEstanteRequest = async (
  estante: EstanteEntity,
  createEstante: any,
  setUIError: React.Dispatch<SetStateAction<EstanteFormErrorResponse>>,
  onCreateEstanteSuccess: (isCreated: Boolean) => void
) => {
  try {
    const createEstanteRequest: EstanteRequest = {
      nome: estante.nome,
      tipoEstante: estante.tipoEstante,
    }
    await createEstante(createEstanteRequest).unwrap()
    onCreateEstanteSuccess(true)
  } catch (error: unknown) {
    handleErrorResponse(
      error as ErrorResponse<EstanteFormErrorResponse>,
      setUIError
    )
  }
}

export const sendUpdateEstanteRequest = async (
  estante: EstanteEntity,
  updateEstante: any,
  setUIError: React.Dispatch<SetStateAction<EstanteFormErrorResponse>>,
  dispatch: Dispatch<AnyAction>,
  onUpdateEstanteSuccess: (isUpdated: Boolean) => void
) => {
  try {
    const updateEstanteRequest: UpdateEstanteRequest = {
      codigoEstante: estante.codigo,
      data: {
        nome: estante.nome,
        tipoEstante: estante.tipoEstante,
      },
    }
    await updateEstante(updateEstanteRequest)
    onUpdateEstanteSuccess(true)
    dispatch(estanteUpdateCanceled())
  } catch (error: unknown) {
    handleErrorResponse(
      error as ErrorResponse<EstanteFormErrorResponse>,
      setUIError
    )
  }
}

export const sendDeleteEstanteRequest = async (
  codigoEstante: number,
  setUIError: React.Dispatch<SetStateAction<EstanteFormErrorResponse>>,
  deleteEstante: any
) => {
  try {
    await deleteEstante(codigoEstante)
  } catch (error) {
    handleErrorResponse(
      error as ErrorResponse<EstanteFormErrorResponse>,
      setUIError
    )
  }
}

export const setSelectedEstante = (
  dispatch: Dispatch<AnyAction>,
  estante: EstanteForm
) => dispatch(estanteSelected(estante))
