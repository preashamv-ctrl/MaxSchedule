
// State Management
const State = {
    events: [],
    currentView: 'list', // 'list' or 'calendar'
    currentMonth: new Date(2026, 0, 1), // Start at Jan 2026
    filters: {
        search: '',
        categories: new Set()
    }
};

// DOM Elements
const Elements = {
    listViewBtn: document.getElementById('listViewBtn'),
    calendarViewBtn: document.getElementById('calendarViewBtn'),
    listView: document.getElementById('listView'),
    calendarView: document.getElementById('calendarView'),
    eventsList: document.getElementById('eventsList'),
    searchInput: document.getElementById('searchInput'),
    categoryFilter: document.getElementById('categoryFilter'),
    calendarGrid: document.getElementById('calendarGrid'),
    currentMonthYear: document.getElementById('currentMonthYear'),
    prevMonthBtn: document.getElementById('prevMonth'),
    nextMonthBtn: document.getElementById('nextMonth'),
    addEventBtn: document.getElementById('addEventBtn'),
    eventModal: document.getElementById('eventModal'),
    closeModal: document.querySelector('.close-modal'),
    cancelBtn: document.getElementById('cancelBtn'),
    eventForm: document.getElementById('eventForm'),
    totalEventsCount: document.getElementById('totalEventsCount'),
    attendingCount: document.getElementById('attendingCount')
};

// Initialization
function init() {
    loadData();
    renderMatrixFilters();
    setupEventListeners();
    render();
}

function loadData() {
    // Load from localStorage or use initial data
    const storedEvents = localStorage.getItem('scheduleEvents');
    if (storedEvents) {
        State.events = JSON.parse(storedEvents);
    } else {
        // defined in data.js
        if (typeof initialData !== 'undefined') {
            State.events = [...initialData];
            // Add 'attending' property if missing
            State.events.forEach(evt => {
                if (typeof evt.attending === 'undefined') {
                    evt.attending = false;
                }
            });
            saveData();
        }
    }
}


function saveData() {
    localStorage.setItem('scheduleEvents', JSON.stringify(State.events));
    updateStats();
}

function updateStats() {
    Elements.totalEventsCount.textContent = State.events.length;
    Elements.attendingCount.textContent = State.events.filter(e => e.attending).length;
}

function setupEventListeners() {
    // View Switcher
    Elements.listViewBtn.addEventListener('click', () => switchView('list'));
    Elements.calendarViewBtn.addEventListener('click', () => switchView('calendar'));

    // Filters
    Elements.searchInput.addEventListener('input', (e) => {
        State.filters.search = e.target.value.toLowerCase();
        renderMatrixView();
    });

    // Matrix Filters delegated in renderMatrixFilters

    // Calendar Navigation
    Elements.prevMonthBtn.addEventListener('click', () => changeMonth(-1));
    Elements.nextMonthBtn.addEventListener('click', () => changeMonth(1));

    // Modal
    Elements.addEventBtn.addEventListener('click', () => openModal());
    Elements.closeModal.addEventListener('click', closeModal);
    Elements.cancelBtn.addEventListener('click', closeModal);
    Elements.eventForm.addEventListener('submit', handleFormSubmit);

    // Close modal on outside click
    window.addEventListener('click', (e) => {
        if (e.target === Elements.eventModal) {
            closeModal();
        }
    });
}

function switchView(view) {
    State.currentView = view;
    if (view === 'list') {
        Elements.listViewBtn.classList.add('active');
        Elements.calendarViewBtn.classList.remove('active');
        Elements.listView.classList.add('active');
        Elements.calendarView.classList.remove('active');
        renderMatrixView();
    } else {
        Elements.calendarViewBtn.classList.add('active');
        Elements.listViewBtn.classList.remove('active');
        Elements.calendarView.classList.add('active');
        Elements.listView.classList.remove('active');
        renderCalendarView();
    }
}

