# Get Source Code

This project helps you to find the original file and location (line and column) from minified JavaScript code.

## Prerequisites

- Make sure you have Node.js installed.

## Installation

1. Clone this repository and navigate to the project directory.
2. Run the following command to initialize the project:

   ```bash
   npm init
   ```
3. Start the application:

   ```bash
   npm start
   ```
   
## Setup

You need to provide the files from the built project for this application to work. Please download the necessary files from the following location of your other project:

packages/app/build/js

These files should include JavaScript (.js) and corresponding source map (.map) files.

Once you have the files, place them in the appropriate folder and specify the path to that folder when running the application.

## Usage
1. After starting the app, in the interface, select the JavaScript file you want to analyze.
2. Once selected, a file preview will be displayed.
3. In the input field, paste the minified code snippet you want to search for.
4. Click the Search button.

The algorithm will search through the source maps and return:
* The original file path
* The line number
* The column number
