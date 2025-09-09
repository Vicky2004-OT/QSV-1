import Plot from 'react-plotly.js'

export default function Amplitudes({ probabilities }: { probabilities: number[] }) {
  const labels = Array.from({ length: probabilities.length }, (_, i) => i.toString(2).padStart(Math.max(1, Math.log2(probabilities.length)), '0'))
  return (
    <Plot
      data={[{ type: 'bar', x: labels, y: probabilities }]}
      layout={{ title: 'Statevector Probabilities', xaxis: { title: 'Basis State' }, yaxis: { title: 'Probability' } }}
      style={{ width: '100%', height: 360 }}
      useResizeHandler
      config={{ displaylogo: false }}
    />
  )
}