// Deprecated old List View Logic
// function getFilteredEvents() {
//     return State.events.filter(event => {
//         const matchesSearch = event.title.toLowerCase().includes(State.filters.search) ||
//             event.location.toLowerCase().includes(State.filters.search);
//         const matchesCategory = State.filters.category === 'all' || event.category === State.filters.category;
//         return matchesSearch && matchesCategory;
//     }).sort((a, b) => new Date(a.start) - new Date(b.start));
// }

function getConflicts(event) {
    return State.events.filter(e => {
        if (e.id === event.id) return false; // Don't compare with self
        // Check overlap: StartA <= EndB && EndA >= StartB
        const overlap = event.start <= e.end && event.end >= e.start;
        return overlap;
    });
}

// Deprecated old List View Logic
// function renderListView() {
//     Elements.eventsList.innerHTML = '';
//     const filteredEvents = getFilteredEvents();

//     if (filteredEvents.length === 0) {
//         Elements.eventsList.innerHTML = '<p style="text-align:center; color: var(--text-muted);">No events found.</p>';
//         return;
//     }

//     filteredEvents.forEach(event => {
//         const card = document.createElement('div');
//         const conflicts = getConflicts(event);
//         const isConflicting = conflicts.length > 0;
//         const attendingConflict = conflicts.some(c => c.attending);

//         let conflictMsg = '';
//         if (isConflicting) {
//             const conflictNames = conflicts.map(c => c.title).join(', ');
//             conflictMsg = `<div class="conflict-warning" title="Conflicts with: ${conflictNames}">⚠️ Conflicts with ${conflicts.length} event(s)</div>`;
//         }

//         card.className = `event-card ${event.attending ? 'attending' : ''} ${event.attending && attendingConflict ? 'conflict-active' : ''}`;

//         // Make entire card clickable for attendance
//         card.onclick = (e) => {
//             // Prevent triggering when clicking buttons directly
//             if (e.target.tagName === 'BUTTON') return;
//             toggleAttendance(event.id);
//         };

//         const dateStr = formatDateRange(event.start, event.end);

//         card.innerHTML = `
//             <div class="event-info">
//                 <div class="event-header">
//                     <h4>${event.title}</h4>
//                     ${conflictMsg}
//                 </div>
//                 <p><strong>Date:</strong> ${dateStr}</p>
//                 <p><strong>Category:</strong> ${event.category}</p>
//                 <p><strong>Location:</strong> ${event.location}</p>
//             </div>
//             <div class="event-actions">
//                 <button class="btn ${event.attending ? 'secondary' : 'primary'}" onclick="event.stopPropagation(); toggleAttendance('${event.id}')">
//                     ${event.attending ? 'Attending' : 'Attend'}
//                 </button>
//                 <button class="btn secondary" onclick="event.stopPropagation(); editEvent('${event.id}')">Edit</button>
//             </div>
//         `;
//         Elements.eventsList.appendChild(card);
//     });
//     updateStats();
// }

// Deprecated old List View Logic
// function populateCategoryFilter() {
//     const categories = [...new Set(State.events.map(e => e.category))].filter(Boolean).sort();
//     const datalist = document.getElementById('categoryList');

//     // Clear existing
//     while (Elements.categoryFilter.options.length > 1) {
//         Elements.categoryFilter.remove(1);
//     }
//     datalist.innerHTML = '';

//     categories.forEach(cat => {
//         // Filter dropdown
//         const option = document.createElement('option');
//         option.value = cat;
//         option.textContent = cat;
//         Elements.categoryFilter.appendChild(option);

//         // Datalist for form
//         const dlOption = document.createElement('option');
//         dlOption.value = cat;
//         datalist.appendChild(dlOption);
//     });
// }

// Matrix View Logic
function getUniqueCategories() {
    return [...new Set(State.events.map(e => e.category))].filter(Boolean).sort();
}

function getUniqueDates() {
    // Get all unique start dates, sorted
    const dates = [...new Set(State.events.map(e => e.start))].sort();
    return dates;
}

