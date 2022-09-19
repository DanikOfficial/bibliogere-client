import React from 'react'
import Select, {
  ActionMeta,
  GroupBase,
  SingleValue,
  StylesConfig,
} from 'react-select'
import type { Option } from '../../app/interfaces/Option'

interface Props {
  id: string
  name?: string
  label: string
  onChange: (
    newValue: SingleValue<Option>,
    actionMeta: ActionMeta<Option>
  ) => void
  color: string
  value: { value: string | number; label: string | number }
  options: Option[]
}
//HTMLElement | JSX.Element[] | JSX.Element

let ComboBox: React.FC<Props> = ({
  color,
  name,
  value,
  id,
  label,
  onChange,
  options,
}) => {
  const styles: StylesConfig<
    {
      value: string | number
      label: string | number
    },
    false,
    GroupBase<{
      value: string | number
      label: string | number
    }>
  > = {
    control: (oldStyles: any) => ({
      ...oldStyles,
      border: '2px solid #1000f2',
      color,
    }),
  }

  let content: JSX.Element = (
    <>
      <label htmlFor={id} className="text-prevent mb-1">
        {label}
      </label>
      <Select
        id={id}
        name={name}
        value={value}
        options={options}
        styles={styles}
        onChange={(value: SingleValue<Option>, action: ActionMeta<Option>) =>
          onChange(value, action)
        }
      />
    </>
  )

  return <>{content}</>
}

ComboBox = React.memo(ComboBox)

export default ComboBox
