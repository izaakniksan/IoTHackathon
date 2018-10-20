import React, { Component } from 'react';
import './App.css';
import { DATA } from './data';
import '../node_modules/react-vis/dist/style.css';
import {
  XYPlot, XAxis, YAxis, VerticalGridLines,
  HorizontalGridLines, LineMarkSeries
} from 'react-vis';

class App extends Component {

  render() {
    var data = [[], [], [], []];
    console.log(DATA);
    for (var i = 0; i < DATA.length; i++) {
      data[0].push({ x: i, y: DATA[i].d.Temp });
      data[1].push({ x: i, y: DATA[i].d.Pressure / 10 })
      data[2].push({ x: i, y: DATA[i].d.Humidity });
      data[3].push({ x: i, y: DATA[i].d.Gas });
    }

    return (
      <div className="App">
        <XYPlot height={600} width={600}>
          <VerticalGridLines />
          <HorizontalGridLines />
          <XAxis />
          <YAxis />
          <LineMarkSeries
            className="tempSeries"
            style={{strokeWidth: '3px'}}
            data={data[0]} />
          <LineMarkSeries className="pressureSeries" data={data[1]} />
          <LineMarkSeries className="humiditySeries" data={data[2]} />
          <LineMarkSeries className="gasSeries" data={data[3]} />
        </XYPlot>
      </div>
    );

  }
}

export default App;