function renderMatrixFilters() {
    const container = document.getElementById('categoryFilters');
    container.innerHTML = '';

    const categories = getUniqueCategories();

    categories.forEach(cat => {
        const bg = categoryColor(cat);
        const label = document.createElement('label');
        label.className = 'toggle-btn';
        label.style.setProperty('--cat-color', bg);

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = cat;
        checkbox.checked = State.filters.categories.size === 0 || State.filters.categories.has(cat);

        checkbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                State.filters.categories.add(cat);
            } else {
                State.filters.categories.delete(cat);
            }
            // If all unchecked, treat as ALL
            if (State.filters.categories.size === 0) {
                // visual feedback?
            }
            renderMatrixView();
        });

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(cat));
        container.appendChild(label);
    });
}

// Deterministic color generator for categories
function categoryColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash % 360);
    return `hsl(${hue}, 70%, 90%)`;
}

function renderMatrixView() {
    const tableHead = document.getElementById('matrixHeader');
    const tableBody = document.getElementById('matrixBody');

    tableHead.innerHTML = '';
    tableBody.innerHTML = '';

    const categories = getUniqueCategories();
    const dates = getUniqueDates();

    // Effective categories to show
    const activeCategories = categories.filter(cat =>
        State.filters.categories.size === 0 || State.filters.categories.has(cat)
    );

    // Header Row
    const trHead = document.createElement('tr');
    trHead.innerHTML = '<th>Date</th>';
    activeCategories.forEach(cat => {
        const th = document.createElement('th');
        th.textContent = cat;
        trHead.appendChild(th);
    });
    tableHead.appendChild(trHead);

    // Data Rows
    dates.forEach(dateStart => {
        // Check if any event in this row matches search
        // Also check if we should even show this row based on category filter? 
        // Yes, if it has events in active categories.

        const eventsOnDate = State.events.filter(e => e.start === dateStart);

        // Filter by search
        const searchInput = State.filters.search;
        const matchingEvents = eventsOnDate.filter(e =>
            e.title.toLowerCase().includes(searchInput) ||
            e.location.toLowerCase().includes(searchInput)
        );

        if (searchInput && matchingEvents.length === 0) return;

        const tr = document.createElement('tr');

        // Date Cell
        const dateCell = document.createElement('td');
        dateCell.className = 'date-cell';
        // Find one event to get the end date for display
        const sampleEvent = eventsOnDate[0];
        dateCell.textContent = formatDateRange(sampleEvent.start, sampleEvent.end);
        tr.appendChild(dateCell);

        // Category Cells
        activeCategories.forEach(cat => {
            const td = document.createElement('td');
            const eventsInCell = eventsOnDate.filter(e => e.category === cat);

            eventsInCell.forEach(event => {
                // Check matches search
                if (searchInput && !event.title.toLowerCase().includes(searchInput) && !event.location.toLowerCase().includes(searchInput)) {
                    return;
                }

                const conflicts = getConflicts(event);
                const isConflicting = conflicts.length > 0;
                const attendingConflict = conflicts.some(c => c.attending);

                const div = document.createElement('div');
                div.className = `matrix-event ${event.attending ? 'attending' : ''} ${event.attending && attendingConflict ? 'conflict-active' : ''}`;

                if (isConflicting && !event.attending) {
                    div.classList.add('conflict-potential');
                    div.title = `Conflicts with ${conflicts.length} event(s)`;
                } else {
                    div.title = event.location;
                }

                div.textContent = event.title;
                div.onclick = (e) => {
                    e.stopPropagation();
                    toggleAttendance(event.id);
                };

                td.appendChild(div);
            });
            tr.appendChild(td);
        });

        tableBody.appendChild(tr);
    });

    updateStats();
}

// Calendar View Logic
function changeMonth(delta) {
    State.currentMonth.setMonth(State.currentMonth.getMonth() + delta);
    renderCalendarView();
}

