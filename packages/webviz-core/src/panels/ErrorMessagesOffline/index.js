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
import CSVReader from 'react-csv-reader';

import helpContent from "./index.help.md";
import Flex from "webviz-core/src/components/Flex";
import Panel from "webviz-core/src/components/Panel";
import PanelToolbar from "webviz-core/src/components/PanelToolbar";
import LogList from "webviz-core/src/components/LogList";
import { useMessagePipeline } from "webviz-core/src/components/MessagePipeline";
import { fromNanoSec } from "webviz-core/src/util/time";

type Config = { errorMessages: Object };
type Props = { config: Config };

function ErrorMessagesOffline({ config }: Props) {

  const [errorLogs, setErrorLogs] = useState([]);
  const [errorMessages, setErrorMessages] = useState({});

  const { seekPlayback } = useMessagePipeline(
    useCallback(({ seekPlayback }) => ({ seekPlayback, }), [])
  );

  const params = new URLSearchParams(window.location.search);
  const offset = params.get("offset") || 3;

  const handleIdScoreFileChange = (lines) => {
    const messages = {}
    for (const line of lines) {
      messages[line.id] = line.message;
    }
    setErrorMessages(messages);
  }

  const handleErrorLogFileChange = (lines) => {
    setErrorLogs(lines.map(line => ({ ...line, error_message: errorMessages[line.error_id] || "" })));
  }

  const sortByTimestamp = (a, b) => {
    return (parseInt(a.timestamp) > parseInt(b.timestamp)) ? 1 : ((parseInt(b.timestamp) > parseInt(a.timestamp)) ? -1 : 0);
  }

  return (
    <Flex col style={{ height: "100%" }}>
      <PanelToolbar helpContent={helpContent} floating />
      <div style={{ padding: 10, fontSize: 16 }}>
        <span>検定結果一覧</span>
      </div>
      {errorLogs.length > 0 ?
        <LogList
          style={{ overflow: 'scroll', paddingBottom: 20 }}
          items={errorLogs.sort(sortByTimestamp)}
          renderRow={({ item, style }) => (
            <div
              style={{
                ...style,
                display: "flex",
                flexDirection: "column",
                padding: 10,
                fontSize: 14,
              }}
              key={item.error_id}
              onClick={() => seekPlayback(fromNanoSec(parseInt(item.timestamp)))}
            >
              <p>
                <span style={{ color: "orange", marginRight: 8 }}>{item.scenario_start_id}</span>
                <span>{item.error_message}</span>
              </p>
            </div>
          )}
        />
        :
        <div>
          <CSVReader
            onFileLoaded={(data) => handleIdScoreFileChange(data)}
            parserOptions={{
              header: true,
              dynamicTyping: true,
              skipEmptyLines: true,
            }}
          />
          <CSVReader
            onFileLoaded={(data) => handleErrorLogFileChange(data)}
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

ErrorMessagesOffline.panelType = "ErrorMessagesOffline";
ErrorMessagesOffline.defaultConfig = { errorMessages: {} };

export default hot(Panel<Config>(ErrorMessagesOffline));
