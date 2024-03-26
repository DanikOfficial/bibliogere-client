import React, { SetStateAction } from 'react'
import { Modal } from 'bootstrap'
import { Localizacao } from '../../localizacoes/localizacaoApi'
import type { ErrorResponse } from '../../../app/interfaces/ErrorResponse'
import {
  ObraFormErrorState,
  ObraRequest,
  ObraEntity,
  ObraForm,
} from '../data/ObraInterfaces'
import { handleErrorResponse } from '../../../utils/reusable/ResponseHandler'
import { ActionCreatorWithPayload, AnyAction, Dispatch } from '@reduxjs/toolkit'
import type Option from '../../../app/interfaces/Option'

export const displayModal = (ref: React.RefObject<HTMLDivElement>) => {
  const modalEl = ref.current as HTMLDivElement
  const bsModal = new Modal(modalEl, {
    backdrop: 'static',
    keyboard: false,
  })

  bsModal.show()
}

export const hideModal = (ref: React.RefObject<HTMLDivElement>) => {
  const modalEl = ref.current as HTMLDivElement
  const bsModal = Modal.getInstance(modalEl)

  bsModal?.hide()
}

export const renderLocalizacoes = (localizacoes: Localizacao[]) =>
  localizacoes.map(
    (localizacao) =>
      ({
        value: localizacao.codigo,
        label: localizacao.designacao,
      } as Option)
  )

export const addNewObraLogic = async (
  dispatch: Dispatch<AnyAction>,
  clearFormFields: () => void,
  addedObra: ActionCreatorWithPayload<ObraEntity, string>,
  obraForm: ObraForm,
  addObra: any,
  setUIError: React.Dispatch<SetStateAction<ObraFormErrorState>>
) => {
  const obraType = obraForm.type.value as string

  const novaObraRequest: ObraRequest = {
    codigoEstante: obraForm.estante.value as number,
    codigoLocalizacao: obraForm.localizacao.value as number,
    obra: {
      ano: obraForm.ano,
      autor: obraForm.autor,
      titulo: obraForm.titulo,
      type: obraType,
      quantidadeInicial: obraForm.quantidadeInicial,
      ...(obraForm.tutor && { tutor: obraForm.tutor }),
      ...(obraForm.editora && { editora: obraForm.editora }),
    },
  }

  try {
    const newObra: ObraEntity = await addObra(novaObraRequest).unwrap()
    dispatch(addedObra(newObra))
    // TODO: Handle the clearing of state, clearing the Obra fields
  } catch (error) {
    console.log(error)
    handleErrorResponse(error as ErrorResponse<ObraFormErrorState>, setUIError)
  }
}
