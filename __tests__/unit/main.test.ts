import { Bar, Pie, Line } from '../../src/main';
import { describe, it, expect } from 'vitest';

describe('Chart fluent API basic usage', () => {
    it('creates a Bar chart with title and series', () => {
        const chart = new Bar();
        chart.title('Test Chart').series([
            { name: 'A', data: [1, 2, 3] },
            { name: 'B', data: [4, 5, 6] },
        ]);
        const options = chart.options;
        expect(options.chart?.type).toBe('bar');
        expect(options.title?.text).toBe('Test Chart');
        expect(Array.isArray(options.series)).toBe(true);
        expect(options.series.length).toBe(2);
    });

    it('creates a Pie chart with donut config', () => {
        const chart = new Pie();
        chart.plotOptions.pie().donut({ size: '70%' });
        const options = chart.options;
        expect(options.chart?.type).toBe('pie');
        expect(options.plotOptions?.pie?.donut?.size).toBe('70%');
    });

    it('creates a Line chart and sets axis titles', () => {
        const chart = new Line();
        chart.xaxis.title('X Axis');
        chart.yaxis.title('Y Axis');
        const options = chart.options;
        expect(options.xaxis?.title?.text).toBe('X Axis');
        if (Array.isArray(options.yaxis)) {
            expect(options.yaxis[0]?.title?.text).toBe('Y Axis');
        } else {
            expect(options.yaxis?.title?.text).toBe('Y Axis');
        }
    });
});
