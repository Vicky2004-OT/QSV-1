import Plot from 'react-plotly.js'

export type Counts = Record<string, number>

export default function Histogram({ counts }: { counts: Counts }) {
  const labels = Object.keys(counts)
    .sort((a, b) => (a > b ? -1 : 1))
  const values = labels.map((k) => counts[k])

  return (
    <Plot
      data={[{ type: 'bar', x: labels, y: values }]}
      layout={{ title: 'Measurement Counts', xaxis: { title: 'Bitstring' }, yaxis: { title: 'Frequency' } }}
      style={{ width: '100%', height: 360 }}
      useResizeHandler
      config={{ displaylogo: false }}
    />
  )
}


