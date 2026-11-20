export function PlaybackIcon({ playing }: { playing: boolean }) {
  return (
    <svg aria-hidden="true" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor">
      <path d={playing ? 'M4 2h3v12H4zM9 2h3v12H9z' : 'M4 2l9 6-9 6z'} />
    </svg>
  )
}
