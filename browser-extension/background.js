// CSE Background Service Worker

chrome.commands.onCommand.addListener(async (command) => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return;

  if (command === 'inject-master') {
    const content = await fetch(chrome.runtime.getURL('skills/master.md'))
      .then(r => r.text())
      .catch(() => '# CSE Master Skill\n∀ concept c: ∃ formal(c) → output formal(c)\nPATH: D5·A1·D6');
    chrome.tabs.sendMessage(tab.id, { action: 'inject', content });
  }

  if (command === 'inject-tc') {
    chrome.tabs.sendMessage(tab.id, {
      action: 'inject',
      content: '# TOKEN COMPRESSION ACTIVE\n∀ concept c: ∃ formal(c) → output formal(c)\nTarget: 2.3× compression. Never compress thinking. Always compress output.\nPATH: D5·A1·D6'
    });
  }
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ cse_path: ['D5', 'A1'], cse_version: '1.0.0' });
});
