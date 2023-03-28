import 'dotenv/config'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { Worker } from 'worker_threads'
import { DeviceUpdatePayload, DiscoveryAgentMessage } from './interfaces/discoveryAgent.js'
import { PersistentStorage } from './interfaces/persistentStorage.js'
import { readFileSync, writeFileSync } from 'fs'
import { Endpoint, EndpointMap } from './interfaces/endpoint.js'
import { inspect } from 'util'

const nodePath = resolve(process.argv[1])
const modulePath = resolve(fileURLToPath(import.meta.url))
const isCLI = nodePath === modulePath
let persistentStorage: PersistentStorage
const unknownDevices: Array<Endpoint> = []

function spawnDiscovery() {
  const discoveryAgent = new Worker('./dist/device-discovery/discovery.js', { workerData: persistentStorage })
  return discoveryAgent
}

function readPersistent() {
  try {
    persistentStorage = JSON.parse(readFileSync('./persistent.json').toString())
  } catch {
    const emptyStorage: PersistentStorage = {
      selectedEndpoints: [],
    }
    writeFileSync('./persistent.json', JSON.stringify(emptyStorage))
    persistentStorage = JSON.parse(readFileSync('./persistent.json').toString())
  }
  if (persistentStorage == undefined) {
    persistentStorage = {
      selectedEndpoints: [],
    }
  }
  console.log(
    persistentStorage.selectedEndpoints.length > 0
      ? `Loaded saved devices.\n${inspect(persistentStorage.selectedEndpoints, false, null, true)}`
      : `No saved devices found.`,
  )
}

function handleUpdate(updateContent: DeviceUpdatePayload) {
  updateContent.unknown.forEach((endpoint: Endpoint) => {
    appendUnknown(endpoint)
  })
}

function appendUnknown(endpoint: Endpoint) {
  const attemptToFind = unknownDevices.findIndex((element: Endpoint) => {
    if ((element.map as EndpointMap).address === (endpoint.map as EndpointMap).address) return true
    return false
  })
  if (attemptToFind == -1) {
    console.log(`Found new device.\n${inspect(endpoint, false, null, true)}`)
    unknownDevices.push(endpoint)
  } else {
    const old = unknownDevices[attemptToFind]
    if (
      (old.map as EndpointMap).ip != (endpoint.map as EndpointMap).ip ||
      (old.map as EndpointMap).port != (endpoint.map as EndpointMap).port
    ) {
      console.log(
        `IP or port of device ${old.name} changed.\nOld ip: ${(old.map as EndpointMap).ip}\nNew ip:${
          (endpoint.map as EndpointMap).ip
        }\nUpdating...`,
      )
      ;(unknownDevices[attemptToFind].map as EndpointMap).ip = (endpoint.map as EndpointMap).ip
      ;(unknownDevices[attemptToFind].map as EndpointMap).port = (endpoint.map as EndpointMap).port
    }
  }
}

export default function main() {
  if (isCLI) {
    readPersistent()
    const discoveryThread = spawnDiscovery()
    discoveryThread.on('message', (message: DiscoveryAgentMessage) => {
      if (message.type === 'init') {
        console.log('Discovery agent has started successfully.')
      }
      if (message.type === 'update') handleUpdate(message.payload as DeviceUpdatePayload)
    })
  }
}

if (isCLI) {
  main()
}
