import type {SudokuDomain, SudokuValues} from "./sudokuTypes"

const stylesCSS = getComputedStyle(document.documentElement)

export class UISudoku {
  private static readonly _ui: WeakMap<HTMLCanvasElement, UISudoku> = new WeakMap()
  private readonly _cellSize: number

  static colorBackground: string = stylesCSS.getPropertyValue("--neutral-white")
  static colorBackgroundHighlight: string = stylesCSS.getPropertyValue("--brand-uno-background")
  static colorSelected: string = stylesCSS.getPropertyValue("--brand-uno-hover")
  static colorText: string = stylesCSS.getPropertyValue("--brand-uno")
  static colorTextLight: string = stylesCSS.getPropertyValue("--brand-uno-light")
  static colorBorder: string = stylesCSS.getPropertyValue("--sudoku-border")
  static colorBorderBold: string = stylesCSS.getPropertyValue("--brand-uno")
  static colorSuccess: string = stylesCSS.getPropertyValue("--signal-success")
  static colorSuccessBackground: string = stylesCSS.getPropertyValue("--signal-success-background")

  static font: string = stylesCSS.getPropertyValue("--font-family-primary")

  private constructor(
    private readonly _canvas: HTMLCanvasElement,
    private readonly _ctx: CanvasRenderingContext2D,
  ) {
    this._cellSize = Math.round(Math.min(_canvas.width, _canvas.height) / 9)
  }

  static get(canvas: HTMLCanvasElement): UISudoku | false {
    if (UISudoku._ui.has(canvas)) {
      return UISudoku._ui.get(canvas)!
    }

    const ctx = canvas.getContext("2d")
    if (ctx === null) {
      return false
    }

    const ui = new UISudoku(canvas, ctx)
    UISudoku._ui.set(canvas, ui)

    return ui
  }

  get width() {
    return this._canvas.width
  }
  get height() {
    return this._canvas.height
  }
  get cellSize() {
    return this._cellSize
  }

  clearCanvas(): UISudoku {
    this._ctx.fillStyle = UISudoku.colorBackground
    this._ctx.fillRect(0, 0, this.width, this.height)

    return this
  }

  drawCell(
    i: number,
    j: number,
    cellSize: number = this._cellSize,
    borderColor: string = UISudoku.thinLineColor,
    fillColor?: string,
  ): UISudoku {
    const x = i * cellSize
    const y = j * cellSize

    if (fillColor) {
      this._ctx.fillStyle = fillColor
      this._ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2)
    }

    this._ctx.strokeStyle = borderColor
    this._ctx.strokeRect(x, y, cellSize, cellSize)

    return this
  }

  drawRow(j: number, fillColor?: string): UISudoku {
    for (let i = 0; i < 9; i++) {
      this.drawCell(i, j, this._cellSize, UISudoku.colorBorder, fillColor)
    }

    return this
  }

  drawColumn(i: number, fillColor?: string): UISudoku {
    for (let j = 0; j < 9; j++) {
      this.drawCell(i, j, this._cellSize, UISudoku.colorBorder, fillColor)
    }

    return this
  }

  drawGroup(groupI: number, groupJ: number, fillColor?: string): UISudoku {
    this.drawCell(groupI, groupJ, this._cellSize * 3, UISudoku.colorBorderBold, fillColor)

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        this.drawCell(groupI * 3 + i, groupJ * 3 + j, this._cellSize, UISudoku.colorBorder)
      }
    }

    return this
  }

  drawCellValue(i: number, j: number, value: SudokuValues): UISudoku {
    this._ctx.fillStyle = UISudoku.colorText
    this._ctx.font = `600 48px ${UISudoku.font}`
    this._ctx.textBaseline = "middle"
    this._ctx.textAlign = "center"

    const x = i * this._cellSize + Math.floor(this._cellSize * 0.5)
    const y = j * this._cellSize + Math.floor(this._cellSize * 0.575)

    this._ctx.fillText(value.toString(), x, y)

    return this
  }

  drawCellDomain(i: number, j: number, domain: SudokuDomain): UISudoku {
    this._ctx.fillStyle = UISudoku.colorTextLight
    this._ctx.font = `400 14px ${UISudoku.font}`
    this._ctx.textBaseline = "top"
    this._ctx.textAlign = "start"

    const areaSize = Math.max(this._cellSize - 2, Math.floor(this._cellSize * 0.8))
    const valueStep = Math.floor(areaSize / 3)
    const cellPadding = Math.max(1, Math.floor(this._cellSize * 0.1))
    const x = i * this._cellSize + cellPadding
    const y = j * this._cellSize + cellPadding

    for (let k = 1; k <= 9; k++) {
      const vk = domain.has(k as SudokuValues) ? k : null
      const vi = (k - 1) % 3
      const vj = Math.floor((k - 1) / 3)
      const vx = x + valueStep * vi
      const vy = y + valueStep * vj
      this._ctx.fillText(vk !== null ? vk.toString() : "", vx, vy)
    }

    return this
  }

  drawEmptyGrid(): UISudoku {
    this.clearCanvas()

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        this.drawGroup(i, j)
      }
    }

    return this
  }

  colorizeSelectedStuff(selectedCell: [number, number] | null): UISudoku {
    if (selectedCell === null) {
      return this
    }

    const selectedGroup = [Math.floor(selectedCell[0] / 3), Math.floor(selectedCell[1] / 3)]

    this.drawRow(selectedCell[1], UISudoku.colorBackgroundHighlight)
      .drawColumn(selectedCell[0], UISudoku.colorBackgroundHighlight)
      .drawGroup(selectedGroup[0], selectedGroup[1], UISudoku.colorBackgroundHighlight)
      .drawCell(
        selectedCell[0],
        selectedCell[1],
        this._cellSize,
        UISudoku.colorBorder,
        UISudoku.colorSelected,
      )

    return this
  }

  drawVictory(): UISudoku {
    this._ctx.fillStyle = UISudoku.colorSuccessBackground
    this._ctx.fillRect(0, 0, this.width, this.height)

    this._ctx.fillStyle = UISudoku.colorSuccess
    this._ctx.font = `600 72px ${UISudoku.font}`
    this._ctx.textBaseline = "middle"
    this._ctx.textAlign = "center"
    this._ctx.fillText("Victory !".toUpperCase(), this._canvas.width / 2, this._canvas.height / 2)

    return this
  }
}
