'use strict';

const fieldsCredits = document.getElementsByClassName('credit_input');
const fieldsGrades = document.getElementsByClassName('grade_input');

const currentCreditsFields = document.querySelectorAll('.current_credit');
const currentGPAsFields = document.querySelectorAll('.current_gpa');
const totalCreditsFields = document.querySelectorAll('.total_credits');
const totalGPAsFields = document.querySelectorAll('.total_gpa');

const btnClean = document.querySelector('.btn_clean');
const btnCalc = document.querySelector('.btn_calc');

// To get all inputs, after some event (click of button)
function getInputs() {
  const grades = [];
  const credits = [];

  for (let i = 0; i < 8; i++) {
    const semGrades = [];
    const semCredits = [];

    for (let j = i * 8; j < i * 8 + 8; j++) {
      semGrades.push(Number(fieldsGrades[j].value));

      semCredits.push(Number(fieldsCredits[j].value));
    }

    grades.push(semGrades);
    credits.push(semCredits);
  }
  return [credits, grades];
}

// To calculate GPA for given credits and grades
function calcGPA(credits, grades) {
  let sumCreds = sumCredits(credits);
  let sumGrades = 0;
  let semGPA = 0;

  if (credits.length === grades.length) {
    for (let i = 0; i < credits.length; i++) {
      sumGrades += credits[i] * grades[i];
    }

    if (sumCreds > 0) {
      semGPA = sumGrades / sumCreds;
      semGPA = Math.round(semGPA * 100) / 100;
      return semGPA.toFixed(2);
    } else {
      return '0.00';
    }
  }
}

// To calculate local (current) GPAs for all semesters
function calcCurrentGPAs(credits, grades) {
  const currentGPAs = [];

  if (credits.length === grades.length) {
    for (let i = 0; i < credits.length; i++) {
      currentGPAs.push(calcGPA(credits[i], grades[i]));
    }

    return currentGPAs;
  }
}

// To calculate global (total) GPAs for all semesters
function calcTotalGPAs(credits, grades) {
  const totalGPAs = [];

  if (credits.length === grades.length) {
    for (let i = 0; i < credits.length; i++) {
      let totalSemCredits = [];
      let totalSemGrades = [];
      let semTotalGPA = 0;

      for (let j = 0; j <= i; j++) {
        totalSemCredits = [...totalSemCredits, ...credits[j]];
        totalSemGrades = [...totalSemGrades, ...grades[j]];
      }

      semTotalGPA = calcGPA(totalSemCredits, totalSemGrades);
      totalGPAs.push(semTotalGPA);
    }

    return totalGPAs;
  }
}

// To sum credits
function sumCredits(credits) {
  let sumCredits = 0;

  for (let i = 0; i < credits.length; i++) {
    sumCredits += credits[i];
  }

  return sumCredits;
}

// To sum local credits of semester
function sumCurrentCredits(credits) {
  const currentCredits = [];

  for (let i = 0; i < credits.length; i++) {
    let sum = sumCredits(credits[i]);
    currentCredits.push(sum.toFixed(1));
  }

  return currentCredits;
}

// To calculate global credits of semester
function sumTotalCredits(credits) {
  const totalCredits = [];
  let sum = 0;
  for (let i = 0; i < credits.length; i++) {
    let tempSum = sumCredits(credits[i]);
    if (tempSum === 0) {
      totalCredits.push('0.0');
    } else {
      sum += tempSum;
      totalCredits.push(sum.toFixed(1));
    }
  }

  return totalCredits;
}

// To fill last two rows of the tables (Current and Total fields) with calculated variables
function fillTable(currentCredits, currentGPAs, totalCredits, totalGPAs) {
  for (let i = 0; i < currentCredits.length; i++) {
    currentCreditsFields[i].textContent = currentCredits[i];
    currentGPAsFields[i].textContent = currentGPAs[i];
    totalCreditsFields[i].textContent = totalCredits[i];
    totalGPAsFields[i].textContent = totalGPAs[i];
  }
}

// Initial conditions
function init() {
  //const initCredits = new Array(fieldsCredits.length).fill('0.0');
  //const initGrades = new Array(fieldsGrades.length).fill('0.00');
  const initCurrentCredits = new Array(currentCreditsFields.length).fill('0.0');
  const initCurrentGPAs = new Array(currentGPAsFields.length).fill('0.00');
  const initTotalCredits = new Array(totalCreditsFields.length).fill('0.0');
  const initTotalGPAs = new Array(totalGPAsFields.length).fill('0.00');

  fillTable(
    initCurrentCredits,
    initCurrentGPAs,
    initTotalCredits,
    initTotalGPAs
  );

  for (let i = 0; i < fieldsCredits.length; i++) {
    fieldsCredits[i].value = undefined;
    fieldsGrades[i].value = undefined;
  }
}

// Loading the Page
init();

// Clean the table
btnClean.addEventListener('click', function () {
  init();
});

// Calculate
btnCalc.addEventListener('click', function () {
  const [credits, grades] = getInputs();

  const currentCredits = sumCurrentCredits(credits);
  const totalCredits = sumTotalCredits(credits);

  const currentGPAs = calcCurrentGPAs(credits, grades);
  const totalGPAs = calcTotalGPAs(credits, grades);

  fillTable(currentCredits, currentGPAs, totalCredits, totalGPAs);
});
