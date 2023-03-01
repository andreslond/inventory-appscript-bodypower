/* Events */
//document.getElementById('reload-button').addEventListener('click', reloadReport);

const TABLE_BODY_ID = 'table-body';
const TABLE_CONTENT_ID = 'table-content';

function reloadReport() {
  startLoadingScreen();
  getReportData();
}

function getReportData() {
  if ('undefined' !== typeof google) {
    google.script.run
      .withSuccessHandler(addContentToTable)
      .withFailureHandler(failResponse)
      .getInventoryData();
    return;
  }
  stopLoadingScreen();
}

function addContentToTable(dataFromInventory) {
  hideEmptyResponse();
  renderDataOnTable(dataFromInventory);
  stopLoadingScreen();
}

function renderDataOnTable(filteredData) {
  console.log(filteredData);
  const tableBody = document.getElementById(TABLE_BODY_ID);
  tableBody.textContent = '';
  let counter = 1;

  filteredData.forEach((row) => {
    if (!row[1]) return;

    const tableRow = document.createElement('tr');

    const cellHeader = document.createElement('th');
    const cellHText = document.createTextNode(counter);

    cellHeader.appendChild(cellHText);
    cellHeader.setAttribute('scope', 'row');

    const nameCell = createCell(row[1]);
    const minStockCell = createCell(row[8]);
    const currStockCell = createCell(row[7]);

    tableRow.appendChild(cellHeader);
    tableRow.appendChild(nameCell);
    tableRow.appendChild(minStockCell);
    tableRow.appendChild(currStockCell);

    tableBody.appendChild(tableRow);
    counter++;
  });

  if(counter === 1) {
    showEmptyResponse();
  }
}

function createCell(value) {
  const nameCell = document.createElement('td');
  const nameTextNode = document.createTextNode(value);
  nameCell.appendChild(nameTextNode);
  return nameCell;
}

function showEmptyResponse() {
    document.getElementById('empty-response').classList.remove('hidden');
    document.getElementById(TABLE_CONTENT_ID).classList.add('hidden');
}

function hideEmptyResponse() {
    document.getElementById('empty-response').classList.add('hidden');
    document.getElementById(TABLE_CONTENT_ID).classList.remove('hidden');
}

function failResponse() {
  errorResponse();
  stopLoadingScreen();
}
