
// State Management
const State = {
    events: [],
    categories: [], // List of category strings
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
    calendarGrid: document.getElementById('calendarGrid'),
    currentMonthYear: document.getElementById('currentMonthYear'),
    prevMonthBtn: document.getElementById('prevMonth'),
    nextMonthBtn: document.getElementById('nextMonth'),

    // Stats
    totalEventsCount: document.getElementById('totalEventsCount'),
    attendingCount: document.getElementById('attendingCount'),

    // Filters & Search
    searchInput: document.getElementById('searchInput'),
    categoryFiltersContainer: document.getElementById('categoryFilters'),

    // Event Modal
    addEventBtn: document.getElementById('addEventBtn'),

    // Export
    exportDataBtn: document.getElementById('exportDataBtn'),

    eventModal: document.getElementById('eventModal'),
    closeModal: document.querySelector('#eventModal .close-modal'),
    cancelBtn: document.getElementById('cancelBtn'),
    eventForm: document.getElementById('eventForm'),

    // Category Modal
    manageCategoriesBtn: document.getElementById('manageCategoriesBtn'),
    categoryModal: document.getElementById('categoryModal'),
    closeCategoryModal: document.getElementById('closeCategoryModal'),
    closeCategoryBtn: document.getElementById('closeCategoryBtn'),
    newCategoryInput: document.getElementById('newCategoryInput'),
    addNewCategoryBtn: document.getElementById('addNewCategoryBtn'),
    categoryListManager: document.getElementById('categoryListManager'),

    // Forms
    eventCategorySelect: document.getElementById('eventCategory')
};

// Initialization
function init() {
    loadData();
    renderMatrixFilters();
    setupEventListeners();
    render();
}

function loadData() {
    // Data version — bump this when data.js changes to bust localStorage cache
    const DATA_VERSION = '2026-02-23-v2';
    const storedVersion = localStorage.getItem('dataVersion');
    if (storedVersion !== DATA_VERSION) {
        localStorage.removeItem('scheduleEvents');
        localStorage.removeItem('scheduleCategories');
        localStorage.setItem('dataVersion', DATA_VERSION);
    }

    // Load Events
    const storedEvents = localStorage.getItem('scheduleEvents');
    if (storedEvents) {
        State.events = JSON.parse(storedEvents);
    } else {
        if (typeof initialData !== 'undefined') {
            State.events = [...initialData];
            // Add 'attending' and unique ID if missing
            State.events.forEach((evt, idx) => {
                if (typeof evt.attending === 'undefined') evt.attending = false;
                if (!evt.id) evt.id = `evt_${idx}`;
            });
            saveData();
        }
    }

    // Load Categories
    const storedCategories = localStorage.getItem('scheduleCategories');
    if (storedCategories) {
        State.categories = JSON.parse(storedCategories);
    } else {
        // Derive from events initially if not saved
        const derived = [...new Set(State.events.map(e => e.category))].filter(Boolean).sort();
        State.categories = derived;
        saveCategories();
    }
}

function saveData() {
    localStorage.setItem('scheduleEvents', JSON.stringify(State.events));
    updateStats();
}

function saveCategories() {
    localStorage.setItem('scheduleCategories', JSON.stringify(State.categories));
    renderMatrixFilters();
}

function updateStats() {
    Elements.totalEventsCount.textContent = State.events.length;
    Elements.attendingCount.textContent = State.events.filter(e => e.attending).length;
}

