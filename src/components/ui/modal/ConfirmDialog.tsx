import type { JSX } from 'react'
import Modal, { type ModalProps } from './Modal'

export type ConfirmVariant = 'default' | 'destructive'

export interface ConfirmDialogProps extends Omit<ModalProps, 'footer'> {
  description?: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void | Promise<void>
  variant?: ConfirmVariant
}

export default function ConfirmDialog({
  title = 'Confirmar acción',
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onClose,
  variant = 'default',
  isOpen,
  children,
  size = 'sm',
}: ConfirmDialogProps): JSX.Element | null {
  const handleConfirm = async () => {
    await onConfirm()
    onClose()
  }

  const footer = (
    <>
      <button
        type="button"
        onClick={onClose}
        className="modal__btn modal__btn--secondary"
      >
        {cancelText}
      </button>
      <button
        type="button"
        onClick={handleConfirm}
        className={`modal__btn ${
          variant === 'destructive'
            ? 'modal__btn--destructive'
            : 'modal__btn--primary'
        }`}
      >
        {confirmText}
      </button>
    </>
  )

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={footer}
      size={size}
    >
      {description && <p className="modal__description">{description}</p>}
      {children}
    </Modal>
  )
}
