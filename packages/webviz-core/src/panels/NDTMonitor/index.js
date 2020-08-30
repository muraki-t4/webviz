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
import LogList from "webviz-core/src/components/LogList";
import type { RenderRow } from "webviz-core/src/components/LogList";
import type { SaveConfig } from "webviz-core/src/types/panels";
import { useMessagesByTopic } from "webviz-core/src/PanelAPI";

type Config = { status: Object };
type Props = { config: Config };

function NDTMonitor({ config }: Props) {

  const topicMessages = useMessagesByTopic({ topics: ["/ndt_monitor/ndt_info_text"], historySize: 1 })["/ndt_monitor/ndt_info_text"];

  const [ndtInfo, setNDTInfo] = useState(null);

  useEffect(() => {
    if (topicMessages && topicMessages.length > 0) {
      const { message, receiveTime } = topicMessages[0];
      setNDTInfo(message);
    }
  }, [topicMessages]);

  return (
    <Flex col style={{ height: "100%" }}>
      <PanelToolbar helpContent={helpContent} floating />
      <div style={{ padding: 5 }}>
        {ndtInfo ?
          <p style={{
            fontSize: 16,
            color: `rgb(${ndtInfo.fg_color.r * 255}, ${ndtInfo.fg_color.g * 255}, ${ndtInfo.fg_color.b * 255})`,
          }}>{ndtInfo.text}</p>
          :
          <p>No messages from `/ndt_monitor/ndt_info_text`</p>
        }
      </div>
    </Flex>
  );

}

NDTMonitor.panelType = "NDTMonitor";
NDTMonitor.defaultConfig = { status: {} };

export default hot(Panel<Config>(NDTMonitor));
