export function ReviewActionIcon({ action }: { action: 'edit' | 'menu' }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {action === 'edit' ? (
        <path d="m4 20 1.1-5 11-11a2.5 2.5 0 0 1 3.5 3.5l-11 11L4 20Zm10.5-14.4 3.5 3.5" />
      ) : (
        <path d="M12 6c-3-2-6-2.5-10-2v15c4-.5 7 0 10 2 3-2 6-2.5 10-2V4c-4-.5-7 0-10 2Zm0 0v15" />
      )}
    </svg>
  )
}
