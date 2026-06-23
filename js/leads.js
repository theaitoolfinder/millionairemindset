const LEADS_EP = 'https://mm-subscribe.info-myaitoolbox.workers.dev';

async function submitLead(data) {
  if (!data || !data.email) return;
  try {
    await fetch(LEADS_EP, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email:     data.email,
        name:      data.name     || '',
        country:   data.country  || '',
        source:    data.source   || '',
      }),
    });
  } catch (_) {
    // non-blocking — don't surface network errors to user
  }
}
