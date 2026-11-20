// Each print uses solid ink, paper cutouts and a lighter second impression.
const prints = {
  olive: (
    <>
      <path d="M7 95C29 78 45 62 60 42Q73 24 88 12C67 34 53 64 11 98Z" />
      <path
        fillRule="evenodd"
        d={`M40 66C18 63 13 45 12 30C34 36 44 48 40 66ZM16 36L36 59L27 45ZM51 53C53 31 46 21 39 13
            C34 33 38 47 51 53ZM40 21L48 45L46 29ZM58 46C72 29 87 31 97 32C85 46 73 53 58 46ZM65 44
            L88 35L76 42ZM28 79C45 61 59 65 67 69C54 83 39 87 28 79ZM36 77L59 70L48 76Z`}
      />
      <path opacity=".66" d="M68 36Q71 18 81 11L80 24ZM50 59Q66 54 73 60L71 63Q62 57 49 63Z" />
      <path
        fillRule="evenodd"
        d={`M65 64C69 54 82 54 85 62C89 74 78 85 70 81C64 79 61 72 65 64ZM68 66C70 61 75 60 77 61
            C73 62 70 65 68 70Z`}
      />
    </>
  ),
  tart: (
    <>
      <path
        opacity=".65"
        d={`M10 54Q15 48 19 54Q23 48 27 54Q31 48 36 54Q41 48 46 54Q51 48 56 54Q61 48 66 54Q71 48 76 54
            Q81 48 87 52L82 67Q50 80 17 67Z`}
      />
      <path
        fillRule="evenodd"
        d={`M15 69Q47 80 85 68L78 83Q51 93 23 83ZM26 73L30 82L32 83L31 75ZM41 76L43 85L45 85L45 77Z
            M58 77L58 85L61 84L63 76ZM72 74L68 83L71 82L75 73Z`}
      />
      <path
        fillRule="evenodd"
        d={`M19 51C17 43 23 33 31 32C41 32 47 44 43 51ZM25 41Q26 37 31 37Q28 39 27 43ZM44 50
            C39 40 42 30 51 27C63 23 72 35 70 48L63 51Q55 47 44 50ZM47 37Q49 31 55 31Q51 34 50 38Z
            M72 48C70 42 74 36 80 37C86 38 89 44 85 49Z`}
      />
      <path d="M55 25C54 12 68 9 80 10C72 18 67 26 55 25ZM53 26Q47 19 37 17Q48 15 55 22Z" />
    </>
  ),
  skewer: (
    <>
      <path d="M10 91L24 72L27 75L14 92L8 96ZM43 58L50 48L53 50L46 60ZM68 32L81 15Q87 6 91 9Q94 12 86 18L71 34Z" />
      <path
        fillRule="evenodd"
        d={`M14 64Q20 54 34 56L46 69Q42 82 30 85Q17 82 14 64ZM19 64Q24 59 32 60L35 64Q26 60 19 67Z
            M33 81L41 72L39 78Z`}
      />
      <path
        opacity=".72"
        d="M33 53L39 43L55 54L48 64ZM48 32Q44 23 51 19Q60 15 66 24L73 36L63 46Z"
      />
      <path
        fillRule="evenodd"
        d={`M40 42L57 31L73 42L58 55ZM47 42L57 36L66 42L57 39ZM60 27C59 19 64 13 70 14
            C78 15 82 25 76 33L73 35ZM65 23Q65 18 70 18L67 24Z`}
      />
    </>
  ),
  bowl: (
    <>
      <path
        opacity=".69"
        d={`M26 49C33 39 20 37 25 26Q27 22 30 20C24 31 39 35 32 45ZM44 45C52 32 35 28 43 15L50 8
            C42 24 59 26 51 40ZM61 47C69 37 58 34 63 25L69 20C63 31 76 35 67 44Z`}
      />
      <path
        fillRule="evenodd"
        d="M6 54C6 42 89 40 94 52C97 65 8 69 6 54ZM12 53C17 47 75 45 87 52C72 60 23 62 12 53Z"
      />
      <path
        fillRule="evenodd"
        d="M8 61C29 68 73 66 92 59C87 76 71 87 53 88C32 90 16 79 8 61ZM19 67Q28 82 43 83Q31 79 25 68Z"
      />
      <path opacity=".75" d="M33 88Q52 95 70 85L69 90Q53 98 35 93Z" />
    </>
  ),
  ice: (
    <>
      <path
        d={`M11 30L33 17Q36 15 39 17L57 26L35 40ZM11 34L32 44L34 66L15 57Q12 55 12 51ZM39 43L59 31
            L59 51L39 64Z`}
      />
      <path opacity=".59" d="M17 30L34 21L47 26L35 26L27 32ZM18 40L23 46L24 56L18 52Z" />
      <path
        fillRule="evenodd"
        d={`M47 62L67 48L89 57L68 71ZM54 61L68 53L74 55L64 57ZM46 66L65 75L66 92L49 85ZM51 71L53 79
            L57 82L55 73Z`}
      />
      <path opacity=".7" d="M70 74L91 61L88 80Q88 83 84 85L69 93Z" />
      <path
        fillRule="evenodd"
        d="M61 41C58 24 68 12 88 12L83 18C76 30 74 39 61 41ZM65 34L79 19L71 25Z"
      />
    </>
  ),
  coupe: (
    <>
      <path
        fillRule="evenodd"
        d="M8 35C10 26 73 23 83 31C86 41 18 49 8 35ZM14 34Q39 26 76 31Q56 38 25 38Z"
      />
      <path
        fillRule="evenodd"
        d={`M10 39Q43 47 81 35Q74 55 53 62L53 80Q54 85 70 87Q74 88 69 90Q49 96 30 93Q24 91 31 89
            Q45 86 47 81L46 63Q23 62 10 39ZM20 43Q26 56 42 58Q30 51 29 44Z`}
      />
      <path
        opacity=".65"
        fillRule="evenodd"
        d={`M58 26C59 14 68 7 79 10C92 14 96 28 88 39L83 34Q86 31 87 26L77 25L83 20L81 17L75 22L76 14
            L72 14L71 23L65 18L63 21L69 25Z`}
      />
    </>
  ),
} as const

type Print = keyof typeof prints
const byCategory: Record<string, Print> = {
  salados: 'olive',
  dulces: 'tart',
  extras: 'skewer',
  entradas: 'olive',
  principales: 'bowl',
  guarniciones: 'olive',
  postres: 'tart',
  nocturnos: 'bowl',
  aperitivos: 'coupe',
  bajativos: 'coupe',
  bar: 'coupe',
}
const byDish: Record<string, Print> = {
  'salados-5': 'skewer',
  'aperitivos-6': 'ice',
  'aperitivos-7': 'ice',
  'aperitivos-8': 'ice',
  'aperitivos-10': 'ice',
  'bar-4': 'ice',
}

export function DishWatermark({ categoryId, itemId }: { categoryId: string; itemId: string }) {
  const print = byDish[itemId] ?? byCategory[categoryId] ?? 'olive'
  return (
    <span className="quote-dish__motif" aria-hidden="true">
      <svg viewBox="0 0 100 100" fill="currentColor" focusable="false">
        {prints[print]}
      </svg>
    </span>
  )
}
