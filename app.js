function openModal() {
  document.getElementById('modalOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(event) {
  if (event && event.target !== event.currentTarget) return;
  document.getElementById('modalOverlay').classList.remove('active');
  document.body.style.overflow = '';
  resetForm();
}

function resetForm() {
  document.getElementById('newLimit').value = '';
  document.getElementById('justification').value = '';
  document.getElementById('expirationDate').value = '';
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
    closeModal();
  }
});

document.getElementById('newLimit').addEventListener('input', function() {
  this.style.borderColor = '';
});

document.getElementById('justification').addEventListener('input', function() {
  this.style.borderColor = '';
});
