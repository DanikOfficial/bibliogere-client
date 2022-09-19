import { ActionMeta, SingleValue } from 'react-select'
import React, { SetStateAction, Dispatch, RefObject } from 'react'
import { Option } from '../../../app/interfaces/Option'
import {
  FormErrorState,
  Obra,
  ObraRequest,
  ObraType,
} from '../data/ObraInterfaces'
import { initialErrorState, initialObraState } from './NovaObraModalState'

/**
 *
 * @param setFormState  a function to mutate the useState of request payload
 * @param setState a function to mutate the useState of the UI
 * @param ref a ref to the current selected obra type
 * @param formState the current object of the request payload
 * @returns
 */
export const onChangeTipoObra =
  (
    setFormState: Dispatch<SetStateAction<Obra>>,
    setState: Dispatch<SetStateAction<Option>>,
    ref: RefObject<HTMLInputElement>,
    formState: Obra
  ) =>
  (valueObject: SingleValue<Option>, actionMeta: ActionMeta<Option>) => {
    // gets the property of the old type of entity which is dynamic
    const property = ref.current as HTMLInputElement

    if (property) {
      const name: string = property.name

      // checks wether there's a property for the old entity, if so, then deletes the property, this code will need refactoring
      if (name) {
        delete formState[name]
      }
    }

    const { value, label } = valueObject as Option

    setFormState((prev) => ({ ...prev, type: value as ObraType }))

    setState({ value, label })
  }

/**
 *
 * @param event the current event object of the input which is mutated
 * @param setFormState the function to mutate the useState of the request payload
 * @returns
 */
export const onChangeFormState = <T>(
  { target: { value, name } }: React.ChangeEvent<HTMLInputElement>,
  setFormState: React.Dispatch<React.SetStateAction<T>>
) => setFormState((prev: any) => ({ ...prev, [name]: value }))

/**
 *
 * @param setFormState  a function to mutate the useState of data structure
 * @param setState a function to mutate the useState of the UI
 * @returns
 */
export const onChangeComboBox =
  <T, S extends Option>(
    setFormState: React.Dispatch<React.SetStateAction<T>>,
    setState: Dispatch<SetStateAction<S>>
  ) =>
  (valueObject: SingleValue<Option>, actionMeta: ActionMeta<Option>) => {
    // setFormState((prev: any) => ({ ...prev, [name]: value }))
    const { value, label } = valueObject as Option
    const name = actionMeta.name as string
    setFormState((prev: T) => ({ ...prev, [name]: value }))

    setState((prev: S) => ({ ...prev, value, label }))
  }

/**
 *
 * @param setFormState
 * @param setFormStateRequest
 * @param setError
 */
export const resetFormState = (
  setFormState: React.Dispatch<React.SetStateAction<Obra>>,
  setFormStateRequest: React.Dispatch<React.SetStateAction<ObraRequest>>,
  setError: React.Dispatch<React.SetStateAction<FormErrorState>>
) => {
  setFormState(initialObraState)
  setError(initialErrorState)
}
