const { spawn } = require('child_process');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const widths = [320, 360, 375, 390, 430, 600, 768, 1024, 1280];

async function auditSingleWidth(width) {
  const port = 9700 + Math.floor(Math.random() * 200);
  const tempProf = `C:\\Users\\Welcome\\AppData\\Local\\Temp\\chrome_single_audit_${width}_${port}`;
  
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=' + port,
    '--user-data-dir=' + tempProf,
    'http://localhost:4173/?intro=0&reveal=1'
  ]);

  // Give Chrome enough time to start
  await new Promise(r => setTimeout(r, 2200));

  let targets = [];
  for (let attempt = 0; attempt < 8; attempt++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/list`);
      targets = await res.json();
      if (targets && targets.length > 0) break;
    } catch (e) {
      await new Promise(r => setTimeout(r, 400));
    }
  }

  const page = targets.find(t => t.type === 'page');
  if (!page) {
    chrome.kill();
    throw new Error('No page target available');
  }

  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let id = 1;
  const send = (m, p = {}) => new Promise((resolve, reject) => {
    const cur = id++;
    const handler = (e) => {
      const d = JSON.parse(e.data);
      if (d.id === cur) {
        ws.removeEventListener('message', handler);
        if (d.error) reject(d.error);
        else resolve(d.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id: cur, method: m, params: p }));
  });

  await send('Emulation.setDeviceMetricsOverride', {
    width: width,
    height: 844,
    deviceScaleFactor: 2,
    mobile: width < 1024,
    scale: 1,
    screenWidth: width,
    screenHeight: 844
  });

  await new Promise(r => setTimeout(r, 500));

  const evalRes = await send('Runtime.evaluate', {
    expression: `
      (() => {
        // Enforce visible overflow-x on both html and body to detect true geometry leakage
        document.documentElement.style.overflowX = 'visible';
        document.body.style.overflowX = 'visible';

        const clientW = document.documentElement.clientWidth;
        const docScrollW = document.documentElement.scrollWidth;
        const bodyScrollW = document.body.scrollWidth;
        const overflows = [];

        document.querySelectorAll('*').forEach(el => {
          if (['SCRIPT', 'STYLE', 'HEAD', 'META', 'LINK', 'TITLE'].includes(el.tagName)) return;
          const style = window.getComputedStyle(el);
          if (style.display === 'none' || style.visibility === 'hidden') return;

          const rect = el.getBoundingClientRect();
          if (rect.right > clientW + 1.0) {
            overflows.push({
              tag: el.tagName.toLowerCase(),
              id: el.id || '',
              className: (el.className && typeof el.className === 'string') ? el.className.trim() : '',
              width: Math.round(rect.width),
              right: Math.round(rect.right),
              excess: Math.round(rect.right - clientW),
              text: (el.textContent || '').trim().replace(/\\s+/g, ' ').slice(0, 40)
            });
          }
        });

        return JSON.stringify({
          clientW,
          docScrollW,
          bodyScrollW,
          hasOverflow: docScrollW > clientW || bodyScrollW > clientW,
          overflowCount: overflows.length,
          overflows: overflows.slice(0, 10)
        });
      })()
    `,
    returnByValue: true
  });

  ws.close();
  chrome.kill();
  await new Promise(r => setTimeout(r, 300));
  return JSON.parse(evalRes.result.value);
}

(async () => {
  console.log('================================================================');
  console.log('   CORESHADOW DUAL-PRESENTATION VIEWPORT OVERFLOW AUDIT');
  console.log('================================================================\n');

  let allClean = true;

  for (const w of widths) {
    try {
      const res = await auditSingleWidth(w);
      console.log(`[Viewport: ${w}px | clientW: ${res.clientW}px] docScrollW: ${res.docScrollW}px, bodyScrollW: ${res.bodyScrollW}px`);
      if (res.hasOverflow || res.overflowCount > 0) {
        allClean = false;
        console.log(`  ⚠️ OVERFLOW DETECTED: ${res.overflowCount} elements exceed ${res.clientW}px by up to ${res.docScrollW - res.clientW}px`);
        res.overflows.forEach(o => {
          console.log(`    - <${o.tag} id="${o.id}" class="${o.className}"> width: ${o.width}px, right: ${o.right}px (+${o.excess}px) "${o.text}"`);
        });
      } else {
        console.log(`  ✓ PERFECT: Zero horizontal overflow (scrollWidth === clientWidth)`);
      }
      console.log('----------------------------------------------------------------');
    } catch (e) {
      console.error(`Error on ${w}px:`, e.message);
    }
  }

  if (allClean) {
    console.log('\n🎉 ALL TARGET VIEWPORTS PASSED WITH ZERO HORIZONTAL OVERFLOW!');
  } else {
    console.log('\n⚠️ Some viewports still exhibit overflow.');
  }
})();
