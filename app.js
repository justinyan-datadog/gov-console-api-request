function openModal() {
  document.getElementById('modalOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(event) {
  if (event && event.target !== event.currentTarget) return;
  document.getElementById('modalOverlay').classList.remove('active');
  document.body.style.overflow = '';
  closeDatepicker();
  resetForm();
}

function resetForm() {
  document.getElementById('newLimit').value = '';
  document.getElementById('justification').value = '';
  document.getElementById('expirationDate').value = '';
  document.getElementById('datepickerValue').textContent = 'Select a date';
  document.getElementById('datepickerValue').classList.add('placeholder');
  document.getElementById('datepickerInput').style.borderColor = '';
  selectedDate = null;
}

function submitRequest() {
  const newLimit = document.getElementById('newLimit').value;
  const justification = document.getElementById('justification').value;
  const expirationDate = document.getElementById('expirationDate').value;

  if (!newLimit) {
    document.getElementById('newLimit').focus();
    document.getElementById('newLimit').style.borderColor = '#e24e5a';
    return;
  }

  if (!justification.trim()) {
    document.getElementById('justification').focus();
    document.getElementById('justification').style.borderColor = '#e24e5a';
    return;
  }

  if (!expirationDate) {
    document.getElementById('datepickerInput').classList.add('error');
    return;
  }

  document.getElementById('modalOverlay').classList.remove('active');
  document.body.style.overflow = '';

  const toast = document.getElementById('toast');
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);

  resetForm();
}

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    if (document.getElementById('datepickerDropdown').classList.contains('open')) {
      closeDatepicker();
    } else {
      closeModal();
    }
  }
});

document.getElementById('newLimit').addEventListener('input', function() {
  this.style.borderColor = '';
});

document.getElementById('justification').addEventListener('input', function() {
  this.style.borderColor = '';
});

// ── Custom Date Picker ──

let currentMonth, currentYear, selectedDate = null;

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function initDatepicker() {
  const today = new Date();
  currentMonth = today.getMonth();
  currentYear = today.getFullYear();
  renderCalendar();
}

function renderCalendar() {
  const daysContainer = document.getElementById('datepickerDays');
  const monthYearLabel = document.getElementById('monthYear');
  monthYearLabel.textContent = MONTHS[currentMonth] + ' ' + currentYear;

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let html = '';

  // Previous month trailing days
  for (let i = firstDay - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    html += '<button class="datepicker-day other-month disabled" type="button" disabled>' + day + '</button>';
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(currentYear, currentMonth, d);
    date.setHours(0, 0, 0, 0);
    const isPast = date < today;
    const isToday = date.getTime() === today.getTime();
    const isSelected = selectedDate && date.getTime() === selectedDate.getTime();

    let cls = 'datepicker-day';
    if (isPast) cls += ' disabled';
    if (isToday) cls += ' today';
    if (isSelected) cls += ' selected';

    if (isPast) {
      html += '<button class="' + cls + '" type="button" disabled>' + d + '</button>';
    } else {
      html += '<button class="' + cls + '" type="button" data-date="' + currentYear + '-' + String(currentMonth + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0') + '">' + d + '</button>';
    }
  }

  // Next month leading days
  const totalCells = firstDay + daysInMonth;
  const remaining = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
  for (let i = 1; i <= remaining; i++) {
    html += '<button class="datepicker-day other-month disabled" type="button" disabled>' + i + '</button>';
  }

  daysContainer.innerHTML = html;
}

function openDatepicker() {
  document.getElementById('datepickerDropdown').classList.add('open');
  document.getElementById('datepickerInput').classList.add('active');
}

function closeDatepicker() {
  document.getElementById('datepickerDropdown').classList.remove('open');
  document.getElementById('datepickerInput').classList.remove('active');
}

function selectDate(dateStr) {
  const parts = dateStr.split('-');
  selectedDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  selectedDate.setHours(0, 0, 0, 0);

  document.getElementById('expirationDate').value = dateStr;

  const formatted = MONTHS[selectedDate.getMonth()] + ' ' + selectedDate.getDate() + ', ' + selectedDate.getFullYear();
  const valueEl = document.getElementById('datepickerValue');
  valueEl.textContent = formatted;
  valueEl.classList.remove('placeholder');

  document.getElementById('datepickerInput').classList.remove('error');

  renderCalendar();
  closeDatepicker();
}

// Toggle dropdown on input click
document.getElementById('datepickerInput').addEventListener('click', function() {
  const dropdown = document.getElementById('datepickerDropdown');
  if (dropdown.classList.contains('open')) {
    closeDatepicker();
  } else {
    openDatepicker();
  }
});

// Keyboard support for datepicker input
document.getElementById('datepickerInput').addEventListener('keydown', function(e) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    const dropdown = document.getElementById('datepickerDropdown');
    if (dropdown.classList.contains('open')) {
      closeDatepicker();
    } else {
      openDatepicker();
    }
  }
});

// Navigate months
document.getElementById('prevMonth').addEventListener('click', function(e) {
  e.stopPropagation();
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  renderCalendar();
});

document.getElementById('nextMonth').addEventListener('click', function(e) {
  e.stopPropagation();
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  renderCalendar();
});

// Day selection via event delegation
document.getElementById('datepickerDays').addEventListener('click', function(e) {
  const btn = e.target.closest('.datepicker-day');
  if (!btn || btn.disabled) return;
  const dateStr = btn.getAttribute('data-date');
  if (dateStr) selectDate(dateStr);
});

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
  const wrapper = document.getElementById('datepickerWrapper');
  if (wrapper && !wrapper.contains(e.target)) {
    closeDatepicker();
  }
});

// Init
initDatepicker();
