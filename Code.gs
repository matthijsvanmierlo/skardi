function onSheetsOpen(){
  return CardService.newCardBuilder().addSection().setHeader("Skardi").build();
}

// *************************************************************************************************
// MENU OPTIONS
var nameTemplate = "Study Deck: "

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Flashcards')
    .addItem('Create Deck', 'createDeck')
    .addItem('Start Flashcards', 'showFlashcards')
    .addItem('Multiple Choice', 'showMultipleChoiceDialog')
    .addItem('Hide Words', 'hideSpreadsheet')
    .addItem('Show Words', 'showSpreadsheet')
    .addToUi();
}

// *************************************************************************************************

// FLASHCARD CODE

function createDeck() {
  // Create new spreadsheet
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var date = Utilities.formatDate(new Date(), "GMT+1", "dd/MM/yyyy");
  var time = new Date().getTime();
  sheet = sheet.insertSheet();
  sheet.setName(nameTemplate + date + "(" + time + ")");
  sheet.setFrozenRows(1);
  sheet.getRange('A1').setValue('Terms');
  sheet.getRange('B1').setValue('Definitions');
  for(let i = 2; i < 7; i++){
    sheet.getRange('A' + (i-1)).setValue("Term " + (i-1));
    sheet.getRange('B' + (i-1)).setValue("Definition " + (i-1));
  }
  // **** TODO Can't have duplicate names
}

function hideSpreadsheet() {
  // Hide columns A and B when the add-on is opened
  var sheet = SpreadsheetApp.getActiveSheet();
  sheet.hideColumns(1, 2); // Hide columns A and B
}

function showSpreadsheet() {
  // Show columns A and B when the popup is closed
  var sheet = SpreadsheetApp.getActiveSheet();
  sheet.showColumns(1, 2); // Show columns A and B
  var range = sheet.getRange("A1:B");
  sheet.setActiveSelection(range);  
  sheet.setFrozenRows(1);
}

function showFlashcards() {
  var htmlOutput = HtmlService.createHtmlOutputFromFile('Flashcards.html')
    .setTitle('Flashcards')
    .setWidth(600) // How to set this to be max width automatically
    .setHeight(400);
  SpreadsheetApp.getUi().showModelessDialog(htmlOutput, 'Flashcards');
}

// Issue here with the boundary conditions...
function getFlashcardData() {
  var sheet = SpreadsheetApp.getActiveSheet();
  if (sheet.getLastRow() == 1){
    return JSON.stringify([]);
  }
  else{
    var terms = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1);
    var definitions = sheet.getRange(2, 2, sheet.getLastRow() - 1, 1);

    terms = terms.getValues();
    definitions = definitions.getValues();

    // Add a check if the cell is empty
    var flashcardData = [];

    for (var i = 0; i < terms.length; i++) {
      flashcardData.push([terms[i][0], definitions[i][0]]);
    }

    // Hide columns A and B when the add-on is opened
    var sheet = SpreadsheetApp.getActiveSheet();
    hideSpreadsheet();

    return JSON.stringify(flashcardData);
  }
  
}

function closeFlashcards() {
  // Show columns A and B when the popup is closed
  var sheet = SpreadsheetApp.getActiveSheet();
  showSpreadsheet();
}

// *************************************************************************************************

// MULTIPLE CHOICE CODE

function showMultipleChoiceDialog() {
  var htmlOutput = HtmlService.createHtmlOutputFromFile('MultipleChoice.html')
    .setWidth(600)
    .setHeight(600);
  SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'Practice Questions');
}

