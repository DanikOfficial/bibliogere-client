import React from 'react'
import Select, {
  ActionMeta,
  GroupBase,
  SingleValue,
  StylesConfig,
} from 'react-select'
import type Option from '../../app/interfaces/Option'

interface Props {
  id: string
  name?: string
  label?: string
  onChange: (name: string, value: string | number, label: string) => void
  color: string
  value?: { value: string | number; label: string | number }
  options: Option[]
  error?: string
}

let ComboBox: React.FC<Props> = ({
  color,
  name,
  value,
  id,
  label,
  onChange,
  options,
  error,
}) => {
  const styles: StylesConfig<Option, false, GroupBase<Option>> = {
    control: (oldStyles: any) => ({
      ...oldStyles,
      border: '2px solid #1000f2',
      color,
    }),
  }

  let content: JSX.Element = (
    <>
      {label && (
        <label htmlFor={id} className="text-prevent mb-1">
          {label}
        </label>
      )}
      <Select
        id={id}
        name={name}
        value={value}
        options={options}
        styles={styles}
        onChange={(
          singleValue: SingleValue<Option>,
          action: ActionMeta<Option>
        ) => {
          const { value, label } = singleValue as Option
          const name = action.name as string
          onChange(name, value, label as string)
        }}
      />
      <div className="form-text text-danger">{error}</div>
    </>
  )
  return <>{content}</>
}

ComboBox = React.memo(ComboBox)

export default ComboBox
