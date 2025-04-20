/**
 *  @fileoverview Provides a fluent, object-oriented interface for configuring
 * ApexCharts _options in TypeScript. This module defines strict types and builder
 * classes to simplify chart creation and customization.
 **/

import {
    type ChartType,
    type SeriesConfig,
    type YAxisConfig,
    type AxisType,
    type AxisLabel,
    type AxisBorder,
    type AxisTicks,
    type AxisCrosshair,
    type TooltipStyle,
    type ChartOptions,
    type BarPlotOptions,
    type PiePlotOptions,
    type RadialBarPlotOptions,
    type HeatmapPlotOptions,
} from './types';

// ============================================================================
// Chart Configuration System (OOP Approach)
// ============================================================================

/**
 * Abstract base class for all chart configuration components (Axis, Tooltip, etc.).
 * Provides common functionality for accessing and modifying the main chart _options.
 */
abstract class ChartComponent {
    /** Reference to the main Chart instance being configured. */
    protected chart: Chart;

    /**
     * Creates an instance of a ChartComponent.
     * @param chart The parent Chart instance.
     */
    constructor(chart: Chart) {
        this.chart = chart;
    }

    /**
     * Provides access to the main chart's _options object.
     * @returns The ChartOptions object.
     */
    protected getChartOptions(): ChartOptions {
        return this.chart._options;
    }

    /**
     * Sets a specific option value within the chart's configuration using a
     * dot-notation path. Creates nested objects if they don't exist.
     *
     * @template T The type of the value being set.
     * @param path Dot-notation path to the option (e.g., "xaxis.labels.style.fontSize").
     * @param value The value to set at the specified path.
     * @returns The current component instance to allow method chaining.
     *
     * @example
     * this.setOption<string>("xaxis.title.text", "My X-Axis");
     * this.setOption<boolean>("tooltip.enabled", true);
     */
    protected setOption<T>(path: string, value: T): this {
        const parts = path.split('.');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let current: any = this.chart._options; // Use 'any' for dynamic access

        // Navigate through nested objects, creating them if they don't exist.
        for (let i = 0; i < parts.length - 1; i++) {
            const part = parts[i];
            if (current[part] === undefined || current[part] === null) {
                current[part] = {}; // Create missing intermediate object
            }
            current = current[part];
        }

        // Set the value at the final part of the path.
        current[parts[parts.length - 1]] = value;

        return this; // Return 'this' for chaining.
    }
}

// ============================================================================
// Chart Component Classes (Fluent Builders)
// ============================================================================

/**
 * Manages configuration _options for a chart axis (X or Y).
 * Provides fluent methods to set axis properties.
 */
export class Axis extends ChartComponent {
    /** Specifies whether this instance configures the 'xaxis' or 'yaxis'. */
    private axisType: 'xaxis' | 'yaxis';

    /**
     * Creates an instance of the Axis configuration builder.
     * Ensures the necessary axis object and its sub-objects exist in the main
     * chart _options.
     *
     * @param chart The parent Chart instance.
     * @param type The type of axis ('xaxis' or 'yaxis').
     */
    constructor(chart: Chart, type: 'xaxis' | 'yaxis') {
        super(chart);
        this.axisType = type;

        const _options = this.getChartOptions();

        // Ensure the primary axis object exists.
        // For yaxis, handle the potential array: default to configuring the first
        // axis or create a single object if none exists.
        if (type === 'yaxis') {
            if (!_options.yaxis) {
                _options.yaxis = {}; // Create single y-axis config if none exists
            } else if (Array.isArray(_options.yaxis) && _options.yaxis.length === 0) {
                _options.yaxis.push({}); // Add config to empty array
            }
            // If it's an array with items, we'll target the first one by default
            // in the getAxisConfig method. Warn if it's an array?
            // console.warn("Multiple Y-axes detected. Builder targets the first axis by default.");
        } else {
            // For xaxis, ensure it's an object
            if (!_options.xaxis) {
                _options.xaxis = {};
            }
        }

        // Initialize nested objects within the target axis config
        const axisConfig = this.getAxisConfig();
        if (axisConfig) {
            axisConfig.title = axisConfig.title || {};
            axisConfig.labels = axisConfig.labels || {};
            axisConfig.labels.style = axisConfig.labels.style || {};
            axisConfig.axisBorder = axisConfig.axisBorder || {};
            axisConfig.axisTicks = axisConfig.axisTicks || {};
            axisConfig.crosshairs = axisConfig.crosshairs || {};
        }
    }

    /**
     * Helper method to get the specific axis configuration object,
     * handling the potential array case for yaxis.
     * @returns The configuration object for the axis, or undefined if invalid.
     */
    private getAxisConfig(): YAxisConfig | ChartOptions['xaxis'] | undefined {
        const _options = this.getChartOptions();
        if (this.axisType === 'xaxis') {
            return _options.xaxis;
        } else {
            // For yaxis, return the first element if it's an array,
            // or the object itself if it's not an array.
            if (Array.isArray(_options.yaxis)) {
                return _options.yaxis.length > 0 ? _options.yaxis[0] : undefined;
            }
            return _options.yaxis; // Should be YAxisConfig or undefined
        }
    }

    /**
     * Sets the title text for the axis.
     * @param text The title text.
     * @returns The Axis instance for chaining.
     */
    public title(text: string): Axis {
        const axisConfig = this.getAxisConfig();
        if (axisConfig?.title) {
            axisConfig.title.text = text;
        }
        return this;
    }

