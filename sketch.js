/**
 *  @author 
 *  @date 2022.05.30
 *
 *  ☒ create project (start with template directory)
 *  ☒ add JSON formatter
 *  ☒ load the JSON NEO with a callback, print
 *  ☒ load the JSON SNC with a callback, print
 *  ☐ load the JSON SNC + NEO as a callback, try printing
 *  ☐ access hasMore, print nextPage if hasMore is true
 *  ☐ loadJSON with nextPage if hasMore, print data
 *  ☐ recursively call loadJSON, gotData
 *  ☐ print the array lengths, make sure they are correct
 *
 *  TODO NEO.length === 287, SNC.length === 266
 *
 */

let font
let instructions
let debugCorner /* output debug text in the bottom left corner of the canvas */


function preload() {
    font = loadFont('data/consola.ttf')
}


function setup() {
    let cnv = createCanvas(600, 300)
    cnv.parent('#canvas')
    colorMode(HSB, 360, 100, 100, 100)
    textFont(font, 14)

    /* initialize instruction div */
    instructions = select('#ins')
    instructions.html(`<pre>
        numpad 1 → freeze sketch</pre>`)

    debugCorner = new CanvasDebugCorner(5)

    loadJSON("https://api.scryfall.com/cards/search?q=set:snc", gotData)
}

// callback function for loadJSON
function gotData(data) {
    print(data)
}


function draw() {
    background(234, 34, 24)


    /* debugCorner needs to be last so its z-index is highest */
    debugCorner.setText(`frameCount: ${frameCount}`, 2)
    debugCorner.setText(`fps: ${frameRate().toFixed(0)}`, 1)
    debugCorner.show()

    if (frameCount > 3000)
        noLoop()
}


function keyPressed() {
    /* stop sketch */
    if (keyCode === 97) { /* numpad 1 */
        noLoop()
        instructions.html(`<pre>
            sketch stopped</pre>`)
    }
}


/** 🧹 shows debugging info using text() 🧹 */
class CanvasDebugCorner {
    constructor(lines) {
        this.size = lines
        this.debugMsgList = [] /* initialize all elements to empty string */
        for (let i in lines)
            this.debugMsgList[i] = ''
    }

    setText(text, index) {
        if (index >= this.size) {
            this.debugMsgList[0] = `${index} ← index>${this.size} not supported`
        } else this.debugMsgList[index] = text
    }

    show() {
        textFont(font, 14)
        strokeWeight(1)

        const LEFT_MARGIN = 10
        const DEBUG_Y_OFFSET = height - 10 /* floor of debug corner */
        const LINE_SPACING = 2
        const LINE_HEIGHT = textAscent() + textDescent() + LINE_SPACING
        fill(0, 0, 100, 100) /* white */
        strokeWeight(0)

        for (let index in this.debugMsgList) {
            const msg = this.debugMsgList[index]
            text(msg, LEFT_MARGIN, DEBUG_Y_OFFSET - LINE_HEIGHT * index)
        }
    }
}