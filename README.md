<p align="center">
  <img src="https://github.com/user-attachments/assets/7b0bd52c-d5fe-4f0a-b849-74e053391c73" alt="Vipex Logo" width="200"/> 
</p>

# Vipex 🐍

[![NPM Version](https://img.shields.io/npm/v/vipex)](https://www.npmjs.com/package/vipex)
[![Build Status](https://img.shields.io/github/actions/workflow/status/ericmiguel/vipex/ci.yml?branch=main)](https://github.com/YOUR_USERNAME/YOUR_REPOSITORY/actions)
[![License](https://img.shields.io/github/license/ericmiguel/vipex)](LICENSE)
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](CONTRIBUTING.md)

Vipex is a TypeScript library providing an object-oriented, strongly-typed wrapper around the popular [ApexCharts](https://apexcharts.com/) charting library. Inspired by the expressive and chainable API of Python's Matplotlib, Vipex aims to offer a more structured, declarative, and type-safe way to configure and create ApexCharts instances within your TypeScript or JavaScript projects.

The name "Vipex" is a playful blend of "Apex" (from the underlying library), and the "Viper" snake (alluding to the Python/Matplotlib inspiration).

## Why Vipex?

While ApexCharts is incredibly powerful, direct configuration often involves manipulating large, nested JSON objects. Ensuring the existence of nested properties before setting them (`if (!obj) obj = {}; if (!obj.prop) obj.prop = {}; ...`) can lead to repetitive checks and verbose code, making chart configurations harder to read and maintain.

Vipex tackles this by providing an **Object-Oriented Programming (OOP)** layer where chart components (like axes, tooltips, legends) are objects with **chainable methods (fluent interface)**. The underlying JSON structure is managed internally by Vipex. It ensures that the necessary nested option objects exist before their properties are accessed via the Vipex API, resulting in cleaner, safer, and more maintainable configuration code.

## ⚠️ Disclaimer

Please note that Vipex is currently a prototype library. It was initially created for personal use and is under active development. While it is published for broader use and feedback, be aware that the API is subject to change, and it may contain instabilities or bugs. Use it at your own risk, and contributions are welcome to help improve its stability and features!

## ✨ Key Features

- **Object-Oriented API:** Interact with chart components (`xaxis`, `yaxis`, `tooltip`, etc.) as objects.
- **Fluent Interface:** Configure charts declaratively and readably using chainable methods.
- **Strongly-Typed:** Leverage TypeScript's type safety and autocompletion for configuration.
- **JSON Structure Abstraction:** Focus on _what_ to configure, not _how_ to structure the ApexCharts JSON.
- **Ensured Initialization:** Internal logic guarantees nested option objects exist before access, preventing common runtime errors.
- **Dedicated Chart Classes:** Use classes like `Line`, `Bar`, `Pie`, etc., for creating specific chart types clearly.
- **Matplotlib-Inspired:** Offers a familiar API style for developers coming from the Python ecosystem.

## 🚀 Installation

You need to have `apexcharts` installed as a peer dependency.

```bash
# Using npm
npm install apexcharts vipex

# Using yarn
yarn add apexcharts vipex
```

## 💡 Getting Started

Here's how to create a simple line chart with Vipex:

```typescript
import { Line, type ApexOptions } from 'vipex'; // Or import Bar, Pie, etc.

// 1. Create an instance of the desired chart type
const chart = new Line()
    .height(350) // General chart settings
    .title('Monthly Sales')
    .series([
        // Define chart data
        {
            name: 'Sales',
            data: [30, 40, 35, 50, 49, 60, 70, 91, 125],
        },
    ]);

// 2. Configure components using the object properties and chainable methods
chart.xaxis
    .categories(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'])
    .title('Month');

chart.yaxis.title('Quantity');

chart.tooltip
    .theme('dark') // Set tooltip theme
    .enabled(true); // Ensure tooltip is enabled

chart.dataLabels.enabled(false); // Disable data labels

chart.grid.borderColor('#e0e0e0'); // Configure grid border color

chart.legend.show(true).position('bottom'); // Show legend at the bottom

// 3. Use apexChartOptions to render your chart with the ApexCharts library
// Example (depends on your framework - React, Vue, Vanilla JS, etc.):
// const apexChart = new ApexCharts(document.querySelector("#chart"), apexChartOptions);
// apexChart.render();

console.log(chart.options); // See the generated JSON structure
```

## 📚 More Examples

Creating a simple Line chart:

```typescript
import { Chart, type ChartOptions } from 'vipex';

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
```

Creating a Dark Mode Chart:

Vipex makes creating reusable configurations easy.

```typescript
import { Chart, type ChartType } from 'vipex';

export function createDarkModeChart(type: ChartType): Chart {
    const darkFontColor = '#e0e0e0';
    const darkGridColor = '#555555';

    const chart = Chart.create(type)
        .title('Dark Mode Chart')
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
// Usage:
const darkBarChart = createDarkModeChart('bar')
    .title('Dark Mode Example')
    .series([{ name: 'Data', data: [10, 20, 15, 25] }])
    .xaxis.categories(['A', 'B', 'C', 'D'])
    .xaxis.title('X-Axis')
    .yaxis.title('Y-Axis');

const darkBarOptions = darkBarChart.options;
// Now render darkBarOptions using ApexCharts
```

You can find more examples in the `/examples` directory.

## 🔧 API Overview

- **`Chart`**: Base class and factory (`Chart.create(type)`). Holds the main chart options.
- **Specific Chart Classes** (`Line`, `Bar`, `Pie`, etc.): Inherit from `Chart` and pre-define the chart type.
- **Components**: Accessed as properties on the `Chart` instance (or its subclasses):
    - `xaxis`: Configures the X-axis (`Axis` class).
    - `yaxis`: Configures the Y-axis (`Axis` class).
    - `tooltip`: Configures tooltips (`Tooltip` class).
    - `legend`: Configures the legend (`Legend` class).
    - `grid`: Configures the background grid (`Grid` class).
    - `dataLabels`: Configures data labels (`DataLabels` class).
    - `markers`: Configures point markers (`Markers` class).
    - `theme`: Configures the overall theme and palette (`Theme` class).
    - `plotOptions`: Configures options specific to chart types (accessed via `chart.plotOptions.bar`, `chart.plotOptions.pie`, etc., corresponding to classes like `BarOptions`, `PieOptions`).
- **`toApexOptions(): ApexOptions` Method**: Returns the final configuration object compatible with the native ApexCharts API.

## 🤝 Contributing

Contributions are welcome! We appreciate any help, from reporting bugs and suggesting features to contributing code.

Please feel free to **open an issue** to discuss bugs or propose changes. If you'd like to contribute code, please **fork the repository** and **open a Pull Request**.

Please read our [CONTRIBUTING.md](CONTRIBUTING.md) guide for more details on the process.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
