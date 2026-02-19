import type { JSX } from 'react'
import { useTransition } from 'react'
import './Pagination.css'

interface Props {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void | Promise<void>
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: Props): JSX.Element | null {
  const [isPending, startTransition] = useTransition()

  if (totalPages < 0) {
    return null
  }

  async function handlePageChange(page: number) {
    startTransition(async () => {
      await onPageChange(page)
    })
  }

  return (
    <div className="pagination">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1 || isPending}
        className="pagination__btn"
      >
        Anterior
      </button>
      <span className="pagination__info">
        Página {currentPage} de {totalPages}
      </span>
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isPending}
        className="pagination__btn"
      >
        Siguiente
      </button>
    </div>
  )
}
