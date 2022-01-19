import React from 'react'

interface Props {
  name: string
  type: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  placeholder: string
  error?: string | null
  color: string
  reference?: React.RefObject<HTMLInputElement>
}

let Input: React.FC<Props> = ({
  name,
  type,
  onChange,
  placeholder,
  error,
  color,
  reference,
}) => {
  let content: JSX.Element = <></>

  content = (
    <input
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
              `}
      onChange={onChange}
      name={name}
      placeholder={placeholder}
      ref={reference}
    />
  )

  return (
    <>
      <span className={`text-danger ${error ? 'd-block' : 'd-none'}`}>
        {error}
      </span>
      {content}
    </>
  )
}

Input = React.memo(Input)

export default Input
