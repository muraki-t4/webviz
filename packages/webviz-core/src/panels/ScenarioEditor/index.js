// @flow
//
//  Copyright (c) 2019-present, Cruise LLC
//
//  This source code is licensed under the Apache License, Version 2.0,
//  found in the LICENSE file in the root directory of this source tree.
//  You may not use this file except in compliance with the License.

import _ from "lodash";
import React, { useState } from "react";
import { hot } from "react-hot-loader/root";
import CSVReader from 'react-csv-reader';

import List from '@material-ui/core/List';
import { Container, Draggable } from 'react-smooth-dnd';
import arrayMove from 'array-move';

import Scenario from "./Scenario";
import helpContent from "./index.help.md";
import Flex from "webviz-core/src/components/Flex";
import Panel from "webviz-core/src/components/Panel";
import PanelToolbar from "webviz-core/src/components/PanelToolbar";

type Config = { errorMessages: Object };
type Props = { config: Config };


function ScenarioEditor({ config }: Props) {

  const [scenarios, setScenarios] = useState([]);

  const onDrop = ({ removedIndex, addedIndex }) => {
    setScenarios(scenarios => arrayMove(scenarios, removedIndex, addedIndex))
  };

  return (
    <Flex col style={{ height: "100%" }}>
      <PanelToolbar helpContent={helpContent} floating />
      <div style={{ padding: 10, fontSize: 16 }}>
        <span>シナリオ作成</span>
      </div>
      {
        scenarios.length > 0 ?
          <List>
            <Container dragHandleSelector=".drag-handle" lockAxis="y" onDrop={onDrop}>
            {
              scenarios.map((scenario, index) =>
                <Draggable key={index}>
                  <Scenario key={index} scenario={scenario} />
                </Draggable>
              )
            }
            </Container>
          </List>
          :
          <div>
            <CSVReader
              onFileLoaded={(data) => { setScenarios(data); console.log(data); }}
              parserOptions={{
                header: true,
                dynamicTyping: true,
                skipEmptyLines: true,
              }}
            />
          </div>
      }
    </Flex>
  );

}

ScenarioEditor.panelType = "ScenarioEditor";
ScenarioEditor.defaultConfig = { errorMessages: {} };

export default hot(Panel<Config>(ScenarioEditor));
