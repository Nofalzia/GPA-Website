document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('calculateButton').addEventListener('click', calculateGPA);
    document.getElementById('addRowButton').addEventListener('click', addRow);
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
            const grades = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-'];
            grades.forEach((grade) => {
                const option = document.createElement('option');
                option.value = grade;
                option.text = grade;
                input.add(option);
            });
        }

        input.type = i === 1 ? 'number' : 'text';
        cell.appendChild(input);
    }
}

function getGradePoint(grade) {
    switch (grade.toUpperCase()) {
        case 'A+':
        case 'A':
            return 4.0;
        case 'A-':
            return 3.7;
        case 'B+':
            return 3.3;
        case 'B':
            return 3.0;
        case 'B-':
            return 2.7;
        case 'C+':
            return 2.3;
        case 'C':
            return 2.0;
        case 'C-':
            return 1.7;
        case 'D+':
            return 1.3;
        case 'D':
            return 1.0;
        case 'D-':
            return 0.7;
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
