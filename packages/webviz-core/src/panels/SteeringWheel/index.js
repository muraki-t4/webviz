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

import SteeringWheelIcon from './svg/SteeringWheel.svg';

type Config = { status: Object };
type Props = { config: Config };

const IconWrapper = styled.div`
  padding: 8px;
  transform: ${props => (props.rotate ? `rotate(${props.rotate}deg)` : `rotate(0deg)`)};
`;

function SteeringWheel({ config }: Props) {

  const topicMessages = useMessagesByTopic({ topics: ["/can_info"], historySize: 1 })["/can_info"];

  const [steeringAngle, setSteeringAngle] = useState(null);

  useEffect(() => {
    if (topicMessages && topicMessages.length > 0) {
      const { message, receiveTime } = topicMessages[0];
      const { angle } = message;
      setSteeringAngle(angle * (-180 / Math.PI));
    }
  }, [topicMessages]);

  return (
    <Flex col style={{ height: "100%" }}>
      <PanelToolbar helpContent={helpContent} floating />
      <IconWrapper rotate={steeringAngle}>
        <SteeringWheelIcon />
      </IconWrapper>
      <div style={{ textAlign: 'center', fontSize: 20 }}>
        <span>{Math.floor(steeringAngle)}</span>
      </div>
    </Flex>
  );

}

SteeringWheel.panelType = "SteeringWheel";
SteeringWheel.defaultConfig = { status: {} };

export default hot(Panel<Config>(SteeringWheel));
