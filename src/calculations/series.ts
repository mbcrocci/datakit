import type {
  DataElement,
  GroupedInputData,
  InputData,
  SeriesInputData,
} from '../input'
import type { OutputData, SeriesOutput } from '../output'

export interface SeriesCalculation {
  type: 'series'
  operation?: 'sum'
}

type Operation = SeriesCalculation['operation']

export function calculateSeries(
  operation: Operation,
  data: InputData,
): OutputData {
  switch (data.type) {
    case 'series':
      return calculateSeriesSeries(operation, data)
    case 'grouped':
      return calculateSeriesGrouped(operation, data)
    default:
      return {} as OutputData
  }
}

function calculateSeriesSeries(
  operation: Operation,
  data: SeriesInputData,
): OutputData {
  return calculateSeriesElement(operation, data.data)
}

function calculateSeriesGrouped(
  operation: Operation,
  data: GroupedInputData,
): OutputData {
  return {
    type: 'multi-series',
    series: data.data.map(d => ({
      key: d.key,
      values: calculateSeriesElement(operation, d.data),
    })),
  }
}

export function calculateSeriesElement(
  operation: Operation,
  data: DataElement[],
): SeriesOutput {
  switch (operation) {
    case 'sum':
      return calculateSeriesElementSum(data)
    default:
      return calculateSeriesElementNone(data)
  }
}

function calculateSeriesElementNone(data: DataElement[]): SeriesOutput {
  const values = data.map(d => d.value)

  return {
    type: 'series',
    values,
    metadata: [], // TODO:
  }
}

function calculateSeriesElementSum(data: DataElement[]): SeriesOutput {
  const values = []
  let prev = 0

  for (const d of data) {
    prev += d.value
    values.push(prev)
  }

  return {
    type: 'series',
    values,
    metadata: [], // TODO:
  }
}
