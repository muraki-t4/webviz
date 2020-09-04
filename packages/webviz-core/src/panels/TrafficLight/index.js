// @flow
//
//  Copyright (c) 2019-present, Cruise LLC
//
//  This source code is licensed under the Apache License, Version 2.0,
//  found in the LICENSE file in the root directory of this source tree.
//  You may not use this file except in compliance with the License.

import _ from "lodash";
import React, { useCallback, useState, useEffect } from "react";
import { hot } from "react-hot-loader/root";
import styled from "styled-components";

import helpContent from "./index.help.md";
import Flex from "webviz-core/src/components/Flex";
import Panel from "webviz-core/src/components/Panel";
import PanelToolbar from "webviz-core/src/components/PanelToolbar";
import { useMessagesByTopic } from "webviz-core/src/PanelAPI";

import GreenLight from './svg/Green.svg';
import YellowLight from './svg/Yellow.svg';
import RedLight from './svg/Red.svg';
import UnknownLight from './svg/Unknown.svg';

type Config = { lightColors: Object };
type Props = { config: Config };

function TrafficLight({ config }: Props) {

  const topicMessages = useMessagesByTopic({ topics: ["/light_color"], historySize: 1 })["/light_color"];

  const [trafficLightResult, setTrafficLightResult] = useState({});

  useEffect(() => {
    if (topicMessages && topicMessages.length > 0) {
      const { message } = topicMessages[0];
      const { results } = message;
      if (results && results.length > 0) {
        const targetResult = results.filter(result => result.light_id === 12);
        if (targetResult.length > 0) setTrafficLightResult(targetResult[0]);
      }
    }
  }, [topicMessages]);

  return (
    <Flex col style={{ height: "100%" }}>
      <PanelToolbar helpContent={helpContent} floating />
      <TrafficLightResult color={trafficLightResult.recognition_result_str} />
    </Flex>
  );

}

function TrafficLightResult({ color }) {

  return (
    color === "GREEN" ? <GreenLight /> :
      color === "YELLOW" ? <YellowLight /> :
        color === "RED" ? <RedLight /> :
          <UnknownLight />
  );

}

TrafficLight.panelType = "TrafficLight";
TrafficLight.defaultConfig = { lightColors: {} };

export default hot(Panel<Config>(TrafficLight));
