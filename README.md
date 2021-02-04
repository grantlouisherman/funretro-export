# FunRetro.io export

[![License][license-badge]][license-url]

> CLI tool to easily export [FunRetro.io](https://funretro.io/) retrospective boards using Playwright

## Installing / Getting started

It's required to have [npm](https://www.npmjs.com/get-npm) installed locally to follow the instructions.

```shell
git clone https://github.com/julykaz/funretro-export.git
cd funretro-export
npm install
npm start -- "http://funretro.io/board..." "../exported-file.txt"

```
## Different Formats ( Acceptance Criteria )

- To use the default behavior run the following command
npm start -- "http://funretro.io/board..." "../exported-file.txt" txt

- To create a csv file run the following command
npm start -- "http://funretro.io/board..." "../exported-file" csv


## TODO

- Export card comments
- More export options (PDF, CSV)

## Licensing

MIT License

[license-badge]: https://img.shields.io/github/license/robertoachar/docker-express-mongodb.svg
[license-url]: https://opensource.org/licenses/MIT
