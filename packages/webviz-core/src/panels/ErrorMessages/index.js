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

import messages from './messages.json';

type Config = { errorMessages: Object };
type Props = { config: Config };

function ErrorMessages({ config }: Props) {

  const topicMessages = useMessagesByTopic({ topics: ["/error_vis"], historySize: 1 })["/error_vis"];

  const [items, setItems] = useState([]);

  useEffect(() => {
    if (topicMessages && topicMessages.length > 0) {
      const { message, receiveTime } = topicMessages[0];
      const { errorid, nextid, startid } = message;
      if (messages.hasOwnProperty(errorid)) {
        const item = { id: startid, text: messages[errorid].message };
        setItems([...items, item]);
      }
    }
  }, [topicMessages]);

  return (
    <Flex col style={{ height: "100%" }}>
      <PanelToolbar helpContent={helpContent} floating />
      <LogList
        items={items}
        renderRow={({ item, style }) => (
          <div
            style={{
              ...style,
              display: "flex",
              flexDirection: "column",
              padding: 8,
              borderBottom: "1px solid gray",
              fontSize: 14,
            }}
            key={item.id}
          >
            <p>
              <span style={{ color: "orange", marginRight: 8 }}>{item.id}</span>
              <span>{item.text}</span>
            </p>
          </div>
        )}
      />
    </Flex>
  );

}

ErrorMessages.panelType = "ErrorMessages";
ErrorMessages.defaultConfig = { errorMessages: {} };

export default hot(Panel<Config>(ErrorMessages));
