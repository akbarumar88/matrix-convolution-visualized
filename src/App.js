import "./styles.css";
import { useState, useEffect } from "react";

export default function App() {
  const renderTable = (data) => {
    if (!data.length) {
      // Calculating
      return <p>Calculating...</p>;
    }
    return data.map((row) => {
      return (
        <div style={{ display: "flex", flexDirection: "row" }}>
          {row.map((col) => {
            return (
              <div
                class="col"
                style={{
                  flex: 1,
                  backgroundColor: "#ccddff",
                  padding: 12,
                  border: "solid 1px #999"
                }}
              >
                {col}
              </div>
            );
          })}
        </div>
      );
    });
  };

  const renderResult = (data) => {
    if (!data.length) {
      // Calculating
      return <p>Calculating...</p>;
    }
    return data.map((row, i) => {
      return (
        <div style={{ display: "flex", flexDirection: "row" }}>
          {row.map((col, j) => {
            let convolutionResultCell =
              i > 0 && i < data.length - 1 && j > 0 && j < row.length - 1;
            return (
              <div
                class="col"
                style={{
                  flex: 1,
                  backgroundColor: convolutionResultCell ? "#ffe894" : "#eee",
                  padding: 12,
                  border: "solid 1px #999"
                }}
              >
                {col}
              </div>
            );
          })}
        </div>
      );
    });
  };

  const renderOrigin = (data) => {
    return data.map((row, i) => {
      return (
        <div style={{ display: "flex", flexDirection: "row" }}>
          {row.map((col, j) => {
            let resFind = cellHighlight.find((el) => {
              return el.x == i && el.y == j;
            });
            let shouldBeHighlighted = resFind != undefined;
            return (
              <div
                class="col"
                style={{
                  flex: 1,
                  backgroundColor: shouldBeHighlighted ? resFind.bg : "#eee",
                  padding: 12,
                  border: "solid 1px #999",
                  color: shouldBeHighlighted ? resFind.color : "#333"
                }}
              >
                {col}
              </div>
            );
          })}
        </div>
      );
    });
  };

  const delay = (num = 100) =>
    new Promise((resolve, reject) => {
      setTimeout(resolve, num);
    });

  const [origin, setOrigin] = useState([
    [1, 2, 3, 4, 5, 1, 2, 3, 4, 5],
    [6, 7, 8, 9, 10, 6, 7, 8, 9, 10],
    [11, 12, 13, 14, 15, 11, 12, 13, 14, 15],
    [21, 22, 23, 24, 25, 21, 22, 23, 24, 25],
    [31, 32, 33, 34, 35, 31, 32, 33, 34, 35],
    [1, 2, 3, 4, 5, 1, 2, 3, 4, 5],
    [6, 7, 8, 9, 10, 6, 7, 8, 9, 10],
    [11, 12, 13, 14, 15, 11, 12, 13, 14, 15],
    [21, 22, 23, 24, 25, 21, 22, 23, 24, 25],
    [31, 32, 33, 34, 35, 31, 32, 33, 34, 35]
  ]);
  const [kernel, setKernel] = useState([
    [0, -1, 0],
    [1, -1, 0],
    [0, -1, 1]
  ]);
  const [cellHighlight, setCellHighlight] = useState([]);
  const [convolutionResult, setConvolutionResult] = useState([]);

  useEffect(() => {
    const calculateConvolution = async () => {
      let convolutionResult = JSON.parse(JSON.stringify(origin));
      let dimension = origin.length - 2;
      console.log({ dimension });
      for (let i = 1; i < origin.length - 1; i++) {
        let row = origin[i];
        for (let j = 1; j < row.length - 1; j++) {
          let cell = origin[i][j];
          console.log(cell);
          // Lakukan perhitungan Konvolus
          let val = 0;
          let cellHighlight = [];
          for (let k = 0; k < kernel.length; k++) {
            let kernelRow = kernel[k];
            for (let l = 0; l < kernelRow.length; l++) {
              let res = origin[i - 1 + k][j - 1 + l] * kernel[k][l];
              val += res;
              let x = i - 1 + k;
              let y = j - 1 + l;
              let center = x == i && y == j;
              let topLeft = k == 0 && l == 0;
              cellHighlight = [
                ...cellHighlight,
                {
                  x,
                  y,
                  color: center ? "#333" : "#fff",
                  bg: center ? "#80ff80" : "#ff8080"
                }
              ];
            }
          }
          convolutionResult[i][j] = val;
          setCellHighlight(cellHighlight);
          console.log({ cellHighlight });
          await delay(50);
        }
      }
      setConvolutionResult(convolutionResult);
      setCellHighlight([]);
    };

    calculateConvolution();
  }, []);

  return (
    <div className="App">
      {/* <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2> */}
      <div id="container" style={{ display: "flex", flexDirection: "row" }}>
        <div class="box" style={{ flex: 1, marginRight: 8 }}>
          <h2>Origin</h2>
          {renderOrigin(origin)}
        </div>
        <div class="box" style={{ flex: 1, marginLeft: 8 }}>
          <h2>Kernel</h2>
          {renderTable(kernel)}
        </div>
      </div>
      <h2>Result</h2>
      {renderResult(convolutionResult)}
    </div>
  );
}
