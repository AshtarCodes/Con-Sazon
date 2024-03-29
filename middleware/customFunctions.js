/* eslint-disable no-restricted-syntax */
// Middleware for parsing request body to group by ingredient and instruction fields - not in use anymore due to updating model
function groupByProperty(body, substr) {
  const arr = Object.entries(body)
    .filter(([key]) => key.includes(substr))
    .reduce((accumulator, [key, value]) => {
      const [, i, keyName] = key.split("-");
      if (!accumulator[i - 1]) {
        accumulator[i - 1] = {};
      }
      accumulator[i - 1][keyName] = value;
      return accumulator;
    }, []);
  return arr;
}

// Per MDN, this replaces most if not all URL delimiters including [ !, ', (, ), *]
function fixedEncodeURIComponent(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
    return `%${c.charCodeAt(0).toString(16)}`;
  });
}

function formatMessages(messages) {
  if (messages && typeof messages === "string") {
    return [messages];
  } else if (messages.length && Array.isArray(messages)) {
    return messages.map((obj) => obj.msg);
  } else if (
    messages &&
    typeof messages === "object" &&
    !Array.isArray(messages)
  )
    return [messages.msg];
  return [];
}

module.exports = {
  groupByProperty,
  fixedEncodeURIComponent,
  formatMessages,
};
