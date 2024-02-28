export interface SingleOutput {
  type: 'single'
  value: number
}

export interface SeriesOutput {
  type: 'series'
  values: number[]
  metadata: unknown[]
}

export interface TopOutput {
  type: 'top'
  values: number[]
}

export interface TableOutput {
  type: 'table'
  column: string
  value: number
  key: string
}

export type OutputData = SingleOutput | SeriesOutput | TopOutput | TableOutput
