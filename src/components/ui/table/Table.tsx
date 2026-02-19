import type { JSX } from 'react'
import './Table.css'

export interface Column<T> {
  key: string
  label: string
  render?: (value: any, row: T) => JSX.Element | string | number
  className?: string
}

interface Props<T> {
  columns: Column<T>[]
  data: T[]
  rowKey: (row: T) => string | number
  emptyMessage?: string
}

export default function Table<T>({
  columns,
  data,
  rowKey,
  emptyMessage = 'No hay datos disponibles',
}: Props<T>): JSX.Element {
  if (data.length === 0) {
    return <div className="table__empty">{emptyMessage}</div>
  }

  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} className={column.className}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={rowKey(row)} className="table__row">
              {columns.map((column) => (
                <td key={column.key} className={column.className}>
                  {column.render
                    ? column.render((row as any)[column.key], row)
                    : (row as any)[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
