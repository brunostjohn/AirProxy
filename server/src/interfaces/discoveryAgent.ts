import { Endpoint } from './endpoint.js'

export interface DiscoveryAgentMessage {
  type: 'init' | 'update' | 'error' | 'exit'
  payload?: object
}

export interface DeviceUpdatePayload {
  selected: Array<Endpoint>
  unknown: Array<Endpoint>
}
