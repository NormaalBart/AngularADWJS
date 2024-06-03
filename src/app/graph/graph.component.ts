import { Component, Input, OnInit } from '@angular/core';
import { Chart, ChartData, ChartOptions, ChartType, registerables } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Mutation } from '../models/mutation.interface';
import { CommonModule } from '@angular/common';

// Register Chart.js modules
Chart.register(...registerables);

@Component({
  selector: 'app-graph',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './graph.component.html',
})
export class GraphComponent implements OnInit {

  @Input() mutations: Mutation[] = [];
  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public chartLabels: string[] = [];
  public chartLegend = true;
  public chartData: ChartData<'bar' | 'line'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Amounts' }
    ]
  };
  public chartType: ChartType = 'bar';
  public viewBy: 'month' | 'day' = 'month'; // State to track the view type

  ngOnInit() {
    this.updateChart();
  }

  toggleChartType() {
    this.chartType = this.chartType === 'bar' ? 'line' : 'bar';
  }

  toggleViewBy() {
    this.viewBy = this.viewBy === 'month' ? 'day' : 'month';
    this.updateChart();
  }

  updateChart() {
    if (this.viewBy === 'month') {
      this.updateChartByMonth();
    } else {
      this.updateChartByDay();
    }
  }

  updateChartByMonth() {
    const mutationsByMonth: { [key: string]: number } = {};

    this.mutations.forEach(mutation => {
      const date = new Date(mutation.date.seconds * 1000);
      const month = date.toLocaleString('default', { month: 'long' });

      if (!mutationsByMonth[month]) {
        mutationsByMonth[month] = 0;
      }

      mutationsByMonth[month] += mutation.amount;
    });

    this.chartLabels = Object.keys(mutationsByMonth);
    const data = Object.values(mutationsByMonth);

    this.chartData = {
      labels: this.chartLabels,
      datasets: [
        { data, label: 'Amounts' }
      ]
    };
  }

  updateChartByDay() {
    const mutationsByDay: { [key: string]: number } = {};

    this.mutations.forEach(mutation => {
      const date = new Date(mutation.date.seconds * 1000);
      const day = date.toISOString().split('T')[0];

      if (!mutationsByDay[day]) {
        mutationsByDay[day] = 0;
      }

      mutationsByDay[day] += mutation.amount;
    });

    this.chartLabels = Object.keys(mutationsByDay).sort();
    const data = Object.values(mutationsByDay);

    this.chartData = {
      labels: this.chartLabels,
      datasets: [
        { data, label: 'Amounts' }
      ]
    };
  }
}
