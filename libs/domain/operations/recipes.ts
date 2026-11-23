import { z } from 'zod'
import { catalogCategories } from '../menu/catalog'
export const ingredients = [
  'avocado',
  'beef',
  'bread',
  'butter',
  'cheese',
  'chicken',
  'chilean-abalone',
  'chocolate',
  'cocoa',
  'coffee',
  'condensed-milk',
  'conger-eel',
  'cookie',
  'cream',
  'curry',
  'egg',
  'flour',
  'fruit',
  'garlic',
  'ham',
  'ice-cream',
  'jack-mackerel',
  'lemon',
  'lime',
  'mango',
  'mascarpone',
  'mayonnaise',
  'meringue',
  'milk',
  'mint',
  'mushroom',
  'oil',
  'olive',
  'onion',
  'parsley',
  'peaches',
  'pisco',
  'pork',
  'potato',
  'poultry',
  'rice',
  'salmon',
  'salt',
  'sauce',
  'seasonal-fruit',
  'shrimp',
  'sparkling-wine',
  'stock',
  'sugar',
  'tomato',
  'turkey',
  'vegetables',
] as const
export const units = ['g', 'ml', 'unit'] as const
export const recipeLine = z.strictObject({
  ingredient: z.enum(ingredients),
  amount: z.number().positive().max(10000),
  unit: z.enum(units),
})
export const recipeSchema = z
  .strictObject({
    dishId: z.enum(
      catalogCategories.flatMap((c) => c.items.map((i) => i.id)) as [string, ...string[]],
    ),
    revision: z.number().int().min(0).max(2147483646),
    lines: z.array(recipeLine).min(1).max(40),
  })
  .refine((r) => new Set(r.lines.map((l) => l.ingredient)).size === r.lines.length)
export type Recipe = z.infer<typeof recipeSchema>
export type RecipeLine = z.infer<typeof recipeLine>
export type RecipeBook = Record<string, Recipe>
