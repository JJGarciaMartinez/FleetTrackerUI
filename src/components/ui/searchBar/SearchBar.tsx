import type { JSX } from 'react'
import './SearchBar.css'

interface Props {
  placeholder?: string
  defaultValue?: string
  action: (query: string) => void | Promise<void>
  pending?: boolean
}

export default function SearchBar({
  placeholder = 'Buscar...',
  defaultValue,
  action,
  pending = false,
}: Props): JSX.Element {
  async function handleSubmit(formData: FormData) {
    const query = formData.get('search') as string
    await action(query)
  }

  return (
    <form action={handleSubmit} className="search-bar">
      <input
        type="text"
        name="search"
        placeholder={placeholder}
        defaultValue={defaultValue || ''}
        className="search-bar__input"
      />
      <button
        type="submit"
        disabled={pending}
        className="search-bar__btn search-bar__btn--primary"
      >
        {pending ? 'Buscando...' : 'Buscar'}
      </button>
    </form>
  )
}
