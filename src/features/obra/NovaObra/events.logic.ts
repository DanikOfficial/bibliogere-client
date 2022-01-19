import React from 'react'
import { Obra, ObraRequest, ObraType } from '../data/ObraInterfaces'

export const onChangeTipoObra = (
  { target: { value } }: React.ChangeEvent<HTMLSelectElement>,
  setTipoObra: React.Dispatch<React.SetStateAction<ObraType>>,
  ref: React.RefObject<HTMLInputElement>,
  formState: Obra
) => {
  // gets the property of the old type of entity which is dynamic
  const property = ref.current as HTMLInputElement
  const name: string = property.name

  // checks wether there's a property for the old entity, if so, then deletes the property, this code will need refactoring
  if (name) {
    delete formState[name]
  }

  setTipoObra(value as ObraType)
}

export const onChangeFormState = (
  {
    target: { value, name },
  }: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>,
  setFormState:
    | React.Dispatch<React.SetStateAction<Obra>>
    | React.Dispatch<React.SetStateAction<ObraRequest>>
) => setFormState((prev: any) => ({ ...prev, [name]: value }))
