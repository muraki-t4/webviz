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

type Config = { status: Object };
type Props = { config: Config };

function SpeedMeter({ config }: Props) {

  const topicMessages = useMessagesByTopic({ topics: ["/can_info"], historySize: 1 })["/can_info"];

  const [speed, setSpeed] = useState(null);

  useEffect(() => {
    if (topicMessages && topicMessages.length > 0) {
      const { message, receiveTime } = topicMessages[0];
      const { speed } = message;
      console.log(speed)
      setSpeed(speed);
    }
  }, [topicMessages]);

  return (
    <Flex col style={{ height: "100%" }}>
      <PanelToolbar helpContent={helpContent} floating />
      <Flex row center style={{ fontSize: 20, textAlign: "center", verticalAlign: "text-bottom" }}>
        <span style={{ fontSize: 35 }}>{Math.floor(speed)}</span>
        <span style={{ paddingLeft: 5 }}>km/h</span>
      </Flex>
    </Flex>
  );

}

SpeedMeter.panelType = "SpeedMeter";
SpeedMeter.defaultConfig = { status: {} };

export default hot(Panel<Config>(SpeedMeter));
