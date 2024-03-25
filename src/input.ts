export type InputData = SeriesInputData | GroupedInputData | ReferenceInputData

export interface DataElement {
  value: number
  timestamp: number
  metadata: unknown
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

export interface ReferenceInputData {
  type: 'reference'
  key: string
  data: DataElement
}
