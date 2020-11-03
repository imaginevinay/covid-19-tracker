import React, { useState, useEffect } from 'react';
import { FormControl, Select, MenuItem, CardContent, Card } from '@material-ui/core'
import axiosInstance from './axiosInstance';
import requests from './requests';
import InfoBox from './InfoBox';
import './Navbar.css';
import Map from './Map';
import Table from './Table';
import Graph from './Graph';
import { sortData, prettyPrintStat } from './util';
function Navbar() {
    const [countries, setcountries] = useState([]);
    const [country, setcountry] = useState('worldwide');
    const [countryInfo, setcountryInfo] = useState({});
    const [tableData, settableData] = useState([])
    const [mapCenter, setmapCenter] = useState({ lat: 34.80746, lng: -40.4796 })
    const [mapZoom, setmapZoom] = useState(3);
    const [mapCountries, setmapCountries] = useState([]);
    const [casesType, setcasesType] = useState('cases');

    // getting list of countries
    useEffect(() => {
        const getCountries = async () => {
            await axiosInstance.get(requests.countries)
                .then(data => {
                    const countries = data.data.map(country => (
                        {
                            name: country.country,
                            value: country.countryInfo.iso2
                        }
                    ))
                    const sortedData = sortData(data.data)
                    settableData(sortedData)
                    setmapCountries(data.data);
                    setcountries(countries);
                })
        }
        getCountries();
    }, [])

    // initial api call for worldwide stats
    useEffect(() => {
        axiosInstance.get(requests.worldwide)
            .then(data => {
                setcountryInfo(data.data)
            })
    }, [])

    // on dropdown select getting stats for each select
    const onCountryChange = async (e) => {
        setmapZoom(3)
        const countryCode = e.target.value

        const url = countryCode === 'worldwide' ? requests.worldwide : requests.countries + `/${countryCode}`;
        await axiosInstance.get(url)
            .then(data => {
                // console.log('lat lng data >>',[data.data.countryInfo.lat, data.data.countryInfo.long])
                setcountry(countryCode);
                setcountryInfo(data.data);
                if (countryCode === 'worldwide') {
                    setmapCenter([40.416775, -3.703790])
                } else {
                    setmapCenter([data.data.countryInfo.lat, data.data.countryInfo.long])
                }
                setmapZoom(4)
            })
    }
    return (
        <div className="mainContainer">
            <div className="app_left">
                <div className="app_header">
                    <h1>COVID-19 TRACKER</h1>
                    <FormControl className="app_dropdown">
                        <Select variant="outlined" onChange={onCountryChange} value={country}>
                            <MenuItem value="worldwide">Worldwide</MenuItem>
                            {
                                countries.map((country) => {
                                    return <MenuItem value={country.value}>{country.name}</MenuItem>
                                })
                            }
                        </Select>
                    </FormControl>
                </div>
                <div className="app_stats">
                    <InfoBox 
                        isRed
                        active={casesType==='cases'}
                        onClick={e => setcasesType('cases')} 
                        cases={prettyPrintStat(countryInfo.todayCases)} 
                        total={prettyPrintStat(countryInfo.cases)} title="Coronavirus Cases" />
                    <InfoBox 
                        active={casesType==='recovered'}
                        onClick={e => setcasesType('recovered')} 
                        cases={prettyPrintStat(countryInfo.todayRecovered)} 
                        total={prettyPrintStat(countryInfo.recovered)} title="Recovered" />
                    <InfoBox 
                        isRed
                        active={casesType==='deaths'}
                        onClick={e => setcasesType('deaths')} 
                        cases={prettyPrintStat(countryInfo.todayDeaths)} 
                        total={prettyPrintStat(countryInfo.deaths)} title="Deaths" />
                </div>
                <Map 
                    countries={mapCountries} 
                    center={mapCenter} zoom={mapZoom} 
                    key={Math.random()}
                    casesType={casesType}
                ></Map>
            </div>
            <div className="app_right">
                <Card className="table_card">
                    <CardContent>
                        <h3>Live {casesType} stats by country</h3>
                        <Table countries={tableData} casesType={casesType} />
                    </CardContent>
                </Card>
                <Card className="graph_card">
                    <CardContent>
                        <h3 className="graph_heading">Latest {casesType} trend</h3>
                        <Graph className="app_graph" casesType={casesType} />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default Navbar
