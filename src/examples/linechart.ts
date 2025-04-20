import { Chart, type ChartOptions } from '../index';

export function exampleLineChart(): ChartOptions {
    // Return our defined type
    const chart = Chart.create('line')
        .title('Sample Line Chart')
        .height(350)
        .series([{ name: 'Series 1', data: [30, 40, 35, 50, 49, 60, 70, 91, 125] }])
        .colors(['#008FFB']);

    // Configure tooltip separately
    chart.tooltip.enabled(true);
    chart.tooltip.theme('dark');

    // Configure grid separately
    chart.grid.borderColor('#f1f1f1');

    // Configure dataLabels separately
    chart.dataLabels.enabled(false);

    // Configure axes separately using the axis builders
    chart.xaxis.categories([
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
    ]);
    chart.xaxis.title('Month');

    chart.yaxis.title('Value');

    return chart.options;
}
