import { SourceMapConsumer } from "source-map";
import { renderOutput } from "./renderOutput";

function readFile(file, callback) {
  const reader = new FileReader();
  reader.onload = function (e) {
    callback(e.target.result);
  };
  reader.readAsText(file);
}

export async function getSourceCodePosition(
  line,
  column,
  sourceMapContent,
  fileName
) {
  readFile(sourceMapContent, async (result) => {
    const sourceMap = JSON.parse(result);
    const consumer = await new SourceMapConsumer(sourceMap);

    if (!consumer) {
      console.log("Не удалось создать SourceMapConsumer.");
      return;
    }

    findSourceCode(consumer, line, column, fileName);
  });
}

function findSourceCode(consumer, line, column, fileName) {
  const mappings = [];
  consumer.eachMapping((mapping) => {
    mappings.push(mapping);
  });

  const { closestColumn, closestLine } = findClosestColumn(
    mappings,
    line,
    column
  );

  const originalPosition = consumer.originalPositionFor({
    line: closestLine,
    column: closestColumn,
  });

  if (originalPosition.source) {
    const sourceFilePath = originalPosition.source.replace(
      "webpack:///builds/M69/frontend_team/",
      "/Users/v.klestov/Projects/Finom/"
    );

    renderOutput(
      originalPosition.line,
      originalPosition.column,
      sourceFilePath,
      fileName
    );
  } else {
    console.log("Не удалось найти соответствующую позицию в исходном файле.");
  }
}

function findClosestColumn(mappings, line, column) {
  let closestColumn = -1;
  let minDistance = Infinity;
  let closestLine = -1;
  let closestMapping = null;
  mappings.forEach((mapping) => {
    if (mapping.generatedLine === line) {
      const distance = Math.abs(mapping.generatedColumn - column);
      if (distance < minDistance) {
        minDistance = distance;
        closestColumn = mapping.generatedColumn;
        closestLine = mapping.generatedLine;
        closestMapping = mapping;
      }
    }
  });

  console.log("min distance: ", minDistance);
  console.log("closest mapping: ", closestMapping);
  return { closestLine, closestColumn };
}
