import React, { SetStateAction, Dispatch } from 'react'
import { ActionMeta, SingleValue } from 'react-select'
import { Option } from '../../app/interfaces/Option'

/**
 * Used to mutate useState using standard input
 * @param event the input we will get data from
 * @param setInput the function that will be used to mutate the state
 */
export const onInputChange = <T>(
  { target: { value, name } }: React.ChangeEvent<HTMLInputElement>,
  setInput: Dispatch<SetStateAction<T>>
) => {
  setInput((prev: any) => ({ ...prev, [name]: value }))
}

/**
 * Used to mutate useState using react-select library (this is a closure)
 * @param setFormState  a function to mutate the useState of request payload
 * @param setState a function to mutate the useState of the UI
 * @returns
 */
export const onSelectChange =
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
