import React, { useState, useEffect } from "react";
import CSVReader from 'react-csv-reader';

function CheckpointHandler({ ros, checkpoints, setCheckpoints, clickedWaypoint }) {

  const addCheckpoint = (waypoint) => {
    if (checkpoints.filter(checkpoint => checkpoint.id === waypoint.id).length > 0) return;
    const checkpoint = {
      id: waypoint.id,
      x: waypoint.position.x,
      y: waypoint.position.y,
    };
    setCheckpoints([...checkpoints, checkpoint]);
    // setCheckpoints([...checkpoints, checkpoint].slice().sort((a, b) => (a.id > b.id) ? 1 : (b.id > a.id) ? -1 : 0));
  }

  const onFileLoaded = (data) => {
    setCheckpoints(data);
  }

  useEffect(() => {
    if (clickedWaypoint.id && clickedWaypoint.position) addCheckpoint(clickedWaypoint);
  }, [clickedWaypoint]);

  useEffect(() => {
    console.log(checkpoints);
  }, [checkpoints])

  return (
    <div>
      { checkpoints.length === 0 &&
        <CSVReader
          onFileLoaded={onFileLoaded}
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