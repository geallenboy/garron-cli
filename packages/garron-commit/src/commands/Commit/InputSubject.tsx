import { TextInput } from '@inkjs/ui';
import { Panel } from '@garron/cli-ui';
import { Text, useInput } from 'ink';
import { debounce } from 'lodash-es';
import { memo, useCallback } from 'react';
import { shallow } from 'zustand/shallow';

import { useCommitStore } from '@/store/commitStore';

import Header from './Header';

const InputScope = memo(() => {
  const { message, setSubject, setStep, subject } = useCommitStore(
    (st) => ({
      message: st.message,
      setStep: st.setStep,
      setSubject: st.setSubject,
      subject: st.subject,
    }),
    shallow,
  );
  useInput(useCallback((_, key) => key.tab && setStep('scope'), []));

  return (
    <Panel
      footer={<Text>{message}</Text>}
      header={<Header step={3} steps={4} title="Input commit subject" />}
    >
      <TextInput
        defaultValue={subject}
        onChange={debounce(setSubject, 100)}
        onSubmit={() => subject && setStep('issues')}
        placeholder="Input commit <subject>..."
      />
    </Panel>
  );
});

export default InputScope;
