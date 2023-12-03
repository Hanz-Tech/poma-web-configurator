/**
 * If you're not familiar with TypeScript code, just ignore the `<TYPE>` and `:TYPE` parts.
 */

type UsbDeviceFilter = {
  usbVendorId: number;
  usbProductId: number;
};

class SerialHandler {
  reader: ReadableStreamDefaultReader;
  writer: WritableStreamDefaultWriter;
  encoder = new TextEncoder();
  decoder = new TextDecoder();
  _port: SerialPort
  /**
   * Triggers the menu where the user will pick a device (it requires an user interaction to be triggered).
   * Opens the port selected by the user in the UI using a defined `baudRate`; this example uses a hard-coded value of 9600.
   * After opening the port, a `writer` and a `reader` are set; they will be used by the `write` and `read` methods respectively.
   */

  async init() : Promise<boolean> {

    if ('serial' in navigator) {
      try {
        const ports = (await navigator.serial.getPorts())
        .filter(p => {
            const info = p.getInfo();
            return info.usbVendorId === 0x16c0
        });
        if (ports.length >= 1) {
          this._port = ports[0]
        }

        if (!this._port) {
          this._port = await this._requestPort();
        }
        
        await this._port.open({ baudRate: 9600 }); // `baudRate` was `baudrate` in previous versions.
        if (this._port.writable != null) {
          this.writer = this._port.writable.getWriter();
        } else {
          throw Error("Port it not writable");
        }
        if (this._port.readable != null) {
          this.reader = this._port.readable.getReader();
        } else {
          throw Error("Port it not readable");
        }
        
        const signals = await  this._port.getSignals();
        console.log(signals);
        return true
      } catch(err) {
        console.error('There was an error opening the serial port:', err);
        return false
      }
    } else {
      console.error('Web serial doesn\'t seem to be enabled in your browser. Check https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API#browser_compatibility for more info.')
      return false
    }
  }

  /**
   * Takes a string of data, encodes it and then writes it using the `writer` attached to the serial port.
   * @param data - A string of data that will be sent to the Serial port.
   * @returns An empty promise after the message has been written.
   */
  async write(data: string): Promise<void> {
    const dataArrayBuffer = this.encoder.encode(data);
    return await this.writer.write(dataArrayBuffer);
  }

  /**
   * Gets data from the `reader`, decodes it and returns it inside a promise.
   * @returns A promise containing either the message from the `reader` or an error.
   */
  async read(): Promise<string> {
    try {
      const readerData = await this.reader.read();
      return this.decoder.decode(readerData.value);
    } catch (err) {
      const errorMessage = `error reading data: ${err}`;
      console.error(errorMessage);
      return errorMessage;
    }
  }

  async _requestPort(): Promise<SerialPort> {
    try {
        return await navigator.serial.requestPort({
            filters: [{
                usbVendorId: 0x16c0
            }]
        });
    } catch (err) {
          throw err;

    } 
  }
}

export const serialHandler = new SerialHandler();