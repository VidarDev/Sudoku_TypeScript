import type { UIElements } from "./elements";

type CellAnimationParams = {
    readonly canvas: HTMLCanvasElement
    readonly ui: UIElements
    readonly cellDomains: number[][][]
    readonly cellValues: (number | null)[][]
}

export function cellAnimation(params: CellAnimationParams) {
    const { canvas, ui, cellValues,cellDomains} = params

    const stylesCSS = getComputedStyle(document.documentElement)
    const colorBorder: string = stylesCSS.getPropertyValue('--sudoku-border')
    const colorSelected: string = stylesCSS.getPropertyValue('--signal-success-background')
    let di: number = 1
    let dj: number = 1
    let i: number = Math.floor(Math.random() * 9)
    let j: number = Math.floor(Math.random() * 9)

    function drawCellContent(i: number, j: number) {
        if (cellValues[i][j] !== null) {
            ui.drawCellValue(i, j, cellValues[i][j]!)
        } else {
            ui.drawCellDomain(i, j, cellDomains[i][j])
        }
    }

    function drawCellsContent() {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                drawCellContent(i, j)
            }
        }
    }

    ui.drawEmptyGrid()
    ui.drawCell(i, j, ui.cellSize, colorBorder, colorSelected)
    drawCellsContent()

    if(i + di > 8 || i + di < 0) {
        di = -di
    }
    if(j + dj > 8 || j + dj < 0) {
        dj = -dj
    }

    i += di
    j += dj
}