export default class JsonAccessApi {
  constructor() {
    this.images = {};
  }

  async storeJson(json) {
    let fileHandle;
    try {
      fileHandle = await window.showSaveFilePicker({
        types: [
          {
            description: "json",
            accept: {
              "json/*": [".json"],
            },
          },
        ],
        excludeAcceptAllOption: true,
      });
    } catch (error) {
      return;
    }

    if (!fileHandle) {
      return;
    }

    const writable = await fileHandle.createWritable();
    await writable.write(json);
    await writable.close();
  }

  async loadJson() {
    let fileHandle;
    try {
      const [handle] = await window.showOpenFilePicker({
        types: [
          {
            description: "json",
            accept: {
              "json/*": [".json"],
            },
          },
        ],
        excludeAcceptAllOption: true,
        multiple: false,
      });
      fileHandle = handle;
    } catch (error) {
      return null;
    }

    if (!fileHandle) {
      return null;
    }

    const fileData = await fileHandle.getFile();
    const jsonText = await fileData.text();

    await window.imageApi.openDialog();
    return jsonText;
  }
}
