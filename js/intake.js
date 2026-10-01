(function () {
  var form = document.getElementById('consult-form');
  if (!form) return;
  var toast = document.getElementById('consult-toast');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var payload = {
      name: form.name.value,
      email: form.email.value,
      org: form.org.value,
      when: form.when.value,
      need: form.need.value
    };
    var endpoint = window.INTAKE_URL || '';
    function mailto() {
      var body = [
        'Name: ' + payload.name,
        'Email: ' + payload.email,
        'Org: ' + payload.org,
        'Window: ' + payload.when,
        '',
        payload.need
      ].join('\n');
      location.href = 'mailto:troy.windsor1989@gmail.com?subject=' +
        encodeURIComponent('Consult request — AI Pharma Developments') +
        '&body=' + encodeURIComponent(body);
    }
    if (!endpoint || endpoint.indexOf('YOUR-CLOUD-RUN-URL') !== -1) {
      mailto();
      return;
    }
    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(function (res) {
      if (!res.ok) throw new Error('intake failed');
      if (toast) toast.textContent = 'Request queued. A copy email draft is opening.';
      mailto();
    }).catch(function () {
      if (toast) toast.textContent = 'Worker unreachable. Opening email draft.';
      mailto();
    });
  });
})();
