import React, { useRef, useEffect } from "react";
import Typography from '@material-ui/core/Typography';
import CSVReader from 'react-csv-reader';

function WaypointHandler({ ros, waypoints, setWaypoints }) {

  const publisher = useRef(null);

  const publishMarkers = () => {
    const markers = waypoints.map((waypoint, index) => (
      {
        header: {
          seq: index + 1,
          frame_id: "map"
        },
        ns: "waypoints",
        id: index,
        type: 2,
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
          x: 0.5,
          y: 0.5,
          z: 0.5,
        },
        color: {
          a: 0.6,
          r: 0.0,
          g: 1.0,
          b: 0.0,
        },
        frame_locked: true,
        points: [],
        colors: [],
        mesh_resource: '',
        mesh_use_embedded_materials: false,
      }
    ));
    const message = new ROSLIB.Message({
      markers: markers
    });
    if (publisher.current !== null) publisher.current.publish(message);
  }

  useEffect(() => {
    publishMarkers();
  }, [waypoints]);

  useEffect(() => {
    publisher.current = new ROSLIB.Topic({
      ros: ros,
      name: '/scenario_editor/markers',
      messageType: 'visualization_msgs/MarkerArray',
      latch: true,
    });
    return () => publisher.current.unadvertise();
  }, [ros]);

  return (
    waypoints.length === 0 &&
    <>
      <Typography variant="subtitle1">waypoint.csv</Typography>
      <CSVReader
        onFileLoaded={(data) => setWaypoints(data)}
        parserOptions={{
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
        }}
      />
    </>
  )
}

export default WaypointHandler;