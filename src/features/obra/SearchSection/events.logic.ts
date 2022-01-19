import React from 'react'
import { FormSearchState, ObraType } from '../data/ObraInterfaces'
import { InitialAdvancedSearchState } from './SearchSectionState'

/**
 *
 * @param event destructuring of the event object to get the value for the state
 * @param setTitulo function returned from useState call so we can mutate the titulo
 * @returns
 */
export const onChangeTitulo = (
  { target: { value } }: React.ChangeEvent<HTMLInputElement>,
  setTitulo: React.Dispatch<React.SetStateAction<string>>
) => setTitulo(value)

/**
 *
 * @param event destructuring of the event object to get the value for the state
 * @param setAdvancedSearchState function returned from useState call so we can mutate the advanced search state
 */
export const onChangeAdvancedSearch = (
  { target: { name, value } }: React.ChangeEvent<HTMLInputElement>,
  setAdvancedSearchState: React.Dispatch<React.SetStateAction<FormSearchState>>
) => {
  setAdvancedSearchState((prev) => ({ ...prev, [name]: value }))
}

/**
 * Toggles the advanced search option
 * @param setAdvancedSearchState function returned from useState call so we can mutate the advanced search state
 * @param setIsAdvanced function returned from useState call so we can mutate the advanced search state
 * @param ref reference from the input field to prevent from being removed from the state
 */
export const onToggleAdvancedSearch = (
  setAdvancedSearchState: React.Dispatch<React.SetStateAction<FormSearchState>>,
  setIsAdvanced: React.Dispatch<React.SetStateAction<boolean>>,
  ref: React.RefObject<HTMLInputElement>
) => {
  // gets the input field object using ref
  const element = ref.current as HTMLInputElement
  const name: string = element.name
  element.value = ''

  setAdvancedSearchState((prev) => ({
    ...prev,
    ...InitialAdvancedSearchState,
    [name]: '',
  }))

  //   setAdvancedSearchState(InitialAdvancedSearchState)
  setIsAdvanced((prev) => !prev)
}

/**
 * Changes the type of the entity that will be searched
 * @param event destructuring of the event object to get the value for the state
 * @param setTipoObra function used to mutate the type of the entity
 * @param ref reference of the specific field of the said entity
 * @param advancedSearchState used to delete the specific property of old entity type
 */
export const onChangeTipoObra = (
  { target: { value } }: React.ChangeEvent<HTMLSelectElement>,
  setTipoObra: React.Dispatch<React.SetStateAction<ObraType>>,
  ref: React.RefObject<HTMLInputElement>,
  advancedSearchState: FormSearchState
) => {
  // gets the property of the old type of entity which is dynamic
  const property = ref.current as HTMLInputElement
  const name: string = property.name

  console.log('value: ' + value)

  // checks wether there's a property for the old entity, if so, then deletes the property, this code will need refactoring
  if (name) {
    delete advancedSearchState[name]
  }

  setTipoObra(value as ObraType)
}
