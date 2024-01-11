const prompt = require("prompt-sync")();

const COLS = 3;
const ROWS = 3;

const SYMBOLS_VALUE = {
  A: 5,
  B: 4,
  C: 3,
  D: 2,
};

const SYMBOLS_COUNT = {
  A: 2,
  B: 4,
  C: 6,
  D: 8,
};

function getDeposit() {
  while (true) {
    const deptAmount = parseFloat(prompt("Enter a deposit amount: "));
    if (isNaN(deptAmount) || deptAmount <= 0) {
      console.log("The amount is not correct.");
    } else {
      return deptAmount;
    }
  }
}

function getLinesOfBet() {
  while (true) {
    const lineBet = parseFloat(
      prompt("Enter the lines you want to bet(1-3): ")
      //User prompt the number of lines to play.
    );

    if (isNaN(lineBet) || lineBet <= 0 || lineBet > 3) {
      // checking if the no of line satisfies these conditions.
      console.log("Line of bet is incorrect.");
    } else {
      return lineBet;
    }
  }
}

function betPerLine(balance, lines) {
  while (true) {
    const perLineBet = parseFloat(prompt("Enter bet per lines: "));

    if (isNaN(perLineBet) || perLineBet <= 0 || perLineBet > balance / lines) {
      console.log("Bets per line exceeded the balance.");
    } else {
      return perLineBet;
    }
  }
}

const spin = () => {
  const symbols = [];
  for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
    for (let i = 0; i < count; i++) {
      symbols.push(symbol);
    }
  }

  const reels = [];
  for (let i = 0; i < COLS; i++) {
    reels.push([]);
    const symbolsreel = [...symbols];
    for (let j = 0; j < ROWS; j++) {
      const randomIndex = Math.floor(Math.random() * symbolsreel.length);
      const selectedSymbols = symbolsreel[randomIndex];
      reels[i].push(selectedSymbols);
      symbolsreel.splice(randomIndex, 1);
    }
  }
  // console.log(reels);
  return reels;
};

const transpose = (reels) => {
  const rows = [];

  for (let i = 0; i < ROWS; i++) {
    rows.push([]);
    for (let j = 0; j < COLS; j++) {
      rows[i].push(reels[j][i]);
    }
  }
  // console.log(rows);
  return rows;
};

const printRows = (rows) => {
  for (const row of rows) {
    let rowString = "";
    for (const [i, symbol] of row.entries()) {
      rowString += symbol;
      if (i != row.length - 1) {
        rowString += " | ";
      }
    }
    console.log(rowString);
  }
};

const getWinnings = (rows, bet, lines) => {
  let winnings = 0;

  for (let row = 0; row < lines; row++) {
    const symbols = rows[row];
    let allSame = true;

    for (const symbol of symbols) {
      if (symbol != symbols[0]) {
        allSame = false;
        break;
      }
    }

    if (allSame) {
      winnings += bet * SYMBOLS_VALUE[symbols[0]];
    }
  }
  return winnings;
};

const game = () => {
  let balance = getDeposit();

  while (true) {
    console.log("You have a balance of $" + balance);
    const linesOfBet = getLinesOfBet();
    const betsPerline = betPerLine(balance, linesOfBet);
    balance -= betsPerline * linesOfBet;
    const reels = spin();
    const rows = transpose(reels);
    printRows(rows);
    const winnings = getWinnings(rows, betsPerline, linesOfBet);
    balance += winnings;
    console.log("You won, $" + winnings.toString());

    if (balance <= 0) {
      console.log("You ran out of money !!");
      break;
    }

    const playAgain = prompt("Do you want to play again (y/n): ?");
    if (playAgain != "y") break;
  }
};

game();
