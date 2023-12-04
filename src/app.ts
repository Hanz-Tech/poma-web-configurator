import { serialHandler } from './serial-handler.js';
import { eepromAddresses, defaultConfig } from './default.js';
/**
 * UI specific code
 * This code is only meant to handle the elements and interactions in this example.
 * For the actual Web Serial API code, check `./src/serial-handler.ts`.
 * If you're not familiar with TypeScript code, just ignore the `<TYPE>` and `:TYPE` parts.
 */
interface configMap {
  [id: string]: string;
}
class App {
  connectButtonElem = <HTMLButtonElement>document.getElementById('connect-to-serial')!;
  readFromPoButton = <HTMLButtonElement>document.getElementById('read-from-po-button')!;
  saveToPoButton = <HTMLButtonElement>document.getElementById('save-to-po-button')!;
  loadConfigFileButton = <HTMLButtonElement>document.getElementById('load-config-button')!;
  fileInput = document.getElementById('fileInput') as HTMLInputElement;
  exportConfigFileButton = <HTMLButtonElement>document.getElementById('export-config-button')!;
  actionButtons = document.querySelectorAll<HTMLButtonElement>('.action-buttons')!;
  messageInput = <HTMLInputElement>document.getElementById('message-input')!;
  submitButton = <HTMLElement>document.getElementById('submit-button')!;
  serialMessagesContainer = <HTMLOListElement>document.getElementById('serial-messages-container')!;
  currentDeviceConfig: configMap = defaultConfig;
  newDeviceConfig : configMap = defaultConfig
  isInit: boolean = false
  isConnected: boolean = false
  constructor() {
    this.connectButtonElem.addEventListener('pointerdown', async () => {
      this.isInit = await serialHandler.init();
      (this.readFromPoButton as HTMLButtonElement).removeAttribute('disabled');
      // this.showConfigJSON(this.currentConfig);
      (this.connectButtonElem as HTMLButtonElement).setAttribute('disabled', "true")
      this.printToLogs("Connected to Device")
      this.isConnected = true
    })
    this.fileInput.addEventListener('change', (event) => {
      console.log("here")
      const files = (event.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        const file = files[0];
        const reader = new FileReader();
  
        reader.onload = (e: ProgressEvent<FileReader>) => {
          try {
            // Assuming the file contains JSON
            const text = e.target?.result as string;
            const json = JSON.parse(text);
            this.showConfigJSON(json, '_new')
            this.printToLogs("JSON File loaded")
          } catch (error) {
            this.printToLogs('Error parsing JSON:' + error);
          }
        };
  
        reader.onerror = (e) => {
          console.error('Error reading file:', e);
        };
  
        reader.readAsText(file); // Read the file as text
      }
    });
  }


    run() {    
    //Read From Device
    this.readFromPoButton.addEventListener('pointerdown', async () => {
      await serialHandler.write(String("READALL"));
      const response = await serialHandler.read();
      this.currentDeviceConfig = JSON.parse(response)
      this.showConfigJSON(this.currentDeviceConfig, "_old");
      this.printToLogs("Config Read From Device");
      (this.saveToPoButton as HTMLButtonElement).removeAttribute('disabled');
    });

    //Save to device
    this.saveToPoButton.addEventListener('pointerdown', async () => {
      await serialHandler.write(String("SAVEALL"));
      this.getSerialMessage();
    });

    //Load File
    this.loadConfigFileButton.addEventListener('pointerdown', async () => {
      this.fileInput.click(); // Simulate click on the hidden file input when the button is clicked
    })
  }

  /**
  Show the new config on the webpage
 */
  showConfigJSON(config : configMap, type : string) {
    Object.keys(config).forEach(id => {
      const inputElement = document.getElementById(id + type) as HTMLInputElement | null;
      if (inputElement) {
          //for <span> values
          if (type === "_old"){
            inputElement.textContent = config[id];
          } else {
            inputElement.value = config[id];
          }

      } 
    });
  }

  async getSerialMessage() {
    const now = new Date();
    const listElement = document.createElement('li');
    console.log("before")
    const message = await serialHandler.read()
    console.log("after")
    console.log(message)
    listElement.innerText = `Message received at ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}.${now.getMilliseconds()}: ${message}`;
    this.serialMessagesContainer.appendChild(listElement);
  }

  printToLogs(message: string) {
    const now = new Date();
    const listElement = document.createElement('li');
    listElement.innerText = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}.${now.getMilliseconds()}: ${message}`;
    this.serialMessagesContainer.appendChild(listElement);
  }
}


document.addEventListener('DOMContentLoaded', () => {
  const app =  new App();
  app.run()
});