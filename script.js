$(document).ready(function () {
  const questions = [
    {
      question:
        "India’s first-ever national police museum will establish in which city?",
      options: ["Chennai", "Delhi", "Nagpur", "Kolkata"],
      answer: "Delhi",
    },
    {
      question: "Which country will host the 45th G7 summit 2019?",
      options: ["Italy", "Germany", "France", "Canada"],
      answer: "France",
    },
    {
      question:
        "Which country’s women cricket team has clinched the Asia Cup Twenty-20 tournament 2018?",
      options: ["South Korea", "Bangladesh", "India", "Pakistan"],
      answer: "Bangladesh",
    },
    {
      question:
        "Who has won the men’s singles French Open tennis tournament 2018?",
      options: [
        "Novak Djokovic",
        "Dominic Thiem",
        "Roger Federer",
        "Rafael Nadal",
      ],
      answer: "Rafael Nadal",
    },
    {
      question:
        "Which country’s football team has lifted the 2018 Intercontinental Cup football title?",
      options: ["India", "Sri Lanka", "Kenya", "Argentina"],
      answer: "India",
    },
    {
      question:
        "Which of the following personalities from India is the only winner of Special Oscar in the history of Indian Cinema so far?",
      options: ["Mrinal Sen", "Shyam Benegal", "Satyajit Ray", "Mira Nair"],
      answer: "Satyajit Ray",
    },
    {
      question: "Who wrote Arthashastra?",
      options: ["Kalhan", "Visakhadatta", "Bana Bhatta", "Chanakya"],
      answer: "Chanakya",
    },
    {
      question: "H.J. Kania was the first...",
      options: [
        "Chief Justice of the Supreme Court of India",
        "Attorney-General of India",
        "Solicitor-General of India",
        "None of them",
      ],
      answer: "Chief Justice of the Supreme Court of India",
    },
  ];

  const locations = [
    { id: "location1", questions: [] },
    { id: "location2", questions: [] },
    { id: "location3", questions: [] },
    { id: "location4", questions: [] },
  ];

  // Distribute questions among locations
  questions.forEach((q, index) => {
    locations[Math.floor(index / 2)].questions.push(q);
  });

  let answeredLocations = 0;
  let correctAnswers = 0;
  let wrongAnswers = 0;

  $(".location").click(function () {
    const locId = $(this).data("loc");
    const loc = locations.find((l) => l.id === "location" + locId);

    if (!loc.locked) {
      moveCharacterTo(locId, function () {
        showQuestions(loc);
      });
    }
  });

  function moveCharacterTo(locationId, callback) {
    const locElem = $("#location" + locationId);
    const top = locElem.position().top;
    const left = locElem.position().left;

    $("#character").animate(
      {
        top: top,
        left: left,
      },
      1000,
      callback
    );
  }

  function showQuestions(loc) {
    const container = $("#questions-container");
    container.empty();

    loc.questions.forEach((q, index) => {
      const questionHtml = `
              <div class="question">
                  <p>${index + 1}.&nbsp;${q.question}</p>
                  <div class="options">
                      ${q.options
                        .map(
                          (opt, i) => `
                          <div class="form-check">
                          <input class="form-check-input" type="radio" name="q${index}" value="${opt}">
                          <label class="form-check-label">${opt}</label>                            
                      </div>
                      `
                        )
                        .join("")}
                  </div>
              </div>
          `;
      container.append(questionHtml);
    });

    $("#quizModal").modal("show");

    $("#quiz-form")
      .off("submit")
      .on("submit", function (event) {
        event.preventDefault();

        loc.locked = true;
        $("#" + loc.id)
          .addClass("locked")
          .off("click");
        answeredLocations++;

        // Evaluate answers
        $(this)
          .find('input[type="radio"]:checked')
          .each(function () {
            const userAnswer = $(this).val();
            const questionIndex = $(this).attr("name").replace("q", "");
            const correctAnswer = loc.questions[questionIndex].answer;

            if (userAnswer === correctAnswer) {
              correctAnswers++;
            } else {
              wrongAnswers++;
            }
          });

        $("#quizModal").modal("hide");

        if (answeredLocations === locations.length) {
          showResults();
        }
      });
  }

  function showResults() {
    const ctx = $("#resultChart")[0].getContext("2d");
    new Chart(ctx, {
      type: "pie",

      data: {
        labels: ["Correct", "Wrong"],
        title: ["Correct", "Wrong"],
        datasets: [
          {
            data: [correctAnswers, wrongAnswers],
            backgroundColor: ["#6b96fa", "#fff"],
          },
        ],
      },
    });

    $("#resultModal").modal("show");
  }
});
