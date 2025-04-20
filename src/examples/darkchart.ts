import { Chart, type ChartType } from '../index';

export function createDarkModeChart(type: ChartType): Chart {
    const darkFontColor = '#e0e0e0';
    const darkGridColor = '#555555';

    const chart = Chart.create(type)
        .subtitle('Sample Subtitle')
        .colors(['#00abfb', '#00e396', '#feb019', '#ff4560', '#775dd0']);

    // Configure tooltip separately
    chart.tooltip.theme('dark');

    // Configure grid separately
    chart.grid.borderColor(darkGridColor);

    // Configure legend separately
    chart.legend.labels({ colors: [darkFontColor] });

    // Configure theme separately
    chart.theme.mode('dark');
    chart.theme.monochrome({
        enabled: false,
        color: '#255aee',
        shadeTo: 'dark',
        shadeIntensity: 0.65,
    });

    // Configure axes separately
    chart.xaxis.labels({ style: { colors: darkFontColor } });
    chart.yaxis.labels({ style: { colors: darkFontColor } });

    return chart;
}
