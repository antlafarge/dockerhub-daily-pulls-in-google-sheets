// Call recordDockerImagePullCount for each sheet
function main()
{
  const sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();

  sheets.forEach(sheet => { recordDockerImagePullCount(sheet) });
}

// Record docker image pull count
function recordDockerImagePullCount(sheet)
{
  Logger.log(`Process sheet '${sheet.getName()}'`);
  
  //const sheet = SpreadsheetApp.getActiveSheet();
  const firstColumn = 2;
  const lastColumn = sheet.getLastColumn();

  const images = [];

  for (let column = firstColumn; column <= lastColumn; column++)
  {
    const image = sheet.getRange(1, column).getValue();
    images.push(image);
  }

  Logger.log(`Images = [ ${images} ]`);

  const row = [new Date()];

  const lastRow = sheet.getLastRow();
  let different = false;

  // Parse images to get pull counts
  images.forEach((image, index) =>
  {
    // If this is not a valid docker hub image name
    if (image == null || image.length === 0 || !/^\w+\/\w+(\-\w+)*$/.test(image))
    {
      // Keep the current content of the cell
      const cell = sheet.getRange(lastRow + 1, index + 2);
      if (cell.getFormula())
      {
        row.push(cell.getFormula());
      }
      else if (cell.isBlank())
      {
        row.push('');
      }
      else
      {
        row.push(cell.getValue());
      }
      return;
    }

    // Get pull count
    const pullCount = getImagePullCount(image);

    // Comapre with last pull count
    let lastRowInColumn = lastRow;
    let lastCell = sheet.getRange(lastRowInColumn, index + 2);
    while (lastCell.isBlank() && lastRowInColumn > 1)
    {
      Logger.log('Cell is blank, retrieve the cell above');
      lastCell = sheet.getRange(--lastRowInColumn, index + 2);
    }
    const lastValue = lastCell.getValue();
    Logger.log("Old value = " + lastCell.getValue());
    Logger.log("New value = " + pullCount);
    if (lastValue != pullCount)
    {
      row.push(pullCount);
      different = true;
    }
    else
    {
      row.push('');
    }
  });

  Logger.log(`row = [ ${row} ]`);
  
  // If one element in the row is different, we append the new row
  if (different)
  {
    Logger.log('Different pull counts, append new row ');
    sheet.appendRow(row);
  }
  else
  {
    Logger.log('Same pull counts, don\'t append new row');
  }
}

// Get image pull count
function getImagePullCount(image)
{
  // Fetch repository infos
  const baseUrl = 'https://hub.docker.com/v2/repositories/';
  const url = baseUrl + image;
  Logger.log(`Fetch repository infos '${url}'`);
  const response = UrlFetchApp.fetch(url);
  const contentText = response.getContentText();
  Logger.log(`${contentText.length} bytes received`);
  const imageStats = JSON.parse(contentText);
  return imageStats['pull_count'];
}
