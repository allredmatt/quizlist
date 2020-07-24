import React, { useEffect, useRef, useReducer} from 'react';
import Menu from './menu.js'


const initialState = {
    inputText: '',
    guessList: [],
    correct: 0,
    playingGame: false,
    gameState: 'start'
    //Also has a time: initialised when useReducer is used - but depends on props.
}

function reducer(state, action) {
    switch (action.type) {
        case 'input':
            return {...state, inputText: action.payload, gameState: 'playing'}
        case 'correct':
            return {...state, inputText: '', guessList: state.guessList.concat([state.inputText]), correct: state.correct + 1}
        case 'setTime':
            return {...state, time: action.payload}
        case 'countDown':
            if (state.time <= 0) {
                return {...state, gameState: 'lost'}
            } 
            return {...state, time: state.time - 1}
        case 'winGame': 
            return {...state, gameState: 'won'}
        case 'loseGame':
            return {...state, gameState: 'lost'}
        case 'reset':
            return {...initialState, time: action.payload}
        default:
            console.log("Oh no!, default case from reducer.")
            return state
    }
}
      

export default function Quiz ({list}) {
    //The list has the following properties 
    //._id for DB id
    //.name for the name of the quiz
    //.content which is an array of the list to try and guess 
    //.time for a time limit of the quiz as an int in minutes.
    //.description with some brief instructions of what to do.
    
    const [state, dispatch] = useReducer(reducer, {...initialState, time: list.time*60});
    const {inputText, guessList, correct, time, gameState} = state;

    //Look at input text and check to see if there is a match with the list of answers
    useEffect(() => {
        if(list.content.includes(inputText) && !guessList.includes(inputText)){
            //Checks to see if all countries are guessed correctly, -1 as current correct guess has not been dispatched
            if(guessList.length === list.content.length - 1){
                dispatch({type: 'winGame'})
            }
            dispatch({type: 'correct'})
        }
    },[inputText])

    //An interval to tick the clock down
    useInterval(()=>{
        dispatch({type: 'countDown'})
    }, gameState === 'playing' ? 1000 : null)

    const gameBoardHeadText = () => {
        switch(gameState){
            case 'won':
                return  <>
                            <p>Well done you have guessed all {list.content.length} correctly</p>
                            <button onClick={() => dispatch({type: 'reset', payload: list.time*60 })}>Play Again</button>
                        </>
            case 'lost':
                return  <> 
                            <p>Sorry you lost, you only managed to guess {correct} out of {list.content.length} correct.</p>
                            <button onClick={() => dispatch({type: 'reset', payload: list.time*60 })}>Play Again</button>
                        </>
            default:
                return  <>
                            <p>You have {Math.ceil(time/60)} minutes to try and solve this quizList. The time will start as soon as you type.</p>
                            <p>The quizList {list.name} has the following instructions: {list.description}. You have {correct} correct so far.</p>
                            <input type="text" value={inputText} onChange={(e) => dispatch({type: 'input', payload: e.target.value})}></input>
                            <button onClick={() => dispatch({type: 'loseGame'})}>Give up</button>
                        </>
        }
    }

    return (
        <div className = "quiz-board">
            <Menu />
            <h3>Welcome to the quiz: {list.name}</h3>
            {gameBoardHeadText()}
            <ol>
                {list.content.map((item) => {
                    if(guessList.includes(item)){return <li key={item}>{item}</li>}
                    else if(gameState === 'lost'){return <li key={item} className="missing">{item}</li>}
                    return <li key={item} className="not-guessed">Still to guess</li>
                })}
            </ol>
            <style jsx>{`
                ol {
                    display: grid;
                    grid-template-columns: auto auto auto;
                    grid-gap: 2px;
                }
                .quiz-board {
                    min-width: 400px;
                    max-width: 60%;
                    margin: 0 auto;
                    background-color: thistle;
                    border: 1px solid thistle;
                    border-radius: 8px;
                    padding 8px;
                    box-shadow: 0 4px 8px 0 lightblue, 0 6px 20px 0 lightblue;
                }
                .not-guessed{
                    color: violet;
                }
                .missing {
                    color: rgb(149, 125, 173);
                }
            `}</style>
            <style jsx global>{`
                body {
                    background-color: aliceblue;
                }
            `}</style>

        </div>
    )
}

function useInterval(callback, delay) {
    const savedCallback = useRef();
  
    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);
  
    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  };