function renderCalendarView() {
    Elements.calendarGrid.innerHTML = '';
    const year = State.currentMonth.getFullYear();
    const month = State.currentMonth.getMonth();

    Elements.currentMonthYear.textContent = new Date(year, month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Previous month filler
    for (let i = 0; i < firstDay; i++) {
        const dayCell = document.createElement('div');
        dayCell.className = 'calendar-day other-month';
        Elements.calendarGrid.appendChild(dayCell);
    }

    // Days
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayCell = document.createElement('div');
        dayCell.className = 'calendar-day';

        dayCell.innerHTML = `<span class="day-number">${day}</span>`;

        // Find events on this day
        const eventsOnDay = State.events.filter(e => {
            return dateStr >= e.start && dateStr <= e.end;
        });

        eventsOnDay.forEach(event => {
            const conflicts = getConflicts(event);
            const isConflicting = conflicts.length > 0;
            const attendingConflict = conflicts.some(c => c.attending);

            const eventEl = document.createElement('div');
            eventEl.className = `calendar-event ${event.attending ? 'attending' : ''} ${event.attending && attendingConflict ? 'conflict-active' : ''}`;
            if (isConflicting && !event.attending) {
                eventEl.classList.add('conflict-potential');
            }

            eventEl.textContent = event.title;
            eventEl.title = `${event.title} (${event.location})`;

            // Click to toggle attendance
            eventEl.onclick = (e) => {
                e.stopPropagation();
                toggleAttendance(event.id);
            };

            dayCell.appendChild(eventEl);
        });

        Elements.calendarGrid.appendChild(dayCell);
    }
}

// Event Actions
window.toggleAttendance = function (id) {
    const event = State.events.find(e => e.id === id);
    if (!event) return;

    // If we are turning it ON, warn about conflicts?
    if (!event.attending) {
        const conflicts = getConflicts(event);
        const attendingConflicts = conflicts.filter(c => c.attending);

        if (attendingConflicts.length > 0) {
            const performAction = confirm(`This event conflicts with: \n${attendingConflicts.map(c => c.title).join('\n')}\n\nDo you want to attend this one anyway?`);
            if (!performAction) return;
        }
    }

    event.attending = !event.attending;
    saveData();
    render();
};

window.editEvent = function (id) {
    const event = State.events.find(e => e.id === id);
    if (event) {
        openModal(event);
    }
};

// Modal Logic
function openModal(event = null) {
    Elements.eventModal.style.display = 'flex';
    if (event) {
        document.getElementById('modalTitle').textContent = 'Edit Event';
        document.getElementById('eventId').value = event.id;
        document.getElementById('eventTitle').value = event.title;
        document.getElementById('eventCategory').value = event.category;
        document.getElementById('eventStart').value = event.start;
        document.getElementById('eventEnd').value = event.end;
        document.getElementById('eventLocation').value = event.location;
    } else {
        document.getElementById('modalTitle').textContent = 'Add Event';
        Elements.eventForm.reset();
        document.getElementById('eventId').value = '';
    }
}

function closeModal() {
    Elements.eventModal.style.display = 'none';
}

function handleFormSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('eventId').value;
    const title = document.getElementById('eventTitle').value;
    const category = document.getElementById('eventCategory').value;
    const start = document.getElementById('eventStart').value;
    const end = document.getElementById('eventEnd').value;
    const location = document.getElementById('eventLocation').value;

    if (id) {
        // Edit existing
        const event = State.events.find(e => e.id === id);
        if (event) {
            Object.assign(event, { title, category, start, end, location });
        }
    } else {
        // Add new
        const newEvent = {
            id: 'evt_' + Date.now(),
            title,
            category,
            start,
            end,
            location,
            attending: true // Default to attending if creating it?
        };
        State.events.push(newEvent);
    }

    saveData();
    closeModal();
    populateCategoryFilter(); // In case of new category
    render();
}

// Helpers
function formatDateRange(start, end) {
    const s = new Date(start);
    const e = new Date(end);
    const options = { month: 'short', day: 'numeric' };

    if (start === end) {
        return s.toLocaleDateString('en-US', options);
    }

    if (s.getMonth() === e.getMonth()) {
        return `${s.toLocaleDateString('en-US', { month: 'short' })} ${s.getDate()}–${e.getDate()}`;
    }

    return `${s.toLocaleDateString('en-US', options)} – ${e.toLocaleDateString('en-US', options)}`;
}

function render() {
    if (State.currentView === 'list') {
        renderMatrixView();
    } else {
        renderCalendarView();
    }
    updateStats();
}

// Start
init();
