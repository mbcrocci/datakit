import type { OutputData, SingleOutput } from '../output'
import type { StorageAdapter } from '..'
import type { InputData } from '../input'
import { type ReferenceCalculation, calculateReference } from './reference'
import { type SingleCalculation, calculateSingle } from './single'
import type { StaticCalculation } from './static'
import { calculateStatic } from './static'

export interface TreeCalculation {
  type: 'tree'
  left: NodeCalculation
  right: NodeCalculation
  operation: 'add' | 'sub' | 'div' | 'mul'
}

export type NodeCalculation =
  | TreeCalculation
  | ReferenceCalculation
  | SingleCalculation
  | StaticCalculation

export function calculateNode(calc: TreeCalculation, storage?: StorageAdapter, input?: InputData): SingleOutput {
  let value = 0
  const left = getValueByType(calc.left, storage, input)
  const right = getValueByType(calc.right, storage, input)

  switch (calc.operation) {
    case 'add':
      value = calculateAdd(left, right)
      break
    case 'sub':
      value = calculateSub(left, right)
      break
    case 'div':
      value = calculateDiv(left, right)
      break
    case 'mul':
      value = calculateMul(left, right)
      break
  }

  return {
    type: 'single',
    value,
  }
}

function getValueByType(node: NodeCalculation, storage?: StorageAdapter, input?: InputData): number {
  let value = 0
  switch (node.type) {
    case 'tree':
      value = (calculateNode(node as TreeCalculation, storage) as SingleOutput).value
      break
    case 'reference':
      value = (calculateReference(node as ReferenceCalculation, storage) as SingleOutput).value
      break
    case 'single':
      if (input !== undefined)
        value = calculateSingle(node.operation, input).value

      break
    case 'static':
      value = (calculateStatic({} as InputData, node as StaticCalculation) as SingleOutput).value
      break
  }
  return value
}

export function calculateAdd(left: number, right: number): number {
  const value = (left + right)
  return value
}

export function calculateSub(left: number, right: number): number {
  return left - right
}

export function calculateMul(left: number, right: number): number {
  return left * right
}

export function calculateDiv(left: number, right: number): number {
  if (right <= 0)
    return 0

  return left / right
}
