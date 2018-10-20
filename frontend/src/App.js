import React, { Component } from 'react';
import './App.css';
import { DATA } from './data';
import '../node_modules/react-vis/dist/style.css';
import Cloudant from '@cloudant/cloudant';

import Plot from 'react-plotly.js';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      layout: { width: 1280, height: 960, title: 'Air quality' },
      frames: [],
      config: {}
    };
  }

  componentDidMount() {

    fetch('http://localhost:3002/alert').
    then(response => response.json()).then((alert) => {
      console.log(alert);
      this.setState({
        alert: alert
      });
    });

    // let headers = new Headers();
    // headers.append('Authorization', 'Basic ' + username + ":" + password));
    // fetch(dburl, {
    //   headers: headers
    // })
    // .then(res => {
    //   if (res.status == 200) {
    //     console.log(res.json);
    //   }
    // })
    // .catch(err => console.log(err));

    var plotData = [[], [], [], [], []];
    console.log(DATA);
    for (var i = 0; i < DATA.length; i++) {
      plotData[0].push(i);
      plotData[1].push(DATA[i].d.Temp);
      plotData[2].push(DATA[i].d.Pressure);
      plotData[3].push(DATA[i].d.Humidity);
      plotData[4].push(DATA[i].d.Gas);
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

    this.setState({ data: updatedData });
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