function setupEventListeners() {
    // View Switcher
    Elements.listViewBtn.addEventListener('click', () => switchView('list'));
    Elements.calendarViewBtn.addEventListener('click', () => switchView('calendar'));

    // Search
    Elements.searchInput.addEventListener('input', (e) => {
        State.filters.search = e.target.value.toLowerCase();
        renderMatrixView();
    });

    // Calendar Navigation
    Elements.prevMonthBtn.addEventListener('click', () => changeMonth(-1));
    Elements.nextMonthBtn.addEventListener('click', () => changeMonth(1));

    // Event Modal
    Elements.addEventBtn.addEventListener('click', () => openModal());
    Elements.closeModal.addEventListener('click', closeModal);
    Elements.cancelBtn.addEventListener('click', closeModal);
    Elements.eventForm.addEventListener('submit', handleFormSubmit);

    // Category Modal
    Elements.manageCategoriesBtn.addEventListener('click', openCategoryModal);
    Elements.closeCategoryModal.addEventListener('click', closeCategoryModal);
    Elements.closeCategoryBtn.addEventListener('click', closeCategoryModal);
    Elements.addNewCategoryBtn.addEventListener('click', addNewCategory);

    // Export Data
    if (Elements.exportDataBtn) {
        Elements.exportDataBtn.addEventListener('click', exportScheduleData);
    }

    // Close modals on outside click
    window.addEventListener('click', (e) => {
        if (e.target === Elements.eventModal) closeModal();
        if (e.target === Elements.categoryModal) closeCategoryModal();
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

// --- Category Management ---

function openCategoryModal() {
    renderCategoryListManager();
    Elements.categoryModal.style.display = 'flex';
}

function closeCategoryModal() {
    Elements.categoryModal.style.display = 'none';
    // Re-render filters in case categories changed
    renderMatrixFilters();
    renderMatrixView();
}

function renderCategoryListManager() {
    Elements.categoryListManager.innerHTML = '';
    State.categories.forEach(cat => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${cat}</span>
            <button class="btn-icon delete" onclick="deleteCategory('${cat}')" title="Delete">🗑️</button>
        `;
        Elements.categoryListManager.appendChild(li);
    });
}

function addNewCategory() {
    const name = Elements.newCategoryInput.value.trim();
    if (name && !State.categories.includes(name)) {
        State.categories.push(name);
        State.categories.sort();
        saveCategories();
        Elements.newCategoryInput.value = '';
        renderCategoryListManager();
    }
}

window.deleteCategory = function (catName) {
    if (confirm(`Delete category "${catName}"? Events with this category will remain but the category will be removed from the list.`)) {
        State.categories = State.categories.filter(c => c !== catName);
        saveCategories();
        renderCategoryListManager();
    }
};

// --- Matrix View Logic ---

function renderMatrixFilters() {
    Elements.categoryFiltersContainer.innerHTML = '';

    // Use stored categories
    State.categories.forEach(cat => {
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
            renderMatrixView();
        });

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(cat));
        Elements.categoryFiltersContainer.appendChild(label);
    });
}

function getUniqueDates() {
    return [...new Set(State.events.map(e => e.start))].sort();
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

// Helper to determine conflict
function getConflicts(event) {
    return State.events.filter(e => {
        if (e.id === event.id) return false;
        const overlap = event.start <= e.end && event.end >= e.start;
        return overlap;
    });
}

function renderMatrixView() {
    const tableHead = document.getElementById('matrixHeader');
    const tableBody = document.getElementById('matrixBody');

    tableHead.innerHTML = '';
    tableBody.innerHTML = '';

    const dates = getUniqueDates();

    // Effective categories to show (based on State.categories AND filters)
    const activeCategories = State.categories.filter(cat =>
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
        const eventsOnDate = State.events.filter(e => e.start === dateStart);

        // Filter by search
        const searchInput = State.filters.search;
        // Optimization: check if ANY event on this date matches search
        // But we actually need to filter individual cells

        // Note: We only want to show this row if there is at least one visible event
        // OR checks against active categories?
        // Let's iterate all active categories and see if we have content.

        let rowHasContent = false;
        const rowCells = [];

        activeCategories.forEach(cat => {
            const eventsInCell = eventsOnDate.filter(e => e.category === cat);
            const matchingEvents = eventsInCell.filter(e =>
                !searchInput ||
                e.title.toLowerCase().includes(searchInput) ||
                e.location.toLowerCase().includes(searchInput)
            );

            if (matchingEvents.length > 0) rowHasContent = true;
            rowCells.push({ cat, events: matchingEvents });
        });

        if (!rowHasContent && searchInput) return; // Skip empty rows during search

        const tr = document.createElement('tr');

        // Date Cell
        const dateCell = document.createElement('td');
        dateCell.className = 'date-cell';
        const sampleEvent = eventsOnDate[0];
        dateCell.textContent = formatDateRange(sampleEvent.start, sampleEvent.end);
        tr.appendChild(dateCell);

        // Category Cells
        rowCells.forEach(cellData => {
            const td = document.createElement('td');
            cellData.events.forEach(event => {
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

// --- Calendar View Logic ---

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

    for (let i = 0; i < firstDay; i++) {
        const dayCell = document.createElement('div');
        dayCell.className = 'calendar-day other-month';
        Elements.calendarGrid.appendChild(dayCell);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayCell = document.createElement('div');
        dayCell.className = 'calendar-day';
        dayCell.innerHTML = `<span class="day-number">${day}</span>`;

        const eventsOnDay = State.events.filter(e => {
            return dateStr >= e.start && dateStr <= e.end;
        });

        eventsOnDay.forEach(event => {
            // Only show if category exists in our managed list (optional? let's filter)
            if (!State.categories.includes(event.category)) return;

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

            eventEl.onclick = (e) => {
                e.stopPropagation();
                toggleAttendance(event.id);
            };

            dayCell.appendChild(eventEl);
        });

        Elements.calendarGrid.appendChild(dayCell);
    }
}

// --- Event Actions ---

window.toggleAttendance = function (id) {
    const event = State.events.find(e => e.id === id);
    if (!event) return;

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

// --- Modal Logic ---

function openModal(event = null) {
    Elements.eventModal.style.display = 'flex';

    // Populate Category Dropdown
    Elements.eventCategorySelect.innerHTML = '';
    State.categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        Elements.eventCategorySelect.appendChild(option);
    });

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
        const event = State.events.find(e => e.id === id);
        if (event) {
            Object.assign(event, { title, category, start, end, location });
        }
    } else {
        const newEvent = {
            id: 'evt_' + Date.now(),
            title,
            category,
            start,
            end,
            location,
            attending: true
        };
        State.events.push(newEvent);
    }

    saveData();
    closeModal();
    render();
}

// Export Feature
function exportScheduleData() {
    // We want to export the CURRENT events state
    const dataStr = JSON.stringify(State.events, null, 2);
    const fileContent = `const initialData = ${dataStr};\n`;

    const blob = new Blob([fileContent], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert('Started download of "data.js".\n\nTo make your changes permanent for everyone:\n1. Rename this downloaded file to "data.js".\n2. Replace the old "data.js" in your project folder with this new one.\n3. Push the changes to GitHub.');
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
