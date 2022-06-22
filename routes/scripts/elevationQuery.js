const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args))
const apiKey = 'AAPK1d27ba2b591940bf902e2d27826f3ac5nrZPMwXkiikc0pbR58R5DagUgX9rhM2SCcM2zIAj8DX_yutUB72up4sUVYkCqXrF'

function queryElevationUSGS(latlng){
    console.log('latlng', latlng)
    return fetch(`https://nationalmap.gov/epqs/pqs.php?x=${latlng.lng}&y=${latlng.lat}&units=Meters&output=json`)
        .then(resp => resp.json())
        .then(json => {
            console.log(json)
            return json.USGS_Elevation_Point_Query_Service.Elevation_Query;
        })
        .catch(err => console.log('elevation query error', err))
}

function queryElevationEsri(feat){
    console.log('feat', feat)
    const submitUrl = 'https://elevation.arcgis.com/arcgis/rest/services/Tools/Elevation/GPServer/SummarizeElevation/submitJob'

    const inputJson = {
        "geometryType": "esriGeometryPoint",
        "spatialReference": {
            "wkid": 4326
        },
        "fields": [
            {
                "name": "Id",
                "type": "esriFieldTypeOID",
                "alias": "Id"
            },
            {
                "name": "Name",
                "type": "esriFieldTypeString",
                "alias": "Name"
            }
        ],
        "features": feat.map((latlng, i) => {
            // console.log('latlng', latlng)
            let randomId = Math.floor(Math.random() * 10000)
            let geom = {
                "geometry": {
                    "x": latlng.lng,
                    "y": latlng.lat
                },
                "attributes": {
                    "Id": randomId,
                    "Name": `Feature ${randomId}`
                }
            } 
            return geom;
        })
    }

    console.log('inputJson', JSON.stringify(inputJson, null, '\t'))

    const InputFeatures = encodeURIComponent(JSON.stringify(inputJson))

    // console.log('InputFeatures', InputFeatures)

    const requestUrl = `${submitUrl}?f=json&token=${apiKey}&FeatureIDField=Id&InputFeatures=${InputFeatures}&DEMResolution=FINEST`
    // console.log('requestUrl', requestUrl)
    return fetch(requestUrl, {
        method: 'POST',
        header: {
            'Content-Type': 'application/xwww-form-urlencoded'
        }
    }).then(res => res.json())
    .then(job => {
        console.log(job)
        return new Promise(async (resolve, reject) => {
            async function checkJobStatus(id){
                let jobStatusUrl = `https://elevation.arcgis.com/arcgis/rest/services/Tools/Elevation/GPServer/SummarizeElevation/jobs/${id}?f=json&token=${apiKey}`;
                let resp = await fetch(jobStatusUrl, { 
                    headers: { 
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }, 
                    method: 'POST' 
                })
                // console.log('resp', resp)
                let status = await resp.json();
                // console.log('status', status)

                if (status.jobStatus === 'esriJobFailed'){
                    reject(status)
                } else if (status.jobStatus === 'esriJobSucceeded'){
                    resolve(status)
                } else if (status.jobStatus === 'esriJobExecuting' || status.jobStatus === 'esriJobSubmitted'){
                    setTimeout(checkJobStatus, 1000, id)
                } else {
                    reject(status)
                }
            }
            checkJobStatus(job.jobId);
        })
    })
    .then(jobStatus => {
        console.log('jobStatus succeeded', jobStatus)
        const outputSummaryUrl = `https://elevation.arcgis.com/arcgis/rest/services/Tools/Elevation/GPServer/SummarizeElevation/jobs/${jobStatus.jobId}/results/OutputSummary?token=${apiKey}&f=json`

        return fetch(outputSummaryUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
    })
    .then(res => res.json())
    .catch(err => console.log('jobStatus err', err))
}

module.exports = queryElevationEsri;
// export default queryElevation;