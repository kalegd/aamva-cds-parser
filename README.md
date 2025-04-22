## Installation
Install through npm

```bash
npm install aamva-cds-parser
```

## Usage

```js
import { parse } from "aamva-cds-parser"

//Get PDF417 data as a string using something like @zxing/library
const aamvaData = parse(pdf417String)

console.log(aamvaData.version);
console.log(aamvaData.firstName);
console.log(aamvaData.middleNames);
console.log(aamvaData.lastName);
...
```

### Supported Fields
| Name           | Description              | Type               |
|:---------------|:-------------------------|:-------------------|
| firstName      | Customer First Name      | String             |
| middleNames    | Customer Middle Names    | List<String>       |
| lastName       | Customer Family Name     | String             |
| suffix         | Name Suffix              | String             |
| expirationDate | Document Expiration Date | String<YYYY-MM-DD> |
| dateOfBirth    | Date of Birth            | String<YYYY-MM-DD> |
| idNumber       | Customer ID Number       | String             |
| country        | Country Identification   | String<CAN or USA> |
| version        | Customer First Name      | Number             |

Any attribute could be null due to the version used or because the company issuing the license did not follow the standard correctly

People are more than welcome to submit a PR to add additional fields they need

### AAMVA Element IDs

For a comprehensive list of AAMVA Element IDs across different versions, please see here: https://github.com/benhovinga/aamva_barcode_library/wiki/List-of-Data-Elements

### Credits

Based off of https://github.com/joptimus/aamva-parser and my hatred of typescript
Header procesing based off of https://github.com/benhovinga/aamva_barcode_library
