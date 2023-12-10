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
  port: SerialPort
  textDecoder: TextDecoderStream  = new TextDecoderStream();
  textEncoder: TextEncoderStream = new TextEncoderStream();
  readableStreamClosed: Promise<void>
  writableStreamClosed: Promise<void>

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
          this.port = ports[0]
        }

        if (!this.port) {
          this.port = await this._requestPort();
        }
        
        await this.port.open({ baudRate: 115200 }); // `baudRate` was `baudrate` in previous versions.
        if (this.port.writable != null) {
          this.writableStreamClosed = this.textEncoder.readable.pipeTo(this.port.writable);
          this.writer = this.textEncoder.writable.getWriter();
        } else {
          throw Error("Port it not writable");
        }
        if (this.port.readable != null) {
          this.readableStreamClosed = this.port.readable.pipeTo(this.textDecoder.writable);
          this.reader = this.textDecoder.readable.getReader();
        } else {
          throw Error("Port it not readable");
        }
        
        const signals = await  this.port.getSignals();
        console.log(signals);

        return true
      } catch(err) {
        console.error('There was an error opening the serial port:', err);
        throw err;
        return false
      }

      
      
    } else {
      console.error('Web serial doesn\'t seem to be enabled in your browser. Check https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API#browser_compatibility for more info.')
      alert('Web serial doesn\'t seem to be enabled in your browser. Check https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API#browser_compatibility for more info.')
      return false
    }
  }

  /**
   * Takes a string of data, encodes it and then writes it using the `writer` attached to the serial port.
   * @param data - A string of data that will be sent to the Serial port.
   * @returns An empty promise after the message has been written.
   */ 
  async write(data: string): Promise<void> {
    return await this.writer.write(data);
  }

  /**
   * Gets data from the `reader`, decodes it and returns it inside a promise.
   * @returns A promise containing either the message from the `reader` or an error.
   */

  
  async read(): Promise<string> {
    let completeMessage = ""
    while (true) {
      const { value, done } = await this.reader.read();
      if (done) {
        // Allow the serial port to be closed later.
        this.reader.releaseLock();
        break;
        
      }
      // value is a string.
      completeMessage += value
      if (tryParseJSONObject(completeMessage)){
        
        break;
      }
    }
    return completeMessage
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

/**
 * If you don't care about primitives and only objects then this function
 * is for you, otherwise look elsewhere.
 * This function will return `false` for any valid json primitive.
 * EG, 'true' -> false
 *     '123' -> false
 *     'null' -> false
 *     '"I'm a string"' -> false
 */
function tryParseJSONObject (jsonString: string) : Boolean {
  try {
      var o = JSON.parse(jsonString);

      // Handle non-exception-throwing cases:
      // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
      // but... JSON.parse(null) returns null, and typeof null === "object", 
      // so we must check for that, too. Thankfully, null is falsey, so this suffices:
      if (o && typeof o === "object") {
          return o;
      }
  }
  catch (e) { }

  return false;
};

export const serialHandler = new SerialHandler();