    /**
     * Sets the categories for a category-based axis.
     * Should only be used when axis type is 'category'.
     * @param categories An array of category names (string, number, or Date).
     * @returns The Axis instance for chaining.
     */
    public categories(categories: (string | number | Date)[]): Axis {
        const axisConfig = this.getAxisConfig();
        if (axisConfig) {
            axisConfig.categories = categories;
        }
        return this;
    }

    /**
     * Sets the type of the axis scale.
     * @param type The axis type ('category', 'datetime', 'numeric').
     * @returns The Axis instance for chaining.
     */
    public type(type: AxisType): Axis {
        const axisConfig = this.getAxisConfig();
        if (axisConfig) {
            axisConfig.type = type;
        }
        return this;
    }

    /**
     * Configures the labels for the axis. Merges provided config with existing.
     * @param config The label configuration (AxisLabel interface).
     * @returns The Axis instance for chaining.
     */
    public labels(config: AxisLabel): Axis {
        const axisConfig = this.getAxisConfig();
        if (axisConfig) {
            // Ensure labels object exists before merging
            axisConfig.labels = axisConfig.labels || {};
            // Merge the provided config with the existing label config.
            axisConfig.labels = { ...axisConfig.labels, ...config };
            // Deep merge the 'style' object if it's provided in the config.
            if (config.style) {
                // Ensure style object exists before merging
                axisConfig.labels.style = axisConfig.labels.style || {};
                axisConfig.labels.style = {
                    ...axisConfig.labels.style,
                    ...config.style,
                };
            }
        }
        return this;
    }

    /**
     * Sets the minimum and maximum values for a numeric or datetime axis.
     * @param min The minimum value.
     * @param max The maximum value.
     * @returns The Axis instance for chaining.
     */
    public range(min: number, max: number): Axis {
        const axisConfig = this.getAxisConfig();
        if (axisConfig) {
            axisConfig.min = min;
            axisConfig.max = max;
        }
        return this;
    }

    /**
     * Sets the desired number of ticks on the axis. ApexCharts may adjust this.
     * @param amount The approximate number of ticks.
     * @returns The Axis instance for chaining.
     */
    public tickAmount(amount: number): Axis {
        const axisConfig = this.getAxisConfig();
        if (axisConfig) {
            axisConfig.tickAmount = amount;
        }
        return this;
    }

    /**
     * Configures the border line of the axis. Merges provided config with existing.
     * @param config The axis border configuration (AxisBorder interface).
     * @returns The Axis instance for chaining.
     */
    public axisBorder(config: AxisBorder): Axis {
        const axisConfig = this.getAxisConfig();
        if (axisConfig) {
            axisConfig.axisBorder = { ...(axisConfig.axisBorder || {}), ...config };
        }
        return this;
    }

    /**
     * Configures the tick marks of the axis. Merges provided config with existing.
     * @param config The axis ticks configuration (AxisTicks interface).
     * @returns The Axis instance for chaining.
     */
    public axisTicks(config: AxisTicks): Axis {
        const axisConfig = this.getAxisConfig();
        if (axisConfig) {
            axisConfig.axisTicks = { ...(axisConfig.axisTicks || {}), ...config };
        }
        return this;
    }

    /**
     * Configures the crosshair for the axis. Merges provided config with existing.
     * @param config The axis crosshair configuration (AxisCrosshair interface).
     * @returns The Axis instance for chaining.
     */
    public crosshairs(config: AxisCrosshair): Axis {
        const axisConfig = this.getAxisConfig();
        if (axisConfig) {
            axisConfig.crosshairs = { ...(axisConfig.crosshairs || {}), ...config };
        }
        return this;
    }
}

/**
 * Manages configuration _options for the chart's tooltip.
 * Provides fluent methods to set tooltip properties.
 */
export class Tooltip extends ChartComponent {
    /**
     * Creates an instance of the Tooltip configuration builder.
     * Ensures the necessary tooltip object and its sub-objects exist in the
     * main chart _options.
     * @param chart The parent Chart instance.
     */
    constructor(chart: Chart) {
        super(chart);
        const _options = this.getChartOptions();

        // Ensure the tooltip object exists.
        if (!_options.tooltip) {
            _options.tooltip = {};
        }
        const tooltip = _options.tooltip; // Guaranteed to exist now.

        // Initialize nested objects.
        tooltip.style = tooltip.style || {};
        tooltip.x = tooltip.x || {};
        tooltip.y = tooltip.y || {};
        // Direct properties like enabled, shared, followCursor, theme, custom
        // don't need object initialization.
    }

    /**
     * Enables or disables the tooltip.
     * @param enabled True to enable, false to disable.
     * @returns The Tooltip instance for chaining.
     */
    public enabled(enabled: boolean): Tooltip {
        this.getChartOptions().tooltip!.enabled = enabled;
        return this;
    }

    /**
     * Sets whether the tooltip is shared across series or shown individually.
     * @param shared True for a shared tooltip, false for individual.
     * @returns The Tooltip instance for chaining.
     */
    public shared(shared: boolean): Tooltip {
        this.getChartOptions().tooltip!.shared = shared;
        return this;
    }

    /**
     * Sets whether the tooltip should follow the mouse cursor.
     * @param follow True to follow cursor, false otherwise.
     * @returns The Tooltip instance for chaining.
     */
    public followCursor(follow: boolean): Tooltip {
        this.getChartOptions().tooltip!.followCursor = follow;
        return this;
    }

    /**
     * Sets the visual theme for the tooltip.
     * @param theme 'light' or 'dark'.
     * @returns The Tooltip instance for chaining.
     */
    public theme(theme: 'light' | 'dark'): Tooltip {
        this.getChartOptions().tooltip!.theme = theme;
        return this;
    }

