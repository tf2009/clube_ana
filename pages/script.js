const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
];

let currentDate = new Date();
const bookings = {}; // Use an object to store bookings by date
let athletes = [];

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

// Render calendar
function renderCalendar() {
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    document.getElementById('currentMonth').textContent = `${monthNames[currentMonth]} ${currentYear}`;

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const calendarBody = document.getElementById('calendar');
    calendarBody.innerHTML = ''; // Clear previous calendar

    // Create day names row
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayNamesRow = document.createElement('div');
    dayNamesRow.classList.add('day-names');

    dayNames.forEach(day => {
        const dayDiv = document.createElement('div');
        dayDiv.textContent = day;
        dayNamesRow.appendChild(dayDiv);
    });

    calendarBody.appendChild(dayNamesRow); // Append the day names row

    let date = 1;

    // Create 6 rows to cover all possible weeks in a month
    for (let i = 0; i < 6; i++) {
        const weekRow = document.createElement('div');
        weekRow.classList.add('week');

        for (let j = 0; j < 7; j++) {
            const dayCell = document.createElement('div');
            dayCell.classList.add('day');

            if (i === 0 && j < firstDayOfMonth) {
                // Empty cell
                dayCell.classList.add('empty');
            } else if (date > daysInMonth) {
                break; // Exit if we exceed the number of days in the month
            } else {
                dayCell.textContent = date;

                // Show bookings for the current day
                const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
                if (bookings[dateKey]) {
                    bookings[dateKey].forEach((booking, index) => {
                        const bookingDiv = document.createElement("div");
                        bookingDiv.className = "booking";
                        bookingDiv.style.backgroundColor = booking.color; // Set background color from booking
                        bookingDiv.textContent = `${booking.start} - ${booking.end}: ${booking.comment}`; // Show time slot and comment

                        // Add a remove button to each booking
                        const removeButton = document.createElement("button");
                        removeButton.textContent = "Remove";
                        removeButton.style.backgroundColor = "green"; // Set button color to green
                        removeButton.style.color = "white"; // Set button text color to white
                        removeButton.onclick = () => removeBooking(dateKey, index);
                        bookingDiv.appendChild(removeButton);

                        // Add click event to the bookingDiv to remove the booking
                        bookingDiv.onclick = () => removeBooking(dateKey, index);

                        dayCell.appendChild(bookingDiv);
                    });
                }

                dayCell.onclick = () => {
                    alert(`Selected date: ${date} ${monthNames[currentMonth]} ${currentYear}`);
                };
                date++;
            }
            weekRow.appendChild(dayCell);
        }
        calendarBody.appendChild(weekRow);
        
        if (date > daysInMonth) {
            break; // Exit if we have added all days in the month
        }
    }
}

// Function to clear all bookings for the displayed month
function clearBookingsForMonth() {
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    // Filter out any bookings that are not in the current month and year
    for (let dateKey in bookings) {
        const [year, month] = dateKey.split('-').map(Number);
        
        if (year === currentYear && month - 1 === currentMonth) {
            delete bookings[dateKey]; // Clear the bookings for this date
        }
    }
    renderCalendar(); // Refresh the calendar to show the cleared month
}

// Change to the previous month
function prevMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
}

// Change to the next month
function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
}

