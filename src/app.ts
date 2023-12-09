import { serialHandler } from './serial-handler';
import { defaultConfig } from './default';
import {validateConfig} from './validator'
import { compareJSONObjects, parseCFGFile } from './helper';
/**
 * UI specific code
 * This code is only meant to handle the elements and interactions in this example.
 * For the actual Web Serial API code, check `./src/serial-handler.ts`.
 * If you're not familiar with TypeScript code, just ignore the `<TYPE>` and `:TYPE` parts.
 */


interface configMap {
  [id: string]: number;
}

//The serialOutData contains the eeprom address and value in a json format
interface serialOutData {
  [id: string]: any;
}
class App {
  connectButtonElem = <HTMLButtonElement>document.getElementById('connect-to-serial')!;
  readFromPoButton = <HTMLButtonElement>document.getElementById('read-from-po-button')!;
  saveToPoButton = <HTMLButtonElement>document.getElementById('save-to-po-button')!;
  loadConfigFileButton = <HTMLButtonElement>document.getElementById('load-config-button')!;
  // copyConfigButton = <HTMLButtonElement>document.getElementById('copy-config-button')!;
  fileInput = document.getElementById('fileInput') as HTMLInputElement;
  exportConfigFileButton = <HTMLButtonElement>document.getElementById('export-config-button')!;
  actionButtons = document.querySelectorAll<HTMLButtonElement>('.action-buttons')!;
  messageInput = <HTMLInputElement>document.getElementById('message-input')!;
  submitButton = <HTMLElement>document.getElementById('submit-button')!;
  serialMessagesContainer = <HTMLOListElement>document.getElementById('logs-container')!;
  currentDeviceConfig: configMap = defaultConfig;
  newDeviceConfig : configMap = defaultConfig
  isInit: boolean = false
  isConnected: boolean = false
  constructor() {
    this.connectButtonElem.addEventListener('pointerdown', async () => {
      try {
        this.isInit = await serialHandler.init();
        (this.readFromPoButton as HTMLButtonElement).removeAttribute('disabled');
        // this.updateConfigWebpage(this.currentConfig);
        (this.connectButtonElem as HTMLButtonElement).setAttribute('disabled', "true")
        this.printToLogs("Connected to Device")
        this.isConnected = true
      } catch (err){
        alert("Failed to open serial port. Make sure it's not in use by another program");
      }

    })
    this.fileInput.addEventListener('change', (event) => {
      const files = (event.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        const file = files[0];
        const reader = new FileReader();
  
        reader.onload = (e: ProgressEvent<FileReader>) => {
          try {
            // Assuming the file contains JSON
            const text = e.target?.result as string;
            let loadedConfig: configMap = {}
            if(file.name.endsWith('.json')) {
              loadedConfig = JSON.parse(text);
            }
            else if (file.name.endsWith('.cfg')) {
                loadedConfig = parseCFGFile(text)
            }
            if(validateConfig(loadedConfig)){
              this.updateConfigWebpage(loadedConfig, '_new')
              this.printToLogs("JSON File loaded");
              (this.saveToPoButton as HTMLButtonElement).removeAttribute('disabled');
            } else {
              this.printToLogs('Error validating config file:' + JSON.stringify(validateConfig.errors));
              alert(`Error: Invalid config file`);
            }

          } catch (error) {
            this.printToLogs('Error parsing file:' + JSON.stringify(error));
            alert(`Error: Invalid config file`);
          }
        };
  
        reader.onerror = (e) => {
           this.printToLogs('Error reading file: ' + e);
        };
  
        reader.readAsText(file); // Read the file as text
      }
    });
  }


