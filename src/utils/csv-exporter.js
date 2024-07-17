import * as dayjs from "dayjs";
import Papa from "papaparse";
import DateMatcher from "./date-matcher.js";
import { createGuid } from "./guid.js";

export function exportToCsv(rows) {
  const data = rows.sort((a, b) => a.unix < b.unix);
  const csv = Papa.unparse(data);

  exportFile(csv);
}

export async function matchAndExportToCsv(rows, measurementMapping) {
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
  const data = rows.sort((a, b) => a.unix < b.unix);
  const matcher = new DateMatcher();
  const imageDates = data.map((d) => d.unix);

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
          for (const k of map.values()) {
            values.push(row[k] || "");
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
