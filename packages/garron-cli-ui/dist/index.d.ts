import * as react from 'react';
import { ReactNode, FC } from 'react';
import * as ink from 'ink';
import { BoxProps } from 'ink';

declare const _default: {
    error: (text: string, exit?: boolean) => void;
    info: (text: string, exit?: boolean) => void;
    success: (text: string, exit?: boolean) => void;
    warn: (text: string, exit?: boolean) => void;
};

interface ConfigPanelItem {
    children: ReactNode;
    defaultValue: any;
    desc?: string;
    key: string;
    label: string;
    showValue?: boolean;
    value: any;
}
interface ConfigPanelProps extends BoxProps {
    active?: string;
    items: ConfigPanelItem[];
    logo?: string;
    maxLength?: number;
    setActive?: (key: string) => void;
    show?: boolean;
    title?: string;
}
declare const ConfigPanel: react.NamedExoticComponent<ConfigPanelProps>;

declare const useTheme: () => {
    blue: string;
    cyan: string;
    geekblue: string;
    gold: string;
    gray: string;
    green: string;
    lime: string;
    magenta: string;
    orange: string;
    pink: string;
    purple: string;
    red: string;
    volcano: string;
    yellow: string;
    colorError: string;
    colorInfo: string;
    colorPrimary: string;
    colorSuccess: string;
    colorWarning: string;
    colorBgContainer: string;
    colorBgElevated: string;
    colorBgLayout: string;
    colorBgSpotlight: string;
    colorBorder: string;
    colorBorderSecondary: string;
    colorText: string;
    colorTextDescription: string;
    colorTextPlaceholder: string;
    colorTextQuaternary: string;
    colorTextSecondary: string;
    colorTextTertiary: string;
};

interface PanelProps extends BoxProps {
    bodyConfig?: BoxProps;
    children: ReactNode;
    footer?: ReactNode;
    footerConfig?: BoxProps;
    header?: ReactNode;
    headerConfig?: BoxProps;
    reverse?: boolean;
    show?: boolean;
    title?: string;
}
declare const Panel: react.NamedExoticComponent<PanelProps>;

declare const render: (children: ReactNode) => ink.Instance;

interface IndicatorProps {
    highlightColor: string;
    isSelected?: boolean;
}

interface ItemProps {
    highlightColor: string;
    isSelected?: boolean;
    label: string | ReactNode;
}

interface SelectInputItem {
    key?: string;
    label: string | ReactNode;
    value: string;
}
interface SelectInputProps {
    highlightColor?: string;
    indicatorComponent?: FC<IndicatorProps>;
    initialIndex?: number;
    isFocused?: boolean;
    itemComponent?: FC<ItemProps>;
    items?: SelectInputItem[];
    limit?: number;
    onHighlight?: (item: SelectInputItem) => void;
    onSelect?: (item: SelectInputItem) => void;
}
declare const SelectInput: react.NamedExoticComponent<SelectInputProps>;

interface SplitViewProps extends BoxProps {
    children: ReactNode;
    direction?: 'top' | 'bottom';
}
declare const SplitView: react.NamedExoticComponent<SplitViewProps>;

declare const ThemeProvider: react.NamedExoticComponent<{
    children: ReactNode;
}>;

export { ConfigPanel, type ConfigPanelItem, type ConfigPanelProps, Panel, type PanelProps, SelectInput, type SelectInputItem, type SelectInputProps, SplitView, type SplitViewProps, ThemeProvider, _default as alert, render, useTheme };
