import React from 'react';
import {
    Chart,
    Series,
    ArgumentAxis,
    CommonSeriesSettings,
    CommonAxisSettings,
    Grid,
    Export,
    Legend,
    Margin,
    Tooltip,
    Label,
    Format,
    Size
} from 'devextreme-react/chart';

export default function LineGraph(props) {
    return (
        <React.Fragment>
            <Chart
                palette="Violet"
                dataSource={props.dataSource.data}
                title="Budget Tracking"
            >
                <Size height={470}></Size>
                <CommonSeriesSettings
                    argumentField="time"
                    type={'spline'}
                />
                <CommonAxisSettings>
                    <Grid visible={true} />
                </CommonAxisSettings>
                {
                    props.dataSource.sources.map(function (item) {
                        return <Series color={item.color} key={item.value} valueField={item.value} name={item.name} />;
                    })
                }
                <Margin bottom={20} />
                <ArgumentAxis
                    allowDecimals={false}
                    axisDivisionFactor={60}
                >
                    <Label>
                        <Format type="decimal" />
                    </Label>
                </ArgumentAxis>
                <Legend
                    verticalAlignment="bottom"
                    horizontalAlignment="center"
                />
                <Export enabled={false} />
                <Tooltip enabled={true} />
            </Chart>
        </React.Fragment>
    );
}

