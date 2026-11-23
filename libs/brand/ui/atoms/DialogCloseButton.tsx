import { Button } from 'react-aria-components'

export function DialogCloseButton({ label, onClose }: { label: string; onClose?: () => void }) {
  return (
    <Button
      slot={onClose ? undefined : 'close'}
      className="dialog-close"
      aria-label={label}
      onPress={onClose}
    >
      <span aria-hidden="true">×</span>
    </Button>
  )
}
