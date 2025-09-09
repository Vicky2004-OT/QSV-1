declare module 'react-plotly.js' {
  import { Component } from 'react'
  
  interface PlotParams {
    data: any[]
    layout?: any
    config?: any
    style?: React.CSSProperties
    useResizeHandler?: boolean
    onInitialized?: (figure: any) => void
    onPurge?: (figure: any) => void
  }
  
  export default class Plot extends Component<PlotParams> {}
}
