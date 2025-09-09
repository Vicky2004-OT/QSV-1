import Plot from 'react-plotly.js'

type Element = number | [number, number]

export default function DensityMatrix({ matrix }: { matrix: Array<Array<Element>> }) {
  const realMatrix = (matrix || []).map((row) =>
    (row || []).map((v: Element) => (Array.isArray(v) ? v[0] : (v ?? 0)))
  )
  return (
    <Plot
      data={[
        {
          z: realMatrix as any,
          type: 'heatmap',
          colorscale: 'Viridis',
        },
      ]}
      layout={{ title: 'Density Matrix (Re)', autosize: true }}
      style={{ width: '100%', height: 360 }}
      useResizeHandler
    />
  )
}
