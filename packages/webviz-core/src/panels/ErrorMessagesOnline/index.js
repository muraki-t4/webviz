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
import { useMessagesByTopic } from "webviz-core/src/PanelAPI";

type Config = { ErrorMessagesOnline: Object };
type Props = { config: Config };

function ErrorMessagesOnline({ config }: Props) {

  const topicMessages = useMessagesByTopic({ topics: ["/error_vis"], historySize: 1 })["/error_vis"] || [];

  const [items, setItems] = useState([]);
  const [messages, setMessages] = useState({});
  const [error, setError] = useState(null);

  const getErrorMessages = () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const errorMessageUrl = params.get("error-message-url");
      fetch(errorMessageUrl)
        .then(res => res.json())
        .then(json => setMessages(json))
        .catch(error => setError(error));
    } catch (error) {
      setError(error);
    }
  }

  useEffect(() => {
    getErrorMessages();
  }, []);

  useEffect(() => {
    for (const { message } of topicMessages) {
      const { errorid, startid } = message;
      if (messages.hasOwnProperty(errorid)) {
        const item = { id: startid, text: messages[errorid] };
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
      {error &&
        <div style={{ padding: 8, fontSize: 14 }}>
          <p style={{ color: "orange" }}>エラーメッセージ一覧が取得できませんでした</p>
        </div>
      }
    </Flex>
  );

}

ErrorMessagesOnline.panelType = "ErrorMessagesOnline";
ErrorMessagesOnline.defaultConfig = { ErrorMessagesOnline: {} };

export default hot(Panel<Config>(ErrorMessagesOnline));