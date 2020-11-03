// helper fuctions
import numeral from "numeral";
import {Circle, Popup} from 'react-leaflet';
import React from 'react';

export const sortData = (data) => {
    const sortedData = [...data];
    sortedData.sort((a, b) => {
        if (a.cases > b.cases) return -1;
        else return 1
    })

    return sortedData;
}

export const buildChartData = (data, casesType = 'cases') => {
    const chartData = [];
    let lastDataPoint;
    for (let date in data[casesType]) {
        if (lastDataPoint) {
            const newDataPoint = {
                x: date,
                y: data[casesType][date] - lastDataPoint
            }
            chartData.push(newDataPoint)
        }
        lastDataPoint = data[casesType][date];
    }
    return chartData
}

export const graphOptions =  {
    options : {
        legend: {
          display: false,
        },
        elements: {
          point: {
            radius: 0,
          },
        },
        maintainAspectRatio: false,
        tooltips: {
          mode: "index",
          intersect: false,
          callbacks: {
            label: function (tooltipItem, data) {
              return numeral(tooltipItem.value).format("+0,0");
            },
          },
        },
        scales: {
          xAxes: [
            {
              type: "time",
              time: {
                format: "MM/DD/YY",
                tooltipFormat: "ll",
              },
            },
          ],
          yAxes: [
            {
              gridLines: {
                display: false,
              },
              ticks: {
                // Include a dollar sign in the ticks
                callback: function (value, index, values) {
                  return numeral(value).format("0a");
                },
              },
            },
          ],
        },
      }
}

const casesTypeColors = {
  cases: {
    hex: "#CC1034",
    multiplier: 800,
  },
  recovered: {
    hex: "#7dd71d",
    multiplier: 1200,
  },
  deaths: {
    hex: "#fb4443",
    multiplier: 2000,
  },
};

// draw circles on map
export const showCirclesOnMap = (data,casesType='cases') => (
  data.map(country => (
    <Circle
    center={[country.countryInfo.lat, country.countryInfo.long]}
    color={casesTypeColors[casesType].hex}
    fillColor={casesTypeColors[casesType].hex}
    fillOpacity={0.4}
    radius={
      Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
    }
  >
    <Popup>
      <div className="info-container">
        <div
          className="info-flag"
          style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
        ></div>
        <div className="info-name">{country.country}</div>
        <div className="info-confirmed">
          Cases: {numeral(country.cases).format("0,0")}
        </div>
        <div className="info-recovered">
          Recovered: {numeral(country.recovered).format("0,0")}
        </div>
        <div className="info-deaths">
          Deaths: {numeral(country.deaths).format("0,0")}
        </div>
      </div>
    </Popup>
  </Circle>
  ))
)


export const prettyPrintStat = (num) => {
  return num ? `+${numeral(num).format('0.0a')}` : '+0';
}