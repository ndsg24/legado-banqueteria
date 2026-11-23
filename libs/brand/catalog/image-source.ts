export type CatalogImageResolver = (path: string) => string | undefined
export const publicImageUrl: CatalogImageResolver = (path) => import.meta.env.BASE_URL + path
