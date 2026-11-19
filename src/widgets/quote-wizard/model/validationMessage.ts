import { isMessageKey, type Translate } from '../../../shared/i18n'

export function validationMessage(error: string | undefined, t: Translate) {
  if (!error) return ''
  return t(isMessageKey(error) ? error : 'quote.validation.invalid')
}
