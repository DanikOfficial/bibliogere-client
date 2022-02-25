import React from 'react'

interface Props {
  id: string
  name: string
  label: string
  type: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  error?: string | undefined | null
  color: string
  reference?: React.RefObject<HTMLInputElement>
  value: string | number
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
}) => {
  let content: JSX.Element = (
    <>
      <label htmlFor={id} className="text-prevent mb-1">
        {label}
      </label>
      <input
        id={id}
        value={value}
        type={type}
        name={name}
        placeholder={placeholder}
        ref={reference}
        onChange={onChange}
        className={`form-control shadow-none rounded-3 border-2 border-${
          error ? 'danger' : `${color}`
        }`}
      />
      <div className="form-text text-danger">{error}</div>
    </>
  )

  return <>{content}</>
}

ControlledInput = React.memo(ControlledInput)

export default ControlledInput

/* <span className={`text-danger ${error ? 'd-block' : 'd-none'}`}>
        {error}
      </span>
      <input
        value={value}
        type={type}
        className={`form-control
                placeholder-${color}
                border-end-0
                border-top-0
                border-start-0
                border-2
                border-${color}
                text-${color}
                shadow-none
                ${error ? 'is-invalid' : ''}
                `}
        onChange={onChange}
        name={name}
        placeholder={placeholder}
        ref={reference}
      /> */
