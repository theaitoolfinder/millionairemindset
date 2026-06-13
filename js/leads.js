// ===== LEAD CAPTURE — Google Sheets via Apps Script =====
// Replace this URL with your deployed Google Apps Script Web App URL
const LEADS_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';

async function submitLead(formId, business, successId) {
  const form = document.getElementById(formId);
  if (!form) return;

  const btn = form.querySelector('.btn-biz');
  const originalText = btn.textContent;

  // Gather fields
  const data = {
    business: business,
    timestamp: new Date().toLocaleString('en-PH', { timeZone: 'Asia/Manila' }),
    name:     form.querySelector('[name="name"]')?.value || '',
    email:    form.querySelector('[name="email"]')?.value || '',
    phone:    form.querySelector('[name="phone"]')?.value || '',
    location: form.querySelector('[name="location"]')?.value || '',
    interest: form.querySelector('[name="interest"]')?.value || '',
    message:  form.querySelector('[name="message"]')?.value || '',
  };

  // Basic validation
  if (!data.name || !data.email) {
    showLeadError(form, 'Please fill in your name and email.');
    return;
  }

  // Loading state
  btn.textContent = 'Sending...';
  btn.disabled = true;

  try {
    if (LEADS_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
      // Demo mode — just show success
      await new Promise(r => setTimeout(r, 800));
    } else {
      await fetch(LEADS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    }

    // Show success
    form.style.display = 'none';
    const successEl = document.getElementById(successId);
    if (successEl) successEl.style.display = 'block';

    // Track in localStorage
    const leads = JSON.parse(localStorage.getItem('mm_leads') || '[]');
    leads.push({ ...data, submitted: true });
    localStorage.setItem('mm_leads', JSON.stringify(leads));

  } catch (err) {
    btn.textContent = originalText;
    btn.disabled = false;
    showLeadError(form, 'Something went wrong. Please try again.');
  }
}

function showLeadError(form, msg) {
  let err = form.querySelector('.lead-error');
  if (!err) {
    err = document.createElement('p');
    err.className = 'lead-error';
    err.style.cssText = 'color:#e87a7a;font-size:0.8rem;text-align:center;margin-top:4px;';
    form.appendChild(err);
  }
  err.textContent = msg;
  setTimeout(() => err.remove(), 4000);
}
