const SIZE_BOARD = 8
const PROBABILITY_NUMBER_TWO = 97 // unit (%)

let dataBoard
let board
let btnStart
let btnTest
let isGameStart

$(document).ready(() => {
  init()
  renderBoard()

  handlerBtnStartClick()
  handlerPress()

  handlerBtnStartTest()
})

const init = () => {
  board = $('#board')
  btnStart = $('#btnStart')
  btnTest = $('#btnTest')

  isGameStart = false

  setEmptyBoardData()
}

const setEmptyBoardData = () => {
  dataBoard = []

  for (let i = 0; i < SIZE_BOARD; i++) {
    dataBoard[i] = []
    for (let j = 0; j < SIZE_BOARD; j++) {
      dataBoard[i][j] = {
        x: i, y: j, value: undefined,
      }
    }
  }
}

const renderBoard = () => {
  $('.board-item').remove()

  board.css('grid-template-columns', `repeat(${SIZE_BOARD}, 60px)`)
  board.css('grid-template-rows', `repeat(${SIZE_BOARD}, 60px)`)

  for (let i = 0; i < SIZE_BOARD; i++) {
    for (let j = 0; j < SIZE_BOARD; j++) {
      const dataCell = dataBoard[i][j]
      let cell = $('<div>')
        .addClass('board-item')
        .attr('id', `cell-${i}-${j}`)
        .html(dataCell.value)
        .addClass(`color-cell-${dataCell.value > 2048 ? 2048 : dataCell.value} color-text-${dataCell.value < 8 ? 'black' : 'white'}`)
      board.append(cell)
    }
  }
}

const handlerBtnStartClick = () => {
  btnStart.click(() => {
    isGameStart = true

    setEmptyBoardData()

    let countCellSetValue = 0

    do {
      const {x, y, value} = (randomCell(dataBoard))
      if (x !== undefined && y !== undefined && value !== undefined) {
        dataBoard[x][y].value = value
        countCellSetValue++
      }
    } while (countCellSetValue < 2)

    renderBoard()
  })
}

const handlerBtnStartTest = () => {
  btnTest.click(() => {

  })
}

const handlerPress = () => {
  $(document).keydown(function (e) {

    if (!isGameStart) {
      return
    }

    switch (e.code) {
      case 'ArrowUp':
        handlerPressUp()
        break
      case 'ArrowDown':
        handlerPressDown()
        break
      case 'ArrowLeft':
        handlerPressLeft()
        break
      case 'ArrowRight':
        handlerPressRight()
        break
    }
  })
}

const handlerPressUp = () => {
  let newDataBoard = []
  let isChange = false

  const redirectConvertArray = redirectConvert(dataBoard)
  redirectConvertArray.forEach((item) => {
    const newItem = groupValue(item)
    newDataBoard.push(newItem.newData)

    if (newItem.isChange) {
      isChange = true
    }
  })

  dataBoard = redirectConvert(newDataBoard)

  if (isChange) {
    const {x, y, value} = randomCell(dataBoard)
    if (x === undefined || y === undefined || value === undefined) {
      return
    }

    dataBoard[x][y].value = value
    renderBoard()
  }
}

const handlerPressDown = () => {
  let newDataBoard = []
  let isChange = false

  const redirectConvertArray = redirectConvert(dataBoard)
  redirectConvertArray.forEach((item) => {
    const newItem = groupValue(item.reverse())
    newDataBoard.push(newItem.newData.reverse())

    if (newItem.isChange) {
      isChange = true
    }
  })

  dataBoard = redirectConvert(newDataBoard)

  if (isChange) {
    const {x, y, value} = randomCell(dataBoard)
    if (x === undefined || y === undefined || value === undefined) {
      return
    }

    dataBoard[x][y].value = value
    renderBoard()
  }
}

const handlerPressLeft = () => {
  let newDataBoard = []
  let isChange = false

  dataBoard.forEach((item) => {
    const newItem = groupValue(item)
    newDataBoard.push(newItem.newData)

    if (newItem.isChange) {
      isChange = true
    }
  })

  dataBoard = newDataBoard

  if (isChange) {
    const {x, y, value} = randomCell(dataBoard)
    if (x === undefined || y === undefined || value === undefined) {
      return
    }

    dataBoard[x][y].value = value
    renderBoard()
  }
}

const handlerPressRight = () => {
  let newDataBoard = []
  let isChange = false

  dataBoard.forEach((item) => {
    const newItem = groupValue(item.reverse())
    newDataBoard.push(newItem.newData.reverse())

    if (newItem.isChange) {
      isChange = true
    }
  })

  dataBoard = newDataBoard

  if (isChange) {
    const {x, y, value} = randomCell(dataBoard)
    if (x === undefined || y === undefined || value === undefined) {
      return
    }

    dataBoard[x][y].value = value
    renderBoard()
  }
}

const randomCell = (dataCells) => {
  const arrayTempCell = []
  dataCells.forEach((row) => {
    row.forEach((item) => {
      if (item.value === undefined) {
        arrayTempCell.push(item)
      }
    })
  })

  if (arrayTempCell.length === 0) {
    return {
      x: undefined, y: undefined, value: undefined,
    }
  }

  const indexRandom = Math.floor(Math.random() * arrayTempCell.length)
  const value = arrayTempCell[indexRandom]
  return {
    x: value.x, y: value.y, value: Math.floor(Math.random() * 100) > PROBABILITY_NUMBER_TWO ? 4 : 2,
  }
}

const groupValue = (arrayValue) => {
  const data = arrayValue.map((item) => {
    return {
      x: item.x, y: item.y, value: item.value,
    }
  })

  let index = 0
  let isChange = false
  let pointer = 1

  while (pointer < data.length) {
    if (data[index].value === undefined) {
      if (data[pointer].value === undefined) {
        pointer++
        continue
      }

      data[index].value = data[pointer].value
      data[pointer].value = undefined
      isChange = true
    } else {
      if (data[pointer].value === undefined) {
        pointer++
      } else if (data[pointer].value === data[index].value) {
        data[index].value += data[pointer].value
        data[pointer].value = undefined
        isChange = true
        index++
        pointer++
      } else if (data[pointer].value !== data[index].value) {
        if (data[index + 1].value === undefined) {
          data[index + 1].value = data[pointer].value
          data[pointer].value = undefined
          isChange = true
        }
        index++
        pointer++
      }
    }
  }

  return {
    newData: data,
    isChange: isChange,
  }
}

const redirectConvert = (data) => {

  const newArray = []

  for (let i = 0; i < SIZE_BOARD; i++) {
    const temp = []
    for (let j = 0; j < SIZE_BOARD; j++) {
      temp.push(data[j][i])
    }
    newArray.push(temp)
  }

  return newArray
}