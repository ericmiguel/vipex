// ============================================================================
// Strict Interfaces for ApexCharts Options
// ============================================================================

/**
 * Represents a single data point in a chart series.
 * Can be a simple x/y pair or include additional metadata and styling.
 */
export interface DataPoint {
    /** The x-coordinate value (category, timestamp, or number). */
    x: number | string | Date;
    /** The y-coordinate value (numeric or null for missing data). */
    y: number | null;
    /** Optional fill color for this specific data point. */
    fillColor?: string;
    /** Optional stroke color for this specific data point. */
    strokeColor?: string;
    /** Optional metadata associated with the data point. */
    meta?: Record<string, unknown>;
}

/**
 * Defines the possible structures for series data in ApexCharts.
 * Can be an array of numbers, numbers/nulls, or complex DataPoint objects.
 */
export type SeriesData = number[] | (number | null)[] | DataPoint[];

/**
 * Configuration for a single data series within the chart.
 */
export interface SeriesConfig {
    /** The name of the series, displayed in tooltips and legends. */
    name?: string;
    /** The data points for this series. */
    data: SeriesData;
    /** The chart type for this specific series (overrides global type if set). */
    type?: ChartType;
    /** The color for this specific series. */
    color?: string;
}

// ============================================================================
// Styling Interfaces
// ============================================================================

/**
 * Defines font styling options used across various chart elements.
 */
export interface FontStyle {
    /** Font size (e.g., '12px'). */
    fontSize?: string;
    /** Font family (e.g., 'Arial, sans-serif'). */
    fontFamily?: string;
    /** Font weight (e.g., 'bold', 400). */
    fontWeight?: string | number;
    /** Font color(s). */
    colors?: string | string[];
    /** CSS class to apply for additional styling. */
    cssClass?: string;
}

/**
 * Defines stroke styling options for lines and borders.
 */
export interface StrokeStyle {
    /** Stroke color. */
    color?: string;
    /** Stroke width in pixels. */
    width?: number;
    /** Dash pattern for the stroke (e.g., 5 for dashed lines). */
    dashArray?: number;
}

// ============================================================================
// Axis Configuration Interfaces
// ============================================================================

/**
 * Configuration for the title of an axis (X or Y).
 */
export interface AxisTitle {
    /** The text content of the axis title. */
    text?: string;
    /** Horizontal offset in pixels. */
    offsetX?: number;
    /** Vertical offset in pixels. */
    offsetY?: number;
    /** Font styling for the title. */
    style?: FontStyle;
}

/**
 * Configuration for the labels displayed on an axis.
 */
export interface AxisLabel {
    /**
     * Custom formatter function for axis label values.
     * @param value The original label value.
     * @param timestamp The timestamp (for datetime axes).
     * @param opts Additional options provided by ApexCharts.
     * @returns The formatted label string or array of strings.
     */
    formatter?: (
        value: string | number | Date,
        timestamp?: number,
        opts?: unknown,
    ) => string | string[];
    /** Font styling for the labels. */
    style?: FontStyle;
    /** Rotation angle for the labels (degrees). */
    rotate?: number;
    /** Whether to show the axis labels. */
    show?: boolean;
}

/**
 * Configuration for the border line of an axis.
 */
export interface AxisBorder {
    /** Whether to show the axis border. */
    show?: boolean;
    /** Color of the axis border. */
    color?: string;
    /** Horizontal offset in pixels. */
    offsetX?: number;
    /** Vertical offset in pixels. */
    offsetY?: number;
}

/**
 * Configuration for the tick marks on an axis.
 */
export interface AxisTicks {
    /** Whether to show the axis tick marks. */
    show?: boolean;
    /** Type of border for the ticks (e.g., 'solid'). */
    borderType?: string;
    /** Color of the tick marks. */
    color?: string;
    /** Height of the tick marks in pixels. */
    height?: number;
    /** Horizontal offset in pixels. */
    offsetX?: number;
    /** Vertical offset in pixels. */
    offsetY?: number;
}

/**
 * Configuration for the crosshair line that appears on axis hover.
 */
export interface AxisCrosshair {
    /** Whether to show the crosshair. */
    show?: boolean;
    /** Position relative to the data point ('back' or 'front'). */
    position?: string;
    /** Stroke styling for the crosshair line. */
    stroke?: StrokeStyle;
}

