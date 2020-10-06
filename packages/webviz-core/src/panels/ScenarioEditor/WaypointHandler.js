import React, { useState, useEffect } from "react";
import CSVReader from 'react-csv-reader';

function WaypointHandler({ ros, waypoints, setWaypoints }) {

  const publishMarkers = () => {
    const markers = waypoints.map((waypoint, index) => (
      {
        header: {
          seq: index + 1,
          frame_id: "map"
        },
        ns: "waypoints",
        id: index,
        type: 9,
        action: 0,
        pose: {
          position: {
            x: waypoint.x,
            y: waypoint.y,
            z: waypoint.z,
          },
          orientation: {
            x: waypoint.yaw,
            y: 0,
            z: 0,
            w: 0,
          }
        },
        scale: {
          x: 1,
          y: 1,
          z: 1,
        },
        color: {
          a: 1.0,
          r: 0.0,
          g: 1.0,
          b: 0.0,
        },
        frame_locked: true,
        points: [],
        colors: [],
        text: "*",
        mesh_resource: '',
        mesh_use_embedded_materials: false,
      }
    ));
    const markerPublisher = new ROSLIB.Topic({
      ros: ros,
      name: '/scenario_editor/markers',
      messageType: 'visualization_msgs/MarkerArray',
      latch: true,
    });
    const message = new ROSLIB.Message({
      markers: markers
    });
    markerPublisher.publish(message);
  }

  useEffect(() => {
    publishMarkers();
  }, [waypoints])

  return (
    <div>
      <CSVReader
        onFileLoaded={(data) => setWaypoints(data)}
        parserOptions={{
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
        }}
      />
    </div>
  )
}

export default WaypointHandler;