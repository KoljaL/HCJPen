//
// HELPER
//

// const deb = console.log.bind(window.console);
const select = document.querySelector.bind(document);
const selectAll = document.querySelectorAll.bind(document);

//
// add resize function
//
document.addEventListener('DOMContentLoaded', function() {
    resize(select('.divider'), select('.codeBoxes'), select('.resultBox'), direction = 'horizontal');
    resize(select('.CSSbox .header'), select('.HTMLbox'), select('.CSSbox'), direction = 'vertical');
    resize(select('.JSbox .header'), select('.CSSbox'), select('.JSbox'), direction = 'vertical');
});



/**
 * 
 * resize elements 
 * 
 */
function resize(resizer, prevEl, nextEl, direction = 'horizontal') {
    let x = 0;
    let y = 0;
    let NextMaxWidth = 0;
    let PrevMaxWidth = 0;
    let NextMaxHeight = 0;
    let PrevMaxHeight = 0;


    const mouseDownHandler = function(e) {
        // deb('resizer', resizer)
        // deb('direction', direction)
        // deb('prevEl', prevEl)
        // deb('nextEl', nextEl)
        // deb(' ')

        if (direction === 'horizontal') {
            x = e.clientX;
            PrevWidth = prevEl.getBoundingClientRect().width;
            PrevMaxWidth = prevEl.getBoundingClientRect().width;
            NextMaxWidth = nextEl.getBoundingClientRect().width;
        } 
        // vertically
        else {
            y = e.clientY;
            PrevHeight = prevEl.getBoundingClientRect().height;
            PrevMaxHeight = prevEl.getBoundingClientRect().height;
            NextMaxHeight = nextEl.getBoundingClientRect().height;
        }

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    };



    const mouseMoveHandler = function(e) {

        if (direction === 'horizontal') {
            const dx = e.clientX - x;
            const newPrevMaxWidth = PrevMaxWidth + dx;
            const newNextMaxWidth = NextMaxWidth - dx;
            const newPrevWidth = ((PrevWidth + dx) * 100) / resizer.parentNode.getBoundingClientRect().width;
            prevEl.style.width = `${newPrevWidth}%`;
            prevEl.style.maxWidth = `${newPrevMaxWidth}px`;
            nextEl.style.maxWidth = `${newNextMaxWidth}px`;
            // STYLE
            resizer.style.cursor = 'col-resize';
            document.body.style.cursor = 'col-resize';
        }
        // vertically
        else {
            const dy = e.clientY - y;
            const newPrevMaxHeight = PrevMaxHeight + dy;
            const newNextMaxHeight = NextMaxHeight - dy;
            const newPrevHeight = ((PrevHeight + dy) * 100) / resizer.parentNode.getBoundingClientRect().height;
            prevEl.style.height = `${newPrevHeight}%`;
            prevEl.style.maxHeight = `${newPrevMaxHeight}px`;
            nextEl.style.maxHeight = `${newNextMaxHeight}px`;

            resizer.style.cursor = 'row-resize';
            document.body.style.cursor = 'row-resize';
        }
        // STYLE
        prevEl.style.userSelect = 'none';
        prevEl.style.pointerEvents = 'none';
        nextEl.style.userSelect = 'none';
        nextEl.style.pointerEvents = 'none';
    };



    const mouseUpHandler = function() {
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
        // STYLE
        resizer.style.removeProperty('cursor');
        document.body.style.removeProperty('cursor');
        prevEl.style.removeProperty('user-select');
        prevEl.style.removeProperty('pointer-events');
        nextEl.style.removeProperty('user-select');
        nextEl.style.removeProperty('pointer-events');
    };
    resizer.addEventListener('mousedown', mouseDownHandler);
}