    /**
     * Configures the font styling for the tooltip. Merges with existing styles.
     * @param config The tooltip style configuration (TooltipStyle interface).
     * @returns The Tooltip instance for chaining.
     */
    public style(config: TooltipStyle): Tooltip {
        const tooltip = this.getChartOptions().tooltip!;
        // tooltip.style is guaranteed by constructor.
        tooltip.style = { ...tooltip.style, ...config };
        return this;
    }

    /**
     * Sets a custom HTML formatter function for the entire tooltip content.
     * @param formatter A function that receives tooltip data and returns HTML string.
     * @returns The Tooltip instance for chaining.
     */
    public custom(
        formatter: (_options: {
            series: number[][];
            seriesIndex: number;
            dataPointIndex: number;
            w: unknown; // Use unknown instead of any
        }) => string | string[],
    ): Tooltip {
        this.getChartOptions().tooltip!.custom = formatter;
        return this;
    }

    /**
     * Sets a custom formatter function for the x-value displayed in the tooltip.
     * @param formatter A function that receives the x-value and returns a string.
     * @returns The Tooltip instance for chaining.
     */
    public xFormatter(
        formatter: (
            value: string | number | Date,
            opts?: Record<string, unknown>,
        ) => string,
    ): Tooltip {
        // tooltip.x is guaranteed by constructor.
        this.getChartOptions().tooltip!.x!.formatter = formatter;
        return this;
    }

    /**
     * Sets a custom formatter function for the y-value displayed in the tooltip.
     * @param formatter A function that receives the y-value and returns a string.
     * @returns The Tooltip instance for chaining.
     */
    public yFormatter(
        formatter: (
            value: string | number | Date,
            opts?: Record<string, unknown>,
        ) => string,
    ): Tooltip {
        // tooltip.y is guaranteed by constructor.
        this.getChartOptions().tooltip!.y!.formatter = formatter;
        return this;
    }
}

/**
 * Manages configuration _options for the chart's legend.
 * Provides fluent methods to set legend properties.
 */
export class Legend extends ChartComponent {
    /**
     * Creates an instance of the Legend configuration builder.
     * Ensures the necessary legend object and its sub-objects exist in the
     * main chart _options.
     * @param chart The parent Chart instance.
     */
    constructor(chart: Chart) {
        super(chart);
        const _options = this.getChartOptions();
        // Ensure the legend object and its nested objects exist.
        if (!_options.legend) {
            _options.legend = {};
        }
        const legend = _options.legend; // Guaranteed to exist.
        legend.labels = legend.labels || {};
        legend.markers = legend.markers || {};
        legend.itemMargin = legend.itemMargin || {};
    }

    /**
     * Shows or hides the legend.
     * @param visible True to show, false to hide.
     * @returns The Legend instance for chaining.
     */
    public show(visible: boolean): Legend {
        this.getChartOptions().legend!.show = visible;
        return this;
    }

    /**
     * Sets the position of the legend relative to the chart area.
     * @param position 'top', 'right', 'bottom', or 'left'.
     * @returns The Legend instance for chaining.
     */
    public position(position: 'top' | 'right' | 'bottom' | 'left'): Legend {
        this.getChartOptions().legend!.position = position;
        return this;
    }

    /**
     * Sets the horizontal alignment of legend items within the legend container.
     * @param align 'left', 'center', or 'right'.
     * @returns The Legend instance for chaining.
     */
    public horizontalAlign(align: 'left' | 'center' | 'right'): Legend {
        this.getChartOptions().legend!.horizontalAlign = align;
        return this;
    }

    /**
     * Sets the font size for the legend text.
     * @param size Font size string (e.g., '12px').
     * @returns The Legend instance for chaining.
     */
    public fontSize(size: string): Legend {
        this.getChartOptions().legend!.fontSize = size;
        return this;
    }

    /**
     * Sets the font family for the legend text.
     * @param family Font family string (e.g., 'Arial, sans-serif').
     * @returns The Legend instance for chaining.
     */
    public fontFamily(family: string): Legend {
        this.getChartOptions().legend!.fontFamily = family;
        return this;
    }

    /**
     * Configures the appearance of the legend labels (text).
     * Merges provided config with existing.
     * @param config Label configuration object.
     * @returns The Legend instance for chaining.
     */
    public labels(config: {
        colors?: string | string[];
        useSeriesColors?: boolean;
    }): Legend {
        const legend = this.getChartOptions().legend!;
        // legend.labels is guaranteed by constructor.
        legend.labels = { ...legend.labels, ...config };
        return this;
    }

    /**
     * Configures the appearance of the legend markers (symbols).
     * Merges provided config with existing.
     * @param config Marker configuration object.
     * @returns The Legend instance for chaining.
     */
    public markers(config: {
        width?: number;
        height?: number;
        strokeWidth?: number;
        strokeColor?: string;
        fillColors?: string[];
        radius?: number;
        offsetX?: number;
        offsetY?: number;
    }): Legend {
        const legend = this.getChartOptions().legend!;
        // legend.markers is guaranteed by constructor.
        legend.markers = { ...legend.markers, ...config };
        return this;
    }

    /**
     * Configures the margins between legend items.
     * Merges provided config with existing.
     * @param config Margin configuration object.
     * @returns The Legend instance for chaining.
     */
    public itemMargin(config: { horizontal?: number; vertical?: number }): Legend {
        const legend = this.getChartOptions().legend!;
        // legend.itemMargin is guaranteed by constructor.
        legend.itemMargin = { ...legend.itemMargin, ...config };
        return this;
    }
}

