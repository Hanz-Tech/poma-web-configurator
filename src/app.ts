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

class WebSerialDemoApp {
  connectButtonElem = <HTMLButtonElement>document.getElementById('connect-to-serial')!;
  readAllButtonElem = <HTMLButtonElement>document.getElementById('connect-to-serial')!;
  actionButtons = document.querySelectorAll<HTMLButtonElement>('action-buttons')!;
  messageInput = <HTMLInputElement>document.getElementById('message-input')!;
  submitButton = <HTMLElement>document.getElementById('submit-button')!;
  serialMessagesContainer = <HTMLOListElement>document.getElementById('serial-messages-container')!;
  config: configMap = defaultConfig;

  constructor() {
    this.connectButtonElem.addEventListener('pointerdown', async () => {
      const isInit = await serialHandler.init();
      if (isInit) {
        console.log(this.actionButtons)
        this.actionButtons.forEach((button: HTMLButtonElement) => {
            button.removeAttribute('disabled');
        });
        // Assign default values
        Object.keys(this.config).forEach(id => {
          const inputElement = document.getElementById(id) as HTMLInputElement;
          if (inputElement) {
            inputElement.value = this.config[id];
          }
        });
      }
    })

    this.actionButtons.forEach((button: HTMLButtonElement) => {
      button.addEventListener('pointerdown', () => {
        serialHandler.write(String(button.dataset.value));
        this.getSerialMessage();
      })
    })
  }
  
  async getSerialMessage() {
    const now = new Date();
    const listElement = document.createElement('li');

    listElement.innerText = `Message received at ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}.${now.getMilliseconds()}: ${await serialHandler.read()}`;
    this.serialMessagesContainer.appendChild(listElement);
  }
}

new WebSerialDemoApp();