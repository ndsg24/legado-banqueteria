import catalog from './catalog.json' with { type: 'json' }
import common from './common.json' with { type: 'json' }
import home from './home.json' with { type: 'json' }
import menu from './menu.json' with { type: 'json' }
import quote from './quote.json' with { type: 'json' }
import table from './table.json' with { type: 'json' }

export default { ...catalog, ...common, ...home, ...menu, ...quote, ...table }
