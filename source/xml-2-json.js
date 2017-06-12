// @flow

import libXml from 'node-xml';

const last = xs => xs.slice(-1).pop();

export default (xml: string): Error | Object => {
  if (xml.length === 0) return new Error('No content provided');

  let error;
  const json = {};
  const ptrStack = [json];

  const parser = new libXml.SaxParser(cb => {
    cb.onError(e => {
      error = new Error(e.trim());
    });

    cb.onStartElementNS(elem => {
      if (error) return;

      const json = {};
      const curr = last(ptrStack);
      ptrStack.push(json);
      curr[elem] = curr[elem] ? [].concat.call([], curr[elem], json) : json;
    });

    cb.onEndElementNS(() => {
      if (error) return;

      ptrStack.pop();
    });

    cb.onCharacters(chars => {
      if (error) return;

      last(ptrStack).text = chars.trim();
    });
  });

  parser.parseString(xml);

  return error || json;
};
