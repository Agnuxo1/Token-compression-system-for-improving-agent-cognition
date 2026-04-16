'use strict';
// CSE Content Script — listens for keyboard shortcuts and auto-inject triggers

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.action === 'inject') {
    const textarea = findActiveTextarea();
    if (textarea) {
      insertText(textarea, msg.content);
      sendResponse({ ok: true });
    } else {
      sendResponse({ ok: false, error: 'No active textarea found' });
    }
  }
});

function findActiveTextarea() {
  const selectors = [
    'div[contenteditable="true"]',
    'textarea',
    'div[role="textbox"]',
    'div.ProseMirror',
    '#prompt-textarea',
    '[data-testid="tweetTextarea_0"]',
  ];
  for (const sel of selectors) {
    const el = document.querySelector(sel);
    if (el) return el;
  }
  return document.activeElement?.isContentEditable ? document.activeElement : null;
}

function insertText(el, text) {
  el.focus();
  if (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') {
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const before = el.value.substring(0, start);
    const after = el.value.substring(end);
    el.value = before + text + '\n' + after;
    el.selectionStart = el.selectionEnd = start + text.length + 1;
    el.dispatchEvent(new Event('input', { bubbles: true }));
  } else {
    document.execCommand('insertText', false, text + '\n');
  }
}
