// @flow
//
//  Copyright (c) 2019-present, Cruise LLC
//
//  This source code is licensed under the Apache License, Version 2.0,
//  found in the LICENSE file in the root directory of this source tree.
//  You may not use this file except in compliance with the License.

import _ from "lodash";
import React, { useState, useEffect } from "react";
import { hot } from "react-hot-loader/root";

import helpContent from "./index.help.md";
import Flex from "webviz-core/src/components/Flex";
import Panel from "webviz-core/src/components/Panel";
import PanelToolbar from "webviz-core/src/components/PanelToolbar";
import LogList from "webviz-core/src/components/LogList";
import { useMessagesByTopic } from "webviz-core/src/PanelAPI";

type Config = { ErrorMessagesOnline: Object };
type Props = { config: Config };

function ErrorMessagesOnline({ config }: Props) {

  const params = new URLSearchParams(window.location.search);
  const topicMessages = useMessagesByTopic({ topics: ["/error_vis"], historySize: 1 })["/error_vis"];

  const [items, setItems] = useState([]);
  const [messages, setMessages] = useState({});
  const [error, setError] = useState(null);

  const getErrorMessages = async () => {
    try {
      const errorMessageUrl = params.get("error-message-url");
      const res = await fetch(errorMessageUrl);
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      setError(error);
    }
  }

  const sortByTimestamp = (a, b) => {
    return (parseInt(a.id) > parseInt(b.id)) ? -1 : ((parseInt(b.id) > parseInt(a.id)) ? 1 : 0);
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
        const audio = new Audio("/audios/alert.mp3");
        audio.play().catch((e) => console.error(e));
      }
    }
  }, [topicMessages]);

  return (
    <Flex col style={{ height: "100%" }}>
      <PanelToolbar helpContent={helpContent} floating />
      <div style={{ padding: 10, fontSize: 18 }}>
        <span>検定結果一覧</span>
      </div>
      <LogList
        style={{ overflow: 'scroll' }}
        items={items.sort(sortByTimestamp)}
        renderRow={({ item, style }) => (
          <div
            style={{
              ...style,
              display: "flex",
              flexDirection: "column",
              padding: 8,
              fontSize: 18,
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
      {
        error &&
        <div style={{ padding: 8, fontSize: 16 }}>
          <p style={{ color: "orange" }}>エラーメッセージ一覧が取得できませんでした</p>
        </div>
      }
    </Flex>
  );

}

ErrorMessagesOnline.panelType = "ErrorMessagesOnline";
ErrorMessagesOnline.defaultConfig = { ErrorMessagesOnline: {} };

export default hot(Panel<Config>(ErrorMessagesOnline));