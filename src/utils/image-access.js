

export default class ImageAccessApi {
    constructor() {
        this.images = {};
    }

    async openDialog() {
        this.images = {};
        const dirHandle = await window.showDirectoryPicker();
        const data = [];
        for await (const [key, value] of dirHandle.entries()) {
            if (value.kind != "file" || !(key.toLowerCase().includes('jpg') || key.toLowerCase().includes('jpeg'))) {
                continue;
            }
            const fileData = await value.getFile();
            this.images[fileData.name] = fileData;
            data.push({
                path: fileData.name,
                date: fileData.lastModified,
            });
        }
        return data;
    }

    async getImage(name) {
        const image = this.images[name];
        const data = await image.arrayBuffer();
        return new Uint8Array(data);
    }
}