'use client'

import { useContext } from 'react'
import { FormContext } from '..'
import styles from './styles.module.scss'

interface InputProps {
  type: 'text' | 'password' | 'number' | 'date'
  name: string
  label: string
  placeholder?: string
  required?: boolean
  defaultValue?: string
  readonly?: boolean
  className?: string
}

export function Input({ type, name, label, placeholder, required, defaultValue, readonly, className }: InputProps) {
  const { formValues, setFormValues } = useContext(FormContext)!

  // Manejo del cambio de valor en el input
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value
    }))
  }

  return (
    <div className={`${styles.inputContainer} ${className}`}>
      <label className={styles.label} htmlFor={name}>
        {label}
        {required && <span className={styles.required}>*</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={formValues[name] || defaultValue || ''}
        onChange={!readonly ? handleChange : undefined}
        placeholder={placeholder}
        required={required}
        readOnly={readonly}
      />
    </div>
  )
}
