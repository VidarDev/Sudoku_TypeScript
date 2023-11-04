const stylesCSS = getComputedStyle(document.documentElement)

export class UIElements {
    private static readonly _ui: WeakMap<HTMLCanvasElement, UIElements> = new WeakMap()
    private readonly _cellSize: number

    static colorBackground: string = stylesCSS.getPropertyValue('--neutral-white')
    static colorBackgroundHighlight: string = stylesCSS.getPropertyValue('--brand-uno-background')
    static colorSelected: string = stylesCSS.getPropertyValue('--brand-uno-hover')
    static colorText: string = stylesCSS.getPropertyValue('--brand-uno')
    static colorTextLight: string = stylesCSS.getPropertyValue('--brand-uno-light')
    static colorBorder: string = stylesCSS.getPropertyValue('--brand-uno-light')
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
        console.log(UIElements._ui.has(canvas))

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
        this._ctx.fillStyle = UIElements.colorSelected
        this._ctx.fillRect(0, 0, this.width, this.height)
        return this
    }

    drawCell(): UIElements {

    }

    drawRow(): UIElements {

    }

    drawColumn(): UIElements {

    }

    drawGroup(): UIElements {

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