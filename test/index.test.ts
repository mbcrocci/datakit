import { describe, it } from 'vitest'
import type {
  DataObserver,
  Input,
  MetricConfig,
  OutputAdapter,
  SourceAdapter,
} from '../src'
import { DataEngine } from '../src'
import type { InputData } from '../src/input'
import type { OutputData } from '../src/output'

interface TestData {
  test: 'test'
  value: number
}

class TestDataAdapter implements SourceAdapter, OutputAdapter, DataObserver {
  fetch(_input: Input): Promise<InputData> {
    return Promise.resolve({
      type: 'series',
      data: [],
    })
  }

  format(output: OutputData): TestData {
    // eslint-disable-next-line no-console
    console.log(output)
    return {
      test: 'test',
      value: 0,
    }
  }

  update(data: TestData): void {
    // eslint-disable-next-line no-console
    console.log('update', data)
  }
}

/**
 * Notas:
 * - Input: Acho que o formato e flexivel e pode ser extendido.
 *          Preocupa-me o pedido directo ao Facebook, e dificil de representar
 *
 * - Output: Acho que o formato e flexivel e pode ser extendido.
 *
 * - Subscrição: Não sei se isto é compativel com rxjs ou se deveria ter uma Adapter para os ^sinais^
 */

describe('should return data', () => {
  it('should return data', () => {
    const testObserver = new TestDataAdapter()
    const engine = new DataEngine(testObserver, testObserver)

    engine.attach(testObserver, {
      key: 'test',
      calculation: {
        type: 'single',
        operation: 'sum',
      },
    } as MetricConfig)

    // eslint-disable-next-line no-console
    console.log(engine)
  })
})
