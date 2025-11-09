/// <reference types="vite/client" />

// For SVG imports as React components
declare module '*.svg?react' {
  import type { FC, SVGProps } from 'react'
  const ReactComponent: FC<SVGProps<SVGElement>>
  export default ReactComponent
}

// For regular SVG imports
declare module '*.svg' {
  const content: string
  export default content
}
