import type { DataElement, GroupedInputData, InputData, SeriesInputData, SimpleInputData } from '../input'
import type { SingleOutput } from '../output'

export interface SingleCalculation {
  type: 'single'
  operation: 'sum' | 'avg' | 'max' | 'min' | 'count' | 'rule-of-three' | 'add' | 'sub' | 'div' | 'mul'
}

type Operation = SingleCalculation['operation']

export function calculateSingle(operation: Operation, data: InputData): SingleOutput {
  switch (data.type) {
    case 'series': return calculateSingleSeries(operation, data)
    case 'grouped' : return calculateSingleGrouped(operation, data)
    case 'simple' : return calculateSingleSimple(operation, data)
  }
}

export function calculateSingleSimple(operation: Operation, data: SimpleInputData): SingleOutput {
  return {
    type: 'single',
    value: calculateSimpleSingleElement(operation, data.data),
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
export function calculateSimpleSingleElement(operation: Operation, data: DataElement): number {
  switch (operation) {
    case 'add': return calculateAdd(data)
    case 'sub': return calculateSub(data)
    case 'div': return calculateDiv(data)
    case 'mul': return calculateMul(data)
    case 'rule-of-three': return calculateRuleOfThree(data)
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

function calculateAdd(data: DataElement): number {
  const left = data.valueLeft ?? 0
  const right = data.valueRight ?? 0
  return left + right
}

function calculateSub(data: DataElement): number {
  const left = data.valueLeft ?? 0
  const right = data.valueRight ?? 0
  return left - right
}

function calculateDiv(data: DataElement): number {
  const left = data.valueLeft ?? 0
  const right = data.valueRight ?? 0
  if (right === 0)
    return 0
  return (left / right) ?? 0
}

function calculateMul(data: DataElement): number {
  const left = data.valueLeft ?? 0
  const right = data.valueRight ?? 0

  return left * right
}

function calculateRuleOfThree(data: DataElement): number {
  const left = data.valueLeft ?? 0
  const right = data.valueRight ?? 0
  const divisor = data.valueDivisor ?? 0
  if (divisor === 0)
    return 0
  return (left * right) / divisor
}
