import { Panel, SelectInput, type SelectInputItem, type SelectInputProps } from '@garron/cli-ui';
import { TextInput } from '@inkjs/ui';
import { debounce } from 'lodash-es';
import { memo, useCallback, useMemo, useState } from 'react';
import { shallow } from 'zustand/shallow';

import { ListItem } from '@/commands/List';
import gitmojis from '@/constants/gitmojis';
import { selectors } from '@/store';
import { useCommitStore } from '@/store/commitStore';

import Header from './Header';

const emojiFormatConfig = selectors.getConfig('emoji') === 'emoji';

const AI_VALUE = 'ai';

const aiItem: SelectInputItem = {
  label: (
    <ListItem
      item={{
        desc: '通过ChatGPT生成提交消息',
        emoji: '🤯',
        name: 'ai',
        type: 'Use AI Commit',
      }}
    />
  ),
  value: 'ai',
};

const InputType = memo(() => {
  const { setType, setStep, setEmoji, type } = useCommitStore(
    (st) => ({
      setEmoji: st.setEmoji,
      setStep: st.setStep,
      setType: st.setType,
      type: st.type,
    }),
    shallow,
  );
  const [typeKeywords, setTpeKeywords] = useState<string>(type);

  const items: SelectInputProps['items'] = useMemo(() => {
    let data = gitmojis;
    if (typeKeywords) {
      data = data.filter((item) => item.type.includes(typeKeywords));
    } else if (type) {
      data = data.filter((item) => item.type.includes(type));
    }
    return data.map((item) => ({
      label: <ListItem item={item} />,
      value: `${emojiFormatConfig ? item.emoji : item.code} ${item.type}`,
    }));
  }, [typeKeywords, type]);

  const handleSelect: SelectInputProps['onSelect'] = useCallback((e: SelectInputItem) => {
    if (e.value === AI_VALUE) {
      setStep('ai');
    } else {
      const content = e.value.split(' ') as [string, string];
      setEmoji(content[0]);
      setType(content[1]);
      setStep('scope');
    }
  }, []);

  return (
    <Panel
      footer={
        <TextInput
          defaultValue={type}
          onChange={debounce(setTpeKeywords, 100)}
          placeholder="搜索提交<type>..."
        />
      }
      header={<Header step={1} steps={4} title="选择提交类型" />}
      reverse
    >
      <SelectInput
        itemComponent={({ label }) => label}
        items={[...items, aiItem]}
        onSelect={handleSelect}
      />
    </Panel>
  );
});

export default InputType;
