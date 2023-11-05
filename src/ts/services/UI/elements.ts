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
    static colorSuccess: string = stylesCSS.getPropertyValue('--signal-success')
    static colorSuccessBackground: string = stylesCSS.getPropertyValue('--signal-success-background')

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
            return UIElements._ui.get(canvas)!
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

    drawRow(
        j: number,
        fillColor?: string
    ): UIElements {
        for (let i = 0; i < 9; i++) {
            this.drawCell(i, j, this._cellSize, UIElements.colorBorder, fillColor)
        }

        return this
    }

    drawColumn(
        i: number,
        fillColor?: string
    ): UIElements {
        for (let j = 0; j < 9; j++) {
            this.drawCell(i, j, this._cellSize, UIElements.colorBorder, fillColor)
        }

        return this
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

    drawCellValue(
        i: number,
        j: number,
        value: number
    ): UIElements {
        this._ctx.fillStyle = UIElements.colorText
        this._ctx.font = `600 48px ${UIElements.font}`
        this._ctx.textBaseline = "middle"
        this._ctx.textAlign = "center"

        const x = i * this._cellSize + Math.floor(this._cellSize * 0.5)
        const y = j * this._cellSize + Math.floor(this._cellSize * 0.575)

        this._ctx.fillText(value.toString(), x, y)

        return this
    }

    drawCellDomain(
        i: number,
        j: number,
        domain: number[]
    ): UIElements {
        this._ctx.fillStyle = UIElements.colorTextLight
        this._ctx.font = `400 14px ${UIElements.font}`
        this._ctx.textBaseline = "top"
        this._ctx.textAlign = "start"

        const areaSize = Math.max(this._cellSize - 2, Math.floor(this._cellSize * 0.8))
        const valueStep = Math.floor(areaSize / 3)
        const cellPadding = Math.max(1, Math.floor(this._cellSize * 0.1))
        const x = i * this._cellSize + cellPadding
        const y = j * this._cellSize + cellPadding

        for (let k = 1; k <= 9; k++) {
            const vk = domain.includes(k) ? k : null
            const vi = (k - 1) % 3
            const vj = Math.floor((k - 1) / 3)
            const vx = x + valueStep * vi
            const vy = y + valueStep * vj
            this._ctx.fillText(vk !== null ? vk.toString() : "", vx, vy)
        }

        return this
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

    colorizeSelectedStuff(selectedCell: [number, number] | null): UIElements {
        if (selectedCell === null) {
            return this
        }

        const selectedGroup = [
            Math.floor(selectedCell[0] / 3),
            Math.floor(selectedCell[1] / 3),
        ]

        this.drawRow(selectedCell[1], UIElements.colorBackgroundHighlight)
            .drawColumn(selectedCell[0], UIElements.colorBackgroundHighlight)
            .drawGroup(selectedGroup[0], selectedGroup[1], UIElements.colorBackgroundHighlight)
            .drawCell(
                selectedCell[0],
                selectedCell[1],
                this._cellSize,
                UIElements.colorBorder,
                UIElements.colorSelected
            )

        return this
    }

    drawVictory(): UIElements {
        this._ctx.fillStyle = UIElements.colorSuccessBackground
        this._ctx.fillRect(0, 0, this.width, this.height)

        this._ctx.fillStyle = UIElements.colorSuccess
        this._ctx.font = `600 72px ${UIElements.font}`
        this._ctx.textBaseline = "middle"
        this._ctx.textAlign = "center"
        this._ctx.fillText("Victory !".toUpperCase(), this._canvas.width / 2, this._canvas.height / 2);

        return this
    }
}