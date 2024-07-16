export function createGuid() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}

export async function createHash(name) {
  const msgUint8 = new TextEncoder().encode(name);
  const hashBuffer = await window.crypto.subtle.digest("SHA-1", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}

export function generateShortId() {
  var firstPart = (Math.random() * 46656) | 0;
  var secondPart = (Math.random() * 46656) | 0;
  firstPart = ("000" + firstPart.toString(36)).slice(-3);
  secondPart = ("000" + secondPart.toString(36)).slice(-3);
  return firstPart + secondPart;
}

const generatedIds = new Set();

export function getUniqueShortId(spentIds = null) {
  if (!spentIds) {
    spentIds = generatedIds;
  }
  let id;
  do {
    id = generateShortId();
  } while (spentIds.has(id));
  generatedIds.add(id);
  return id;
}
