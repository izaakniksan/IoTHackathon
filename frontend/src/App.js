import React, { Component } from 'react';
import './App.css';
import '../node_modules/react-vis/dist/style.css';

import Plot from 'react-plotly.js';
const dataUrl = 'http://localhost:3001/data';
const recentDataUrl = 'http://localhost:3001/recentData';
class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      layout: { width: 1280, height: 960, title: 'Air quality' },
      frames: [],
      config: {}
    };
    this.getItems = this.getItems.bind(this);
  }

  componentDidMount() {
    console.log('fetching');
    fetch(dataUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      credentials: "same-origin"
    })
      .then(res => {
        if (res.status === 200) {
          return res
        }
      })
      .then(res => res.json())
      .then(res => {
        var plotData = [[], [], [], [], []];
        for (var i = 0; i < res.length; i++) {
          plotData[0].push(res[i].payload.d.time);
          plotData[1].push(res[i].payload.d.Temp);
          plotData[2].push(res[i].payload.d.Pressure);
          plotData[3].push(res[i].payload.d.Humidity);
          plotData[4].push(res[i].payload.d.Gas);
        }
        var updatedData = [
          {
            x: plotData[0],
            y: plotData[1],
            type: 'scatter',
            mode: 'lines+points',
            marker: { color: 'red' },
            name: 'Temp'
          },
          {
            x: plotData[0],
            y: plotData[2],
            type: 'scatter',
            mode: 'lines+points',
            marker: { color: 'blue' },
            name: 'Pressure'
          },
          {
            x: plotData[0],
            y: plotData[3],
            type: 'scatter',
            mode: 'lines+points',
            marker: { color: 'green' },
            name: 'Humidity'
          },
          {
            x: plotData[0],
            y: plotData[4],
            type: 'scatter',
            mode: 'lines+points',
            marker: { color: 'yellow' },
            name: 'Gas'
          }
        ];
        console.log(plotData);
        console.log(this.state.data);

        this.setState({ data: this.state.data.concat(updatedData) });
      })
      .catch(err => console.log(err));

    this.timer = setInterval(() => this.getItems(), 1000);
  }

  getItems() {
    fetch(recentDataUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: "same-origin"
    })
      .then(res => {
        if (res.status === 200) {
          return res
        }
      })
      .then(res => res.json())
      .then(res => {
        var plotData = [[], [], [], [], []];
        for (var i = 0; i < res.length; i++) {
          plotData[0].push(res[i].payload.d.time);
          plotData[1].push(res[i].payload.d.Temp);
          plotData[2].push(res[i].payload.d.Pressure);
          plotData[3].push(res[i].payload.d.Humidity);
          plotData[4].push(res[i].payload.d.Gas);
        }
        var concatData = this.state.data;
        console.log('data: ', this.state.data[0].x.length);
        concatData[0].x = concatData[0].x.concat(plotData[0]);
        concatData[0].y = concatData[0].y.concat(plotData[1]);
        concatData[1].x = concatData[1].x.concat(plotData[0]);
        concatData[1].y = concatData[1].y.concat(plotData[2]);
        concatData[2].x = concatData[2].x.concat(plotData[0]);
        concatData[2].y = concatData[2].y.concat(plotData[3]);
        concatData[3].x = concatData[3].x.concat(plotData[0]);
        concatData[3].y = concatData[3].y.concat(plotData[4]);
        this.setState({data: concatData});
        console.log('data: ', this.state.data[0].x.length);
        this.forceUpdate();
      })
      .catch(err => console.log(err));
  }


  render() {
    return (
      <Plot
        data={this.state.data}
        layout={this.state.layout}
        frames={this.state.frames}
        config={this.state.config}
        onInitialized={(figure) => this.setState(figure)}
        onUpdate={(figure) => this.setState(figure)}
      />
    );

  }
}

export default App;