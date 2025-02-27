import React from 'react'

interface Props {
  id: string
  name: string
  label?: string
  type: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  error?: string | undefined | null
  color: string
  reference?: React.RefObject<HTMLInputElement>
  value: string | number | undefined
  addSpace?: boolean
}


let ControlledInput: React.FC<Props> = ({
  name,
  value,
  type,
  onChange,
  placeholder,
  error,
  color,
  reference,
  label,
  id,
  addSpace
}) => {
  let content: JSX.Element = (
    <>
      {label && (
        <label htmlFor={id} className="text-prevent mb-1">
          {label}
        </label>
      )}
      <input
        id={id}
        value={value}
        type={type}
        name={name}
        placeholder={placeholder}
        ref={reference}
        onChange={onChange}
        className={`form-control shadow-none rounded-3 border-2 border-${
          error ? 'danger' : `${color} ${ addSpace ? 'mb-2' : ""}`
        }`}
      />
      <div className="form-text text-danger">{error}</div>
    </>
  )

  return <>{content}</>
}

export default ControlledInput
