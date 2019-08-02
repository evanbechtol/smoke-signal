const DataExportService = {
  csvExport(arrData) {
    let csvContent = "data:text/csv;charset=utf-8,";
    arrData.forEach(function(elem) {
      delete elem.discussion;
      delete elem.files;
      delete elem.__v;
    });

    csvContent += [
      Object.keys(arrData[0]).join(","),
      ...arrData.map(item => {
        let values = Object.values(item);

        if (typeof values[0] === "object") {
          values[0] = values[0].username || "";
        }
        // Parse arrays to get the values
        values.forEach(function(elem, index) {
          const isArray =
            typeof elem === "object" && elem && elem.length !== undefined;
          if (isArray) {
            values[index] = values[index].join(";");
          }
        });
        values.splice(11, 1);
        return values.join(",");
      })
    ]
      .join("\n")
      .replace(/(^\[)|(]$)/gm, "");

    const data = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", data);
    link.setAttribute("download", "export.csv");

    const app = document.getElementById("home");
    app.appendChild(link);

    link.click();
    //link.parentNode.removeChild(link);
  }
};

export { DataExportService };
