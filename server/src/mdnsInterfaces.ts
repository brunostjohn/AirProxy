export interface mDnsData {
  addresses: Array<string>
  query: Array<string>
  type: Array<mDnsDataType>
  port: number
  fullname: string
  txt: Array<string>
  host: string
  interfaceIndex: 1
  networkInterface: string
}

export interface mDnsDataType {
  name: string
  protocol: string
  subtypes: Array<unknown>
  description: string
}
