declare const _default: new (props: import("./withScrollBar").ScrollBarProps) => {
    willMount(): any;
    render(): import("../..").JSX.Element;
    startRange: {
        x?: import("../zoom").ZoomRange;
        y?: import("../zoom").ZoomRange;
    };
    scale: {};
    originScale: {};
    minScale: number;
    dims: String[];
    swipeEnd: {
        startX: number;
        startY: number;
        endX: number;
        endY: number;
    };
    loop: any;
    didMount(): void;
    willReceiveProps(nextProps: import("./withScrollBar").ScrollBarProps): void;
    didUnmount(): void;
    onStart: () => void;
    onPan: (ev: any) => void;
    update(): void;
    onSwipe: (ev: any) => void;
    onPinch: (ev: any) => void;
    onEnd: () => void;
    _doXPan(ev: any): import("../zoom").ZoomRange;
    _doYPan(ev: any): import("../zoom").ZoomRange;
    _doPan(ratio: number, dim: string): import("../zoom").ZoomRange;
    _doXPinch(ev: any): any;
    _doYPinch(ev: any): any;
    _doPinch(startRatio: number, endRatio: number, zoom: number, dim: string): any;
    updateRange(originalRange: import("../zoom").ZoomRange, dim: any): import("../zoom").ZoomRange;
    updateFollow(scales: import("@antv/scale").Scale[], mainScale: import("@antv/scale").Scale, data: any[]): void;
    _getScale(dim: any): any;
    _getFollowScales(dim: any): any[];
    _bindEvents(): void;
    _clearEvents(): void;
    props: import("./withScrollBar").ScrollBarProps;
    state: import("../zoom").ZoomState;
    context: import("../../base/component").ComponentContext;
    refs: {
        [key: string]: import("../../base/component").default<any, any>;
    };
    updater: import("../../base/component").Updater<import("../zoom").ZoomState>;
    children: import("../..").JSX.Element;
    container: any;
    animate: boolean;
    destroyed: boolean;
    willUpdate(): void;
    didUpdate(): void;
    setState(partialState: import("../zoom").ZoomState, callback?: () => void): void;
    forceUpdate(callback?: () => void): void;
    setAnimate(animate: boolean): void;
    destroy(): void;
};
export default _default;
import withScrollBar from "./withScrollBar";
import ScrollBarView from "./scrollBarView";
export { withScrollBar, ScrollBarView };
