import React, { SetStateAction } from 'react'
import { Modal } from 'bootstrap'
import { Estante } from '../../estantes/EstanteInterfaces'
import { Localizacao } from '../../localizacoes/localizacaoApi'
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
  MutationDefinition,
} from '@reduxjs/toolkit/dist/query'
import {
  FormErrorState,
  ObraRequest,
  ObraResponse,
} from '../data/ObraInterfaces'

export const displayModal = (ref: React.RefObject<HTMLDivElement>) => {
  console.log('I was here')

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

export const renderEstantes = (estantes: Estante[]): JSX.Element[] =>
  estantes.map((estante, index) => {
    const { codigo, nome } = estante

    return (
      <option key={index} value={codigo}>
        {nome}
      </option>
    )
  })

export const renderLocalizacoes = (
  localizacoes: Localizacao[]
): JSX.Element[] =>
  localizacoes.map((localizacao) => {
    const { codigo, designacao } = localizacao

    return (
      <option key={codigo} value={codigo}>
        {designacao}
      </option>
    )
  })

export const addNewObraLogic = async (
  request: ObraRequest,
  addObra: any,
  setError: React.Dispatch<SetStateAction<FormErrorState>>
) => {
  console.log(request)

  try {
    const newObra: ObraResponse = await addObra(request).unwrap()
    console.log(newObra)
  } catch (error) {
    const err: FormErrorState = { ...(error as FormErrorState) }
    setError(err)
  }
}
