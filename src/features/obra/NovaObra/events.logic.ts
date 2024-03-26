import React, { SetStateAction, Dispatch, RefObject } from 'react'
import type Option from '../../../app/interfaces/Option'
import {
  ObraFormErrorState,
  ObraRequest,
  ObraForm,
} from '../data/ObraInterfaces'
import { initialErrorState, initialObraFormState } from './NovaObraModalState'

/**
 *
 * @param setFormState  a function to mutate the useState of request payload
 * @param setState a function to mutate the useState of the UI
 * @param ref a ref to the current selected obra type
 * @param formState the current object of the request payload
 * @returns
 */
export const onChangeTipoObra = (
  setFormState: Dispatch<SetStateAction<ObraForm>>,
  ref: RefObject<HTMLInputElement>,
  selectedTipo: Option,
  formState: ObraForm
) => {
  // gets the property of the old type of entity which is dynamic
  const property = ref.current as HTMLInputElement

  if (property) {
    const name: string = property.name

    // checks wether there's a property for the old entity, if so, then deletes the property, this code will need refactoring
    if (name) {
      delete formState[name]
    }
  }

  setFormState((prev) => ({ ...prev, type: selectedTipo }))
}

/**
 *
 * @param setFormState
 * @param setFormStateRequest
 * @param setError
 */
export const resetFormState = (
  setFormState: React.Dispatch<React.SetStateAction<ObraForm>>,
  setFormStateRequest: React.Dispatch<React.SetStateAction<ObraRequest>>,
  setError: React.Dispatch<React.SetStateAction<ObraFormErrorState>>
) => {
  setFormState(initialObraFormState)
  setError(initialErrorState)
}
