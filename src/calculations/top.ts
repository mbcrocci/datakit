import type {
  DataElement,
  GroupedInputData,
  InputData,
  SeriesInputData,
} from '../input'

import type { TopOutput } from '../output'

type CompareFn = (a: DataElement, b: DataElement) => number

export interface TopCalculation {
  type: 'top'
  // default "asc"
  order?: 'asc' | 'desc'
  // default top 3
  size?: number
  compareFn?: CompareFn
}

const defaultCompareFn = (a: DataElement, b: DataElement) => a.value - b.value

export function calculateTop(
  calculation: TopCalculation,
  data: InputData,
): TopOutput {
  switch (data.type) {
    case 'series':
      return calculateTopSeries(calculation, data)
    case 'grouped':
      return calculateTopGrouped(calculation, data)
    default:
      return {
        type: 'top',
        values: [],
        metadata: [],
      }
  }
}

export function calculateTopSeries(
  calculation: TopCalculation,
  data: SeriesInputData,
): TopOutput {
  return calculateTopElement(calculation, data.data)
}

export function calculateTopGrouped(
  _calculation: TopCalculation,
  _data: GroupedInputData,
): TopOutput {
  return {
    type: 'top',
    values: [],
    metadata: [],
  }
}

function calculateTopElement(
  calculation: TopCalculation,
  data: DataElement[],
): TopOutput {
  const sortedElements = sortElements(
    data,
    calculation.order ?? 'asc',
    calculation.compareFn ?? defaultCompareFn,
  )
  const topN = sortedElements.slice(0, calculation.size ?? 3)

  return {
    type: 'top',
    values: topN.map(e => e.value),
    metadata: topN.map(e => e.metadata),
  }
}

function sortElements(
  data: DataElement[],
  order: 'asc' | 'desc',
  compareFn: CompareFn,
): DataElement[] {
  const sorted = data.sort(compareFn)

  return order === 'asc' ? sorted : sorted.reverse()
}
