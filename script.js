'use strict';

const semestersRow = document.querySelector('.semesters_row');
const semestersCol = document.querySelector('.semesters_col');
for (let i = 0; i < 3; i++) {
  semestersCol.appendChild(semestersRow.cloneNode(true));
}

const fieldsCredits = document.getElementsByClassName('credit_input');
const fieldsGrades = document.getElementsByClassName('grade_input');
const fieldsSubjects = document.getElementsByClassName('subject_input');

const currentCreditsFields = document.querySelectorAll('.current_credit');
const currentGPAsFields = document.querySelectorAll('.current_gpa');
const totalCreditsFields = document.querySelectorAll('.total_credits');
const totalGPAsFields = document.querySelectorAll('.total_gpa');

const studentName = document.getElementById('name_input');
const studentSurname = document.getElementById('surname_input');
const studentDateBirth = document.getElementById('date_birth_input');

const faculty = document.getElementById('faculty_input');
const specialty = document.getElementById('specialty_input');
const degree = document.getElementById('degree_input');

const langEducation = document.getElementById('language_input');
const eduStart = document.getElementById('edu_start_input');
const eduEnd = document.getElementById('edu_end_input');

const responsibles = document.querySelectorAll('.responsible_input');

const btnClean = document.querySelector('.btn_clean');
const btnCalc = document.querySelector('.btn_calc');
const btnExport = document.querySelector('.btn_export');

const romanNums = {
  1: 'I',
  2: 'II',
  3: 'III',
  4: 'IV',
  5: 'V',
  6: 'VI',
  7: 'VII',
  8: 'VIII',
};

const textSemester = document.querySelectorAll('.semester_text');
for (let i = 0; i < textSemester.length; i++) {
  textSemester[i].textContent = `Semester ${romanNums[i + 1]}`;
}

// To get all inputs, after some event (click of button)
function getInputs() {
  const grades = [];
  const credits = [];
  const subjs = [];
  const details = {
    name: studentName.value.trim(),
    surname: studentSurname.value.trim(),
    birth_date: studentDateBirth.value,

    faculty: faculty.value.trim(),
    specialty: specialty.value.trim(),
    degree: degree.value.trim(),
    langEducation: langEducation.value.trim(),

    eduStart: eduStart.value,
    eduEnd: eduEnd.value,

    responsible_1: responsibles[0].value.trim(),
    responsible_2: responsibles[1].value.trim(),
  };

  for (let i = 0; i < 8; i++) {
    const semGrades = [];
    const semCredits = [];
    const semSubjs = [];

    for (let j = i * 6; j < i * 6 + 6; j++) {
      semGrades.push(Number(fieldsGrades[j].value));

      semCredits.push(Number(fieldsCredits[j].value));

      semSubjs.push(fieldsSubjects[j].value);
    }

    grades.push(semGrades);
    credits.push(semCredits);
    subjs.push(semSubjs);
  }
  return [credits, grades, subjs, details];
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

      const creditSet = new Set(credits[i]);
      if (creditSet.size === 1 && creditSet.has(0)) {
        totalGPAs.push('0.00');
      } else {
        for (let j = 0; j <= i; j++) {
          totalSemCredits = [...totalSemCredits, ...credits[j]];
          totalSemGrades = [...totalSemGrades, ...grades[j]];
        }

        semTotalGPA = calcGPA(totalSemCredits, totalSemGrades);
        totalGPAs.push(semTotalGPA);
      }
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
  /* const savedData = JSON.parse(localStorage.getItem('inputData'));
  const {
    details,
    subjs,
    credits,
    grades,
    currentCredits,
    totalCredits,
    currentGPAs,
    totalGPAs,
  } = savedData; */
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
    fieldsSubjects[i].value = '';
  }

  /* for (let i = 0; i < fieldsCredits.length; i++) {
    for (let j = i * 6; j < j + 6; j++) {
      console.log(credits[Math.trunc(i)]);
      fieldsCredits[j].value = credits[Math.trunc(i)][j];
      fieldsGrades[j].value = grades[Math.trunc(i)][j];
      fieldsSubjects[j].value = subjs[Math.trunc(i)][j];
    }
  } */
}

// Saving to local memory
function saveLocal(title, value) {
  localStorage.removeItem(title);
  localStorage.setItem(title, JSON.stringify(value));
}

// Loading the Page
init();

// Clean the table
btnClean.addEventListener('click', function () {
  init();
});

// Calculate
btnCalc.addEventListener('click', function () {
  const [credits, grades, subjs, details] = getInputs();

  const currentCredits = sumCurrentCredits(credits);
  const totalCredits = sumTotalCredits(credits);

  const currentGPAs = calcCurrentGPAs(credits, grades);
  const totalGPAs = calcTotalGPAs(credits, grades);

  fillTable(currentCredits, currentGPAs, totalCredits, totalGPAs);

  const inputData = {
    details,
    subjs,
    credits,
    grades,
    currentCredits,
    totalCredits,
    currentGPAs,
    totalGPAs,
  };
  saveLocal('inputData', inputData);

  /* saveLocal('credits', credits);
  saveLocal('grades', grades);
  saveLocal('currentCredits', currentCredits);
  saveLocal('totalCredits', totalCredits);
  saveLocal('currentGPAs', currentGPAs);
  saveLocal('totalGPAs', totalGPAs); */
});

btnExport.addEventListener('click', function () {
  window.open('transcript.html', '_blank');
});

console.log(JSON.parse(localStorage.getItem('inputData')));
