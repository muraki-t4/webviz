import React, { useState, useEffect } from "react";

function VectorMapLoader({ ros }) {

  const vectorMap = require("./vector_map.json");

  useEffect(() => {
    const publisher = new ROSLIB.Topic({
      ros: ros,
      name: '/vector_map',
      messageType: 'visualization_msgs/MarkerArray',
    });
    const message = new ROSLIB.Message(vectorMap);
    publisher.publish(message);
  }, [ros]);

  return null;
}

export default VectorMapLoader;