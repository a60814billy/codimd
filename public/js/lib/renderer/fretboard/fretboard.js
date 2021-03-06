/* global $ */
import escapeHTML from 'lodash/escape'

import './css/i.css'
import dotEmpty from './svg/dotEmpty.svg'
import dotEmptyH from './svg/dotEmpty_h.svg'
import dot from './svg/dot.svg'
import dotH from './svg/dot_h.svg'
import dotWideLeft from './svg/dotWideLeft.svg'
import dotWideRight from './svg/dotWideRight.svg'
import dotWideMiddle from './svg/dotWideMiddle.svg'
import stringO from './svg/string_o.svg'
import stringX from './svg/string_x.svg'

const switchListV = {
  o: `<div class='cell dot'>${dot}</div>`,
  '*': `<div class='cell dot faded'>${dot}</div>`,
  '(': `<div class='cell'>${dotWideLeft}</div>`,
  ')': `<div class='cell'>${dotWideRight}</div>`,
  '=': `<div class='cell'>${dotWideMiddle}</div>`,
  '^': `<div class='cell'>${stringO}</div>`,
  x: `<div class='cell'>${stringX}</div>`,
  '|': `<div class='cell empty'>${dotEmpty}</div>`,
  ' ': `<div class='cell empty'>${dotEmpty}</div>`,
  '\n': `<div class='cell empty'>${dotEmpty}</div>`
}
const switchListH = {
  o: `<div class='cell dot'>${dotH}</div>`,
  '*': `<div class='cell dot faded'>${dotH}</div>`,
  O: `<div class='cell dot root'>${dotH}</div>`,
  '-': `<div class='cell empty'>${dotEmptyH}</div>`,
  ' ': `<div class='cell empty'>${dotEmptyH}</div>`,
  '\n': `<div class='cell empty'>${dotEmptyH}</div><div class='cell empty'>${dotEmptyH}</div>`
}

export const renderFretBoard = (content, { title: fretTitle = '', type = '' }) => {
  const isVertical = !(typeof type[0] === 'string' && type[0].startsWith('h'))

  const containerClass = isVertical ? 'fretContainer' : 'fretContainer_h'

  const [fretType, nutOption] = type.split(' ')
  const fretboardHTML = $(`<div class="${containerClass}"></div>`)

  if (fretTitle) {
    $(fretboardHTML).append(`<div class="fretTitle">${escapeHTML(fretTitle)}</div>`)
  }

  // create fretboard background HTML
  const fretbOrientation = isVertical ? 'vert' : 'horiz'
  const fretbLen = fretType && fretType.substring(1)
  const fretbClass = fretType && fretType[0] + ' ' + fretType
  const nut = nutOption === 'noNut' ? 'noNut' : ''

  const svgHTML = $(`<div class="svg_wrapper ${fretbClass} ${nut}"></div>`)
  const fretbBg = require(`./svg/fretb_${fretbOrientation}_${fretbLen}.svg`)

  $(svgHTML).append($(fretbBg))

  // create cells HTML
  const cellsHTML = $('<div class="cells"></div>')
  let switchList = {}
  if (isVertical) {
    switchList = switchListV
  } else {
    // calculate position
    const emptyFill = new Array(Number(fretbLen) + 3).fill(' ').join('')
    content = `${emptyFill}${content}`

    switchList = switchListH
  }

  const contentCell = content && content.split('')
  // Go through each ASCII character...
  const numArray = [...Array(10).keys()].slice(1)
  contentCell && contentCell.forEach(char => {
    if (numArray.toString().indexOf(char) !== -1) {
      const numType = isVertical ? '' : '_h'
      const numSvg = require(`./svg/number${char}${numType}.svg`)
      cellsHTML.append(`<div class='cell empty'>${numSvg}</div>`)
    } else if (typeof switchList[char] !== 'undefined') {
      cellsHTML.append(switchList[char])
    }
  })

  $(svgHTML).append(cellsHTML)
  $(fretboardHTML).append(svgHTML)

  return fretboardHTML[0].outerHTML
}
