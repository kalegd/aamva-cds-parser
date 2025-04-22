class FieldParser {
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
}

class VersionOneFieldParser extends FieldParser {
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

class VersionTwoFieldParser extends FieldParser {
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

class VersionThreeFieldParser extends FieldParser {
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

class VersionFourFieldParser extends FieldParser {
  constructor(data) {
    super(data);
  }
}

class VersionFiveFieldParser extends FieldParser {
  constructor(data) {
    super(data);
  }
}

class VersionSixFieldParser extends FieldParser {
  constructor(data) {
    super(data);
  }
}

class VersionSevenFieldParser extends FieldParser {
  constructor(data) {
    super(data);
  }
}

class VersionEightFieldParser extends FieldParser {
  constructor(data) {
    super(data);
  }
}

class VersionNineFieldParser extends FieldParser {
  constructor(data) {
    super(data);
  }
}

class VersionTenFieldParser extends FieldParser {
  constructor(data) {
    super(data);
  }
}

const COMPLIANCE_INDICATOR = "@";
const DATA_ELEMENT_SEPARATOR = "\n";
const RECORD_SEPARATOR = "\x1e";
const SEGMENT_TERMINATOR = "\r";
const FILE_TYPE = "ANSI ";
const SUBFILE_INFO_LENGTH = 10;

class Parser {
  constructor(rawData) {
    if(!rawData || typeof rawData !== 'string') throw new Error("Invalid AAMVA CDS data");
    this.rawData = rawData;
    this.subfiles = [];
    this.processData();
  }

  processData() {
    if(this.rawData.length < 17) throw new Error("Invalid AAMVA CDS data");
    if(this.rawData[0] != COMPLIANCE_INDICATOR) throw new Error("Invalid AAMVA CDS data");
    if(this.rawData[1] != DATA_ELEMENT_SEPARATOR) throw new Error("Invalid AAMVA CDS data");
    if(this.rawData[2] != RECORD_SEPARATOR) throw new Error("Invalid AAMVA CDS data");
    if(this.rawData[3] != SEGMENT_TERMINATOR) throw new Error("Invalid AAMVA CDS data");
    if(this.rawData.slice(4, 9) != FILE_TYPE) throw new Error("Invalid AAMVA CDS data");
    this.version = Number(this.rawData.slice(15, 17));
    if(isNaN(this.version) || this.version < 0 || this.version > 99) throw new Error("Invalid AAMVA CDS data");
    let headerLength = this.version < 2 ? 19 : 21;
    if(this.rawData.length < headerLength) throw new Error("Invalid AAMVA CDS data");
    let numberOfEntries = this.version < 2 ? Number(this.rawData.slice(17, 19)) : Number(this.rawData.slice(19, 21));
    if(isNaN(numberOfEntries) || numberOfEntries < 1 || numberOfEntries > 99) throw new Error("Invalid AAMVA CDS data");
    for(let i = 0; i < numberOfEntries; i++) {
      let offset = headerLength + (i * SUBFILE_INFO_LENGTH);
      let subfileInfo = this.rawData.slice(offset, offset + SUBFILE_INFO_LENGTH);
      let subfileOffset = Number(subfileInfo.slice(2, 6));
      let subfileLength = Number(subfileInfo.slice(6, 10));
      if(isNaN(subfileOffset) || isNaN(subfileLength)) throw new Error("Invalid AAMVA CDS data");
      let rawSubfileData = this.rawData.slice(subfileOffset, subfileOffset + subfileLength);
      this.subfiles.push({
        rawData: rawSubfileData,
        data: this.processSubfile(rawSubfileData),
        type: subfileInfo.slice(0, 2),
      });
    }
  }

  processSubfile(subfileData) {
    let processedData = {};
    subfileData = subfileData.slice(2, subfileData.length - 1);
    let subfileDataLines = subfileData.split(DATA_ELEMENT_SEPARATOR);
    for(let line of subfileDataLines) {
      processedData[line.slice(0, 3)] = line.slice(3).trim();
    }
    return processedData;
  }

  parse() {
    if(this.subfiles.length === 0) throw new Error("No subfiles found");
    //find first subfile with type ID or EN or DL
    let subfile = this.subfiles.find(subfile => subfile.type === "ID" || subfile.type === "EN" || subfile.type === "DL");
    if(!subfile) throw new Error("No subfile found");
    const fieldParser = this.getVersionBasedFieldParser(subfile.data);
    return {
      firstName: fieldParser.firstName,
      middleNames: fieldParser.middleNames,
      lastName: fieldParser.lastName,
      suffix: fieldParser.suffix,
      expirationDate: fieldParser.expirationDate,
      dateOfBirth: fieldParser.dateOfBirth,
      idNumber: fieldParser.idNumber,
      country: fieldParser.country,
      version: this.version,
    };
  }

  getVersionBasedFieldParser(data) {
    switch (this.version) {
      case 1:
        return new VersionOneFieldParser(data);
      case 2:
        return new VersionTwoFieldParser(data);
      case 3:
        return new VersionThreeFieldParser(data);
      case 4:
        return new VersionFourFieldParser(data);
      case 5:
        return new VersionFiveFieldParser(data);
      case 6:
        return new VersionSixFieldParser(data);
      case 7:
        return new VersionSevenFieldParser(data);
      case 8:
        return new VersionEightFieldParser(data);
      case 9:
        return new VersionNineFieldParser(data);
      case 10:
        return new VersionTenFieldParser(data);
      default:
        return new FieldParser(data);
    }
  }
}

function parse(data) {
    const parser = new Parser(data);
    return parser.parse();
}

export { parse };
