import type { SingleOutput } from '../output'

export type NodeOperation = 'add' | 'sub' | 'div' | 'mul'

export interface NodeCalculation {
  type: 'tree'
  left: number
  right: number
  operation: NodeOperation
}

export function calculateNode(calc: NodeCalculation): SingleOutput {
  switch (calc.operation) {
    case 'add':
      return { type: 'single', value: calculateAdd(calc.left, calc.right) }
    case 'sub':
      return { type: 'single', value: calculateSub(calc.left, calc.right) }
    case 'div':
      return { type: 'single', value: calculateDiv(calc.left, calc.right) }
    case 'mul':
      return { type: 'single', value: calculateMul(calc.left, calc.right) }
  }
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
