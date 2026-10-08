(function () {
  var form = document.getElementById('consult-form');
  if (!form) return;
  var toast = document.getElementById('consult-toast');
  var KEY = 'apd_intake_fallback';

  function show(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
  }

  function saveLocal(payload) {
    var rows = [];
    try { rows = JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { rows = []; }
    rows.push(Object.assign({ ts: new Date().toISOString(), charged: false, channel: 'local_fallback' }, payload));
    localStorage.setItem(KEY, JSON.stringify(rows.slice(-30)));
    return rows.length;
  }

  function mailto(payload) {
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

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var payload = {
      name: form.name.value,
      email: form.email.value,
      org: form.org.value,
      when: form.when.value,
      need: form.need.value
    };
    var saved = saveLocal(payload);
    var endpoint = window.INTAKE_URL || '';
    var placeholder = !endpoint || endpoint.indexOf('YOUR-CLOUD-RUN-URL') !== -1;
    if (placeholder) {
      show('Saved locally (' + saved + '). Worker not deployed. Opening email draft.');
      mailto(payload);
      return;
    }
    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(function (res) {
      if (!res.ok) throw new Error('intake failed');
      show('Request queued on worker. Local copy kept. Opening email draft.');
      mailto(payload);
    }).catch(function () {
      show('Worker unreachable. Local fallback kept (' + saved + '). Opening email draft.');
      mailto(payload);
    });
  });

  var exportBtn = document.getElementById('consult-export');
  var clearBtn = document.getElementById('consult-clear');
  var localView = document.getElementById('consult-local');

  function readRows() {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { return []; }
  }

  function renderLocal() {
    if (!localView) return;
    var rows = readRows();
    localView.textContent = rows.length ? JSON.stringify(rows, null, 2) : 'No local intake saved.';
  }

  if (exportBtn) {
    exportBtn.addEventListener('click', function () {
      var rows = readRows();
      var blob = new Blob([rows.map(function (row) { return JSON.stringify(row); }).join('\n') + (rows.length ? '\n' : '')], { type: 'application/x-ndjson' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'apd-consult-intake.jsonl';
      a.click();
      URL.revokeObjectURL(url);
      show('Exported ' + rows.length + ' local row(s). No charge.');
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', function () {
      localStorage.removeItem(KEY);
      renderLocal();
      show('Local intake cleared. Nothing was charged.');
    });
  }
  renderLocal();

})();
