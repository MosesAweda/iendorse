

import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchUserQuestions,
  setCurrentQuestionIndex,
  submitAnswer,
  setQuestions,
} from "../../features/questions/questionSlice";
import {
  getCategories,
  getGames,
} from "../../features/categories/categoriesSlice";
import Pagination from "../../Components/Pagination";
import Timer from "../../assets/Icons/timer.svg";
import { useNavigate, useLocation } from "react-router-dom";
import EndGameModal from "../../Components/EndGameModal";
import "../../Pages/Questions/QuestionsScreen.css";
import { unwrapResult } from "@reduxjs/toolkit";
import { Circles } from "react-loader-spinner";
import { v4 as uuidv4 } from "uuid";

const QuestionScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { questions, currentQuestionIndex, answers, loading, error } =
    useSelector((state) => state.questions);
  const selectedCategoryID = useSelector(
    (state) => state.categories.selectedCategory
  );
  const selectedGameID = useSelector((state) => state.categories.selectedGame);
  const selectedLanguage =
    useSelector((state) => state.categories.selectedLanguage) || "en";
  const token = useSelector((state) => state.auth.jwt);
  const [userAnswers, setUserAnswers] = useState([]);
  const [selectedAnswerID, setSelectedAnswerID] = useState(null);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [timer, setTimer] = useState(10);
  const [screenBgColor, setScreenBgColor] = useState("#580DA4");
  const [answerBgColors, setAnswerBgColors] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isOptionSelected, setIsOptionSelected] = useState(false);
  const { selectedPack } = location.state || {};
  const activeIndex = currentQuestionIndex;
  const [statuses, setStatuses] = useState([]);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const gameReference = uuidv4();
  const [answerSubmitted, setAnswerSubmitted] = useState(false);

  useEffect(() => {
    dispatch(getCategories());
    dispatch(getGames());
  }, [dispatch]);

  useEffect(() => {
    if (!selectedPack) {
      setErrorMessage("Selected question pack is not available.");
      return;
    }

    const packId = selectedPack?.questionPackId;

    if (selectedCategoryID && selectedGameID && packId) {
      dispatch(
        fetchUserQuestions({
          categoryID: selectedCategoryID,
          gameID: selectedGameID,
          packId,
        })
      )
        .then(unwrapResult)
        .then((result) => {
          dispatch(setQuestions(result.data));
          setErrorMessage("");
          dispatch(setCurrentQuestionIndex(0));
          resetQuestionState();
        })
        .catch((err) => {
          console.error("Error fetching questions:", err);
          const errorMessage =
            err.response?.data?.message || "An unknown error occurred";
          setErrorMessage(errorMessage);
        });
    } else {
      setErrorMessage("Pack ID is missing.");
    }
  }, [
    dispatch,
    selectedPack,
    selectedGameID,
    selectedCategoryID,
    selectedLanguage,
    token,
  ]);

  const resetQuestionState = () => {
    setSelectedAnswerID(null);
    setSelectedAnswerIndex(null);
    setIsOptionSelected(false);
    setTimer(10);
    setAnswerBgColors([]);
    setFeedbackText("");
    setScreenBgColor("#580DA4");
  };

 

  const handleAnswerSubmission = useCallback(
    async (isTimeout = false) => {
      const currentQuestion = questions[currentQuestionIndex] || {};
      const questionID = currentQuestion?.id;
  
      const isCorrect = answers[selectedAnswerIndex]?.isCorrectAnswer === true;
  
      const newStatuses = [...statuses];
      newStatuses[currentQuestionIndex] = isCorrect ? "correct" : "wrong";
      setStatuses(newStatuses);
  
      if (!isTimeout && selectedAnswerID !== null) {
        // When an option is selected
        console.log("Selected answer recorded:", selectedAnswerID); 
        
        setUserAnswers((prevAnswers) => {
          const updatedAnswers = [
            ...prevAnswers,
            { questionID: questionID, selectedAnswerID: selectedAnswerID }
          ];
          
          // Log updated answers to check
          console.log("Updated answers:", updatedAnswers);
          
          return updatedAnswers;
        });
  
        const newAnswerBgColors = answers.map((answer, index) => {
          if (index === selectedAnswerIndex) {
            return isCorrect ? "#5CBE5A" : "#E37F80"; // Green for correct, red for wrong
          }
          return answer.isCorrectAnswer ? "#5CBE5A" : "";
        });
  
        setAnswerBgColors(newAnswerBgColors);
        setScreenBgColor("#4C22B8");
  
        setFeedbackText(isCorrect ? "Nice! Correct" : "Oops! Wrong");
        setCorrectAnswers((prev) => (isCorrect ? prev + 1 : prev));
        setWrongAnswers((prev) => (isCorrect ? prev : prev + 1));
      } else if (isTimeout) {
        // Handle the timeout case
        console.log("Timeout triggered for question:", questionID); // Debugging
        setWrongAnswers((prev) => prev + 1); // Automatically count as wrong
      }
  
      const nextIndex = currentQuestionIndex + 1;
      if (nextIndex < questions.length) {
        // Move to the next question
        dispatch(setCurrentQuestionIndex(nextIndex));
        resetQuestionState(); // Reset state for the next question
      } else {
        // Ensure the last answer is submitted correctly before navigating
        const finalAnswers = [
          ...userAnswers,
          { questionID: questionID, selectedAnswerID: selectedAnswerID }
        ];
  
        console.log("Final answers before submission:", finalAnswers); 
  
        await submitAnswerPack(finalAnswers);
  
        console.log("Navigating to result page after submitting all answers.");
        navigate("/result-page", {
          state: { correctAnswers, wrongAnswers, selectedPack },
        });
      }
    },
    [
      selectedAnswerID,
      selectedAnswerIndex,
      answers,
      currentQuestionIndex,
      questions.length,
      dispatch,
      userAnswers,
      correctAnswers,
      wrongAnswers,
      navigate,
      selectedPack,
    ]
  );
  
  

