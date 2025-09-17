import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import Button from './Button';
import Card from './Card';

const StatsChart = ({
  data = [],
  type = 'line', // 'line', 'bar', 'pie', 'area'
  title,
  subtitle,
  height = 300,
  showControls = true,
  showExport = true,
  color = '#f97316',
  className = ''
}) => {
  const [chartType, setChartType] = useState(type);
  const [timeRange, setTimeRange] = useState('7d'); // '1d', '7d', '30d', '90d', '1y'

  const chartTypes = [
    { id: 'line', name: 'Líneas', icon: 'fas fa-chart-line' },
    { id: 'bar', name: 'Barras', icon: 'fas fa-chart-bar' },
    { id: 'area', name: 'Área', icon: 'fas fa-chart-area' },
    { id: 'pie', name: 'Circular', icon: 'fas fa-chart-pie' }
  ];

  const timeRanges = [
    { id: '1d', name: '24h' },
    { id: '7d', name: '7 días' },
    { id: '30d', name: '30 días' },
    { id: '90d', name: '3 meses' },
    { id: '1y', name: '1 año' }
  ];

  const colors = [
    '#f97316', '#3b82f6', '#10b981', '#f59e0b', 
    '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16'
  ];

  // Formatear tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border dark:border-gray-600 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 dark:text-white mb-2">
            {label}
          </p>
          {payload.map((entry, index) => (
            <p
              key={index}
              className="text-sm"
              style={{ color: entry.color }}
            >
              {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Formatear etiquetas del eje Y
  const formatYAxis = (value) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  };

  // Exportar datos
  const handleExport = (format) => {
    if (format === 'csv') {
      const csvContent = [
        Object.keys(data[0] || {}).join(','),
        ...data.map(row => Object.values(row).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `stats-${Date.now()}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } else if (format === 'image') {
      // Para exportar como imagen necesitaríamos una librería adicional
      console.log('Export as image functionality would require additional library');
    }
  };

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    switch (chartType) {
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12 }}
              className="text-gray-600 dark:text-gray-400"
            />
            <YAxis
              tickFormatter={formatYAxis}
              tick={{ fontSize: 12 }}
              className="text-gray-600 dark:text-gray-400"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {Object.keys(data[0] || {})
              .filter(key => key !== 'name')
              .map((key, index) => (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={colors[index % colors.length]}
                  radius={[2, 2, 0, 0]}
                />
              ))}
          </BarChart>
        );

      case 'pie':
        const pieData = data.map((item, index) => ({
          ...item,
          fill: colors[index % colors.length]
        }));

        return (
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12 }}
              className="text-gray-600 dark:text-gray-400"
            />
            <YAxis
              tickFormatter={formatYAxis}
              tick={{ fontSize: 12 }}
              className="text-gray-600 dark:text-gray-400"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {Object.keys(data[0] || {})
              .filter(key => key !== 'name')
              .map((key, index) => (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stackId="1"
                  stroke={colors[index % colors.length]}
                  fill={colors[index % colors.length]}
                  fillOpacity={0.6}
                />
              ))}
          </AreaChart>
        );

      case 'line':
      default:
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12 }}
              className="text-gray-600 dark:text-gray-400"
            />
            <YAxis
              tickFormatter={formatYAxis}
              tick={{ fontSize: 12 }}
              className="text-gray-600 dark:text-gray-400"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {Object.keys(data[0] || {})
              .filter(key => key !== 'name')
              .map((key, index) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={colors[index % colors.length]}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ))}
          </LineChart>
        );
    }
  };

  if (!data || data.length === 0) {
    return (
      <Card className={`p-6 text-center ${className}`}>
        <i className="fas fa-chart-line text-4xl text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No hay datos disponibles
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Los datos del gráfico se mostrarán aquí cuando estén disponibles
        </p>
      </Card>
    );
  }

  return (
    <Card className={`p-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          {title && (
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>

        {/* Controls */}
        {showControls && (
          <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0">
            {/* Time Range */}
            <div className="flex rounded-lg border dark:border-gray-600 overflow-hidden">
              {timeRanges.map((range) => (
                <button
                  key={range.id}
                  onClick={() => setTimeRange(range.id)}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                    timeRange === range.id
                      ? 'bg-primary-500 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {range.name}
                </button>
              ))}
            </div>

            {/* Chart Type */}
            <div className="flex rounded-lg border dark:border-gray-600 overflow-hidden">
              {chartTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setChartType(type.id)}
                  className={`px-3 py-1.5 text-xs transition-colors ${
                    chartType === type.id
                      ? 'bg-primary-500 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                  title={type.name}
                >
                  <i className={type.icon} />
                </button>
              ))}
            </div>

            {/* Export */}
            {showExport && (
              <div className="relative group">
                <Button
                  variant="outline"
                  size="sm"
                  icon="fas fa-download"
                  className="w-full sm:w-auto"
                >
                  Exportar
                </Button>
                <div className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-gray-800 border dark:border-gray-600 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                  <button
                    onClick={() => handleExport('csv')}
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-lg"
                  >
                    <i className="fas fa-file-csv mr-2" />
                    CSV
                  </button>
                  <button
                    onClick={() => handleExport('image')}
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-b-lg"
                  >
                    <i className="fas fa-image mr-2" />
                    Imagen
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Chart */}
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>

      {/* Footer Stats */}
      {data.length > 0 && (
        <div className="mt-6 pt-4 border-t dark:border-gray-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.keys(data[0] || {})
              .filter(key => key !== 'name')
              .slice(0, 4)
              .map((key, index) => {
                const values = data.map(item => item[key]).filter(val => typeof val === 'number');
                const total = values.reduce((sum, val) => sum + val, 0);
                const average = values.length > 0 ? total / values.length : 0;
                const max = Math.max(...values);

                return (
                  <div key={key} className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      {key}
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {total.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400">
                      Promedio: {average.toFixed(1)}
                    </p>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </Card>
  );
};

export default StatsChart;