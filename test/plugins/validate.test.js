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

  test('null/undefined判定', () => {
    const nullVal = null
    expect(validate.hasValue(nullVal)).toBe(false)
    const undefinedVal = undefined
    expect(validate.hasValue(undefinedVal)).toBe(false)
  })
})

describe('isMaxLength', () => {
  describe('valid test', () => {
    test('文字列が最大長以内', () => {
      const str = '1234567890'
      expect(validate.isMaxLength(str, [10])).toBe(true)
      expect(validate.isMaxLength(str, [11])).toBe(true)
    })
    test('文字列が最大長超過', () => {
      const str = '1234567890'
      expect(validate.isMaxLength(str, [9])).toBe(false)
    })
    test('数値', () => {
      const num = 10
      expect(validate.isMaxLength(num, [2])).toBe(true)
      expect(validate.isMaxLength(num, [1])).toBe(false)
    })
    test('未定義', () => {
      const undefinedVal = undefined
      expect(validate.isMaxLength(undefinedVal, [9])).toBe(true)
    })

    test('無効なオプション', () => {
      const val = ''

      expect(validate.isMaxLength(val, [])).toBe(true)
      expect(validate.isMaxLength(val, ['a'])).toBe(true)
    })
  })

  describe('invalid test', () => {
    test('空のオブジェクト', () => {
      const empty = Object.create(null)

      expect(() => validate.isMaxLength(empty, [1])).toThrow()
    })
  })
})

describe('isMinLength', () => {
  describe('valid test', () => {
    test('文字列が最小長以上', () => {
      const str = '1234567890'
      expect(validate.isMinLength(str, [10])).toBe(true)
      expect(validate.isMinLength(str, [9])).toBe(true)
    })
    test('文字列が最小長未満', () => {
      const str = '1234567890'
      expect(validate.isMinLength(str, [11])).toBe(false)
    })
    test('数値', () => {
      const num = 10
      expect(validate.isMinLength(num, [2])).toBe(true)
      expect(validate.isMinLength(num, [3])).toBe(false)
    })

    test('空のオプション', () => {
      const val = ''
      expect(validate.isMinLength(val, [])).toBe(true)
      expect(validate.isMinLength(val, ['a'])).toBe(true)
    })
  })

  describe('invalid test', () => {
    test('空のオブジェクト', () => {
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
  test('単一ルール', () => {
    const validValueMap = { value: 'string', text: '文字列' }
    const invalidValueMap = { value: '', text: '文字列' }
    const rules = { required: true }
    const validator = getValidator()

    expect(validator(validValueMap, rules)).toEqual([])
    expect(validator(invalidValueMap, rules)).toEqual(['文字列は必須項目です。'])
  })
  test('複数ルール', () => {
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

  test('ルールなし', () => {
    const valueMap = { value: 'string', text: '文字列' }
    const rules = {}
    const validator = getValidator()

    expect(validator(valueMap, rules)).toEqual([])
  })

  test('無効化されたルール', () => {
    const valueMap = { value: 4, text: '文字列' }
    const rules = { required: false }
    const validator = getValidator()

    expect(validator(valueMap, rules)).toEqual([])
  })

  test('存在しないルール', () => {
    const valueMap = { value: 4, text: '文字列' }
    const rules = { max: 8 }
    const validator = getValidator()

    expect(validator(valueMap, rules)).toEqual([])
  })

  test('不正なvalueMap', () => {
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

  test('不正なルール', () => {
    const value = { value: 'string', text: '文字列' }
    const invalidTypeRule = 'required'
    const validator = getValidator()

    expect(() => validator(value, invalidTypeRule)).toThrow(TypeError)
  })
})
