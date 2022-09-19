import React, { SetStateAction } from 'react'
import { Modal } from 'bootstrap'
import { Estante } from '../../estantes/data/EstanteInterfaces'
import { Localizacao } from '../../localizacoes/localizacaoApi'
import type { ErrorResponse } from '../../../app/interfaces/ErrorResponse'
import { FormErrorState, ObraRequest, ObraEntity } from '../data/ObraInterfaces'
import { handleErrorResponse } from '../../../utils/reusable/ResponseHandler'
import { ActionCreatorWithPayload } from '@reduxjs/toolkit'
import type { Option } from '../../../app/interfaces/Option'

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

export const renderEstantes = (estantes: Estante[]) => {
  const renderedEstantes = estantes.map(
    (estante) => ({ value: estante.codigo, label: estante.nome } as Option)
  )

  renderedEstantes.unshift({
    value: '',
    label: 'Estante onde a obra ficará!',
  })

  return renderedEstantes
}

export const renderLocalizacoes = (localizacoes: Localizacao[]) => {
  const renderedLocalizacoes = localizacoes.map(
    (localizacao) =>
      ({
        value: localizacao.codigo,
        label: localizacao.designacao,
      } as Option)
  )

  renderedLocalizacoes.unshift({
    value: '',
    label: 'Localização onde a obra ficará!',
  })

  return renderedLocalizacoes
}

export const addNewObraLogic = async (
  dispatch: any,
  clearFormFields: () => void,
  addedObra: ActionCreatorWithPayload<ObraEntity, string>,
  request: ObraRequest,
  addObra: any,
  setError: React.Dispatch<SetStateAction<FormErrorState>>
) => {
  try {
    const newObra: ObraEntity = await addObra(request).unwrap()
    dispatch(addedObra(newObra))
    console.info(newObra)

    // clearFormFields()
  } catch (error) {
    console.log(error)
    handleErrorResponse(error as ErrorResponse, setError)
  }
}
