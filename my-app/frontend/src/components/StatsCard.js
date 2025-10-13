import React from "react";

export default function StatsCard({ title, value, color }) {
  return (
    <div className="col-md-3 mb-4">
      <div
        className="p-4 rounded-4 text-white shadow-sm"
        style={{ backgroundColor: color, minHeight: "120px" }}
      >
        <h6 className="fw-semibold">{title}</h6>
        <h3 className="fw-bold">{value}</h3>
        <p className="small opacity-75 mb-0">Updated just now</p>
      </div>
    </div>
  );
}
