(function () {
  const STORAGE_KEY = "student-feedback-responses";
  const questions = window.SURVEY_QUESTIONS;
  const form = document.getElementById("survey-form");
  const questionsElement = document.getElementById("questions");
  const formMessage = document.getElementById("form-message");
  const responseCount = document.getElementById("response-count");
  const averagesElement = document.getElementById("averages");
  const commentsElement = document.getElementById("comments");
  const clearButton = document.getElementById("clear-button");

  const ratingLabels = ["انتخاب کنید", "خیلی کم", "کم", "متوسط", "زیاد", "خیلی زیاد"];

  function renderQuestions() {
    questionsElement.innerHTML = questions.map(function (question, index) {
      const title = '<span class="question-number">' + (index + 1) + ".</span>" + question.text;
      if (question.type === "text") {
        return '<div class="question"><label for="' + question.id + '">' + title + '</label><textarea id="' + question.id + '" name="' + question.id + '" maxlength="500" placeholder="پاسخ شما (اختیاری)"></textarea></div>';
      }
      const options = ratingLabels.map(function (label, value) {
        return '<option value="' + value + '"' + (value === 0 ? " selected" : "") + '>' + label + '</option>';
      }).join("");
      return '<div class="question"><label for="' + question.id + '">' + title + '</label><select id="' + question.id + '" name="' + question.id + '" required>' + options + '</select></div>';
    }).join("");
  }

  function getResponses() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(saved) ? saved : [];
    } catch (error) {
      return [];
    }
  }

  function saveResponses(responses) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(responses));
  }

  function showMessage(text, kind) {
    formMessage.textContent = text;
    formMessage.className = "message " + kind;
  }

  function renderResults() {
    const responses = getResponses();
    responseCount.textContent = responses.length ? (responses.length + " پاسخ ثبت شده است.") : "هنوز پاسخی ثبت نشده است.";
    averagesElement.innerHTML = "";
    commentsElement.innerHTML = "";

    if (!responses.length) {
      return;
    }

    questions.filter(function (question) { return question.type === "rating"; }).forEach(function (question) {
      const total = responses.reduce(function (sum, response) {
        return sum + Number(response.answers[question.id] || 0);
      }, 0);
      const average = (total / responses.length).toFixed(1);
      averagesElement.insertAdjacentHTML("beforeend", '<div class="average-item"><strong>' + average + ' از ۵</strong><span>' + question.text + '</span></div>');
    });

    const comments = responses.filter(function (response) {
      return response.answers.suggestion && response.answers.suggestion.trim();
    });
    if (comments.length) {
      commentsElement.insertAdjacentHTML("beforeend", "<h3>پیشنهادهای ثبت‌شده</h3>");
      comments.forEach(function (response) {
        const article = document.createElement("article");
        article.className = "comment";
        const text = document.createElement("p");
        text.textContent = response.answers.suggestion;
        const date = document.createElement("small");
        date.textContent = new Date(response.createdAt).toLocaleString("fa-IR");
        article.append(text, date);
        commentsElement.appendChild(article);
      });
    }
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!form.checkValidity()) {
      showMessage("لطفاً به چهار سؤال امتیازی پاسخ دهید.", "error");
      form.reportValidity();
      return;
    }
    const data = new FormData(form);
    const answers = {};
    questions.forEach(function (question) {
      answers[question.id] = String(data.get(question.id) || "").trim();
    });
    const responses = getResponses();
    responses.push({ answers: answers, createdAt: new Date().toISOString() });
    saveResponses(responses);
    form.reset();
    showMessage("پاسخ شما با موفقیت ثبت شد. سپاسگزاریم!", "success");
    renderResults();
  });

  clearButton.addEventListener("click", function () {
    if (!getResponses().length) {
      showMessage("پاسخی برای حذف وجود ندارد.", "error");
      return;
    }
    if (window.confirm("آیا از حذف همه پاسخ‌ها مطمئن هستید؟")) {
      localStorage.removeItem(STORAGE_KEY);
      renderResults();
      showMessage("همه پاسخ‌ها حذف شدند.", "success");
    }
  });

  renderQuestions();
  renderResults();
})();
