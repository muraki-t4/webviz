// @flow
//
//  Copyright (c) 2019-present, Cruise LLC
//
//  This source code is licensed under the Apache License, Version 2.0,
//  found in the LICENSE file in the root directory of this source tree.
//  You may not use this file except in compliance with the License.

import _ from "lodash";
import React, { useState, useEffect } from "react";
import { hot } from "react-hot-loader/root";
import ROSLIB from "roslib";

import CheckpointHandler from './CheckpointHandler';
import WaypointHandler from './WaypointHandler';

import helpContent from "./index.help.md";
import Flex from "webviz-core/src/components/Flex";
import Panel from "webviz-core/src/components/Panel";
import PanelToolbar from "webviz-core/src/components/PanelToolbar";
import useGlobalVariables from "webviz-core/src/hooks/useGlobalVariables";
import VectorMapLoader from "./VectorMapLoader";
import { ROSBRIDGE_WEBSOCKET_URL_QUERY_KEY } from "webviz-core/src/util/globalConstants";

function ScenarioEditor() {

  const { globalVariables, setGlobalVariables } = useGlobalVariables();
  const params = new URLSearchParams(window.location.search);
  const websocketUrl = params.get(ROSBRIDGE_WEBSOCKET_URL_QUERY_KEY) || "ws://localhost:9090";
  const ros = new ROSLIB.Ros({ url: websocketUrl });

  const [scenarios, setScenarios] = useState([]);
  const [checkpoints, setCheckpoints] = useState([]);
  const [waypoints, setWaypoints] = useState([]);

  useEffect(() => {
    setGlobalVariables({ clickedWaypointId: null, clickedWaypointPosition: null });
  }, []);

  return (
    <Flex col style={{ height: "100%" }}>
      <PanelToolbar helpContent={helpContent} floating />
      <div style={{ padding: 10, fontSize: 16 }}>
        <span>シナリオ作成</span>
      </div>
      <VectorMapLoader
        ros={ros}
      />
      <CheckpointHandler
        ros={ros}
        checkpoints={checkpoints}
        setCheckpoints={setCheckpoints}
        waypoints={waypoints}
        clickedWaypoint={{ id: globalVariables.clickedWaypointId }}
      />
      <WaypointHandler
        ros={ros}
        waypoints={waypoints}
        setWaypoints={setWaypoints}
      />
    </Flex>
  );

}

ScenarioEditor.panelType = "ScenarioEditor";
ScenarioEditor.defaultConfig = {};

export default hot(Panel<{}>(ScenarioEditor));
