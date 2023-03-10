import Component from '../../base/component';
import { Ref } from '../../types';
declare const _default: (View: any) => {
    new (props: any): {
        triggerRef: Ref;
        labels: [];
        willMount(): void;
        /**
         * 绑定事件
         */
        didMount(): void;
        getLabels(props: any): any[];
        _handleEvent: (ev: any) => void;
        _initEvent(): void;
        render(): import("../..").JSX.Element;
        props: any;
        state: any;
        context: import("../../base/component").ComponentContext;
        refs: {
            [key: string]: Component<any, any>;
        };
        updater: import("../../base/component").Updater<any>;
        children: import("../..").JSX.Element;
        container: any;
        animate: boolean;
        destroyed: boolean;
        willReceiveProps(_props: any, context?: any): void;
        willUpdate(): void;
        didUpdate(): void;
        didUnmount(): void;
        setState(partialState: any, callback?: () => void): void;
        forceUpdate(callback?: () => void): void;
        setAnimate(animate: boolean): void;
        destroy(): void;
    };
};
export default _default;
