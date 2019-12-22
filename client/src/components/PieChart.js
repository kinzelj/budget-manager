import React, { useEffect } from 'react';
import { PieChart, Pie, Cell, Sector } from 'recharts';
import { colors } from '../templates/colors.js'



const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
    fill, percent, value, name } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 8) * cos;
  const sy = cy + (outerRadius + 8) * sin;
  const mx = cx + (outerRadius + 15) * cos;
  const my = cy + (outerRadius + 15) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text fontSize='large' fontWeight='bolder' x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>{name}</text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none"/>
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none"/>
      {/* <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{name}</text> */}
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#333">
				{`Total: $${value.toFixed(2)}`}
			</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={2*18} textAnchor={textAnchor} fill="#999">
        {`(${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

export default function PieGraph(props) {
  const data = props.data;
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [chartColors, setChartColors] = React.useState(data.map((value,index)=>{ return colors[index] }));

  const getColors = (data) => {
    const newColors =  data.map((value, index)=>{ return colors[index] })
    setChartColors(newColors);
  }

  useEffect(() => {
    getColors(data);
  }, [data])

  const chartClick = (event) => {
   console.log(event); 
  }
  
  const onPieEnter = (data, index) => { setActiveIndex(index) }
    
  return (
    <div>
    	<PieChart width={props.minWidth} height={500}>
        <Pie 
   					activeIndex={activeIndex}
            activeShape={renderActiveShape}  
            onMouseEnter={onPieEnter} 
            onClick={chartClick} 
            data={data} 
            dataKey="value" 
            nameKey="name" 
            cx="45%" 
            cy="50%" 
            outerRadius={150} 
            innerRadius={100} 
    			>
          {
            data.map((entry, index) => (
              <Cell dataKey="value" key={`cell-${index}`} fill={chartColors[index]} />
            ))
          }
				</Pie >
      </PieChart>
    </div>
  );
}


    
  
                            
