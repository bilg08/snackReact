import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [gameArray] = useState(Array(20).fill(Array(20).fill(0)));
  const [snakePosition, setSnakePosition] = useState([
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
  ]);
  const [currentSnakeKeys, setCurrentSnakeKeys] = useState(
    toPositionSet(snakePosition)
  );
  const [directionQueue, setDirectionQueue] = useState([]);
  const [currentFood, setCurrentFood] = useState(makeFood);
  const [isGameOver, setIsGameOver] = useState(false);
  const [currentDirection, setCurrentDirection] = useState(() => moveRight);
  // let directionQueue = [];
  let gameInterval = useRef();

  function moveRight([x, y]) {
    return [x, y + 1];
  }
  function moveLeft([x, y]) {
    return [x, y - 1];
  }
  function moveUp([x, y]) {
    return [x - 1, y];
  }
  function moveDown([x, y]) {
    return [x + 1, y];
  }

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
    let nextTop = Math.floor(Math.random() * 20);
    let nextLeft = Math.floor(Math.random() * 20);
    return [nextTop, nextLeft];
  }

  function checkValidHead([x, y]) {
    if (x < 0 || y < 0) {
      stopGame();
      return false;
    }
    if (x >= 20 || y >= 20) {
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
          width: `20px`,
          height: `20px`,
          border: `1.05px solid rgba(0,0,0,0.5)`,
          background: getBackgroundColor(),
        }}></div>
    );
  }

  useEffect(() => {
    function handleDirection(e) {
      switch (e.key) {
        case "ArrowDown":
          if (currentDirection !== moveUp) {
            // directionQueue.push(moveDown);
            setDirectionQueue((prevVal) => {
              let prevValAcopy = prevVal;
              prevValAcopy = [...prevValAcopy, moveDown];
              return prevValAcopy;
            });
          }
          break;
        case "ArrowUp":
          if (currentDirection !== moveDown) {
            setDirectionQueue((prevVal) => {
              let prevValAcopy = prevVal;
              prevValAcopy = [...prevValAcopy, moveUp];
              return prevValAcopy;
            });
          }
          break;
        case "ArrowLeft":
          if (currentDirection !== moveRight) {
            setDirectionQueue((prevVal) => {
              let prevValAcopy = prevVal;
              prevValAcopy = [...prevValAcopy, moveLeft];
              return prevValAcopy;
            });
          }
          break;
        case "ArrowRight":
          if (currentDirection !== moveLeft) {
            setDirectionQueue((prevVal) => {
              let prevValAcopy = prevVal;
              prevValAcopy = [...prevValAcopy, moveRight];
              return prevValAcopy;
            });
          }
          break;
        default:
          setCurrentDirection(currentDirection);
      }
    }

    document.addEventListener("keydown", handleDirection);
    return () => document.removeEventListener("keydown", handleDirection);
  });

  function step() {
    setSnakePosition((prevVal) => {
      let prevValAcopy = prevVal;
      let head = snakePosition[snakePosition.length - 1];
      //daraagiin ciglel
      let nextDirection = currentDirection;
      while (directionQueue.length > 0) {
        let candidateDirection = directionQueue.shift();
        if (
          areOpposite(
            candidateDirection.toString(),
            currentDirection.toString()
          )
        ) {
          continue;
        }
        //hervee omnoh bolon odoo baigaa ciglel esreg bol
        //omnoh cigleleeree yvna
        nextDirection = candidateDirection;
        break;
      }
      setCurrentDirection(() => nextDirection);
      let newHead = currentDirection(head);
      if (!checkValidHead(newHead)) {
        stopGame();
      }
      if (currentSnakeKeys.has(toKey(newHead))) {
        stopGame()
      }

      prevValAcopy.push(newHead);
      if (toKey(newHead) === toKey(currentFood)) {
        setCurrentFood(makeFood);
      } else {
        prevValAcopy.shift();
      }
      setCurrentSnakeKeys(toPositionSet(prevValAcopy));
      return prevValAcopy;
    });
  }

  function areOpposite(dir1, dir2) {
    if (dir1 === moveLeft.toString() && dir2 === moveRight.toString()) {
      return true;
    }
    if (dir1 === moveRight.toString() && dir2 === moveLeft.toString()) {
      return true;
    }
    if (dir1 === moveUp.toString() && dir2 === moveDown.toString()) {
      return true;
    }
    if (dir1 === moveDown.toString() && dir2 === moveUp.toString()) {
      return true;
    }
    return false;
  }

  function stopGame() {
    clearInterval(gameInterval.current);
    setIsGameOver(true);
  }

  useEffect(() => {
    if (isGameOver === false) {
      gameInterval.current = setInterval(step, 50);
      return () => clearInterval(gameInterval.current);
    }
  });

  return (
    <div
      className="canvas"
      style={{
        border: isGameOver === false ? `5px solid black` : `5px solid red`,
      }}>
      {gameArray.map((row, i) => {
        return (
          <Row key={row + i}>
            {row.map((rowChild, j) => {
              let position = i + "_" + j;
              return (
                <Pixel key={rowChild + j} pixelPosition={position}></Pixel>
              );
            })}
          </Row>
        );
      })}
    </div>
  );
}

export default App;
