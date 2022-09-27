import { useEffect, useState, useRef, PureComponent } from "react";
import "./App.css";

function App() {
  const [pixels, setPixels] = useState(new Set());
  const [gameArray, setGameArray] = useState(Array(30).fill(Array(30).fill(0)));
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
  const [currentFood, setCurrentFood] = useState(makeFood());

 

  const moveRight = ([x, y]) => [x, y + 1];
  const moveLeft = ([x, y]) => [x, y - 1];
  const moveUp = ([x, y]) => [x - 1, y];
  const moveDown = ([x, y]) => [x + 1, y];
  const [currentDirection, setCurrentDirection] = useState(() => moveRight);
  // let currentDirection = moveRight;
  function toPositionSet(snake) {
    let set = new Set();
    for (let cell of snake) {
      let position = toKey(cell);
      set.add(position);
    }
    return set;
  }
//  function useInterval(callback, delay) {
//    const savedCallback = useRef();
//    // Remember the latest callback.
//    useEffect(() => {
//      savedCallback.current = callback;
//    }, [callback]);

//    // Set up the interval.
//    useEffect(() => {
//      function tick() {
//        savedCallback.current();
//      }
//      if (delay !== null) {
//        let id = setInterval(tick, delay);
//        return () => clearInterval(id);
//      }
//    }, [delay]);
//  }

  useEffect(() => {
    let gameInterval = setInterval(step, 100);
    return () => clearInterval(gameInterval);
  })
  function step() {
    setSnakePosition((prevVal) => {
      let prevValAcopy = prevVal;
      let head = snakePosition[snakePosition.length - 1];
      let newHead = currentDirection(head);
      prevValAcopy.push(newHead);
      if (toKey(newHead) === toKey(currentFood)) {
        setCurrentFood(makeFood())
      } else {
        prevValAcopy.shift();
      }
      setCurrentSnakeKeys(toPositionSet(prevValAcopy));
      return prevValAcopy;
    });
  }
  // useInterval(step, 100, [snakePosition]);

  function toKey([x, y]) {
    return x + "_" + y;
  }

  function Row({ children }) {
    return <div style={{ display: "flex", width: `100%` }}>{children}</div>;
  }

  function Pixel({ pixelPosition }) {
    function getBackgroundColor() {
      if (toKey(currentFood) === pixelPosition) {
        return "red";
      } else if (currentSnakeKeys.has(pixelPosition)) {
        return 'black';
      }
      return 'white';
   }
    return (
      <div
        style={{
          width: `10px`,
          height: `10px`,
          border: `1px solid #aaa`,
          background:getBackgroundColor(),
        }}
      ></div>
    );
  }
  

  function makeFood() {
    let nextTop = Math.floor(Math.random() * 30);
    let nextLeft = Math.floor(Math.random() * 30);
    return [nextTop, nextLeft];
  }

  document.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "ArrowDown":
      // currentDirection=moveDown
        setCurrentDirection(() => moveDown);
        break;
      case "ArrowUp":
      // currentDirection=moveUp
        setCurrentDirection(() => moveUp);
        break;
      case "ArrowLeft":
      // currentDirection=moveLeft
        setCurrentDirection(() => moveLeft);
        break;
      case "ArrowRight":
      // currentDirection=moveRight
        setCurrentDirection(() => moveRight);
        break;
    }
  });
  
  useEffect(() => {
    let gameInterval = setTimeout(step, 100);
    return () => clearInterval(gameInterval);
  }, [snakePosition]);
  return (
    <div className="canvas">
      {gameArray.map((row, i) => {
        return (
          <Row key={row + i}>
            {row.map((rowChild, j) => {
              let position = i + "_" + j;
              pixels.add(position);
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
