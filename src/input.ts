export type InputData = SeriesInputData | GroupedInputData

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
