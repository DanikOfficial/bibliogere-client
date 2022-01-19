import React from 'react'

interface Props {
  name?: string
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void
  color: string
  placeholder?: string
}

let ComboBox: React.FC<Props> = ({
  color,
  name,
  children,
  onChange,
  placeholder,
}) => (
  <select
    name={name}
    className={`form-select
    placeholder-${color}
    border-end-0
    border-top-0
    border-start-0
    border-2
    border-${color}
    text-${color}
    shadow-none
    `}
    onChange={onChange}
  >
    {placeholder && <option value={placeholder}>{placeholder}</option>}
    {children}
  </select>
)

ComboBox = React.memo(ComboBox)

export default ComboBox
