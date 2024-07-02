import { Panel, SelectInput, type SelectInputItem, SplitView, useTheme } from '@garron/cli-ui';
import { Spinner } from '@inkjs/ui';
import { Text, useInput } from 'ink';
import { memo, useCallback, useEffect, useMemo } from 'react';

import { useCommits } from '@/hooks/useCommits';
import { useCommitStore } from '@/store/commitStore';

const AiCommit = memo(() => {
  const { message, setMessage, setStep } = useCommitStore((st) => ({
    message: st.message,
    setMessage: st.setMessage,
    setStep: st.setStep,
  }));
  useInput(useCallback((_, key) => key.tab && setStep('type'), []));
  const theme = useTheme();

  const { summary, start, loadingInfo, loading, restart } = useCommits({ setMessage });

  const handleSelect = useCallback(
    (item: any) => {
      switch (item.value) {
        case 'reloadFromSummary': {
          start();
          break;
        }
        case 'reload': {
          restart();
          break;
        }
        case 'edit': {
          setStep('type');
          break;
        }
        case 'confirm': {
          setStep('commit');
          break;
        }
      }
    },
    [start, restart],
  );

  useEffect(() => {
    start();
  }, [start]);

  const items = useMemo(
    () =>
      [
        summary && {
          label: '🔄️ 从摘要中重新生成提交消息[FAST]',
          value: 'reloadFromSummary',
        },
        { label: '🔄️ 重新生成完整提交消息[SLOW]', value: 'reload' },
        { label: '✏️  编辑消息', value: 'edit' },
        { label: '✅  使用此消息', value: 'confirm' },
      ].filter(Boolean) as SelectInputItem[],
    [summary],
  );

  return (
    <Panel
      footer={!loading && message && <SelectInput items={items} onSelect={handleSelect} />}
      title={`🤯 AI提交生成器`}
    >
      {summary && (
        <SplitView direction={'bottom'}>
          <Text color={theme.colorTextDescription}>
            <Text bold>{`👉 DIFF SUMMARY: `}</Text>
            {summary}
          </Text>
        </SplitView>
      )}
      {!loading && message ? <Text>{message}</Text> : <Spinner label={loadingInfo} />}
    </Panel>
  );
});

export default AiCommit;
