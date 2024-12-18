import '@testing-library/jest-dom'

import { vi } from 'vitest'

class ResizeObserver {
  observe (): void {}
  unobserve (): void {}
  disconnect (): void {}
}

vi.stubGlobal('ResizeObserver', ResizeObserver)
