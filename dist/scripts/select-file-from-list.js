import { getSourceCodePosition } from "./get-source-code-position.js";

window.addEventListener("load", function () {
  const codeInputBlock = document.getElementById("code-input-block");
  const codeEmptyBanner = document.getElementById("code-empty-banner");

  const chooseFolderButton = document.getElementById("choose-folder");
  const folderInput = document.getElementById("folder-input");

  const fileList = document.getElementById("file-list");
  const fileListBlock = document.getElementById("file-list-block");

  const searchCodeInput = document.getElementById("search-code");
  const searchButton = document.getElementById("search-button");

  const codeOutput = document.getElementById("code-output");
  const searchSectionBlock = document.getElementById("search-section-block");

  let selectedFile = null;
  let selectedMapFile = null;

  chooseFolderButton.addEventListener("click", () => {
    folderInput.click(); // Открываем диалог выбора папки
  });

  function readFile(file, callback) {
    const reader = new FileReader();
    reader.onload = function (e) {
      callback(e.target.result);
    };
    reader.readAsText(file);
  }

  folderInput.addEventListener("change", function (event) {
    const files = Array.from(event.target.files);
    fileList.innerHTML = ""; // Очищаем список файлов

    // Фильтруем и отображаем только JS файлы
    const jsFiles = files.filter((file) => file.name.endsWith(".js"));
    const mapFiles = files.filter((file) => file.name.endsWith(".map"));

    hideBanner();

    jsFiles.forEach((file) => {
      const li = document.createElement("li");
      li.textContent = file.name;
      li.classList.add("file-item");

      li.addEventListener("click", () => {
        selectedFile = file; // Сохраняем выбранный JS файл

        // Ищем соответствующий .map файл
        const correspondingMapFile = mapFiles.find(
          (mapFile) => mapFile.name === `${file.name}.map`
        );

        if (correspondingMapFile) {
          selectedMapFile = correspondingMapFile; // Сохраняем найденный .map файл
          console.log("Соответствующий .map файл: ", selectedMapFile.name);
        } else {
          selectedMapFile = null;
          console.log("Соответствующий .map файл не найден");
        }
        highlightSelected(li); // Подсвечиваем выбранный файл
      });

      fileList.appendChild(li);
    });
  });

  // Подсветка выбранного файла
  function highlightSelected(selectedLi) {
    const items = document.querySelectorAll(".file-item");
    items.forEach((item) => item.classList.remove("active"));
    selectedLi.classList.add("active");
  }

  // Поиск совпадений в файле
  searchButton.addEventListener("click", () => {
    if (!searchCodeInput) {
      alert("Пожалуйста, введите строку для поиска.");
      return;
    }
    if (searchCodeInput.value === "") {
      alert("Пожалуйста, введите строку для поиска.");
      return;
    }

    if (searchCodeInput.value.length < 3) {
      alert("Пожалуйста, введите строку длиной не менее 3 символов.");
      return;
    }

    const searchCode = searchCodeInput.value.trim();

    if (!selectedFile) {
      alert("Пожалуйста, выберите файл для поиска.");
      return;
    }

    if (!searchCode) {
      alert("Пожалуйста, введите строку для поиска.");
      return;
    }

    readFile(selectedFile, (fileContent) => {
      const matches = findMatches(fileContent, searchCode);

      if (matches?.length === 0) {
        alert("Совпадений не найдено.");
        return;
      }

      if (matches?.length > 1) {
        alert("Найдено более одного совпадения. Пожалуйста, уточните запрос.");
        return;
      }

      const match = matches[0];
      const line = match.line;
      const column = match.column;

      getSourceCodePosition(line, column, selectedMapFile, selectedFile.name);
    });
  });

  // Функция поиска совпадений
  function findMatches(content, searchString) {
    const matches = [];
    const lines = content.split("\n"); // Разделяем содержимое файла по строкам

    lines.forEach((line, lineIndex) => {
      let columnIndex = line.indexOf(searchString);

      // Находим все вхождения строки в текущей строке кода
      while (columnIndex !== -1) {
        matches.push({
          line: lineIndex + 1, // Строка (начинается с 1)
          column: columnIndex + 1, // Колонка (начинается с 1)
          code: line.trim(), // Контекст - строка кода
        });
        columnIndex = line.indexOf(searchString, columnIndex + 1); // Ищем дальше
      }
    });

    return matches;
  }

  const hideBanner = () => {
    codeInputBlock.style.display = "block";
    codeEmptyBanner.style.display = "none";
    searchSectionBlock.style.display = "flex";
    fileListBlock.style.display = "block";
  };

  const fileSearch = document.getElementById("file-search");
  fileSearch?.addEventListener("input", function () {
    const searchTerm = this.value.toLowerCase();
    const fileItems = document.querySelectorAll(".file-item");
    fileItems.forEach((item) => {
      const fileName = item?.textContent?.toLowerCase();
      if (fileName?.includes(searchTerm)) {
        item.style.display = "";
      } else {
        item.style.display = "none";
      }
    });
  });
});
