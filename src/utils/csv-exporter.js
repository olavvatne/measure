import * as dayjs from "dayjs";
import Papa from "papaparse";
import DateMatcher from "./date-matcher.js";
import { createGuid } from "./guid.js";

export function exportToCsv(rows) {
  const data = Object.values(rows)
    .sort((a, b) => a.date < b.date)
    .map((row) => {
      var m = dayjs.unix(row.date);
      return {
        date: m.format("MM/DD/YY"),
        time: m.format("HH:mm:ss"),
        unix: row.date,
        og: row.values.og || "",
        ow: row.values.ow || "",
      };
    });

  const csv = Papa.unparse(data);

  exportFile(csv);
}

export async function matchAndExportToCsv(rows) {
  const [fileHandle] = await window.showOpenFilePicker({
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
  const file = await fileHandle.getFile();

  const data = Object.values(rows)
    .filter((img) => {
      return Object.keys(img.values).length > 0;
    })
    .sort((a, b) => a.date < b.date);
  const matcher = new DateMatcher();
  Papa.parse(file, {
    complete: function (results) {
      if (results.data.length > 0) {
        const timestamps = results.data.map((r) => {
          if (r.length == 2) {
            return dayjs(r[0] + " " + r[1], "MM/DD/YY HH:mm:ss").unix();
          }
          return null;
        });
        const imageDates = data.map((d) => d.date);
        const matchings = matcher.match(timestamps, imageDates);
        for (let i = 0; i < matchings.length; i++) {
          const { from, to, comment } = matchings[i];
          const image = data[to];
          const values = [image.values.og, image.values.ow];
          if (comment) {
            values.push.comment;
          }
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
