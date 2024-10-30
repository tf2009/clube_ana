let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

const athletesKey = 'athletes_judo';
const bookingsKey = 'bookings_judo';

let athletes = JSON.parse(localStorage.getItem(athletesKey)) || [];
let bookings = JSON.parse(localStorage.getItem(bookingsKey)) || [];

document.addEventListener('DOMContentLoaded', () => {
    renderAthleteList();
    renderCalendar();
    updateCurrentMonth();
});

// Toggle dropdown visibility
function toggleDropdown(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

// Add athlete to the list
function addAthlete() {
    const name = document.getElementById('athleteName').value;
    const parents = document.getElementById('athleteParents').value;
    const contact = document.getElementById('athleteContact').value;
    const escalão = document.getElementById('athleteEscalao').value;
    const comments = document.getElementById('athleteComments').value;

    if (!name || !parents || !contact || !escalão) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    const athlete = { name, parents, contact, escalão, comments };
    athletes.push(athlete);
    localStorage.setItem(athletesKey, JSON.stringify(athletes));

    document.getElementById('athleteName').value = '';
    document.getElementById('athleteParents').value = '';
    document.getElementById('athleteContact').value = '';
    document.getElementById('athleteEscalao').value = '';
    document.getElementById('athleteComments').value = '';

    renderAthleteList();
}

// Render the list of athletes
function renderAthleteList() {
    const athleteTablesContainer = document.getElementById('athleteTables');
    athleteTablesContainer.innerHTML = '';

    const escalões = [...new Set(athletes.map(athlete => athlete.escalão))];
    
    escalões.forEach(escalão => {
        const filteredAthletes = athletes.filter(athlete => athlete.escalão === escalão);
        const table = document.createElement('table');
        const headerRow = document.createElement('tr');
        headerRow.innerHTML = `<th>Nome</th><th>Pais</th><th>Contacto</th><th>Escalão</th><th>Comentários</th><th>Remover</th>`;
        table.appendChild(headerRow);

        filteredAthletes.forEach((athlete, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${athlete.name}</td>
                <td>${athlete.parents}</td>
                <td>${athlete.contact}</td>
                <td>${athlete.escalão}</td>
                <td>${athlete.comments}</td>
                <td class="remove-athlete" onclick="removeAthlete(${index}, '${escalão}')">Remover</td>
            `;
            table.appendChild(row);
        });

        const escalãoHeader = document.createElement('div');
        escalãoHeader.classList.add('escalão-header');
        escalãoHeader.innerText = escalão;
        athleteTablesContainer.appendChild(escalãoHeader);
        athleteTablesContainer.appendChild(table);
    });
}

// Remove athlete from the list
function removeAthlete(index, escalão) {
    athletes = athletes.filter((_, i) => i !== index);
    localStorage.setItem(athletesKey, JSON.stringify(athletes));
    renderAthleteList();
}

// Add booking to the calendar
function addBooking() {
    const bookingDate = document.getElementById('bookingDate').value;
    const startTime = document.getElementById('bookingStartTime').value;
    const endTime = document.getElementById('bookingEndTime').value;
    const bookingColor = document.getElementById('bookingColor').value;
    const bookingComment = document.getElementById('bookingComment').value;

    if (!bookingDate || !startTime || !endTime) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    const booking = { date: bookingDate, start: startTime, end: endTime, color: bookingColor, comment: bookingComment };
    bookings.push(booking);
    localStorage.setItem(bookingsKey, JSON.stringify(bookings));

    document.getElementById('bookingDate').value = '';
    document.getElementById('bookingStartTime').value = '';
    document.getElementById('bookingEndTime').value = '';
    document.getElementById('bookingComment').value = '';

    renderCalendar();
}

// Clear all bookings
function clearAllBookings() {
    bookings = [];
    localStorage.setItem(bookingsKey, JSON.stringify(bookings));
    renderCalendar();
}

// Render the calendar
function renderCalendar() {
    const calendarContainer = document.getElementById('calendar');
    calendarContainer.innerHTML = '';

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const totalDays = lastDayOfMonth.getDate();

    // Create the day header
    const dayHeader = document.createElement('div');
    dayHeader.classList.add('day-header');

    const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    daysOfWeek.forEach((day, index) => {
        const dayCell = document.createElement('div');
        dayCell.classList.add('day-name');

        // Apply weekend classes
        if (index === 0) {
            dayCell.classList.add('sunday'); // Index 0 corresponds to Sunday
        } else if (index === 6) {
            dayCell.classList.add('saturday'); // Index 6 corresponds to Saturday
        }

        dayCell.innerText = day;
        dayHeader.appendChild(dayCell);
    });

    calendarContainer.appendChild(dayHeader);

    // Create the days of the month
    const week = document.createElement('div');
    week.classList.add('week');
    for (let day = 1; day <= totalDays; day++) {
        const currentDay = new Date(currentYear, currentMonth, day);
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('day');

        // Check if the day is Saturday or Sunday to apply the respective classes
        if (currentDay.getDay() === 0) { // Sunday
            dayDiv.classList.add('sunday');
        } else if (currentDay.getDay() === 6) { // Saturday
            dayDiv.classList.add('saturday');
        }

        dayDiv.innerText = day; // Set the day number
        week.appendChild(dayDiv);

        // Check if we need to start a new week
        if (currentDay.getDay() === 6) {
            calendarContainer.appendChild(week);
            week = document.createElement('div'); // Create a new week
            week.classList.add('week');
        }
    }
    // Append the last week if it has days
    if (week.children.length > 0) {
        calendarContainer.appendChild(week);
    }
}

// Remove booking
function removeBooking(date, startTime) {
    bookings = bookings.filter(booking => !(booking.date === date && booking.start === startTime));
    localStorage.setItem(bookingsKey, JSON.stringify(bookings));
    renderCalendar();
}

// Change month in the calendar
function changeMonth(direction) {
    currentMonth += direction;

    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    } else if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }

    renderCalendar();
    updateCurrentMonth();
}

// Update current month header
function updateCurrentMonth() {
    const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    document.getElementById('currentMonth').innerText = `${monthNames[currentMonth]} ${currentYear}`;
}

// Search for athletes
function searchAthlete() {
    const query = document.getElementById('searchAthlete').value.toLowerCase();
    const athleteTablesContainer = document.getElementById('athleteTables');
    athleteTablesContainer.innerHTML = '';

    const escalões = [...new Set(athletes.map(athlete => athlete.escalão))];

    escalões.forEach(escalão => {
        const filteredAthletes = athletes.filter(athlete => athlete.escalão === escalão && athlete.name.toLowerCase().includes(query));
        if (filteredAthletes.length > 0) {
            const table = document.createElement('table');
            const headerRow = document.createElement('tr');
            headerRow.innerHTML = `<th>Nome</th><th>Pais</th><th>Contacto</th><th>Escalão</th><th>Comentários</th><th>Remover</th>`;
            table.appendChild(headerRow);

            filteredAthletes.forEach((athlete, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${athlete.name}</td>
                    <td>${athlete.parents}</td>
                    <td>${athlete.contact}</td>
                    <td>${athlete.escalão}</td>
                    <td>${athlete.comments}</td>
                    <td class="remove-athlete" onclick="removeAthlete(${index}, '${escalão}')">Remover</td>
                `;
                table.appendChild(row);
            });

            const escalãoHeader = document.createElement('div');
            escalãoHeader.classList.add('escalão-header');
            escalãoHeader.innerText = escalão;
            athleteTablesContainer.appendChild(escalãoHeader);
            athleteTablesContainer.appendChild(table);
        }
    });
}
