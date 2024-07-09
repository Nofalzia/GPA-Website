document.addEventListener('DOMContentLoaded', function () {
    loadTableData(); // Load saved data when the page loads
    loadSemesterData(); // Load saved semester data when the page loads

    document.getElementById('calculateButton').addEventListener('click', calculateGPA);
    document.getElementById('addRowButton').addEventListener('click', addRow);
    document.getElementById('calculateCGPAButton').addEventListener('click', showCGPAPopup);
    document.getElementById('addSemesterButton').addEventListener('click', addSemesterRow);
    document.getElementById('calculateCGPA').addEventListener('click', calculateCGPA);

    // Save data whenever the user adds a row or inputs data
    document.querySelector('#gradesTable tbody').addEventListener('input', saveTableData);
    document.getElementById('semesterTable').addEventListener('input', saveSemesterData);

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

function calculateGPA() {
    const tableRows = document.querySelectorAll('#gradesTable tbody tr');
    let totalPoints = 0;
    let totalCredits = 0;

    tableRows.forEach((row) => {
        const credit = parseFloat(row.cells[1].querySelector('input').value);
        const grade = row.cells[2].querySelector('select').selectedOptions[0].value;

        if (!isNaN(credit) && !isNaN(getGradePoint(grade))) {
            totalCredits += credit;
            totalPoints += getGradePoint(grade) * credit;
        }
    });

    const gpa = totalPoints / totalCredits;

    if (!isNaN(gpa)) {
        document.getElementById('result').innerText = gpa.toFixed(2);
    } else {
        document.getElementById('result').innerText = 'Invalid input';
    }
}

function addRow(data = { subject: '', credit: '', grade: '' }) {
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
            return 4.0;
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
            return 1.0;
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

function loadTableData() {
    const savedData = JSON.parse(localStorage.getItem('gradesTable'));

    if (savedData) {
        savedData.forEach((rowData) => {
            addRow(rowData);
        });
    }
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
