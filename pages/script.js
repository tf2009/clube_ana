const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let currentDate = new Date();
const bookings = {}; // Use an object to store bookings by date
let athletes = [];

// Define colors for each escalão
const escalãoColors = {
    "Infantis": "#d1e7dd",
    "infantis": "#d1e7dd",
    "Iniciados": "#fff3cd",
    "iniciados": "#fff3cd",
    "Juvenis": "#cfe2ff",
    "juvenis": "#cfe2ff",
    "Juniores": "#f9cb9c",
    "juniores": "#f9cb9c",
    "Seniores": "#e6a9e3",
    "seniores": "#e6a9e3"
};

// Load athletes from local storage
function loadAthletes() {
    const storedAthletes = localStorage.getItem('athletes');
    if (storedAthletes) {
        athletes = JSON.parse(storedAthletes);
    }
    renderAthleteLists();
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
        const headerRow = document.createElement('tr');
        headerRow.innerHTML = `<th colspan="5">${escalão}</th>`;
        table.appendChild(headerRow);
        table.innerHTML += `
            <tr>
                <th>Nome</th>
                <th>Pais</th>
                <th>Contacto</th>
                <th>Comentários</th>
                <th>Remover</th>
            </tr>`;

        athleteGroup.forEach((athlete, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${athlete.nome}</td>
                <td>${athlete.pais}</td>
                <td>${athlete.contacto}</td>
                <td>${athlete.comentarios}</td>
                <td><span class="remove-athlete" onclick="removeAthlete(${index}, '${escalão}')">Remover</span></td>
            `;
            table.appendChild(row);
        });

        athleteListContainer.appendChild(table);
    }
}

function removeAthlete(index, escalão) {
    athletes = athletes.filter((athlete, i) => i !== index);
    saveAthletes();
    renderAthleteLists();
}

function addAthlete() {
    const name = document.getElementById('athleteName').value;
    const parents = document.getElementById('athleteParents').value;
    const contact = document.getElementById('athleteContact').value;
    const escalão = document.getElementById('athleteEscalao').value;
    const comments = document.getElementById('athleteComments').value;

    const newAthlete = { nome: name, pais: parents, contacto: contact, escalao: escalão, comentarios: comments };
    athletes.push(newAthlete);
    saveAthletes();
    renderAthleteLists();
}

// Calendar functions
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
    dayNamesRow.classList.add('day-header');
    dayNames.forEach(day => {
        const dayDiv = document.createElement('div');
        dayDiv.textContent = day;
        dayNamesRow.appendChild(dayDiv);
    });
    calendarBody.appendChild(dayNamesRow);

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
                    bookings[dateKey].forEach(booking => {
                        const bookingDiv = document.createElement("div");
                        bookingDiv.className = "booking";
                        bookingDiv.style.backgroundColor = booking.color; // Set background color from booking
                        bookingDiv.textContent = `${booking.start} - ${booking.end}: ${booking.comment}`; // Show time slot and comment
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
            break; // Exit if we have filled all days
        }
    }
}

// Event listeners for the month navigation buttons
document.getElementById('prevMonthButton').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

document.getElementById('nextMonthButton').addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});

// Function to add a booking
document.getElementById("saveBookingButton").onclick = () => {
    const dateInput = document.getElementById("bookingDate").value;
    const start = document.getElementById("bookingStartTime").value;
    const end = document.getElementById("bookingEndTime").value;
    const color = document.getElementById("bookingColor").value;
    const comment = document.getElementById("bookingComment").value;

    if (dateInput && start && end) {
        // Create a date object from the input
        const bookingDate = new Date(dateInput);
        // Use local date by setting the time to the start of the day
        bookingDate.setHours(0, 0, 0, 0);
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
};

// Initial calendar render
loadAthletes(); // Load athletes on page load
renderCalendar(); // Render the calendar on page load
