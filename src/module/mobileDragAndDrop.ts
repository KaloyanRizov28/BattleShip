export class DragDropTouch {
    static instance: DragDropTouch;
    private _lastTouch: Touch | null = null;
    private _dragSource: HTMLElement | null = null;
    private _touchPositions: { [key: number]: Touch } = {};
    private _dataTransfer: DataTransfer | null = null;

    constructor() {
        if (DragDropTouch.instance) {
            throw new Error("DragDropTouch is a singleton.");
        }
        DragDropTouch.instance = this;

        // Listen to touch events
        document.addEventListener('touchstart', this._touchstart.bind(this));
        document.addEventListener('touchmove', this._touchmove.bind(this));
        document.addEventListener('touchend', this._touchend.bind(this));
    }

    private _touchstart(e: TouchEvent) {
        const touch = e.targetTouches[0];
        this._lastTouch = touch;
        const target = touch.target as HTMLElement;
        
        if (target.draggable) {
            e.preventDefault();
            this._dragSource = target;
            this._dataTransfer = new DataTransfer();
            
            // Dispatch dragstart
            const dragStartEvent = new DragEvent('dragstart', {
                dataTransfer: this._dataTransfer,
                bubbles: true,
                cancelable: true
            });
            target.dispatchEvent(dragStartEvent);
            
            target.classList.add('dragging');
        }
    }

    private _touchmove(e: TouchEvent) {
        if (this._dragSource) {
            e.preventDefault();
            const touch = e.targetTouches[0];
            
            
            const target = document.elementFromPoint(
                touch.clientX,
                touch.clientY
            ) as HTMLElement;

            if (target) {
                
                const dragOverEvent = new DragEvent('dragover', {
                    dataTransfer: this._dataTransfer,
                    bubbles: true,
                    cancelable: true
                });
                target.dispatchEvent(dragOverEvent);
            }
        }
    }

    private _touchend(e: TouchEvent) {
        if (this._dragSource) {
            const touch = e.changedTouches[0];
            
            
            const target = document.elementFromPoint(
                touch.clientX,
                touch.clientY
            ) as HTMLElement;

            if (target) {
                
                const dropEvent = new DragEvent('drop', {
                    dataTransfer: this._dataTransfer,
                    bubbles: true,
                    cancelable: true
                });
                target.dispatchEvent(dropEvent);
            }

           
            const dragEndEvent = new DragEvent('dragend', {
                dataTransfer: this._dataTransfer,
                bubbles: true,
                cancelable: true
            });
            this._dragSource.dispatchEvent(dragEndEvent);

            // Cleanup
            this._dragSource.classList.remove('dragging');
            this._dragSource = null;
            this._dataTransfer = null;
            this._lastTouch = null;
        }
    }
}
export function initDragDropTouch() {
    if (window.ontouchstart !== undefined) {
        new DragDropTouch();
    }
}