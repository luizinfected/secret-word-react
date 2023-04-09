//css
import './App.css';

//React
import { useCallback, useEffect, useState } from 'react'

// data
import { wordsList } from './data/words'

// components
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';


const stages = [
  { id: 1, name: 'start' },
  { id: 2, name: 'game' },
  { id: 3, name: 'end' },
];

const guessesQty = 3


function App() {

  const [gamestage, setGamestage] = useState(stages[0].name);
  const [words] = useState(wordsList)

  const [pickedWord, setPickedWord] = useState('')
  const [pickedCategory, setPickedCategory] = useState('')
  const [letters, setLetters] = useState([])

  const [guessedLetters, setGuessedLetters] = useState([])
  const [wrongLetters, setWrongLetters] = useState([])
  const [guesses, setGuesses] = useState(3)
  const [score, setScore] = useState(0)


  const pickWordAndCategory = useCallback(() => {
    //pick a random category
    const categories = Object.keys(words)
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)]
    // console.log(category)

    const word = words[category][Math.floor(Math.random() * words[category].length)]
    // console.log(word)

    return { word, category }
  }, [words])


  //start the secret word game
  const startGame = useCallback(() => {

    clearLetterStates()
    //pick word and pick category
    const { word, category } = pickWordAndCategory()

    //create an array of letters
    let wordLetters = word.split('')

    console.log(word, category)

    wordLetters = wordLetters.map((l) => l.toLowerCase())
    console.log(wordLetters)

    //fill states
    setPickedWord(word)
    setPickedCategory(category)
    setLetters(wordLetters)
    setGamestage(stages[1].name)
  },[pickWordAndCategory])
  //process de the letter input
  const verifyLetter = (letter) => {

    const normalizedLetter = letter.toLowerCase()

    //check if letter ha already been utilized

    if (guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)) {
      return
    }

    //push guesse letter or remove a guess

    if (letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [...actualGuessedLetters, normalizedLetter])
    } else {
      setWrongLetters((actualWrongLetters) => [...actualWrongLetters, normalizedLetter])
      setGuesses((actualGuesses) => actualGuesses - 1)
    }


  }
  console.log(guessedLetters)
  console.log(wrongLetters)

  const clearLetterStates = () => {
    setGamestage(stages[2].name)
  }

  useEffect(() => {
    if (guesses <= 0) {
      //reset game
      clearLetterStates()
    }
  }, [guesses])


  useEffect(() => {
    const uniqueLetters = [...new Set(letters)]

    //win condition
    if (guessedLetters.length === uniqueLetters.length) {
      setScore((actualScore) => actualScore += 100)

      startGame()
    }


  }, [guessedLetters, letters, startGame])
  // restart the game 

  const retry = () => {
    setScore(0)
    setGuesses(guessesQty)
    setGamestage(stages[0].name)
  }

  return (
    <div className="App">
      {gamestage === 'start' && <StartScreen startGame={startGame} />}
      {gamestage === 'game' &&
        <Game
          verifyLetter={verifyLetter}
          pickedWord={pickedWord}
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />}
      {gamestage === 'end' && <GameOver retry={retry} score={score} />}

    </div>
  );
}

export default App;
