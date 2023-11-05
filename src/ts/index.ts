/// <reference lib="dom" />

import { webSocketInit } from "./services/webSocket/ws";
import { UIElements } from "./services/UI/elements";
import { eventHandlersInit} from "./services/eventHandlers";
// import { cellAnimation } from "./services/UI/animation.ts";

type InitialState = {
    readonly canvas: HTMLCanvasElement
    readonly ui: UIElements
    readonly cellDomains: number[][][]
    readonly cellValues: (number | null)[][]
}

function init(canvasId: string): InitialState | false {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement | null;
    const ui = UIElements.get(canvas)
    const cellDomains: number[][][] = []
    const cellValues: (number | null)[][] = []

    // Error 1 : canvas
    if (canvas === null) {
        console.error("Cannot get the given Canvas 2D rendering context")
        return false
    }
    // Error 2 : canvas
    if (!ui) {
        return false
    }

    for (let i = 0; i < 9; i++) {
        cellDomains.push([])
        cellValues.push([])
        for (let j = 0; j < 9; j++) {
            cellDomains[i].push([1, 2, 3, 4, 5, 6, 7, 8, 9])
            cellValues[i].push(null)
        }
    }

    return { canvas, ui, cellDomains, cellValues }
}

function start(initialState: InitialState) {
    const { canvas, ui, cellDomains, cellValues } = initialState
    let selectedCell: [number, number] | null = null
    const animationMode: boolean = true

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

    function removeValueFromCellDomain(i: number, j: number, v: number) {
        const domain = cellDomains[i][j]
        const valueIndex = domain.indexOf(v)
        if (valueIndex !== -1) {
            domain.splice(valueIndex, 1)
        }
    }

    function addValueToCellDomain(i: number, j: number, v: number) {
        const domain = cellDomains[i][j]
        if (!domain.includes(v)) {
            domain.push(v)
        }
    }

    function maintainImpactedCellsDomain(
        i: number,
        j: number,
        v: number,
        remove: boolean
    ) {
        const action = remove ? removeValueFromCellDomain : addValueToCellDomain
        for (let k = 0; k < 9; k++) {
            if (k !== i) {
                action(k, j, v)
            }
            if (k !== j) {
                action(i, k, v)
            }
        }
        const iGroup = Math.floor(i / 3)
        const jGroup = Math.floor(j / 3)
        for (let j2 = 0; j2 < 3 ; j2++) {
            for (let i2 = 0; i2 < 3; i2++) {
                const iCell = iGroup * 3 + i2
                const jCell = jGroup * 3 + j2
                if (iCell !== i && jCell !== j) {
                    action(iCell, jCell, v)
                }
            }
        }
    }

    function toggle(v: number) {
        const i = selectedCell![0]
        const j = selectedCell![1]
        if (cellValues[j][i] === null) {
            if (cellDomains[j][i].includes(v)) {
                cellValues[j][i] = v
                maintainImpactedCellsDomain(i, j, v, true)
                refreshGrid()
            }
        } else if (cellValues[j][i] === v) {
            cellValues[j][i] = null
            maintainImpactedCellsDomain(i, j, v, false)
            for (let j2 = 0; j2 < 9; j2++) {
                for (let i2 = 0; i2 < 9; i2++) {
                    if (cellValues[j2][i2] === v) {
                        maintainImpactedCellsDomain(i2, j2, v, true)
                    }
                }
            }
            refreshGrid()
        }
    }

    function refreshGrid() {
        ui.drawEmptyGrid()
        drawCellsContent()
    }

    eventHandlersInit({	canvas,	ui,	refreshGrid, toggle,
        getSelectedCell: () => selectedCell,
        setSelectedCell: (newCell: [number, number] | null) => selectedCell = newCell,
    })

    webSocketInit()
    refreshGrid()
}

document.addEventListener("DOMContentLoaded", (event) => {
    const retInit = init("sudokuCanvas")

    if (retInit) {
        start(retInit)
    }

    console.log(
        "Sudoku UI variables:", '\n\n',
        "- colorBackground :", UIElements.colorBackground, '\n',
        "- colorBackgroundHighlight :", UIElements.colorBackgroundHighlight, '\n',
        "- colorSelected :", UIElements.colorSelected, '\n',
        "- colorText :", UIElements.colorText, '\n',
        "- colorTextLight :", UIElements.colorTextLight, '\n',
        "- colorBorder :", UIElements.colorBorder, '\n',
        "- colorBorderBold :", UIElements.colorBorderBold, '\n',
        "- font :", UIElements.font
    )
});