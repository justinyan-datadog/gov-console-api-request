// Modal
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
  clearDate();
}

function submitRequest() {
  const newLimit = document.getElementById('newLimit').value;
  const justification = document.getElementById('justification').value;

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

// Datepicker
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

let dpYear, dpMonth, selectedDate = null;

function initDatepicker() {
  const now = new Date();
  dpYear = now.getFullYear();
  dpMonth = now.getMonth();
  renderCalendar();
}

function toggleDatepicker() {
  const dropdown = document.getElementById('datepickerDropdown');
  const trigger = document.getElementById('datepickerTrigger');
  if (dropdown.classList.contains('open')) {
    closeDatepicker();
  } else {
    if (selectedDate) {
      dpYear = selectedDate.getFullYear();
      dpMonth = selectedDate.getMonth();
    }
    renderCalendar();
    dropdown.classList.add('open');
    trigger.classList.add('active');
  }
}

function closeDatepicker() {
  document.getElementById('datepickerDropdown').classList.remove('open');
  document.getElementById('datepickerTrigger').classList.remove('active');
}

function changeMonth(dir) {
  dpMonth += dir;
  if (dpMonth < 0) { dpMonth = 11; dpYear--; }
  if (dpMonth > 11) { dpMonth = 0; dpYear++; }
  renderCalendar();
}

function renderCalendar() {
  document.getElementById('monthYearLabel').textContent = `${MONTHS[dpMonth]} ${dpYear}`;

  const container = document.getElementById('datepickerDays');
  container.innerHTML = '';

  const firstDay = new Date(dpYear, dpMonth, 1).getDay();
  const daysInMonth = new Date(dpYear, dpMonth + 1, 0).getDate();
  const daysInPrev = new Date(dpYear, dpMonth, 0).getDate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = firstDay - 1; i >= 0; i--) {
    const btn = createDayButton(daysInPrev - i, true, null);
    container.appendChild(btn);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(dpYear, dpMonth, d);
    date.setHours(0, 0, 0, 0);
    const isToday = date.getTime() === today.getTime();
    const isPast = date < today;
    const isSelected = selectedDate && date.getTime() === selectedDate.getTime();

    const btn = createDayButton(d, false, date);
    if (isToday) btn.classList.add('today');
    if (isPast) btn.classList.add('disabled');
    if (isSelected) btn.classList.add('selected');
    container.appendChild(btn);
  }

  const totalCells = firstDay + daysInMonth;
  const remaining = (7 - (totalCells % 7)) % 7;
  for (let d = 1; d <= remaining; d++) {
    const btn = createDayButton(d, true, null);
    container.appendChild(btn);
  }
}

function createDayButton(day, isOtherMonth, date) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'datepicker-day';
  btn.textContent = day;
  if (isOtherMonth) {
    btn.classList.add('other-month', 'disabled');
  } else if (date) {
    btn.addEventListener('click', () => selectDate(date));
  }
  return btn;
}

function selectDate(date) {
  selectedDate = date;
  const formatted = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const valueEl = document.getElementById('datepickerValue');
  valueEl.textContent = formatted;
  valueEl.classList.remove('placeholder');

  const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  document.getElementById('expirationDate').value = iso;

  renderCalendar();
  closeDatepicker();
}

function clearDate() {
  selectedDate = null;
  document.getElementById('expirationDate').value = '';
  const valueEl = document.getElementById('datepickerValue');
  valueEl.textContent = 'Select a date...';
  valueEl.classList.add('placeholder');

  const now = new Date();
  dpYear = now.getFullYear();
  dpMonth = now.getMonth();
  renderCalendar();
  closeDatepicker();
}

function selectToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  selectDate(today);
}

document.addEventListener('click', function(e) {
  const wrapper = document.getElementById('datepickerWrapper');
  if (wrapper && !wrapper.contains(e.target)) {
    closeDatepicker();
  }
});

document.getElementById('datepickerValue').classList.add('placeholder');
initDatepicker();
