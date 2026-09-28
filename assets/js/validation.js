/* ==========================================================================
   validation.js — shared client-side validation helpers
   NOTE: Client-side validation improves UX only. It is NOT a security
   control — always re-validate and sanitize every field on the server.
   ========================================================================== */

/** Basic email pattern check */
function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

/** Accepts Bangladeshi or general international phone formats, 10–15 digits */
function isValidPhone(value) {
  const digits = value.replace(/[^\d]/g, '');
  return digits.length >= 10 && digits.length <= 15;
}

/** Preferred date must not be in the past */
function isValidFutureDate(value) {
  if (!value) return false;
  const chosen = new Date(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return chosen >= today;
}

/**
 * Validates the appointment form fields beyond Bootstrap's built-in
 * `required` checks. Adds/removes Bootstrap's is-invalid class per field.
 * Returns true if the form is valid.
 */
function validateAppointmentForm(form) {
  let valid = true;

  const check = (field, condition) => {
    if (!field) return;
    if (!condition) {
      field.classList.add('is-invalid');
      valid = false;
    } else {
      field.classList.remove('is-invalid');
    }
  };

  check(form.patientName, form.patientName.value.trim().length >= 2);
  check(form.phoneNumber, isValidPhone(form.phoneNumber.value));
  check(form.email, isValidEmail(form.email.value));
  check(form.age, form.age.value && +form.age.value > 0 && +form.age.value < 120);
  check(form.gender, !!form.gender.value);
  check(form.preferredDate, isValidFutureDate(form.preferredDate.value));
  check(form.preferredTime, !!form.preferredTime.value);
  check(form.service, !!form.service.value);
  check(form.doctorSelect, !!form.doctorSelect.value);

  return valid;
}

/**
 * Validates a simpler contact form (name, email, phone, subject, message).
 */
function validateContactForm(form) {
  let valid = true;
  const check = (field, condition) => {
    if (!field) return;
    if (!condition) {
      field.classList.add('is-invalid');
      valid = false;
    } else {
      field.classList.remove('is-invalid');
    }
  };
  check(form.contactName, form.contactName.value.trim().length >= 2);
  check(form.contactEmail, isValidEmail(form.contactEmail.value));
  check(form.contactPhone, form.contactPhone.value ? isValidPhone(form.contactPhone.value) : true);
  check(form.contactSubject, form.contactSubject.value.trim().length >= 3);
  check(form.contactMessage, form.contactMessage.value.trim().length >= 10);
  return valid;
}

window.validateAppointmentForm = validateAppointmentForm;
window.validateContactForm = validateContactForm;
