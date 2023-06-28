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

const jsonFileInput = document.getElementById('json_file');

const btnClean = document.querySelector('.btn_clean');
const btnCalc = document.querySelector('.btn_calc');
const btnExport = document.querySelector('.btn_export');
const btrFill = document.querySelector('.btn_fill');

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

// Fill subject, credits and grades
function fillTranscript(subjects=null, credits=null, grades=null){
  const length = credits ? credits.length : fieldsCredits.length;
  for (let i = 0; i < length; i++){
    fieldsCredits[i].value = credits ? credits[i] : '';
    fieldsGrades[i].value = grades ? grades[i] : '';
    fieldsSubjects[i].value = subjects ? subjects[i] : '';
  } 
}

// To fill last two rows of the tables (Current and Total fields) with calculated variables
function fillTable(currentCredits, currentGPAs, totalCredits, totalGPAs, fromStorage=false) {
  if(!fromStorage){
    for (let i = 0; i < currentCredits.length; i++) {
      currentCreditsFields[i].textContent = currentCredits[i];
      currentGPAsFields[i].textContent = currentGPAs[i];
      totalCreditsFields[i].textContent = totalCredits[i];
      totalGPAsFields[i].textContent = totalGPAs[i];
    }
  }else{
    const storageInput = getLocal('inputData');

    studentName.value = storageInput.details.name;
    studentSurname.value = storageInput.details.surname;
    studentDateBirth.value = storageInput.details.birth_date;

    faculty.value = storageInput.details.faculty;
    specialty.value = storageInput.details.specialty;
    degree.value = storageInput.details.degree;

    langEducation.value = storageInput.details.langEducation;
    eduStart.value = storageInput.details.eduStart;
    eduEnd.value = storageInput.details.eduEnd;

    responsibles[0].value = storageInput.details.responsible_1;
    responsibles[1].value = storageInput.details.responsible_2;

    let allSubj = [];
    let allCredits = [];
    let allGrades = [];

    for (let i = 0; i < storageInput.credits.length; i++) {
      allSubj = [...allSubj, ...storageInput.subjs[i]];
      allCredits = [...allCredits, ...storageInput.credits[i]];
      allGrades = [...allGrades, ...storageInput.grades[i]];
    }

    fillTranscript(allSubj, allCredits, allGrades);
  }
}

// Initial conditions
function init() {
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

  fillTranscript();
}

// Saving to local memory
function saveLocal(title, value) {
  sessionStorage.removeItem(title);
  sessionStorage.setItem(title, JSON.stringify(value));
}

// Getting from local memory
function getLocal(title) {
  const value = sessionStorage.getItem(title);
  return JSON.parse(value);
}

// Loading the Page
init();

jsonFileInput.addEventListener('change', function (event) {
  const file = event.target.files[0];

  const reader = new FileReader();
  reader.onload = (e) => {
    let fileContent = e.target.result;
    fileContent = JSON.parse(fileContent);
    saveLocal('inputData', fileContent);
  };

  reader.readAsText(file);
})

// Fill from a json file
btrFill.addEventListener('click', function() {
  fillTable(null, null, null, null, true);
})

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
});

btnExport.addEventListener('click', function () {
  window.open('transcript.html', '_blank');
});

semestersCol.addEventListener('keydown', function(event){
  const key = event.key;
  const target_class = event.target.classList[event.target.classList.length - 1];
  const childId = {'subject_input':1, 'credit_input':2, 'grade_input':3};

  switch(key){
    case 'ArrowUp':
      event.preventDefault;
      event.target.parentNode.previousSibling.previousSibling.children[childId[target_class]].focus();
      break;
      
    case 'ArrowDown':
      event.target.parentNode.nextSibling.nextSibling.children[childId[target_class]].focus();
      break;

    case 'ArrowLeft':
      event.target.parentNode.children[childId[target_class]-1].focus();
      break;
    
    case 'ArrowRight':
      event.target.parentNode.children[childId[target_class]+1].focus();
      break;
  }
})
