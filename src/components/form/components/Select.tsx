'use client'

import { useContext } from 'react'
import { FormContext } from '..'
import styles from './styles.module.scss'

interface SelectProps {
  name: string
  label: string
  children: React.ReactNode
  required?: boolean
}

export function Select({ name, label, children, required = false }: SelectProps) {
  const { formValues, setFormValues } = useContext(FormContext)!

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value
    }))
  }

  return (
    <div className={styles.inputContainer}>
      <label className={styles.label} htmlFor={name}>
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={formValues[name] || ''}
        onChange={handleChange}
        required={required}
        className={styles.select}
      >
        {children}
      </select>
    </div>
  )
}
