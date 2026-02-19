import { useState } from 'react'
import type { JSX } from 'react'
import './Filters.css'
import { FunnelXIcon } from '@phosphor-icons/react'

export interface FilterOption<T = string> {
  value: T
  label: string
}

interface FilterGroup<T> {
  label: string
  name: string
  options: FilterOption<T>[]
  value: T | undefined
}

interface Props<T extends string> {
  groups: FilterGroup<T>[]
  action: (formData: FormData) => void | Promise<void>
  onClear?: () => void
  showClear?: boolean
  pending?: boolean
}

export default function Filters<T extends string>({
  groups,
  action,
  onClear,
  showClear = false,
  pending = false,
}: Props<T>): JSX.Element {
  const [localValues, setLocalValues] = useState<Record<string, string>>(() =>
    groups.reduce(
      (acc, group) => {
        acc[group.name] = group.value || ''
        return acc
      },
      {} as Record<string, string>,
    ),
  )

  function handleChange(name: string, value: string) {
    setLocalValues((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(formData: FormData) {
    await action(formData)
  }

  return (
    <form action={handleSubmit} className="filters">
      <div className="filters__groups">
        {groups.map((group) => (
          <div key={group.name} className="filters__group">
            <label htmlFor={group.name} className="filters__label">
              {group.label}
            </label>
            <select
              id={group.name}
              name={group.name}
              value={localValues[group.name]}
              onChange={(e) => handleChange(group.name, e.target.value)}
              disabled={pending}
              className="filters__select"
            >
              {group.options.map((option) => (
                <option key={option.label} value={option.value || ''}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
      <div className="filters__actions">
        {showClear && onClear && (
          <button
            type="button"
            onClick={() => {
              onClear?.()
              setLocalValues(
                groups.reduce(
                  (acc, group) => {
                    acc[group.name] = ''
                    return acc
                  },
                  {} as Record<string, string>,
                ),
              )
            }}
            disabled={pending}
            className="filters__clear"
          >
            <FunnelXIcon size={20} />
          </button>
        )}
        <button type="submit" disabled={pending} className="filters__submit">
          {pending ? 'Filtrando...' : 'Aplicar'}
        </button>
      </div>
    </form>
  )
}
