import type { DataElement, GroupedInputData, InputData, SeriesInputData } from '../input'
import type { SingleOutput } from '../output'

export interface SingleCalculation {
  type: 'single'
  operation: 'sum' | 'avg' | 'max' | 'min' | 'count'
}

type Operation = SingleCalculation['operation']

export function calculateSingle(operation: Operation, data: InputData): SingleOutput {
  switch (data.type) {
    case 'series': return calculateSingleSeries(operation, data)
    case 'grouped' : return calculateSingleGrouped(operation, data)
    default: return {
      type: 'single',
      value: 0,
    }
  }
}

export function calculateSingleSeries(operation: Operation, data: SeriesInputData): SingleOutput {
  return {
    type: 'single',
    value: calculateSingleElement(operation, data.data),
  }
}

export function calculateSingleGrouped(operation: Operation, data: GroupedInputData): SingleOutput {
  const resultsIntermidiate: DataElement[] = data.data.map(d => ({
    timestamp: 0,
    value: calculateSingleElement(operation, d.data),
    metadata: {},
  }))

  const result = calculateSingleElement(operation, resultsIntermidiate)

  return {
    type: 'single',
    value: result,
  }
}

export function calculateSingleElement(operation: Operation, data: DataElement[]): number {
  switch (operation) {
    case 'sum': return calculateSum(data)
    case 'avg': return calculateAvg(data)
    case 'max': return calculateMax(data)
    case 'min': return calculateMin(data)
    case 'count': return data.length
    default: return 0
  }
}

function calculateSum(data: DataElement[]): number {
  return data.reduce((acc, d) => acc + d.value, 0)
}

function calculateAvg(data: DataElement[]): number {
  if (data.length === 0)
    return 0

  const s = data.reduce((acc, d) => acc + d.value, 0)
  if (s === 0)
    return 0

  return s / data.length
}

function calculateMax(data: DataElement[]): number {
  if (data.length === 0)
    return 0

  return Math.max(...data.map(d => d.value))
}

function calculateMin(data: DataElement[]): number {
  if (data.length === 0)
    return 0

  return Math.min(...data.map(d => d.value))
}
