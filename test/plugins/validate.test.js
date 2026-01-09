import validate, { ValidateKey } from '@/plugins/validate'
import { describe, expect, test } from 'vitest'
import { createApp } from 'vue'

describe('hasValue', () => {
  test('文字列', () => {
    const str = '0'
    expect(validate.hasValue(str)).toBe(true)
    const strEmpty = ''
    expect(validate.hasValue(strEmpty)).toBe(false)
  })
  test('数値', () => {
    const num = 0
    expect(validate.hasValue(num)).toBe(true)
  })
  test('配列', () => {
    const array = ['']
    expect(validate.hasValue(array)).toBe(true)
    const emptyArray = []
    expect(validate.hasValue(emptyArray)).toBe(false)
  })

  test('オブジェクト', () => {
    const obj = {}
    expect(validate.hasValue(obj)).toBe(true)
  })

  test('nullish', () => {
    const nullVal = null
    expect(validate.hasValue(nullVal)).toBe(false)
    const undefinedVal = undefined
    expect(validate.hasValue(undefinedVal)).toBe(false)
  })
})

describe('isMaxLength', () => {
  describe('valid test', () => {
    test('more than length string', () => {
      const str = '1234567890'
      expect(validate.isMaxLength(str, [10])).toBe(true)
      expect(validate.isMaxLength(str, [11])).toBe(true)
    })
    test('less than length string', () => {
      const str = '1234567890'
      expect(validate.isMaxLength(str, [9])).toBe(false)
    })
    test('number', () => {
      const num = 10
      expect(validate.isMaxLength(num, [2])).toBe(true)
      expect(validate.isMaxLength(num, [1])).toBe(false)
    })
    test('undefined', () => {
      const undefinedVal = undefined
      expect(validate.isMaxLength(undefinedVal, [9])).toBe(true)
    })

    test('invalid options', () => {
      const val = ''

      expect(validate.isMaxLength(val, [])).toBe(true)
      expect(validate.isMaxLength(val, ['a'])).toBe(true)
    })
  })

  describe('invalid test', () => {
    test('empty object', () => {
      const empty = Object.create(null)

      expect(() => validate.isMaxLength(empty, [1])).toThrow()
    })
  })
})

describe('isMinLength', () => {
  describe('valid test', () => {
    test('more than length string', () => {
      const str = '1234567890'
      expect(validate.isMinLength(str, [10])).toBe(true)
      expect(validate.isMinLength(str, [9])).toBe(true)
    })
    test('less than length string', () => {
      const str = '1234567890'
      expect(validate.isMinLength(str, [11])).toBe(false)
    })
    test('number', () => {
      const num = 10
      expect(validate.isMinLength(num, [2])).toBe(true)
      expect(validate.isMinLength(num, [3])).toBe(false)
    })

    test('empty options', () => {
      const val = ''
      expect(validate.isMinLength(val, [])).toBe(true)
      expect(validate.isMinLength(val, ['a'])).toBe(true)
    })
  })

  describe('invalid test', () => {
    test('empty object', () => {
      const empty = Object.create(null)
      expect(() => validate.isMinLength(empty, [1])).toThrow()
    })
  })
})

function getValidator(options = {}) {
  // ダミー
  const app = createApp({})

  app.use(validate, options)

  return app._context.provides[ValidateKey]
}

describe('validate test', () => {
  test('single rule', () => {
    const validValueMap = { value: 'string', text: '文字列' }
    const invalidValueMap = { value: '', text: '文字列' }
    const rules = { required: true }
    const validator = getValidator()

    expect(validator(validValueMap, rules)).toEqual([])
    expect(validator(invalidValueMap, rules)).toEqual(['文字列は必須項目です。'])
  })
  test('multiple rule', () => {
    const validValueMap = { value: 'string', text: '文字列' }
    const invalidValueMap = { value: '', text: '文字列' }
    const rules = { required: true, minLength: 2 }
    const validator = getValidator()

    expect(validator(validValueMap, rules)).toEqual([])
    expect(validator(invalidValueMap, rules)).toEqual([
      '文字列は必須項目です。',
      '文字列には2文字以上で入力してください。',
    ])
  })

  test('no rule', () => {
    const valueMap = { value: 'string', text: '文字列' }
    const rules = {}
    const validator = getValidator()

    expect(validator(valueMap, rules)).toEqual([])
  })

  test('ignored rule', () => {
    const valueMap = { value: 4, text: '文字列' }
    const rules = { required: false }
    const validator = getValidator()

    expect(validator(valueMap, rules)).toEqual([])
  })

  test('not exists rule', () => {
    const valueMap = { value: 4, text: '文字列' }
    const rules = { max: 8 }
    const validator = getValidator()

    expect(validator(valueMap, rules)).toEqual([])
  })

  test('incorrectly valueMap', () => {
    const incorrectlyTypeValue = 'string'
    const missingPropertyValue1 = { value: 'str' }
    const missingPropertyValue2 = { valu: 'str', text: '文字列' }
    const rules = { required: true }
    const validator = getValidator()

    expect(() => validator(incorrectlyTypeValue, rules)).toThrow(TypeError)
    expect(() => validator(missingPropertyValue1, rules)).toThrow(
      'valueMapは{value: any, text: string}の形式で渡してください',
    )
    expect(() => validator(missingPropertyValue2, rules)).toThrow(
      'valueMapは{value: any, text: string}の形式で渡してください',
    )
  })

  test('incorrectly rules', () => {
    const value = { value: 'string', text: '文字列' }
    const invalidTypeRule = 'required'
    const validator = getValidator()

    expect(() => validator(value, invalidTypeRule)).toThrow(TypeError)
  })
})
