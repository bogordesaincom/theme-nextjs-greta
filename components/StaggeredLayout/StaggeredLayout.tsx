import type { CSSProperties, PropsWithChildren } from 'react';
import { Children, useCallback, useEffect, useState } from 'react';
import { useDidMount, useDidUpdate, useWillUnmount } from 'rooks';

type PropsType = {
    breakpointsColumn:
        | {
              default: number;
              [key: number]: number;
          }
        | number;
    className: string;
    columnClassname: string;
    columnAttributes?: { style?: object | CSSProperties };
    column?: number | any;
    style?: CSSProperties;
};

const DEFAULT_COLUMNS = 2;

function StaggeredLayout(props: PropsWithChildren<PropsType>) {
    const [columnCount, setColumnCount] = useState(0);
    let lastRecalculateAnimationFrame: number;

    const setColumnDefault = useCallback(
        () =>
            typeof props.breakpointsColumn === 'object'
                ? setColumnCount(props.breakpointsColumn.default)
                : setColumnCount(props.breakpointsColumn || DEFAULT_COLUMNS),
        [props.breakpointsColumn],
    );

    useEffect(() => {
        setColumnDefault();
    }, [setColumnDefault]);

    function recalculateColumnCount() {
        const windowWidth = (window && window.innerWidth) || Infinity;
        let breakpointColumnsObject = props.breakpointsColumn;

        // allowing to pass a single number to `breakpointColumn` instead of an object
        if (typeof breakpointColumnsObject !== 'object') {
            breakpointColumnsObject = {
                default: breakpointColumnsObject || DEFAULT_COLUMNS,
            };
        }

        let matchedBreakpoint = Infinity;
        let columns = breakpointColumnsObject.default || DEFAULT_COLUMNS;

        // eslint-disable-next-line no-restricted-syntax
        for (const breakpoint in breakpointColumnsObject) {
            if (Object.prototype.hasOwnProperty.call(breakpointColumnsObject, breakpoint)) {
                const optBreakpoint = parseInt(breakpoint);
                const isCurrentBreakpoint = optBreakpoint > 0 && windowWidth <= optBreakpoint;

                if (isCurrentBreakpoint && optBreakpoint < matchedBreakpoint) {
                    matchedBreakpoint = optBreakpoint;
                    columns = breakpointColumnsObject[breakpoint];
                }
            }
        }

        if (typeof columns !== 'number') {
            columns = Math.max(1, parseInt(columns) || 1);
        } else {
            columns = Math.max(1, columns || 1);
        }

        if (columnCount !== columns) setColumnCount(columns);
    }

    function reCalculateColumnCountDebounce() {
        if (!window || !window.requestAnimationFrame) {
            // supports for IE10+ - in case something messed up
            recalculateColumnCount();
            return;
        }

        if (window.cancelAnimationFrame) {
            // supports for IE10+ - in case something messed up
            window.cancelAnimationFrame(lastRecalculateAnimationFrame);
        }

        lastRecalculateAnimationFrame = window.requestAnimationFrame(() => {
            recalculateColumnCount();
        });
    }

    function itemsInColumns() {
        const currentColumnCount = columnCount;
        const itemsCols = new Array(currentColumnCount);

        // force children to be handled as an array
        const items = Children.toArray(props.children);

        items.forEach((_, i) => {
            const columnIndex = i % currentColumnCount;

            if (!itemsCols[columnIndex]) {
                itemsCols[columnIndex] = [];
            }

            itemsCols[columnIndex].push(items[i]);
        });

        return itemsCols;
    }

    function renderColumns() {
        const childrenInColumns = itemsInColumns();
        const columnWidth = `${100 / childrenInColumns.length}%`; // from savvior.js
        let className = props.columnClassname;

        if (className && typeof className !== 'string') {
            // this is just checking whether a component passing a custom className or not. seems deprecated but in the meantime i'll pass it.
            if (typeof className === 'undefined') {
                className = 'my-masonry-grid_column';
            }
        }

        const columnAttributes = {
            ...props.columnAttributes,
            style: {
                ...props.columnAttributes?.style,
                width: columnWidth,
            },
            className,
        };

        return childrenInColumns.map((item, i) => {
            const columnKey = `column-${i}`;
            return (
                <div
                    className={columnAttributes.className}
                    style={columnAttributes.style}
                    key={columnKey}
                >
                    {item}
                </div>
            );
        });
    }

    useDidMount(() => {
        recalculateColumnCount();

        if (window) {
            window.addEventListener('resize', reCalculateColumnCountDebounce);
        }
    });

    useDidUpdate(() => {
        recalculateColumnCount();
    });

    useWillUnmount(() => {
        if (window) {
            window.removeEventListener('resize', reCalculateColumnCountDebounce);
        }
    });

    return (
        <div style={props.style} className={props.className}>
            {renderColumns()}
        </div>
    );
}

export default StaggeredLayout;
