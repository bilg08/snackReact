import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [pixels, setPixels] = useState(new Map());
  const [gameArray,setGameArray] = useState(Array(30).fill(Array(30).fill(0)))
  const [snakePosition, setSnakePosition] = useState([[0,0],[0,1],[0,2],[0,3],[0,4]]);
  const [currentSnakeKeys, setCurrentSnakeKeys] = useState(toPosSet(snakePosition));
  const [isChanging, setIsChanging] = useState(true);
  const [currentDirection, setCurrentDirection] = useState("");

  const moveRight = ([x, y]) => [x, y + 1];
  const moveLeft = ([x, y]) => [x, y - 1];
  const moveUp = ([x, y]) => [x - 1, y];
  const moveDown = ([x, y]) => [x + 1, y];


  function toPosSet(position) {
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

  function Row({ children }) {
    return (
      <div style={{ display: 'flex', width: `100%` }}>
        {children}
      </div>
    )
  }

  function Pixel({ pixelPosition }) {
    return (
      <div
        style={{
          width: `10px`,
          height: `10px`,
          border: `1px solid #aaa`,
          background: currentSnakeKeys.has(pixelPosition)
          ? 'black' : 'none'
        }}></div>
    );
  }
  
  // let currentDirection = moveRight;
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
    


    setSnakePosition(prevVal => {
      let prevValAcopy = prevVal;
      prevValAcopy.shift();
      let head = snakePosition[snakePosition.length - 1];
      

      // let newHead = [head[0], head[1] + 1];
      let newHead = currentDirection(head);
      prevValAcopy.push(newHead);
      setCurrentSnakeKeys(toPosSet(prevValAcopy));
      return prevValAcopy;
    })
  }
  useEffect(() => {
    let gameInterval = setInterval(step, 2000);
    return () => clearInterval(gameInterval);
  },[snakePosition])
  
  return (
    <div className="canvas">
      {gameArray.map((row, i) => {
        return (
          <Row key={row+i}>
            {row.map((rowChild, j) => {
              let position = i + "_" + j;
              pixels.set(position, <div></div>);
              return <Pixel key={rowChild+j} pixelPosition={position}></Pixel>;
            })}
          </Row>
        );
       })}
    </div>
  );
}

export default App;
