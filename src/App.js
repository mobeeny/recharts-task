import React, { useState, useEffect } from "react";
import "./App.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceArea,
  Brush,
  Bar,
  BarChart,
} from "recharts";
import CustomLegend from "./CustomLegend";

// const COLORS = {
//   Flow_1: "#82ca9d",
//   Flow_2: "#19AADE",
//   Flow_3: "#8884d8",
//   Flow_4: "#EF7E32",
//   Flow_5: "#EB548C",
// };

const COLORS = {
  Flow_1: "#646b81",
  Flow_2: "#598cb1",
  Flow_3: "#929bc6",
  Flow_4: "#cba9db",
  Flow_5: "#e2b6cd",
};

const RANGE = {
  start: 0,
  end: 99, //Change this value to increase data points on x-axis
};

const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(secs).padStart(2, "0")}`;
};

function generateRandomData(numPoints) {
  const data = [];

  for (let i = 0; i < numPoints; i++) {
    data.push({
      // time:  Math.floor(i * (10000 / numPoints)),  // Time ranging from 0 to 10000
      time: i,
      Flow1: Math.floor(Math.random() * 5000) + 1000,
      Flow2: Math.floor(Math.random() * 6000) + 1000,
      Flow3: Math.floor(Math.random() * 7000) + 1000,
      Flow4: Math.floor(Math.random() * 8000) + 1000,
      Flow5: Math.floor(Math.random() * 9000) + 1000,
    });
  }

  return data;
}

const initialData = generateRandomData(RANGE.end + 1); 
const getAxisYDomain = (from, to, ref, offset) => {
  const refData = initialData.slice(from, to);
  let [bottom, top] = [refData[0][ref], refData[0][ref]];
  refData.forEach((d) => {
    if (d[ref] > top) top = d[ref];
    if (d[ref] < bottom) bottom = d[ref];
  });

  return [(bottom | 0) - offset, (top | 0) + offset];
};

function App() {
  const [state, setState] = useState({
    data: initialData,
    left: RANGE.start,
    right: RANGE.end,
    refAreaLeft: "",
    refAreaRight: "",
    top: "dataMax+1",
    bottom: "dataMin-1",
    top2: "dataMax+20",
    bottom2: "dataMin-20",
    brushKey: false,
    animation: true,
    activeLine: null,
  });

  const {
    data,
    left,
    right,
    refAreaLeft,
    refAreaRight,
    top,
    bottom,
    activeLine,
  } = state;

  const [visibleFlow, setVisibleFlow] = useState({
    Flow1: true,
    Flow2: true,
    Flow3: true,
    Flow4: true,
    Flow5: true,
  });

  const returnData = (start, stop) => {
    const ndata = [];

    for (let i = start; i < stop; i++) {
      ndata.push({
        time: i,
        Flow1: Math.floor(Math.random() * 5000) + 1000,
        Flow2: Math.floor(Math.random() * 6000) + 1000,
        Flow3: Math.floor(Math.random() * 7000) + 1000,
        Flow4: Math.floor(Math.random() * 8000) + 1000,
        Flow5: Math.floor(Math.random() * 9000) + 1000,
      });
    }
    setState({
      ...state,
      data: ndata,
      brushKey: !state.brushKey,
    });
  };

  useEffect(() => {
    console.log("Left and Right changed:", left, right, state.brushKey);
    returnData(left, right);
    setState({
      ...state,
      brushKey: !state.brushKey,
    });
  }, [left, right]);

  const handleBrushChange = (brushData) => {
    if (
      brushData &&
      brushData.startIndex !== undefined &&
      brushData.endIndex !== undefined
    ) {
      const { startIndex, endIndex } = brushData;
      console.log(
        "Brush : ",
        left,
        right,
        startIndex,
        endIndex,
        state.brushKey
      );
      setState({
        ...state,
        left: startIndex,
        right: endIndex,
      });
    }
  };

  const handleMouseEnter = (id) => {
    setState((prevState) => ({ ...prevState, activeLine: id }));
  };
  const handleMouseLeave = () => {
    setState((prevState) => ({ ...prevState, activeLine: null }));
  };

  const chart = (id, s1, s2) => (
    <ResponsiveContainer
      width="100%"
      height="100%">
      <LineChart
        width={500}
        height={300}
        syncId="sync"
        data={data}
        onMouseDown={(e) => setState({ ...state, refAreaLeft: e.activeLabel })}
        onMouseMove={(e) =>
          refAreaLeft && setState({ ...state, refAreaRight: e.activeLabel })
        }
        onMouseUp={zoom}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="time"
          type="number"
          allowDataOverflow
          domain={[left, right]}
          tickFormatter={formatTime}
          tickCount={10}
        />
        <YAxis
          yAxisId="left"
          type="number"
          allowDataOverflow
          domain={[`bottom1`, `top1`]}
          label={{
            value: "Bitrate [Mbps]",
            angle: -90,
            offset: -5,
            position: "insideLeft",
            dy: 40,
          }}
        />
        <YAxis
          yAxisId="right"
          type="number"
          allowDataOverflow
          domain={[`bottom2`, `top2`]}
          label={{
            value: "Latency [ms]",
            angle: 90,
            offset: -10,
            position: "insideRight",
            dy: 20,
          }}
          orientation="right"
        />
        <Tooltip />

        {visibleFlow.Flow1 && (
          <Line
            yAxisId="left"
            type="monotone"
            dataKey={`Flow1`}
            onMouseEnter={() => handleMouseEnter("Flow1")}
            onClick={() => handleMouseEnter("Flow1")}
            onMouseLeave={handleMouseLeave}
            strokeWidth={activeLine === "Flow1" ? 2.2 : 1}
            strokeOpacity={activeLine && activeLine !== "Flow1" ? 0.5 : 1}
            stroke={COLORS.Flow_1}
            activeDot={{ r: 8 }}
            dot={null}
          />
        )}
        {visibleFlow.Flow2 && (
          <Line
            yAxisId="right"
            type="monotone"
            dataKey={`Flow2`}
            onMouseEnter={() => handleMouseEnter("Flow2")}
            onClick={() => handleMouseEnter("Flow2")}
            onMouseLeave={handleMouseLeave}
            strokeWidth={activeLine === "Flow2" ? 2.2 : 1}
            strokeOpacity={activeLine && activeLine !== "Flow2" ? 0.5 : 1}
            stroke={COLORS.Flow_2}
            dot={null}
          />
        )}
        {visibleFlow.Flow3 && (
          <Line
            yAxisId="right"
            type="monotone"
            dataKey={`Flow3`}
            onMouseEnter={() => handleMouseEnter("Flow3")}
            onClick={() => handleMouseEnter("Flow3")}
            onMouseLeave={handleMouseLeave}
            strokeWidth={activeLine === "Flow3" ? 2.2 : 1}
            strokeOpacity={activeLine && activeLine !== "Flow3" ? 0.5 : 1}
            stroke={COLORS.Flow_3}
            dot={null}
          />
        )}
        {visibleFlow.Flow4 && (
          <Line
            yAxisId="right"
            type="monotone"
            dataKey={`Flow4`}
            onMouseEnter={() => handleMouseEnter("Flow4")}
            onClick={() => handleMouseEnter("Flow4")}
            onMouseLeave={handleMouseLeave}
            strokeWidth={activeLine === "Flow4" ? 2.2 : 1}
            strokeOpacity={activeLine && activeLine !== "Flow4" ? 0.5 : 1}
            stroke={COLORS.Flow_4}
            dot={null}
          />
        )}
        {visibleFlow.Flow5 && (
          <Line
            yAxisId="right"
            type="monotone"
            dataKey={`Flow5`}
            onMouseEnter={() => handleMouseEnter("Flow5")}
            onClick={() => handleMouseEnter("Flow5")}
            onMouseLeave={handleMouseLeave}
            strokeWidth={activeLine === "Flow5" ? 2.2 : 1}
            strokeOpacity={activeLine && activeLine !== "Flow5" ? 0.5 : 1}
            stroke={COLORS.Flow_5}
            dot={null}
          />
        )}

        {refAreaLeft && refAreaRight ? (
          <ReferenceArea
            yAxisId="left"
            x1={refAreaLeft}
            x2={refAreaRight}
            strokeOpacity={0.3}
          />
        ) : null}
      </LineChart>
    </ResponsiveContainer>
  );

  const barChart = (id, s1, s2) => (
    <ResponsiveContainer
      width="100%"
      height="100%">
      <BarChart
        width={500}
        height={300}
        syncId="sync"
        data={data}
        onMouseDown={(e) => setState({ ...state, refAreaLeft: e.activeLabel })}
        onMouseMove={(e) =>
          refAreaLeft && setState({ ...state, refAreaRight: e.activeLabel })
        }
        onMouseUp={zoom}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="time"
          type="number"
          allowDataOverflow
          domain={[left, right]}
          tickFormatter={formatTime}
          tickCount={10}
        />
        <YAxis
          yAxisId="left"
          type="number"
          allowDataOverflow
          domain={[`bottom${s1}`, `top${s1}`]}
          label={{
            value: "Bitrate [Mbps]",
            angle: -90,
            offset: -5,
            position: "insideLeft",
            dy: 40,
          }}
        />
        <YAxis
          yAxisId="right"
          type="number"
          allowDataOverflow
          domain={[`bottom${s2}`, `top${s2}`]}
          label={{
            value: "Latency [ms]",
            angle: 90,
            offset: -10,
            position: "insideRight",
            dy: 20,
          }}
          orientation="right"
        />
        <Tooltip />

        {visibleFlow.Flow1 && (<Bar
          yAxisId="left"
          type="monotone"
          dataKey={`Flow1`}
          fill={COLORS.Flow_1}
          // stroke={COLORS.Flow_1}
          onMouseEnter={() => handleMouseEnter("Flow1")}
          onClick={() => handleMouseEnter("Flow1")}
          onMouseLeave={handleMouseLeave}
          strokeWidth={activeLine === "Flow1" ? 4 : 1}
          fillOpacity={activeLine && activeLine !== "Flow1" ? 0.2 : 1}
          activeDot={{ r: 8 }}
          dot={null}
        />)}
        {visibleFlow.Flow2 && (<Bar
          yAxisId="right"
          type="monotone"
          dataKey={`Flow2`}
          fill={COLORS.Flow_2}
          // stroke={COLORS.Flow_2}
          onMouseEnter={() => handleMouseEnter("Flow2")}
          onClick={() => handleMouseEnter("Flow2")}
          onMouseLeave={handleMouseLeave}
          strokeWidth={activeLine === "Flow2" ? 4 : 1}
          fillOpacity={activeLine && activeLine !== "Flow2" ? 0.2 : 1}
          dot={null}
        />)}
        {visibleFlow.Flow3 && (<Bar
          yAxisId="right"
          type="monotone"
          dataKey={`Flow3`}
          fill={COLORS.Flow_3}
          // stroke={COLORS.Flow_3}
          onMouseEnter={() => handleMouseEnter("Flow3")}
          onClick={() => handleMouseEnter("Flow3")}
          onMouseLeave={handleMouseLeave}
          strokeWidth={activeLine === "Flow3" ? 4 : 1}
          fillOpacity={activeLine && activeLine !== "Flow3" ? 0.2 : 1}
          dot={null}
        />)}
        {visibleFlow.Flow4 && (<Bar
          yAxisId="right"
          type="monotone"
          dataKey={`Flow4`}
          fill={COLORS.Flow_4}
          // stroke={COLORS.Flow_4}
          onMouseEnter={() => handleMouseEnter("Flow4")}
          onClick={() => handleMouseEnter("Flow4")}
          onMouseLeave={handleMouseLeave}
          strokeWidth={activeLine === "Flow4" ? 4 : 1}
          fillOpacity={activeLine && activeLine !== "Flow4" ? 0.2 : 1}
          dot={null}
        />)}
        {visibleFlow.Flow5 && (<Bar
          yAxisId="right"
          type="monotone"
          dataKey={`Flow5`}
          fill={COLORS.Flow_5}
          // stroke={COLORS.Flow_5}
          onMouseEnter={() => handleMouseEnter("Flow5")}
          onClick={() => handleMouseEnter("Flow5")}
          onMouseLeave={handleMouseLeave}
          strokeWidth={activeLine === "Flow5" ? 4 : 1}
          fillOpacity={activeLine && activeLine !== "Flow5" ? 0.2 : 1}
          dot={null}
        />)}

        {refAreaLeft && refAreaRight ? (
          <ReferenceArea
            yAxisId="left"
            x1={refAreaLeft}
            x2={refAreaRight}
            strokeOpacity={0.3}
          />
        ) : null}
      </BarChart>
    </ResponsiveContainer>
  );

  const zoom = () => {
    let { refAreaLeft, refAreaRight, data } = state;

    if (refAreaLeft === refAreaRight || refAreaRight === "") {
      setState((prevState) => ({
        ...prevState,
        refAreaLeft: "",
        refAreaRight: "",
      }));
      return;
    }

    if (refAreaLeft > refAreaRight)
      [refAreaLeft, refAreaRight] = [refAreaRight, refAreaLeft];

    const [bottom1, top1] = getAxisYDomain(
      refAreaLeft,
      refAreaRight,
      "Flow1",
      200
    );
    const [bottom2, top2] = getAxisYDomain(
      refAreaLeft,
      refAreaRight,
      "Flow2",
      200
    );
    const [bottom3, top3] = getAxisYDomain(
      refAreaLeft,
      refAreaRight,
      "Flow3",
      200
    );
    const [bottom4, top4] = getAxisYDomain(
      refAreaLeft,
      refAreaRight,
      "Flow4",
      200
    );
    const [bottom5, top5] = getAxisYDomain(
      refAreaLeft,
      refAreaRight,
      "Flow5",
      200
    );

    setState((prevState) => ({
      ...prevState,
      refAreaLeft: "",
      refAreaRight: "",
      data: data.slice(),
      left: refAreaLeft,
      right: refAreaRight,
      bottom,
      top,
      bottom2,
      top2,
    }));
  };

  const zoomOut = () => {
    setState((prevState) => ({
      ...prevState,
      data: initialData,
      refAreaLeft: "",
      refAreaRight: "",
      left: RANGE.start,
      right: RANGE.end,
      top: "dataMax+1",
      bottom: "dataMin",
      top2: "dataMax+50",
      bottom2: "dataMin+50",
      brushKey: !state.brushKey,
    }));
  };

  const handleLegendClick = (payload) => {
    const { value } = payload;
    setVisibleFlow((prevState) => ({
      ...prevState,
      [value]: !prevState[value],
    }));
    console.log("LEGEND:", payload, value, visibleFlow);
  };

  const handleLegendHover = (value) => {
    setState((prevState) => ({ ...prevState, activeLine: value }));
  };

  return (
    <div
      style={{
        width: "80%",
        height: 170,
        margin: "0 auto",
        textAlign: "center",
      }}>
      <button
        type="button"
        className="btn update"
        onClick={zoomOut}>
        Zoom Out
      </button>
      <br />
      {chart(1, 1, 5)}
      {chart(2, 2, 4)}
      {chart(3, 3, 4)}
      {chart(4, 4, 2)}
      {barChart(5, 5, 1)}

      <ResponsiveContainer
        width="100%"
        height={15}
        style={{ display: "flex", position: "relative", marginBottom: "0px" }}>
        <Legend
          payload={[
            {
              value: "Flow1",
              type: "line",
              color: COLORS.Flow_1,
              visibility: visibleFlow.Flow1,
            },
            {
              value: "Flow2",
              type: "line",
              color: COLORS.Flow_2,
              visibility: visibleFlow.Flow2,
            },
            {
              value: "Flow3",
              type: "line",
              color: COLORS.Flow_3,
              visibility: visibleFlow.Flow3,
            },
            {
              value: "Flow4",
              type: "line",
              color: COLORS.Flow_4,
              visibility: visibleFlow.Flow4,
            },
            {
              value: "Flow5",
              type: "line",
              color: COLORS.Flow_5,
              visibility: visibleFlow.Flow5,
            },
          ]}
          content={
            <CustomLegend
              onClick={handleLegendClick}
              onHover={handleLegendHover}
              activeLine={activeLine}
            />
          }
        />
      </ResponsiveContainer>

      <ResponsiveContainer
        width="100%"
        height={50}>
        <LineChart
          key={state.brushKey}
          data={state.data}>
          <Brush
            dataKey="time"
            height={30}
            startIndex={left}
            endIndex={right}
            stroke="#8884d8"
            onDragEnd={handleBrushChange}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default App;