/**
 * Manages configuration _options for the chart's background grid.
 * Provides fluent methods to set grid properties.
 */
export class Grid extends ChartComponent {
    /**
     * Creates an instance of the Grid configuration builder.
     * Ensures the necessary grid object and its sub-objects exist in the
     * main chart _options.
     * @param chart The parent Chart instance.
     */
    constructor(chart: Chart) {
        super(chart);
        const _options = this.getChartOptions();
        // Ensure the grid object and its nested objects exist.
        if (!_options.grid) {
            _options.grid = {};
        }
        const grid = _options.grid; // Guaranteed to exist.
        grid.xaxis = grid.xaxis || {};
        grid.xaxis.lines = grid.xaxis.lines || {}; // Ensure lines object exists
        grid.yaxis = grid.yaxis || {};
        grid.yaxis.lines = grid.yaxis.lines || {}; // Ensure lines object exists
        grid.padding = grid.padding || {};
    }

    /**
     * Shows or hides the grid lines.
     * @param visible True to show, false to hide.
     * @returns The Grid instance for chaining.
     */
    public show(visible: boolean): Grid {
        this.getChartOptions().grid!.show = visible;
        return this;
    }

    /**
     * Sets the color of the grid lines.
     * @param color Color string (e.g., '#e0e0e0').
     * @returns The Grid instance for chaining.
     */
    public borderColor(color: string): Grid {
        this.getChartOptions().grid!.borderColor = color;
        return this;
    }

    /**
     * Sets the dash pattern for grid lines to create dashed lines.
     * @param dashArray A number representing the length of dashes and gaps.
     * @returns The Grid instance for chaining.
     */
    public strokeDashArray(dashArray: number): Grid {
        this.getChartOptions().grid!.strokeDashArray = dashArray;
        return this;
    }

    /**
     * Sets whether grid lines are drawn behind or in front of chart elements.
     * @param position 'front' or 'back'.
     * @returns The Grid instance for chaining.
     */
    public position(position: 'front' | 'back'): Grid {
        this.getChartOptions().grid!.position = position;
        return this;
    }

    /**
     * Configures the vertical grid lines associated with the X-axis.
     * Merges provided config with existing.
     * @param config X-axis grid line configuration.
     * @returns The Grid instance for chaining.
     */
    public xaxis(config: { lines?: { show?: boolean } }): Grid {
        const grid = this.getChartOptions().grid!;
        // Ensure grid.xaxis exists before accessing lines
        grid.xaxis = grid.xaxis || {};
        grid.xaxis.lines = { ...(grid.xaxis.lines || {}), ...config.lines };
        return this;
    }

    /**
     * Configures the horizontal grid lines associated with the Y-axis.
     * Merges provided config with existing.
     * @param config Y-axis grid line configuration.
     * @returns The Grid instance for chaining.
     */
    public yaxis(config: { lines?: { show?: boolean } }): Grid {
        const grid = this.getChartOptions().grid!;
        // Ensure grid.yaxis exists before accessing lines
        grid.yaxis = grid.yaxis || {};
        grid.yaxis.lines = { ...(grid.yaxis.lines || {}), ...config.lines };
        return this;
    }

    /**
     * Sets the padding around the grid area within the chart container.
     * Merges provided config with existing.
     * @param config Padding configuration object (top, right, bottom, left).
     * @returns The Grid instance for chaining.
     */
    public padding(config: {
        top?: number;
        right?: number;
        bottom?: number;
        left?: number;
    }): Grid {
        const grid = this.getChartOptions().grid!;
        // grid.padding is guaranteed by constructor.
        grid.padding = { ...grid.padding, ...config };
        return this;
    }
}

/**
 * Manages configuration _options for data labels displayed directly on data points.
 * Provides fluent methods to set data label properties.
 */
export class DataLabels extends ChartComponent {
    /**
     * Creates an instance of the DataLabels configuration builder.
     * Ensures the necessary dataLabels object and its sub-objects exist in the
     * main chart _options.
     * @param chart The parent Chart instance.
     */
    constructor(chart: Chart) {
        super(chart);
        const _options = this.getChartOptions();
        // Ensure the dataLabels object and its nested objects exist.
        if (!_options.dataLabels) {
            _options.dataLabels = {};
        }
        const dataLabels = _options.dataLabels; // Guaranteed to exist.
        dataLabels.style = dataLabels.style || {};
        dataLabels.background = dataLabels.background || {};
    }

    /**
     * Enables or disables the data labels.
     * @param enabled True to enable, false to disable.
     * @returns The DataLabels instance for chaining.
     */
    public enabled(enabled: boolean): DataLabels {
        this.getChartOptions().dataLabels!.enabled = enabled;
        return this;
    }

    /**
     * Sets a custom formatter function for the text content of data labels.
     * @param formatter Function receiving the value and returning the label string.
     * @returns The DataLabels instance for chaining.
     */
    public formatter(
        formatter: (val: number | string, opts?: unknown) => string,
    ): DataLabels {
        this.getChartOptions().dataLabels!.formatter = formatter;
        return this;
    }

    /**
     * Configures the text styling for data labels.
     * Merges provided config with existing.
     * @param config Style configuration object.
     * @returns The DataLabels instance for chaining.
     */
    public style(config: {
        fontSize?: string;
        fontFamily?: string;
        fontWeight?: string | number;
        colors?: string[];
    }): DataLabels {
        const dataLabels = this.getChartOptions().dataLabels!;
        // dataLabels.style is guaranteed by constructor.
        dataLabels.style = { ...dataLabels.style, ...config };
        return this;
    }

