(function () {
  // ===== Stato audio dal main =====
  let audioEnabled = true;
  window.addEventListener('sr:audio', (e) => {
    audioEnabled = !!(e.detail && e.detail.enabled);
    console.log('[suoni] audioEnabled =', audioEnabled);
  });

  // ===== AudioContext =====
  let AC = null;

  // Sblocca SOLTANTO su gesto (migliore per iOS)
  function unlockAudioContext() {
    if (!AC) {
      AC = new (window.AudioContext || window.webkitAudioContext)();
      console.log('[suoni] creato AudioContext');
    }
    AC.resume().then(() => {
      console.log('[suoni] AC.state dopo resume:', AC.state);
    }).catch(err => console.warn('[suoni] resume error:', err));
  }

  // Ricevi il “gesto” dal main
  window.addEventListener('sr:unlock', () => {
    console.log('[suoni] sr:unlock ricevuto');
    unlockAudioContext();
  });

  // Beep sintetico
  function beep(type = 'pick') {
    if (!audioEnabled) { console.log('[suoni] mute: skip beep'); return; }
    if (!AC) { console.warn('[suoni] AC nullo: niente beep'); return; }
    if (AC.state !== 'running') {
      console.warn('[suoni] AC non running (', AC.state, '): provo resume() al volo');
      AC.resume().catch(()=>{});
      if (AC.state !== 'running') return;
    }

    const now = AC.currentTime;
    const o = AC.createOscillator();
    const g = AC.createGain();
    o.connect(g); g.connect(AC.destination);

    // envelope un po' più "forte"
    const A = 0.005, D = 0.1, R = 0.12;
    g.gain.setValueAtTime(0.00001, now);
    g.gain.linearRampToValueAtTime(0.8, now + A);
    g.gain.exponentialRampToValueAtTime(0.22, now + A + D);
    g.gain.exponentialRampToValueAtTime(0.00001, now + A + D + R);

    if (type === 'pick') {
      o.type = 'triangle';
      o.frequency.setValueAtTime(880, now); // A5
      o.frequency.exponentialRampToValueAtTime(1320, now + 0.10);
    } else if (type === 'hit') {
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(220, now);
      o.frequency.exponentialRampToValueAtTime(110, now + 0.10);
      g.gain.cancelScheduledValues(now);
      g.gain.setValueAtTime(0.00001, now);
      g.gain.linearRampToValueAtTime(0.9, now + 0.005);
      g.gain.exponentialRampToValueAtTime(0.00001, now + 0.2);
    } else if (type === 'goal') {
      o.type = 'sine';
      o.frequency.setValueAtTime(523.25, now);       // C5
      o.frequency.setValueAtTime(659.25, now + 0.08);// E5
      o.frequency.setValueAtTime(783.99, now + 0.16);// G5
      g.gain.cancelScheduledValues(now);
      g.gain.setValueAtTime(0.00001, now);
      g.gain.linearRampToValueAtTime(0.5, now + 0.02);
      g.gain.exponentialRampToValueAtTime(0.00001, now + 0.6);
    }

    o.start(now);
    o.stop(now + 0.35);
  }

  // Eventi dal gioco
  window.addEventListener('sr:pickup', () => { console.log('[suoni] pickup'); beep('pick'); });
  window.addEventListener('sr:hit',    () => { console.log('[suoni] hit');    beep('hit');  });
  window.addEventListener('sr:goal',   () => { console.log('[suoni] goal');   beep('goal'); });

  // Beep di test per debug (lo inviamo dal main dopo Start)
  window.addEventListener('sr:test',   () => { console.log('[suoni] test');   beep('pick'); });
})();
(function () {
  // ===== Stato audio dal main =====
  let audioEnabled = true;
  window.addEventListener('sr:audio', (e) => {
    audioEnabled = !!(e.detail && e.detail.enabled);
    console.log('[suoni] audioEnabled =', audioEnabled);
  });

  // ===== AudioContext =====
  let AC = null;

  // Sblocca SOLTANTO su gesto (migliore per iOS)
  function unlockAudioContext() {
    if (!AC) {
      AC = new (window.AudioContext || window.webkitAudioContext)();
      console.log('[suoni] creato AudioContext');
    }
    AC.resume().then(() => {
      console.log('[suoni] AC.state dopo resume:', AC.state);
    }).catch(err => console.warn('[suoni] resume error:', err));
  }

  // Ricevi il “gesto” dal main
  window.addEventListener('sr:unlock', () => {
    console.log('[suoni] sr:unlock ricevuto');
    unlockAudioContext();
  });

  // Beep sintetico
  function beep(type = 'pick') {
    if (!audioEnabled) { console.log('[suoni] mute: skip beep'); return; }
    if (!AC) { console.warn('[suoni] AC nullo: niente beep'); return; }
    if (AC.state !== 'running') {
      console.warn('[suoni] AC non running (', AC.state, '): provo resume() al volo');
      AC.resume().catch(()=>{});
      if (AC.state !== 'running') return;
    }

    const now = AC.currentTime;
    const o = AC.createOscillator();
    const g = AC.createGain();
    o.connect(g); g.connect(AC.destination);

    // envelope un po' più "forte"
    const A = 0.005, D = 0.1, R = 0.12;
    g.gain.setValueAtTime(0.00001, now);
    g.gain.linearRampToValueAtTime(0.8, now + A);
    g.gain.exponentialRampToValueAtTime(0.22, now + A + D);
    g.gain.exponentialRampToValueAtTime(0.00001, now + A + D + R);

    if (type === 'pick') {
      o.type = 'triangle';
      o.frequency.setValueAtTime(880, now); // A5
      o.frequency.exponentialRampToValueAtTime(1320, now + 0.10);
    } else if (type === 'hit') {
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(220, now);
      o.frequency.exponentialRampToValueAtTime(110, now + 0.10);
      g.gain.cancelScheduledValues(now);
      g.gain.setValueAtTime(0.00001, now);
      g.gain.linearRampToValueAtTime(0.9, now + 0.005);
      g.gain.exponentialRampToValueAtTime(0.00001, now + 0.2);
    } else if (type === 'goal') {
      o.type = 'sine';
      o.frequency.setValueAtTime(523.25, now);       // C5
      o.frequency.setValueAtTime(659.25, now + 0.08);// E5
      o.frequency.setValueAtTime(783.99, now + 0.16);// G5
      g.gain.cancelScheduledValues(now);
      g.gain.setValueAtTime(0.00001, now);
      g.gain.linearRampToValueAtTime(0.5, now + 0.02);
      g.gain.exponentialRampToValueAtTime(0.00001, now + 0.6);
    }

    o.start(now);
    o.stop(now + 0.35);
  }

  // Eventi dal gioco
  window.addEventListener('sr:pickup', () => { console.log('[suoni] pickup'); beep('pick'); });
  window.addEventListener('sr:hit',    () => { console.log('[suoni] hit');    beep('hit');  });
  window.addEventListener('sr:goal',   () => { console.log('[suoni] goal');   beep('goal'); });

  // Beep di test per debug (lo inviamo dal main dopo Start)
  window.addEventListener('sr:test',   () => { console.log('[suoni] test');   beep('pick'); });
})();
