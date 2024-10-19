document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("start-btn");
  const nextBtn = document.getElementById("next-btn");
  const restartBtn = document.getElementById("restart-btn");
  const questionContainer = document.getElementById("question-container");
  const questionText = document.getElementById("question-text");
  const choicesList = document.getElementById("choices-list");
  const resultContainer = document.getElementById("result-container");
  const scoreDisplay = document.getElementById("score");

  let questions = [];
  let currentQuestionIndex = 0;
  let score = 0;

  startBtn.addEventListener("click", async () => {
    await fetchQuestions();
    gsap.to(startBtn, { duration: 0.5, opacity: 0, y: 50, onComplete: startQuiz });
  });

  nextBtn.addEventListener("click", () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      showQuestion();
    } else {
      gsap.to(questionContainer, { duration: 0.5, opacity: 0, onComplete: showResult });
    }
  });

  restartBtn.addEventListener("click", () => {
    currentQuestionIndex = 0;
    score = 0;
    resultContainer.classList.add("hidden");
    gsap.to(resultContainer, { duration: 0.5, opacity: 0, onComplete: startQuiz });
  });

  async function fetchQuestions() {
    try {
      const response = await fetch("https://opentdb.com/api.php?amount=5&type=multiple"); 
      const data = await response.json();
      questions = data.results.map((questionData) => ({
        question: questionData.question,
        choices: [...questionData.incorrect_answers, questionData.correct_answer].sort(() => Math.random() - 0.5), 
        answer: questionData.correct_answer,
      }));
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  }

  function startQuiz() {
    resultContainer.classList.add("hidden");
    questionContainer.classList.remove("hidden");
    score = 0;
    currentQuestionIndex = 0;
    gsap.fromTo(questionContainer, { opacity: 0, y: 30 }, { duration: 0.5, opacity: 1, y: 0 });
    showQuestion();
  }

  function showQuestion() {
    nextBtn.classList.add("hidden");
    const question = questions[currentQuestionIndex];
    questionText.innerHTML = question.question; 
    choicesList.innerHTML = "";

    question.choices.forEach((choice) => {
      const li = document.createElement("li");
      li.textContent = choice;
      li.classList.add("cursor-pointer", "hover:bg-gray-700", "p-2", "rounded-lg");
      li.addEventListener("click", () => selectAnswer(choice, li));
      choicesList.appendChild(li);
    });

    gsap.fromTo("#choices-list li", { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.1 });
  }

  function selectAnswer(choice, liElement) {
    const correctAnswer = questions[currentQuestionIndex].answer;

    if (choice === correctAnswer) {
      score++;
      liElement.classList.add("bg-green-600");
    } else {
      liElement.classList.add("bg-red-600");
      Array.from(choicesList.children).forEach((li) => {
        if (li.textContent === correctAnswer) {
          li.classList.add("bg-green-600");
        }
      });
    }

    nextBtn.classList.remove("hidden");
    gsap.fromTo(nextBtn, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.3 });
  }

  function showResult() {
    questionContainer.classList.add("hidden");
    scoreDisplay.textContent = `${score} out of ${questions.length}`;
    resultContainer.classList.remove("hidden");
    gsap.fromTo(resultContainer, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5 });
  }
});
