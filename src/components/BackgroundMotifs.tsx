export function BackgroundMotifs() {
  return (
    <div className="background-motifs" aria-hidden="true">
      <svg className="background-motif background-motif--rings" viewBox="0 0 220 220">
        <circle cx="110" cy="110" r="88" />
        <circle cx="110" cy="110" r="61" />
        <circle cx="110" cy="110" r="18" />
      </svg>

      <svg className="background-motif background-motif--waves" viewBox="0 0 300 180">
        <path d="M-12 44C36 10 74 78 122 44S208 10 256 44s86-34 134 0" />
        <path d="M-12 82c48-34 86 34 134 0s86-34 134 0 86-34 134 0" />
        <path d="M-12 120c48-34 86 34 134 0s86-34 134 0 86-34 134 0" />
      </svg>

      <svg className="background-motif background-motif--stitches" viewBox="0 0 220 260">
        <path d="m26 22 34 34m0-34L26 56M146 30l48 48m0-48-48 48M42 166l52 52m0-52-52 52M148 182l25 25m0-25-25 25" />
        <circle cx="116" cy="122" r="6" />
        <circle cx="194" cy="132" r="3" />
      </svg>

      <svg className="background-motif background-motif--cloud" viewBox="0 0 320 210">
        <path d="M-8 142c38-40 76-48 112-22 19-60 105-67 133-10 52-19 93 12 103 52" />
        <path d="M-18 170c49-34 96-36 141-6 46-37 104-34 151 5 26-18 51-22 76-13" />
        <path d="M42 102c18-18 39-27 63-26M205 74c23 2 42 12 57 31" />
      </svg>

      <svg className="background-motif background-motif--crumbs" viewBox="0 0 240 240">
        {[
          [30, 46, 4], [78, 26, 2], [132, 52, 5], [194, 34, 3],
          [52, 112, 3], [108, 96, 2], [178, 118, 4], [216, 92, 2],
          [28, 186, 2], [92, 172, 5], [154, 202, 3], [208, 178, 4],
        ].map(([cx, cy, r]) => <circle cx={cx} cy={cy} r={r} key={`${cx}-${cy}`} />)}
      </svg>
    </div>
  )
}
