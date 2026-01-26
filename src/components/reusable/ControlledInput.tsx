import React, { useState } from 'react'

interface Props {
  id: string
  name: string
  label?: string
  type: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onKeyPress?: (event: React.KeyboardEvent<HTMLInputElement>) => void
  placeholder?: string
  error?: string | undefined | null
  color: string
  reference?: React.RefObject<HTMLInputElement>
  value: string | number | undefined
  addSpace?: boolean
  autoFocus?: boolean
}

let ControlledInput: React.FC<Props> = ({
  name,
  value,
  type,
  onChange,
  onKeyPress,
  placeholder,
  error,
  color,
  reference,
  label,
  id,
  addSpace,
  autoFocus = false,
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const [capsLockOn, setCapsLockOn] = useState(false)
  const isPasswordField = type === 'password'
  const inputType = isPasswordField && showPassword ? 'text' : type

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Detect Caps Lock
    if (e.getModifierState && e.getModifierState('CapsLock')) {
      setCapsLockOn(true)
    } else {
      setCapsLockOn(false)
    }

    // Call parent's onKeyPress if provided
    if (onKeyPress) {
      onKeyPress(e)
    }
  }

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Update Caps Lock state on key up as well
    if (e.getModifierState && e.getModifierState('CapsLock')) {
      setCapsLockOn(true)
    } else {
      setCapsLockOn(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  let content: JSX.Element = (
    <>
      {label && (
        <label htmlFor={id} className="text-prevent mb-1">
          {label}
        </label>
      )}
      <div className="position-relative">
        <input
          id={id}
          value={value}
          type={inputType}
          name={name}
          placeholder={placeholder}
          ref={reference}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          autoFocus={autoFocus}
          className={`form-control shadow-none rounded-3 border-2 ${
            error ? 'border-danger' : `border-${color}`
          } ${addSpace ? 'mb-2' : ''} ${isPasswordField ? 'pe-5' : ''}`}
        />
        {isPasswordField && (
          <button
            type="button"
            className="btn btn-link position-absolute end-0 top-50 translate-middle-y text-muted"
            onClick={togglePasswordVisibility}
            tabIndex={-1}
            style={{ 
              zIndex: 10,
              padding: '0.375rem 0.75rem',
              marginTop: '-2px'
            }}
          >
            <i className={`bi bi-eye${showPassword ? '-slash' : ''}-fill`}></i>
          </button>
        )}
      </div>
      
      {/* Caps Lock Warning */}
      {isPasswordField && capsLockOn && (
        <div className="d-flex align-items-center mt-1 text-warning">
          <i className="bi bi-exclamation-triangle-fill me-1" style={{ fontSize: '0.875rem' }}></i>
          <small>Caps Lock está ativado</small>
        </div>
      )}
      
      {error && <div className="form-text text-danger">{error}</div>}
    </>
  )

  return <>{content}</>
}

export default ControlledInput