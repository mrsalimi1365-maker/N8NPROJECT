(() => {
  'use strict';

  const STORAGE_KEY = 'brightviewSurveyResponse';
  const identityStep = document.getElementById('identityStep');
  const surveyStep = document.getElementById('surveyStep');
  const successStep = document.getElementById('successStep');
  const identityForm = document.getElementById('identityForm');
  const surveyForm = document.getElementById('surveyForm');
  const firstName = document.getElementById('firstName');
  const lastName = document.getElementById('lastName');
  const nameGreeting = document.getElementById('nameGreeting');
  const successName = document.getElementById('successName');
  const progressBar = document.getElementById('progressBar');
  const stepLabel = document.getElementById('stepLabel');
  const progressPercent = document.getElementById('progressPercent');
  const comments = document.getElementById('comments');
  const characterCount = document.getElementById('characterCount');

  const getSavedResponse = () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    } catch (error) {
      return null;
    }
  };

  const setProgress = (step) => {
    const complete = step === 3;
    const percentage = complete ? 100 : step === 2 ? 100 : 50;
    stepLabel.textContent = complete ? 'Complete' : `Step ${step} of 2`;
    progressPercent.textContent = `${percentage}%`;
    progressBar.style.width = `${percentage}%`;
  };

  const showSurvey = () => {
    identityStep.classList.add('hidden');
    surveyStep.classList.remove('hidden');
    successStep.classList.add('hidden');
    nameGreeting.textContent = firstName.value.trim();
    setProgress(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showIdentity = () => {
    identityStep.classList.remove('hidden');
    surveyStep.classList.add('hidden');
    successStep.classList.add('hidden');
    setProgress(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showSuccess = (response) => {
    identityStep.classList.add('hidden');
    surveyStep.classList.add('hidden');
    successStep.classList.remove('hidden');
    successName.textContent = response.firstName;
    setProgress(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const validateName = (input, errorId, label) => {
    const error = document.getElementById(errorId);
    const valid = input.value.trim().length > 0;
    input.classList.toggle('invalid', !valid);
    error.textContent = valid ? '' : `${label} is required.`;
    return valid;
  };

  identityForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const validFirst = validateName(firstName, 'firstNameError', 'First name');
    const validLast = validateName(lastName, 'lastNameError', 'Last name');
    if (validFirst && validLast) showSurvey();
  });

  [firstName, lastName].forEach((input) => input.addEventListener('input', () => {
    input.classList.remove('invalid');
    document.getElementById(`${input.id}Error`).textContent = '';
  }));

  comments.addEventListener('input', () => { characterCount.textContent = comments.value.length; });
  document.getElementById('backButton').addEventListener('click', showIdentity);

  surveyForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const satisfaction = surveyForm.querySelector('input[name="satisfaction"]:checked');
    const ease = surveyForm.querySelector('input[name="ease"]:checked');
    const surveyError = document.getElementById('surveyError');
    if (!satisfaction || !ease) {
      surveyError.textContent = 'Please answer both questions before submitting.';
      return;
    }
    surveyError.textContent = '';
    const response = {
      firstName: firstName.value.trim(),
      lastName: lastName.value.trim(),
      satisfaction: satisfaction.value,
      ease: ease.value,
      comments: comments.value.trim(),
      submittedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(response));
    showSuccess(response);
  });

  document.getElementById('newResponseButton').addEventListener('click', () => {
    localStorage.removeItem(STORAGE_KEY);
    identityForm.reset();
    surveyForm.reset();
    characterCount.textContent = '0';
    showIdentity();
    firstName.focus();
  });

  const saved = getSavedResponse();
  if (saved && saved.firstName && saved.lastName && saved.satisfaction && saved.ease) {
    showSuccess(saved);
  } else if (saved && saved.firstName && saved.lastName) {
    firstName.value = saved.firstName;
    lastName.value = saved.lastName;
    showSurvey();
  }
})();
