import React, { useState, useEffect } from "react";
import CSVReader from 'react-csv-reader';

function CheckpointHandler({ ros, checkpoints, setCheckpoints, waypoints, clickedWaypoint }) {

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
    // setCheckpoints([...checkpoints, checkpoint].slice().sort((a, b) => (a.id > b.id) ? 1 : (b.id > a.id) ? -1 : 0));
  }

  const publishMarkers = () => {
    const markers = checkpoints.map((checkpoint, index) => (
      {
        header: {
          seq: index + 1,
          frame_id: "map"
        },
        id: checkpoint.id,
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
          x: 2,
          y: 2,
          z: 1,
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
        // text: "+",
        mesh_resource: '',
        mesh_use_embedded_materials: false,
      }
    ));
    const markerPublisher = new ROSLIB.Topic({
      ros: ros,
      name: '/scenario_editor/checkpoints',
      messageType: 'visualization_msgs/MarkerArray',
      latch: true,
    });
    const message = new ROSLIB.Message({
      markers: markers
    });
    markerPublisher.publish(message);
  }

  useEffect(() => {
    if (clickedWaypoint.id) addCheckpoint(clickedWaypoint.id);
  }, [clickedWaypoint]);

  useEffect(() => {
    publishMarkers();
  }, [checkpoints])

  return (
    <div>
      { checkpoints.length === 0 &&
        <CSVReader
          onFileLoaded={(data) => setCheckpoints(data)}
          parserOptions={{
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
          }}
        />
      }
    </div>
  )
}

export default CheckpointHandler;