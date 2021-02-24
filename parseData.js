import fs, { readFileSync, write, writeFileSync } from 'fs'
import csv from 'csv-parser'
import { type } from 'os'

// Format
//
// [
//     [
//     'seriesA', [ latitude, longitude, magnitude, latitude, longitude, magnitude, ... ]
//     ]
// ];

//   {  countrydata
//     country: 'Indonesia',
//     alpha2: 'ID',
//     alpha3: 'IDN',
//     numeric: 360,
//     latitude: -5,
//     longitude: 120
//   },

// {    internetdata
//     '﻿SeriesName': 'Individuals using the Internet (% of population)',
//     Code: 'IT.NET.USER.ZS',
//     country: 'Jordan',
//     CountryCode: 'JOR',
//     data: '66.7903'
//   },

let internetData = []
let countryData = []
let parsedData = []
fs.createReadStream('./data/internetData.csv')
  .pipe(csv())
  .on('data', (row) => {
    internetData.push(row)
  })
  .on('end', () => {
    console.log('CSV file successfully processed')
    // console.log(internetData)

    countryData = readFileSync('./data/countryData.json')
    countryData = JSON.parse(countryData)
    countryData = countryData.codes
    // console.log(countryData)
    combineData()
    parsedData = [['2019', parsedData]]
    console.log(parsedData)

    writeFileSync('./data/data.json', JSON.stringify(parsedData))
  })

function combineData() {
  for (let i = 0; i < internetData.length; i++) {
    if (internetData[i].data === '..') {
      continue
    }
    let countryCode = internetData[i].countryCode
    let mag = +internetData[i].data / 200

    const indexOfCountry = (el) => el.alpha3 === countryCode
    let index = countryData.findIndex(indexOfCountry)
    if (index === -1) {
      continue
    }

    parsedData.push(countryData[index].latitude)
    parsedData.push(countryData[index].longitude)
    parsedData.push(mag)
  }
}