    run() {    
    //Read From Device
    this.readFromPoButton.addEventListener('pointerdown', async () => {
      await this.readAll()
      this.updateConfigWebpage(this.currentDeviceConfig, "_new");
      this.printToLogs("Config Copied");
      (this.saveToPoButton as HTMLButtonElement).removeAttribute('disabled');
    });

    //Save to device
    this.saveToPoButton.addEventListener('pointerdown', async () => {
      this.newDeviceConfig = this.fetchConfigWebpage(defaultConfig);
      const valuesToSave = compareJSONObjects(this.currentDeviceConfig,this.newDeviceConfig)
      // let data : serialOutData = {}
      // for (const k in valuesToSave) {
      //   if (valuesToSave.hasOwnProperty(k)) {
      //     // Use k to get the corresponding EEPROM address
      //     const address: number = eepromAddresses[k];
      //     // Check if the address is defined in the eepromAddresses mapping
      //     if (address !== undefined) {
      //       // Now you have the setting key, value, and corresponding EEPROM address
      //       const addressString = address.toString();
      //       data[addressString] = valuesToSave[k]
      //     } else {
      //       this.printToLogs(`WARNING : EEPROM address for setting "${k}" not found.`);
      //     }
      //   }
      // }
      const command = {
        command: "SAVEALL",
        data: valuesToSave
        }
      await serialHandler.write(JSON.stringify(command));
      await this.getSerialMessage();
      await this.readAll();
    });

    //Load File
    this.loadConfigFileButton.addEventListener('pointerdown', async () => {
      this.fileInput.click(); // Simulate click on the hidden file input when the button is clicked
    })

    //Export File
    this.exportConfigFileButton.addEventListener('pointerdown', async () => {
      this.downloadJson(this.currentDeviceConfig, "config.json")
    })

    //Copy Config
    // this.copyConfigButton.addEventListener('pointerdown', async () => {
    //   this.updateConfigWebpage(this.currentDeviceConfig, "_new");
    //   this.printToLogs("Config Copied");
    //   (this.saveToPoButton as HTMLButtonElement).removeAttribute('disabled');
    // })
  }

  /**
  Show the config on the webpage
 */
  async updateConfigWebpage(config : configMap, type : string) {
    Object.keys(config).forEach(id => {
      const inputElement = document.getElementById(id + type) as HTMLInputElement | null;
      if (inputElement) {
          //for <span> values
          if (type === "_old"){
            inputElement.textContent = config[id].toString();
          } else {
            inputElement.value = config[id].toString();
          }

      } 
    });
  }

  /**
  Fetch the new config from the webpage
 */
  fetchConfigWebpage(config : configMap) : configMap {
    const configCopy = { ...config };
    Object.keys(configCopy).forEach(id => {
      const inputElement = document.getElementById(id + "_new") as HTMLInputElement | null;
      if (inputElement) {
        const inputInt = parseInt(inputElement.value)
        configCopy[id] = inputInt
      } 
    });
    if(!validateConfig(configCopy)){
      alert('Error: Invalid config, check logs for details');
      this.printToLogs('Error validating config:' + JSON.stringify(validateConfig.errors));
      return this.currentDeviceConfig 
    }
    return configCopy
  }

  timeout(delay: number) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(new Error('Operation timed out'));
        }, delay);
    });
  }

  async readWithTimeout(serialHandler: any, timeoutDuration: number): Promise<string> {
    try {
        // Promise.race will resolve or reject with the value from the first promise that resolves or rejects
        const response = await Promise.race([
            serialHandler.read(),
            this.timeout(timeoutDuration)
        ]);
        return response;
    } catch (error: any) {
        this.printToLogs(error.message);
        // Handle timeout or other errors
        throw error; // Rethrow if you want to handle it further up the call stack
    }
}

  //Read config values from device
  async readAll(){
    const command = {
      command: "READALL",
      data : {}
    };
    await serialHandler.write(JSON.stringify(command));
    const response = await this.readWithTimeout(serialHandler, 10000)
    const loadedConfig: configMap = JSON.parse(response)
    if(validateConfig(loadedConfig)){
      this.currentDeviceConfig = loadedConfig
      this.updateConfigWebpage(this.currentDeviceConfig, "_old");
      this.printToLogs("Config Read From Device");
      (this.loadConfigFileButton as HTMLButtonElement).removeAttribute('disabled');
      (this.exportConfigFileButton as HTMLButtonElement).removeAttribute('disabled');
      // (this.copyConfigButton as HTMLButtonElement).removeAttribute('disabled');
    } else {
      this.printToLogs('Error validating JSON:' + JSON.stringify(validateConfig.errors));
    }
  }

  downloadJson(jsonData: any, fileName: string): void {
    // Convert JSON data to string
    const jsonString = JSON.stringify(jsonData,null,2);
    console.log(jsonString)
  
    // Create a Blob from the JSON string
    const blob = new Blob([jsonString], { type: 'application/json' });
  
    // Create a link element
    const link = document.createElement('a');
  
    // Set link's href to point to the Blob
    link.href = URL.createObjectURL(blob);
  
    // Set the download attribute to the desired file name
    link.download = fileName;
  
    // Append link to the body
    document.body.appendChild(link);
  
    // Dispatch click event on the link
    // This is what triggers the file download
    link.click();
  
    // Clean up and remove the link
    link.parentNode!.removeChild(link);
  }

  async getSerialMessage() {
    const now = new Date();
    const listElement = document.createElement('li');
    const message = await serialHandler.read()
    listElement.innerText = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}.${now.getMilliseconds()}: ${message}`;
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