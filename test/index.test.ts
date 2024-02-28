import { describe, it } from 'vitest'
import type { DataObserver, Input, MetricConfig, OutputAdapter, SourceAdapter } from '../src'
import { DataEngine } from '../src'
import type { InputData } from '../src/input'
import type { OutputData } from '../src/output'

interface TestData {
  test: 'test'
  value: number
}

class TestDataAdapter implements SourceAdapter, OutputAdapter, DataObserver {
  fetch(_input: Input): Promise<InputData> {
    return Promise.resolve(
      {
        type: 'series',
        data: [],
      },
    )
  }

  calc(output: OutputData) {
    switch (output.type) {
      case 'single': return output.value
      case 'series': return output.values.reduce((acc, v) => acc + v, 0)
      case 'top': return output.values.at(0) || -1
      case 'table': return output.value
      default: return -1
    }
  }

  format(output: OutputData): TestData {
    return {
      test: 'test',
      value: this.calc(output),
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
    } as MetricConfig)

    // eslint-disable-next-line no-console
    console.log(engine)
  })
})
