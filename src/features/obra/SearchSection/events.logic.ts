import { Dispatch, SetStateAction, RefObject, ChangeEvent } from 'react'
import { SingleValue, ActionMeta } from 'react-select'
import { Option } from '../../../app/interfaces/Option'
import { FormSearchState, ObraType } from '../data/ObraInterfaces'
import { InitialAdvancedSearchState } from './SearchSectionState'

/**
 *
 * @param event destructuring of the event object to get the value for the state
 * @param setTitulo function returned from useState call so we can mutate the titulo
 * @returns
 */
export const onChangeTitulo = (
  { target: { value } }: ChangeEvent<HTMLInputElement>,
  setTitulo: Dispatch<SetStateAction<string>>
) => setTitulo(value)

/**
 * @param event destructuring of the event object to get the value for the state
 * @param setAdvancedSearchState function returned from useState call so we can mutate the advanced search state
 */
export const onChangeAdvancedSearch = (
  { target: { name, value } }: ChangeEvent<HTMLInputElement>,
  setAdvancedSearchState: Dispatch<SetStateAction<FormSearchState>>
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
  setAdvancedSearchState: Dispatch<SetStateAction<FormSearchState>>,
  setIsAdvanced: Dispatch<SetStateAction<boolean>>,
  ref: RefObject<HTMLInputElement>
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
  event: SingleValue<ChangeEvent<HTMLSelectElement>>,
  setTipoObra: Dispatch<SetStateAction<ObraType>>,
  ref: RefObject<HTMLInputElement>,
  advancedSearchState: FormSearchState
) => {
  // gets the property of the old type of entity which is dynamic
  const property = ref.current as HTMLInputElement
  const name: string = property.name

  console.log('value: ' + event)

  // checks wether there's a property for the old entity, if so, then deletes the property, this code will need refactoring
  if (name) {
    delete advancedSearchState[name]
  }

  // setTipoObra(value as ObraType)
}

export const onChangeTipoObraComboBox =
  (
    setTipoObra: Dispatch<SetStateAction<ObraType>>,
    setState: Dispatch<SetStateAction<Option>>,
    ref: RefObject<HTMLInputElement>,
    advancedSearchState: FormSearchState
  ) =>
  (valueObj: SingleValue<Option>, actionMeta: ActionMeta<Option>) => {
    // gets the property of the old type of entity which is dynamic
    const property = ref.current as HTMLInputElement
    const name: string = property.name

    // checks wether there's a property for the old entity, if so, then deletes the property, this code will need refactoring
    if (name) {
      delete advancedSearchState[name]

      const { value, label } = valueObj as Option

      setTipoObra(value as ObraType)

      setState({ value, label })
    }
  }
