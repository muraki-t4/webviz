import React, { useEffect, useRef } from "react";
import CSVReader from 'react-csv-reader';
import Typography from "@material-ui/core/Typography";

function CheckpointHandler({ checkpoints, setCheckpoints, waypoints, clickedWaypointId, ros }) {

  const publisher = useRef(null);

  const addCheckpoint = (waypointId) => {
    if (checkpoints.filter(checkpoint => checkpoint.id === waypointId).length > 0) return;
    const waypoint = waypoints[waypointId] || null;
    if (waypoint) {
      const checkpoint = {
        id: waypointId,
        x: waypoint.x,
        y: waypoint.y,
      };
      setCheckpoints([...checkpoints, checkpoint]);
    }
  }

  const publishMarkers = () => {
    const markers = checkpoints.map((checkpoint, index) => (
      {
        header: {
          seq: index + 1,
          frame_id: "map"
        },
        id: checkpoint.id,
        ns: "marker",
        type: 2,
        action: 0,
        pose: {
          position: {
            x: checkpoint.x,
            y: checkpoint.y,
            z: 0,
          },
          orientation: {
            x: 0,
            y: 0,
            z: 0,
            w: 0,
          }
        },
        scale: {
          x: 0.7,
          y: 0.7,
          z: 0.5,
        },
        color: {
          a: 1.0,
          r: 0.0,
          g: 0.0,
          b: 1.0,
        },
        frame_locked: true,
        points: [],
        colors: [],
        text: `${checkpoint.id}`,
        mesh_resource: '',
        mesh_use_embedded_materials: false,
      }
    ));
    const labels = checkpoints.map((checkpoint, index) => (
      {
        header: {
          seq: index + 1,
          frame_id: "map"
        },
        id: checkpoint.id,
        ns: "label",
        type: 9,
        action: 0,
        pose: {
          position: {
            x: checkpoint.x + 1,
            y: checkpoint.y + 1,
            z: 0,
          },
          orientation: {
            x: 0,
            y: 0,
            z: 0,
            w: 0,
          }
        },
        scale: {
          x: 2,
          y: 2,
          z: 0.5,
        },
        color: {
          a: 1.0,
          r: 0.0,
          g: 0.0,
          b: 1.0,
        },
        frame_locked: true,
        points: [],
        colors: [],
        text: `${checkpoint.id}`,
        mesh_resource: '',
        mesh_use_embedded_materials: false,
      }
    ));
    const message = new ROSLIB.Message({
      markers: [...markers, ...labels]
    });
    if (publisher.current !== null) publisher.current.publish(message);
  }

  useEffect(() => {
    if (clickedWaypointId) addCheckpoint(clickedWaypointId);
  }, [clickedWaypointId]);

  useEffect(() => {
    publishMarkers();
  }, [checkpoints]);

  useEffect(() => {
    publisher.current = new ROSLIB.Topic({
      ros: ros,
      name: '/scenario_editor/checkpoints',
      messageType: 'visualization_msgs/MarkerArray',
      latch: true,
    });
    publisher.current.advertise();
    return () => publisher.current.unadvertise();
  }, [ros]);

  return (
    checkpoints.length === 0 &&
    <>
      <Typography variant="subtitle1">checkpoint.csv</Typography>
      <CSVReader
        onFileLoaded={(data) => setCheckpoints(data)}
        parserOptions={{
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
        }}
      />
    </>
  )
}

export default CheckpointHandler;