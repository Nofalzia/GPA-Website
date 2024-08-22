document.addEventListener('DOMContentLoaded', function () {
    console.log('DOMContentLoaded event triggered.');
    loadTableData(); // This should handle adding initial rows if needed
    loadSemesterData();

    document.getElementById('calculateButton').addEventListener('click', calculateGPA);
    document.getElementById('addRowButton').addEventListener('click', addRow);
    document.getElementById('calculateCGPAButton').addEventListener('click', showCGPAPopup);
    document.getElementById('addSemesterButton').addEventListener('click', addSemesterRow);
    document.getElementById('calculateCGPA').addEventListener('click', calculateCGPA);

    document.querySelector('#gradesTable tbody').addEventListener('input', saveTableData);
    document.getElementById('semesterTable').addEventListener('input', saveSemesterData);

    document.getElementById('clearGPAandCGPA').addEventListener('click', clearGPAData);
    document.getElementById('clearGPAandCGPA').addEventListener('click', clearCGPAData);

    window.addEventListener('click', function(event) {
        const conversionPopup = document.getElementById('conversionPopup');
        const cgpaPopup = document.getElementById('cgpaPopup');
        if (event.target === conversionPopup) {
            closeConversionPopup();
        } else if (event.target === cgpaPopup) {
            closeCGPAPopup();
        }
    });
});

function addInitialRows() {
    console.log('Adding initial rows...');
    // Add 3 empty rows if there are no saved data
    for (let i = 0; i < 3; i++) {
        addRow();
    }
}

function loadTableData() {
    console.log('Loading table data...');
    const savedData = JSON.parse(localStorage.getItem('gradesTable'));

    if (savedData && savedData.length > 0) {
        console.log('Found saved data:', savedData);
        savedData.forEach((rowData) => {
            addRow(rowData);
        });
    } else {
        console.log("No saved data found, adding initial rows...");
        addInitialRows(); // Add two empty rows if no data is loaded
    }
}



function calculateGPA() {
    const tableRows = document.querySelectorAll('#gradesTable tbody tr');
    let totalPoints = 0;
    let totalCredits = 0;

    tableRows.forEach((row) => {
        // Get credit value
        const creditInput = row.cells[1].querySelector('input');
        const credit = parseFloat(creditInput.value);

        // Get grade value
        const gradeSelect = row.cells[2].querySelector('select');
        const grade = gradeSelect.value;

        // Debugging information
        console.log('Credit:', credit); 
        console.log('Grade:', grade); 

        // Only process rows with valid data
        if (!isNaN(credit) && credit > 0 && !isNaN(getGradePoint(grade))) {
            totalCredits += credit;
            totalPoints += getGradePoint(grade) * credit;
        }
    });

    // Calculate GPA
    const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;

    // Output GPA or an error message
    document.getElementById('result').innerText = totalCredits > 0 ? gpa.toFixed(2) : 'No valid data to calculate GPA';
}


function addRow(data = { subject: '', credit: '', grade: '' }) {
    console.log('Adding row with data:', data);
    const tableBody = document.querySelector('#gradesTable tbody');
    const newRow = tableBody.insertRow();

    for (let i = 0; i < 3; i++) {
        const cell = newRow.insertCell(i);
        const input = document.createElement(i === 2 ? 'select' : 'input');
        
        if (i === 2) {
            const grades = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F'];
            grades.forEach((grade) => {
                const option = document.createElement('option');
                option.value = grade;
                option.text = grade;
                input.add(option);
            });
            input.value = data.grade; // Set the grade value
        } else {
            input.type = i === 1 ? 'number' : 'text';
            input.style.width = '80%';
            input.style.height = '20px';
            input.value = i === 0 ? data.subject || '' : data.credit || '';
        }

        cell.appendChild(input);
    }
}


function getGradePoint(grade) {
    switch (grade.toUpperCase()) {
        case 'A':
            return 4.00;
        case 'A-':
            return 3.67;
        case 'B+':
            return 3.33;
        case 'B':
            return 3.00;
        case 'B-':
            return 2.67;
        case 'C+':
            return 2.33;
        case 'C':
            return 2.00;
        case 'C-':
            return 1.67;
        case 'D+':
            return 1.33;
        case 'D':
            return 1.00;
        case 'F':
            return 0.00;
        default:
            return NaN;
    }
}

function showConversionTable() {
    document.getElementById('conversionPopup').style.display = 'block';
}

function closeConversionPopup() {
    document.getElementById('conversionPopup').style.display = 'none';
}

function toggleButtons() {
    const additionalButtons = document.getElementById("additionalButtons");
    additionalButtons.style.display = additionalButtons.style.display === "none" ? "block" : "none";
}

function addSemesterRow(data = { gpa: '', creditHours: '' }) {
    const semesterTableBody = document.querySelector('#semesterTable tbody');
    const semesterCount = semesterTableBody.querySelectorAll('tr').length + 1;

    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${semesterCount}</td>
        <td><input type="number" min="0" step="0.01" value="${data.gpa}"></td>
        <td><input type="number" min="0" value="${data.creditHours}"></td>
    `;

    semesterTableBody.appendChild(newRow);
}

function showCGPAPopup() {
    document.getElementById('cgpaPopup').style.display = 'block';
}

function calculateCGPA() {
    const semesterTableRows = document.querySelectorAll('#semesterTable tbody tr');

    let totalPoints = 0;
    let totalCreditHours = 0;

    semesterTableRows.forEach((row) => {
        const gpa = parseFloat(row.cells[1].querySelector('input').value);
        const creditHours = parseFloat(row.cells[2].querySelector('input').value);

        if (!isNaN(gpa) && !isNaN(creditHours) && gpa >= 0 && creditHours > 0) {
            totalPoints += gpa * creditHours;
            totalCreditHours += creditHours;
        }
    });

    const cgpa = totalCreditHours !== 0 ? totalPoints / totalCreditHours : 0;

    document.getElementById('cgpaValue').textContent = cgpa.toFixed(2);
}

function closeCGPAPopup() {
    document.getElementById('cgpaPopup').style.display = 'none';
}

function saveTableData() {
    const tableRows = document.querySelectorAll('#gradesTable tbody tr');
    const tableData = [];

    tableRows.forEach((row) => {
        const subject = row.cells[0].querySelector('input').value;
        const credit = row.cells[1].querySelector('input').value;
        const grade = row.cells[2].querySelector('select').value;
        tableData.push({ subject, credit, grade });
    });

    localStorage.setItem('gradesTable', JSON.stringify(tableData));
}

function saveSemesterData() {
    const semesterRows = document.querySelectorAll('#semesterTable tbody tr');
    const semesterData = [];

    semesterRows.forEach((row) => {
        const gpa = row.cells[1].querySelector('input').value;
        const creditHours = row.cells[2].querySelector('input').value;
        semesterData.push({ gpa, creditHours });
    });

    localStorage.setItem('semesterTable', JSON.stringify(semesterData));
}

function loadSemesterData() {
    const savedData = JSON.parse(localStorage.getItem('semesterTable'));

    if (savedData) {
        savedData.forEach((rowData) => {
            addSemesterRow(rowData);
        });
    }
}

function clearGPAData() {
    const tableBody = document.querySelector('#gradesTable tbody');
    tableBody.innerHTML = '';
    localStorage.removeItem('gradesTable');
    document.getElementById('result').innerText = '';
}

function clearCGPAData() {
    const semesterTableBody = document.querySelector('#semesterTable tbody');
    semesterTableBody.innerHTML = '';
    localStorage.removeItem('semesterTable');
    document.getElementById('cgpaValue').textContent = '';
}