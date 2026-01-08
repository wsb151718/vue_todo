import { inject } from 'vue'

const ValidateKey = Symbol()
export function useValidator() {
  const factory = inject(ValidateKey)
  return factory
}

export default {
  rulesFn: {},
  messages: {},
  install(app, options) {
    const defaultRules = {
      required: this.hasValue,
      max: this.isMax,
      min: this.isMin,
    }
    const defaultMessages = {
      required: '{0}は必須項目です。',
      maxLength: '{0}には{1}文字以下で入力してください。',
      minLength: '{0}には{1}文字以下で入力してください。',
    }
    const optionMessages = options?.messages ?? {}
    const optionRules = options?.rules ?? {}
    const rulesMap = { ...defaultRules, ...optionRules }
    const messages = { ...defaultMessages, ...optionMessages }

    const validate = (valueMap = {}, rules = {}) => {
      const errorMessages = []

      for (const ruleKey of Object.keys(rules)) {
        if (!rulesMap[ruleKey] || rules[ruleKey] === false) {
          continue
        }

        const options = String(rules[ruleKey]).split(',')
        if (!rulesMap[ruleKey](valueMap.value, options)) {
          const msgTemplate = messages[ruleKey]

          const replaceVals = [valueMap.text, ...options]
          const generatedMsg = msgTemplate.replace(
            /{(\d+)}/g,
            (match, index) => replaceVals[index] ?? '',
          )
          errorMessages.push(generatedMsg)
        }
      }

      return errorMessages
    }

    app.provide(ValidateKey, validate)
  },

  hasValue(value) {
    if (value === null || value === undefined) {
      return false
    }

    if (typeof value === 'string' && value.length === 0 && value === '') {
      return false
    }

    if (Array.isArray(value) && value.length === 0) {
      return false
    }

    return true
  },

  isMaxLength(value, options) {
    const max = options[0]
    console.log(max, value, value.length)

    if (typeof value === 'string' && value.length > max) {
      return false
    }

    return true
  },

  isMinLength(value, options) {
    const min = options[0]
    if (typeof value === 'string' && value.length < min) {
      return false
    }

    return true
  },
}
