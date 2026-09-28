/* ==========================================================================
   appointment.js — Appointment booking form behaviour
   Submits to the PHP endpoint at api/appointments.php (see /api/README.md).
   Change API_BASE below if the API is hosted on a different domain/path.
   ========================================================================== */

const API_BASE = ''; // e.g. 'https://api.your-clinic.com' if hosted separately

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('appointmentForm');
  if (!form) return;

  const successBox = document.getElementById('appointmentSuccess');
  const errorBox = document.getElementById('appointmentError');

  /* Restrict date picker to today and later */
  const dateInput = form.querySelector('#preferredDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    e.stopPropagation();

    if (!form.checkValidity() || !window.validateAppointmentForm(form)) {
      form.classList.add('was-validated');
      return;
    }

    const formData = {
      name: form.patientName.value.trim(),
      phone: form.phoneNumber.value.trim(),
      email: form.email.value.trim(),
      age: form.age.value.trim(),
      gender: form.gender.value,
      date: form.preferredDate.value,
      time: form.preferredTime.value,
      service: form.service.value,
      doctor: form.doctorSelect.value,
      message: form.message.value.trim(),
      website: form.website ? form.website.value : '' // honeypot — real users leave this blank
    };

    submitAppointment(formData);
  });

  /**
   * Submits to the PHP backend at api/appointments.php.
   * IMPORTANT (security):
   *  - Client-side validation is a UX convenience only — the PHP endpoint
   *    re-validates and sanitizes everything server-side.
   *  - Never place API keys or secrets in this file.
   */
  async function submitAppointment(data) {
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }

    try {
      const response = await fetch(`${API_BASE}/api/appointments.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.error || 'Request failed');
      }
      showSuccess();
      form.reset();
      form.classList.remove('was-validated');
    } catch (err) {
      showError(err.message);
    } finally {
      if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = '<i class="bi bi-calendar-check"></i> Book Appointment'; }
    }
  }

  function showSuccess() {
    if (errorBox) errorBox.style.display = 'none';
    if (successBox) {
      successBox.style.display = 'block';
      successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => { successBox.style.display = 'none'; }, 6000);
    }
  }

  function showError(message) {
    if (errorBox) {
      errorBox.textContent = 'Sorry, something went wrong sending your request. Please call the clinic directly at +880 XXX XXXXXXX, or try again in a moment.';
      errorBox.style.display = 'block';
      errorBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
});
function submitAppointment(data) {
  console.log('Appointment request (demo, not sent to a server):', data);
  showSuccess();
  form.reset();
  form.classList.remove('was-validated');
}