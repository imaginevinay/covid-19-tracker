import React,{useState, useEffect} from 'react'
import {Line} from 'react-chartjs-2';
import "./Graph.css";
import axiosInstance from './axiosInstance';
import requests from './requests';
import { buildChartData, graphOptions } from './util';

function Graph({casesType = 'cases', ...props}) {
    const [data, setdata] = useState({});
    useEffect(() => {
        axiosInstance.get(requests.historicalData)
            .then(data => {
                console.log(data.data)
                const chartData = buildChartData(data.data, casesType)
                setdata(chartData)
            })
    }, [casesType])


    return (
        <div className={props.className}>
            {data?.length && (
                <Line data={{
                    datasets: [
                        {   label: 'My First dataset',
                            backgroundColor: (casesType==='cases' || casesType==='deaths') ? "rgba(204, 16, 52, 0.5)" : "lightgreen",
                            borderColor: (casesType==='cases' || casesType==='deaths') ? "#CC1034" : "#34d656",
                            data: data,
                        }
                    ]
                }} options={graphOptions.options} />
            )}
        </div>
    )
}

export default Graph
