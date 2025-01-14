'use client'

import { createContext, useState, useEffect } from 'react'
import styles from './styles.module.scss'
import { Footer, Input, SubmitButton, Select } from './components/Index'

type FormValues = Record<string, string | any[]> // Permitimos arrays para cheques

interface FormContextType {
  formValues: FormValues
  setFormValues: React.Dispatch<React.SetStateAction<FormValues>>
}

interface FormProps {
  title: string
  description: string
  onSubmit: (values: FormValues) => void
  children: React.ReactNode
  reset?: boolean
}

export const FormContext = createContext<FormContextType | undefined>(undefined)

export function Form({ title, description, onSubmit, children, reset }: FormProps) {
  const [formValues, setFormValues] = useState<FormValues>({})

  useEffect(() => {
    if (reset) {
      setFormValues({})
    }
  }, [reset])

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    onSubmit(formValues)
  }

  return (
    <FormContext.Provider value={{ formValues, setFormValues }}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.descriptionContainer}>
          <h2>{title}</h2>
          {description && <p>{description}</p>}
        </div>
        {children}
      </form>
    </FormContext.Provider>
  )
}

Form.Input = Input
Form.Footer = Footer
Form.SubmitButton = SubmitButton
Form.Select = Select
