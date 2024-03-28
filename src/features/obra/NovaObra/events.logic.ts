import React, { SetStateAction, Dispatch, RefObject } from 'react'
import type Option from '../../../app/interfaces/Option'
import {
  ObraFormErrorResponse,
  ObraRequest,
  ObraForm,
  defaultObraFormState,
  defaultObraFormErrorResponse,
} from '../data/ObraInterfaces'

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

    // Create a new object based on the current form state, omitting the property to be deleted
    const updatedFormState = { ...formState }
    delete updatedFormState[name]
    setFormState(updatedFormState)
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
  setError: React.Dispatch<React.SetStateAction<ObraFormErrorResponse>>
) => {
  setFormState(defaultObraFormState)
  setError(defaultObraFormErrorResponse)
}
