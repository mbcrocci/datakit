export interface StaticOutput {
  type: 'static'
  value: number
}

export interface SingleOutput {
  type: 'single'
  value: number
}

export interface SeriesOutput {
  type: 'series'
  values: number[]
  metadata: unknown[]
}

export interface MultiSeriesOutput {
  type: 'multi-series'
  series: {
    key: string
    values: SeriesOutput
  }[]
}

export interface TopOutput {
  type: 'top'
  values: number[]
  metadata: unknown[]
}

export interface TableOutput {
  type: 'table'
  value: number
  columnKey: string
  rowKey: string
}

export type OutputData = SingleOutput | SeriesOutput | MultiSeriesOutput | TopOutput | TableOutput | StaticOutput
