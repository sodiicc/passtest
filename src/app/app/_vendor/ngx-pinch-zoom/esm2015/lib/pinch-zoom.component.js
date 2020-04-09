/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { Component, HostBinding, ElementRef, HostListener, ViewChild, Input, EventEmitter, Output } from '@angular/core';
export class PinchZoomComponent {
    /**
     * @param {?} elementRef
     */
    constructor(elementRef) {
        this.elementRef = elementRef;
        this.i = 0;
        this.scale = 1;
        this.initialScale = 1;
        this.moveX = 0;
        this.moveY = 0;
        this.initialMoveX = 0;
        this.initialMoveY = 0;
        this.draggingMode = false;
        this.lastTap = 0;
        this.transitionDuration = 200;
        this.doubleTap = true;
        this.zoomButton = true;
        this.linearHorizontalSwipe = false;
        this.linearVerticalSwipe = false;
        this.autoZoomOut = false;
        this.events = new EventEmitter();
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set id(value) {
        this._id = value;
    }
    /**
     * @return {?}
     */
    get id() {
        return this._id;
    }
    /**
     * @return {?}
     */
    get isMobile() {
        var /** @type {?} */ check = false;
        (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))
            check = true; })(navigator.userAgent || navigator.vendor);
        return check;
    }
    ;
    /**
     * @return {?}
     */
    get isDragging() {
        let /** @type {?} */ imgHeight = this.getImageHeight();
        let /** @type {?} */ imgWidth = this.getImageWidth();
        if (this.scale > 1) {
            return imgHeight * this.scale > this.parentElement.offsetHeight || imgWidth * this.scale > this.parentElement.offsetWidth;
        }
        if (this.scale === 1) {
            return imgHeight > this.parentElement.offsetHeight || imgWidth > this.parentElement.offsetWidth;
        }
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.element = this.contentElement.nativeElement;
        this.parentElement = this.elementRef.nativeElement;
        this.setBasicStyles();
        this.element.ondragstart = function () {
            return false;
        };
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onMouseEnter(event) {
        this.getElementPosition();
        if (this.isDragging) {
            this.draggingMode = true;
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onMouseMove(event) {
        if (this.draggingMode) {
            event.preventDefault();
            if (!this.eventType) {
                this.startX = event.clientX - this.elementPosition.left;
                this.startY = event.clientY - this.elementPosition.top;
            }
            this.eventType = 'swipe';
            this.events.emit({
                type: 'swipe',
                moveX: this.moveX,
                moveY: this.moveY
            });
            this.moveX = this.initialMoveX + ((event.clientX - this.elementPosition.left) - this.startX);
            this.moveY = this.initialMoveY + ((event.clientY - this.elementPosition.top) - this.startY);
            this.centeringImage();
            this.transformElement(0);
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onMouseUp(event) {
        this.draggingMode = false;
        this.updateInitialValues();
        this.eventType = '';
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onResize(event) {
        this.setImageWidth();
        this.transformElement(this.transitionDuration);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    touchstartHandler(event) {
        this.getElementPosition();
        if (!this.eventType) {
            this.startX = event.touches[0].clientX - this.elementPosition.left;
            this.startY = event.touches[0].clientY - this.elementPosition.top;
            this.startClientX = event.touches[0].clientX - this.elementPosition.left;
            this.startClientY = event.touches[0].clientY - this.elementPosition.top;
        }
        this.events.emit({ type: 'touchstart' });
    }
    /**
     * @param {?} event
     * @return {?}
     */
    touchmoveHandler(event) {
        let /** @type {?} */ touches = event.touches;
        // Swipe
        if (this.detectSwipe(touches) || this.eventType == 'swipe') {
            this.handleSwipe(event);
        }
        // Linear swipe
        if (this.detectLinearSwipe(touches) || this.eventType == 'horizontal-swipe' || this.eventType == 'vertical-swipe') {
            this.handleLinearSwipe(event);
        }
        // Pinch
        if (touches.length === 2 && !this.eventType || this.eventType == 'pinch') {
            this.handlePinch(event);
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    touchendHandler(event) {
        this.i = 0;
        this.draggingMode = false;
        let /** @type {?} */ touches = event.touches;
        if (this.scale < 1) {
            this.scale = 1;
        }
        // Auto Zoom Out
        if (this.autoZoomOut && this.eventType === 'pinch') {
            this.scale = 1;
        }
        this.events.emit({ type: 'touchend' });
        // Double Tap
        if (this.doubleTapDetection() && !this.eventType) {
            this.toggleZoom(event);
            this.events.emit({ type: 'double-tap' });
            return;
        }
        if (this.eventType === 'pinch' || this.eventType === 'swipe') {
            this.alignImage();
        }
        if (this.eventType === 'pinch' ||
            this.eventType === 'swipe' ||
            this.eventType === 'horizontal-swipe' ||
            this.eventType === 'vertical-swipe') {
            this.updateInitialValues();
        }
        this.eventType = 'touchend';
        if (touches && touches.length == 0) {
            this.eventType = '';
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    handleSwipe(event) {
        event.preventDefault();
        if (!this.eventType) {
            this.startX = event.touches[0].clientX - this.elementPosition.left;
            this.startY = event.touches[0].clientY - this.elementPosition.top;
        }
        this.eventType = 'swipe';
        this.events.emit({
            type: 'swipe',
            moveX: this.moveX,
            moveY: this.moveY
        });
        this.moveX = this.initialMoveX + ((event.touches[0].clientX - this.elementPosition.left) - this.startX);
        this.moveY = this.initialMoveY + ((event.touches[0].clientY - this.elementPosition.top) - this.startY);
        this.transformElement(0);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    handlePinch(event) {
        event.preventDefault();
        let /** @type {?} */ touches = event.touches;
        if (!this.eventType) {
            this.initialDistance = this.getDistance(touches);
            this.moveXC = (((event.touches[0].clientX - this.elementPosition.left) + (event.touches[1].clientX - this.elementPosition.left)) / 2) - this.initialMoveX;
            this.moveYC = (((event.touches[0].clientY - this.elementPosition.top) + (event.touches[1].clientY - this.elementPosition.top)) / 2) - this.initialMoveY;
        }
        this.eventType = 'pinch';
        this.events.emit({ type: 'pinch' });
        this.distance = this.getDistance(touches);
        this.scale = this.initialScale * (this.distance / this.initialDistance);
        this.moveX = this.initialMoveX - (((this.distance / this.initialDistance) * this.moveXC) - this.moveXC);
        this.moveY = this.initialMoveY - (((this.distance / this.initialDistance) * this.moveYC) - this.moveYC);
        this.transformElement(0);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    handleLinearSwipe(event) {
        if (this.linearVerticalSwipe) {
            event.preventDefault();
        }
        this.i++;
        if (this.i > 3) {
            this.eventType = this.getLinearSwipeType(event);
        }
        if (this.eventType == 'horizontal-swipe') {
            this.moveX = this.initialMoveX + ((event.touches[0].clientX - this.elementPosition.left) - this.startX);
            this.moveY = 0;
        }
        if (this.eventType == 'vertical-swipe') {
            this.moveX = 0;
            this.moveY = this.initialMoveY + ((event.touches[0].clientY - this.elementPosition.top) - this.startY);
        }
        if (this.eventType) {
            this.events.emit({
                type: this.eventType,
                moveX: this.moveX,
                moveY: this.moveY
            });
            this.transformElement(0);
        }
    }
    /**
     * @param {?} touches
     * @return {?}
     */
    detectSwipe(touches) {
        return touches.length === 1 && this.scale > 1 && !this.eventType;
    }
    /**
     * @param {?} touches
     * @return {?}
     */
    detectLinearSwipe(touches) {
        return touches.length === 1 && this.scale === 1 && !this.eventType;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    getLinearSwipeType(event) {
        if (this.eventType != 'horizontal-swipe' && this.eventType != 'vertical-swipe') {
            let /** @type {?} */ movementX = Math.abs((event.touches[0].clientX - this.elementPosition.left) - this.startClientX);
            let /** @type {?} */ movementY = Math.abs((event.touches[0].clientY - this.elementPosition.top) - this.startClientY);
            if ((movementY * 3) > movementX) {
                return this.linearVerticalSwipe ? 'vertical-swipe' : '';
            }
            else {
                return this.linearHorizontalSwipe ? 'horizontal-swipe' : '';
            }
        }
        else {
            return this.eventType;
        }
    }
    /**
     * @param {?} touches
     * @return {?}
     */
    getDistance(touches) {
        return Math.sqrt(Math.pow(touches[0].pageX - touches[1].pageX, 2) + Math.pow(touches[0].pageY - touches[1].pageY, 2));
    }
    /**
     * @return {?}
     */
    getImageHeight() {
        return this.element.getElementsByTagName("img")[0].offsetHeight;
    }
    /**
     * @return {?}
     */
    getImageWidth() {
        return this.element.getElementsByTagName("img")[0].offsetWidth;
    }
    /**
     * @return {?}
     */
    setBasicStyles() {
        this.element.style.display = "flex";
        this.element.style.height = "100%";
        this.element.style.alignItems = "center";
        this.element.style.justifyContent = "center";
        this.element.style.transformOrigin = '0 0';
        this.hostDisplay = "block";
        this.hostOverflow = "hidden";
        this.hostHeight = this.containerHeight;
        this.setImageWidth();
    }
    /**
     * @return {?}
     */
    setImageWidth() {
        let /** @type {?} */ imgElement = this.element.getElementsByTagName("img");
        if (imgElement.length) {
            imgElement[0].style.maxWidth = '100%';
            imgElement[0].style.maxHeight = '100%';
        }
    }
    /**
     * @param {?=} duration
     * @return {?}
     */
    transformElement(duration = 50) {
        this.element.style.transition = 'all ' + duration + 'ms';
        this.element.style.transform = 'matrix(' + Number(this.scale) + ',' + 0 + ',' + 0 + ',' + Number(this.scale) + ',' + Number(this.moveX) + ',' + Number(this.moveY) + ')';
    }
    /**
     * @return {?}
     */
    doubleTapDetection() {
        if (!this.doubleTap) {
            return false;
        }
        let /** @type {?} */ currentTime = new Date().getTime();
        let /** @type {?} */ tapLength = currentTime - this.lastTap;
        clearTimeout(this.doubleTapTimeout);
        if (tapLength < 300 && tapLength > 0) {
            return true;
        }
        else {
            this.doubleTapTimeout = setTimeout(function () {
                clearTimeout(this.doubleTapTimeout);
            }, 300);
        }
        this.lastTap = currentTime;
    }
    /**
     * @param {?=} event
     * @return {?}
     */
    toggleZoom(event = false) {
        if (this.initialScale === 1) {
            if (event && event.changedTouches) {
                let /** @type {?} */ changedTouches = event.changedTouches;
                this.scale = this.initialScale * 2;
                this.moveX = this.initialMoveX - (changedTouches[0].clientX - this.elementPosition.left);
                this.moveY = this.initialMoveY - (changedTouches[0].clientY - this.elementPosition.top);
            }
            else {
                this.scale = this.initialScale * 2;
                this.moveX = this.initialMoveX - this.element.offsetWidth / 2;
                this.moveY = this.initialMoveY - this.element.offsetHeight / 2;
            }
            this.centeringImage();
            this.updateInitialValues();
            this.transformElement(this.transitionDuration);
            this.events.emit({ type: 'zoom-in' });
        }
        else {
            this.resetScale();
            this.events.emit({ type: 'zoom-out' });
        }
    }
    /**
     * @return {?}
     */
    resetScale() {
        this.scale = 1;
        this.moveX = 0;
        this.moveY = 0;
        this.updateInitialValues();
        this.transformElement(this.transitionDuration);
    }
    /**
     * @return {?}
     */
    updateInitialValues() {
        this.initialScale = this.scale;
        this.initialMoveX = this.moveX;
        this.initialMoveY = this.moveY;
    }
    /**
     * @return {?}
     */
    centeringImage() {
        let /** @type {?} */ img = this.element.getElementsByTagName("img")[0];
        const /** @type {?} */ initialMoveX = this.moveX;
        const /** @type {?} */ initialMoveY = this.moveY;
        if (this.moveY > 0) {
            this.moveY = 0;
        }
        if (this.moveX > 0) {
            this.moveX = 0;
        }
        if (img) {
            this.transitionYRestriction();
            this.transitionXRestriction();
        }
        if (img && this.scale < 1) {
            if (this.moveX < this.element.offsetWidth * (1 - this.scale)) {
                this.moveX = this.element.offsetWidth * (1 - this.scale);
            }
        }
        return initialMoveX != this.moveX || initialMoveY != this.moveY;
    }
    /**
     * @return {?}
     */
    alignImage() {
        let /** @type {?} */ isMoveChanged = this.centeringImage();
        if (isMoveChanged) {
            this.updateInitialValues();
            this.transformElement(this.transitionDuration);
        }
    }
    /**
     * @return {?}
     */
    transitionYRestriction() {
        let /** @type {?} */ imgHeight = this.getImageHeight();
        if (imgHeight * this.scale < this.parentElement.offsetHeight) {
            this.moveY = (this.parentElement.offsetHeight - this.element.offsetHeight * this.scale) / 2;
        }
        else {
            let /** @type {?} */ imgOffsetTop = ((imgHeight - this.element.offsetHeight) * this.scale) / 2;
            if (this.moveY > imgOffsetTop) {
                this.moveY = imgOffsetTop;
            }
            else if ((imgHeight * this.scale + Math.abs(imgOffsetTop) - this.parentElement.offsetHeight) + this.moveY < 0) {
                this.moveY = -(imgHeight * this.scale + Math.abs(imgOffsetTop) - this.parentElement.offsetHeight);
            }
        }
    }
    /**
     * @return {?}
     */
    transitionXRestriction() {
        let /** @type {?} */ imgWidth = this.getImageWidth();
        if (imgWidth * this.scale < this.parentElement.offsetWidth) {
            this.moveX = (this.parentElement.offsetWidth - this.element.offsetWidth * this.scale) / 2;
        }
        else {
            let /** @type {?} */ imgOffsetLeft = ((imgWidth - this.element.offsetWidth) * this.scale) / 2;
            if (this.moveX > imgOffsetLeft) {
                this.moveX = imgOffsetLeft;
            }
            else if ((imgWidth * this.scale + Math.abs(imgOffsetLeft) - this.parentElement.offsetWidth) + this.moveX < 0) {
                this.moveX = -(imgWidth * this.scale + Math.abs(imgOffsetLeft) - this.parentElement.offsetWidth);
            }
        }
    }
    /**
     * @return {?}
     */
    getElementPosition() {
        this.elementPosition = this.elementRef.nativeElement.getBoundingClientRect();
    }
    /**
     * @param {?} value
     * @param {?=} transitionDuration
     * @return {?}
     */
    setMoveX(value, transitionDuration = 200) {
        this.moveX = value;
        this.transformElement(transitionDuration);
    }
    /**
     * @param {?} value
     * @param {?=} transitionDuration
     * @return {?}
     */
    setMoveY(value, transitionDuration = 200) {
        this.moveY = value;
        this.transformElement(transitionDuration);
    }
}
PinchZoomComponent.decorators = [
    { type: Component, args: [{
                selector: 'pinch-zoom, [pinch-zoom]',
                template: `<div #content 
	[class.pz-dragging]="isDragging">
	<ng-content></ng-content>
</div>

<div class="pz-zoom-button"
	*ngIf="zoomButton && !isMobile"
	(click)="toggleZoom()"
	[class.pz-zoom-out]="scale > 1">
</div>`,
                styles: [`:host{position:relative}.pz-dragging{cursor:all-scroll}.pz-zoom-button{position:absolute;left:50%;bottom:16px;margin-left:-22px;z-index:1000;color:#fff;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAQAAABLCVATAAABVUlEQVR4Ae3PAwxQXRgA0Pvbto1sW2NDts0x27atIdeQrakpY8i23cnGe5nn8epDeO1h+VgeVdRVRJLwsCQ101nX2aWJd8OD8a7Ozrkda6UJ8XnPUsBZy43S2Wz7rs8UDnEZCZjn5+tzb6jqCDgucYhDakAnb4Rb+MdmMCPEYSqYfH2cXfPr/ymcBalDFF84izN+uD7TnHCdXqB7iCI/WByuuy1QbrAiRFEL9L3WlObmc/l7uUHfgn0hivqg47VaXMfluQ/A6RBFeTDmnq39D7aEKNKBXfcMVBVMCtFsB0XvFshbVoBSIZqGYL8/wh10B/u8F6L52E6wU7ZwEx/oC6gV4pHVOXDeIPn95WOZ1bYRsD7EJ79D7m4nmO7dEI+fTHC7o7p6h+uh4pJJB0vscMwKQ+X13uXZ6RGh4vKeeQ8c6nWoJiFadCjRFUXzntbeDc/GaxcAotf7cicflKkAAAAASUVORK5CYII=),url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAQAAABLCVATAAABS0lEQVR4Ae3UA8xWfQCG8afPNrNt240N2TbHbNu2hlxDtqamjCHbdr/s5905b9Z1fN/bdfyPfOZl8ZMSGmipggwvL8loqZsAOKaDb2Ir+UZ/t7zITjlio/nWRsBNm03T33KnHiflw4umAlaJ/ziLo6EL4LL04TTZAf3Eea5JYT9YEk60EMyP2mVxE2QP1vzuJm74P4Z+GBgcLCoN1sfYFwdbgkXNwMj7+4V1fnq6n/0DTgWLWoO+9/c7AwD3s+/B9WBRbTAjxj41OBAsygWOxdg3BPMiwTgMKkbtvrQFVAsjagtOSxKlGwxO+Tbc0HEUHFXomfx7IwHNIuFQ0C1w2zilJfOT/JrbC9gdCY/SzonOUbA49Mgknjme56KBvuaxKizy6WODIy7ZYqKSDx6xxUGq8MPeqlirPqs6RKljqwq6ovCq7r6JvBs+cwdLiOaEU9ek1AAAAABJRU5ErkJggg==),url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAQAAABLCVATAAABVUlEQVR4Ae3PAwxQXRgA0Pvbto1sW2NDts0x27atIdeQrakpY8i23cnGe5nn8epDeO1h+VgeVdRVRJLwsCQ101nX2aWJd8OD8a7Ozrkda6UJ8XnPUsBZy43S2Wz7rs8UDnEZCZjn5+tzb6jqCDgucYhDakAnb4Rb+MdmMCPEYSqYfH2cXfPr/ymcBalDFF84izN+uD7TnHCdXqB7iCI/WByuuy1QbrAiRFEL9L3WlObmc/l7uUHfgn0hivqg47VaXMfluQ/A6RBFeTDmnq39D7aEKNKBXfcMVBVMCtFsB0XvFshbVoBSIZqGYL8/wh10B/u8F6L52E6wU7ZwEx/oC6gV4pHVOXDeIPn95WOZ1bYRsD7EJ79D7m4nmO7dEI+fTHC7o7p6h+uh4pJJB0vscMwKQ+X13uXZ6RGh4vKeeQ8c6nWoJiFadCjRFUXzntbeDc/GaxcAotf7cicflKkAAAAASUVORK5CYII=),url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAQAAABLCVATAAABS0lEQVR4Ae3UA8xWfQCG8afPNrNt240N2TbHbNu2hlxDtqamjCHbdr/s5905b9Z1fN/bdfyPfOZl8ZMSGmipggwvL8loqZsAOKaDb2Ir+UZ/t7zITjlio/nWRsBNm03T33KnHiflw4umAlaJ/ziLo6EL4LL04TTZAf3Eea5JYT9YEk60EMyP2mVxE2QP1vzuJm74P4Z+GBgcLCoN1sfYFwdbgkXNwMj7+4V1fnq6n/0DTgWLWoO+9/c7AwD3s+/B9WBRbTAjxj41OBAsygWOxdg3BPMiwTgMKkbtvrQFVAsjagtOSxKlGwxO+Tbc0HEUHFXomfx7IwHNIuFQ0C1w2zilJfOT/JrbC9gdCY/SzonOUbA49Mgknjme56KBvuaxKizy6WODIy7ZYqKSDx6xxUGq8MPeqlirPqs6RKljqwq6ovCq7r6JvBs+cwdLiOaEU9ek1AAAAABJRU5ErkJggg==);background-color:rgba(0,0,0,.8);background-position:center,-1000px;background-repeat:no-repeat,no-repeat;width:56px;height:56px;border-radius:4px;opacity:.5;cursor:pointer;transition:opacity .1s;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.pz-zoom-button.pz-zoom-out{background-position:-1000px,center}.pz-zoom-button:hover{opacity:.7}`]
            },] },
];
/** @nocollapse */
PinchZoomComponent.ctorParameters = () => [
    { type: ElementRef }
];
PinchZoomComponent.propDecorators = {
    containerHeight: [{ type: Input, args: ['height',] }],
    transitionDuration: [{ type: Input, args: ['transition-duration',] }],
    doubleTap: [{ type: Input, args: ['double-tap',] }],
    zoomButton: [{ type: Input, args: ['zoom-button',] }],
    linearHorizontalSwipe: [{ type: Input, args: ['linear-horizontal-swipe',] }],
    linearVerticalSwipe: [{ type: Input, args: ['linear-vertical-swipe',] }],
    autoZoomOut: [{ type: Input, args: ['auto-zoom-out',] }],
    id: [{ type: Input, args: ['id',] }],
    events: [{ type: Output }],
    hostDisplay: [{ type: HostBinding, args: ['style.display',] }],
    hostOverflow: [{ type: HostBinding, args: ['style.overflow',] }],
    hostHeight: [{ type: HostBinding, args: ['style.height',] }],
    contentElement: [{ type: ViewChild, args: ['content',] }],
    onMouseEnter: [{ type: HostListener, args: ["mousedown", ['$event'],] }],
    onMouseMove: [{ type: HostListener, args: ["window:mousemove", ['$event'],] }],
    onMouseUp: [{ type: HostListener, args: ["window:mouseup", ['$event'],] }],
    onResize: [{ type: HostListener, args: ['window:resize', ['$event'],] }],
    touchstartHandler: [{ type: HostListener, args: ['touchstart', ['$event'],] }],
    touchmoveHandler: [{ type: HostListener, args: ['touchmove', ['$event'],] }],
    touchendHandler: [{ type: HostListener, args: ['touchend', ['$event'],] }]
};
function PinchZoomComponent_tsickle_Closure_declarations() {
    /** @type {?} */
    PinchZoomComponent.prototype.i;
    /** @type {?} */
    PinchZoomComponent.prototype._id;
    /** @type {?} */
    PinchZoomComponent.prototype.element;
    /** @type {?} */
    PinchZoomComponent.prototype.elementPosition;
    /** @type {?} */
    PinchZoomComponent.prototype.parentElement;
    /** @type {?} */
    PinchZoomComponent.prototype.eventType;
    /** @type {?} */
    PinchZoomComponent.prototype.scale;
    /** @type {?} */
    PinchZoomComponent.prototype.initialScale;
    /** @type {?} */
    PinchZoomComponent.prototype.startX;
    /** @type {?} */
    PinchZoomComponent.prototype.startY;
    /** @type {?} */
    PinchZoomComponent.prototype.startClientX;
    /** @type {?} */
    PinchZoomComponent.prototype.startClientY;
    /** @type {?} */
    PinchZoomComponent.prototype.moveX;
    /** @type {?} */
    PinchZoomComponent.prototype.moveY;
    /** @type {?} */
    PinchZoomComponent.prototype.initialMoveX;
    /** @type {?} */
    PinchZoomComponent.prototype.initialMoveY;
    /** @type {?} */
    PinchZoomComponent.prototype.moveXC;
    /** @type {?} */
    PinchZoomComponent.prototype.moveYC;
    /** @type {?} */
    PinchZoomComponent.prototype.distance;
    /** @type {?} */
    PinchZoomComponent.prototype.initialDistance;
    /** @type {?} */
    PinchZoomComponent.prototype.draggingMode;
    /** @type {?} */
    PinchZoomComponent.prototype.doubleTapTimeout;
    /** @type {?} */
    PinchZoomComponent.prototype.lastTap;
    /** @type {?} */
    PinchZoomComponent.prototype.containerHeight;
    /** @type {?} */
    PinchZoomComponent.prototype.transitionDuration;
    /** @type {?} */
    PinchZoomComponent.prototype.doubleTap;
    /** @type {?} */
    PinchZoomComponent.prototype.zoomButton;
    /** @type {?} */
    PinchZoomComponent.prototype.linearHorizontalSwipe;
    /** @type {?} */
    PinchZoomComponent.prototype.linearVerticalSwipe;
    /** @type {?} */
    PinchZoomComponent.prototype.autoZoomOut;
    /** @type {?} */
    PinchZoomComponent.prototype.events;
    /** @type {?} */
    PinchZoomComponent.prototype.hostDisplay;
    /** @type {?} */
    PinchZoomComponent.prototype.hostOverflow;
    /** @type {?} */
    PinchZoomComponent.prototype.hostHeight;
    /** @type {?} */
    PinchZoomComponent.prototype.contentElement;
    /** @type {?} */
    PinchZoomComponent.prototype.elementRef;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGluY2gtem9vbS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtcGluY2gtem9vbS8iLCJzb3VyY2VzIjpbImxpYi9waW5jaC16b29tLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBVSxTQUFTLEVBQUUsS0FBSyxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFpQmpJLE1BQU07Ozs7SUFzRUYsWUFBb0IsVUFBc0I7UUFBdEIsZUFBVSxHQUFWLFVBQVUsQ0FBWTtpQkFwRTlCLENBQUM7cUJBT0csQ0FBQzs0QkFDTSxDQUFDO3FCQU9YLENBQUM7cUJBQ0QsQ0FBQzs0QkFDTSxDQUFDOzRCQUNELENBQUM7NEJBTUcsS0FBSzt1QkFFWCxDQUFDO2tDQUd3QyxHQUFHO3lCQUNwQixJQUFJOzBCQUNGLElBQUk7cUNBQ21CLEtBQUs7bUNBQ1QsS0FBSzsyQkFDckIsS0FBSztzQkFRZCxJQUFJLFlBQVksRUFBTztLQTJCNUQ7Ozs7O0lBbENELElBQWlCLEVBQUUsQ0FBQyxLQUFVO1FBQzFCLElBQUksQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDO0tBQ3BCOzs7O0lBQ0QsSUFBSSxFQUFFO1FBQ0YsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7S0FDbkI7Ozs7SUFVRCxJQUFJLFFBQVE7UUFDUixxQkFBSSxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ2xCLENBQUMsVUFBUyxDQUFDLElBQUUsRUFBRSxDQUFBLENBQUMsMFRBQTBULENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFFLHlrREFBeWtELENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEVBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FB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LFNBQVMsU0FBQztnQkFDUCxRQUFRLEVBQUUsMEJBQTBCO2dCQUNwQyxRQUFRLEVBQUU7Ozs7Ozs7OztPQVNQO2dCQUNILE1BQU0sRUFBRSxDQUFDLDJzRkFBMnNGLENBQUM7YUFDeHRGOzs7O1lBZmdDLFVBQVU7Ozs4QkErQ3RDLEtBQUssU0FBQyxRQUFRO2lDQUNkLEtBQUssU0FBQyxxQkFBcUI7d0JBQzNCLEtBQUssU0FBQyxZQUFZO3lCQUNsQixLQUFLLFNBQUMsYUFBYTtvQ0FDbkIsS0FBSyxTQUFDLHlCQUF5QjtrQ0FDL0IsS0FBSyxTQUFDLHVCQUF1QjswQkFDN0IsS0FBSyxTQUFDLGVBQWU7aUJBQ3JCLEtBQUssU0FBQyxJQUFJO3FCQU9WLE1BQU07MEJBRU4sV0FBVyxTQUFDLGVBQWU7MkJBQzNCLFdBQVcsU0FBQyxnQkFBZ0I7eUJBQzVCLFdBQVcsU0FBQyxjQUFjOzZCQUUxQixTQUFTLFNBQUMsU0FBUzsyQkF1Q25CLFlBQVksU0FBQyxXQUFXLEVBQUUsQ0FBQyxRQUFRLENBQUM7MEJBU3BDLFlBQVksU0FBQyxrQkFBa0IsRUFBRSxDQUFDLFFBQVEsQ0FBQzt3QkF5QjNDLFlBQVksU0FBQyxnQkFBZ0IsRUFBRSxDQUFDLFFBQVEsQ0FBQzt1QkFZekMsWUFBWSxTQUFDLGVBQWUsRUFBRSxDQUFDLFFBQVEsQ0FBQztnQ0FNeEMsWUFBWSxTQUFDLFlBQVksRUFBRSxDQUFDLFFBQVEsQ0FBQzsrQkFlckMsWUFBWSxTQUFDLFdBQVcsRUFBRSxDQUFDLFFBQVEsQ0FBQzs4QkFvQnBDLFlBQVksU0FBQyxVQUFVLEVBQUUsQ0FBQyxRQUFRLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIEhvc3RCaW5kaW5nLCBFbGVtZW50UmVmLCBIb3N0TGlzdGVuZXIsIE9uSW5pdCwgVmlld0NoaWxkLCBJbnB1dCwgRXZlbnRFbWl0dGVyLCBPdXRwdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdwaW5jaC16b29tLCBbcGluY2gtem9vbV0nLFxuICAgIHRlbXBsYXRlOiBgPGRpdiAjY29udGVudCBcblx0W2NsYXNzLnB6LWRyYWdnaW5nXT1cImlzRHJhZ2dpbmdcIj5cblx0PG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuPC9kaXY+XG5cbjxkaXYgY2xhc3M9XCJwei16b29tLWJ1dHRvblwiXG5cdCpuZ0lmPVwiem9vbUJ1dHRvbiAmJiAhaXNNb2JpbGVcIlxuXHQoY2xpY2spPVwidG9nZ2xlWm9vbSgpXCJcblx0W2NsYXNzLnB6LXpvb20tb3V0XT1cInNjYWxlID4gMVwiPlxuPC9kaXY+YCxcbiAgICBzdHlsZXM6IFtgOmhvc3R7cG9zaXRpb246cmVsYXRpdmV9LnB6LWRyYWdnaW5ne2N1cnNvcjphbGwtc2Nyb2xsfS5wei16b29tLWJ1dHRvbntwb3NpdGlvbjphYnNvbHV0ZTtsZWZ0OjUwJTtib3R0b206MTZweDttYXJnaW4tbGVmdDotMjJweDt6LWluZGV4OjEwMDA7Y29sb3I6I2ZmZjtiYWNrZ3JvdW5kLWltYWdlOnVybChkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUNRQUFBQWtDQVFBQUFCTENWQVRBQUFCVlVsRVFWUjRBZTNQQXd4UVhSZ0EwUHZidG8xc1cyTkR0czB4MjdhdElkZVFyYWtwWThpMjNjbkdlNW5uOGVwRGVPMWgrVmdlVmRSVlJKTHdzQ1ExMDFuWDJhV0pkOE9EOGE3T3pya2RhNlVKOFhuUFVzQlp5NDNTMld6N3JzOFVEbkVaQ1pqbjUrdHpiNmpxQ0RndWNZaERha0FuYjRSYitNZG1NQ1BFWVNxWWZIMmNYZlByL3ltY0JhbERGRjg0aXpOK3VEN1RuSENkWHFCN2lDSS9XQnl1dXkxUWJyQWlSRkVMOUwzV2xPYm1jL2w3dVVIZmduMGhpdnFnNDdWYVhNZmx1US9BNlJCRmVURG1ucTM5RDdhRUtOS0JYZmNNVkJWTUN0RnNCMFh2RnNoYlZvQlNJWnFHWUw4L3doMTBCL3U4RjZMNTJFNndVN1p3RXgvb0M2Z1Y0cEhWT1hEZUlQbjk1V09aMWJZUnNEN0VKNzlEN200bm1PN2RFSStmVEhDN283cDZoK3VoNHBKSkIwdnNjTXdLUStYMTN1WFo2UkdoNHZLZWVROGM2bldvSmlGYWRDalJGVVh6bnRiZURjL0dheGNBb3RmN2NpY2ZsS2tBQUFBQVNVVk9SSzVDWUlJPSksdXJsKGRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQ1FBQUFBa0NBUUFBQUJMQ1ZBVEFBQUJTMGxFUVZSNEFlM1VBOHhXZlFDRzhhZlBOck50MjQwTjJUYkhiTnUyaGx4RHRxYW1qQ0hiZHIvczU5MDViOVoxZk4vYmRmeVBmT1psOFpNU0dtaXBnZ3d2TDhsb3Fac0FPS2FEYjJJcitVWi90N3pJVGpsaW8vbldSc0JObTAzVDMzS25IaWZsdzR1bUFsYUovemlMbzZFTDRMTDA0VFRaQWYzRWVhNUpZVDlZRWs2MEVNeVAybVZ4RTJRUDF2enVKbTc0UDRaK0dCZ2NMQ29OMXNmWUZ3ZGJna1hOd01qNys0VjFmbnE2bi8wRFRnV0xXb08rOS9jN0F3RDNzKy9COVdCUmJUQWp4ajQxT0JBc3lnV094ZGczQlBNaXdUZ01La2J0dnJRRlZBc2phZ3RPU3hLbEd3eE8rVGJjMEhFVUhGWG9tZng3SXdITkl1RlEwQzF3MnppbEpmT1QvSnJiQzlnZENZL1N6b25PVWJBNDlNZ2tuam1lNTZLQnZ1YXhLaXp5NldPREl5N1pZcUtTRHg2eHhVR3E4TVBlcWxpclBxczZSS2xqcXdxNm92Q3E3cjZKdkJzK2N3ZExpT2FFVTllazFBQUFBQUJKUlU1RXJrSmdnZz09KSx1cmwoZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFDUUFBQUFrQ0FRQUFBQkxDVkFUQUFBQlZVbEVRVlI0QWUzUEF3eFFYUmdBMFB2YnRvMXNXMk5EdHMweDI3YXRJZGVRcmFrcFk4aTIzY25HZTVubjhlcERlTzFoK1ZnZVZkUlZSSkx3c0NRMTAxblgyYVdKZDhPRDhhN096cmtkYTZVSjhYblBVc0JaeTQzUzJXejdyczhVRG5FWkNaam41K3R6YjZqcUNEZ3VjWWhEYWtBbmI0UmIrTWRtTUNQRVlTcVlmSDJjWGZQci95bWNCYWxERkY4NGl6Tit1RDdUbkhDZFhxQjdpQ0kvV0J5dXV5MVFickFpUkZFTDlMM1dsT2JtYy9sN3VVSGZnbjBoaXZxZzQ3VmFYTWZsdVEvQTZSQkZlVERtbnEzOUQ3YUVLTktCWGZjTVZCVk1DdEZzQjBYdkZzaGJWb0JTSVpxR1lMOC93aDEwQi91OEY2TDUyRTZ3VTdad0V4L29DNmdWNHBIVk9YRGVJUG45NVdPWjFiWVJzRDdFSjc5RDdtNG5tTzdkRUkrZlRIQzdvN3A2aCt1aDRwSkpCMHZzY013S1ErWDEzdVhaNlJHaDR2S2VlUThjNm5Xb0ppRmFkQ2pSRlVYem50YmVEYy9HYXhjQW90ZjdjaWNmbEtrQUFBQUFTVVZPUks1Q1lJST0pLHVybChkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUNRQUFBQWtDQVFBQUFCTENWQVRBQUFCUzBsRVFWUjRBZTNVQTh4V2ZRQ0c4YWZQTnJOdDI0ME4yVGJIYk51MmhseER0cWFtakNIYmRyL3M1OTA1YjlaMWZOL2JkZnlQZk9abDhaTVNHbWlwZ2d3dkw4bG9xWnNBT0thRGIySXIrVVovdDd6SVRqbGlvL25XUnNCTm0wM1QzM0tuSGlmbHc0dW1BbGFKL3ppTG82RUw0TEwwNFRUWkFmM0VlYTVKWVQ5WUVrNjBFTXlQMm1WeEUyUVAxdnp1Sm03NFA0WitHQmdjTENvTjFzZllGd2RiZ2tYTndNajcrNFYxZm5xNm4vMERUZ1dMV29PKzkvYzdBd0QzcysvQjlXQlJiVEFqeGo0MU9CQXN5Z1dPeGRnM0JQTWl3VGdNS2tidHZyUUZWQXNqYWd0T1N4S2xHd3hPK1RiYzBIRVVIRlhvbWZ4N0l3SE5JdUZRMEMxdzJ6aWxKZk9UL0pyYkM5Z2RDWS9Tem9uT1ViQTQ5TWdrbmptZTU2S0J2dWF4S2l6eTZXT0RJeTdaWXFLU0R4Nnh4VUdxOE1QZXFsaXJQcXM2UktsanF3cTZvdkNxN3I2SnZCcytjd2RMaU9hRVU5ZWsxQUFBQUFCSlJVNUVya0pnZ2c9PSk7YmFja2dyb3VuZC1jb2xvcjpyZ2JhKDAsMCwwLC44KTtiYWNrZ3JvdW5kLXBvc2l0aW9uOmNlbnRlciwtMTAwMHB4O2JhY2tncm91bmQtcmVwZWF0Om5vLXJlcGVhdCxuby1yZXBlYXQ7d2lkdGg6NTZweDtoZWlnaHQ6NTZweDtib3JkZXItcmFkaXVzOjRweDtvcGFjaXR5Oi41O2N1cnNvcjpwb2ludGVyO3RyYW5zaXRpb246b3BhY2l0eSAuMXM7LXdlYmtpdC11c2VyLXNlbGVjdDpub25lOy1tb3otdXNlci1zZWxlY3Q6bm9uZTstbXMtdXNlci1zZWxlY3Q6bm9uZTt1c2VyLXNlbGVjdDpub25lfS5wei16b29tLWJ1dHRvbi5wei16b29tLW91dHtiYWNrZ3JvdW5kLXBvc2l0aW9uOi0xMDAwcHgsY2VudGVyfS5wei16b29tLWJ1dHRvbjpob3ZlcntvcGFjaXR5Oi43fWBdXG59KVxuXG5leHBvcnQgY2xhc3MgUGluY2hab29tQ29tcG9uZW50IHtcblxuICAgIGk6IG51bWJlciA9IDA7XG4gICAgX2lkOiBhbnk7XG4gICAgZWxlbWVudDogYW55O1xuICAgIGVsZW1lbnRQb3NpdGlvbjogYW55O1xuICAgIHBhcmVudEVsZW1lbnQ6IGFueTtcbiAgICBldmVudFR5cGU6IGFueTtcblxuICAgIHNjYWxlOiBudW1iZXIgPSAxO1xuICAgIGluaXRpYWxTY2FsZTogbnVtYmVyID0gMTtcblxuICAgIHN0YXJ0WDogbnVtYmVyO1xuICAgIHN0YXJ0WTogbnVtYmVyO1xuICAgIHN0YXJ0Q2xpZW50WDogbnVtYmVyO1xuICAgIHN0YXJ0Q2xpZW50WTogbnVtYmVyO1xuXG4gICAgbW92ZVg6IGFueSA9IDA7XG4gICAgbW92ZVk6IGFueSA9IDA7XG4gICAgaW5pdGlhbE1vdmVYOiBhbnkgPSAwO1xuICAgIGluaXRpYWxNb3ZlWTogYW55ID0gMDtcbiAgICBtb3ZlWEM6IG51bWJlcjtcbiAgICBtb3ZlWUM6IG51bWJlcjtcblxuICAgIGRpc3RhbmNlOiBudW1iZXI7XG4gICAgaW5pdGlhbERpc3RhbmNlOiBudW1iZXI7XG4gICAgZHJhZ2dpbmdNb2RlOiBib29sZWFuID0gZmFsc2U7XG4gICAgZG91YmxlVGFwVGltZW91dDogYW55O1xuICAgIGxhc3RUYXA6IG51bWJlciA9IDA7XG5cbiAgICBASW5wdXQoJ2hlaWdodCcpIGNvbnRhaW5lckhlaWdodDogc3RyaW5nO1xuICAgIEBJbnB1dCgndHJhbnNpdGlvbi1kdXJhdGlvbicpIHRyYW5zaXRpb25EdXJhdGlvbjogbnVtYmVyID0gMjAwO1xuICAgIEBJbnB1dCgnZG91YmxlLXRhcCcpIGRvdWJsZVRhcDogYm9vbGVhbiA9IHRydWU7XG4gICAgQElucHV0KCd6b29tLWJ1dHRvbicpIHpvb21CdXR0b246IGJvb2xlYW4gPSB0cnVlO1xuICAgIEBJbnB1dCgnbGluZWFyLWhvcml6b250YWwtc3dpcGUnKSBsaW5lYXJIb3Jpem9udGFsU3dpcGU6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBASW5wdXQoJ2xpbmVhci12ZXJ0aWNhbC1zd2lwZScpIGxpbmVhclZlcnRpY2FsU3dpcGU6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBASW5wdXQoJ2F1dG8tem9vbS1vdXQnKSBhdXRvWm9vbU91dDogYm9vbGVhbiA9IGZhbHNlO1xuICAgIEBJbnB1dCgnaWQnKSBzZXQgaWQodmFsdWU6IGFueSkge1xuICAgICAgICB0aGlzLl9pZCA9IHZhbHVlO1xuICAgIH1cbiAgICBnZXQgaWQoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lkO1xuICAgIH1cbiAgICBcbiAgICBAT3V0cHV0KCkgZXZlbnRzOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gICAgQEhvc3RCaW5kaW5nKCdzdHlsZS5kaXNwbGF5JykgaG9zdERpc3BsYXk6c3RyaW5nO1xuICAgIEBIb3N0QmluZGluZygnc3R5bGUub3ZlcmZsb3cnKSBob3N0T3ZlcmZsb3c6c3RyaW5nO1xuICAgIEBIb3N0QmluZGluZygnc3R5bGUuaGVpZ2h0JykgaG9zdEhlaWdodDpzdHJpbmc7XG5cbiAgICBAVmlld0NoaWxkKCdjb250ZW50JykgY29udGVudEVsZW1lbnQ6IEVsZW1lbnRSZWY7XG5cbiAgICBnZXQgaXNNb2JpbGUoKSB7XG4gICAgICAgIHZhciBjaGVjayA9IGZhbHNlO1xuICAgICAgICAoZnVuY3Rpb24oYSl7aWYoLyhhbmRyb2lkfGJiXFxkK3xtZWVnbykuK21vYmlsZXxhdmFudGdvfGJhZGFcXC98YmxhY2tiZXJyeXxibGF6ZXJ8Y29tcGFsfGVsYWluZXxmZW5uZWN8aGlwdG9wfGllbW9iaWxlfGlwKGhvbmV8b2QpfGlyaXN8a2luZGxlfGxnZSB8bWFlbW98bWlkcHxtbXB8bW9iaWxlLitmaXJlZm94fG5ldGZyb250fG9wZXJhIG0ob2J8aW4paXxwYWxtKCBvcyk/fHBob25lfHAoaXhpfHJlKVxcL3xwbHVja2VyfHBvY2tldHxwc3B8c2VyaWVzKDR8NikwfHN5bWJpYW58dHJlb3x1cFxcLihicm93c2VyfGxpbmspfHZvZGFmb25lfHdhcHx3aW5kb3dzIGNlfHhkYXx4aWluby9pLnRlc3QoYSl8fC8xMjA3fDYzMTB8NjU5MHwzZ3NvfDR0aHB8NTBbMS02XWl8Nzcwc3w4MDJzfGEgd2F8YWJhY3xhYyhlcnxvb3xzXFwtKXxhaShrb3xybil8YWwoYXZ8Y2F8Y28pfGFtb2l8YW4oZXh8bnl8eXcpfGFwdHV8YXIoY2h8Z28pfGFzKHRlfHVzKXxhdHR3fGF1KGRpfFxcLW18ciB8cyApfGF2YW58YmUoY2t8bGx8bnEpfGJpKGxifHJkKXxibChhY3xheil8YnIoZXx2KXd8YnVtYnxid1xcLShufHUpfGM1NVxcL3xjYXBpfGNjd2F8Y2RtXFwtfGNlbGx8Y2h0bXxjbGRjfGNtZFxcLXxjbyhtcHxuZCl8Y3Jhd3xkYShpdHxsbHxuZyl8ZGJ0ZXxkY1xcLXN8ZGV2aXxkaWNhfGRtb2J8ZG8oY3xwKW98ZHMoMTJ8XFwtZCl8ZWwoNDl8YWkpfGVtKGwyfHVsKXxlcihpY3xrMCl8ZXNsOHxleihbNC03XTB8b3N8d2F8emUpfGZldGN8Zmx5KFxcLXxfKXxnMSB1fGc1NjB8Z2VuZXxnZlxcLTV8Z1xcLW1vfGdvKFxcLnd8b2QpfGdyKGFkfHVuKXxoYWllfGhjaXR8aGRcXC0obXxwfHQpfGhlaVxcLXxoaShwdHx0YSl8aHAoIGl8aXApfGhzXFwtY3xodChjKFxcLXwgfF98YXxnfHB8c3x0KXx0cCl8aHUoYXd8dGMpfGlcXC0oMjB8Z298bWEpfGkyMzB8aWFjKCB8XFwtfFxcLyl8aWJyb3xpZGVhfGlnMDF8aWtvbXxpbTFrfGlubm98aXBhcXxpcmlzfGphKHR8dilhfGpicm98amVtdXxqaWdzfGtkZGl8a2VqaXxrZ3QoIHxcXC8pfGtsb258a3B0IHxrd2NcXC18a3lvKGN8ayl8bGUobm98eGkpfGxnKCBnfFxcLyhrfGx8dSl8NTB8NTR8XFwtW2Etd10pfGxpYnd8bHlueHxtMVxcLXd8bTNnYXxtNTBcXC98bWEodGV8dWl8eG8pfG1jKDAxfDIxfGNhKXxtXFwtY3J8bWUocmN8cmkpfG1pKG84fG9hfHRzKXxtbWVmfG1vKDAxfDAyfGJpfGRlfGRvfHQoXFwtfCB8b3x2KXx6eil8bXQoNTB8cDF8diApfG13YnB8bXl3YXxuMTBbMC0yXXxuMjBbMi0zXXxuMzAoMHwyKXxuNTAoMHwyfDUpfG43KDAoMHwxKXwxMCl8bmUoKGN8bSlcXC18b258dGZ8d2Z8d2d8d3QpfG5vayg2fGkpfG56cGh8bzJpbXxvcCh0aXx3dil8b3Jhbnxvd2cxfHA4MDB8cGFuKGF8ZHx0KXxwZHhnfHBnKDEzfFxcLShbMS04XXxjKSl8cGhpbHxwaXJlfHBsKGF5fHVjKXxwblxcLTJ8cG8oY2t8cnR8c2UpfHByb3h8cHNpb3xwdFxcLWd8cWFcXC1hfHFjKDA3fDEyfDIxfDMyfDYwfFxcLVsyLTddfGlcXC0pfHF0ZWt8cjM4MHxyNjAwfHJha3N8cmltOXxybyh2ZXx6byl8czU1XFwvfHNhKGdlfG1hfG1tfG1zfG55fHZhKXxzYygwMXxoXFwtfG9vfHBcXC0pfHNka1xcL3xzZShjKFxcLXwwfDEpfDQ3fG1jfG5kfHJpKXxzZ2hcXC18c2hhcnxzaWUoXFwtfG0pfHNrXFwtMHxzbCg0NXxpZCl8c20oYWx8YXJ8YjN8aXR8dDUpfHNvKGZ0fG55KXxzcCgwMXxoXFwtfHZcXC18diApfHN5KDAxfG1iKXx0MigxOHw1MCl8dDYoMDB8MTB8MTgpfHRhKGd0fGxrKXx0Y2xcXC18dGRnXFwtfHRlbChpfG0pfHRpbVxcLXx0XFwtbW98dG8ocGx8c2gpfHRzKDcwfG1cXC18bTN8bTUpfHR4XFwtOXx1cChcXC5ifGcxfHNpKXx1dHN0fHY0MDB8djc1MHx2ZXJpfHZpKHJnfHRlKXx2ayg0MHw1WzAtM118XFwtdil8dm00MHx2b2RhfHZ1bGN8dngoNTJ8NTN8NjB8NjF8NzB8ODB8ODF8ODN8ODV8OTgpfHczYyhcXC18ICl8d2ViY3x3aGl0fHdpKGcgfG5jfG53KXx3bWxifHdvbnV8eDcwMHx5YXNcXC18eW91cnx6ZXRvfHp0ZVxcLS9pLnRlc3QoYS5zdWJzdHIoMCw0KSkpIGNoZWNrID0gdHJ1ZTt9KShuYXZpZ2F0b3IudXNlckFnZW50fHxuYXZpZ2F0b3IudmVuZG9yKTtcbiAgICAgICAgcmV0dXJuIGNoZWNrO1xuICAgIH07XG5cbiAgICBnZXQgaXNEcmFnZ2luZygpe1xuICAgICAgICBsZXQgaW1nSGVpZ2h0ID0gdGhpcy5nZXRJbWFnZUhlaWdodCgpO1xuICAgICAgICBsZXQgaW1nV2lkdGggPSB0aGlzLmdldEltYWdlV2lkdGgoKTtcblxuICAgICAgICBpZiAodGhpcy5zY2FsZSA+IDEpIHtcbiAgICAgICAgICAgIHJldHVybiBpbWdIZWlnaHQgKiB0aGlzLnNjYWxlID4gdGhpcy5wYXJlbnRFbGVtZW50Lm9mZnNldEhlaWdodCB8fCBpbWdXaWR0aCAqIHRoaXMuc2NhbGUgPiB0aGlzLnBhcmVudEVsZW1lbnQub2Zmc2V0V2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuc2NhbGUgPT09IDEpIHtcbiAgICAgICAgICAgIHJldHVybiBpbWdIZWlnaHQgPiB0aGlzLnBhcmVudEVsZW1lbnQub2Zmc2V0SGVpZ2h0IHx8IGltZ1dpZHRoID4gdGhpcy5wYXJlbnRFbGVtZW50Lm9mZnNldFdpZHRoO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBlbGVtZW50UmVmOiBFbGVtZW50UmVmKXtcbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gdGhpcy5jb250ZW50RWxlbWVudC5uYXRpdmVFbGVtZW50O1xuICAgICAgICB0aGlzLnBhcmVudEVsZW1lbnQgPSB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcblxuICAgICAgICB0aGlzLnNldEJhc2ljU3R5bGVzKCk7XG5cbiAgICAgICAgdGhpcy5lbGVtZW50Lm9uZHJhZ3N0YXJ0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH07XG4gICAgfVxuXG5cbiAgICAvKlxuICAgICAqIERlc2t0b3AgbGlzdGVuZXJzXG4gICAgICovXG5cbiAgICBASG9zdExpc3RlbmVyKFwibW91c2Vkb3duXCIsIFsnJGV2ZW50J10pXG4gICAgb25Nb3VzZUVudGVyKGV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgICAgIHRoaXMuZ2V0RWxlbWVudFBvc2l0aW9uKCk7XG5cbiAgICAgICAgaWYgKHRoaXMuaXNEcmFnZ2luZykge1xuICAgICAgICAgICAgdGhpcy5kcmFnZ2luZ01vZGUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgQEhvc3RMaXN0ZW5lcihcIndpbmRvdzptb3VzZW1vdmVcIiwgWyckZXZlbnQnXSlcbiAgICBvbk1vdXNlTW92ZShldmVudDogTW91c2VFdmVudCkge1xuICAgICAgICBpZiAodGhpcy5kcmFnZ2luZ01vZGUpe1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgaWYgKCF0aGlzLmV2ZW50VHlwZSl7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGFydFggPSBldmVudC5jbGllbnRYIC0gdGhpcy5lbGVtZW50UG9zaXRpb24ubGVmdDtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0WSA9IGV2ZW50LmNsaWVudFkgLSB0aGlzLmVsZW1lbnRQb3NpdGlvbi50b3A7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuZXZlbnRUeXBlID0gJ3N3aXBlJztcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzLmVtaXQoe1xuICAgICAgICAgICAgICAgIHR5cGU6ICdzd2lwZScsXG4gICAgICAgICAgICAgICAgbW92ZVg6IHRoaXMubW92ZVgsXG4gICAgICAgICAgICAgICAgbW92ZVk6IHRoaXMubW92ZVlcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLm1vdmVYID0gdGhpcy5pbml0aWFsTW92ZVggKyAoKGV2ZW50LmNsaWVudFggLSB0aGlzLmVsZW1lbnRQb3NpdGlvbi5sZWZ0KSAtIHRoaXMuc3RhcnRYKTtcbiAgICAgICAgICAgIHRoaXMubW92ZVkgPSB0aGlzLmluaXRpYWxNb3ZlWSArICgoZXZlbnQuY2xpZW50WSAtIHRoaXMuZWxlbWVudFBvc2l0aW9uLnRvcCkgLSB0aGlzLnN0YXJ0WSk7XG5cbiAgICAgICAgICAgIHRoaXMuY2VudGVyaW5nSW1hZ2UoKTtcbiAgICAgICAgICAgIHRoaXMudHJhbnNmb3JtRWxlbWVudCgwKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIEBIb3N0TGlzdGVuZXIoXCJ3aW5kb3c6bW91c2V1cFwiLCBbJyRldmVudCddKVxuICAgIG9uTW91c2VVcChldmVudDogTW91c2VFdmVudCkge1xuICAgICAgICB0aGlzLmRyYWdnaW5nTW9kZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLnVwZGF0ZUluaXRpYWxWYWx1ZXMoKTtcbiAgICAgICAgdGhpcy5ldmVudFR5cGUgPSAnJztcbiAgICB9XG5cblxuICAgIC8qXG4gICAgICogTW9iaWxlIGxpc3RlbmVyc1xuICAgICAqL1xuXG4gICAgQEhvc3RMaXN0ZW5lcignd2luZG93OnJlc2l6ZScsIFsnJGV2ZW50J10pXG4gICAgb25SZXNpemUoZXZlbnQ6RXZlbnQpIHtcbiAgICAgICAgdGhpcy5zZXRJbWFnZVdpZHRoKCk7XG4gICAgICAgIHRoaXMudHJhbnNmb3JtRWxlbWVudCh0aGlzLnRyYW5zaXRpb25EdXJhdGlvbik7IFxuICAgIH1cblxuICAgIEBIb3N0TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBbJyRldmVudCddKVxuICAgIHRvdWNoc3RhcnRIYW5kbGVyKGV2ZW50OmFueSkge1xuICAgICAgICB0aGlzLmdldEVsZW1lbnRQb3NpdGlvbigpO1xuXG4gICAgICAgIGlmICghdGhpcy5ldmVudFR5cGUpe1xuICAgICAgICAgICAgdGhpcy5zdGFydFggPSBldmVudC50b3VjaGVzWzBdLmNsaWVudFggLSB0aGlzLmVsZW1lbnRQb3NpdGlvbi5sZWZ0O1xuICAgICAgICAgICAgdGhpcy5zdGFydFkgPSBldmVudC50b3VjaGVzWzBdLmNsaWVudFkgLSB0aGlzLmVsZW1lbnRQb3NpdGlvbi50b3A7XG5cbiAgICAgICAgICAgIHRoaXMuc3RhcnRDbGllbnRYID0gZXZlbnQudG91Y2hlc1swXS5jbGllbnRYIC0gdGhpcy5lbGVtZW50UG9zaXRpb24ubGVmdDtcbiAgICAgICAgICAgIHRoaXMuc3RhcnRDbGllbnRZID0gZXZlbnQudG91Y2hlc1swXS5jbGllbnRZIC0gdGhpcy5lbGVtZW50UG9zaXRpb24udG9wO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5ldmVudHMuZW1pdCh7dHlwZTogJ3RvdWNoc3RhcnQnfSk7XG4gICAgfVxuXG4gICAgQEhvc3RMaXN0ZW5lcigndG91Y2htb3ZlJywgWyckZXZlbnQnXSlcbiAgICB0b3VjaG1vdmVIYW5kbGVyKGV2ZW50OmFueSkge1xuICAgICAgICBsZXQgdG91Y2hlcyA9IGV2ZW50LnRvdWNoZXM7XG5cbiAgICAgICAgLy8gU3dpcGVcbiAgICAgICAgaWYgKHRoaXMuZGV0ZWN0U3dpcGUodG91Y2hlcykgfHwgdGhpcy5ldmVudFR5cGUgPT0gJ3N3aXBlJyl7XG4gICAgICAgICAgICB0aGlzLmhhbmRsZVN3aXBlKGV2ZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIExpbmVhciBzd2lwZVxuICAgICAgICBpZiAodGhpcy5kZXRlY3RMaW5lYXJTd2lwZSh0b3VjaGVzKSB8fCB0aGlzLmV2ZW50VHlwZSA9PSAnaG9yaXpvbnRhbC1zd2lwZScgfHwgdGhpcy5ldmVudFR5cGUgPT0gJ3ZlcnRpY2FsLXN3aXBlJyl7ICAgXG4gICAgICAgICAgICB0aGlzLmhhbmRsZUxpbmVhclN3aXBlKGV2ZW50KTsgXG4gICAgICAgIH1cblxuICAgICAgICAvLyBQaW5jaFxuICAgICAgICBpZiAodG91Y2hlcy5sZW5ndGggPT09IDIgJiYgIXRoaXMuZXZlbnRUeXBlIHx8IHRoaXMuZXZlbnRUeXBlID09ICdwaW5jaCcpe1xuICAgICAgICAgICAgdGhpcy5oYW5kbGVQaW5jaChldmVudCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBASG9zdExpc3RlbmVyKCd0b3VjaGVuZCcsIFsnJGV2ZW50J10pXG4gICAgdG91Y2hlbmRIYW5kbGVyKGV2ZW50OmFueSkge1xuICAgICAgICB0aGlzLmkgPSAwO1xuICAgICAgICB0aGlzLmRyYWdnaW5nTW9kZSA9IGZhbHNlO1xuICAgICAgICBsZXQgdG91Y2hlcyA9IGV2ZW50LnRvdWNoZXM7XG5cbiAgICAgICAgaWYgKHRoaXMuc2NhbGUgPCAxKXtcbiAgICAgICAgICAgIHRoaXMuc2NhbGUgPSAxO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQXV0byBab29tIE91dFxuICAgICAgICBpZiAodGhpcy5hdXRvWm9vbU91dCAmJiB0aGlzLmV2ZW50VHlwZSA9PT0gJ3BpbmNoJyl7XG4gICAgICAgICAgICB0aGlzLnNjYWxlID0gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZXZlbnRzLmVtaXQoe3R5cGU6ICd0b3VjaGVuZCd9KTtcblxuICAgICAgICAvLyBEb3VibGUgVGFwXG4gICAgICAgIGlmICh0aGlzLmRvdWJsZVRhcERldGVjdGlvbigpICYmICF0aGlzLmV2ZW50VHlwZSl7XG4gICAgICAgICAgICB0aGlzLnRvZ2dsZVpvb20oZXZlbnQpO1xuICAgICAgICAgICAgdGhpcy5ldmVudHMuZW1pdCh7dHlwZTogJ2RvdWJsZS10YXAnfSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5ldmVudFR5cGUgPT09ICdwaW5jaCcgfHwgdGhpcy5ldmVudFR5cGUgPT09ICdzd2lwZScpe1xuICAgICAgICAgICAgdGhpcy5hbGlnbkltYWdlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5ldmVudFR5cGUgPT09ICdwaW5jaCcgfHwgXG4gICAgICAgICAgICB0aGlzLmV2ZW50VHlwZSA9PT0gJ3N3aXBlJyB8fFxuICAgICAgICAgICAgdGhpcy5ldmVudFR5cGUgPT09ICdob3Jpem9udGFsLXN3aXBlJyB8fFxuICAgICAgICAgICAgdGhpcy5ldmVudFR5cGUgPT09ICd2ZXJ0aWNhbC1zd2lwZScpe1xuICAgICAgICAgICAgdGhpcy51cGRhdGVJbml0aWFsVmFsdWVzKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmV2ZW50VHlwZSA9ICd0b3VjaGVuZCc7XG5cbiAgICAgICAgaWYgKHRvdWNoZXMgJiYgdG91Y2hlcy5sZW5ndGggPT0gMCl7XG4gICAgICAgICAgICB0aGlzLmV2ZW50VHlwZSA9ICcnO1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICAvKlxuICAgICAqIEhhbmRsZXJzXG4gICAgICovXG5cbiAgICBoYW5kbGVTd2lwZShldmVudDphbnkpe1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIGlmICghdGhpcy5ldmVudFR5cGUpe1xuICAgICAgICAgICAgdGhpcy5zdGFydFggPSBldmVudC50b3VjaGVzWzBdLmNsaWVudFggLSB0aGlzLmVsZW1lbnRQb3NpdGlvbi5sZWZ0O1xuICAgICAgICAgICAgdGhpcy5zdGFydFkgPSBldmVudC50b3VjaGVzWzBdLmNsaWVudFkgLSB0aGlzLmVsZW1lbnRQb3NpdGlvbi50b3A7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmV2ZW50VHlwZSA9ICdzd2lwZSc7XG4gICAgICAgIHRoaXMuZXZlbnRzLmVtaXQoe1xuICAgICAgICAgICAgdHlwZTogJ3N3aXBlJyxcbiAgICAgICAgICAgIG1vdmVYOiB0aGlzLm1vdmVYLFxuICAgICAgICAgICAgbW92ZVk6IHRoaXMubW92ZVlcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5tb3ZlWCA9IHRoaXMuaW5pdGlhbE1vdmVYICsgKChldmVudC50b3VjaGVzWzBdLmNsaWVudFggLSB0aGlzLmVsZW1lbnRQb3NpdGlvbi5sZWZ0KSAtIHRoaXMuc3RhcnRYKTtcbiAgICAgICAgdGhpcy5tb3ZlWSA9IHRoaXMuaW5pdGlhbE1vdmVZICsgKChldmVudC50b3VjaGVzWzBdLmNsaWVudFkgLSB0aGlzLmVsZW1lbnRQb3NpdGlvbi50b3ApIC0gdGhpcy5zdGFydFkpO1xuXG4gICAgICAgIHRoaXMudHJhbnNmb3JtRWxlbWVudCgwKTtcbiAgICB9XG5cbiAgICBoYW5kbGVQaW5jaChldmVudDphbnkpe1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIGxldCB0b3VjaGVzID0gZXZlbnQudG91Y2hlcztcblxuICAgICAgICBpZiAoIXRoaXMuZXZlbnRUeXBlKXtcbiAgICAgICAgICAgIHRoaXMuaW5pdGlhbERpc3RhbmNlID0gdGhpcy5nZXREaXN0YW5jZSh0b3VjaGVzKTtcblxuICAgICAgICAgICAgdGhpcy5tb3ZlWEMgPSAoKChldmVudC50b3VjaGVzWzBdLmNsaWVudFggLSB0aGlzLmVsZW1lbnRQb3NpdGlvbi5sZWZ0KSArIChldmVudC50b3VjaGVzWzFdLmNsaWVudFggLSB0aGlzLmVsZW1lbnRQb3NpdGlvbi5sZWZ0KSkgLyAyKSAtIHRoaXMuaW5pdGlhbE1vdmVYO1xuICAgICAgICAgICAgdGhpcy5tb3ZlWUMgPSAoKChldmVudC50b3VjaGVzWzBdLmNsaWVudFkgLSB0aGlzLmVsZW1lbnRQb3NpdGlvbi50b3ApICsgKGV2ZW50LnRvdWNoZXNbMV0uY2xpZW50WSAtIHRoaXMuZWxlbWVudFBvc2l0aW9uLnRvcCkpIC8gMikgLSB0aGlzLmluaXRpYWxNb3ZlWTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZXZlbnRUeXBlID0gJ3BpbmNoJztcbiAgICAgICAgdGhpcy5ldmVudHMuZW1pdCh7dHlwZTogJ3BpbmNoJ30pO1xuICAgICAgICB0aGlzLmRpc3RhbmNlID0gdGhpcy5nZXREaXN0YW5jZSh0b3VjaGVzKTtcbiAgICAgICAgdGhpcy5zY2FsZSA9IHRoaXMuaW5pdGlhbFNjYWxlICogKHRoaXMuZGlzdGFuY2UgLyB0aGlzLmluaXRpYWxEaXN0YW5jZSk7XG5cbiAgICAgICAgdGhpcy5tb3ZlWCA9IHRoaXMuaW5pdGlhbE1vdmVYIC0gKCgodGhpcy5kaXN0YW5jZSAvIHRoaXMuaW5pdGlhbERpc3RhbmNlKSAqIHRoaXMubW92ZVhDKSAtIHRoaXMubW92ZVhDKTtcbiAgICAgICAgdGhpcy5tb3ZlWSA9IHRoaXMuaW5pdGlhbE1vdmVZIC0gKCgodGhpcy5kaXN0YW5jZSAvIHRoaXMuaW5pdGlhbERpc3RhbmNlKSAqIHRoaXMubW92ZVlDKSAtIHRoaXMubW92ZVlDKTtcblxuICAgICAgICB0aGlzLnRyYW5zZm9ybUVsZW1lbnQoMCk7XG4gICAgfVxuXG4gICAgaGFuZGxlTGluZWFyU3dpcGUoZXZlbnQ6YW55KXtcbiAgICAgICAgaWYgKHRoaXMubGluZWFyVmVydGljYWxTd2lwZSl7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB0aGlzLmkrKztcblxuICAgICAgICBpZiAodGhpcy5pID4gMyl7XG4gICAgICAgICAgICB0aGlzLmV2ZW50VHlwZSA9IHRoaXMuZ2V0TGluZWFyU3dpcGVUeXBlKGV2ZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmV2ZW50VHlwZSA9PSAnaG9yaXpvbnRhbC1zd2lwZScpe1xuICAgICAgICAgICAgdGhpcy5tb3ZlWCA9IHRoaXMuaW5pdGlhbE1vdmVYICsgKChldmVudC50b3VjaGVzWzBdLmNsaWVudFggLSB0aGlzLmVsZW1lbnRQb3NpdGlvbi5sZWZ0KSAtIHRoaXMuc3RhcnRYKTtcbiAgICAgICAgICAgIHRoaXMubW92ZVkgPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZXZlbnRUeXBlID09ICd2ZXJ0aWNhbC1zd2lwZScpe1xuICAgICAgICAgICAgdGhpcy5tb3ZlWCA9IDA7XG4gICAgICAgICAgICB0aGlzLm1vdmVZID0gdGhpcy5pbml0aWFsTW92ZVkgKyAoKGV2ZW50LnRvdWNoZXNbMF0uY2xpZW50WSAtIHRoaXMuZWxlbWVudFBvc2l0aW9uLnRvcCkgLSB0aGlzLnN0YXJ0WSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5ldmVudFR5cGUpe1xuICAgICAgICAgICAgdGhpcy5ldmVudHMuZW1pdCh7XG4gICAgICAgICAgICAgICAgdHlwZTogdGhpcy5ldmVudFR5cGUsXG4gICAgICAgICAgICAgICAgbW92ZVg6IHRoaXMubW92ZVgsXG4gICAgICAgICAgICAgICAgbW92ZVk6IHRoaXMubW92ZVlcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy50cmFuc2Zvcm1FbGVtZW50KDApO1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICBkZXRlY3RTd2lwZSh0b3VjaGVzOmFueSl7XG4gICAgICAgIHJldHVybiB0b3VjaGVzLmxlbmd0aCA9PT0gMSAmJiB0aGlzLnNjYWxlID4gMSAmJiAhdGhpcy5ldmVudFR5cGU7XG4gICAgfVxuXG4gICAgZGV0ZWN0TGluZWFyU3dpcGUodG91Y2hlczpUb3VjaExpc3Qpe1xuICAgICAgICByZXR1cm4gdG91Y2hlcy5sZW5ndGggPT09IDEgJiYgdGhpcy5zY2FsZSA9PT0gMSAmJiAhdGhpcy5ldmVudFR5cGU7XG4gICAgfVxuXG4gICAgZ2V0TGluZWFyU3dpcGVUeXBlKGV2ZW50OmFueSk6c3RyaW5nIHtcbiAgICAgICAgaWYgKHRoaXMuZXZlbnRUeXBlICE9ICdob3Jpem9udGFsLXN3aXBlJyAmJiB0aGlzLmV2ZW50VHlwZSAhPSAndmVydGljYWwtc3dpcGUnKXtcbiAgICAgICAgICAgIGxldCBtb3ZlbWVudFggPSBNYXRoLmFicygoZXZlbnQudG91Y2hlc1swXS5jbGllbnRYIC0gdGhpcy5lbGVtZW50UG9zaXRpb24ubGVmdCkgLSB0aGlzLnN0YXJ0Q2xpZW50WCk7IFxuICAgICAgICAgICAgbGV0IG1vdmVtZW50WSA9IE1hdGguYWJzKChldmVudC50b3VjaGVzWzBdLmNsaWVudFkgLSB0aGlzLmVsZW1lbnRQb3NpdGlvbi50b3ApIC0gdGhpcy5zdGFydENsaWVudFkpO1xuXG4gICAgICAgICAgICBpZiAoKG1vdmVtZW50WSAqIDMpID4gbW92ZW1lbnRYKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubGluZWFyVmVydGljYWxTd2lwZSA/ICd2ZXJ0aWNhbC1zd2lwZScgOiAnJztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubGluZWFySG9yaXpvbnRhbFN3aXBlID8gJ2hvcml6b250YWwtc3dpcGUnIDogJyc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5ldmVudFR5cGU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXREaXN0YW5jZSh0b3VjaGVzOiBhbnkpe1xuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KCBNYXRoLnBvdyh0b3VjaGVzWzBdLnBhZ2VYIC0gdG91Y2hlc1sxXS5wYWdlWCwgMikgKyBNYXRoLnBvdyh0b3VjaGVzWzBdLnBhZ2VZIC0gdG91Y2hlc1sxXS5wYWdlWSwgMikpO1xuICAgIH1cblxuICAgIGdldEltYWdlSGVpZ2h0KCl7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJpbWdcIilbMF0ub2Zmc2V0SGVpZ2h0O1xuICAgIH1cblxuICAgIGdldEltYWdlV2lkdGgoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImltZ1wiKVswXS5vZmZzZXRXaWR0aDtcbiAgICB9XG5cbiAgICBzZXRCYXNpY1N0eWxlcygpOnZvaWQge1xuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuZGlzcGxheSA9IFwiZmxleFwiO1xuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gXCIxMDAlXCI7XG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5hbGlnbkl0ZW1zID0gXCJjZW50ZXJcIjtcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmp1c3RpZnlDb250ZW50ID0gXCJjZW50ZXJcIjtcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnRyYW5zZm9ybU9yaWdpbiA9ICcwIDAnO1xuXG4gICAgICAgIHRoaXMuaG9zdERpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgICAgIHRoaXMuaG9zdE92ZXJmbG93ID0gXCJoaWRkZW5cIjtcbiAgICAgICAgdGhpcy5ob3N0SGVpZ2h0ID0gdGhpcy5jb250YWluZXJIZWlnaHQ7XG5cbiAgICAgICAgdGhpcy5zZXRJbWFnZVdpZHRoKCk7XG4gICAgfVxuXG4gICAgc2V0SW1hZ2VXaWR0aCgpOnZvaWQge1xuICAgICAgICBsZXQgaW1nRWxlbWVudCA9IHRoaXMuZWxlbWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImltZ1wiKTtcblxuICAgICAgICBpZiAoaW1nRWxlbWVudC5sZW5ndGgpe1xuICAgICAgICAgICAgaW1nRWxlbWVudFswXS5zdHlsZS5tYXhXaWR0aCA9ICcxMDAlJztcbiAgICAgICAgICAgIGltZ0VsZW1lbnRbMF0uc3R5bGUubWF4SGVpZ2h0ID0gJzEwMCUnO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdHJhbnNmb3JtRWxlbWVudChkdXJhdGlvbjogYW55ID0gNTApe1xuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudHJhbnNpdGlvbiA9ICdhbGwgJysgZHVyYXRpb24gKydtcyc7XG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS50cmFuc2Zvcm0gPSAnbWF0cml4KCcrIE51bWJlcih0aGlzLnNjYWxlKSArJywnKyAwICsnLCcrIDAgKycsJysgTnVtYmVyKHRoaXMuc2NhbGUpICsnLCcrIE51bWJlcih0aGlzLm1vdmVYKSArJywnKyBOdW1iZXIodGhpcy5tb3ZlWSkgKycpJztcbiAgICB9XG5cbiAgICBkb3VibGVUYXBEZXRlY3Rpb24oKTpib29sZWFuIHtcbiAgICAgICAgaWYgKCF0aGlzLmRvdWJsZVRhcCl7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgY3VycmVudFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgbGV0IHRhcExlbmd0aCA9IGN1cnJlbnRUaW1lIC0gdGhpcy5sYXN0VGFwO1xuICAgICAgICBcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuZG91YmxlVGFwVGltZW91dCk7XG5cbiAgICAgICAgaWYgKHRhcExlbmd0aCA8IDMwMCAmJiB0YXBMZW5ndGggPiAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZG91YmxlVGFwVGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuZG91YmxlVGFwVGltZW91dCk7XG4gICAgICAgICAgICB9LCAzMDApO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubGFzdFRhcCA9IGN1cnJlbnRUaW1lO1xuICAgIH1cblxuICAgIHB1YmxpYyB0b2dnbGVab29tKGV2ZW50OmFueSA9IGZhbHNlKTp2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuaW5pdGlhbFNjYWxlID09PSAxKXtcblxuICAgICAgICAgICAgaWYgKGV2ZW50ICYmIGV2ZW50LmNoYW5nZWRUb3VjaGVzKXtcbiAgICAgICAgICAgICAgICBsZXQgY2hhbmdlZFRvdWNoZXMgPSBldmVudC5jaGFuZ2VkVG91Y2hlcztcblxuICAgICAgICAgICAgICAgIHRoaXMuc2NhbGUgPSB0aGlzLmluaXRpYWxTY2FsZSAqIDI7XG4gICAgICAgICAgICAgICAgdGhpcy5tb3ZlWCA9IHRoaXMuaW5pdGlhbE1vdmVYIC0gKGNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFggLSB0aGlzLmVsZW1lbnRQb3NpdGlvbi5sZWZ0KTtcbiAgICAgICAgICAgICAgICB0aGlzLm1vdmVZID0gdGhpcy5pbml0aWFsTW92ZVkgLSAoY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WSAtIHRoaXMuZWxlbWVudFBvc2l0aW9uLnRvcCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuc2NhbGUgPSB0aGlzLmluaXRpYWxTY2FsZSAqIDI7XG4gICAgICAgICAgICAgICAgdGhpcy5tb3ZlWCA9IHRoaXMuaW5pdGlhbE1vdmVYIC0gdGhpcy5lbGVtZW50Lm9mZnNldFdpZHRoIC8gMjtcbiAgICAgICAgICAgICAgICB0aGlzLm1vdmVZID0gdGhpcy5pbml0aWFsTW92ZVkgLSB0aGlzLmVsZW1lbnQub2Zmc2V0SGVpZ2h0IC8gMjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5jZW50ZXJpbmdJbWFnZSgpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVJbml0aWFsVmFsdWVzKCk7XG4gICAgICAgICAgICB0aGlzLnRyYW5zZm9ybUVsZW1lbnQodGhpcy50cmFuc2l0aW9uRHVyYXRpb24pO1xuICAgICAgICAgICAgdGhpcy5ldmVudHMuZW1pdCh7dHlwZTogJ3pvb20taW4nfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnJlc2V0U2NhbGUoKTtcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzLmVtaXQoe3R5cGU6ICd6b29tLW91dCd9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlc2V0U2NhbGUoKTp2b2lkIHtcbiAgICAgICAgdGhpcy5zY2FsZSA9IDE7XG4gICAgICAgIHRoaXMubW92ZVggPSAwO1xuICAgICAgICB0aGlzLm1vdmVZID0gMDtcbiAgICAgICAgdGhpcy51cGRhdGVJbml0aWFsVmFsdWVzKCk7XG4gICAgICAgIHRoaXMudHJhbnNmb3JtRWxlbWVudCh0aGlzLnRyYW5zaXRpb25EdXJhdGlvbik7XG4gICAgfVxuXG4gICAgdXBkYXRlSW5pdGlhbFZhbHVlcygpOnZvaWQge1xuICAgICAgICB0aGlzLmluaXRpYWxTY2FsZSA9IHRoaXMuc2NhbGU7XG4gICAgICAgIHRoaXMuaW5pdGlhbE1vdmVYID0gdGhpcy5tb3ZlWDtcbiAgICAgICAgdGhpcy5pbml0aWFsTW92ZVkgPSB0aGlzLm1vdmVZO1xuICAgIH1cblxuICAgIGNlbnRlcmluZ0ltYWdlKCk6Ym9vbGVhbiB7XG4gICAgICAgIGxldCBpbWcgPSB0aGlzLmVsZW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJpbWdcIilbMF07XG4gICAgICAgIGNvbnN0IGluaXRpYWxNb3ZlWCA9IHRoaXMubW92ZVg7XG4gICAgICAgIGNvbnN0IGluaXRpYWxNb3ZlWSA9IHRoaXMubW92ZVk7XG5cbiAgICAgICAgaWYgKHRoaXMubW92ZVkgPiAwKXtcbiAgICAgICAgICAgIHRoaXMubW92ZVkgPSAwO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLm1vdmVYID4gMCl7XG4gICAgICAgICAgICB0aGlzLm1vdmVYID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpbWcpe1xuICAgICAgICAgICAgdGhpcy50cmFuc2l0aW9uWVJlc3RyaWN0aW9uKCk7XG4gICAgICAgICAgICB0aGlzLnRyYW5zaXRpb25YUmVzdHJpY3Rpb24oKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaW1nICYmIHRoaXMuc2NhbGUgPCAxKXtcbiAgICAgICAgICAgIGlmICh0aGlzLm1vdmVYIDwgdGhpcy5lbGVtZW50Lm9mZnNldFdpZHRoICogKDEgLSB0aGlzLnNjYWxlKSkge1xuICAgICAgICAgICAgICAgIHRoaXMubW92ZVggPSB0aGlzLmVsZW1lbnQub2Zmc2V0V2lkdGggKiAoMSAtIHRoaXMuc2NhbGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGluaXRpYWxNb3ZlWCAhPSB0aGlzLm1vdmVYIHx8IGluaXRpYWxNb3ZlWSAhPSB0aGlzLm1vdmVZO1xuICAgIH1cblxuICAgIHB1YmxpYyBhbGlnbkltYWdlKCk6dm9pZCB7XG4gICAgICAgIGxldCBpc01vdmVDaGFuZ2VkID0gdGhpcy5jZW50ZXJpbmdJbWFnZSgpO1xuXG4gICAgICAgIGlmIChpc01vdmVDaGFuZ2VkKXtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlSW5pdGlhbFZhbHVlcygpO1xuICAgICAgICAgICAgdGhpcy50cmFuc2Zvcm1FbGVtZW50KHRoaXMudHJhbnNpdGlvbkR1cmF0aW9uKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRyYW5zaXRpb25ZUmVzdHJpY3Rpb24oKTp2b2lkIHtcbiAgICAgICAgbGV0IGltZ0hlaWdodCA9IHRoaXMuZ2V0SW1hZ2VIZWlnaHQoKTtcblxuICAgICAgICBpZiAoaW1nSGVpZ2h0ICogdGhpcy5zY2FsZSA8IHRoaXMucGFyZW50RWxlbWVudC5vZmZzZXRIZWlnaHQpe1xuICAgICAgICAgICAgdGhpcy5tb3ZlWSA9ICh0aGlzLnBhcmVudEVsZW1lbnQub2Zmc2V0SGVpZ2h0IC0gdGhpcy5lbGVtZW50Lm9mZnNldEhlaWdodCAqIHRoaXMuc2NhbGUpIC8gMjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBpbWdPZmZzZXRUb3AgPSAoKGltZ0hlaWdodCAtIHRoaXMuZWxlbWVudC5vZmZzZXRIZWlnaHQpICogdGhpcy5zY2FsZSkgLyAyO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5tb3ZlWSA+IGltZ09mZnNldFRvcCl7XG4gICAgICAgICAgICAgICAgdGhpcy5tb3ZlWSA9IGltZ09mZnNldFRvcDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoKGltZ0hlaWdodCAqIHRoaXMuc2NhbGUgKyBNYXRoLmFicyhpbWdPZmZzZXRUb3ApIC0gdGhpcy5wYXJlbnRFbGVtZW50Lm9mZnNldEhlaWdodCkgKyB0aGlzLm1vdmVZIDwgMCl7XG4gICAgICAgICAgICAgICAgdGhpcy5tb3ZlWSA9IC0gKGltZ0hlaWdodCAqIHRoaXMuc2NhbGUgKyBNYXRoLmFicyhpbWdPZmZzZXRUb3ApIC0gdGhpcy5wYXJlbnRFbGVtZW50Lm9mZnNldEhlaWdodCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0cmFuc2l0aW9uWFJlc3RyaWN0aW9uKCk6dm9pZCB7XG4gICAgICAgIGxldCBpbWdXaWR0aCA9IHRoaXMuZ2V0SW1hZ2VXaWR0aCgpO1xuXG4gICAgICAgIGlmIChpbWdXaWR0aCAqIHRoaXMuc2NhbGUgPCB0aGlzLnBhcmVudEVsZW1lbnQub2Zmc2V0V2lkdGgpIHtcbiAgICAgICAgICAgIHRoaXMubW92ZVggPSAodGhpcy5wYXJlbnRFbGVtZW50Lm9mZnNldFdpZHRoIC0gdGhpcy5lbGVtZW50Lm9mZnNldFdpZHRoICogdGhpcy5zY2FsZSkgLyAyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IGltZ09mZnNldExlZnQgPSAoKGltZ1dpZHRoIC0gdGhpcy5lbGVtZW50Lm9mZnNldFdpZHRoKSAqIHRoaXMuc2NhbGUpIC8gMjtcblxuICAgICAgICAgICAgaWYgKHRoaXMubW92ZVggPiBpbWdPZmZzZXRMZWZ0KXtcbiAgICAgICAgICAgICAgICB0aGlzLm1vdmVYID0gaW1nT2Zmc2V0TGVmdDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoKGltZ1dpZHRoICogdGhpcy5zY2FsZSArIE1hdGguYWJzKGltZ09mZnNldExlZnQpIC0gdGhpcy5wYXJlbnRFbGVtZW50Lm9mZnNldFdpZHRoKSArIHRoaXMubW92ZVggPCAwKXtcbiAgICAgICAgICAgICAgICB0aGlzLm1vdmVYID0gLSAoaW1nV2lkdGggKiB0aGlzLnNjYWxlICsgTWF0aC5hYnMoaW1nT2Zmc2V0TGVmdCkgLSB0aGlzLnBhcmVudEVsZW1lbnQub2Zmc2V0V2lkdGgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0RWxlbWVudFBvc2l0aW9uKCk6dm9pZCB7XG4gICAgICAgIHRoaXMuZWxlbWVudFBvc2l0aW9uID0gdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgfVxuXG4gICAgcHVibGljIHNldE1vdmVYKHZhbHVlOm51bWJlciwgdHJhbnNpdGlvbkR1cmF0aW9uOm51bWJlciA9IDIwMCl7XG4gICAgICAgIHRoaXMubW92ZVggPSB2YWx1ZTtcbiAgICAgICAgdGhpcy50cmFuc2Zvcm1FbGVtZW50KHRyYW5zaXRpb25EdXJhdGlvbik7XG4gICAgfVxuXG4gICAgcHVibGljIHNldE1vdmVZKHZhbHVlOm51bWJlciwgdHJhbnNpdGlvbkR1cmF0aW9uOm51bWJlciA9IDIwMCl7XG4gICAgICAgIHRoaXMubW92ZVkgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy50cmFuc2Zvcm1FbGVtZW50KHRyYW5zaXRpb25EdXJhdGlvbik7XG4gICAgfVxufSJdfQ==