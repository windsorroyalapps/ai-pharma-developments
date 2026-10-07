/** Local research pipeline. No network, no card data, no live charge. */
(function () {
  var KEY = 'apd_pipeline_v1';
  var STAGES = ['intake', 'scope', 'literature', 'review', 'billing_hold'];

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { return []; }
  }
  function save(rows) {
    localStorage.setItem(KEY, JSON.stringify(rows.slice(-40)));
    render();
  }
  function render() {
    var board = document.getElementById('board');
    var rows = load();
    if (!rows.length) {
      board.textContent = 'No briefs yet.';
      return;
    }
    board.innerHTML = '';
    rows.slice().reverse().forEach(function (row) {
      var card = document.createElement('article');
      card.className = 'card';
      card.style.marginTop = '0.75rem';
      var next = STAGES[STAGES.indexOf(row.stage) + 1];
      card.innerHTML = '<h3>' + row.title + '</h3><p>' + row.question + '</p><p><code>' + row.stage + '</code> · ' + row.email + '</p>';
      if (next) {
        var button = document.createElement('button');
        button.className = 'btn';
        button.type = 'button';
        button.textContent = 'Advance to ' + next;
        button.addEventListener('click', function () {
          row.stage = next;
          row.history.push({ stage: next, ts: new Date().toISOString() });
          if (next === 'billing_hold') row.charged = false;
          save(rows);
        });
        card.appendChild(button);
      } else {
        var note = document.createElement('p');
        note.textContent = 'Billing hold. Checkout stays dry-run until Stripe test keys exist.';
        card.appendChild(note);
      }
      board.appendChild(card);
    });
  }
  document.getElementById('brief-form').addEventListener('submit', function (event) {
    event.preventDefault();
    var data = new FormData(event.target);
    var rows = load();
    var now = new Date().toISOString();
    rows.push({
      id: 'brief_' + Math.random().toString(16).slice(2, 10),
      title: String(data.get('title') || '').slice(0, 160),
      question: String(data.get('question') || '').slice(0, 2000),
      email: String(data.get('email') || '').slice(0, 200),
      stage: 'intake',
      charged: false,
      history: [{ stage: 'intake', ts: now }]
    });
    save(rows);
    event.target.reset();
  });
  render();
})();
