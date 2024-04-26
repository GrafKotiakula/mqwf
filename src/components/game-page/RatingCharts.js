import React from 'react'

import { Radar } from 'react-chartjs-2'
import Chart from "chart.js/auto";        // required for react-chartjs-2
import { CategoryScale } from "chart.js"; // required for react-chartjs-2

import { isNotEmptyString } from '../../utils/varUtils';
import { positiveRatings, neutralRatings, negativeRatings } from '../../utils/dataUtils';

import styles from './RatingCharts.module.css'

export const RatingRadarChart = ({data, color={r: 0, g:0, b:0}, title}) => (
  // container (div) style is required by chart.js and should not be changed
  <div style={{position: 'relative', width: '100%', height: '100%'}}>
    <Radar 
      data={{
        labels: Object.keys(data),
        datasets: [{ 
            data: Object.values(data), 
            backgroundColor: `rgba(${color.r}, ${color.g}, ${color.b}, 0.5)`, 
            borderColor: `rgba(${color.r}, ${color.g}, ${color.b}, 1)`
        }]
      }}
      
      options={{
        r: { suggestedMin: 0, suggestedMax: 10 },
        plugins: {
          legend: { display: false },
          title: {
            display: isNotEmptyString(title),
            text: title
          }
        }
      }}
    />
  </div>
)

const RatingCharts = ({game}) => {
  const {avgRating:ratings={}} = game
  return (
    <div className={styles['charts-container']}>
      <RatingRadarChart data={positiveRatings(ratings)} color={{r:0,   g:150, b:50 }} />
      <RatingRadarChart data={neutralRatings(ratings)}  color={{r:0,   g:150, b:255}} />
      <RatingRadarChart data={negativeRatings(ratings)} color={{r:200, g:50,  b:0  }}   />
    </div>
  )
}

export default RatingCharts