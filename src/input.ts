export type InputData = SeriesInputData | GroupedInputData | StaticInputData

export interface DataElement {
  value: number
  timestamp: number
  metadata: unknown
}
export interface StaticInputData {
  type: 'static'
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
