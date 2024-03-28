import React, { SetStateAction, Dispatch } from 'react'

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
 * @param setFormState state to be mutatede
 * @param name the property to be mutated
 * @param value the value to be used to mutate
 * @param label this optional when using this method, some scenarios we dont need label
 */
export const onChangeSelect = <T>(
  setFormState: React.Dispatch<React.SetStateAction<T>>,
  name: string,
  value: string | number,
  label: string | undefined = undefined
) =>
  label
    ? setFormState((prev: T) => ({ ...prev, [name]: { value, label } }))
    : setFormState((prev: T) => ({ ...prev, [name]: value }))
