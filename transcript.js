'use strict';

const facultyBlank = document.getElementById('faculty_blank');
const studentSurnameNameBlank = document.getElementById(
  'surname_and_name_blank'
);
const dateBirthBlank = document.getElementById('date_of_birth_blank');
const specialtyBlank = document.getElementById('specialty_blank');
const degreeBlank = document.getElementById('degree_of_edu_blank');
const languageBlank = document.getElementById('language_of_inst_blank');

const totalCreditsBlank = document.getElementById('total_credits_blank');
const totalGPABlank = document.getElementById('total_GPA_blank');
const eduStartBlank = document.getElementById('edu_start_blank');
const eduEndBlank = document.getElementById('edu_end_blank');

const dateIssueBlank = document.getElementById('date_issue_blank');

const responsibleFirst = document.getElementById('responsible_1');
const responsibleSecond = document.getElementById('responsible_2');

// Opening data from local memory
function openLocalMemory(title) {
  const data = sessionStorage.getItem(title);
  return JSON.parse(data);
}

const inputData = openLocalMemory('inputData');
const {
  details,
  subjs,
  credits,
  grades,
  currentCredits,
  totalCredits,
  currentGPAs,
  totalGPAs,
} = inputData;

/* const credits = openLocalMemory('credits');
const grades = openLocalMemory('grades');
const currentCredits = openLocalMemory('currentCredits');
const totalCredits = openLocalMemory('totalCredits');
const currentGPAs = openLocalMemory('currentGPAs');
const totalGPAs = openLocalMemory('totalGPAs'); */
const gradeLetters = [];
const semesters = [
  'Semester I',
  'Semester II',
  'Semester III',
  'Semester IV',
  'Semester V',
  'Semester VI',
  'Semester VII',
  'Semester VIII',
];

let numSems = 0;
for (let i = 0; i < totalGPAs.length; i++) {
  numSems += totalGPAs[i] === '0.00' ? 0 : 1;
}

for (let i = 0; i < grades.length; i++) {
  gradeLetters.push([]);
  for (const el of grades[i]) {
    let t = Number(el);
    let lette =
      (t < 51 && 'F') ||
      (t < 61 && 'E') ||
      (t < 71 && 'D') ||
      (t < 81 && 'C') ||
      (t < 91 && 'B') ||
      'A';
    gradeLetters[i].push(lette);
  }
}

let numSubj = 0;
for (let i = 0; i < 6; i++) {
  subjs.push([]);
  for (let j = 0; j < 6; j++) {
    if (subjs[i][j]) {
      numSubj += 1;
      subjs[i][j] = `${numSubj}. ` + subjs[i][j];
    } else {
      subjs[i][j] = '';
      credits[i][j] = '';
      grades[i][j] = '';
      gradeLetters[i][j] = '';
    }
  }
}

credits.unshift('Credits');
grades.unshift('Grade in Points');
currentCredits.unshift('Semes- ter Credits');
totalCredits.unshift('Total Credits');
currentGPAs.unshift('GPA');
totalGPAs.unshift('Total GPA');
gradeLetters.unshift('Grade in Letter');
semesters.unshift('');
subjs.unshift('Name of the Subject');
console.log(totalCredits);

const tableData = [
  semesters,
  subjs,
  credits,
  grades,
  gradeLetters,
  currentCredits,
  currentGPAs,
  totalCredits,
  totalGPAs,
];

for (let i = 2; i < tableData.length; i++) {
  for (let j = 0; j < tableData[i].length; j++) {
    if (j >= numSems + 1) {
      if (Array.isArray(tableData[i][j])) {
        for (let k = 0; k < tableData[i][j].length; k++) {
          tableData[i][j][k] = '';
        }
      } else {
        tableData[i][j] = '';
      }
    }
  }
}

// Creating table
function createTable(row, col) {
  const body = document.body;
  const tbl = document.createElement('table');
  tbl.style.width = '200px';
  tbl.style.border = '1px solid black';

  for (let i = 0; i < row; i++) {
    const tr = tbl.insertRow();
    for (let j = 0; j < col; j++) {
      const td = tr.insertCell();
      td.appendChild(document.createTextNode(`${i}-${j}`));
      td.style.border = '1px solid black';
    }
  }
  body.appendChild(tbl);
}

function formatDate(date) {
  return `${date.slice(8, 10)}.${date.slice(5, 7)}.${date.slice(0, 4)}`;
}

function fillDetails() {
  facultyBlank.textContent = details.faculty;
  studentSurnameNameBlank.textContent = details.name + ' ' + details.surname;
  dateBirthBlank.textContent = formatDate(details.birth_date);

  specialtyBlank.textContent = details.specialty;
  degreeBlank.textContent = details.degree;
  languageBlank.textContent = details.langEducation;

  totalCreditsBlank.textContent = totalCredits[numSems];
  totalGPABlank.textContent = totalGPAs[numSems];
  eduStartBlank.textContent = formatDate(details.eduStart);
  eduEndBlank.textContent = formatDate(details.eduEnd);

  responsibleFirst.textContent = details.responsible_1;
  responsibleSecond.textContent = details.responsible_2;

  const currentDate = new Date();
  dateIssueBlank.textContent = `${
    (String(currentDate.getDate()).length === 1 &&
      '0' + currentDate.getDate()) ||
    currentDate.getDate()
  }.${
    (String(currentDate.getMonth()).length === 1 &&
      '0' + currentDate.getMonth()) ||
    currentDate.getMonth()
  }.${currentDate.getFullYear()}`;
}

function createSubjectTabel() {
  const subTabel = document.querySelector('.table_subjects');
  const tbl = document.createElement('table');
  tbl.style.width = '18cm';

  for (let i = 0; i < 9; i++) {
    const tr = tbl.insertRow();
    for (let j = 0; j < 9; j++) {
      const td = tr.insertCell();
      if (i === 0 || j === 0) {
        td.appendChild(document.createTextNode(tableData[j][i]));
      } else if (1 <= j && j <= 4) {
        let t = '';
        for (let k = 0; k < 6; k++) {
          // t = k === 5 ? tableData[j][i][k] : tableData[j][i][k] + '\n';
          // console.log(j, i, k, t);
          t = tableData[j][i][k] ? tableData[j][i][k] : '';
          td.appendChild(document.createTextNode(t));
          td.appendChild(document.createElement('br'));
        }
      } else {
        td.appendChild(document.createTextNode(tableData[j][i]));
      }

      switch (j) {
        case 0:
          td.classList.add('transcript_col_sems');
          break;
        case 1:
          td.classList.add('transcript_col_subjs');
          break;
        default:
          td.classList.add('transcript_col_nums');
          break;
      }
    }
  }

  subTabel.appendChild(tbl);
}

$(document).ready(function () {
  $('#btn_download').click(function () {
    $('.page').printThis({
      importCSS: true,
      importStyle: true,
      loadCSS: './transcript.css',
    });
  });
});

fillDetails();
createSubjectTabel();

/* console.log(
  credits,
  grades,
  currentCredits,
  totalCredits,
  currentGPAs,
  totalGPAs,
  gradeLetters,
  semesters,
  subjects
); */
