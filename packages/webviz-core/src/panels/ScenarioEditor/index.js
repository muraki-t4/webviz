// @flow
//
//  Copyright (c) 2019-present, Cruise LLC
//
//  This source code is licensed under the Apache License, Version 2.0,
//  found in the LICENSE file in the root directory of this source tree.
//  You may not use this file except in compliance with the License.

import _ from "lodash";
import React, { useEffect, useState } from "react";
import { hot } from "react-hot-loader/root";
import ROSLIB from "roslib";

import ScenarioHandler from './ScenarioHandler';
import CheckpointHandler from './CheckpointHandler';
import WaypointHandler from './WaypointHandler';
import IDScoreHandler from './IDScoreHandler';

import helpContent from "./index.help.md";
import Flex from "webviz-core/src/components/Flex";
import Panel from "webviz-core/src/components/Panel";
import PanelToolbar from "webviz-core/src/components/PanelToolbar";
import useGlobalVariables from "webviz-core/src/hooks/useGlobalVariables";
import VectorMapLoader from "./VectorMapLoader";
import { ROSBRIDGE_WEBSOCKET_URL_QUERY_KEY } from "webviz-core/src/util/globalConstants";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { CSVLink } from "react-csv";

function ScenarioEditor() {

  const { globalVariables } = useGlobalVariables();
  const params = new URLSearchParams(window.location.search);
  const websocketUrl = params.get(ROSBRIDGE_WEBSOCKET_URL_QUERY_KEY) || "ws://localhost:9090";
  const ros = new ROSLIB.Ros({ url: websocketUrl });

  const [scenarios, setScenarios] = useState([]);
  const [checkpoints, setCheckpoints] = useState([]);
  const [waypoints, setWaypoints] = useState([]);
  const [id_score, setIdScore] = useState([]);

  return (
    <Flex col style={{ height: "100%", overflow: 'scroll' }}>
      <PanelToolbar helpContent={helpContent} floating />
      <Box m={2}>
        <Typography variant="h5"> シナリオエディタ </Typography>
        <Box my={2} display="flex" flexDirection="row">
          {scenarios.length > 0 && <Box mx={1}><CSVLink data={scenarios} filename="scenarios.csv">scenarios.csv</CSVLink></Box>}
          {checkpoints.length > 0 && <Box mx={1}><CSVLink data={checkpoints} filename="checkpoints.csv">checkpoint.csv</CSVLink></Box>}
        </Box>
        <VectorMapLoader
          ros={ros}
        />
        <IDScoreHandler
          id_score={id_score}
          setIdScore={setIdScore}
        />
        <WaypointHandler
          ros={ros}
          waypoints={waypoints}
          setWaypoints={setWaypoints}
        />
        <ScenarioHandler
          scenarios={scenarios}
          setScenarios={setScenarios}
          checkpoints={checkpoints}
          setCheckpoints={setCheckpoints}
          id_score={id_score}
        />
        <CheckpointHandler
          checkpoints={checkpoints}
          setCheckpoints={setCheckpoints}
          waypoints={waypoints}
          clickedWaypointId={globalVariables.clickedWaypointId}
          ros={ros}
        />
      </Box>
    </Flex>
  );

}

ScenarioEditor.panelType = "ScenarioEditor";
ScenarioEditor.defaultConfig = {};

export default hot(Panel<{}>(ScenarioEditor));
