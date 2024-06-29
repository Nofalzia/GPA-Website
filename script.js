document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('calculateButton').addEventListener('click', calculateGPA);
    document.getElementById('addRowButton').addEventListener('click', addRow);
    document.getElementById('calculateCGPAButton').addEventListener('click', showCGPAPopup);
    document.getElementById('addSemesterButton').addEventListener('click', addSemesterRow);
});

function calculateGPA() {
    const tableRows = document.querySelectorAll('#gradesTable tbody tr');
    let totalPoints = 0;
    let totalCredits = 0;

    tableRows.forEach((row) => {
        const subject = row.cells[0].querySelector('input').value;
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

function addRow() {
    const tableBody = document.querySelector('#gradesTable tbody');
    const newRow = tableBody.insertRow();

    for (let i = 0; i < 3; i++) {
        const cell = newRow.insertCell(i);
        const input = document.createElement(i === 2 ? 'select' : 'input');
        
        if (i === 2) {
            // Create a dropdown (select) for grades
            const grades = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F'];
            grades.forEach((grade) => {
                const option = document.createElement('option');
                option.value = grade;
                option.text = grade;
                input.add(option);
            });
        }

        // Set input type based on column index
        input.type = i === 1 ? 'number' : 'text';

        // Optional: Add some styling or attributes to the input elements
        input.style.width = '80%'; // Adjust width as needed
        input.style.height = '20px'; // Set height
        input.placeholder = i === 1 ? '' : ''; // Placeholder text

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
    const popup = document.getElementById('conversionPopup');
    popup.style.display = 'block';
}

function closeConversionPopup() {
    const popup = document.getElementById('conversionPopup');
    popup.style.display = 'none';
}

function toggleButtons() {
    var additionalButtons = document.getElementById("additionalButtons");
    if (additionalButtons.style.display === "none") {
        additionalButtons.style.display = "block";
    } else {
        additionalButtons.style.display = "none";
    }
}

function addSemesterRow() {
    const semesterTableBody = document.querySelector('#semesterTable tbody');
    const semesterCount = semesterTableBody.querySelectorAll('tr').length + 1;

    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${semesterCount}</td>
        <td><input type="number" min="0" step="0.01"></td>
        <td><input type="number" min="0"></td>
    `;

    semesterTableBody.appendChild(newRow);
}

function showCGPAPopup() {
    const popup = document.getElementById('cgpaPopup');
    popup.style.display = 'block';
}

function calculateCGPA() {
    const semesterTableRows = document.querySelectorAll('#semesterTable tbody tr');

    let totalPoints = 0;
    let totalCreditHours = 0;

    semesterTableRows.forEach((row) => {
        const gpaInput = row.cells[1].querySelector('input');
        const creditHoursInput = row.cells[2].querySelector('input');

        const gpa = parseFloat(gpaInput.value);
        const creditHours = parseFloat(creditHoursInput.value);

        if (!isNaN(gpa) && !isNaN(creditHours) && gpa >= 0 && creditHours > 0) {
            totalPoints += gpa * creditHours;
            totalCreditHours += creditHours;
        }
    });

    const cgpa = totalCreditHours !== 0 ? totalPoints / totalCreditHours : 0;

    document.getElementById('cgpaValue').textContent = cgpa.toFixed(2);
}