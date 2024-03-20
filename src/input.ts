export type InputData = SeriesInputData | GroupedInputData | SimpleInputData

export interface DataElement {
  value: number
  valueLeft?: number
  valueRight?: number
  valueDivisor?: number
  timestamp: number
  metadata: unknown
}

export interface SimpleInputData {
  type: 'simple'
  data: DataElement
}

export interface SeriesInputData {
  type: 'series'
  data: DataElement[]
}

export interface GroupedInputData {
  type: 'grouped'
  data: {
    key: string
    data: DataElement[]
  }[]
}
