(() => {
  const root = document.querySelector('[data-privilege-checklist]');
  if (!root) return;
  const KEY = 'apd-privilege-checklist-v1';
  const saved = JSON.parse(localStorage.getItem(KEY) || '{}');
  const items = [
    ['auth', 'gcloud auth login completed on an operator machine'],
    ['project', 'Project id set; region australia-southeast1'],
    ['bootstrap', 'cloud/iam/bootstrap.sh applied (SAs, WIF, secret shells)'],
    ['vars', 'GitHub Actions vars GCP_PROJECT_ID, GCP_REGION, GCP_WIF_PROVIDER, GCP_DEPLOY_SA'],
    ['testkeys', 'Stripe test key versions added via add-test-secrets.sh'],
    ['identity', 'Stripe identity completed in Dashboard only — not uploaded here'],
    ['live', 'Live charges still blocked until an explicit live confirmation']
  ];
  root.innerHTML = items.map(([id, label]) => {
    const checked = saved[id] ? 'checked' : '';
    return `<label style="display:block;margin:.4rem 0"><input type="checkbox" data-id="${id}" ${checked}> ${label}</label>`;
  }).join('');
  root.addEventListener('change', (event) => {
    const box = event.target;
    if (!box.dataset.id) return;
    saved[box.dataset.id] = box.checked;
    localStorage.setItem(KEY, JSON.stringify(saved));
  });
})();
