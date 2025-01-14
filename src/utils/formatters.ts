export const formatNumber = (value: number | null): string => {
  return value != null ? value.toLocaleString() : 'N/A'
}

export const formatDate = (dateString: string | Date | null): string => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toISOString().split('T')[0] // Devuelve en formato YYYY-MM-DD
}

import moment from 'moment-timezone'

export function getCurrentDate(): string {
  const today = moment().tz('America/Argentina/Buenos_Aires')
  return today.format('DD/MM/YYYY')
}
