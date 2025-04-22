import { Regex } from "../utils/regex.js";

export class FieldParser {
  constructor(data) {
    this._fields = {
      firstName: 'DAC',
      middleNames: 'DAD',
      lastName: 'DCS',
      suffix: 'DCU',
      expirationDate: 'DBA',
      dateOfBirth: 'DBB',
      idNumber: 'DAQ',
      country: 'DCG',
      state: 'DAJ',
    };
    this.data = data;
  }

  parseString(field) {
    const identifier = this._fields[field];
    if (!identifier) return null;
    return this.data[identifier] || null;
  }

  parseDate(field) {
    const dateString = this.parseString(field);
    if (!dateString || dateString.length !== 8) return null;

    const country = this.parseString("country");
    let year, month, day;

    if(country == "CAN") {
        year = parseInt(dateString.slice(0, 4), 10);
        month = parseInt(dateString.slice(4, 6), 10);
        day = parseInt(dateString.slice(6, 8), 10);
    } else {
        month = parseInt(dateString.slice(0, 2), 10);
        day = parseInt(dateString.slice(2, 4), 10);
        year = parseInt(dateString.slice(4, 8), 10);
    }

    if (isNaN(year) || isNaN(month) || isNaN(day)) return null;

    return `${year}-${month}-${day}`;
  }

  get firstName() {
    return this.parseString("firstName") || null;
  }

  get middleNames() {
    let middleNames = this.parseString("middleNames");
    if (middleNames) {
      middleNames = middleNames.split(",");
    }
    return middleNames || null;
  }

  get lastName() {
    return this.parseString("lastName") || null;
  }

  get suffix() {
    return this.parseString("suffix") || null;
  }

  get expirationDate() {
    return this.parseDate("expirationDate");
  }

  get dateOfBirth() {
    return this.parseDate("dateOfBirth");
  }

  get idNumber() {
    return this.parseString("idNumber") || null;
  }

  get country() {
    return this.parseString("country") || null;
  }

  get state() {
    return this.parseString("state") || null;
  }
}