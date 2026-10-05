/** Service catalog used by pay.html, catalog.html, and automation.html. Amounts in AUD cents. No card data. */
window.APD_CATALOG = [
  { sku: 'consult-30', name: 'Discovery consult (30 min)', amount_cents: 15000, mode: 'one_time' },
  { sku: 'scoping', name: 'Automation scoping pack', amount_cents: 45000, mode: 'one_time' },
  { sku: 'support', name: 'Patient-support workflow setup', amount_cents: 25000, mode: 'one_time' },
  { sku: 'careflow-setup', name: 'Careflow intake automation setup', amount_cents: 35000, mode: 'one_time' },
  { sku: 'retainer', name: 'Research support retainer (monthly)', amount_cents: 100000, mode: 'subscription_preview' },
  { sku: 'ops-retainer', name: 'Site and payment ops retainer (monthly)', amount_cents: 75000, mode: 'subscription_preview' }
];
