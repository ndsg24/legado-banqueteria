import { useEffect, useRef, type FocusEvent, type KeyboardEvent } from 'react'

export function usePickerDisclosure() {
  const panel = useRef<HTMLDetailsElement>(null)
  const trigger = useRef<HTMLElement>(null)

  useEffect(() => {
    function dismiss(event: PointerEvent) {
      if (
        panel.current?.open &&
        event.target instanceof Node &&
        !panel.current.contains(event.target)
      )
        panel.current.open = false
    }
    document.addEventListener('pointerdown', dismiss)
    return () => document.removeEventListener('pointerdown', dismiss)
  }, [])

  function close() {
    if (panel.current) panel.current.open = false
    trigger.current?.focus()
  }

  return {
    close,
    trigger,
    disclosure: {
      ref: panel,
      onBlur(event: FocusEvent<HTMLDetailsElement>) {
        if (!event.currentTarget.contains(event.relatedTarget)) event.currentTarget.open = false
      },
      onKeyDown(event: KeyboardEvent<HTMLDetailsElement>) {
        if (event.key === 'Escape' && panel.current?.open) {
          event.stopPropagation()
          close()
        }
      },
    },
  }
}
