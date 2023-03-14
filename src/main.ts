import './style.css'

interface Player {
    name: string;
    symbol: "x" | "o";
    cells: string[];
    score: number;
};

type Coordinates = [number, number];

const players: Array<Player> = [
    {name: "player1", symbol: "x", cells: [], score: 0},
    {name: "player2", symbol: "o", cells: [], score: 0}
];

const tttCellStyles = ["flex", "items-center", "justify-center", "bg-emerald-300", "w-32", "h-32", "border-black", "border-solid", "border-2", "text-3xl", "font-bold"];

const tttHolderStyles = ["grid", "grid-cols-3", "mt-10"];

const winConditions = [
    ["0-0", "0-1", "0-2"],
    ["1-0", "1-1", "1-2"],
    ["2-0", "2-1", "2-2"],
    ["0-0", "1-0", "2-0"],
    ["0-1", "1-1", "2-1"],
    ["0-2", "1-2", "2-2"],
    ["0-0", "1-1", "2-2"],
    ["0-2", "1-1", "2-0"]
];

const boardRoot = 3;

let playIndex = 0;

let currentPlayer = 0;

let currentlyPlaying = true;

function coordToId(coord: Coordinates): `${number}-${number}` {
    const [row, col] = coord;
    return `${row}-${col}`;
}

function tttBoardCreate(boardRoot: number) {
    const tttHolder = document.createElement("div");
    tttHolder.id = "tttHolder";
    tttHolder.classList.add(...tttHolderStyles);
    tttHolder.addEventListener("click", play);
    document.querySelector("h1")?.after(tttHolder);
    for (let row = 0; row < boardRoot; row++) {
        for (let col = 0; col < boardRoot; col++) {
            let tttCell = document.createElement("div");
            tttCell.classList.add(...tttCellStyles);
            tttCell.id = coordToId([row, col]);
            document.getElementById("tttHolder")?.appendChild(tttCell);
        };
    };
};

function play(e: Event) {
    if (currentlyPlaying === true) {
        const input = e.target as HTMLElement;
        if (input.innerHTML == "") {
            input.innerHTML = players[currentPlayer].symbol;
            const targetId: string = input.id;
            players[currentPlayer].cells.push(targetId);
            if (playIndex > 3) {
                checkForWin();
            };
            currentPlayer = (currentPlayer + 1) % players.length;
            playIndex++;
        };
    };
};

function checkForWin(): boolean {
    for (const winCondition of winConditions) {
        const [winCell1, winCell2, winCell3] = [...winCondition];
        if (players[currentPlayer].cells.includes(winCell1) === true &&
            players[currentPlayer].cells.includes(winCell2) === true &&
            players[currentPlayer].cells.includes(winCell3) === true) {
            document.getElementById(winCell1)?.classList.add("bg-red-300");
            document.getElementById(winCell2)?.classList.add("bg-red-300");
            document.getElementById(winCell3)?.classList.add("bg-red-300");
            players[currentPlayer].score += 1;
            document.getElementById(`player${currentPlayer + 1}`)!.innerHTML = `Player ${players[currentPlayer].symbol}: ${players[currentPlayer].score}`
            currentlyPlaying = false;
            return true;
        };
    }
    return false;
}

tttBoardCreate(boardRoot);

document.getElementById("resetButton")?.addEventListener("click", resetGame);

function resetGame() {
    playIndex = 0;
    document.getElementById("tttHolder")?.remove();
    tttBoardCreate(3);
    currentlyPlaying = true;
    players[0].cells = [];
    players[1].cells = [];
}