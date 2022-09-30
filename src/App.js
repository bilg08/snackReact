import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [pixels, setPixels] = useState(new Map());
  const [gameArray, setGameArray] = useState(Array(30).fill(Array(30).fill(0)));
  const [snakePosition, setSnakePosition] = useState([
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
  ]);
  const [score,setScore] = useState(0)
  const [currentSnakeKeys, setCurrentSnakeKeys] = useState(
    toPositionSet(snakePosition)
  );
  const [currentFood, setCurrentFood] = useState(makeFood());
  const [isGameOver, setIsGameOver] = useState(false);
  const [isChanged,setIsChanged] = useState(false)
  let gameInterval;
  const moveRight = ([x, y]) => [x, y + 1];
  const moveLeft = ([x, y]) => [x, y - 1];
  const moveUp = ([x, y]) => [x - 1, y];
  const moveDown = ([x, y]) => [x + 1, y];
  // const [currentDirection, setCurrentDirection] = useState("");

  function toPositionSet(position) {
    let set = new Set();
    for (let cell of position) {
      let position = toKey(cell);
      set.add(position);
    }
    return set;
  }

  function toKey([x, y]) {
    return x + "_" + y;
  }
  function makeFood() {
    let nextTop = Math.floor(Math.random() * 30);
    let nextLeft = Math.floor(Math.random() * 30);
    return [nextTop, nextLeft];
  }

  function checkValidHead([x, y]) {
    if (x < 0 || y < 0) {
      stopGame();
      return false;
    }
    if (x >= 30 || y >= 30) {
      stopGame();
      return false;
    }
    return true;
  }
  function Row({ children }) {
    return <div style={{ display: "flex", width: `100%` }}>{children}</div>;
  }

  function Pixel({ pixelPosition }) {
    function getBackgroundColor() {
      if (toKey(currentFood) === pixelPosition) {
        return "red";
      } else if (currentSnakeKeys.has(pixelPosition)) {
        return "black";
      }
      return "white";
    }
    return (
      <div
        style={{
          width: `12px`,
          height: `11.3px`,
          border: `1.04px solid rgb(170, 170, 170)`,
          background: getBackgroundColor(),
        }}></div>
    );
  }

  let currentDirection = moveRight;
  document.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "ArrowDown":
        if (currentDirection !== moveUp) {
           currentDirection = moveDown;
        }
        break;
      case "ArrowUp":
        if (currentDirection !== moveDown) {
        currentDirection = moveUp;
        }
        break;
      case "ArrowLeft":
        if (currentDirection !== moveRight) {
        currentDirection = moveLeft;
        }
        break;
      case "ArrowRight":
        if (currentDirection !== moveLeft) {
        currentDirection = moveRight;
        }
        break;
    }
  });
  useEffect(() => {
    if (currentSnakeKeys.has(toKey(currentFood))) {
      setCurrentFood(makeFood());
      setScore(prevVal => prevVal+1)
    };
    console.log(snakePosition.length)
  }, [currentSnakeKeys]);

  
 
  function step() {
    
    setSnakePosition((prevVal) => {
      let prevValAcopy = prevVal;
      let head = snakePosition[snakePosition.length - 1];
      let newHead = currentDirection(head);
      if (!checkValidHead(newHead)) {
        stopGame();
      }
      prevValAcopy.push(newHead);
      if (toKey(newHead) === toKey(currentFood)) {
        
      } else {
        prevValAcopy.shift();
      }
      setCurrentSnakeKeys(toPositionSet(prevValAcopy));
      return prevValAcopy;
    });
    // let head = currentSnake[currentSnake.length - 1];

    // let nextDirection = currentDirection;

    // while (directionQueue.length > 0) {
    //   //omnoh ciglel
    //   let candidateDirection = directionQueue.shift();
    //   if (areOpposite(candidateDirection, currentDirection)) {
    //     //omnoh ciglel maani odoo baigaa ciglel 2 esreg baival
    //     //urgreljluuleed
    //     continue;
    //   }
    //   //omnoh cigleleeree yvana;
    //   nextDirection = candidateDirection;
    //   break;
    // }
    // //ugui bol odoo baigaa cigleleeree yvana;
    // currentDirection = nextDirection;
    // let nextHead = currentDirection(head);
    // if (!checkValidHead(currenSnakeKeys, nextHead)) {
    //   stopGame();
    // }
    // currentSnake.push(nextHead);
    // if (toKey(nextHead) === toKey(currentFood)) {
    //   score++;
    //   scoreTable.innerText = score;
    //   currentFood = makeFood();
    // } else {
    //   currentSnake.shift();
    // }
    // currenSnakeKeys = toPositionSet(currentSnake);

    // drawSnake();
  }
  // function areOpposite(dir1, dir2) {
  //   if (dir1 === moveLeft && dir2 === moveRight) {
  //     return true;
  //   }
  //   if (dir1 === moveRight && dir2 === moveLeft) {
  //     return true;
  //   }
  //   if (dir1 === moveUp && dir2 === moveDown) {
  //     return true;
  //   }
  //   if (dir1 === moveDown && dir2 === moveUp) {
  //     return true;
  //   }
  //   return false;
  // }
  function stopGame() {
    clearInterval(gameInterval);
    setIsGameOver(true);
  }
  useEffect(() => {
    gameInterval = setInterval(step, 500);
    return () => clearInterval(gameInterval);
  }, [snakePosition]);

  return (
    <div
      className="canvas"
      style={{
        border: isGameOver === false ? `5px solid black` : `5px solid red`,
      }}
    >
      {gameArray.map((row, i) => {
        return (
          <Row key={row + i}>
            {row.map((rowChild, j) => {
              let position = i + "_" + j;
              pixels.set(position, <div></div>);
              return (
                <Pixel key={rowChild + j} pixelPosition={position}></Pixel>
              );
            })}
          </Row>
        );
      })}
      <p>{score}</p>
    </div>
  );
}

export default App;
