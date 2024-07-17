import * as dayjs from "dayjs";
import Papa from "papaparse";
import DateMatcher from "./date-matcher.js";
import { createGuid } from "./guid.js";

function checkIfDuplicateExists(arr) {
  return new Set(arr).size !== arr.length;
}

export function exportToCsv(rows, measurementMapping) {
  if (checkIfDuplicateExists(Object.values(measurementMapping))) {
    throw "Measurement names are not unique";
  }
  const data = Object.values(rows)
    .sort((a, b) => a.date < b.date)
    .map((row) => {
      var m = dayjs.unix(row.date);
      const values = Object.keys(measurementMapping).reduce((acc, key) => {
        acc[measurementMapping[key]] = row.data[key] || "";
        return acc;
      }, {});
      return {
        date: m.format("MM/DD/YY"),
        time: m.format("HH:mm:ss"),
        unix: row.date,
        ...values,
      };
    });

  const csv = Papa.unparse(data);

  exportFile(csv);
}

export async function matchAndExportToCsv(rows, measurementMapping) {
  if (checkIfDuplicateExists(Object.values(measurementMapping))) {
    throw "Measurement names are not unique";
  }

  let fileHandle;
  try {
    const [handle] = await window.showOpenFilePicker({
      types: [
        {
          description: "csv",
          accept: {
            "csv/*": [".csv"],
          },
        },
      ],
      excludeAcceptAllOption: true,
      multiple: false,
    });
    fileHandle = handle;
  } catch (error) {
    return;
  }

  const file = await fileHandle.getFile();

  const data = Object.values(rows).sort((a, b) => a.date < b.date);
  const matcher = new DateMatcher();
  const imageDates = data.map((d) => d.date);

  // Use a map to guarantee order
  const map = new Map(Object.entries(measurementMapping));

  Papa.parse(file, {
    complete: function (results) {
      if (results.data.length > 0) {
        const timestamps = results.data.map((r) => {
          if (r.length >= 2) {
            return dayjs(r[0] + " " + r[1], "MM/DD/YY HH:mm:ss").unix();
          }
          return null;
        });
        // Add extra columns to header row
        results.data[0].push(...map.values());
        results.data[0].push("Comment");

        const matchings = matcher.match(timestamps, imageDates);
        for (const { from, to, comment } of matchings) {
          const row = data[to];
          // Append all measurements and coment in correct order
          const values = [];
          for (const k of map.keys()) {
            values.push(row.data[k] || "");
          }
          values.push(comment || "");
          results.data[from].push(...values);
        }

        const csv = Papa.unparse(results.data);

        exportFile(csv);
      }
    },
  });
}

function exportFile(csv) {
  var exportedFilename = createGuid() + ".csv";

  var blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  var link = document.createElement("a");
  if (link.download !== undefined) {
    var url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", exportedFilename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
