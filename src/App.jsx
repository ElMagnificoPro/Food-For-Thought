import "./App.css";
import { useState, useEffect } from "react";
import { wordList } from "./assets/wordList";
import { foodList } from "./assets/foodList";

export default function App() {
  function getRandomNumber(max) {
    return Math.floor(Math.random() * max);
  }

  //console.log(board);

  const [chosenWord, setChosenWord] = useState(
    wordList[getRandomNumber(wordList.length)]
  );
  const [chosenWordLetters, setChosenWordLetters] = useState(
    Array.from({ length: chosenWord.length }, (v, i) => {
      return { letter: chosenWord.charAt(i), revealed: false };
    })
  );
  const [board, setBoard] = useState(
    Array.from({ length: 26 }, (v, i) => {
      return {
        letter: String.fromCharCode(i + 65),
        selected: false,
        correct: false,
      };
    })
  );
  const [health, setHealth] = useState(9);
  const [healthBar, setHealthBar] = useState(
    Array.from({ length: 10 }, () => {
      return {
        icon: foodList[getRandomNumber(foodList.length)],
        remaining: true,
      };
    })
  );
  const [gameOver, setGameOver] = useState(false);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    console.log("in Effect!!!!!!", chosenWord);
    setChosenWordLetters(() =>
      Array.from({ length: chosenWord.length }, (v, i) => {
        return { letter: chosenWord.charAt(i), revealed: false };
      })
    );
  }, [chosenWord]);

  function handleKeyDown(e) {

    if (
      e.keyCode >= 65 &&
      e.keyCode <= 90 &&
      board.find((v) => v.letter === e.key.toUpperCase() && !v.selected)
    ) {
      e.preventDefault();
      tryLetter({ letter: e.key.toUpperCase() });
    }
  }
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [() => handleKeyDown]);

  function tryLetter(e) {
    if (!gameOver) {
      console.log(e);
      const tempWord = chosenWordLetters.map((v) =>
        v.letter === e.letter ? { letter: e.letter, revealed: true } : v
      );
      setChosenWordLetters(tempWord);

      const tempBoard = board.map((v) =>
        v.letter === e.letter
          ? {
              letter: v.letter,
              selected: true,
              correct: chosenWord.indexOf(v.letter) >= 0,
            }
          : v
      );
      console.log(chosenWord);
      if (
        JSON.stringify(Array.from(tempBoard, (v) => v.correct)) ===
        JSON.stringify(Array.from(board, (v) => v.correct))
      ) {
        setHealth(health - 1);
        const tempHealthBar = healthBar.map((v, i) =>
          health > i ? v : { icon: v.icon, remaining: false }
        );

        setHealthBar(tempHealthBar);
      }

      setBoard(tempBoard);

      if (health <= 0) {
        setNotification("Game Over");
        setGameOver(true);
      }

      if (tempWord.reduce((prev, curr) => prev && curr.revealed, true)) {
        setNotification("Congratulations, We get to eat today !!!");
        setGameOver(true);
      }
    }
  }

  function newGame() {
    setChosenWord(() => wordList[getRandomNumber(wordList.length)]);
    console.log(chosenWord);

    console.log(chosenWordLetters);
    setBoard(
      Array.from({ length: 26 }, (v, i) => {
        return {
          letter: String.fromCharCode(i + 65),
          selected: false,
          correct: false,
        };
      })
    );
    setHealth(9);
    setHealthBar(
      Array.from({ length: 10 }, () => {
        return {
          icon: foodList[getRandomNumber(foodList.length)],
          remaining: true,
        };
      })
    );
    setGameOver(false);
    setNotification("");
  }

  return (
    <>
      <header>
        <h1>Food For Thought</h1>
        <h2>
          Guess the word in under 10 attempts in order to have something to eat
          for the day!
        </h2>
      </header>
      {notification && <div className="notification">{notification}</div>}
      <div className="health-bar">
        {healthBar.map((item, i) => (
          <div key={i + item} className="food-item-container">
            {item.remaining ? item.icon : "☠️"}
          </div>
        ))}
      </div>
      <div className="letters">
        {chosenWordLetters.map((v, i) => (
          <div key={i + v} className="letter-item-container">
            {v.revealed ? v.letter : ""}
          </div>
        ))}
      </div>
      <div className={`board ${gameOver ? "disabled group" : ""}`}>
        {board.map((v, i) => (
          <button
            key={v + i}
            onClick={() => {
              tryLetter(v);
            }}
            className={`board-item-container ${
              v.selected && !v.correct ? "incorrect" : ""
            } ${v.correct ? "correct" : ""}`}
            disabled={v.selected}
          >
            {board[i].letter}
          </button>
        ))}
      </div>
      <div className="game-over">
        {gameOver && <button onClick={newGame}>New Game</button>}
      </div>
    </>
  );
}
