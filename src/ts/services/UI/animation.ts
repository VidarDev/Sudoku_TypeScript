import type { UIElements } from "./elements";

type CellAnimationParams = {
    readonly canvas: HTMLCanvasElement
    readonly ui: UIElements
}

export function cellAnimation(cellAnimationParams: CellAnimationParams) {
    const { canvas, ui } = cellAnimationParams

    let stylesCSS = getComputedStyle(document.documentElement)
    let colorBorder = stylesCSS.getPropertyValue('--sudoku-border')
    let colorSelected = stylesCSS.getPropertyValue('--signal-success-background')
    let di = 1
    let dj = 1
    let i = Math.floor(Math.random() * 9)
    let j = Math.floor(Math.random() * 9)

    setInterval(() => {
        ui.drawEmptyGrid()
        ui.drawCell(i, j, ui.cellSize, colorBorder, colorSelected)

        if(i + di > 8 || i + di < 0) {
            di = -di
        }
        if(j + dj > 8 || j + dj < 0) {
            dj = -dj
        }

        i += di
        j += dj
    }, 100)
}