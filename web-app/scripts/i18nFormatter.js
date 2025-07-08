export function format(msgs) {
  const result = {};
  const values = {};
  Object.entries(msgs).forEach(([id, msg]) => {
    // Error if 'defaultMessage' was not set
    if (!msg.defaultMessage) {
      throw new Error(
        `'defaultMessage' is not set or empty. Please fix!\n\n id: "${id}"\n`
      );
    }

    result[id] = msg.defaultMessage;

    if (!values[msg.defaultMessage]) {
      values[msg.defaultMessage] = [];
    }
    values[msg.defaultMessage].push(id);
  });

  // Error if there are multiple 'ids' for the  same 'defaultMessage'
  Object.entries(values).forEach(([defaultMessage, ids]) => {
    if (ids.length > 1) {
      throw new Error(
        `Multiple 'ids' for the same 'defaultMessage'. Please fix!\n\n[${ids}]: "${defaultMessage}"\n`
      );
    }
  });
  return result;
}
