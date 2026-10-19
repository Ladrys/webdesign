'use strict';
(() => {
  const pendingKey = 'pulse:recovery-once';
  let loadedAuthId = null;
  try {
    const auth = JSON.parse(localStorage.getItem('pulse:auth') || 'null');
    loadedAuthId = Number.isFinite(auth?.expires) && auth.expires > Date.now() ? auth.id : null;
  } catch { /* No active account. */ }
  const normalizeCode = value => String(value || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  const randomHex = bytes => Array.from(crypto.getRandomValues(new Uint8Array(bytes)), byte => byte.toString(16).padStart(2, '0')).join('');
  // The browser keeps only a salted verifier; the complete recovery code is shown once.
  async function recoveryCredential(passwordHash) {
    const code = 'PPF-' + randomHex(16).toUpperCase().match(/.{4}/g).join('-');
    const salt = randomHex(16);
    return { code, verifier: { salt, hash: await passwordHash('pulse:recovery:' + normalizeCode(code), salt), createdAt: new Date().toISOString() } };
  }
  function hasRecovery(user) {
    return user?.recovery && /^[a-f0-9]{32}$/.test(user.recovery.salt || '') && /^[a-f0-9]{64}$/.test(user.recovery.hash || '');
  }
  function clearLogin(id) {
    try {
      const auth = JSON.parse(localStorage.getItem('pulse:auth') || 'null');
      if (!id || auth?.id === id) localStorage.removeItem('pulse:auth');
      sessionStorage.removeItem('pulse:session');
    } catch { sessionStorage.removeItem('pulse:session'); }
  }
  function stashCode(code, email) {
    try { sessionStorage.setItem(pendingKey, JSON.stringify({ code, email })); } catch { /* A replacement code can still be created in account settings. */ }
  }
  function showCode(main, code, email, tr, esc) {
    main.querySelector('.account-recovery-notice')?.remove();
    const notice = document.createElement('section');
    notice.className = 'card account-recovery-notice';
    notice.setAttribute('aria-labelledby', 'recovery-once-title');
    notice.innerHTML = `<p class="eyebrow">${tr('Přístup k účtu','Account access')}</p><h2 id="recovery-once-title">${tr('Ulož si kód pro obnovení','Save your recovery code')}</h2><p>${tr('Kód spolu s e-mailem obnoví přístup, pokud zapomeneš heslo. Ulož ho na bezpečné místo mimo tento prohlížeč.','Use this code with your email if you forget your password. Keep it somewhere safe outside this browser.')}</p><p class="count" data-no-translate>${esc(email)}</p><code id="recovery-once-code" class="recovery-code" data-no-translate>${esc(code)}</code><div class="actions"><button type="button" id="recovery-copy" class="secondary small">${tr('Kopírovat kód','Copy code')}</button><button type="button" id="recovery-dismiss" class="small">${tr('Kód mám uložený','I have saved the code')}</button></div><p class="count recovery-copy-status" role="status"></p>`;
    main.prepend(notice);
    notice.querySelector('#recovery-copy').onclick = async () => {
      const status = notice.querySelector('.recovery-copy-status');
      try { await navigator.clipboard.writeText(code); status.textContent = tr('Kód byl zkopírován.','Code copied.'); }
      catch {
        const range = document.createRange(); range.selectNodeContents(notice.querySelector('.recovery-code'));
        const selection = getSelection(); selection.removeAllRanges(); selection.addRange(range);
        status.textContent = tr('Kód je označený. Zkopíruj ho pomocí Ctrl+C nebo nabídky prohlížeče.','The code is selected. Copy it using Ctrl+C or the browser menu.');
      }
    };
    notice.querySelector('#recovery-dismiss').onclick = () => notice.remove();
  }
  function pendingNotice(context) {
    try {
      const pending = JSON.parse(sessionStorage.getItem(pendingKey) || 'null');
      if (!pending || typeof pending.code !== 'string') return;
      sessionStorage.removeItem(pendingKey);
      showCode(context.main, pending.code, pending.email, context.tr, context.esc);
    } catch { /* A damaged transient notice must not affect the account. */ }
  }
  function render(context, view = {}) {
    const { main, $, esc, tr, locale, crumb, heading, link, storage, save, toast, shell, routeUrl, emailValid, phoneValid, passwordHash, keyId, orderHtml, getUser, setUser, login } = context;
    const user = getUser();
    const currentUser = () => storage.get('users').find(item => item.id === user?.id);
    const passwordValid = password => password.length >= 10 && password.length <= 128;
    const busy = async (button, error, operation) => {
      button.disabled = true; error.textContent = '';
      try { await operation(); } catch (failure) { error.textContent = failure.message || tr('Změnu se nepodařilo uložit.','Could not save the change.'); }
      finally { button.disabled = false; }
    };
    const updateStoredUser = (expected, updated) => {
      const users = storage.get('users'), latest = users.find(item => item.id === expected.id);
      if (!latest || latest.hash !== expected.hash || latest.salt !== expected.salt) throw new Error(tr('Účet se mezitím změnil. Přihlas se znovu.','The account changed in another tab. Sign in again.'));
      if (!save('users', users.map(item => item.id === updated.id ? updated : item))) throw new Error(tr('Údaje se nepodařilo uložit.','Could not save the account.'));
    };
    const verifyCurrent = async password => {
      const latest = currentUser();
      if (!latest || !password || await passwordHash(password, latest.salt) !== latest.hash) throw new Error(tr('Současné heslo není správné.','The current password is incorrect.'));
      return latest;
    };
    if (user) {
      const orders = storage.get('orders').filter(order => order.owner === user.id);
      const parts = user.name.trim().split(/\s+/), firstName = user.firstName || parts.shift() || '', lastName = user.lastName || parts.join(' ');
      const created = user.createdAt && Number.isFinite(Date.parse(user.createdAt)) ? new Date(user.createdAt).toLocaleString(locale, { dateStyle: 'long', timeStyle: 'short', timeZone: 'Europe/Prague' }) : '—';
      main.innerHTML = crumb(tr('Můj účet','My account')) + `<div class="account-heading">${heading(tr('Prague Pulse Fest / profil','Prague Pulse Fest / profile'),tr('Můj účet','My account'))}</div><section class="card profile-card"><div class="section-head"><h2>${tr('Informace o účtu','Account details')}</h2><button id="profile-edit" class="secondary small" type="button" aria-expanded="false" aria-controls="profile-form">${tr('Upravit údaje','Edit details')}</button></div><dl class="profile-details grid two"><div><dt>${tr('Jméno a příjmení','Full name')}</dt><dd class="account-name">${esc(user.name)}</dd></div><div><dt>E-mail</dt><dd data-no-translate>${esc(user.email)}</dd></div><div><dt>${tr('Telefon','Phone')}</dt><dd data-no-translate>${esc(user.phone || '—')}</dd></div><div><dt>${tr('Účet vytvořen','Account created')}</dt><dd id="account-created">${esc(created)}</dd></div></dl><form id="profile-form" class="form-stack" hidden><div class="profile-fields grid two"><div class="field"><label for="profile-first-name">${tr('Jméno','First name')}</label><input id="profile-first-name" required maxlength="80" autocomplete="given-name" value="${esc(firstName)}"></div><div class="field"><label for="profile-last-name">${tr('Příjmení','Last name')}</label><input id="profile-last-name" required maxlength="80" autocomplete="family-name" value="${esc(lastName)}"></div><div class="field"><label for="profile-email">E-mail</label><input id="profile-email" type="email" required maxlength="160" autocomplete="email" value="${esc(user.email)}"></div><div class="field"><label for="profile-phone">${tr('Telefon','Phone')}</label><input id="profile-phone" type="tel" required maxlength="30" autocomplete="tel" value="${esc(user.phone || '')}"></div></div><p id="profile-error" class="error" role="alert"></p><button id="profile-save" type="submit">${tr('Uložit údaje','Save details')}</button></form><div class="actions"><button id="logout" class="secondary">${tr('Odhlásit se','Sign out')}</button>${link('tickets.html',tr('Vybrat další vstupenky →','Choose more tickets →'),'button')}</div></section><section class="account-security" aria-labelledby="security-title"><div class="section-head"><h2 id="security-title">${tr('Zabezpečení účtu','Account security')}</h2></div><div class="account-security-grid"><article class="card"><h3>${tr('Heslo','Password')}</h3><p class="muted">${tr('Nové heslo potvrď současným heslem. Po změně se přihlásíš znovu.','Confirm the change with your current password. Sign in again after changing it.')}</p><button type="button" id="password-edit" class="secondary small" aria-controls="password-form" aria-expanded="false">${tr('Změnit heslo','Change password')}</button><form id="password-form" class="form-stack security-form" hidden><div class="field"><label for="password-current">${tr('Současné heslo','Current password')}</label><input id="password-current" type="password" required maxlength="128" autocomplete="current-password"></div><div class="field"><label for="password-new">${tr('Nové heslo','New password')}</label><input id="password-new" type="password" required minlength="10" maxlength="128" autocomplete="new-password" aria-describedby="new-password-help"><small class="muted" id="new-password-help">${tr('10–128 znaků.','10–128 characters.')}</small></div><div class="field"><label for="password-confirm">${tr('Potvrzení nového hesla','Confirm new password')}</label><input id="password-confirm" type="password" required minlength="10" maxlength="128" autocomplete="new-password"></div><p class="error" id="password-error" role="alert"></p><button id="password-save" type="submit">${tr('Uložit nové heslo','Save new password')}</button></form></article><article class="card"><h3>${tr('Obnovení přístupu','Account recovery')}</h3><p>${hasRecovery(user) ? tr('Kód pro obnovení je nastavený. Nový kód nahradí ten původní.','A recovery code is set. Creating a new code replaces the previous one.') : tr('Vytvoř si kód pro případ zapomenutého hesla. Uložený kód později obnoví přístup bez e-mailové zprávy.','Create a code in case you forget your password. Your saved code restores access without an email message.')}</p><button type="button" id="recovery-setup" class="secondary small" aria-controls="recovery-setup-form" aria-expanded="false">${hasRecovery(user) ? tr('Vytvořit nový kód','Create a new code') : tr('Vytvořit kód','Create a code')}</button><form id="recovery-setup-form" class="form-stack security-form" hidden><div class="field"><label for="recovery-current">${tr('Současné heslo','Current password')}</label><input id="recovery-current" type="password" required maxlength="128" autocomplete="current-password"></div><p class="error" id="recovery-setup-error" role="alert"></p><button id="recovery-generate" type="submit">${tr('Vygenerovat kód','Generate code')}</button></form></article></div></section><section><h2>${tr('Historie objednávek','Order history')} <span class="count">(${orders.length})</span></h2>${orders.length ? orders.slice().reverse().map(orderHtml).join('') : `<p class="empty">${tr('Zatím tu nejsou žádné objednávky.','No orders yet.')}</p>`}</section>`;
      const toggle = (buttonId, formId, focusId) => $(buttonId).onclick = () => {
        const open = $(formId).hidden; $(formId).hidden = !open; $(buttonId).setAttribute('aria-expanded', String(open)); if (open) $(focusId).focus();
      };
      toggle('#profile-edit', '#profile-form', '#profile-first-name');
      toggle('#password-edit', '#password-form', '#password-current');
      toggle('#recovery-setup', '#recovery-setup-form', '#recovery-current');
      $('#profile-form').onsubmit = event => {
        event.preventDefault();
        const first = $('#profile-first-name').value.trim(), last = $('#profile-last-name').value.trim(), email = $('#profile-email').value.trim().toLowerCase(), phone = $('#profile-phone').value.trim(), users = storage.get('users');
        if (!first || !last || !emailValid(email) || !phoneValid(phone)) { $('#profile-error').textContent = tr('Zkontroluj jméno, příjmení, e-mail a telefon.','Check your first name, last name, email and phone.'); return; }
        if (users.some(item => item.id !== user.id && item.email === email)) { $('#profile-error').textContent = tr('Tento e-mail už používá jiný účet.','This email is already used by another account.'); return; }
        const latest = currentUser(); if (!latest) { clearLogin(user.id); setUser(null); shell(); render(context); return; }
        const updated = { ...latest, firstName: first, lastName: last, name: first + ' ' + last, email, phone };
        if (save('users', users.map(item => item.id === user.id ? updated : item))) { setUser(updated); shell(); render(context); toast(tr('Údaje účtu byly uloženy.','Account details saved.')); }
      };
      $('#password-form').onsubmit = event => {
        event.preventDefault();
        busy($('#password-save'), $('#password-error'), async () => {
          const latest = await verifyCurrent($('#password-current').value), password = $('#password-new').value;
          if (!passwordValid(password)) throw new Error(tr('Heslo musí mít 10 až 128 znaků.','The password must contain 10 to 128 characters.'));
          if (password !== $('#password-confirm').value) throw new Error(tr('Zadaná hesla se neshodují.','The passwords do not match.'));
          const salt = randomHex(16), updated = { ...latest, salt, hash: await passwordHash(password, salt), passwordChangedAt: new Date().toISOString() };
          updateStoredUser(latest, updated); clearLogin(user.id); setUser(null); shell(); render(context, { notice: tr('Heslo bylo změněno. Přihlas se novým heslem.','Password changed. Sign in with your new password.'), email: latest.email });
        });
      };
      $('#recovery-setup-form').onsubmit = event => {
        event.preventDefault();
        busy($('#recovery-generate'), $('#recovery-setup-error'), async () => {
          const latest = await verifyCurrent($('#recovery-current').value), recovery = await recoveryCredential(passwordHash), updated = { ...latest, recovery: recovery.verifier };
          updateStoredUser(latest, updated); setUser(updated); render(context); showCode(main, recovery.code, updated.email, tr, esc);
        });
      };
      $('#logout').onclick = () => { clearLogin(user.id); setUser(null); location.href = routeUrl('account.html'); };
      pendingNotice(context);
      return;
    }
    let mode = 'login';
    main.innerHTML = crumb(tr('Můj účet','My account')) + `<div class="account-layout"><div class="account-heading">${heading(tr('Účet / Prague Pulse Fest','Account / Prague Pulse Fest'),tr('Přihlášení','Sign in'))}</div>${view.notice ? `<p class="notice" role="status">${esc(view.notice)}</p>` : ''}<section class="card"><div class="tabs" role="group" aria-label="${tr('Způsob přístupu','Account access')}"><button type="button" id="login-tab" aria-pressed="true">${tr('Přihlášení','Sign in')}</button><button type="button" id="register-tab" class="secondary" aria-pressed="false">${tr('Registrace','Register')}</button></div><p id="recovery-explanation" class="notice" hidden>${tr('Zadej e-mail a uložený kód pro obnovení. Kód musíš mít z registrace nebo z nastavení účtu; zprávu na e-mail neposíláme.','Enter your email and saved recovery code. Use the code from registration or account settings; no email is sent.')}</p><form id="auth-form" class="form-stack"><div id="name-field" class="register-only grid two" hidden><div class="field"><label for="auth-name">${tr('Jméno','First name')}</label><input id="auth-name" autocomplete="given-name" maxlength="80" disabled></div><div class="field"><label for="auth-surname">${tr('Příjmení','Last name')}</label><input id="auth-surname" autocomplete="family-name" maxlength="80" disabled></div><div class="field"><label for="auth-phone">${tr('Telefon','Phone')}</label><input id="auth-phone" type="tel" autocomplete="tel" maxlength="30" placeholder="+420 777 123 456" disabled></div></div><div class="field"><label for="auth-email">E-mail</label><input id="auth-email" type="email" autocomplete="email" required maxlength="160" placeholder="jmeno@example.cz" value="${esc(view.email || '')}"></div><div id="recovery-code-field" class="field" hidden><label for="auth-recovery-code">${tr('Kód pro obnovení','Recovery code')}</label><input id="auth-recovery-code" autocomplete="off" autocapitalize="characters" spellcheck="false" maxlength="64" placeholder="PPF-XXXX-XXXX-…" disabled></div><div class="field"><label for="auth-password" id="auth-password-label">${tr('Heslo','Password')}</label><input id="auth-password" type="password" required minlength="10" maxlength="128" autocomplete="current-password" aria-describedby="password-help"><small class="muted" id="password-help">${tr('10–128 znaků.','10–128 characters.')}</small></div><div id="confirm-field" class="field" hidden><label for="auth-confirm">${tr('Potvrzení hesla','Confirm password')}</label><input id="auth-confirm" type="password" minlength="10" maxlength="128" autocomplete="new-password" disabled></div><p class="error" id="auth-error" role="alert"></p><button id="auth-submit" class="full">${tr('Přihlásit se →','Sign in →')}</button></form><button type="button" id="forgot-password" class="text-button account-forgot">${tr('Zapomenuté heslo','Forgot password')}</button><p id="recovery-no-code" class="count" hidden>${tr('Bez uloženého kódu nelze heslo obnovit. Nový účet nepřevezme objednávky původního účtu.','The password cannot be recovered without a saved code. A new account will not inherit the original account’s orders.')}</p></section></div>`;
    function setMode(next) {
      mode = next;
      const registering = mode === 'register', recovering = mode === 'recover', confirming = registering || recovering;
      $('#name-field').hidden = !registering;
      ['auth-name','auth-surname','auth-phone'].forEach(id => { document.getElementById(id).required = registering; document.getElementById(id).disabled = !registering; });
      $('#confirm-field').hidden = !confirming; $('#auth-confirm').disabled = !confirming; $('#auth-confirm').required = confirming;
      $('#recovery-code-field').hidden = !recovering; $('#auth-recovery-code').disabled = !recovering; $('#auth-recovery-code').required = recovering;
      $('#recovery-explanation').hidden = !recovering; $('#recovery-no-code').hidden = !recovering;
      $('#auth-password').autocomplete = mode === 'login' ? 'current-password' : 'new-password';
      $('#auth-password-label').textContent = recovering ? tr('Nové heslo','New password') : tr('Heslo','Password');
      $('#login-tab').setAttribute('aria-pressed', String(mode === 'login')); $('#register-tab').setAttribute('aria-pressed', String(registering));
      $('#auth-submit').textContent = registering ? tr('Vytvořit účet →','Create account →') : recovering ? tr('Obnovit heslo →','Reset password →') : tr('Přihlásit se →','Sign in →');
      main.querySelector('h1').textContent = registering ? tr('Registrace','Register') : recovering ? tr('Obnovení hesla','Reset password') : tr('Přihlášení','Sign in');
      $('#forgot-password').hidden = recovering; $('#auth-error').textContent = ''; $('#auth-password').value = ''; $('#auth-confirm').value = '';
    }
    $('#login-tab').onclick = () => setMode('login'); $('#register-tab').onclick = () => setMode('register'); $('#forgot-password').onclick = () => { setMode('recover'); $('#auth-email').focus(); };
    $('#auth-form').onsubmit = event => {
      event.preventDefault();
      busy($('#auth-submit'), $('#auth-error'), async () => {
        const email = $('#auth-email').value.trim().toLowerCase(), password = $('#auth-password').value;
        if (!emailValid(email)) throw new Error(tr('Zadej platný e-mail.','Enter a valid email.'));
        if (!passwordValid(password)) throw new Error(tr('Heslo musí mít 10 až 128 znaků.','The password must contain 10 to 128 characters.'));
        const users = storage.get('users'); let found = users.find(item => item.email === email), oneTimeCode;
        if (mode === 'recover') {
          if (password !== $('#auth-confirm').value) throw new Error(tr('Zadaná hesla se neshodují.','The passwords do not match.'));
          const supplied = normalizeCode($('#auth-recovery-code').value);
          const valid = /^PPF[A-F0-9]{32}$/.test(supplied) && hasRecovery(found) && await passwordHash('pulse:recovery:' + supplied, found.recovery.salt) === found.recovery.hash;
          if (!valid) throw new Error(tr('E-mail nebo kód pro obnovení není správný.','The email or recovery code is incorrect.'));
          const salt = randomHex(16), recovery = await recoveryCredential(passwordHash), updated = { ...found, salt, hash: await passwordHash(password, salt), recovery: recovery.verifier, passwordChangedAt: new Date().toISOString() };
          // The current verifier is checked again so an already-used code cannot win a later tab race.
          const latest = storage.get('users').find(item => item.id === found.id);
          if (!latest || latest.recovery?.hash !== found.recovery.hash) throw new Error(tr('Kód už není platný. Použij nejnovější uložený kód.','The code is no longer valid. Use your latest saved code.'));
          updateStoredUser(found, updated); clearLogin(found.id); setUser(null); shell(); render(context, { notice: tr('Heslo bylo obnoveno. Přihlas se novým heslem a ulož si nový kód.','Password reset. Sign in with your new password and save the new code.'), email }); showCode(main, recovery.code, email, tr, esc); return;
        }
        if (mode === 'register') {
          const first = $('#auth-name').value.trim(), last = $('#auth-surname').value.trim(), phone = $('#auth-phone').value.trim();
          if (!first || !last) throw new Error(tr('Vyplň jméno a příjmení.','Enter your first and last name.'));
          if (!phoneValid(phone)) throw new Error(tr('Zadej platné telefonní číslo s 9 až 15 číslicemi.','Enter a valid phone number containing 9 to 15 digits.'));
          if (password !== $('#auth-confirm').value) throw new Error(tr('Zadaná hesla se neshodují.','The passwords do not match.'));
          if (found) throw new Error(tr('Tento e-mail už má účet. Přihlas se.','This email already has an account. Sign in.'));
          const salt = randomHex(16), recovery = await recoveryCredential(passwordHash);
          found = { id: keyId(), name: first + ' ' + last, firstName: first, lastName: last, phone, email, createdAt: new Date().toISOString(), salt, hash: await passwordHash(password, salt), recovery: recovery.verifier };
          const latest = storage.get('users'); if (latest.some(item => item.email === email)) throw new Error(tr('Tento e-mail už má účet. Přihlas se.','This email already has an account. Sign in.'));
          if (!save('users', [...latest, found])) return;
          oneTimeCode = recovery.code;
        } else {
          if (!found || await passwordHash(password, found.salt) !== found.hash) throw new Error(tr('Nesprávný e-mail nebo heslo.','Incorrect email or password.'));
          const latest = storage.get('users').find(item => item.id === found.id);
          if (!latest || latest.hash !== found.hash) throw new Error(tr('Heslo bylo změněno. Přihlas se znovu.','The password changed. Sign in again.'));
          found = latest;
        }
        if (oneTimeCode) stashCode(oneTimeCode, email);
        login(found);
      });
    };
  }
  window.PulseAccount = { render };
  // A shared login change also refreshes the cart owner in every other open tab.
  window.addEventListener('storage', event => {
    if (event.key !== 'pulse:auth') return;
    try {
      const nextId = JSON.parse(event.newValue || 'null')?.id || null;
      if (nextId !== loadedAuthId) { sessionStorage.removeItem('pulse:session'); location.reload(); }
    } catch { /* A malformed external edit is rejected by the application on its next load. */ }
  });
  // Registration can return directly to the cart; keep the once-only code visible there too.
  document.addEventListener('DOMContentLoaded', () => {
    try { if (!sessionStorage.getItem(pendingKey)) return; } catch { return; }
    const main = document.querySelector('main'), en = window.PulseI18n?.lang === 'en';
    if (!main) return;
    pendingNotice({ main, tr: (cs, english) => en ? english : cs, esc: value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]) });
  });
})();
