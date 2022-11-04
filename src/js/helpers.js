import { TIMEOUT_SECS } from "./config";

// Converting to camelCase notation
export const convertCamelCase = function (obj) {
  const convertedObj = Object.entries(obj).map(([key, value]) => {
    const lowerCaseKey = key.toLowerCase();
    const newKey = lowerCaseKey
      .split("_")
      .map((key, i) => {
        if (i == 0) return key;
        return `${key[0].toUpperCase()}${key.slice(1)}`;
      })
      .join("");
    return [newKey, value];
  });

  return Object.fromEntries(convertedObj);
};

// Error handling for long time request
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// Return JSON from API
export const getJSON = async function (url) {
  try {
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SECS)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} ${res.status}`);
    return data;
  } catch (err) {
    throw err;
  }
};

// Dynamic updating text and attributes
export const update = function (previousMarkup, newMarkup) {
  // Getting the Node list in the previous and new markup
  const curElements = Array.from(previousMarkup);

  const newDOM = document.createRange().createContextualFragment(newMarkup);
  const newElements = Array.from(newDOM.querySelectorAll("*"));

  newElements.forEach((newEl, i) => {
    const curEl = curElements[i];

    // Update changed text
    if (!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() != "")
      curEl.textContent = newEl.textContent;

    // Update changed attributes
    if (!newEl.isEqualNode(curEl))
      Array.from(newEl.attributes).forEach((attr) =>
        curEl.setAttribute(attr.name, attr.value)
      );
  });
};
