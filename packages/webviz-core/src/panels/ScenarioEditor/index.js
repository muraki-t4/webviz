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
import styled from "styled-components";
import CSVReader from 'react-csv-reader';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import DeleteIcon from '@material-ui/icons/Delete';

import helpContent from "./index.help.md";
import Flex from "webviz-core/src/components/Flex";
import Panel from "webviz-core/src/components/Panel";
import PanelToolbar from "webviz-core/src/components/PanelToolbar";

type Config = { errorMessages: Object };
type Props = { config: Config };

const useStyles = makeStyles((theme) => ({
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

function ScenarioEditor({ config }: Props) {

  const [scenarios, setScenarios] = useState([]);

  return (
    <Flex col style={{ height: "100%" }}>
      <PanelToolbar helpContent={helpContent} floating />
      <div style={{ padding: 10, fontSize: 16 }}>
        <span>シナリオ作成</span>
      </div>
      {
        scenarios.length > 0 ?
          <ScenarioList scenarios={scenarios} />
          :
          <div>
            <CSVReader
              onFileLoaded={(data) => setScenarios(data)}
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

function ScenarioList({ scenarios }) {
  return (
    <List>
      {
        scenarios.map((scenario, index) =>
          <Scenario key={index} scenario={scenario} />
        )
      }
    </List>
  )
}

function Scenario({ scenario }) {

  const classes = useStyles();
  const [open, setOpen] = useState(false);

  return (
    <div>
      <ListItem button onClick={() => setOpen(prevOpen => !prevOpen)} >
        <ListItemText primary={`${scenario.start_id} - ${scenario.end_id}`} />
        <DeleteIcon onClick={(e) => { alert(1); e.preventDefault(); }} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem button className={classes.nested}>
            <ListItemText primary="Starred" />
          </ListItem>
          <ListItem button className={classes.nested}>
            <ListItemText primary="Starred" />
          </ListItem>
          <ListItem button className={classes.nested}>
            <ListItemText primary="Starred" />
          </ListItem>
        </List>
      </Collapse>
    </div>
  )
}

function ScenarioItem({ item }) {

  const classes = useStyles();

  return (
    <ListItem button className={classes.nested}>
      <ListItemText primary="Starred" />
    </ListItem>
  )
}

ScenarioEditor.panelType = "ScenarioEditor";
ScenarioEditor.defaultConfig = { errorMessages: {} };

export default hot(Panel<Config>(ScenarioEditor));
