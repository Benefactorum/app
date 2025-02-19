import { Pie, PieChart, Cell } from 'recharts'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart'
import { formatAmount } from '@/lib/formatters'

import type { FundRecord } from '@/pages/Contribution/types'

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))']

function getRandomColor (index: number): string {
  return COLORS[index % COLORS.length]
}

function preparePieData (data: FundRecord[] | undefined): Array<{ name: string, percent: number, amount?: number, fill: string }> {
  if (data === undefined) {
    return [{
      name: 'Information manquante',
      percent: 100,
      fill: 'hsl(var(--muted))'
    }]
  }
  return data.map((item, index) => ({
    name: item.type,
    percent: item.percent,
    amount: item.amount,
    fill: getRandomColor(index)
  }))
}

interface PieChartComponentProps {
  data: FundRecord[] | undefined
  title: string
}

export default function PieChartComponent ({ data, title }: PieChartComponentProps): React.ReactElement {
  const chartData = preparePieData(data)

  // Create config object for the chart
  const chartConfig = chartData.reduce((acc, item) => ({
    ...acc,
    [item.name]: {
      label: item.name,
      color: item.fill
    }
  }), {}) satisfies ChartConfig

  console.log('chartData', chartData)
  console.log('chartConfig', chartConfig)

  return (
    <Card className='flex flex-col border-none shadow-none'>
      <CardHeader className='items-center pb-0'>
        <CardTitle className='text-center text-lg font-semibold'>{title}</CardTitle>
      </CardHeader>
      <CardContent className='flex flex-col items-center'>
        <ChartContainer
          config={chartConfig}
          className='h-full w-[300px] aspect-square'
        >
          <PieChart>
            <Pie
              data={chartData}
              dataKey='percent'
              label={({ cx, cy, midAngle, innerRadius, outerRadius, value }) => {
                const radius = Number(innerRadius) + (Number(outerRadius) - Number(innerRadius)) * 1.20
                const x = Number(cx) + radius * Math.cos(-midAngle * (Math.PI / 180))
                const y = Number(cy) + radius * Math.sin(-midAngle * (Math.PI / 180))

                return (
                  <text x={x} y={y} dy={8} textAnchor='middle' fill='#333'>
                    {value} %
                  </text>
                )
              }}
              labelLine={false}
              nameKey='name'
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name, item) => {
                    return (
                        <div>
                          <p className='font-semibold mb-1'>{name}</p>
                          <div className='flex justify-between gap-8'>
                            <p>Pourcentage :</p>
                            <p>{value} %</p>
                          </div>
                          <div className='flex justify-between gap-8'>
                            <p>Montant :</p>
                            <p>
                              {item.payload.amount !== undefined
                                ? formatAmount(item.payload.amount)
                                : <span className='text-muted-foreground'>-</span>}
                            </p>
                          </div>
                        </div>
                    )
                  }}
                />
                }
            />
            <ChartLegend
              content={<ChartLegendContent nameKey='name' />}
              className='flex flex-wrap justify-center gap-x-2 gap-y-0'
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
