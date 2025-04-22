import { FieldParser } from './fieldParser.js';

export class VersionOneFieldParser extends FieldParser {
  constructor(data) {
    super(data);
    this._fields['driverLicenseName'] = 'DAA';
    this._fields['lastName'] = 'DAB';
    this._fields['suffix'] = 'DAE';
  }

  get firstName() {
    return this.parseString("firstName") || this.parseDriverLicenseName("firstName") || null;
  }

  get lastName() {
    return this.parseString("lastName") || this.parseDriverLicenseName("lastName") || null;
  }

  get middleNames() {
    let middleNames = this.parseString("middleNames") || this.parseDriverLicenseName("middleNames");
    if (middleNames) {
      middleNames = middleNames.split(",");
    }
    return middleNames || null;
  }

  get suffix() {
    return this.parseString("suffix") || this.parseDriverLicenseName("suffix") || null;
  }

  parseDriverLicenseName(key) {
    const driverLicenseName = this.parseString("driverLicenseName");
    if (!driverLicenseName) return null;

    const namePieces = driverLicenseName.split(',');

    switch (key) {
      case "lastName":
        return namePieces[0] || null;
      case "firstName":
        return namePieces[1] || null;
      case "middleName":
        return namePieces[2] || null;
      case "suffix":
        return namePieces[3] || null;
      default:
        return null;
    }
  }
} 