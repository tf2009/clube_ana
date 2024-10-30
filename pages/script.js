const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
];

let currentDate = new Date();
// Define unique keys for each sport
const athletesKey = 'athletes_futsal'; // Change this key for judo.html
const bookingsKey = 'bookings_futsal'; // Change this key for judo.html

let athletes = JSON.parse(localStorage.getItem(athletesKey)) || [];
let bookings = JSON.parse(localStorage.getItem(bookingsKey)) || [];

// Define colors for each escalão
const escalãoColors = {
    "Infantis": "#d1e7dd",
    "iniciados": "#fff3cd",
    "Juvenis": "#cfe2ff",
    "juniores": "#f9cb9c",
    "Seniores": "#e6a9e3"
};

// Load athletes from local storage when the page loads
window.onload = function() {
    loadAthletes(); // Load athletes from localStorage
    renderCalendar(); // Render the calendar on page load
};

// Load athletes from local storage
function loadAthletes() {
    const storedAthletes = localStorage.getItem('athletes');
    if (storedAthletes) {
        athletes = JSON.parse(storedAthletes);
    }
    renderAthleteLists(); // Render athlete lists after loading
}

function saveAthletes() {
    localStorage.setItem('athletes', JSON.stringify(athletes));
}

function renderAthleteLists() {
    const athleteListContainer = document.getElementById('athleteListContainer');
    athleteListContainer.innerHTML = '';

    const groupedAthletes = athletes.reduce((acc, athlete) => {
        if (!acc[athlete.escalao]) {
            acc[athlete.escalao] = [];
        }
        acc[athlete.escalao].push(athlete);
        return acc;
    }, {});

    for (const [escalão, athleteGroup] of Object.entries(groupedAthletes)) {
        const table = document.createElement('table');
        
        // Create a header row with a dropdown for each escalão
        const headerRow = document.createElement('tr');
        headerRow.innerHTML = `
            <th colspan="5">
                <span class="dropdown" onclick="toggleDropdown('${escalão}')">
                    ${escalão} <span class="arrow">▼</span>
                </span>
            </th>`;
        table.appendChild(headerRow);
        
        // Create a tbody for athletes
        const athleteTableBody = document.createElement('tbody');
        athleteTableBody.id = `athleteGroup-${escalão}`;
        athleteTableBody.style.display = 'none'; // Start hidden

        athleteGroup.forEach((athlete, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${athlete.nome}</td>
                <td>${athlete.pais}</td>
                <td>${athlete.contacto}</td>
                <td>${athlete.comentarios}</td>
                <td><span class="remove-athlete" onclick="removeAthlete(${index}, '${escalão}')">Remover</span></td>
            `;
            athleteTableBody.appendChild(row);
        });

        table.appendChild(athleteTableBody);
        athleteListContainer.appendChild(table);
    }
}

// Toggle dropdown visibility for each escalão
function toggleDropdown(escalão) {
    const athleteGroup = document.getElementById(`athleteGroup-${escalão}`);
    athleteGroup.style.display = athleteGroup.style.display === 'none' ? 'table-row-group' : 'none';
}

function removeAthlete(index, escalão) {
    athletes = athletes.filter((athlete, i) => i !== index);
    saveAthletes();
    renderAthleteLists(); // Re-render the athlete lists after removing an athlete
}

// Function to add a booking
function addBooking() {
    const dateInput = document.getElementById("bookingDate").value;
    const start = document.getElementById("bookingStartTime").value;
    const end = document.getElementById("bookingEndTime").value;
    const athleteEscalão = document.getElementById("athleteEscalao").value; // Select escalão for the booking
    const color = escalãoColors[athleteEscalão] || "#ffffff"; // Default to white if not found
    const comment = document.getElementById("bookingComment").value;

    if (dateInput && start && end) {
        const bookingDate = new Date(dateInput + 'T00:00:00');
        const dateKey = bookingDate.toISOString().split('T')[0]; // Use ISO string for consistent format

        // Initialize the bookings array for the date if it doesn't exist
        if (!bookings[dateKey]) {
            bookings[dateKey] = [];
        }

        // Push new booking
        bookings[dateKey].push({ 
            start, 
            end, 
            color, 
            comment 
        });
        renderCalendar(); // Refresh the calendar to show the new booking

        // Clear the input fields
        document.getElementById("bookingDate").value = "";
        document.getElementById("bookingStartTime").value = "";
        document.getElementById("bookingEndTime").value = "";
        document.getElementById("bookingComment").value = "";
    } else {
        alert("Please fill in all required fields.");
    }
}

// Function to remove a booking by clicking on it
function removeBooking(dateKey, index) {
    if (bookings[dateKey]) {
        bookings[dateKey].splice(index, 1); // Remove the booking at the given index
        if (bookings[dateKey].length === 0) {
            delete bookings[dateKey]; // Delete the date key if no bookings remain
        }
        renderCalendar(); // Refresh the calendar to reflect the removal
    }
}

// Function to render the calendar
function renderCalendar() {
    const calendarElement = document.getElementById('calendar');
    calendarElement.innerHTML = ''; // Clear the calendar

    const monthDays = new Date(currentYear, currentMonth + 1, 0).getDate(); // Total days in the month
    const firstDay = new Date(currentYear, currentMonth, 1).getDay(); // First day of the month
    const dayHeader = document.createElement('div');
    dayHeader.classList.add('day-header');

    const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    daysOfWeek.forEach(day => {
        const dayCell = document.createElement('div');
        dayCell.classList.add('day-name');
        dayCell.innerText = day;
        dayHeader.appendChild(dayCell);
    });

    calendarElement.appendChild(dayHeader);

    // Create a grid for the calendar days
    const calendarGrid = document.createElement('div');
    calendarGrid.classList.add('calendar-grid');

    // Add empty cells for the days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.classList.add('day');
        calendarGrid.appendChild(emptyCell);
    }

    // Add the actual days of the month
    for (let day = 1; day <= monthDays; day++) {
        const dayCell = document.createElement('div');
        dayCell.classList.add('day');
        dayCell.innerText = day;
        dayCell.setAttribute('data-date', `${currentYear}-${currentMonth + 1}-${day}`); // Set date for booking

        // Add light pink background for Saturdays and Sundays
        const date = new Date(currentYear, currentMonth, day);
        if (date.getDay() === 0 || date.getDay() === 6) { // Sunday or Saturday
            dayCell.style.backgroundColor = '#ffcccc'; // Light pink color
        }

        // Add bookings to the cell
        const dayBookings = bookings.filter(b => b.date === `${currentYear}-${currentMonth + 1}-${day}`);
        dayBookings.forEach(b => {
            const bookingElement = document.createElement('div');
            bookingElement.classList.add('booking');
            bookingElement.style.backgroundColor = b.color;
            bookingElement.innerText = `${b.startTime} - ${b.endTime}\n${b.comment}`;
            dayCell.appendChild(bookingElement);
        });

        dayCell.onclick = function () {
            alert(`Date: ${dayCell.getAttribute('data-date')}\nBookings:\n${dayBookings.map(b => `${b.startTime} - ${b.endTime}: ${b.comment}`).join('\n')}`);
        };

        calendarGrid.appendChild(dayCell);
    }

    calendarElement.appendChild(calendarGrid);
    document.getElementById('currentMonth').innerText = `${currentDate.toLocaleString('default', { month: 'long' })} ${currentYear}`;
}

// Function to navigate to the previous month
function previousMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
}

// Function to navigate to the next month
function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
}
