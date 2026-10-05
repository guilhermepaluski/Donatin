export const digits = (v: string) => v.replace(/\D/g, '')

export function maskCpfCnpj(v: string) {
  const d = digits(v).slice(0, 14)
  if (d.length <= 11)
    return d.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  return d.replace(/^(\d{2})(\d)/, '$1.$2').replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2').replace(/(\d{4})(\d)/, '$1-$2')
}

export function maskPhone(v: string) {
  const d = digits(v).slice(0, 11)
  if (d.length > 6) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
  if (d.length > 2) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  return d
}

export const maskCep = (v: string) => {
  const d = digits(v).slice(0, 8)
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d
}

export function maskDate(v: string) {
  const d = digits(v).slice(0, 8)
  if (d.length > 4) return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`
  if (d.length > 2) return `${d.slice(0, 2)}/${d.slice(2)}`
  return d
}

// DD/MM/AAAA -> AAAA-MM-DD (null se a data não existir ou estiver no futuro)
export function brDateToIso(v: string) {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(v)
  if (!m) return null
  const iso = `${m[3]}-${m[2]}-${m[1]}`
  const d = new Date(iso)
  return !isNaN(d.getTime()) && d.toISOString().slice(0, 10) === iso && d <= new Date() ? iso : null
}
