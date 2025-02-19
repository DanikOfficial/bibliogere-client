import React, { SetStateAction } from 'react'
import { AnyAction, Dispatch } from '@reduxjs/toolkit'
import type { ErrorResponse } from '../../../app/interfaces/ErrorResponse'
import {
  ObraFormErrorResponse,
  ObraRequest,
  ObraForm,
  UpdateObraRequest,
} from '../data/ObraInterfaces'
import { handleErrorResponse } from '../../../utils/reusable/ResponseHandler'
import { obraUpdateCanceled } from '../data/obraSlice'
import obraApi from '../data/obraApi'

export const sendCreateObraRequest = async (
  obra: ObraForm,
  createObra: any,
  setUIError: React.Dispatch<SetStateAction<ObraFormErrorResponse>>,
  onCreateObraSuccess: (isCreated: Boolean) => void
) => {
  const novaObraRequest: ObraRequest = {
    obra: {
      codigoEstante: obra.estante.value as number,
    codigoLocalizacao: obra.localizacao.value as number,
      ano: obra.ano,
      autor: obra.autor,
      titulo: obra.titulo,
      type: obra.type.value as string,
      quantidadeInicial: obra.quantidadeInicial,
      ...(obra.tutor && { tutor: obra.tutor }),
      ...(obra.editora && { editora: obra.editora }),
    },
  }
  let isSuccess = false

  try {
    await createObra(novaObraRequest).unwrap()
    isSuccess = true
  } catch (error) {
    handleErrorResponse(
      error as ErrorResponse<ObraFormErrorResponse>,
      setUIError
    )
  }
  onCreateObraSuccess(isSuccess)
}

export const sendUpdateObraRequest = async (
  obra: ObraForm,
  updateObra: any,
  setUIError: React.Dispatch<SetStateAction<ObraFormErrorResponse>>,
  dispatch: Dispatch<AnyAction>,
  onUpdateObraSuccess: (isUpdate: Boolean) => void
) => {
  const obraType = obra.type.value as string
  let isSuccess: boolean = false

  const updateObraRequest: UpdateObraRequest = {
    codigoEstante: obra.estante.value as number,
    codigoLocalizacao: obra.localizacao.value as number,
    codigoObra: obra.codigo as number,
    data: {
      type: obraType,
      ...(obra.ano !== '' && { ano: Number(obra.ano) }),
      ...(obra.autor !== '' && { autor: obra.autor }),
      ...(obra.titulo !== '' && { titulo: obra.titulo }),
      ...(obra.tutor !== '' && obra.tutor && { tutor: obra.tutor }),
      ...(obra.editora !== '' && obra.editora && { editora: obra.editora }),
    },
  }

  try {
    await updateObra(updateObraRequest).unwrap()
    isSuccess = true
    dispatch(obraUpdateCanceled())
  } catch (error) {
    handleErrorResponse(
      error as ErrorResponse<ObraFormErrorResponse>,
      setUIError
    )
  }
  onUpdateObraSuccess(isSuccess)
}

export const sendDeleteObraRequest = async (
  codigoObra: number,
  setUIError: React.Dispatch<SetStateAction<ObraFormErrorResponse>>,
  deleteObra: any
) => {
  try {
    await deleteObra(codigoObra).unwrap()
  } catch (error) {
    handleErrorResponse(
      error as ErrorResponse<ObraFormErrorResponse>,
      setUIError
    )
  }
}

export const sendGetObraRequest = (
  dispatch: any,
  codigoObra: number,
  onSuccess: (isSuccess: boolean) => void
) => {
  dispatch(
    obraApi.endpoints.getObra.initiate(codigoObra, { forceRefetch: true })
  ).then((result: any) => onSuccess(true))
}
