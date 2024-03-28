import type { SeriesOperation } from './calculations/series'
import type { SingleOperation } from './calculations/single'
import type { NodeOperation } from './calculations/tree'

export type Calculation = {
  key: string
} & (SingleCalculation | SeriesCalculation | StaticCalculation | ReferenceCalculation | NodeCalculation)

export interface SingleCalculation {
  type: 'single'
  operation: SingleOperation
  input: Input
}

export interface SeriesCalculation {
  type: 'series'
  operation: SeriesOperation
  input: Input
}

export interface StaticCalculation {
  type: 'static'
  value: number
}

export interface ReferenceCalculation {
  type: 'reference'
  reference: string
}

export interface NodeCalculation {
  type: 'tree'
  operation: NodeOperation
  left: Calculation
  right: Calculation
}

export interface Input {
  filter: {
    field: string
    value: string | number | boolean | null
    operation:
      | ''
      | 'eq'
      | 'equal'
      | 'neq'
      | 'or'
      | 'and'
      | 'contains'
      | 'exists'
      | 'nexists'
    children: Input['filter'][]
  }
  orderBy: string[]
  groupBy: string[]
  range: {
    start: Date
    end: Date
  }
}
