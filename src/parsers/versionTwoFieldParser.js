import { FieldParser } from './fieldParser.js';

export class VersionTwoFieldParser extends FieldParser {
  constructor(data) {
    super(data);
    this._fields['firstName'] = 'DCT';
    this._fields['middleNames'] = 'DCT';
  }

  get firstName() {
    let firstName = this.parseString("firstName");
    if (firstName && firstName.includes(",")) {
      return firstName.split(",")[0].trim();
    }
    return firstName || null;
  }

  get middleNames() {
    let middleNames = this.parseString("middleNames");
    if (middleNames && middleNames.includes(",")) {
      middleNames = middleNames.split(",");
      middleNames.shift();
      return middleNames;
    } else {
      return null;
    }
  }
} 