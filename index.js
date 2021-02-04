const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const [url, file, format] = process.argv.slice(2);

if (!url) {
  throw 'Please provide a URL as the first argument.';
}

const csvWriterObject = {
  path: 'export.csv',
  header: []
};

function updateObject(rowsObject, row, column, data){
  if(!rowsObject[row]){
    rowsObject[row] = {};
  }
  rowsObject[row][column]=data;
}

function trimText(node){
  return node.innerText.trim()
}

async function createRowsObject(columns, parsedText){
  const dataForRows = {};
  for (let i = 0; i < columns.length; i++) {
    const columnTitle = await columns[i].$eval('.column-header', trimText);

    csvWriterObject.header.push({id: columnTitle, title: columnTitle});

    const messages = await columns[i].$$('.message-main');

    if (messages.length) {
     parsedText += columnTitle + '\n';
   }

    let ROW_HEADER = 0;
    for (let i = 0; i < messages.length; i++) {
      const messageText = await messages[i].$eval('.message-body .text', trimText);
      const votes = await messages[i].$eval('.votes .vote-area span.show-vote-count', trimText);
      const DATA = `- ${messageText} (${votes})` + '\n';
      if(parseInt(votes) < 1) continue;
      updateObject(
        dataForRows,
        ROW_HEADER,
        columnTitle,
        DATA
      );
      ROW_HEADER++;
      parsedText += DATA;
    }
    if (messages.length) {
      parsedText += '\n';
    }
  }
  return {csv: dataForRows, text: parsedText};
}
async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(url);
  await page.waitForSelector('.message-list');

  const boardTitle = await page.$eval('.board-name', trimText);

  if (!boardTitle) {
    throw 'Board title does not exist. Please check if provided URL is correct.'
  }

  let parsedText = boardTitle + '\n\n';

  const columns = await page.$$('.message-list');
  return await createRowsObject(columns, parsedText);
}

function writeToFile(filePath, data) {
  const resolvedPath = path.resolve(filePath || `../${data.split('\n')[0].replace('/', '')}.txt`);
  fs.writeFile(resolvedPath, data, (error) => {
    if (error) {
      throw error;
    } else {
      console.log(`Successfully written to file at: ${resolvedPath}`);
    }
    process.exit();
  });
}

function writeToCSVFile(file, data){
  csvWriterObject.path = `${file}.csv`
  return createCsvWriter(csvWriterObject)
    .writeRecords(Object.entries(data).map(([key, val]) => val))
    .then(()=> process.exit());
}
function handleError(error) {
  console.error(error);
}

run().then(({csv, text}) => {
  console.log()
  return (!format || format === 'txt') ?
  writeToFile(file, text) :
  writeToCSVFile(file, csv);
}
).catch(handleError);
