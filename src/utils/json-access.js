

export default class JsonAccessApi {
    constructor() {
        this.images = {};
    }

    async storeJson(json) {
        const fileHandle = await window.showSaveFilePicker({
            types: [
                {
                    description: 'json',
                    accept: {
                        'json/*': ['.json']
                    }
                },
            ],
            excludeAcceptAllOption: true,
        });
        
        if (!fileHandle) {
            return;
        }

        const writable = await fileHandle.createWritable();
        await writable.write(json);
        await writable.close();
    }

    async loadJson() {
        const [fileHandle] = await window.showOpenFilePicker({
            types: [
                {
                    description: 'json',
                    accept: {
                        'json/*': ['.json']
                    }
                },
            ],
            excludeAcceptAllOption: true,
            multiple: false
        });

        if (!fileHandle) {
            return;
        }

        const fileData = await fileHandle.getFile();
        const jsonText = await fileData.text();
        
        await window.imageApi.openDialog()
        return jsonText;
    }
}