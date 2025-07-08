function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  try {
    const sheet = SpreadsheetApp.openById('1wo3nF7TUmJIhEaidPZ_o7NYVCioWvNjv57mgSW54Y7k').getActiveSheet();
    
    let name, phone, email, college, screenshot;
    
    // Handle form data from parameters
    if (e.parameter) {
      name = e.parameter.name;
      phone = e.parameter.phone;
      email = e.parameter.email;
      college = e.parameter.college;
      screenshot = e.parameter.screenshot || 'No file uploaded';
    } else {
      throw new Error('No data received');
    }

    // Validate required fields
    if (!name || !phone || !email || !college) {
      throw new Error('Missing required fields');
    }

    // Add timestamp
    const timestamp = new Date().toISOString();
    
    // Append to sheet
    sheet.appendRow([timestamp, name, phone, email, college, screenshot]);
    
    // Create response with JSONP to avoid CORS
    var callback = e.parameter.callback;
    var response = {
      success: true,
      message: 'Registration submitted successfully!'
    };
    
    if (callback) {
      return ContentService
        .createTextOutput(callback + '(' + JSON.stringify(response) + ')')
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    } else {
      return ContentService
        .createTextOutput(JSON.stringify(response))
        .setMimeType(ContentService.MimeType.JSON);
    }
      
  } catch (error) {
    var callback = e.parameter.callback;
    var response = {
      success: false,
      error: error.toString()
    };
    
    if (callback) {
      return ContentService
        .createTextOutput(callback + '(' + JSON.stringify(response) + ')')
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    } else {
      return ContentService
        .createTextOutput(JSON.stringify(response))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }
}