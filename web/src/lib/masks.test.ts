import { describe, expect, it } from 'vitest'
import { brDateToIso, digits, maskCep, maskCnpj, maskCpfCnpj, maskDate, maskPhone, maskUf } from './masks'

describe('masks', () => {
  it('digits mantém só números', () => {
    expect(digits('(47) 99999-0000')).toBe('47999990000')
  })

  it('maskPhone formata enquanto o usuário digita', () => {
    expect(maskPhone('47')).toBe('47')
    expect(maskPhone('47999')).toBe('(47) 999')
    expect(maskPhone('47999998888')).toBe('(47) 99999-8888')
    expect(maskPhone('479999988889999')).toBe('(47) 99999-8888') // corta no 11º dígito
  })

  it('maskCep coloca o hífen depois do 5º dígito', () => {
    expect(maskCep('89201')).toBe('89201')
    expect(maskCep('89201000')).toBe('89201-000')
  })

  it('maskCnpj formata 00.000.000/0000-00', () => {
    expect(maskCnpj('12345678000199')).toBe('12.345.678/0001-99')
  })

  it('maskCpfCnpj usa CPF até 11 dígitos e CNPJ depois', () => {
    expect(maskCpfCnpj('12345678901')).toBe('123.456.789-01')
    expect(maskCpfCnpj('12345678000199')).toBe('12.345.678/0001-99')
  })

  it('maskDate formata DD/MM/AAAA', () => {
    expect(maskDate('01')).toBe('01')
    expect(maskDate('0102')).toBe('01/02')
    expect(maskDate('01022000')).toBe('01/02/2000')
  })

  it('maskUf deixa só 2 letras maiúsculas', () => {
    expect(maskUf('s1c')).toBe('SC')
    expect(maskUf('scx')).toBe('SC')
  })

  describe('brDateToIso', () => {
    it('converte uma data válida', () => {
      expect(brDateToIso('15/03/2000')).toBe('2000-03-15')
    })
    it('retorna null para data inexistente', () => {
      expect(brDateToIso('31/02/2000')).toBeNull()
    })
    it('retorna null para data no futuro', () => {
      expect(brDateToIso('01/01/2999')).toBeNull()
    })
    it('retorna null para formato errado', () => {
      expect(brDateToIso('2000-03-15')).toBeNull()
    })
  })
})
