import './style.css'

const boardRoot = 4;

type Coordinates = [number, number];

interface Player {
    name: string,
    symbol: "x" | "o";
    score: number;
};

interface CellState {
    element: Element;
    markedBy: string | null;
};

function coordToId(coord: Coordinates): `${number}-${number}` {
    // array destructuring
    const [row, col] = coord;
    // long form
    // const row = coord[0];
    // const col = coord[1];
    return `${row}-${col}`;
}

function idToCoord(id: string): Coordinates {
    return [+id[0], +id[2]];
}

function tttBoardCreate(boardRoot: number) {
    const tttHolder = document.createElement("div");
    tttHolder.id = "tttHolder";
    tttHolder.classList.add("grid", "grid-cols-4", "mt-10");
    tttHolder?.addEventListener("click", play)
    document.querySelector("h1")?.after(tttHolder);

    for (let row = 0; row < boardRoot; row++) {
        for (let col = 0; col < boardRoot; col++) {
            let cell = document.createElement("div");
            cell.classList.add("flex", "items-center", "justify-center", "bg-emerald-300", "w-32", "h-32", "border-black", "border-solid", "border-2", "font-xl", "font-bold");
            cell.id = coordToId([row, col]);
            document.getElementById("tttHolder")?.appendChild(cell);
        }
    }
}

let playIndex = 0;

function play(e: Event | any) {
    if (e.target.innerHTML == "") {
        if (playIndex % 2 == 0) {
            e.target.innerHTML = "X";
            playIndex++;
            if (playIndex > 4) {
                checkForWin(e, "X");
                console.log("I'm checking...")
            };
        } else if (playIndex % 2 == 1) {
            e.target.innerHTML = "O"
            playIndex++;
            if (playIndex > 4) {
                checkForWin(e, "O");
                console.log("I'm checking...")

            };
        };
    };
};

const checkDirections = [
    [-1, -1],
    [ 0,  1],
    [ 1,  1],
    [ 1,  0],
    [ 1, -1],
    [ 0, -1],
    [-1, -1],
    [-1,  0]
];

function checkForWin(e:Event, playerSymbol:string): boolean {
    const startPoint = idToCoord(e.target?.id);
    console.log(playerSymbol, idToCoord(e.target?.id))
    function checkFrom(point: Coordinates): boolean {
        for (let i = 0; i < checkDirections.length; i++) {
            const checkPoint = 
                [
                    (point[0] + checkDirections[i][0]), 
                    (point[1] + checkDirections[i][1])
                ];
            if (
                    checkPoint[0] >= 0 && 
                    checkPoint[0] <= boardRoot - 1 && 
                    checkPoint[1] >= 0 && 
                    checkPoint[1] <= boardRoot - 1 
                ) {
                    if (document.getElementById(coordToId(checkPoint))?.innerHTML === playerSymbol) {
                        const checkPoint2 = 
                        [
                            (checkPoint[0] + checkDirections[i][0]), 
                            (checkPoint[1] + checkDirections[i][1])
                        ];
                        if (document.getElementById(coordToId(checkPoint2))?.innerHTML === playerSymbol) {
                            playIndex = 0;
                            console.log(playIndex, "WINNNNNNNNN!!!!!");
                            return true;
                        }
                    }
                }
                else {
                    return false;
                }
            }
        }
    checkFrom(startPoint);
}

tttBoardCreate(boardRoot);

document.getElementById("resetButton")?.addEventListener("click", resetGame)

function resetGame() {
    playIndex = 0;
    document.getElementById("tttHolder")?.remove();
    tttBoardCreate(4);  
}