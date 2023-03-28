import { mDnsData } from './interfaces/mdns.js'
import * as mdns from 'mdns-js'
import { parentPort, workerData } from 'worker_threads'
import { DiscoveryAgentMessage } from '../interfaces/discoveryAgent.js'
import { PersistentStorage } from '../interfaces/persistentStorage.js'
import { Endpoint, EndpointMap } from '../interfaces/endpoint.js'

const initSuccess: DiscoveryAgentMessage = {
  type: 'init',
}

let persistent: PersistentStorage
const unknownArr: Array<Endpoint> = []

function parseData(data: mDnsData) {
  if (
    data.type[0].name != 'raop' ||
    data.type[0].protocol != 'tcp' ||
    data.type[0].description != 'AirTunes Remote Audio'
  )
    return undefined
  const map: EndpointMap = {
    address: data.host,
    ip: data.addresses[0],
    port: data.port,
  }
  const parsed: Endpoint = {
    name: data.host?.slice(0, -6).split('-').join(' '),
    map: map,
  }
  return parsed
}

function updateComposites(compositeEndpoint: Endpoint) {
  let ret = false
  if (!('address' in compositeEndpoint.map)) return
  persistent.selectedEndpoints.forEach((element: Endpoint) => {
    if ('address' in element.map) return
    element.map.forEach((subEndpoint: Endpoint) => {
      if (!('address' in subEndpoint.map) || !('address' in compositeEndpoint.map)) return
      if (subEndpoint.map.address === compositeEndpoint.map.address) {
        subEndpoint.map.ip = compositeEndpoint.map.ip
        subEndpoint.map.port = compositeEndpoint.map.port
        ret = true

        const attemptToFind = unknownArr.findIndex((element: Endpoint) => {
          if (element === compositeEndpoint) return true
          return false
        })
        if (attemptToFind != -1) {
          unknownArr.splice(attemptToFind, 1)
        }
      }
    })
  })
  return ret
}

function updateData(endpoint: Endpoint) {
  const found = persistent.selectedEndpoints.findIndex((element: Endpoint) => {
    if (!('address' in element.map) || !('address' in endpoint.map)) return false
    if (element.map.address === endpoint.map.address) return true
    return false
  })
  if (found === -1) return updateComposites(endpoint)
  if (!('address' in endpoint.map)) return
  if ((persistent.selectedEndpoints[found].map as EndpointMap).address === endpoint.map.address) {
    // eslint-disable-next-line @typescript-eslint/no-extra-semi
    ;(persistent.selectedEndpoints[found].map as EndpointMap).ip = endpoint.map.ip
    ;(persistent.selectedEndpoints[found].map as EndpointMap).port = endpoint.map.port
    const attemptToFind = unknownArr.findIndex((element: Endpoint) => {
      if (element === endpoint) return true
      return false
    })
    if (attemptToFind != -1) {
      unknownArr.splice(attemptToFind, 1)
    }
  }
  return true
}

function shipUpdate() {
  const updateMessage: DiscoveryAgentMessage = {
    type: 'update',
    payload: {
      selected: persistent.selectedEndpoints,
      unknown: unknownArr == undefined ? [] : unknownArr,
    },
  }
  parentPort?.postMessage(updateMessage)
}

const browser = mdns.createBrowser(mdns.tcp('raop'))

browser.on('ready', () => {
  parentPort?.postMessage(initSuccess)
  persistent = workerData
  browser.discover()
})

function appendUnknown(endpoint: Endpoint) {
  const attemptToFind = unknownArr.findIndex((element: Endpoint) => {
    if ((element.map as EndpointMap).address === (endpoint.map as EndpointMap).address) return true
    return false
  })
  if (attemptToFind == -1) {
    unknownArr.push(endpoint)
  } else {
    unknownArr.splice(attemptToFind, 1)
    unknownArr.push(endpoint)
  }
}

browser.on('update', (data: mDnsData) => {
  const parsed: Endpoint | undefined = parseData(data)
  if (parsed != undefined && updateData(parsed) === false) appendUnknown(parsed)
  shipUpdate()
})
