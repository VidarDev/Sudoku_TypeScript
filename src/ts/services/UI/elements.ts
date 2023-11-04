const stylesCSS = getComputedStyle(document.documentElement)

export class UIElements {
    private static readonly _ui: WeakMap<HTMLCanvasElement, UIElements> = new WeakMap()
    private readonly _cellSize: number

    static colorBackground: string = stylesCSS.getPropertyValue('--neutral-white')
    static colorBackgroundHighlight: string = stylesCSS.getPropertyValue('--brand-uno-background')
    static colorSelected: string = stylesCSS.getPropertyValue('--brand-uno-hover')
    static colorText: string = stylesCSS.getPropertyValue('--brand-uno')
    static colorTextLight: string = stylesCSS.getPropertyValue('--brand-uno-light')
    static colorBorder: string = stylesCSS.getPropertyValue('--sudoku-border')
    static colorBorderBold: string = stylesCSS.getPropertyValue('--brand-uno')

    static font: string = stylesCSS.getPropertyValue('--font-family-primary')

    private constructor (
        private readonly _canvas: HTMLCanvasElement,
        private readonly _ctx: CanvasRenderingContext2D,
    ) {
        this._cellSize = Math.round(Math.min(_canvas.width, _canvas.height) / 9)
    }

    static get(canvas: HTMLCanvasElement): UIElements | false {
        console.log(UIElements._ui)
        console.log(UIElements._ui.has(canvas))
        console.log(UIElements._ui.get(canvas))
        console.log(UIElements._ui.get(canvas)!)

        if(UIElements._ui.has(canvas)) {
            return UIElements._ui.get(canvas)
        }

        const ctx = canvas.getContext("2d")
        if (ctx === null) {
            return false
        }

        const ui = new UIElements(canvas, ctx)
        UIElements._ui.set(canvas, ui)

        return ui
    }

    get width() { return this._canvas.width }

    get height() { return this._canvas.height }

    get cellSize() { return this._cellSize }

    clearCanvas(): UIElements {
        this._ctx.fillStyle = UIElements.colorBackground
        this._ctx.fillRect(0, 0, this.width, this.height)

        return this
    }

    drawCell(
        i: number,
        j: number,
        cellSize: number = this._cellSize,
        borderColor: string = UIElements.colorBorder,
        fillColor?: string
    ): UIElements {
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

    drawRow(): UIElements {

    }

    drawColumn(): UIElements {

    }

    drawGroup(
        groupI: number,
        groupJ: number,
        fillColor?: string
    ): UIElements {
        this.drawCell(groupI, groupJ, this._cellSize * 3, UIElements.colorBorderBold, fillColor)

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                this.drawCell(groupI * 3 + i, groupJ * 3 + j, this._cellSize, UIElements.colorBorder)
            }
        }

        return this
    }

    drawCellValue(): UIElements {

    }

    drawCellDomain(): UIElements {

    }

    drawEmptyGrid(): UIElements {
        this.clearCanvas()

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                this.drawGroup(i, j)
            }
        }

        return this
    }

    colorizeSelectedStuff(): UIElements {

    }

    drawVictory(): UIElements {
        this.clearCanvas()
    }
}