// ============================================================================
// Tooltip Configuration Interfaces
// ============================================================================

/**
 * Font styling specific to the tooltip content.
 */
export interface TooltipStyle {
    /** Font size (e.g., '12px'). */
    fontSize?: string;
    /** Font family (e.g., 'Arial, sans-serif'). */
    fontFamily?: string;
}

/**
 * Defines a formatter function structure for tooltip sections (x, y).
 */
export interface TooltipFormatter {
    /**
     * Custom formatter function for tooltip values.
     * @param value The original value to format.
     * @param opts Additional options provided by ApexCharts (e.g., series index). Use Record<string, unknown> or a more specific type if the structure is known.
     * @returns The formatted string to display in the tooltip.
     */
    formatter?: (
        value: string | number | Date,
        opts?: Record<string, unknown>,
    ) => string;
}

// ============================================================================
// Chart Type Definitions
// ============================================================================

/**
 * Defines the valid chart types supported by ApexCharts.
 */
export type ChartType =
    | 'line'
    | 'area'
    | 'bar'
    | 'pie'
    | 'donut'
    | 'radialBar'
    | 'scatter'
    | 'bubble'
    | 'heatmap'
    | 'candlestick'
    | 'boxPlot'
    | 'radar'
    | 'polarArea'
    | 'rangeBar'
    | 'rangeArea'
    | 'treemap';

/**
 * Defines the valid types for an axis scale.
 */
export type AxisType = 'category' | 'datetime' | 'numeric';

// ============================================================================
// Specific Plot Options Interfaces
// ============================================================================

/** Options specific to Bar charts within plotOptions */
export interface BarPlotOptions {
    horizontal?: boolean;
    columnWidth?: string;
    barHeight?: string;
    distributed?: boolean;
    borderRadius?: number;
    colors?: {
        ranges?: Array<{ from: number; to: number; color: string }>;
        backgroundBarColors?: string[];
        backgroundBarOpacity?: number;
        backgroundBarRadius?: number;
    };
    // Allow extending with other bar options
    // [key: string]: unknown; // Removed to avoid type issues
}

/** Options specific to Pie/Donut charts within plotOptions */
export interface PiePlotOptions {
    startAngle?: number;
    endAngle?: number;
    expandOnClick?: boolean;
    offsetX?: number;
    offsetY?: number;
    customScale?: number;
    dataLabels?: {
        offset?: number;
        minAngleToShowLabel?: number;
    };
    donut?: {
        size?: string;
        background?: string;
        labels?: {
            show?: boolean;
            name?: {
                show?: boolean;
                fontSize?: string;
                fontFamily?: string;
                fontWeight?: string | number;
                color?: string;
                offsetY?: number;
            };
            value?: {
                show?: boolean;
                fontSize?: string;
                fontFamily?: string;
                fontWeight?: string | number;
                color?: string;
                offsetY?: number;
                formatter?: (val: string) => string;
            };
            total?: {
                show?: boolean;
                showAlways?: boolean;
                label?: string;
                fontSize?: string;
                fontFamily?: string;
                fontWeight?: string | number;
                color?: string;
                formatter?: (w: unknown) => string; // w is the global config object
            };
        };
    };
    // Allow extending with other pie options
    // [key: string]: unknown; // Removed to avoid type issues
}

/** Options specific to RadialBar charts within plotOptions */
export interface RadialBarPlotOptions {
    inverseOrder?: boolean;
    startAngle?: number;
    endAngle?: number;
    offsetX?: number;
    offsetY?: number;
    hollow?: {
        margin?: number;
        size?: string;
        background?: string;
        image?: string;
        // ... other image properties
        position?: 'front' | 'back';
    };
    track?: {
        show?: boolean;
        startAngle?: number;
        endAngle?: number;
        background?: string;
        strokeWidth?: string;
        opacity?: number;
        margin?: number;
    };
    dataLabels?: {
        show?: boolean;
        name?: {
            show?: boolean;
            fontSize?: string;
            fontFamily?: string;
            fontWeight?: string | number;
            color?: string;
            offsetY?: number;
        };
        value?: {
            show?: boolean;
            fontSize?: string;
            fontFamily?: string;
            fontWeight?: string | number;
            color?: string;
            offsetY?: number;
            formatter?: (val: number) => string;
        };
        total?: {
            show?: boolean;
            label?: string;
            color?: string;
            fontSize?: string;
            fontFamily?: string;
            fontWeight?: string | number;
            formatter?: (w: unknown) => string; // w is the global config object
        };
    };
    // Allow extending with other radialBar options
    // [key: string]: unknown; // Removed to avoid type issues
}

