// @flow


import libXml from 'libxmljs';

const last = (xs) => xs.slice(-1).pop();

export default (xml:string):Object => {
  if (xml.length === 0)
    return new Error('No content provided');

  let error;
  const parser = new libXml.SaxParser();
  const json = {};
  const ptrStack = [json];

  parser.on('error', e => {
    error = new Error(e.trim());
  });

  parser.on('startElementNS', elem => {
    if (error)
      return;

    const json = {};
    const curr = last(ptrStack);

    ptrStack.push(json);
    curr[elem] = curr[elem] ? [].concat.call([], curr[elem], json) : json;
  });

  parser.on('endElementNS', () => {
    if (error)
      return;

    ptrStack.pop(json);
  });

  parser.on('characters', chars => {
    if (error)
      return;

    last(ptrStack).text = chars.trim();
  });

  parser.parseString(xml);

  return error || json;
};
