import React from "react";

const CustomLegend = ({
  payload = [],
  onClick = () => {},
  onHover,
  activeLine,
}) => {
  if (!Array.isArray(payload)) {
    return null;
  }

  return (
    <div
      style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
      {payload.map((entry, index) => {
        const { value, color, visibility } = entry || {}; // Ensure destructuring with default values
        const bgColor = visibility ? color : "#ccc";
        return (
          <div
            key={`item-${index}`}
            style={{
              margin: "0 10px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
            onClick={() => {
              if (value) {
                onClick(entry); // Call onClick with entry to toggle visibility
              }
            }}
            onMouseEnter={() => onHover(entry.value)}
            onMouseLeave={() => onHover(null)}>
            <div
              style={{
                width: 20,
                height: 20,
                marginRight: 8,
                backgroundColor: bgColor,
                borderRadius: 4,
              }}>
              {/* Custom icon logic */}
            </div>
            <span
              style={{
                color: bgColor,
                fontWeight: activeLine === entry.value ? "bold" : "normal",
              }}>
              {value}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default CustomLegend;
