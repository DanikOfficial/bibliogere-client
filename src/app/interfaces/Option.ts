import { ObraForm } from '../../features/obra/data/ObraInterfaces'

export default interface Option {
  value: string | number
  label: string | number
}

export const extractValueFromOption = <T extends ObraForm>(
  key: string | number,
  object: T
) => {
  const { value } = object[key] as Option
  return value
}