    /**
     * Configures the background shape/style for data labels.
     * Merges provided config with existing.
     * @param config Background configuration object.
     * @returns The DataLabels instance for chaining.
     */
    public background(config: {
        enabled?: boolean;
        foreColor?: string;
        padding?: number;
        borderRadius?: number;
        borderWidth?: number;
        borderColor?: string;
        opacity?: number;
    }): DataLabels {
        const dataLabels = this.getChartOptions().dataLabels!;
        // dataLabels.background is guaranteed by constructor.
        dataLabels.background = { ...dataLabels.background, ...config };
        return this;
    }

    /**
     * Sets the horizontal offset for data labels relative to their data point.
     * @param offset Offset in pixels.
     * @returns The DataLabels instance for chaining.
     */
    public offsetX(offset: number): DataLabels {
        this.getChartOptions().dataLabels!.offsetX = offset;
        return this;
    }

    /**
     * Sets the vertical offset for data labels relative to their data point.
     * @param offset Offset in pixels.
     * @returns The DataLabels instance for chaining.
     */
    public offsetY(offset: number): DataLabels {
        this.getChartOptions().dataLabels!.offsetY = offset;
        return this;
    }
}

/**
 * Manages configuration _options for markers (dots) on line, area, and scatter charts.
 * Provides fluent methods to set marker properties.
 */
export class Markers extends ChartComponent {
    /**
     * Creates an instance of the Markers configuration builder.
     * Ensures the necessary markers object and its sub-objects exist in the
     * main chart _options.
     * @param chart The parent Chart instance.
     */
    constructor(chart: Chart) {
        super(chart);
        const _options = this.getChartOptions();
        // Ensure the markers object and its nested hover object exist.
        if (!_options.markers) {
            _options.markers = {}; // Initialize markers if it doesn't exist
        }
        const markers = _options.markers; // Guaranteed to exist now
        markers.hover = markers.hover || {};
    }

    /**
     * Sets the size of the markers.
     * @param size Size in pixels. Can be an array for different series.
     * @returns The Markers instance for chaining.
     */
    public size(size: number | number[]): Markers {
        this.getChartOptions().markers!.size = size;
        return this;
    }

    /**
     * Sets the fill colors for the markers. Overrides series colors if provided.
     * @param colors Array of color strings.
     * @returns The Markers instance for chaining.
     */
    public colors(colors: string[]): Markers {
        this.getChartOptions().markers!.colors = colors;
        return this;
    }

    /**
     * Sets the border colors for the markers.
     * @param colors A single color string or an array of colors.
     * @returns The Markers instance for chaining.
     */
    public strokeColors(colors: string | string[]): Markers {
        this.getChartOptions().markers!.strokeColors = colors;
        return this;
    }

    /**
     * Sets the border width for the markers.
     * @param width Width in pixels. Can be an array for different series.
     * @returns The Markers instance for chaining.
     */
    public strokeWidth(width: number | number[]): Markers {
        this.getChartOptions().markers!.strokeWidth = width;
        return this; // Added missing return statement
    }

    /**
     * Sets the shape of the markers.
     * @param shape 'circle', 'square', or 'rect'. Can be an array.
     * @returns The Markers instance for chaining.
     */
    public shape(
        shape: 'circle' | 'square' | 'rect' | ('circle' | 'square' | 'rect')[],
    ): Markers {
        this.getChartOptions().markers!.shape = shape;
        return this; // Added missing return statement
    }

    /**
     * Sets the radius for circular markers.
     * @param radius Radius in pixels.
     * @returns The Markers instance for chaining.
     */
    public radius(radius: number): Markers {
        this.getChartOptions().markers!.radius = radius;
        return this; // Added missing return statement
    }

    /**
     * Configures the appearance of markers on hover.
     * Merges provided config with existing.
     * @param config Hover configuration object.
     * @returns The Markers instance for chaining.
     */
    public hover(config: { size?: number; sizeOffset?: number }): Markers {
        const markers = this.getChartOptions().markers!;
        // markers.hover is guaranteed by constructor.
        markers.hover = { ...markers.hover, ...config };
        return this; // Added missing return statement
    }
}

/**
 * Manages configuration _options for the chart's visual theme.
 * Provides fluent methods to set theme properties.
 */
export class Theme extends ChartComponent {
    /**
     * Creates an instance of the Theme configuration builder.
     * Ensures the necessary theme object and its sub-objects exist in the
     * main chart _options.
     * @param chart The parent Chart instance.
     */
    constructor(chart: Chart) {
        super(chart);
        const _options = this.getChartOptions();
        // Ensure the theme object and its nested monochrome object exist.
        if (!_options.theme) {
            _options.theme = {}; // Initialize theme if it doesn't exist
        }
        const theme = _options.theme; // Guaranteed to exist now
        theme.monochrome = theme.monochrome || {};
    }

    /**
     * Sets the overall theme mode.
     * @param mode 'light' or 'dark'.
     * @returns The Theme instance for chaining.
     */
    public mode(mode: 'light' | 'dark'): Theme {
        this.getChartOptions().theme!.mode = mode;
        return this; // Added missing return statement
    }

    /**
     * Sets a predefined color palette for the chart series.
     * @param palette Palette name (e.g., 'palette1', 'palette2', ...).
     * @returns The Theme instance for chaining.
     */
    public palette(palette: string): Theme {
        this.getChartOptions().theme!.palette = palette;
        return this; // Added missing return statement
    }

