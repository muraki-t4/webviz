// @flow
//
//  Copyright (c) 2018-present, Cruise LLC
//
//  This source code is licensed under the Apache License, Version 2.0,
//  found in the LICENSE file in the root directory of this source tree.
//  You may not use this file except in compliance with the License.
//
import AiInstructorPanelWrapperForRoslib from "ai-instructor-panel";
import { partition } from "lodash";
import * as React from "react";
import { hot } from "react-hot-loader/root";
import styled from "styled-components";

import Panel from "webviz-core/src/components/Panel";
import PanelToolbar from "webviz-core/src/components/PanelToolbar";
import useGlobalVariables from "webviz-core/src/hooks/useGlobalVariables";
import { memoizedGetLinkedGlobalVariablesKeyByName } from "webviz-core/src/panels/ThreeDimensionalViz/Interactions/interactionUtils";
import useLinkedGlobalVariables from "webviz-core/src/panels/ThreeDimensionalViz/Interactions/useLinkedGlobalVariables";
import { ROSBRIDGE_WEBSOCKET_URL_QUERY_KEY } from "webviz-core/src/util/globalConstants";

// AI Instructor Panel
const Container = styled.div`
  padding: 16px;
  overflow-y: auto;
  ul {
    font-size: 10px;
    margin-left: 8px;
  }
  li {
    margin: 4px 0;
  }
  h1 {
    font-size: 1.5em;
    margin-bottom: 0.5em;
  }
  section {
    flex: 1 1 50%;
    overflow: hidden;
  }
`;

function AIDrivingInstructorPanel(): React.Node {
  const { globalVariables, _0, _1 } = useGlobalVariables();
  const { linkedGlobalVariables } = useLinkedGlobalVariables();
  const globalVariableNames = Object.keys(globalVariables);
  const linkedGlobalVariablesKeyByName = memoizedGetLinkedGlobalVariablesKeyByName(linkedGlobalVariables);
  const [linked, unlinked] = partition(globalVariableNames, (name) => !!linkedGlobalVariablesKeyByName[name]);

  const params = new URLSearchParams(window.location.search);
  const websocketUrl = params.get(ROSBRIDGE_WEBSOCKET_URL_QUERY_KEY) || "ws://localhost:9090";

  return (
    <Container>
      <PanelToolbar floating />
      <AiInstructorPanelWrapperForRoslib websocketUrl={websocketUrl} />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <p>(DEBUG) Global variables are shown below.</p>
      {linked.map((name, idx) => {
        return (
          <tr key={`linked-${idx}`}>
            <a>
              {name}: {JSON.stringify(globalVariables[name] ?? "")}
            </a>
          </tr>
        );
      })}
      {unlinked.map((name, idx) => {
        return (
          <tr key={`unlinked-${idx}`}>
            <a>
              {name}: {JSON.stringify(globalVariables[name] ?? "")}
            </a>
          </tr>
        );
      })}
    </Container>
  );
}

AIDrivingInstructorPanel.panelType = "AIDrivingInstructorPanel";
AIDrivingInstructorPanel.defaultConfig = {};

export default hot(Panel<{}>(AIDrivingInstructorPanel));
