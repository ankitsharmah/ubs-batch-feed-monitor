import React from "react";
import { MultiGrid } from "react-virtualized";
import "./UserTable.css";

const rowCount = 40000;
const columnCount = 9; // 1 for row number, 8 user columns
const rowHeight = 40;
const columnWidth = 180;

const columnHeaders = [
  "Row", "Name", "Email", "Phone", "City", "Company", "Username", "Website", "Action"
];

const userData = Array.from({ length: rowCount }, (_, i) => {
  return [
    `John ${i}`,
    `john${i}@gmail.com`,
    `+91-99999-${String(i).padStart(4, "0")}`,
    `City ${i % 10}`,
    `Company ${i % 5}`,
    `john_doe_${i}`,
    `https://example.com/${i}`,
    "Edit"
  ];
});

const VirtualizedUserTable = () => {
  const cellRenderer = ({ columnIndex, rowIndex, key, style }) => {
    const cellStyle = {
      ...style,
      padding: "10px",
      boxSizing: "border-box",
      borderBottom: "1px solid #ccc",
      borderRight: "1px solid #ccc",
      background: rowIndex === 0 ? "#f1f1f1" : "#fff",
      fontWeight: rowIndex === 0 ? "bold" : "normal",
      display: "flex",
      alignItems: "center"
    };
console.log(columnIndex,columnWidth)
    if (rowIndex === 0 && columnIndex === 0) {
      return (
        <div key={key} style={{ ...cellStyle, background: "#e6e6e6" }}>
          Row
        </div>
      );
    }

    // Header row
    if (rowIndex === 0) {
      return <div key={key} style={cellStyle}>{columnHeaders[columnIndex]}</div>;
    }

    // First frozen column (row number)
    if (columnIndex === 0) {
      return (
        <div key={key} style={{ ...cellStyle, background: "#f9f9f9", fontWeight: "bold" }}>
          #{rowIndex}
        </div>
      );
    }

    // Edit button
    if (columnIndex === columnCount - 1) {
      return (
        <div key={key} style={cellStyle}>
          <button className="btn-edit">Edit</button>
        </div>
      );
    }

    return (
      <div key={key} style={cellStyle}>
        {userData[rowIndex - 1][columnIndex - 1]}
      </div>
    );
  };

  return (
    <div className="outer-scroll-final">
      <MultiGrid
        // fixedColumnCount={1}
        fixedRowCount={1}
        rowHeight={rowHeight}
        columnWidth={columnWidth}
        rowCount={rowCount + 1} // +1 for header
        columnCount={columnCount}
        width={Math.min(window.innerWidth - 40, columnCount * columnWidth)}
        height={600}
        cellRenderer={cellRenderer}
        style={{
          border: "1px solid #ccc"
        }}
        styleBottomLeftGrid={{ background: "#f9f9f9" }}
        styleTopLeftGrid={{ background: "#e6e6e6" }}
        styleTopRightGrid={{ background: "#f1f1f1" }}
      />
    </div>
  );
};

export default VirtualizedUserTable;