    /**
     * Configures the monochrome theme option, which uses shades of a single color.
     * Merges provided config with existing.
     * @param config Monochrome theme configuration object.
     * @returns The Theme instance for chaining.
     */
    public monochrome(config: {
        enabled?: boolean;
        color?: string;
        shadeTo?: 'light' | 'dark';
        shadeIntensity?: number;
    }): Theme {
        const theme = this.getChartOptions().theme!;
        // theme.monochrome is guaranteed by constructor.
        theme.monochrome = { ...theme.monochrome, ...config };
        return this; // Added missing return statement
    }
}

// ============================================================================
// PlotOptions Component Classes (Specific Chart Types)
// ============================================================================

/** Helper function to ensure plotOptions exists */
function ensurePlotOptions(chart: Chart): NonNullable<ChartOptions['plotOptions']> {
    const _options = chart._options;
    if (!_options.plotOptions) {
        _options.plotOptions = {};
    }
    return _options.plotOptions;
}

/** Helper function to ensure specific plotOptions type exists */
function ensurePlotOptionType<K extends keyof PlotOptionsMap>(
    chart: Chart,
    type: K,
): NonNullable<PlotOptionsMap[K]> {
    const plotOptions = ensurePlotOptions(chart);
    if (!plotOptions[type]) {
        // Initialize with an empty object, asserting the correct type.
        // This assumes the specific plot option type (e.g., BarPlotOptions)
        // is an object type.
        plotOptions[type] = {} as NonNullable<PlotOptionsMap[K]>;
    }
    // The type assertion above ensures this is non-nullable.
    return plotOptions[type]!;
}

/**
 * Define a specific type for the known keys of plotOptions
 * to help with type inference in ensurePlotOptionType.
 */
type PlotOptionsMap = {
    bar?: BarPlotOptions;
    pie?: PiePlotOptions;
    radialBar?: RadialBarPlotOptions;
    heatmap?: HeatmapPlotOptions;
};

/**
 * Manages configuration _options specific to Bar charts under `plotOptions.bar`.
 * Provides fluent methods for bar-specific settings.
 */
export class BarOptions extends ChartComponent {
    private ensureBarOptions(): BarPlotOptions {
        return ensurePlotOptionType(this.chart, 'bar');
    }

    public horizontal(isHorizontal: boolean): BarOptions {
        this.ensureBarOptions().horizontal = isHorizontal;
        return this;
    }
    public columnWidth(width: string): BarOptions {
        this.ensureBarOptions().columnWidth = width;
        return this;
    }
    public barHeight(height: string): BarOptions {
        this.ensureBarOptions().barHeight = height;
        return this;
    }
    public distributed(distributed: boolean): BarOptions {
        this.ensureBarOptions().distributed = distributed;
        return this;
    }
    public borderRadius(radius: number): BarOptions {
        this.ensureBarOptions().borderRadius = radius;
        return this;
    }
    public colors(config: NonNullable<BarPlotOptions['colors']>): BarOptions {
        const barOptions = this.ensureBarOptions();
        barOptions.colors = { ...(barOptions.colors || {}), ...config };
        return this;
    }
}

/**
 * Manages configuration _options specific to Pie/Donut charts under `plotOptions.pie`.
 */
export class PieOptions extends ChartComponent {
    private ensurePieOptions(): PiePlotOptions {
        return ensurePlotOptionType(this.chart, 'pie');
    }

    public startAngle(angle: number): PieOptions {
        this.ensurePieOptions().startAngle = angle;
        return this;
    }
    public endAngle(angle: number): PieOptions {
        this.ensurePieOptions().endAngle = angle;
        return this;
    }
    public expandOnClick(expand: boolean): PieOptions {
        this.ensurePieOptions().expandOnClick = expand;
        return this;
    }
    public donut(config: NonNullable<PiePlotOptions['donut']>): PieOptions {
        const pieOptions = this.ensurePieOptions();
        pieOptions.donut = { ...(pieOptions.donut || {}), ...config };
        // Deep merge labels if provided
        if (config.labels) {
            pieOptions.donut.labels = {
                ...(pieOptions.donut.labels || {}),
                ...config.labels,
                name: {
                    ...(pieOptions.donut.labels?.name || {}),
                    ...config.labels.name,
                },
                value: {
                    ...(pieOptions.donut.labels?.value || {}),
                    ...config.labels.value,
                },
                total: {
                    ...(pieOptions.donut.labels?.total || {}),
                    ...config.labels.total,
                },
            };
        }
        return this;
    }
    // Add other PieOptions methods here (offsetX, offsetY, customScale, dataLabels)
}

/**
 * Manages configuration _options specific to RadialBar charts under `plotOptions.radialBar`.
 */
export class RadialBarOptions extends ChartComponent {
    private ensureRadialBarOptions(): RadialBarPlotOptions {
        return ensurePlotOptionType(this.chart, 'radialBar');
    }

    public hollow(
        config: NonNullable<RadialBarPlotOptions['hollow']>,
    ): RadialBarOptions {
        const radialOptions = this.ensureRadialBarOptions();
        radialOptions.hollow = { ...(radialOptions.hollow || {}), ...config };
        return this;
    }
    public track(config: NonNullable<RadialBarPlotOptions['track']>): RadialBarOptions {
        const radialOptions = this.ensureRadialBarOptions();
        radialOptions.track = { ...(radialOptions.track || {}), ...config };
        return this;
    }
    public dataLabels(
        config: NonNullable<RadialBarPlotOptions['dataLabels']>,
    ): RadialBarOptions {
        const radialOptions = this.ensureRadialBarOptions();
        radialOptions.dataLabels = {
            ...(radialOptions.dataLabels || {}),
            ...config,
        };
        // Deep merge labels if provided
        if (config.name) {
            radialOptions.dataLabels.name = {
                ...(radialOptions.dataLabels.name || {}),
                ...config.name,
            };
        }
        if (config.value) {
            radialOptions.dataLabels.value = {
                ...(radialOptions.dataLabels.value || {}),
                ...config.value,
            };
        }
        if (config.total) {
            radialOptions.dataLabels.total = {
                ...(radialOptions.dataLabels.total || {}),
                ...config.total,
            };
        }
        return this;
    }
    // Add other RadialBarOptions methods here (inverseOrder, startAngle, endAngle, offsetX, offsetY)
}

