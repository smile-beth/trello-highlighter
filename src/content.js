import './style.scss';

const main = (mutationList, observer) => {
    // カード列一覧
    const listElements = document.querySelectorAll('div[data-testid="list"]');
    for (const listElement of listElements) {
        // 各カードを処理
        let sumEstimatePoint = 0;
        let sumActualPoint = 0;
        const elements = listElement.querySelectorAll('a[data-testid="card-name"]');
        for (const element of elements) {
            // タイトル処理
            if (element.dataset.handled === '1') {
                const estimatePoint = element.dataset.estimatePoint;
                const estimateElement = element.querySelector('span.th-point.estimate');
                if (estimatePoint && estimateElement) {
                    // 既に処理済みならポイント和だけ更新
                    sumEstimatePoint += parseFloat(estimatePoint);
                    estimateElement.title = sumEstimatePoint;
                }
                const actualPoint = element.dataset.actualPoint;
                const actualElement = element.querySelector('span.th-point.actual');
                if (actualPoint && actualElement) {
                    // 既に処理済みならポイント和だけ更新
                    sumActualPoint += parseFloat(actualPoint);
                    actualElement.title = sumActualPoint;
                }
                if (estimateElement || actualElement) {
                    continue;
                }
                // handledでもspanが見つからなければ作り直し
            }
            const originalText = element.textContent;
            let highlightedText = '';
            let estimatePoint = null;
            // () と [] で表された数値をポイントとしてハイライト
            highlightedText = originalText
                .replace(/\s*\(([0-9.?]+)\)\s*/g, (_, numStr) => {
                    if (!numStr.match(/\?/)) {
                        element.dataset.estimatePoint = numStr;
                        estimatePoint = parseFloat(numStr);
                        sumEstimatePoint += estimatePoint;
                    }
                    return `<span class="th-point estimate" title="${sumEstimatePoint}">🎯${numStr}</span>`;
                })
                .replace(/\s*\[([0-9.?]+)]\s*/g, (_, numStr) => {
                    let isCaution = false;
                    if (!numStr.match(/\?/)) {
                        element.dataset.actualPoint = numStr;
                        const actualPoint = parseFloat(numStr);
                        sumActualPoint += actualPoint;
                        if (estimatePoint != null && actualPoint > estimatePoint) {
                            isCaution = true;
                        }
                    }
                    return `<span class="th-point actual ${isCaution ? 'caution' : ''}" title="${sumActualPoint}">📝${numStr}</span>`;
                });
            element.innerHTML = highlightedText;
            // 処理済みマーク付与
            element.dataset.handled = '1';
        }
    }
};

// DOM変更監視
function debounce(fn, delay) {
    let timer;
    return (mutationList, observer) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn(mutationList, observer);
        }, delay);
    };
}

const observer = new MutationObserver(debounce(main, 1000));
observer.observe(document.body, {childList: true, subtree: true});
