import { test, describe } from 'node:test';
import assert from 'node:assert';
import { parse } from '../src/aamva-cds-parser.js';

describe('AAMVA CDS Parser Tests', () => {
  // Test data will be added here
  const testDataV3 = "@\n\u001e\rANSI 636020030001DL00310242DLDAQ123456789\r\nDCF1234567\r\nDBD01012022\r\nDBB01011970\r\nDBA01012027\r\nDCTFIRSTNAME,MIDDLENAME\r\nDDFN\r\nDDGN\r\nDCSLASTNAME\r\nDDEN\r\nDAU069 IN\r\nDBC1\r\nDAYBLK\r\nDAG123 MAIN STREET\r\nDAIDENVER\r\nDAJCO\r\nDAK800120000 \r\nDCGUSA\r\nDDAF\r\nDCJCODL_0_082418_04105\r\nDCLU\r\n                      ";
  const testDataV9 = "@\n\u001e\rANSI 636020090001DL00310242DLDAQ123456789\r\nDCF1234567\r\nDBD01012022\r\nDBB01011970\r\nDBA01012027\r\nDACFIRSTNAME\r\nDDFN\r\nDADMIDDLENAME\r\nDDGN\r\nDCSLASTNAME\r\nDDEN\r\nDAU069 IN\r\nDBC1\r\nDAYBLK\r\nDAG123 MAIN STREET\r\nDAIDENVER\r\nDAJCO\r\nDAK800120000 \r\nDCGUSA\r\nDDAF\r\nDCJCODL_0_082418_04105\r\nDCLU\r\n                      ";

  test('Basic Parsing - v3', () => {
    const parsedData = parse(testDataV3);

    // Add assertions here once we have test data
    // Example assertions we can add:
    assert.strictEqual(parsedData.firstName, 'FIRSTNAME');
    assert.deepStrictEqual(parsedData.middleNames, ['MIDDLENAME']);
    assert.strictEqual(parsedData.lastName, 'LASTNAME');
    assert.strictEqual(parsedData.idNumber, '123456789');
    assert.strictEqual(parsedData.version, 3);
  });

  test('Basic Parsing - v9', () => {
    const parsedData = parse(testDataV9);

    // Add assertions here once we have test data
    // Example assertions we can add:
    assert.strictEqual(parsedData.firstName, 'FIRSTNAME');
    assert.deepStrictEqual(parsedData.middleNames, ['MIDDLENAME']);
    assert.strictEqual(parsedData.lastName, 'LASTNAME');
    assert.strictEqual(parsedData.idNumber, '123456789');
    assert.strictEqual(parsedData.version, 9);
  });
}); 