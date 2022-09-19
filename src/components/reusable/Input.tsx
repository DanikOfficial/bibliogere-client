import React from 'react'

interface Props {
  id: string
  name: string
  type: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  placeholder: string
  error?: string | null
  color: string
  reference?: React.RefObject<HTMLInputElement>
  label: string
}

let Input: React.FC<Props> = ({
  id,
  name,
  type,
  onChange,
  placeholder,
  error,
  color,
  reference,
  label,
}) => {
  let content: JSX.Element = (
    <>
      <label htmlFor={id} className="text-prevent mb-1">
        {label}
      </label>
      <input
        id={id}
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

Input = React.memo(Input)

export default Input
