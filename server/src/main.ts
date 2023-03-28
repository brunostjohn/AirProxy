import 'dotenv/config'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import * as mdns from 'mdns-js'
import { mDnsData } from './mdnsInterfaces.js'

const nodePath = resolve(process.argv[1])
const modulePath = resolve(fileURLToPath(import.meta.url))
const isCLI = nodePath === modulePath

export default function main() {
  if (isCLI) {
    const browser = mdns.createBrowser(mdns.tcp('raop'))
    browser.on('ready', () => {
      browser.discover()
    })
    browser.on('update', (data: mDnsData) => {
      console.log('data: ', data)
    })
    setTimeout(() => {
      browser.stop()
    }, 300)
  }
}

if (isCLI) {
  main()
}
