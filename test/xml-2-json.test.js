import { describe, beforeAll, it, expect } from './jasmine.js';
import xmlParser from '../source/xml-2-json.js';
import { readFileSync } from 'fs';

describe('xml to json', () => {
  let xml, expectedJson;

  beforeAll(() => {
    xml = readFileSync('./test/fixtures/fixture.xml', 'utf8')
      .replace(/^\s+/gm, '')
      .replace(/\n/gm, '');

    expectedJson = JSON.parse(
      readFileSync('./test/fixtures/fixture.json', 'utf8')
    );
  });

  it('should parse to JSON', () => {
    const json = xmlParser(xml);

    expect(json).toEqual(expectedJson);
  });

  it('should return an error when encountered', () => {
    const error = xmlParser('<>');

    expect(error).toEqual(
      new Error('Element: name must immediatly follow "<"')
    );
  });

  it('should return an error on no content', () => {
    const error = xmlParser('');

    expect(error).toEqual(new Error('No content provided'));
  });
});
