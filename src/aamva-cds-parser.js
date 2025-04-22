import { FieldParser } from "./parsers/fieldParser.js";
import { VersionOneFieldParser } from "./parsers/versionOneFieldParser.js";
import { VersionTwoFieldParser } from "./parsers/versionTwoFieldParser.js";
import { VersionThreeFieldParser } from "./parsers/versionThreeFieldParser.js";
import { VersionFourFieldParser } from "./parsers/versionFourFieldParser.js";
import { VersionFiveFieldParser } from "./parsers/versionFiveFieldParser.js";
import { VersionSixFieldParser } from "./parsers/versionSixFieldParser.js";
import { VersionSevenFieldParser } from "./parsers/versionSevenFieldParser.js";
import { VersionEightFieldParser } from "./parsers/versionEightFieldParser.js";
import { VersionNineFieldParser } from "./parsers/versionNineFieldParser.js";
import { VersionTenFieldParser } from "./parsers/versionTenFieldParser.js";

const COMPLIANCE_INDICATOR = "@"
const DATA_ELEMENT_SEPARATOR = "\n"
const RECORD_SEPARATOR = "\x1e"
const SEGMENT_TERMINATOR = "\r"
const FILE_TYPE = "ANSI "
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

export function parse(data) {
    const parser = new Parser(data);
    return parser.parse();
}