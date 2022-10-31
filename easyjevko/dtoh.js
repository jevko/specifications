import {trim3} from 'https://cdn.jsdelivr.net/gh/jevko/jevkoutils.js@v0.1.6/mod.js'

import {parseJevko} from 'https://cdn.jsdelivr.net/gh/jevko/parsejevko.js@v0.1.3/mod.js'

const str = await Deno.readTextFile("draft-informal-easyjevko.djevko")
const cssStr = await Deno.readTextFile("draft-informal-easyjevko.css")

const par = parseJevko(str)

const dtoh = (jevko) => {
  const {subjevkos, suffix} = jevko

  if (subjevkos.length === 0) return [['text', ptob(suffix)]]

  if (suffix.trim() !== '') throw Error('suf nonem')

  let ret = []
  for (const {prefix, jevko} of subjevkos) {
    const key = prefix.trim()
    if (key.endsWith("=")) {
      const {subjevkos, suffix} = jevko

      if (subjevkos.length > 0) throw Error('complex attr')

      ret.push(['attr', [key, suffix]])
    } else if (key === '--') {
      // skip comment
    } else {
      const op = ctx.get(key) ?? defOp(key)
      ret.push(op(jevko))
    }
  }

  return ret
}

const htoh = hs => {
  if (Array.isArray(hs) === false) throw Error('narray')

  const [fst, ...rest] = hs

  if (typeof fst === 'string') {
    if (fst === 'tag') {
      const [tname, chldrn] = rest

      const classes = []
      const attrs = []
      const chn = []
      if (Array.isArray(chldrn) === false) throw Error('chldrn narray')
      const [fchn] = chldrn
      if (typeof fchn === 'string') {
        console.error(hs)
        throw Error('chldrn narray 2')
      }
      else for (const c of chldrn) {
        if (Array.isArray(c) === false) {
          console.error(c, hs)
          throw Error('narray')
        }

        const [fc, sc] = c

        if (fc === 'class') classes.push(sc)
        else if (fc === 'attr') attrs.push(sc)
        else chn.push(c)
      }

      const clastr = classes.length > 0? ` class="${classes.join(' ')}"`: ""

      const attrstr = attrs.length > 0? ' ' + attrs.map(([k, v]) => `${k}"${v}"`).join(' '): ""

      return `<${tname}${clastr}${attrstr}>${htoh(chn)}</${tname}>`
    } else if (fst === 'stag') {
      // todo
      const [tname, chldrn] = rest
      return `<${tname}/>`
    } else if (fst === 'text') {
      return rest[0]
    } else if (fst === '{{{TODO}}}') {
      
      return `{{{TODO: ${rest[0]}}}}\n`
    } else throw Error('unknown fst: ' + fst)
  }
  return hs.map(h => htoh(h)).join('')
}

const defOp = key => (jevko) => {
  return ['{{{TODO}}}', key]
}

const ptob = (str) => {
  let ret = ''
  for (const c of str) {
    if (c === '(') ret += '['
    else if (c === ')') ret += ']'
    else if (c === '~') ret += '`'
    else ret += c
  }
  return ret
}

const wrapRecNoClass = tag => jevko => {
  const ret = dtoh(jevko)
  return ['tag', tag, ret]
}
const wrapRecNoClassSelfClosing = tag => jevko => {
  const ret = dtoh(jevko)
  return ['stag', tag, ret]
}

const wrapRec = tag => klazz => jevko => {
  const ret = dtoh(jevko)
  ret.push(['class', klazz])
  return ['tag', tag, ret]
}

const ctx = new Map([
  ['', (jevko) => {
    const {subjevkos, suffix} = jevko
    if (subjevkos.length !== 0) throw error('subs > 0')

    return ['text', ptob(suffix)]
  }],
  ['h', wrapRecNoClass('h1')],
  ['hh', wrapRecNoClass('h2')],
  ['p', wrapRecNoClass('p')],
  ['a', wrapRecNoClass('a')],
  ['b', wrapRecNoClass('b')],
  ['ej', wrapRec('pre')('ej')],
  ['ph', wrapRec('span')('ph')],
  ['str', wrapRec('span')('str')],
  ['di', wrapRec('span')('di')],
  ['array', wrapRec('span')('array')],
  ['map', wrapRec('span')('map')],
  ['bad', wrapRec('span')('bad')],
  ['good', wrapRec('span')('good')],
  ['name', wrapRec('span')('name')],
  ['json', wrapRec('pre')('json')],
  ['.', jevko => {
    const {subjevkos, suffix} = jevko
    if (subjevkos.length !== 0) throw error('subs > 0')

    return ['class', suffix]
  }],
  ['endl', wrapRecNoClassSelfClosing('br')],
])

const ret = dtoh(par)
const ret2 = htoh(ret)

console.log(`<!doctype html>\n<style>${cssStr}</style>`, ret2)