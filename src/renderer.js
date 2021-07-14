import './index.css';
import './app.jsx';

const { ipcRenderer } = window.require('electron');

window.openDialog = () => {
    return ipcRenderer.invoke( 'app:on-fs-dialog-open' );
}

window.getImage = (imgPath) => {
    return ipcRenderer.invoke( 'app:on-fs-image-open', imgPath);
}
