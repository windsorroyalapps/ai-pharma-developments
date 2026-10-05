/* CareFlow guided demo.

   A synthetic-data walkthrough of the CareFlow practice platform. There is no
   backend, no network request and no real CareFlow account: every screen is
   rendered from static fixtures in this file.

   The role permission matrix below is transcribed from the real platform
   (gp-practice-platform > packages/contracts/src/index.ts > rolePermissions).
   That is the whole point of the demo: switching role genuinely changes what the
   interface offers, so a prospective client can see separation of duties work
   rather than take our word for it.

   Nothing here is a clinical record, a prescription, or a claim of regulatory
   readiness. Screens are watermarked accordingly. */

(function () {
  'use strict';

  var root = document.getElementById('careflow-demo');
  if (!root) return;

  /* ------------------------------------------------------------------ data */

  // Transcribed from packages/contracts/src/index.ts. Keep in sync with the
  // platform; a demo that overstates access is worse than no demo.
  var ROLE_PERMISSIONS = {
    DOCTOR: ['patients:read', 'patients:write', 'schedule:read', 'schedule:write', 'schedule:override', 'checkin:write', 'notifications:read', 'clinical:read', 'clinical:write', 'clinical:sign'],
    NURSE: ['patients:read', 'patients:write', 'schedule:read', 'checkin:write', 'notifications:read', 'clinical:read', 'clinical:write'],
    ADMIN: ['patients:read', 'patients:write', 'schedule:read', 'schedule:write', 'checkin:write', 'notifications:read', 'notifications:manage', 'availability:manage', 'clinical:read'],
    RECEPTION: ['patients:read', 'patients:write', 'schedule:read', 'schedule:write', 'checkin:write', 'notifications:read'],
    PRACTICE_MANAGER: ['patients:read', 'patients:write', 'schedule:read', 'schedule:write', 'schedule:override', 'checkin:write', 'notifications:read', 'notifications:manage', 'availability:manage', 'users:manage', 'audit:read', 'clinical:read'],
    AUDITOR: ['patients:read', 'schedule:read', 'notifications:read', 'audit:read']
  };

  var ROLES = [
    { code: 'DOCTOR', label: 'Doctor', who: 'Dr Dana Doctor', note: 'can author and sign a clinical record' },
    { code: 'NURSE', label: 'Nurse', who: 'Nora Nurse', note: 'can write a draft, cannot sign it' },
    { code: 'RECEPTION', label: 'Reception', who: 'Rae Reception', note: 'booking and check-in only' },
    { code: 'PRACTICE_MANAGER', label: 'Practice manager', who: 'Morgan Manager', note: 'staff, availability, release evidence' },
    { code: 'ADMIN', label: 'Administrator', who: 'Alex Admin', note: 'operations; named approver for storage and backup risk' },
    { code: 'AUDITOR', label: 'Auditor', who: 'Avery Auditor', note: 'read-only, no clinical write' }
  ];

  // Each screen declares the permission it needs. If the active role lacks it, the
  // screen renders a refusal instead of content.
  var SCREENS = [
    { id: 'today', label: 'Today', needs: 'notifications:read', group: 'Practice' },
    { id: 'booking', label: 'Booking', needs: 'schedule:write', group: 'Practice' },
    { id: 'checkin', label: 'Check-in', needs: 'checkin:write', group: 'Practice' },
    { id: 'clinical', label: 'Clinical record', needs: 'clinical:read', group: 'Clinical' },
    { id: 'documents', label: 'Documents', needs: 'clinical:read', group: 'Clinical' },
    { id: 'matrix', label: 'Access matrix', needs: 'audit:read', group: 'Governance' }
  ];

  var APPOINTMENTS = [
    { time: '08:30', name: 'Priya Raman', type: 'Standard consult', who: 'Dr Dana Doctor', state: 'CONFIRMED', tone: 'blue' },
    { time: '09:15', name: 'Tom Whitfield', type: 'Review', who: 'Dr Dana Doctor', state: 'CHECKED_IN', tone: 'mint' },
    { time: '10:00', name: 'Ana Silva', type: 'Standard consult', who: 'Dr Dana Doctor', state: 'CONFIRMED', tone: 'blue' },
    { time: '11:00', name: 'James Okafor', type: 'Care plan review', who: 'Dr Dana Doctor', state: 'CONFIRMED', tone: 'violet' },
    { time: '13:30', name: 'Linh Nguyen', type: 'Standard consult', who: 'Dr Dana Doctor', state: 'CONFIRMED', tone: 'blue' },
    { time: '14:15', name: 'Grace Mbeki', type: 'Review', who: 'Dr Dana Doctor', state: 'IN_PROGRESS', tone: 'mint' }
  ];

  /* ----------------------------------------------------------------- state */

  var state = { role: 'DOCTOR', screen: 'today', recordSigned: false };

  var dom = {
    nav: root.querySelector('[data-cf-nav]'),
    canvas: root.querySelector('[data-cf-canvas]'),
    role: root.querySelector('[data-cf-role]'),
    url: root.querySelector('[data-cf-url]'),
    rail: root.querySelector('[data-cf-rail]'),
    narration: root.querySelector('[data-cf-narration]'),
    live: root.querySelector('[data-cf-live]'),
    switcher: root.querySelector('[data-cf-switcher]')
  };

  function role() {
    return state.role;
  }

  function allowed(permission) {
    return ROLE_PERMISSIONS[role()].indexOf(permission) !== -1;
  }

  function roleDef() {
    for (var i = 0; i < ROLES.length; i++) if (ROLES[i].code === role()) return ROLES[i];
    return ROLES[0];
  }

  /* --------------------------------------------------------------- helpers */

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      for (var key in attrs) {
        if (!Object.prototype.hasOwnProperty.call(attrs, key)) continue;
        var value = attrs[key];
        if (value === null || value === undefined) continue;
        if (key === 'class') node.className = value;
        else if (key === 'text') node.textContent = value;
        else if (key === 'html') node.innerHTML = value;
        else if (key.slice(0, 2) === 'on') node.addEventListener(key.slice(2), value);
        else node.setAttribute(key, value);
      }
    }
    (children || []).forEach(function (child) {
      if (child === null || child === undefined) return;
      node.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
    });
    return node;
  }

  function chip(label, tone) {
    return el('span', { class: 'cf-chip', 'data-tone': tone, text: label });
  }

  function notice(tone, title, body) {
    return el('div', { class: 'cf-notice', 'data-tone': tone }, [
      el('div', {}, [el('strong', { text: title }), el('span', { text: body })])
    ]);
  }

  function stat(label, value, detail, tone) {
    return el('div', { class: 'cf-stat', 'data-tone': tone || 'mint' }, [
      el('span', { text: label }),
      el('strong', { text: String(value) }),
      el('small', { text: detail })
    ]);
  }

  function panel(title, linkLabel, bodyNodes) {
    var head = el('div', { class: 'cf-panel-head' }, [
      el('h4', { text: title }),
      linkLabel ? el('a', { href: '#careflow-demo', text: linkLabel, onclick: function (e) { e.preventDefault(); } }) : null
    ]);
    return el('section', { class: 'cf-panel' }, [head].concat(bodyNodes));
  }

  /* ---------------------------------------------------------------- screens */

  function screenToday() {
    var checkedIn = APPOINTMENTS.filter(function (a) { return a.state === 'CHECKED_IN' || a.state === 'IN_PROGRESS'; });

    var rows = APPOINTMENTS.map(function (a) {
      return el('div', { class: 'cf-row' }, [
        el('div', { class: 'cf-time', text: a.time }),
        el('div', { class: 'cf-who' }, [
          el('strong', { text: a.name }),
          el('span', { text: a.type + ' · ' + a.who })
        ]),
        chip(a.state.replace('_', ' ').toLowerCase(), a.tone)
      ]);
    });

    var queue = checkedIn.map(function (a) {
      return el('div', { class: 'cf-row' }, [
        el('div', { class: 'cf-time', text: a.time }),
        el('div', { class: 'cf-who' }, [el('strong', { text: a.name }), el('span', { text: 'Waiting in the practice' })]),
        chip('checked in', 'mint')
      ]);
    });

    return [
      el('div', { class: 'cf-screen-head' }, [
        el('div', {}, [
          el('div', { class: 'cf-eyebrow', text: 'Synthetic day' }),
          el('h3', { text: 'Good morning, ' + roleDef().who.split(' ').slice(-1)[0] + '.' }),
          el('p', { text: 'The day view a clinician actually opens: what is next, who is waiting, and what still needs a decision.' })
        ]),
        chip(roleDef().label, 'mint')
      ]),
      notice('amber', 'Synthetic data only', 'Every person, time and note in this demo is invented. Nothing here is a real patient record and nothing here may be used for patient care.'),
      el('div', { class: 'cf-stats' }, [
        stat('Appointments', 6, '4 still to see', 'blue'),
        stat('In the practice', checkedIn.length, 'a patient is waiting', 'mint'),
        stat('Next up', '09:15', 'Tom Whitfield', 'violet')
      ]),
      el('div', { class: 'cf-grid-2' }, [
        panel("Today's schedule", 'Calendar', rows),
        panel('Check-in queue', null, queue.length ? queue : [el('div', { class: 'cf-body' }, [el('p', { class: 'cf-matrix-note', text: 'No one is waiting right now.' })])])
      ])
    ];
  }

  function screenBooking() {
    var conflict = el('div', { class: 'cf-row', style: 'border-top:1px solid var(--cf-edge-soft)' }, [
      el('div', { class: 'cf-time', text: '10:00' }),
      el('div', { class: 'cf-who' }, [
        el('strong', { text: 'Requested: Ana Silva, 60 min' }),
        el('span', { text: 'Room 2 is already held by Dr Dana Doctor' })
      ]),
      chip('blocked', 'rose')
    ]);

    return [
      el('div', { class: 'cf-screen-head' }, [
        el('div', {}, [
          el('div', { class: 'cf-eyebrow', text: 'Scheduling' }),
          el('h3', { text: 'Booking that cannot double-book.' }),
          el('p', { text: 'Practitioner and room conflicts are rejected inside the transaction. Overriding one needs an explicit permission and a written reason, and the override is recorded permanently.' })
        ]),
        chip('slot held', 'blue')
      ]),
      el('div', { class: 'cf-stats' }, [
        stat('Open slots today', 7, 'across 2 rooms', 'mint'),
        stat('Conflicts caught', 1, 'this booking', 'rose'),
        stat('Overrides logged', 0, 'none recorded', 'blue')
      ]),
      panel('Attempted booking', null, [
        el('div', { class: 'cf-row' }, [
          el('div', { class: 'cf-time', text: '10:00' }),
          el('div', { class: 'cf-who' }, [el('strong', { text: 'Requested: Ana Silva, 60 min' }), el('span', { text: 'Room 2 · available in the naive view' })]),
          chip('attempted', 'blue')
        ]),
        conflict,
        el('div', { class: 'cf-body' }, [
          notice('mint', 'Refused, not adjusted', 'The write was rejected rather than silently shortened or moved. An override would have required schedule:override, which this role does not hold.'),
          el('p', { class: 'cf-matrix-note', text: allowed('schedule:override') ? 'You hold schedule:override, so an override is available here and must record a reason.' : 'This role cannot override the conflict, which is the intended behaviour for reception and nursing staff.' })
        ])
      ])
    ];
  }

  function screenCheckin() {
    var waiting = APPOINTMENTS.filter(function (a) { return a.state === 'CHECKED_IN' || a.state === 'IN_PROGRESS'; });
    return [
      el('div', { class: 'cf-screen-head' }, [
        el('div', {}, [
          el('div', { class: 'cf-eyebrow', text: 'Front desk' }),
          el('h3', { text: 'Check-in without touching clinical data.' }),
          el('p', { text: 'Reception can move a person from confirmed to in the practice. They cannot open the clinical workspace, and the navigation simply does not offer it.' })
        ]),
        chip(waiting.length + ' waiting', 'mint')
      ]),
      notice('blue', 'Boundary, not a warning label', 'The absence of a clinical tab for this role is enforced in code and covered by automated tests, not hidden behind a disabled button that hints at the route.'),
      panel('Waiting room', null, waiting.map(function (a) {
        return el('div', { class: 'cf-row' }, [
          el('div', { class: 'cf-time', text: a.time }),
          el('div', { class: 'cf-who' }, [el('strong', { text: a.name }), el('span', { text: a.type })]),
          chip(a.state === 'IN_PROGRESS' ? 'in progress' : 'checked in', 'mint')
        ]);
      }))
    ];
  }

  function screenClinical() {
    var canSign = allowed('clinical:sign');
    var canWrite = allowed('clinical:write');

    var fields = [
      ['Presentation', 'Three-day history of headache, no focal deficit.'],
      ['Assessment', 'Tension-type headache, probable.'],
      ['Plan', 'Analgesia as required; safety-netting advice given.'],
      ['Record status', state.recordSigned ? 'Signed and active' : 'Draft, inactive']
    ];

    var fieldNodes = fields.map(function (pair, index) {
      // The plan field is deliberately withheld from a read-only auditor.
      if (index === 2 && !canWrite) return null;
      return el('div', { class: 'cf-field' }, [el('span', { text: pair[0] }), el('strong', { text: pair[1] })]);
    }).filter(Boolean);

    var signArea = el('div', { class: 'cf-sign' }, canSign
      ? [
          chip(state.recordSigned ? 'signed' : 'unsigned draft', state.recordSigned ? 'mint' : 'amber'),
          el('span', { text: state.recordSigned ? 'Signed by ' + roleDef().who + ' with a verified second factor. The draft is now an active clinical record.' : 'This draft is inactive. A prescriber with a verified second factor must sign before it becomes part of the record.' }),
          el('button', {
            class: 'cf-btn',
            type: 'button',
            style: 'margin-left:auto',
            text: state.recordSigned ? 'Signed' : 'Sign as ' + roleDef().label,
            disabled: state.recordSigned ? 'disabled' : null,
            onclick: function () {
              state.recordSigned = true;
              render();
              announce('Record signed by ' + roleDef().who + '.');
            }
          })
        ]
      : [
          chip('cannot sign', 'rose'),
          el('span', { text: 'This role holds clinical:' + (canWrite ? 'write' : 'read') + ' but not clinical:sign. Signing is refused by the API, not merely hidden in the interface. A reviewer can confirm this from the boundary tests.' })
        ]);

    return [
      el('div', { class: 'cf-screen-head' }, [
        el('div', {}, [
          el('div', { class: 'cf-eyebrow', text: 'Clinical' }),
          el('h3', { text: 'A draft is not a record.' }),
          el('p', { text: 'Notes stay inactive until an authorised prescriber signs them with a verified second factor. Everything below is invented content written for this demo.' })
        ]),
        chip(canSign ? 'can sign' : 'cannot sign', canSign ? 'mint' : 'rose')
      ]),
      notice('rose', 'Synthetic record', 'The patient, the assessment and the plan below are fictional. This is a product demonstration, not a clinical document, and not a prescription.'),
      el('div', { class: 'cf-record' }, [
        el('div', { class: 'cf-record-bar' }, [
          el('strong', { text: 'Consultation note · synthetic patient 0421' }),
          chip('v' + (state.recordSigned ? '2 signed' : '1 draft'), state.recordSigned ? 'mint' : 'amber')
        ]),
        el('div', { class: 'cf-fields' }, fieldNodes),
        signArea
      ])
    ];
  }

  function screenDocuments() {
    return [
      el('div', { class: 'cf-screen-head' }, [
        el('div', {}, [
          el('div', { class: 'cf-eyebrow', text: 'Document safety' }),
          el('h3', { text: 'Uploaded files are quarantined first.' }),
          el('p', { text: 'An upload cannot be opened until it has been scanned. A scanner failure keeps the file locked rather than admitting it, because "the scan did not run" and "the scan found nothing" must not look the same.' })
        ]),
        chip('2 locked', 'amber')
      ]),
      el('div', { class: 'cf-quarantine' }, [
        el('div', { class: 'cf-doc' }, [
          el('div', { class: 'cf-doc-icon', 'data-state': 'clean', text: 'PDF' }),
          el('div', { class: 'cf-doc-body' }, [
            el('strong', { text: 'referral-letter-synthetic.pdf' }),
            el('span', { text: 'Scanned clean · SHA-256 recorded · readable by this role' })
          ]),
          chip('released', 'mint')
        ]),
        el('div', { class: 'cf-doc' }, [
          el('div', { class: 'cf-doc-icon', 'data-state': 'quarantined', text: 'PDF' }),
          el('div', { class: 'cf-doc-body' }, [
            el('strong', { text: 'scanned-result-pending.pdf' }),
            el('span', { text: 'Scan still running · contents not readable by anyone' })
          ]),
          chip('quarantined', 'amber')
        ]),
        el('div', { class: 'cf-doc' }, [
          el('div', { class: 'cf-doc-icon', 'data-state': 'quarantined', text: 'PDF' }),
          el('div', { class: 'cf-doc-body' }, [
            el('strong', { text: 'scanner-unavailable.pdf' }),
            el('span', { text: 'Scanner unreachable · deliberately left locked rather than released' })
          ]),
          chip('locked', 'rose')
        ])
      ]),
      el('div', { class: 'cf-body' }, [
        notice('blue', 'Key separation', 'Each document has its own data key, wrapped by a key that is managed independently of the document store. Access to a document is granted per role, not by possession of a file.')
      ])
    ];
  }

  function screenMatrix() {
    var probe = ['schedule:write', 'clinical:read', 'clinical:write', 'clinical:sign', 'audit:read'];
    var roles = Object.keys(ROLE_PERMISSIONS);

    var head = el('tr', {}, [el('th', { text: 'Permission' })].concat(roles.map(function (r) {
      return el('th', { text: r.replace('_', ' ').toLowerCase() });
    })));

    var body = probe.map(function (permission) {
      return el('tr', {}, [el('th', { text: permission })].concat(roles.map(function (r) {
        var has = ROLE_PERMISSIONS[r].indexOf(permission) !== -1;
        return el('td', { class: has ? 'cf-yes' : 'cf-no', text: has ? '✓' : '—' });
      })));
    });

    return [
      el('div', { class: 'cf-screen-head' }, [
        el('div', {}, [
          el('div', { class: 'cf-eyebrow', text: 'Governance' }),
          el('h3', { text: 'Separation of duties, in full.' }),
          el('p', { text: 'This is the real matrix from the platform. A nurse cannot sign a record, reception cannot reach clinical data, and an auditor has no clinical write at all.' })
        ]),
        chip(ROLES.length + ' roles', 'violet')
      ]),
      el('div', { class: 'cf-matrix-wrap' }, [
        el('table', { class: 'cf-matrix' }, [
          el('thead', {}, [head]),
          el('tbody', {}, body)
        ])
      ]),
      el('div', { class: 'cf-body' }, [
        notice('mint', 'Read this by switching role', 'Use the role selector above. The navigation, the buttons and the signing affordance all change, because the interface is built from the same permissions the API enforces.'),
        el('p', { class: 'cf-matrix-note', text: 'Release approvals follow a role-derived quorum rather than a single administrator permission, so no one account can sign off the system it administers.' })
      ])
    ];
  }

  function refusal(screen) {
    var r = roleDef();
    return [
      el('div', { class: 'cf-screen-head' }, [
        el('div', {}, [
          el('div', { class: 'cf-eyebrow', text: 'Access refused' }),
          el('h3', { text: 'Not available to this role.' }),
          el('p', { text: 'You are viewing CareFlow as ' + r.label + ' (' + r.who + '). This screen requires ' + screen.needs + ', which that role does not hold.' })
        ]),
        chip('denied', 'rose')
      ]),
      notice('rose', 'Refused by the permission model', 'This is the real behaviour, not a demo shortcut. Switching to Doctor, Practice manager or Administrator re-enables the screen. Reception, Nurse and Auditor cannot reach it by any route.'),
      el('div', { class: 'cf-record' }, [
        el('div', { class: 'cf-record-bar' }, [el('strong', { text: 'Required permission' }), chip(screen.needs, 'rose')]),
        el('div', { class: 'cf-fields' }, [
          el('div', { class: 'cf-field' }, [el('span', { text: 'Your role' }), el('strong', { text: r.label })]),
          el('div', { class: 'cf-field' }, [el('span', { text: 'What your role can do' }), el('strong', { text: r.note })]),
          el('div', { class: 'cf-field' }, [el('span', { text: 'Held permissions' }), el('strong', { text: ROLE_PERMISSIONS[role()].length + ' of 12' })]),
          el('div', { class: 'cf-field' }, [el('span', { text: 'Decision' }), el('strong', { text: 'Denied, and logged' })])
        ])
      ])
    ];
  }

  /* ------------------------------------------------------------- rendering */

  var RENDERERS = {
    today: screenToday,
    booking: screenBooking,
    checkin: screenCheckin,
    clinical: screenClinical,
    documents: screenDocuments,
    matrix: screenMatrix
  };

  var NARRATION = {
    today: ['A single day view.', 'Appointments, who is physically waiting, and what is next, without opening a clinical record.'],
    booking: ['Booking protects the diary.', 'Conflicts are rejected in the transaction. An override needs a specific permission and a written reason, and is kept permanently.'],
    checkin: ['The front desk stays out of clinical data.', 'Reception can move a person into the practice. There is no clinical tab to reach for, and the API refuses the route as well.'],
    clinical: ['Signing is a separate act from writing.', 'A nurse can draft but not sign. Signing needs clinical:sign and a verified second factor, and it is what makes a draft an active record.'],
    documents: ['Unscanned means unreadable.', 'Documents are quarantined and malware-scanned before anyone sees them. A scanner failure leaves them locked rather than admitting them.'],
    matrix: ['The permission matrix is the product.', 'Six roles, deliberately separated. Switch role in the selector: the interface changes because it is built from the same matrix the API enforces.']
  };

  function renderNav() {
    var groups = [];
    var currentGroup = null;
    SCREENS.forEach(function (screen) {
      if (screen.group !== currentGroup) {
        currentGroup = screen.group;
        groups.push(el('div', { class: 'cf-nav-group', text: screen.group }));
      }
      var isLocked = !allowed(screen.needs);
      var button = el('button', {
        class: 'cf-nav-item',
        type: 'button',
        'aria-current': state.screen === screen.id ? 'true' : 'false',
        'data-locked': isLocked ? 'true' : 'false',
        'data-screen': screen.id,
        title: isLocked ? 'Requires ' + screen.needs : screen.label,
        onclick: function () { go(screen.id); }
      }, [el('span', { class: 'cf-dot' }), el('span', { text: screen.label })]);
      groups.push(button);
    });

    dom.nav.innerHTML = '';
    groups.forEach(function (node) { dom.nav.appendChild(node); });
  }

  function renderCanvas() {
    var screen = null;
    for (var i = 0; i < SCREENS.length; i++) if (SCREENS[i].id === state.screen) screen = SCREENS[i];
    if (!screen) { state.screen = 'today'; screen = SCREENS[0]; }

    var nodes = allowed(screen.needs)
      ? (RENDERERS[screen.id] || screenToday)()
      : refusal(screen);

    dom.canvas.innerHTML = '';
    nodes.forEach(function (node) { dom.canvas.appendChild(node); });

    dom.url.textContent = 'careflow.demo.local/' + screen.id + (allowed(screen.needs) ? '' : '?denied=' + screen.needs);
    dom.role.textContent = roleDef().label;
    dom.narration.innerHTML = '';
    var narration = NARRATION[screen.id] || [screen.label, ''];
    dom.narration.appendChild(el('div', { class: 'cf-eyebrow', text: narration[0] }));
    dom.narration.appendChild(el('p', { text: narration[1] }));
  }

  function renderRail() {
    dom.rail.innerHTML = '';
    SCREENS.forEach(function (screen, index) {
      var isLocked = !allowed(screen.needs);
      var button = el('button', {
        class: 'cf-step',
        type: 'button',
        'aria-current': state.screen === screen.id ? 'true' : 'false',
        disabled: null,
        onclick: function () { go(screen.id); }
      }, [el('span', { class: 'n', text: String(index + 1) }), el('span', { text: screen.label })]);
      if (isLocked) button.setAttribute('data-locked', 'true');
      dom.rail.appendChild(button);
    });
  }

  function render() {
    renderNav();
    renderCanvas();
    renderRail();
  }

  function announce(message) {
    if (dom.live) dom.live.textContent = message;
  }

  function go(screenId) {
    state.screen = screenId;
    render();
    announce('Now viewing ' + screenId + ' as ' + roleDef().label + '.');
  }

  /* --------------------------------------------------------- role selector */

  ROLES.forEach(function (definition) {
    var button = el('button', {
      class: 'cf-btn cf-btn-ghost',
      type: 'button',
      'data-role': definition.code,
      style: 'font-size:0.72rem;padding:6px 12px',
      text: definition.label,
      onclick: function () {
        state.role = definition.code;
        state.recordSigned = false;
        render();
        Array.prototype.forEach.call(dom.switcher.querySelectorAll('[data-role]'), function (node) {
          var active = node.getAttribute('data-role') === definition.code;
          node.style.background = active ? 'var(--cf-mint)' : 'transparent';
          node.style.color = active ? '#06131f' : 'var(--cf-mint)';
          node.setAttribute('aria-pressed', active ? 'true' : 'false');
        });
        announce('Now viewing as ' + definition.label + '. ' + definition.note + '.');
      }
    });
    dom.switcher.appendChild(button);
  });

  // Paint the initially-selected role as active.
  var initial = dom.switcher.querySelector('[data-role="DOCTOR"]');
  if (initial) {
    initial.style.background = 'var(--cf-mint)';
    initial.style.color = '#06131f';
    initial.setAttribute('aria-pressed', 'true');
  }

  render();
})();