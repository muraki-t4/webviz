// @flow
//
//  Copyright (c) 2019-present, Cruise LLC
//
//  This source code is licensed under the Apache License, Version 2.0,
//  found in the LICENSE file in the root directory of this source tree.
//  You may not use this file except in compliance with the License.

import _ from "lodash";
import React, { useState, useEffect, useCallback } from "react";
import { hot } from "react-hot-loader/root";

import helpContent from "./index.help.md";
import Flex from "webviz-core/src/components/Flex";
import Panel from "webviz-core/src/components/Panel";
import PanelToolbar from "webviz-core/src/components/PanelToolbar";
import LogList from "webviz-core/src/components/LogList";
import { useMessagePipeline } from "webviz-core/src/components/MessagePipeline";
import { fromNanoSec } from "webviz-core/src/util/time";

type Config = { errorMessages: Object };
type Props = { config: Config };

function ErrorMessages({ config }: Props) {

  const params = new URLSearchParams(window.location.search);
  const errorLogUrl = params.get("error-log-url");
  const offset = params.get("offset") || 3;
  const duration = params.get("duration") || 6;

  const [errorLogs, setErrorLogs] = useState([]);
  const [error, setError] = useState(null);
  const { startPlayback, seekPlayback, pausePlayback } = useMessagePipeline(
    useCallback(({ startPlayback, seekPlayback, pausePlayback }) => ({ startPlayback, seekPlayback, pausePlayback }), [])
  );

  // seek to the time of occuring error and play
  const seekPlaybackError = ({ timestamp, error_id }) => {
    try {
      const ts = fromNanoSec(parseInt(timestamp) - offset);
      seekPlayback(ts);
      startPlayback();
      setTimeout(() => {
        pausePlayback();
        // post message to parent window
        if (window.parent) window.parent.postMessage(error_id, "*");
      }, duration * 1000);
    } catch (error) {
      alert("再生に失敗しました");
    }
  }

  const getErrorLog = async () => {
    try {
      const res = await fetch(errorLogUrl);
      setErrorLogs(res.json());
    } catch (error) {
      setError(error);
    }
  }

  const sortByTimestamp = (a, b) => {
    return (parseInt(a.timestamp) > parseInt(b.timestamp)) ? 1 : ((parseInt(b.timestamp) > parseInt(a.timestamp)) ? -1 : 0);
  }

  useEffect(() => {
    getErrorLog();
  }, []);

  return (
    <Flex col style={{ height: "100%", overflow: 'scroll' }}>
      <PanelToolbar helpContent={helpContent} floating />
      <div style={{ padding: 10, fontSize: 16 }}>
        <span>検定結果</span>
      </div>
      <LogList
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
            onClick={() => seekPlaybackError(item)}
          >
            <p>
              <span style={{ color: "orange", marginRight: 8 }}>{item.scenario_start_id}</span>
              <span>{item.error_message}</span>
            </p>
          </div>
        )}
      />
      {error &&
        <div style={{ padding: 10, fontSize: 14 }}>
          <p style={{ color: "orange" }}>エラーメッセージ一覧が取得できませんでした</p>
        </div>
      }
    </Flex>
  );

}

ErrorMessages.panelType = "ErrorMessages";
ErrorMessages.defaultConfig = { errorMessages: {} };

export default hot(Panel<Config>(ErrorMessages));
