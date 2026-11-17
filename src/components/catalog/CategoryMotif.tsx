type CategoryMotifProps = { categoryId: string }

const motifs: Record<string, string> = {
  salados: 'M16 36h48M19 36c0-14 10-24 21-24s21 10 21 24M40 8v4M12 42h56M22 50h36M28 58h24',
  dulces: 'M20 34h40l-7 28H27zM21 34c-9-9 1-18 10-15 0-13 18-13 18 0 10-3 19 6 10 15M33 41v13M47 41v13',
  extras: 'M18 64 62 16M24 49l-5-9 10-11 10 4M37 36l-4-10 10-11 10 5M50 23l-4-10M31 56l10-11-4-9M44 43l10-11-4-9',
  aperitivos: 'M20 14h40L40 40zM40 40v22M28 64h24M28 22h24M52 14l9-9M55 8l7 6',
  entradas: 'M10 42h60M15 43c3 15 12 22 25 22s22-7 25-22M24 34c-8-12 9-14 3-26M40 34c-8-12 9-14 3-26M56 34c-8-12 9-14 3-26',
  principales: 'M12 49h56M17 49c0-17 10-27 23-27s23 10 23 27M35 18h10M40 13v9M9 56h62M21 63h38',
  guarniciones: 'M40 65V26M40 44C18 44 14 30 18 16c14 0 22 10 22 28M40 55c22 0 26-15 22-29-14 0-22 11-22 29M40 28c-7-12-3-20 3-25 8 8 9 16-3 25',
  salsas: 'M17 28h46M22 29v17c0 13 36 13 36 0V29M63 32c20-2 13 21-5 17M19 62h43M33 20c-6-9 4-10 0-17M47 20c-6-9 4-10 0-17',
  postres: 'M15 58h50M23 55V32h34v23M23 41h34M23 48h34M26 32l14-18 14 18M40 14V7M37 8c-5-9 10-9 6 0M18 64h44',
  bajativos: 'M25 17h30l-3 22c-2 13-22 13-24 0zM40 49v15M29 65h22M28 29h24M49 9l7-7',
  nocturnos: 'M12 39h56c-2 17-13 26-28 26S14 56 12 39M7 39h66M27 30c-12-12 11-12 0-24M43 30c-12-12 11-12 0-24M57 30c-9-9 8-9 0-18',
  bar: 'M20 12h40l-5 45c-1 11-29 11-30 0zM23 36h34M42 36l9-32M32 44l9 3-3 10-9-3zM50 22c17 0 19-21 4-21',
}

export function CategoryMotif({ categoryId }: CategoryMotifProps) {
  return (
    <svg viewBox="0 0 80 80" fill="none" aria-hidden="true" focusable="false">
      <path d={motifs[categoryId] ?? motifs.principales} />
    </svg>
  )
}
