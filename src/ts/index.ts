/// <reference lib="dom" />

import { webSocketInit } from "./services/webSocket/ws";
import { UIElements } from "./services/UI/elements";
import { eventHandlersInit} from "./services/eventHandlers";
import { cellAnimation } from "./services/UI/animation.ts";

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

    function refreshGrid() {
        ui.drawEmptyGrid()
    }

    cellAnimation({ canvas, ui })

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