/** Options specific to Heatmap charts within plotOptions */
export interface HeatmapPlotOptions {
    radius?: number;
    enableShades?: boolean;
    shadeIntensity?: number;
    reverseNegativeShade?: boolean;
    distributed?: boolean;
    useFillColorAsStroke?: boolean;
    colorScale?: {
        ranges?: Array<{
            from: number;
            to: number;
            color: string;
            foreColor?: string;
            name?: string;
        }>;
        inverse?: boolean;
        min?: number;
        max?: number;
    };
    // Allow extending with other heatmap options
    // [key: string]: unknown; // Removed to avoid type issues
}

/**
 * Defines the structure for the main ApexCharts configuration object.
 * This interface mirrors the options available in the ApexCharts library,
 * providing strong typing for configuration.
 *
 * @see https://apexcharts.com/docs/options/
 */
export interface ChartOptions {
    /** Main chart configuration (type, dimensions, toolbar, animations). */
    chart?: {
        /** The primary type of the chart. */
        type: ChartType;
        /** Default font family for the chart. */
        fontFamily?: string;
        /** Height of the chart (pixels or percentage). */
        height?: number | string;
        /** Width of the chart (pixels or percentage). */
        width?: number | string;
        /** Configuration for the chart's toolbar (export, zoom). */
        toolbar?: {
            /** Show or hide the toolbar. */
            show?: boolean;
            /** Enable/disable specific toolbar tools. */
            tools?: Record<string, boolean>;
            /** Allow extending with other toolbar options. */
            [key: string]: unknown;
        };
        /** Configuration for chart animations. */
        animations?: {
            /** Enable or disable all animations. */
            enabled?: boolean;
            /** Animation easing function. */
            easing?: 'linear' | 'easein' | 'easeout' | 'easeinout';
            /** Animation speed in milliseconds. */
            speed?: number;
            /** Animate series rendering gradually. */
            animateGradually?: { enabled?: boolean; delay?: number };
            /** Animate data updates dynamically. */
            dynamicAnimation?: { enabled?: boolean; speed?: number };
        };
        /** Allow extending with other chart options. */
        [key: string]: unknown;
    };
    /** Array of series data and configurations. */
    series: SeriesConfig[];
    /** Default color palette for the series. */
    colors?: string[];
    /** Configuration for the main chart title. */
    title?: {
        /** The text of the title. */
        text?: string;
        /** Horizontal alignment of the title. */
        align?: 'left' | 'center' | 'right';
        /** Font styling for the title. */
        style?: FontStyle;
        /** Allow extending with other title options. */
        [key: string]: unknown;
    };
    /** Configuration for the chart subtitle. */
    subtitle?: {
        /** The text of the subtitle. */
        text?: string;
        /** Horizontal alignment of the subtitle. */
        align?: 'left' | 'center' | 'right';
        /** Font styling for the subtitle. */
        style?: FontStyle;
        /** Allow extending with other subtitle options. */
        [key: string]: unknown;
    };
    /** Configuration for the X-axis. */
    xaxis?: {
        /** Type of the X-axis scale. */
        type?: AxisType;
        /** Explicit categories for the X-axis (used when type is 'category'). */
        categories?: (string | number | Date)[];
        /** Configuration for the X-axis title. */
        title?: AxisTitle;
        /** Configuration for the X-axis labels. */
        labels?: AxisLabel;
        /** Configuration for the X-axis border line. */
        axisBorder?: AxisBorder;
        /** Configuration for the X-axis tick marks. */
        axisTicks?: AxisTicks;
        /** Configuration for the X-axis crosshair. */
        crosshairs?: AxisCrosshair;
        /** Minimum value for the X-axis (numeric/datetime). */
        min?: number;
        /** Maximum value for the X-axis (numeric/datetime). */
        max?: number;
        /** The number of ticks to display on the X-axis. */
        tickAmount?: number;
        /** Allow extending with other X-axis options. */
        [key: string]: unknown;
    };
    /** Configuration for the Y-axis (or multiple Y-axes). */
    yaxis?: YAxisConfig | YAxisConfig[]; // Allow single or array for Y-axis
    /** Configuration for the data tooltip shown on hover. */
    tooltip?: {
        /** Enable or disable the tooltip. */
        enabled?: boolean;
        /** Show a single tooltip for all series at a point (true) or individual tooltips (false). */
        shared?: boolean;
        /** Make the tooltip follow the mouse cursor. */
        followCursor?: boolean;
        /** Visual theme for the tooltip. */
        theme?: 'light' | 'dark';
        /** Font styling for the tooltip content. */
        style?: TooltipStyle;
        /** Configuration for the X-value display in the tooltip. */
        x?: TooltipFormatter & Record<string, unknown>;
        /** Configuration for the Y-value display in the tooltip. */
        y?: TooltipFormatter & Record<string, unknown>;
        /** Custom HTML formatter function for the entire tooltip content. */
        custom?: (options: {
            series: number[][];
            seriesIndex: number;
            dataPointIndex: number;
            w: unknown; // The chart instance
        }) => string | string[]; // Allow returning array for multiple lines
        /** Allow extending with other tooltip options. */
        [key: string]: unknown;
    };
    /** Configuration for the background grid lines. */
    grid?: {
        /** Show or hide the grid. */
        show?: boolean;
        /** Color of the grid lines. */
        borderColor?: string;
        /** Dash pattern for grid lines. */
        strokeDashArray?: number;
        /** Draw grid lines in front or behind chart elements. */
        position?: 'front' | 'back';
        /** Configuration for vertical grid lines (X-axis). */
        xaxis?: { lines?: { show?: boolean } };
        /** Configuration for horizontal grid lines (Y-axis). */
        yaxis?: { lines?: { show?: boolean } };
        /** Padding around the grid area. */
        padding?: {
            top?: number;
            right?: number;
            bottom?: number;
            left?: number;
        };
        /** Allow extending with other grid options. */
        [key: string]: unknown;
    };
    /** Configuration for the chart legend. */
    legend?: {
        /** Show or hide the legend. */
        show?: boolean;
        /** Position of the legend relative to the chart. */
        position?: 'top' | 'right' | 'bottom' | 'left';
        /** Horizontal alignment of the legend items. */
        horizontalAlign?: 'left' | 'center' | 'right';
        /** Font size for legend text. */
        fontSize?: string;
        /** Font family for legend text. */
        fontFamily?: string;
        /** Configuration for the legend labels. */
        labels?: {
            /** Colors for the legend text. */
            colors?: string | string[];
            /** Use series colors for legend labels. */
            useSeriesColors?: boolean;
        };
        /** Configuration for the legend markers (symbols). */
        markers?: {
            /** Width of the markers. */
            width?: number;
            /** Height of the markers. */
            height?: number;
            /** Stroke width for marker borders. */
            strokeWidth?: number;
            /** Stroke color for marker borders. */
            strokeColor?: string;
            /** Fill colors for the markers (overrides series colors if set). */
            fillColors?: string[];
            /** Radius for circular markers. */
            radius?: number;
            /** Horizontal offset for markers. */
            offsetX?: number;
            /** Vertical offset for markers. */
            offsetY?: number;
        };
        /** Margins between legend items. */
        itemMargin?: {
            /** Horizontal margin. */
            horizontal?: number;
            /** Vertical margin. */
            vertical?: number;
        };
        /** Allow extending with other legend options. */
        [key: string]: unknown;
    };
    /** Configuration for data labels displayed on data points. */
    dataLabels?: {
        /** Enable or disable data labels. */
        enabled?: boolean;
        /** Custom formatter function for data label text. */
        formatter?: (val: number | string, opts?: unknown) => string;
        /** Styling for the data label text. */
        style?: {
            fontSize?: string;
            fontFamily?: string;
            fontWeight?: string | number;
            colors?: string[];
        };
        /** Styling for the background shape of data labels. */
        background?: {
            enabled?: boolean;
            foreColor?: string;
            padding?: number;
            borderRadius?: number;
            borderWidth?: number;
            borderColor?: string;
            opacity?: number;
        };
        /** Horizontal offset for data labels. */
        offsetX?: number;
        /** Vertical offset for data labels. */
        offsetY?: number;
        /** Allow extending with other data label options. */
        [key: string]: unknown;
    };
    /** Configuration for markers (dots) on line/area charts. */
    markers?: {
        /** Size of the markers. Can be an array for different series. */
        size?: number | number[];
        /** Colors for the markers (overrides series colors if set). */
        colors?: string[];
        /** Stroke colors for marker borders. */
        strokeColors?: string | string[];
        /** Stroke width for marker borders. Can be an array for different series. */
        strokeWidth?: number | number[];
        /** Shape of the markers. Can be an array for different series. */
        shape?: 'circle' | 'square' | 'rect' | ('circle' | 'square' | 'rect')[];
        /** Radius for circular markers. */
        radius?: number;
        /** Marker appearance on hover. */
        hover?: {
            /** Size of the marker on hover. */
            size?: number;
            /** Additional size increase on hover. */
            sizeOffset?: number;
        };
        /** Allow extending with other marker options. */
        [key: string]: unknown;
    };
    /** Configuration for the chart's visual theme. */
    theme?: {
        /** Predefined theme mode. */
        mode?: 'light' | 'dark';
        /** Name of a predefined color palette (e.g., 'palette1'). */
        palette?: string;
        /** Configuration for monochrome theme (uses shades of one color). */
        monochrome?: {
            /** Enable monochrome theme. */
            enabled?: boolean;
            /** Base color for the monochrome theme. */
            color?: string;
            /** Direction for color shading. */
            shadeTo?: 'light' | 'dark';
            /** Intensity of the color shading (0 to 1). */
            shadeIntensity?: number;
        };
        /** Allow extending with other theme options. */
        [key: string]: unknown;
    };
    /** Options specific to certain chart types (bar, pie, etc.). */
    plotOptions?: {
        /** Options specific to bar charts. */
        bar?: BarPlotOptions;
        /** Options specific to pie/donut charts. */
        pie?: PiePlotOptions;
        /** Options specific to radialBar charts. */
        radialBar?: RadialBarPlotOptions;
        /** Options specific to heatmap charts. */
        heatmap?: HeatmapPlotOptions;
        // Removed index signature to improve type checking for specific keys
        // [key: string]: unknown;
    };
    /** Configuration for different visual states (hover, active). */
    states?: {
        /** Default state options. */
        normal?: { filter?: { type?: string; value?: number } };
        /** Options for the hover state (e.g., highlight effect). */
        hover?: { filter?: { type?: string; value?: number } };
        /** Options for the active state (e.g., when an item is clicked). */
        active?: { filter?: { type?: string; value?: number } };
        /** Allow extending with other state options. */
        [key: string]: unknown;
    };
    /** Responsive design configurations based on viewport width. */
    responsive?: Array<{
        /** The breakpoint width (in pixels). */
        breakpoint: number;
        /** Chart options to apply when the viewport is narrower than the breakpoint. */
        options: ChartOptions; // Can be partial, but using full for simplicity
    }>;
    /** Allow extending with any other top-level ApexCharts options. */
    [key: string]: unknown;
}

/**
 * Represents the configuration for a single Y-axis.
 * Extracted from ChartOptions['yaxis'] to handle the single object case clearly.
 */
export interface YAxisConfig {
    /** Type of the Y-axis scale. */
    type?: AxisType;
    /** Configuration for the Y-axis title. */
    title?: AxisTitle;
    /** Configuration for the Y-axis labels. */
    labels?: AxisLabel;
    /** Configuration for the Y-axis border line. */
    axisBorder?: AxisBorder;
    /** Configuration for the Y-axis tick marks. */
    axisTicks?: AxisTicks;
    /** Configuration for the Y-axis crosshair. */
    crosshairs?: AxisCrosshair;
    /** Minimum value for the Y-axis. */
    min?: number;
    /** Maximum value for the Y-axis. */
    max?: number;
    /** The number of ticks to display on the Y-axis. */
    tickAmount?: number;
    /** Allow extending with other Y-axis options. */
    [key: string]: unknown;
}
