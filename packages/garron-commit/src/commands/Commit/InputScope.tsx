import { Panel, SelectInput, SelectInputItem, SplitView } from '@garron/cli-ui';
import { TextInput } from '@inkjs/ui';
import { Text, useInput } from 'ink';
import { debounce } from 'lodash-es';
import { memo, useCallback, useState } from 'react';
import { shallow } from 'zustand/shallow';

import { ListItem } from '@/commands/List';
import { useCommitStore } from '@/store/commitStore';

import Header from './Header';

const INPUT_VALUE = 'Use Input Value';

const commitScopes: SelectInputItem[] = [
  {
    label: '输入提交范围',
    value: INPUT_VALUE,
  },
  {
    label: '包管理更改，如添加、更新或删除依赖项',
    value: 'deps',
  },
  {
    label: '配置文件更改，如添加、更新或删除配置选项',
    value: 'config',
  },
  {
    label: '用户界面更改，如布局、样式或交互修改',
    value: 'ui',
  },
  {
    label: 'API接口更改，如添加、修改或删除API端点',
    value: 'api',
  },
  {
    label: '数据库更改，如添加、修改或删除表、字段或索引',
    value: 'database',
  },
  {
    label: '数据模型更改，例如添加、修改或删除数据模型',
    value: 'model',
  },
  {
    label: '控制器更改，如添加、修改或删除控制器',
    value: 'controller',
  },
  {
    label: '视图更改，例如添加、修改或删除视图',
    value: 'view',
  },
  {
    label: '管线更改，例如添加、修改或删除管线',
    value: 'route',
  },
  {
    label: '测试更改，如添加、修改或删除测试用例',
    value: 'test',
  },
];

const items: SelectInputItem[] = commitScopes.map((scope) => ({
  label: (
    <ListItem
      item={{
        desc: scope.label as string,
        name: scope.value,
        type: scope.value,
      }}
    />
  ),
  value: scope.value,
}));

const InputScope = memo(() => {
  const { message, setScope, setStep, scope } = useCommitStore(
    (st) => ({
      message: st.message,
      scope: st.scope,
      setScope: st.setScope,
      setStep: st.setStep,
    }),
    shallow,
  );
  useInput(useCallback((_, key) => key.tab && setStep('type'), []));
  const [isInput, setIsInput] = useState<boolean>(true);
  const [input, setInput] = useState<string>('');

  const handleSubmit = useCallback(() => {
    setStep('subject');
  }, []);

  const handleInput = useCallback(
    (e: string) => {
      if (isInput) {
        setScope(e);
        setInput(e);
      }
    },
    [isInput],
  );

  const handleSelect = useCallback((e: SelectInputItem) => {
    if (e.value === INPUT_VALUE) {
      setIsInput(true);
      setScope(input);
    } else {
      setIsInput(false);
      setScope(e.value);
    }
  }, []);

  return (
    <Panel
      footer={<Text>{message}</Text>}
      header={<Header step={2} steps={4} title="输入提交范围（可选）" />}
    >
      <TextInput
        defaultValue={scope}
        onChange={debounce(handleInput, 100)}
        onSubmit={handleSubmit}
        placeholder="输入commit＜scope＞，或在下面选择，按[Enter]跳过。。。"
      />
      <SplitView>
        <SelectInput
          itemComponent={({ label }) => label}
          items={items}
          onHighlight={handleSelect}
          onSelect={handleSubmit}
        />
      </SplitView>
    </Panel>
  );
});

export default InputScope;
