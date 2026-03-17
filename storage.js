/**
 * storage.js - localStorage helpers
 * Keys: profileName, welcomeSeen, lastStep, weakUnderstanding
 */

const STORAGE_KEYS = {
  PROFILE_NAME: 'profileName',
  WELCOME_SEEN: 'welcomeSeen',
  LAST_STEP: 'lastStep',
  WEAK_UNDERSTANDING: 'weakUnderstanding',
  LANGUAGE: 'language'
};

function getItem(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function setItem(key, value) {
  try {
    localStorage.setItem(key, String(value));
    return true;
  } catch {
    return false;
  }
}

function isFirstVisit() {
  return getItem(STORAGE_KEYS.WELCOME_SEEN) === null;
}

function hasProfile() {
  const name = getItem(STORAGE_KEYS.PROFILE_NAME);
  return name !== null && name.trim() !== '';
}

// Expose for use in app.js (no modules)
window.STORAGE_KEYS = STORAGE_KEYS;
window.getItem = getItem;
window.setItem = setItem;
window.isFirstVisit = isFirstVisit;
window.hasProfile = hasProfile;
