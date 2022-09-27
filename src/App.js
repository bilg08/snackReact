import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [pixels, setPixels] = useState(new Map());
  const [gameArray,setGameArray] = useState(Array(30).fill(Array(30).fill(0)))
  const [snakePosition, setSnakePosition] = useState([[0,0],[0,1],[0,2],[0,3],[0,4]]);
  const [currentSnakeKeys, setCurrentSnakeKeys] = useState(toPositionSet(snakePosition));
  const [currentFood, setCurrentFood] = useState(makeFood());
  const [isGameOver, setIsGameOver] = useState(false);
  // const [currentDirection, setCurrentDirection] = useState("");
  let gameInterval;
  const moveRight = ([x, y]) => [x, y + 1];
  const moveLeft = ([x, y]) => [x, y - 1];
  const moveUp = ([x, y]) => [x - 1, y];
  const moveDown = ([x, y]) => [x + 1, y];


  function toPositionSet(position) {
    let set = new Set();
    for (let cell of position) {
      let position = toKey(cell);
      set.add(position);
    }
    return set;
  }

  function toKey([x,y]) {
    return x + '_' + y
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
    // let snakePositions = toPositionSet(snake);
    // let position = x + "_" + y;
    // if (snakePositions.has(position)) {
    //   return false;
    // }
    return true;
  }
  function Row({ children }) {
    return (
      <div style={{ display: 'flex', width: `100%` }}>
        {children}
      </div>
    )
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
          width: `10px`,
          height: `10px`,
          border: `1px solid #aaa`,
          background: getBackgroundColor(),
        }}></div>
    );
  }
  
  let currentDirection = moveRight;
  document.addEventListener('keydown', (e) => {
    switch (e.key) {
      case "ArrowDown":
        currentDirection = moveDown;
        break;
      case "ArrowUp":
        currentDirection = moveUp;
        break;
      case "ArrowLeft":
        currentDirection = moveLeft;
        break;
      case "ArrowRight":
        currentDirection = moveRight;
        break;
    }
 })
  function step() {
     setSnakePosition((prevVal) => {
       let prevValAcopy = prevVal;
       let head = snakePosition[snakePosition.length - 1];
       let newHead = currentDirection(head);
       if (!checkValidHead(newHead)) {
         stopGame()
       } prevValAcopy.push(newHead);
       if (toKey(newHead) === toKey(currentFood)) {
         setCurrentFood(makeFood());
       } else {
         prevValAcopy.shift();
       }
       setCurrentSnakeKeys(toPositionSet(prevValAcopy));
       return prevValAcopy;
     });
  }
  function stopGame() {
    clearInterval(gameInterval);
    setIsGameOver(true);
  }
  useEffect(() => {
    gameInterval = setInterval(step, 100);
    return () => clearInterval(gameInterval);
  },[snakePosition])
  
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
              pixels.set(position, <div></div>);
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