const submitAnswerPack = async (answers) => {
  const userAnswerData = {
    questionPackID: selectedPack.questionPackId,
    gameID: selectedGameID,
    gameReference: gameReference,
    answers,
  };

  try {
    await dispatch(submitAnswer(userAnswerData));
    navigate("/result-page", {
      state: { 
        correctAnswers, 
        wrongAnswers, 
        // totalAnswered: correctAnswers + wrongAnswers, 
        selectedPack ,
      },
    });
  } catch (error) {
    console.error("Error submitting answers:", error);
    setErrorMessage("Failed to submit answers. Please try again.");
  }
};


  const handleAnswerClick = useCallback(
    (index) => {
      if (selectedAnswerIndex === null) {
        setSelectedAnswerIndex(index);
        setIsOptionSelected(true);

        setScreenBgColor("#0B0B2A");

        setAnswerBgColors(
          answers.map((_, i) => (i === index ? "#973CF2" : ""))
        );
        setSelectedAnswerID(answers[index].id);
        setAnswerSubmitted(true);
        // handleAnswerSubmission();
        // setIsTimerActive(false);
      }
    },
    [selectedAnswerIndex, answers, setAnswerSubmitted]
  );



  useEffect(() => {
    if (!loading && questions.length > 0) {
      const timerInterval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer === 1) {
            clearInterval(timerInterval);
            handleAnswerSubmission();
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);

      return () => clearInterval(timerInterval);
    }
  }, [loading, questions.length, handleAnswerSubmission]);

  useEffect(() => {
    if (answerSubmitted) {
      const newAnswerBgColors = answers.map((answer, index) => {
        if (index === selectedAnswerIndex) {
          return answers[selectedAnswerIndex].isCorrectAnswer
            ? "#5CBE5A"
            : "#E37F80";
        }
        return answer.isCorrectAnswer ? "#5CBE5A" : "";
      });
      setAnswerBgColors(newAnswerBgColors);
      setAnswerSubmitted(false);
    }
  }, [answerSubmitted, answers, selectedAnswerIndex]);

  const handleQuit = () => {
    setScreenBgColor("#1F82F2");
    setShowModal(true);
  };

  const handleEndGame = () => {
    navigate("/result-page", {
      state: { correctAnswers, wrongAnswers, selectedPack },
    });
  };

  const handlePageChange = (newIndex) => {
    dispatch(setCurrentQuestionIndex(newIndex));
    resetQuestionState();
  };

  const currentQuestion = questions[currentQuestionIndex] || [];

  return (
    <div
      className={`question-screen ${showModal ? "modal-active" : ""}`}
      style={{ backgroundColor: screenBgColor }}
    >
      <div className="timer-container">
        <div className="timer-wrapper">
          <div className="timer">
            <img className="img-timer" src={Timer} alt="timer" />
            <p>{timer}</p>
          </div>
          <div className="quit-div">
            <p className="quit" onClick={handleQuit}>
              Quit
            </p>
          </div>
        </div>
      </div>

      <main className="main-container">
        {loading ? (
          <Circles color="#D9D9D9" height={20} width={20} />
        ) : errorMessage ? (
          <div className="error-message">{errorMessage}</div>
        ) : (
          <>
            <div className="quest-main-container">
              <p className="question-txt">{currentQuestion?.question}</p>

              <Pagination
                totalItems={questions.length}
                activeIndex={activeIndex}
                onChange={handlePageChange}
                statuses={statuses}
              />

              <div className="answer-container">
                <div className="answer-card">
                  {answers.map((answer, index) => (
                    <div
                      key={index}
                      className={`answer-option ${
                        selectedAnswerIndex === index ? "selected" : ""
                      }`}
                      style={{ backgroundColor: answerBgColors[index] || "" }}
                      onClick={() => handleAnswerClick(index)}
                    >
                      <span className="answer-content">
                        {answer.answerText}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </main>
      <EndGameModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onEnd={handleEndGame}
      />
    </div>
  );
};

export default QuestionScreen;

