import qs from 'querystring'
import Promise from 'bluebird'
import req from 'request-promise'
import urls from '../urls'
import {closest} from '../lib/gis'

export function featuresToPoints(result, attribute='Name') {

  return result.features.map(feature => {
    return {
      name: feature.attributes[attribute],
      lat: feature.geometry.y,
      lon: feature.geometry.x
    }
  })
}

export function fetchVertexesByReference(point, bufferDistance=500) {

  console.log('fetch vertex');

  let params = {
    geometry: `${point.lon},${point.lat}`,
    geometryType: 'esriGeometryPoint',
    spatialRel: 'esriSpatialRelIntersects',
    resultType: 'standard',
    distance: bufferDistance,
    units: 'esriSRUnit_Meter',
    f: 'json'
  }

  return req({
    uri: `${urls.get('vertex')}/query?${qs.stringify(params)}`,
    json: true
  })
}

export function getClosestVertex(point, result) {

  return Promise.resolve({
    origin: {
      point: point,
      vertex: closest(point, featuresToPoints(result))
    }
  })
}
