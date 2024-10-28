const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let currentDate = new Date();
const bookings = []; // Array to hold booking data

function renderCalendar() {
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    document.getElementById('currentMonth').textContent = `${monthNames[currentMonth]} ${currentYear}`;

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const calendarBody = document.getElementById('calendar');
    calendarBody.innerHTML = ''; // Clear previous calendar

    let date = 1;

    // Create 6 rows to cover all possible weeks in a month
    for (let i = 0; i < 6; i++) {
        const weekRow = document.createElement('div');
        weekRow.classList.add('week'); // Adding class for styling

        for (let j = 0; j < 7; j++) {
            const dayCell = document.createElement('div');
            dayCell.classList.add('day');

            if (i === 0 && j < firstDayOfMonth) {
                // Empty cell
            } else if (date > daysInMonth) {
                break; // Exit if we exceed the number of days in the month
            } else {
                dayCell.textContent = date;

                // Show bookings for the current day
                bookings.forEach(booking => {
                    const bookingDate = new Date(booking.date);
                    if (bookingDate.getDate() === date && bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear) {
                        const bookingDiv = document.createElement("div");
                        bookingDiv.className = "booking";
                        bookingDiv.style.backgroundColor = booking.color; // Set background color from booking
                        bookingDiv.textContent = `${booking.start} - ${booking.end}: ${booking.comment}`; // Show time slot and comment in the calendar
                        dayCell.appendChild(bookingDiv);
                    }
                });

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
    const date = document.getElementById("bookingDate").value;
    const start = document.getElementById("bookingStartTime").value;
    const end = document.getElementById("bookingEndTime").value;
    const color = document.getElementById("bookingColor").value;
    const comment = document.getElementById("bookingComment").value;

    if (date && start && end) {
        bookings.push({ date, start, end, color, comment });
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
renderCalendar();
