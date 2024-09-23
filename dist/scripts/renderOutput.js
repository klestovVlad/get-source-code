export function renderOutput(line, column, linkToSourceCode) {
  const outputDiv = document.getElementById("output");

  outputDiv.style.display = "block";

  if (!linkToSourceCode) {
    outputDiv.innerHTML =
      "Не удалось найти соответствующую позицию в исходном файле.";
    return;
  }

  const fileName = linkToSourceCode.split("/").pop();

  outputDiv.innerHTML = `
    <h3>Data: </h3>
    <p>Line: ${line}</p>
    <p>Column: ${column}</p>
    <p>Link to source code: ${fileName} - <a href="file://${linkToSourceCode}" target="_blank">${linkToSourceCode}</a></p>
`;
}
