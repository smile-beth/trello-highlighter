import './style.scss';

const main = () => {
    // カード列一覧
    const listElements = document.querySelectorAll('div[data-testid="list"]');
    for (const listElement of listElements) {
        // 各カードを処理
        let sumEstimatePoint = 0;
        let sumActualPoint = 0;
        const elements = listElement.querySelectorAll('a[data-testid="card-name"]');
        for (const element of elements) {
            // タイトル処理
            if (element.dataset.handlded === '1') {
                // 既に処理済みならポイント和だけ更新
                const estimatePoint = element.dataset.estimatePoint;
                if (typeof estimatePoint !== 'undefined') {
                    sumEstimatePoint += parseFloat(estimatePoint);
                    element.querySelector('span.th-point.estimate').title = sumEstimatePoint;
                }
                const actualPoint = element.dataset.actualPoint;
                if (typeof actualPoint !== 'undefined') {
                    sumActualPoint += parseFloat(actualPoint);
                    element.querySelector('span.th-point.actual').title = sumActualPoint;
                }
            } else {
                const originalText = element.textContent;
                let highlightedText = '';
                // () と [] で表された数値をポイントとしてハイライト
                highlightedText = originalText
                    .replace(/\(([0-9.?]+)\)/g, (_, numStr) => {
                        element.dataset.estimatePoint = numStr;
                        sumEstimatePoint += parseFloat(numStr);
                        return `<span class="th-point estimate" title="${sumEstimatePoint}">${numStr}</span>`;
                    })
                    .replace(/\[([0-9.?]+)]/g, (_, numStr) => {
                        element.dataset.actualPoint = numStr;
                        sumActualPoint += parseFloat(numStr);
                        return `<span class="th-point actual" title="${sumActualPoint}">${numStr}</span>`;
                    });
                element.innerHTML = highlightedText;
                // 処理済みマーク付与
                element.dataset.handlded = '1';
            }
        }
    }
};

// DOM変更監視
function debounce(fn, delay) {
    let timer;
    return () => {
        clearTimeout(timer);
        timer = setTimeout(fn, delay);
    };
}

const observer = new MutationObserver(debounce(main, 300));
observer.observe(document.body, {childList: true, subtree: true});