/**
 * Manages configuration _options specific to Heatmap charts under `plotOptions.heatmap`.
 */
export class HeatmapOptions extends ChartComponent {
    private ensureHeatmapOptions(): HeatmapPlotOptions {
        return ensurePlotOptionType(this.chart, 'heatmap');
    }

    public radius(radius: number): HeatmapOptions {
        this.ensureHeatmapOptions().radius = radius;
        return this;
    }
    public enableShades(enable: boolean): HeatmapOptions {
        this.ensureHeatmapOptions().enableShades = enable;
        return this;
    }
    public shadeIntensity(intensity: number): HeatmapOptions {
        this.ensureHeatmapOptions().shadeIntensity = intensity;
        return this;
    }
    public colorScale(
        config: NonNullable<HeatmapPlotOptions['colorScale']>,
    ): HeatmapOptions {
        const heatmapOptions = this.ensureHeatmapOptions();
        heatmapOptions.colorScale = {
            ...(heatmapOptions.colorScale || {}),
            ...config,
        };
        return this;
    }
    // Add other HeatmapOptions methods here (reverseNegativeShade, distributed, useFillColorAsStroke)
}

/**
 * Manages the `plotOptions` configuration block.
 * Provides access to specific chart type option builders (BarOptions, PieOptions, etc.).
 */
export class PlotOptionsManager extends ChartComponent {
    private _bar: BarOptions | undefined;
    private _pie: PieOptions | undefined;
    private _radialBar: RadialBarOptions | undefined;
    private _heatmap: HeatmapOptions | undefined;

    constructor(chart: Chart) {
        super(chart);
        // Ensure plotOptions exists on the main chart _options
        ensurePlotOptions(chart);
    }

    /** Access configuration _options for Bar charts. */
    public bar(): BarOptions {
        if (!this._bar) {
            this._bar = new BarOptions(this.chart);
        }
        return this._bar;
    }

    /** Access configuration _options for Pie/Donut charts. */
    public pie(): PieOptions {
        if (!this._pie) {
            this._pie = new PieOptions(this.chart);
        }
        return this._pie;
    }

    /** Access configuration _options for RadialBar charts. */
    public radialBar(): RadialBarOptions {
        if (!this._radialBar) {
            this._radialBar = new RadialBarOptions(this.chart);
        }
        return this._radialBar;
    }

    /** Access configuration _options for Heatmap charts. */
    public heatmap(): HeatmapOptions {
        if (!this._heatmap) {
            this._heatmap = new HeatmapOptions(this.chart);
        }
        return this._heatmap;
    }
}

/**
 * Main class for building ApexCharts configuration using a fluent interface.
 */
export class Chart {
    public _options: ChartOptions;
    public xaxis: Axis;
    public yaxis: Axis; // Represents the builder for the primary/first y-axis
    public tooltip: Tooltip;
    public legend: Legend;
    public grid: Grid;
    public dataLabels: DataLabels;
    public markers: Markers;
    public theme: Theme;
    public plotOptions: PlotOptionsManager; // Use the manager class

    /**
     * Initializes a new Chart configuration object.
     * Use the static `create` method instead of direct instantiation.
     * @param type The type of chart to create.
     * @internal
     */
    protected constructor(type: ChartType) {
        this._options = {
            chart: { type: type }, // Initialize with chart type
            series: [], // Initialize series as empty array
        };
        // Initialize component builders
        this.xaxis = new Axis(this, 'xaxis');
        this.yaxis = new Axis(this, 'yaxis'); // Builder targets the primary y-axis
        this.tooltip = new Tooltip(this);
        this.legend = new Legend(this);
        this.grid = new Grid(this);
        this.dataLabels = new DataLabels(this);
        this.markers = new Markers(this);
        this.theme = new Theme(this);
        this.plotOptions = new PlotOptionsManager(this); // Initialize the plot _options manager
    }

    /**
     * Sets the main title of the chart.
     * @param text The title text.
     * @returns The Chart instance for chaining.
     */
    public title(text: string): Chart {
        if (!this._options.title) this._options.title = {};
        this._options.title.text = text;
        return this;
    }

    /**
     * Sets the subtitle of the chart.
     * @param text The subtitle text.
     * @returns The Chart instance for chaining.
     */
    public subtitle(text: string): Chart {
        if (!this._options.subtitle) this._options.subtitle = {};
        this._options.subtitle.text = text;
        return this;
    }

    /**
     * Sets the height of the chart.
     * @param height Height value (e.g., 400 or '500px').
     * @returns The Chart instance for chaining.
     */
    public height(height: number | string): Chart {
        if (!this._options.chart) this._options.chart = { type: 'line' }; // Should have type
        this._options.chart.height = height;
        return this;
    }

