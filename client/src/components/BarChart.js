import React from 'react';
import { Chart, Series, CommonSeriesSettings, Label, Format, Legend, Export, Size } from 'devextreme-react/chart';

export default function BarChart(props) {
    const data = props.data;
    const onPointClick = (e) => {
        e.target.select();
    }

    return (
        <Chart id="chart"
            title="Monthly Expenses"
            dataSource={data}
            onPointClick={onPointClick}
        >
            <Size height={470}></Size>
            <CommonSeriesSettings
                argumentField="expense"
                type="bar"
                hoverMode="allArgumentPoints"
                selectionMode="allArgumentPoints"
            >
                <Label visible={true}>
                    <Format type="fixedPoint" precision={0} />
                </Label>
            </CommonSeriesSettings>
            <Series
                valueField="actual"
                name="Actual"
                color="#f50057"
            />
            <Series
                valueField="budget"
                name="Budget"
                color="#3f51b5"
            />
            <Legend verticalAlignment="bottom" horizontalAlignment="center"></Legend>
            <Export enabled={false} />
        </Chart>
    );

}
