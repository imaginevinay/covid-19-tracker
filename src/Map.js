import React from 'react'
import './Map.css'
import { MapContainer as LeafletMap, TileLayer } from "react-leaflet";
import {showCirclesOnMap} from './util'

function Map({countries, casesType, center, zoom, key}) {
    return (
        <div className="map">
            {console.log('center >>', center, ' zoom>>', zoom)}
            <LeafletMap key={key} center={center} zoom={zoom}>
                <TileLayer 
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'/>
                {showCirclesOnMap(countries, casesType)}
            </LeafletMap>
        </div>
    )
}

export default Map
