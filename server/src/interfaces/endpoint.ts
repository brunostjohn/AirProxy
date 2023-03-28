export interface Endpoint {
  name: string
  map: EndpointMap | Array<Endpoint>
  composite?: boolean
  memberOf?: Endpoint
}

export interface EndpointMap {
  address: string
  ip: string
  port: number
}