    /**
     * Sets the width of the chart.
     * @param width Width value (e.g., 600 or '100%').
     * @returns The Chart instance for chaining.
     */
    public width(width: number | string): Chart {
        if (!this._options.chart) this._options.chart = { type: 'line' }; // Should have type
        this._options.chart.width = width;
        return this;
    }

    /**
     * Sets the data series for the chart. Replaces any existing series.
     * @param data An array of series configurations.
     * @returns The Chart instance for chaining.
     */
    public series(data: SeriesConfig[]): Chart {
        this._options.series = data;
        return this;
    }

    /**
     * Sets the default color palette for the chart series.
     * @param colors An array of color strings.
     * @returns The Chart instance for chaining.
     */
    public colors(colors: string[]): Chart {
        this._options.colors = colors;
        return this;
    }

    /**
     * Configures visual states like hover and active. Merges with existing.
     * @param config State configuration object.
     * @returns The Chart instance for chaining.
     */
    public states(config: NonNullable<ChartOptions['states']>): Chart {
        this._options.states = { ...(this._options.states || {}), ...config };
        // Deep merge filters if provided
        if (config.normal?.filter) {
            this._options.states.normal = {
                ...(this._options.states.normal || {}),
                filter: {
                    ...(this._options.states.normal?.filter || {}),
                    ...config.normal.filter,
                },
            };
        }
        if (config.hover?.filter) {
            this._options.states.hover = {
                ...(this._options.states.hover || {}),
                filter: {
                    ...(this._options.states.hover?.filter || {}),
                    ...config.hover.filter,
                },
            };
        }
        if (config.active?.filter) {
            this._options.states.active = {
                ...(this._options.states.active || {}),
                filter: {
                    ...(this._options.states.active?.filter || {}),
                    ...config.active.filter,
                },
            };
        }
        return this;
    }

    /**
     * Sets responsive configurations for different screen sizes.
     * @param breakpoints Array of breakpoint configurations.
     * @returns The Chart instance for chaining.
     */
    public responsive(
        breakpoints: Array<{
            breakpoint: number;
            _options: Partial<ChartOptions>; // Use Partial as responsive _options often override only some parts
        }>,
    ): Chart {
        // Note: Responsive _options in ApexCharts are complex. This provides a basic setter.
        // Deep merging might be needed for more robust responsive handling.
        // Using unknown cast is slightly safer than any.
        this._options.responsive = breakpoints as unknown as ChartOptions['responsive'];
        return this;
    }

    /**
     * Configures chart animations. Merges with existing.
     * @param config Animation configuration object.
     * @returns The Chart instance for chaining.
     */
    public animations(config: NonNullable<ChartOptions['chart']>['animations']): Chart {
        if (!this._options.chart) this._options.chart = { type: 'line' }; // Should have type
        this._options.chart.animations = {
            ...(this._options.chart.animations || {}),
            ...config,
        };
        // Deep merge nested animation _options
        if (config?.animateGradually) {
            this._options.chart.animations.animateGradually = {
                ...(this._options.chart.animations.animateGradually || {}),
                ...config.animateGradually,
            };
        }
        if (config?.dynamicAnimation) {
            this._options.chart.animations.dynamicAnimation = {
                ...(this._options.chart.animations.dynamicAnimation || {}),
                ...config.dynamicAnimation,
            };
        }
        return this;
    }

    /**
     * Returns the constructed chart _options object.
     * @returns The final ChartOptions object.
     */
    get options(): ChartOptions {
        return this._options;
    }

    /**
     * Static factory method to create a new Chart builder instance.
     * @param type The type of chart to create.
     * @returns A new Chart instance for configuration.
     */
    public static create(type: ChartType): Chart {
        // This is a basic factory. Specific chart types below might inherit
        // and override this or add specific methods.
        return new Chart(type);
    }
}

// ============================================================================
// Specific Chart Type Classes (Inherit from Chart)
// ============================================================================
// These classes can add methods specific to their chart type if needed,
// or simply inherit the base Chart functionality.

export class Line extends Chart {
    constructor() {
        super('line');
    }
    // Add line-specific methods here if necessary
}
export class Bar extends Chart {
    constructor() {
        super('bar');
    }
    // Add bar-specific methods here (e.g., related to plotOptions.bar)
    // Example: Convenience method using the plotOptions manager
    public horizontal(isHorizontal: boolean): Bar {
        this.plotOptions.bar().horizontal(isHorizontal);
        return this;
    }
}
export class Area extends Chart {
    constructor() {
        super('area');
    }
}
export class Pie extends Chart {
    constructor() {
        super('pie');
    }
}

export class Donut extends Chart {
    constructor(config: NonNullable<PiePlotOptions['donut']>) {
        super('donut');
        this.plotOptions.pie().donut(config);
    }
}
export class RadialBar extends Chart {
    constructor() {
        super('radialBar');
    }
}
export class Heatmap extends Chart {
    constructor() {
        super('heatmap');
    }
}
export class Scatter extends Chart {
    constructor() {
        super('scatter');
    }
}
export class BoxPlot extends Chart {
    constructor() {
        super('boxPlot');
    }
}
export class Candlestick extends Chart {
    constructor() {
        super('candlestick');
    }
}
export class Bubble extends Chart {
    constructor() {
        super('bubble');
    }
}
export class Radar extends Chart {
    constructor() {
        super('radar');
    }
}
export class PolarArea extends Chart {
    constructor() {
        super('polarArea');
    }
}
export class Treemap extends Chart {
    constructor() {
        super('treemap');
    }
}
export class RangeBar extends Chart {
    constructor() {
        super('rangeBar');
    }
}
export class RangeArea extends Chart {
    constructor() {
        super('rangeArea');
    }
}
