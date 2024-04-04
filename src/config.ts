import type { SeriesOperation } from './calculations/series'
import type { SingleOperation } from './calculations/single'
import type { NodeOperation } from './calculations/tree'

export type Calculation<I> = {
  key: string
} & (SingleCalculation<I> | SeriesCalculation<I> | StaticCalculation | ReferenceCalculation | NodeCalculation<I>)

export interface SingleCalculation<I> {
  type: 'single'
  operation: SingleOperation
  input: I
}

export interface SeriesCalculation<I> {
  type: 'series'
  operation: SeriesOperation
  input: I
}

export interface StaticCalculation {
  type: 'static'
  value: number
}

export interface ReferenceCalculation {
  type: 'reference'
  reference: string
}

export interface NodeCalculation<I> {
  type: 'tree'
  operation: NodeOperation
  left: Calculation<I>
  right: Calculation<I>
}
