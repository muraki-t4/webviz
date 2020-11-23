import React, { useEffect } from "react";

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
    return () => publisher.unadvertise();
  }, [ros]);

  return null;
}

export default VectorMapLoader;