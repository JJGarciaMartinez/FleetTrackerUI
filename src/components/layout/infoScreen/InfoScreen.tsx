import type { JSX } from 'react'
import './InfoScreen.css'
import Spinner from '@components/ui/spinner/Spinner.tsx'

interface Props {
  title?: string
  description?: string
  sizeIcon?: number
  isLoading?: boolean
  isError?: boolean
  isEmpty?: boolean
}

export default function InfoScreen({
  title,
  description,
  isLoading = false,
  isError = false,
  isEmpty = false,
  sizeIcon = 50,
}: Props): JSX.Element {
  const getDefaultTitle = () => {
    if (isLoading) return null
    if (isError) return 'Error'
    if (isEmpty) return 'Sin datos'
    return null
  }

  const getDefaultDescription = () => {
    if (isLoading) return 'Por favor, espere mientras se cargan los datos.'
    if (isError)
      return 'Ocurrió un error al cargar los datos. Por favor, inténtelo de nuevo más tarde.'
    if (isEmpty) return 'No se encontraron datos para mostrar.'
    return null
  }

  const finalTitle = title || getDefaultTitle()
  const finalDescription = description || getDefaultDescription()

  return (
    <div className="info-screen-container">
      <div className="info-screen">
        {isLoading && !title ? (
          <span className="info-screen__icon">
            <Spinner size={sizeIcon} />
          </span>
        ) : (
          finalTitle && <h2 className="info-screen__title">{finalTitle}</h2>
        )}
        {finalDescription && (
          <p className="info-screen__description">{finalDescription}</p>
        )}
      </div>
    </div>
  )
}
