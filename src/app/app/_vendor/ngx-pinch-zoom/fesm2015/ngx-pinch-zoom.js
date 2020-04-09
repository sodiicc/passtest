import { Component, HostBinding, ElementRef, HostListener, ViewChild, Input, EventEmitter, Output, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class PinchZoomComponent {
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class PinchZoomModule {
}
PinchZoomModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    PinchZoomComponent
                ],
                imports: [
                    CommonModule
                ],
                exports: [
                    PinchZoomComponent
                ],
                entryComponents: [
                    PinchZoomComponent
                ]
            },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

export { PinchZoomComponent, PinchZoomModule };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXBpbmNoLXpvb20uanMubWFwIiwic291cmNlcyI6WyJuZzovL25neC1waW5jaC16b29tL2xpYi9waW5jaC16b29tLmNvbXBvbmVudC50cyIsIm5nOi8vbmd4LXBpbmNoLXpvb20vbGliL3BpbmNoLXpvb20ubW9kdWxlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSG9zdEJpbmRpbmcsIEVsZW1lbnRSZWYsIEhvc3RMaXN0ZW5lciwgT25Jbml0LCBWaWV3Q2hpbGQsIElucHV0LCBFdmVudEVtaXR0ZXIsIE91dHB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3BpbmNoLXpvb20sIFtwaW5jaC16b29tXScsXG4gICAgdGVtcGxhdGU6IGA8ZGl2ICNjb250ZW50IFxuXHRbY2xhc3MucHotZHJhZ2dpbmddPVwiaXNEcmFnZ2luZ1wiPlxuXHQ8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG48L2Rpdj5cblxuPGRpdiBjbGFzcz1cInB6LXpvb20tYnV0dG9uXCJcblx0Km5nSWY9XCJ6b29tQnV0dG9uICYmICFpc01vYmlsZVwiXG5cdChjbGljayk9XCJ0b2dnbGVab29tKClcIlxuXHRbY2xhc3MucHotem9vbS1vdXRdPVwic2NhbGUgPiAxXCI+XG48L2Rpdj5gLFxuICAgIHN0eWxlczogW2A6aG9zdHtwb3NpdGlvbjpyZWxhdGl2ZX0ucHotZHJhZ2dpbmd7Y3Vyc29yOmFsbC1zY3JvbGx9LnB6LXpvb20tYnV0dG9ue3Bvc2l0aW9uOmFic29sdXRlO2xlZnQ6NTAlO2JvdHRvbToxNnB4O21hcmdpbi1sZWZ0Oi0yMnB4O3otaW5kZXg6MTAwMDtjb2xvcjojZmZmO2JhY2tncm91bmQtaW1hZ2U6dXJsKGRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQ1FBQUFBa0NBUUFBQUJMQ1ZBVEFBQUJWVWxFUVZSNEFlM1BBd3hRWFJnQTBQdmJ0bzFzVzJORHRzMHgyN2F0SWRlUXJha3BZOGkyM2NuR2U1bm44ZXBEZU8xaCtWZ2VWZFJWUkpMd3NDUTEwMW5YMmFXSmQ4T0Q4YTdPenJrZGE2VUo4WG5QVXNCWnk0M1MyV3o3cnM4VURuRVpDWmpuNSt0emI2anFDRGd1Y1loRGFrQW5iNFJiK01kbU1DUEVZU3FZZkgyY1hmUHIveW1jQmFsREZGODRpek4rdUQ3VG5IQ2RYcUI3aUNJL1dCeXV1eTFRYnJBaVJGRUw5TDNXbE9ibWMvbDd1VUhmZ24waGl2cWc0N1ZhWE1mbHVRL0E2UkJGZVREbW5xMzlEN2FFS05LQlhmY01WQlZNQ3RGc0IwWHZGc2hiVm9CU0lacUdZTDgvd2gxMEIvdThGNkw1MkU2d1U3WndFeC9vQzZnVjRwSFZPWERlSVBuOTVXT1oxYllSc0Q3RUo3OUQ3bTRubU83ZEVJK2ZUSEM3bzdwNmgrdWg0cEpKQjB2c2NNd0tRK1gxM3VYWjZSR2g0dktlZVE4YzZuV29KaUZhZENqUkZVWHpudGJlRGMvR2F4Y0FvdGY3Y2ljZmxLa0FBQUFBU1VWT1JLNUNZSUk9KSx1cmwoZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFDUUFBQUFrQ0FRQUFBQkxDVkFUQUFBQlMwbEVRVlI0QWUzVUE4eFdmUUNHOGFmUE5yTnQyNDBOMlRiSGJOdTJobHhEdHFhbWpDSGJkci9zNTkwNWI5WjFmTi9iZGZ5UGZPWmw4Wk1TR21pcGdnd3ZMOGxvcVpzQU9LYURiMklyK1VaL3Q3eklUamxpby9uV1JzQk5tMDNUMzNLbkhpZmx3NHVtQWxhSi96aUxvNkVMNExMMDRUVFpBZjNFZWE1SllUOVlFazYwRU15UDJtVnhFMlFQMXZ6dUptNzRQNForR0JnY0xDb04xc2ZZRndkYmdrWE53TWo3KzRWMWZucTZuLzBEVGdXTFdvTys5L2M3QXdEM3MrL0I5V0JSYlRBanhqNDFPQkFzeWdXT3hkZzNCUE1pd1RnTUtrYnR2clFGVkFzamFndE9TeEtsR3d4TytUYmMwSEVVSEZYb21meDdJd0hOSXVGUTBDMXcyemlsSmZPVC9KcmJDOWdkQ1kvU3pvbk9VYkE0OU1na25qbWU1NktCdnVheEtpenk2V09ESXk3WllxS1NEeDZ4eFVHcThNUGVxbGlyUHFzNlJLbGpxd3E2b3ZDcTdyNkp2QnMrY3dkTGlPYUVVOWVrMUFBQUFBQkpSVTVFcmtKZ2dnPT0pLHVybChkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUNRQUFBQWtDQVFBQUFCTENWQVRBQUFCVlVsRVFWUjRBZTNQQXd4UVhSZ0EwUHZidG8xc1cyTkR0czB4MjdhdElkZVFyYWtwWThpMjNjbkdlNW5uOGVwRGVPMWgrVmdlVmRSVlJKTHdzQ1ExMDFuWDJhV0pkOE9EOGE3T3pya2RhNlVKOFhuUFVzQlp5NDNTMld6N3JzOFVEbkVaQ1pqbjUrdHpiNmpxQ0RndWNZaERha0FuYjRSYitNZG1NQ1BFWVNxWWZIMmNYZlByL3ltY0JhbERGRjg0aXpOK3VEN1RuSENkWHFCN2lDSS9XQnl1dXkxUWJyQWlSRkVMOUwzV2xPYm1jL2w3dVVIZmduMGhpdnFnNDdWYVhNZmx1US9BNlJCRmVURG1ucTM5RDdhRUtOS0JYZmNNVkJWTUN0RnNCMFh2RnNoYlZvQlNJWnFHWUw4L3doMTBCL3U4RjZMNTJFNndVN1p3RXgvb0M2Z1Y0cEhWT1hEZUlQbjk1V09aMWJZUnNEN0VKNzlEN200bm1PN2RFSStmVEhDN283cDZoK3VoNHBKSkIwdnNjTXdLUStYMTN1WFo2UkdoNHZLZWVROGM2bldvSmlGYWRDalJGVVh6bnRiZURjL0dheGNBb3RmN2NpY2ZsS2tBQUFBQVNVVk9SSzVDWUlJPSksdXJsKGRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQ1FBQUFBa0NBUUFBQUJMQ1ZBVEFBQUJTMGxFUVZSNEFlM1VBOHhXZlFDRzhhZlBOck50MjQwTjJUYkhiTnUyaGx4RHRxYW1qQ0hiZHIvczU5MDViOVoxZk4vYmRmeVBmT1psOFpNU0dtaXBnZ3d2TDhsb3Fac0FPS2FEYjJJcitVWi90N3pJVGpsaW8vbldSc0JObTAzVDMzS25IaWZsdzR1bUFsYUovemlMbzZFTDRMTDA0VFRaQWYzRWVhNUpZVDlZRWs2MEVNeVAybVZ4RTJRUDF2enVKbTc0UDRaK0dCZ2NMQ29OMXNmWUZ3ZGJna1hOd01qNys0VjFmbnE2bi8wRFRnV0xXb08rOS9jN0F3RDNzKy9COVdCUmJUQWp4ajQxT0JBc3lnV094ZGczQlBNaXdUZ01La2J0dnJRRlZBc2phZ3RPU3hLbEd3eE8rVGJjMEhFVUhGWG9tZng3SXdITkl1RlEwQzF3MnppbEpmT1QvSnJiQzlnZENZL1N6b25PVWJBNDlNZ2tuam1lNTZLQnZ1YXhLaXp5NldPREl5N1pZcUtTRHg2eHhVR3E4TVBlcWxpclBxczZSS2xqcXdxNm92Q3E3cjZKdkJzK2N3ZExpT2FFVTllazFBQUFBQUJKUlU1RXJrSmdnZz09KTtiYWNrZ3JvdW5kLWNvbG9yOnJnYmEoMCwwLDAsLjgpO2JhY2tncm91bmQtcG9zaXRpb246Y2VudGVyLC0xMDAwcHg7YmFja2dyb3VuZC1yZXBlYXQ6bm8tcmVwZWF0LG5vLXJlcGVhdDt3aWR0aDo1NnB4O2hlaWdodDo1NnB4O2JvcmRlci1yYWRpdXM6NHB4O29wYWNpdHk6LjU7Y3Vyc29yOnBvaW50ZXI7dHJhbnNpdGlvbjpvcGFjaXR5IC4xczstd2Via2l0LXVzZXItc2VsZWN0Om5vbmU7LW1vei11c2VyLXNlbGVjdDpub25lOy1tcy11c2VyLXNlbGVjdDpub25lO3VzZXItc2VsZWN0Om5vbmV9LnB6LXpvb20tYnV0dG9uLnB6LXpvb20tb3V0e2JhY2tncm91bmQtcG9zaXRpb246LTEwMDBweCxjZW50ZXJ9LnB6LXpvb20tYnV0dG9uOmhvdmVye29wYWNpdHk6Ljd9YF1cbn0pXG5cbmV4cG9ydCBjbGFzcyBQaW5jaFpvb21Db21wb25lbnQge1xuXG4gICAgaTogbnVtYmVyID0gMDtcbiAgICBfaWQ6IGFueTtcbiAgICBlbGVtZW50OiBhbnk7XG4gICAgZWxlbWVudFBvc2l0aW9uOiBhbnk7XG4gICAgcGFyZW50RWxlbWVudDogYW55O1xuICAgIGV2ZW50VHlwZTogYW55O1xuXG4gICAgc2NhbGU6IG51bWJlciA9IDE7XG4gICAgaW5pdGlhbFNjYWxlOiBudW1iZXIgPSAxO1xuXG4gICAgc3RhcnRYOiBudW1iZXI7XG4gICAgc3RhcnRZOiBudW1iZXI7XG4gICAgc3RhcnRDbGllbnRYOiBudW1iZXI7XG4gICAgc3RhcnRDbGllbnRZOiBudW1iZXI7XG5cbiAgICBtb3ZlWDogYW55ID0gMDtcbiAgICBtb3ZlWTogYW55ID0gMDtcbiAgICBpbml0aWFsTW92ZVg6IGFueSA9IDA7XG4gICAgaW5pdGlhbE1vdmVZOiBhbnkgPSAwO1xuICAgIG1vdmVYQzogbnVtYmVyO1xuICAgIG1vdmVZQzogbnVtYmVyO1xuXG4gICAgZGlzdGFuY2U6IG51bWJlcjtcbiAgICBpbml0aWFsRGlzdGFuY2U6IG51bWJlcjtcbiAgICBkcmFnZ2luZ01vZGU6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBkb3VibGVUYXBUaW1lb3V0OiBhbnk7XG4gICAgbGFzdFRhcDogbnVtYmVyID0gMDtcblxuICAgIEBJbnB1dCgnaGVpZ2h0JykgY29udGFpbmVySGVpZ2h0OiBzdHJpbmc7XG4gICAgQElucHV0KCd0cmFuc2l0aW9uLWR1cmF0aW9uJykgdHJhbnNpdGlvbkR1cmF0aW9uOiBudW1iZXIgPSAyMDA7XG4gICAgQElucHV0KCdkb3VibGUtdGFwJykgZG91YmxlVGFwOiBib29sZWFuID0gdHJ1ZTtcbiAgICBASW5wdXQoJ3pvb20tYnV0dG9uJykgem9vbUJ1dHRvbjogYm9vbGVhbiA9IHRydWU7XG4gICAgQElucHV0KCdsaW5lYXItaG9yaXpvbnRhbC1zd2lwZScpIGxpbmVhckhvcml6b250YWxTd2lwZTogYm9vbGVhbiA9IGZhbHNlO1xuICAgIEBJbnB1dCgnbGluZWFyLXZlcnRpY2FsLXN3aXBlJykgbGluZWFyVmVydGljYWxTd2lwZTogYm9vbGVhbiA9IGZhbHNlO1xuICAgIEBJbnB1dCgnYXV0by16b29tLW91dCcpIGF1dG9ab29tT3V0OiBib29sZWFuID0gZmFsc2U7XG4gICAgQElucHV0KCdpZCcpIHNldCBpZCh2YWx1ZTogYW55KSB7XG4gICAgICAgIHRoaXMuX2lkID0gdmFsdWU7XG4gICAgfVxuICAgIGdldCBpZCgpe1xuICAgICAgICByZXR1cm4gdGhpcy5faWQ7XG4gICAgfVxuICAgIFxuICAgIEBPdXRwdXQoKSBldmVudHM6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgICBASG9zdEJpbmRpbmcoJ3N0eWxlLmRpc3BsYXknKSBob3N0RGlzcGxheTpzdHJpbmc7XG4gICAgQEhvc3RCaW5kaW5nKCdzdHlsZS5vdmVyZmxvdycpIGhvc3RPdmVyZmxvdzpzdHJpbmc7XG4gICAgQEhvc3RCaW5kaW5nKCdzdHlsZS5oZWlnaHQnKSBob3N0SGVpZ2h0OnN0cmluZztcblxuICAgIEBWaWV3Q2hpbGQoJ2NvbnRlbnQnKSBjb250ZW50RWxlbWVudDogRWxlbWVudFJlZjtcblxuICAgIGdldCBpc01vYmlsZSgpIHtcbiAgICAgICAgdmFyIGNoZWNrID0gZmFsc2U7XG4gICAgICAgIChmdW5jdGlvbihhKXtpZigvKGFuZHJvaWR8YmJcXGQrfG1lZWdvKS4rbW9iaWxlfGF2YW50Z298YmFkYVxcL3xibGFja2JlcnJ5fGJsYXplcnxjb21wYWx8ZWxhaW5lfGZlbm5lY3xoaXB0b3B8aWVtb2JpbGV8aXAoaG9uZXxvZCl8aXJpc3xraW5kbGV8bGdlIHxtYWVtb3xtaWRwfG1tcHxtb2JpbGUuK2ZpcmVmb3h8bmV0ZnJvbnR8b3BlcmEgbShvYnxpbilpfHBhbG0oIG9zKT98cGhvbmV8cChpeGl8cmUpXFwvfHBsdWNrZXJ8cG9ja2V0fHBzcHxzZXJpZXMoNHw2KTB8c3ltYmlhbnx0cmVvfHVwXFwuKGJyb3dzZXJ8bGluayl8dm9kYWZvbmV8d2FwfHdpbmRvd3MgY2V8eGRhfHhpaW5vL2kudGVzdChhKXx8LzEyMDd8NjMxMHw2NTkwfDNnc298NHRocHw1MFsxLTZdaXw3NzBzfDgwMnN8YSB3YXxhYmFjfGFjKGVyfG9vfHNcXC0pfGFpKGtvfHJuKXxhbChhdnxjYXxjbyl8YW1vaXxhbihleHxueXx5dyl8YXB0dXxhcihjaHxnbyl8YXModGV8dXMpfGF0dHd8YXUoZGl8XFwtbXxyIHxzICl8YXZhbnxiZShja3xsbHxucSl8YmkobGJ8cmQpfGJsKGFjfGF6KXxicihlfHYpd3xidW1ifGJ3XFwtKG58dSl8YzU1XFwvfGNhcGl8Y2N3YXxjZG1cXC18Y2VsbHxjaHRtfGNsZGN8Y21kXFwtfGNvKG1wfG5kKXxjcmF3fGRhKGl0fGxsfG5nKXxkYnRlfGRjXFwtc3xkZXZpfGRpY2F8ZG1vYnxkbyhjfHApb3xkcygxMnxcXC1kKXxlbCg0OXxhaSl8ZW0obDJ8dWwpfGVyKGljfGswKXxlc2w4fGV6KFs0LTddMHxvc3x3YXx6ZSl8ZmV0Y3xmbHkoXFwtfF8pfGcxIHV8ZzU2MHxnZW5lfGdmXFwtNXxnXFwtbW98Z28oXFwud3xvZCl8Z3IoYWR8dW4pfGhhaWV8aGNpdHxoZFxcLShtfHB8dCl8aGVpXFwtfGhpKHB0fHRhKXxocCggaXxpcCl8aHNcXC1jfGh0KGMoXFwtfCB8X3xhfGd8cHxzfHQpfHRwKXxodShhd3x0Yyl8aVxcLSgyMHxnb3xtYSl8aTIzMHxpYWMoIHxcXC18XFwvKXxpYnJvfGlkZWF8aWcwMXxpa29tfGltMWt8aW5ub3xpcGFxfGlyaXN8amEodHx2KWF8amJyb3xqZW11fGppZ3N8a2RkaXxrZWppfGtndCggfFxcLyl8a2xvbnxrcHQgfGt3Y1xcLXxreW8oY3xrKXxsZShub3x4aSl8bGcoIGd8XFwvKGt8bHx1KXw1MHw1NHxcXC1bYS13XSl8bGlid3xseW54fG0xXFwtd3xtM2dhfG01MFxcL3xtYSh0ZXx1aXx4byl8bWMoMDF8MjF8Y2EpfG1cXC1jcnxtZShyY3xyaSl8bWkobzh8b2F8dHMpfG1tZWZ8bW8oMDF8MDJ8Yml8ZGV8ZG98dChcXC18IHxvfHYpfHp6KXxtdCg1MHxwMXx2ICl8bXdicHxteXdhfG4xMFswLTJdfG4yMFsyLTNdfG4zMCgwfDIpfG41MCgwfDJ8NSl8bjcoMCgwfDEpfDEwKXxuZSgoY3xtKVxcLXxvbnx0Znx3Znx3Z3x3dCl8bm9rKDZ8aSl8bnpwaHxvMmltfG9wKHRpfHd2KXxvcmFufG93ZzF8cDgwMHxwYW4oYXxkfHQpfHBkeGd8cGcoMTN8XFwtKFsxLThdfGMpKXxwaGlsfHBpcmV8cGwoYXl8dWMpfHBuXFwtMnxwbyhja3xydHxzZSl8cHJveHxwc2lvfHB0XFwtZ3xxYVxcLWF8cWMoMDd8MTJ8MjF8MzJ8NjB8XFwtWzItN118aVxcLSl8cXRla3xyMzgwfHI2MDB8cmFrc3xyaW05fHJvKHZlfHpvKXxzNTVcXC98c2EoZ2V8bWF8bW18bXN8bnl8dmEpfHNjKDAxfGhcXC18b298cFxcLSl8c2RrXFwvfHNlKGMoXFwtfDB8MSl8NDd8bWN8bmR8cmkpfHNnaFxcLXxzaGFyfHNpZShcXC18bSl8c2tcXC0wfHNsKDQ1fGlkKXxzbShhbHxhcnxiM3xpdHx0NSl8c28oZnR8bnkpfHNwKDAxfGhcXC18dlxcLXx2ICl8c3koMDF8bWIpfHQyKDE4fDUwKXx0NigwMHwxMHwxOCl8dGEoZ3R8bGspfHRjbFxcLXx0ZGdcXC18dGVsKGl8bSl8dGltXFwtfHRcXC1tb3x0byhwbHxzaCl8dHMoNzB8bVxcLXxtM3xtNSl8dHhcXC05fHVwKFxcLmJ8ZzF8c2kpfHV0c3R8djQwMHx2NzUwfHZlcml8dmkocmd8dGUpfHZrKDQwfDVbMC0zXXxcXC12KXx2bTQwfHZvZGF8dnVsY3x2eCg1Mnw1M3w2MHw2MXw3MHw4MHw4MXw4M3w4NXw5OCl8dzNjKFxcLXwgKXx3ZWJjfHdoaXR8d2koZyB8bmN8bncpfHdtbGJ8d29udXx4NzAwfHlhc1xcLXx5b3VyfHpldG98enRlXFwtL2kudGVzdChhLnN1YnN0cigwLDQpKSkgY2hlY2sgPSB0cnVlO30pKG5hdmlnYXRvci51c2VyQWdlbnR8fG5hdmlnYXRvci52ZW5kb3IpO1xuICAgICAgICByZXR1cm4gY2hlY2s7XG4gICAgfTtcblxuICAgIGdldCBpc0RyYWdnaW5nKCl7XG4gICAgICAgIGxldCBpbWdIZWlnaHQgPSB0aGlzLmdldEltYWdlSGVpZ2h0KCk7XG4gICAgICAgIGxldCBpbWdXaWR0aCA9IHRoaXMuZ2V0SW1hZ2VXaWR0aCgpO1xuXG4gICAgICAgIGlmICh0aGlzLnNjYWxlID4gMSkge1xuICAgICAgICAgICAgcmV0dXJuIGltZ0hlaWdodCAqIHRoaXMuc2NhbGUgPiB0aGlzLnBhcmVudEVsZW1lbnQub2Zmc2V0SGVpZ2h0IHx8IGltZ1dpZHRoICogdGhpcy5zY2FsZSA+IHRoaXMucGFyZW50RWxlbWVudC5vZmZzZXRXaWR0aDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5zY2FsZSA9PT0gMSkge1xuICAgICAgICAgICAgcmV0dXJuIGltZ0hlaWdodCA+IHRoaXMucGFyZW50RWxlbWVudC5vZmZzZXRIZWlnaHQgfHwgaW1nV2lkdGggPiB0aGlzLnBhcmVudEVsZW1lbnQub2Zmc2V0V2lkdGg7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYpe1xuICAgIH1cblxuICAgIG5nT25Jbml0KCkge1xuICAgICAgICB0aGlzLmVsZW1lbnQgPSB0aGlzLmNvbnRlbnRFbGVtZW50Lm5hdGl2ZUVsZW1lbnQ7XG4gICAgICAgIHRoaXMucGFyZW50RWxlbWVudCA9IHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuXG4gICAgICAgIHRoaXMuc2V0QmFzaWNTdHlsZXMoKTtcblxuICAgICAgICB0aGlzLmVsZW1lbnQub25kcmFnc3RhcnQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfTtcbiAgICB9XG5cblxuICAgIC8qXG4gICAgICogRGVza3RvcCBsaXN0ZW5lcnNcbiAgICAgKi9cblxuICAgIEBIb3N0TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgWyckZXZlbnQnXSlcbiAgICBvbk1vdXNlRW50ZXIoZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICAgICAgdGhpcy5nZXRFbGVtZW50UG9zaXRpb24oKTtcblxuICAgICAgICBpZiAodGhpcy5pc0RyYWdnaW5nKSB7XG4gICAgICAgICAgICB0aGlzLmRyYWdnaW5nTW9kZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBASG9zdExpc3RlbmVyKFwid2luZG93Om1vdXNlbW92ZVwiLCBbJyRldmVudCddKVxuICAgIG9uTW91c2VNb3ZlKGV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgICAgIGlmICh0aGlzLmRyYWdnaW5nTW9kZSl7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICBpZiAoIXRoaXMuZXZlbnRUeXBlKXtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0WCA9IGV2ZW50LmNsaWVudFggLSB0aGlzLmVsZW1lbnRQb3NpdGlvbi5sZWZ0O1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhcnRZID0gZXZlbnQuY2xpZW50WSAtIHRoaXMuZWxlbWVudFBvc2l0aW9uLnRvcDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5ldmVudFR5cGUgPSAnc3dpcGUnO1xuICAgICAgICAgICAgdGhpcy5ldmVudHMuZW1pdCh7XG4gICAgICAgICAgICAgICAgdHlwZTogJ3N3aXBlJyxcbiAgICAgICAgICAgICAgICBtb3ZlWDogdGhpcy5tb3ZlWCxcbiAgICAgICAgICAgICAgICBtb3ZlWTogdGhpcy5tb3ZlWVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMubW92ZVggPSB0aGlzLmluaXRpYWxNb3ZlWCArICgoZXZlbnQuY2xpZW50WCAtIHRoaXMuZWxlbWVudFBvc2l0aW9uLmxlZnQpIC0gdGhpcy5zdGFydFgpO1xuICAgICAgICAgICAgdGhpcy5tb3ZlWSA9IHRoaXMuaW5pdGlhbE1vdmVZICsgKChldmVudC5jbGllbnRZIC0gdGhpcy5lbGVtZW50UG9zaXRpb24udG9wKSAtIHRoaXMuc3RhcnRZKTtcblxuICAgICAgICAgICAgdGhpcy5jZW50ZXJpbmdJbWFnZSgpO1xuICAgICAgICAgICAgdGhpcy50cmFuc2Zvcm1FbGVtZW50KDApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgQEhvc3RMaXN0ZW5lcihcIndpbmRvdzptb3VzZXVwXCIsIFsnJGV2ZW50J10pXG4gICAgb25Nb3VzZVVwKGV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgICAgIHRoaXMuZHJhZ2dpbmdNb2RlID0gZmFsc2U7XG4gICAgICAgIHRoaXMudXBkYXRlSW5pdGlhbFZhbHVlcygpO1xuICAgICAgICB0aGlzLmV2ZW50VHlwZSA9ICcnO1xuICAgIH1cblxuXG4gICAgLypcbiAgICAgKiBNb2JpbGUgbGlzdGVuZXJzXG4gICAgICovXG5cbiAgICBASG9zdExpc3RlbmVyKCd3aW5kb3c6cmVzaXplJywgWyckZXZlbnQnXSlcbiAgICBvblJlc2l6ZShldmVudDpFdmVudCkge1xuICAgICAgICB0aGlzLnNldEltYWdlV2lkdGgoKTtcbiAgICAgICAgdGhpcy50cmFuc2Zvcm1FbGVtZW50KHRoaXMudHJhbnNpdGlvbkR1cmF0aW9uKTsgXG4gICAgfVxuXG4gICAgQEhvc3RMaXN0ZW5lcigndG91Y2hzdGFydCcsIFsnJGV2ZW50J10pXG4gICAgdG91Y2hzdGFydEhhbmRsZXIoZXZlbnQ6YW55KSB7XG4gICAgICAgIHRoaXMuZ2V0RWxlbWVudFBvc2l0aW9uKCk7XG5cbiAgICAgICAgaWYgKCF0aGlzLmV2ZW50VHlwZSl7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0WCA9IGV2ZW50LnRvdWNoZXNbMF0uY2xpZW50WCAtIHRoaXMuZWxlbWVudFBvc2l0aW9uLmxlZnQ7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0WSA9IGV2ZW50LnRvdWNoZXNbMF0uY2xpZW50WSAtIHRoaXMuZWxlbWVudFBvc2l0aW9uLnRvcDtcblxuICAgICAgICAgICAgdGhpcy5zdGFydENsaWVudFggPSBldmVudC50b3VjaGVzWzBdLmNsaWVudFggLSB0aGlzLmVsZW1lbnRQb3NpdGlvbi5sZWZ0O1xuICAgICAgICAgICAgdGhpcy5zdGFydENsaWVudFkgPSBldmVudC50b3VjaGVzWzBdLmNsaWVudFkgLSB0aGlzLmVsZW1lbnRQb3NpdGlvbi50b3A7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmV2ZW50cy5lbWl0KHt0eXBlOiAndG91Y2hzdGFydCd9KTtcbiAgICB9XG5cbiAgICBASG9zdExpc3RlbmVyKCd0b3VjaG1vdmUnLCBbJyRldmVudCddKVxuICAgIHRvdWNobW92ZUhhbmRsZXIoZXZlbnQ6YW55KSB7XG4gICAgICAgIGxldCB0b3VjaGVzID0gZXZlbnQudG91Y2hlcztcblxuICAgICAgICAvLyBTd2lwZVxuICAgICAgICBpZiAodGhpcy5kZXRlY3RTd2lwZSh0b3VjaGVzKSB8fCB0aGlzLmV2ZW50VHlwZSA9PSAnc3dpcGUnKXtcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlU3dpcGUoZXZlbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gTGluZWFyIHN3aXBlXG4gICAgICAgIGlmICh0aGlzLmRldGVjdExpbmVhclN3aXBlKHRvdWNoZXMpIHx8IHRoaXMuZXZlbnRUeXBlID09ICdob3Jpem9udGFsLXN3aXBlJyB8fCB0aGlzLmV2ZW50VHlwZSA9PSAndmVydGljYWwtc3dpcGUnKXsgICBcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlTGluZWFyU3dpcGUoZXZlbnQpOyBcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFBpbmNoXG4gICAgICAgIGlmICh0b3VjaGVzLmxlbmd0aCA9PT0gMiAmJiAhdGhpcy5ldmVudFR5cGUgfHwgdGhpcy5ldmVudFR5cGUgPT0gJ3BpbmNoJyl7XG4gICAgICAgICAgICB0aGlzLmhhbmRsZVBpbmNoKGV2ZW50KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIEBIb3N0TGlzdGVuZXIoJ3RvdWNoZW5kJywgWyckZXZlbnQnXSlcbiAgICB0b3VjaGVuZEhhbmRsZXIoZXZlbnQ6YW55KSB7XG4gICAgICAgIHRoaXMuaSA9IDA7XG4gICAgICAgIHRoaXMuZHJhZ2dpbmdNb2RlID0gZmFsc2U7XG4gICAgICAgIGxldCB0b3VjaGVzID0gZXZlbnQudG91Y2hlcztcblxuICAgICAgICBpZiAodGhpcy5zY2FsZSA8IDEpe1xuICAgICAgICAgICAgdGhpcy5zY2FsZSA9IDE7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBdXRvIFpvb20gT3V0XG4gICAgICAgIGlmICh0aGlzLmF1dG9ab29tT3V0ICYmIHRoaXMuZXZlbnRUeXBlID09PSAncGluY2gnKXtcbiAgICAgICAgICAgIHRoaXMuc2NhbGUgPSAxO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5ldmVudHMuZW1pdCh7dHlwZTogJ3RvdWNoZW5kJ30pO1xuXG4gICAgICAgIC8vIERvdWJsZSBUYXBcbiAgICAgICAgaWYgKHRoaXMuZG91YmxlVGFwRGV0ZWN0aW9uKCkgJiYgIXRoaXMuZXZlbnRUeXBlKXtcbiAgICAgICAgICAgIHRoaXMudG9nZ2xlWm9vbShldmVudCk7XG4gICAgICAgICAgICB0aGlzLmV2ZW50cy5lbWl0KHt0eXBlOiAnZG91YmxlLXRhcCd9KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmV2ZW50VHlwZSA9PT0gJ3BpbmNoJyB8fCB0aGlzLmV2ZW50VHlwZSA9PT0gJ3N3aXBlJyl7XG4gICAgICAgICAgICB0aGlzLmFsaWduSW1hZ2UoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmV2ZW50VHlwZSA9PT0gJ3BpbmNoJyB8fCBcbiAgICAgICAgICAgIHRoaXMuZXZlbnRUeXBlID09PSAnc3dpcGUnIHx8XG4gICAgICAgICAgICB0aGlzLmV2ZW50VHlwZSA9PT0gJ2hvcml6b250YWwtc3dpcGUnIHx8XG4gICAgICAgICAgICB0aGlzLmV2ZW50VHlwZSA9PT0gJ3ZlcnRpY2FsLXN3aXBlJyl7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUluaXRpYWxWYWx1ZXMoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZXZlbnRUeXBlID0gJ3RvdWNoZW5kJztcblxuICAgICAgICBpZiAodG91Y2hlcyAmJiB0b3VjaGVzLmxlbmd0aCA9PSAwKXtcbiAgICAgICAgICAgIHRoaXMuZXZlbnRUeXBlID0gJyc7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIC8qXG4gICAgICogSGFuZGxlcnNcbiAgICAgKi9cblxuICAgIGhhbmRsZVN3aXBlKGV2ZW50OmFueSl7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgaWYgKCF0aGlzLmV2ZW50VHlwZSl7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0WCA9IGV2ZW50LnRvdWNoZXNbMF0uY2xpZW50WCAtIHRoaXMuZWxlbWVudFBvc2l0aW9uLmxlZnQ7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0WSA9IGV2ZW50LnRvdWNoZXNbMF0uY2xpZW50WSAtIHRoaXMuZWxlbWVudFBvc2l0aW9uLnRvcDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZXZlbnRUeXBlID0gJ3N3aXBlJztcbiAgICAgICAgdGhpcy5ldmVudHMuZW1pdCh7XG4gICAgICAgICAgICB0eXBlOiAnc3dpcGUnLFxuICAgICAgICAgICAgbW92ZVg6IHRoaXMubW92ZVgsXG4gICAgICAgICAgICBtb3ZlWTogdGhpcy5tb3ZlWVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLm1vdmVYID0gdGhpcy5pbml0aWFsTW92ZVggKyAoKGV2ZW50LnRvdWNoZXNbMF0uY2xpZW50WCAtIHRoaXMuZWxlbWVudFBvc2l0aW9uLmxlZnQpIC0gdGhpcy5zdGFydFgpO1xuICAgICAgICB0aGlzLm1vdmVZID0gdGhpcy5pbml0aWFsTW92ZVkgKyAoKGV2ZW50LnRvdWNoZXNbMF0uY2xpZW50WSAtIHRoaXMuZWxlbWVudFBvc2l0aW9uLnRvcCkgLSB0aGlzLnN0YXJ0WSk7XG5cbiAgICAgICAgdGhpcy50cmFuc2Zvcm1FbGVtZW50KDApO1xuICAgIH1cblxuICAgIGhhbmRsZVBpbmNoKGV2ZW50OmFueSl7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgbGV0IHRvdWNoZXMgPSBldmVudC50b3VjaGVzO1xuXG4gICAgICAgIGlmICghdGhpcy5ldmVudFR5cGUpe1xuICAgICAgICAgICAgdGhpcy5pbml0aWFsRGlzdGFuY2UgPSB0aGlzLmdldERpc3RhbmNlKHRvdWNoZXMpO1xuXG4gICAgICAgICAgICB0aGlzLm1vdmVYQyA9ICgoKGV2ZW50LnRvdWNoZXNbMF0uY2xpZW50WCAtIHRoaXMuZWxlbWVudFBvc2l0aW9uLmxlZnQpICsgKGV2ZW50LnRvdWNoZXNbMV0uY2xpZW50WCAtIHRoaXMuZWxlbWVudFBvc2l0aW9uLmxlZnQpKSAvIDIpIC0gdGhpcy5pbml0aWFsTW92ZVg7XG4gICAgICAgICAgICB0aGlzLm1vdmVZQyA9ICgoKGV2ZW50LnRvdWNoZXNbMF0uY2xpZW50WSAtIHRoaXMuZWxlbWVudFBvc2l0aW9uLnRvcCkgKyAoZXZlbnQudG91Y2hlc1sxXS5jbGllbnRZIC0gdGhpcy5lbGVtZW50UG9zaXRpb24udG9wKSkgLyAyKSAtIHRoaXMuaW5pdGlhbE1vdmVZO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5ldmVudFR5cGUgPSAncGluY2gnO1xuICAgICAgICB0aGlzLmV2ZW50cy5lbWl0KHt0eXBlOiAncGluY2gnfSk7XG4gICAgICAgIHRoaXMuZGlzdGFuY2UgPSB0aGlzLmdldERpc3RhbmNlKHRvdWNoZXMpO1xuICAgICAgICB0aGlzLnNjYWxlID0gdGhpcy5pbml0aWFsU2NhbGUgKiAodGhpcy5kaXN0YW5jZSAvIHRoaXMuaW5pdGlhbERpc3RhbmNlKTtcblxuICAgICAgICB0aGlzLm1vdmVYID0gdGhpcy5pbml0aWFsTW92ZVggLSAoKCh0aGlzLmRpc3RhbmNlIC8gdGhpcy5pbml0aWFsRGlzdGFuY2UpICogdGhpcy5tb3ZlWEMpIC0gdGhpcy5tb3ZlWEMpO1xuICAgICAgICB0aGlzLm1vdmVZID0gdGhpcy5pbml0aWFsTW92ZVkgLSAoKCh0aGlzLmRpc3RhbmNlIC8gdGhpcy5pbml0aWFsRGlzdGFuY2UpICogdGhpcy5tb3ZlWUMpIC0gdGhpcy5tb3ZlWUMpO1xuXG4gICAgICAgIHRoaXMudHJhbnNmb3JtRWxlbWVudCgwKTtcbiAgICB9XG5cbiAgICBoYW5kbGVMaW5lYXJTd2lwZShldmVudDphbnkpe1xuICAgICAgICBpZiAodGhpcy5saW5lYXJWZXJ0aWNhbFN3aXBlKXtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHRoaXMuaSsrO1xuXG4gICAgICAgIGlmICh0aGlzLmkgPiAzKXtcbiAgICAgICAgICAgIHRoaXMuZXZlbnRUeXBlID0gdGhpcy5nZXRMaW5lYXJTd2lwZVR5cGUoZXZlbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZXZlbnRUeXBlID09ICdob3Jpem9udGFsLXN3aXBlJyl7XG4gICAgICAgICAgICB0aGlzLm1vdmVYID0gdGhpcy5pbml0aWFsTW92ZVggKyAoKGV2ZW50LnRvdWNoZXNbMF0uY2xpZW50WCAtIHRoaXMuZWxlbWVudFBvc2l0aW9uLmxlZnQpIC0gdGhpcy5zdGFydFgpO1xuICAgICAgICAgICAgdGhpcy5tb3ZlWSA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5ldmVudFR5cGUgPT0gJ3ZlcnRpY2FsLXN3aXBlJyl7XG4gICAgICAgICAgICB0aGlzLm1vdmVYID0gMDtcbiAgICAgICAgICAgIHRoaXMubW92ZVkgPSB0aGlzLmluaXRpYWxNb3ZlWSArICgoZXZlbnQudG91Y2hlc1swXS5jbGllbnRZIC0gdGhpcy5lbGVtZW50UG9zaXRpb24udG9wKSAtIHRoaXMuc3RhcnRZKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmV2ZW50VHlwZSl7XG4gICAgICAgICAgICB0aGlzLmV2ZW50cy5lbWl0KHtcbiAgICAgICAgICAgICAgICB0eXBlOiB0aGlzLmV2ZW50VHlwZSxcbiAgICAgICAgICAgICAgICBtb3ZlWDogdGhpcy5tb3ZlWCxcbiAgICAgICAgICAgICAgICBtb3ZlWTogdGhpcy5tb3ZlWVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLnRyYW5zZm9ybUVsZW1lbnQoMCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIGRldGVjdFN3aXBlKHRvdWNoZXM6YW55KXtcbiAgICAgICAgcmV0dXJuIHRvdWNoZXMubGVuZ3RoID09PSAxICYmIHRoaXMuc2NhbGUgPiAxICYmICF0aGlzLmV2ZW50VHlwZTtcbiAgICB9XG5cbiAgICBkZXRlY3RMaW5lYXJTd2lwZSh0b3VjaGVzOlRvdWNoTGlzdCl7XG4gICAgICAgIHJldHVybiB0b3VjaGVzLmxlbmd0aCA9PT0gMSAmJiB0aGlzLnNjYWxlID09PSAxICYmICF0aGlzLmV2ZW50VHlwZTtcbiAgICB9XG5cbiAgICBnZXRMaW5lYXJTd2lwZVR5cGUoZXZlbnQ6YW55KTpzdHJpbmcge1xuICAgICAgICBpZiAodGhpcy5ldmVudFR5cGUgIT0gJ2hvcml6b250YWwtc3dpcGUnICYmIHRoaXMuZXZlbnRUeXBlICE9ICd2ZXJ0aWNhbC1zd2lwZScpe1xuICAgICAgICAgICAgbGV0IG1vdmVtZW50WCA9IE1hdGguYWJzKChldmVudC50b3VjaGVzWzBdLmNsaWVudFggLSB0aGlzLmVsZW1lbnRQb3NpdGlvbi5sZWZ0KSAtIHRoaXMuc3RhcnRDbGllbnRYKTsgXG4gICAgICAgICAgICBsZXQgbW92ZW1lbnRZID0gTWF0aC5hYnMoKGV2ZW50LnRvdWNoZXNbMF0uY2xpZW50WSAtIHRoaXMuZWxlbWVudFBvc2l0aW9uLnRvcCkgLSB0aGlzLnN0YXJ0Q2xpZW50WSk7XG5cbiAgICAgICAgICAgIGlmICgobW92ZW1lbnRZICogMykgPiBtb3ZlbWVudFgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5saW5lYXJWZXJ0aWNhbFN3aXBlID8gJ3ZlcnRpY2FsLXN3aXBlJyA6ICcnO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5saW5lYXJIb3Jpem9udGFsU3dpcGUgPyAnaG9yaXpvbnRhbC1zd2lwZScgOiAnJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmV2ZW50VHlwZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldERpc3RhbmNlKHRvdWNoZXM6IGFueSl7XG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoIE1hdGgucG93KHRvdWNoZXNbMF0ucGFnZVggLSB0b3VjaGVzWzFdLnBhZ2VYLCAyKSArIE1hdGgucG93KHRvdWNoZXNbMF0ucGFnZVkgLSB0b3VjaGVzWzFdLnBhZ2VZLCAyKSk7XG4gICAgfVxuXG4gICAgZ2V0SW1hZ2VIZWlnaHQoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImltZ1wiKVswXS5vZmZzZXRIZWlnaHQ7XG4gICAgfVxuXG4gICAgZ2V0SW1hZ2VXaWR0aCgpe1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaW1nXCIpWzBdLm9mZnNldFdpZHRoO1xuICAgIH1cblxuICAgIHNldEJhc2ljU3R5bGVzKCk6dm9pZCB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gXCJmbGV4XCI7XG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5oZWlnaHQgPSBcIjEwMCVcIjtcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmFsaWduSXRlbXMgPSBcImNlbnRlclwiO1xuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuanVzdGlmeUNvbnRlbnQgPSBcImNlbnRlclwiO1xuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudHJhbnNmb3JtT3JpZ2luID0gJzAgMCc7XG5cbiAgICAgICAgdGhpcy5ob3N0RGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgICAgdGhpcy5ob3N0T3ZlcmZsb3cgPSBcImhpZGRlblwiO1xuICAgICAgICB0aGlzLmhvc3RIZWlnaHQgPSB0aGlzLmNvbnRhaW5lckhlaWdodDtcblxuICAgICAgICB0aGlzLnNldEltYWdlV2lkdGgoKTtcbiAgICB9XG5cbiAgICBzZXRJbWFnZVdpZHRoKCk6dm9pZCB7XG4gICAgICAgIGxldCBpbWdFbGVtZW50ID0gdGhpcy5lbGVtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaW1nXCIpO1xuXG4gICAgICAgIGlmIChpbWdFbGVtZW50Lmxlbmd0aCl7XG4gICAgICAgICAgICBpbWdFbGVtZW50WzBdLnN0eWxlLm1heFdpZHRoID0gJzEwMCUnO1xuICAgICAgICAgICAgaW1nRWxlbWVudFswXS5zdHlsZS5tYXhIZWlnaHQgPSAnMTAwJSc7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0cmFuc2Zvcm1FbGVtZW50KGR1cmF0aW9uOiBhbnkgPSA1MCl7XG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS50cmFuc2l0aW9uID0gJ2FsbCAnKyBkdXJhdGlvbiArJ21zJztcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnRyYW5zZm9ybSA9ICdtYXRyaXgoJysgTnVtYmVyKHRoaXMuc2NhbGUpICsnLCcrIDAgKycsJysgMCArJywnKyBOdW1iZXIodGhpcy5zY2FsZSkgKycsJysgTnVtYmVyKHRoaXMubW92ZVgpICsnLCcrIE51bWJlcih0aGlzLm1vdmVZKSArJyknO1xuICAgIH1cblxuICAgIGRvdWJsZVRhcERldGVjdGlvbigpOmJvb2xlYW4ge1xuICAgICAgICBpZiAoIXRoaXMuZG91YmxlVGFwKXtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBjdXJyZW50VGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICBsZXQgdGFwTGVuZ3RoID0gY3VycmVudFRpbWUgLSB0aGlzLmxhc3RUYXA7XG4gICAgICAgIFxuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5kb3VibGVUYXBUaW1lb3V0KTtcblxuICAgICAgICBpZiAodGFwTGVuZ3RoIDwgMzAwICYmIHRhcExlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5kb3VibGVUYXBUaW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5kb3VibGVUYXBUaW1lb3V0KTtcbiAgICAgICAgICAgIH0sIDMwMCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5sYXN0VGFwID0gY3VycmVudFRpbWU7XG4gICAgfVxuXG4gICAgcHVibGljIHRvZ2dsZVpvb20oZXZlbnQ6YW55ID0gZmFsc2UpOnZvaWQge1xuICAgICAgICBpZiAodGhpcy5pbml0aWFsU2NhbGUgPT09IDEpe1xuXG4gICAgICAgICAgICBpZiAoZXZlbnQgJiYgZXZlbnQuY2hhbmdlZFRvdWNoZXMpe1xuICAgICAgICAgICAgICAgIGxldCBjaGFuZ2VkVG91Y2hlcyA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5zY2FsZSA9IHRoaXMuaW5pdGlhbFNjYWxlICogMjtcbiAgICAgICAgICAgICAgICB0aGlzLm1vdmVYID0gdGhpcy5pbml0aWFsTW92ZVggLSAoY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WCAtIHRoaXMuZWxlbWVudFBvc2l0aW9uLmxlZnQpO1xuICAgICAgICAgICAgICAgIHRoaXMubW92ZVkgPSB0aGlzLmluaXRpYWxNb3ZlWSAtIChjaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRZIC0gdGhpcy5lbGVtZW50UG9zaXRpb24udG9wKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zY2FsZSA9IHRoaXMuaW5pdGlhbFNjYWxlICogMjtcbiAgICAgICAgICAgICAgICB0aGlzLm1vdmVYID0gdGhpcy5pbml0aWFsTW92ZVggLSB0aGlzLmVsZW1lbnQub2Zmc2V0V2lkdGggLyAyO1xuICAgICAgICAgICAgICAgIHRoaXMubW92ZVkgPSB0aGlzLmluaXRpYWxNb3ZlWSAtIHRoaXMuZWxlbWVudC5vZmZzZXRIZWlnaHQgLyAyO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmNlbnRlcmluZ0ltYWdlKCk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUluaXRpYWxWYWx1ZXMoKTtcbiAgICAgICAgICAgIHRoaXMudHJhbnNmb3JtRWxlbWVudCh0aGlzLnRyYW5zaXRpb25EdXJhdGlvbik7XG4gICAgICAgICAgICB0aGlzLmV2ZW50cy5lbWl0KHt0eXBlOiAnem9vbS1pbid9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucmVzZXRTY2FsZSgpO1xuICAgICAgICAgICAgdGhpcy5ldmVudHMuZW1pdCh7dHlwZTogJ3pvb20tb3V0J30pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVzZXRTY2FsZSgpOnZvaWQge1xuICAgICAgICB0aGlzLnNjYWxlID0gMTtcbiAgICAgICAgdGhpcy5tb3ZlWCA9IDA7XG4gICAgICAgIHRoaXMubW92ZVkgPSAwO1xuICAgICAgICB0aGlzLnVwZGF0ZUluaXRpYWxWYWx1ZXMoKTtcbiAgICAgICAgdGhpcy50cmFuc2Zvcm1FbGVtZW50KHRoaXMudHJhbnNpdGlvbkR1cmF0aW9uKTtcbiAgICB9XG5cbiAgICB1cGRhdGVJbml0aWFsVmFsdWVzKCk6dm9pZCB7XG4gICAgICAgIHRoaXMuaW5pdGlhbFNjYWxlID0gdGhpcy5zY2FsZTtcbiAgICAgICAgdGhpcy5pbml0aWFsTW92ZVggPSB0aGlzLm1vdmVYO1xuICAgICAgICB0aGlzLmluaXRpYWxNb3ZlWSA9IHRoaXMubW92ZVk7XG4gICAgfVxuXG4gICAgY2VudGVyaW5nSW1hZ2UoKTpib29sZWFuIHtcbiAgICAgICAgbGV0IGltZyA9IHRoaXMuZWxlbWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImltZ1wiKVswXTtcbiAgICAgICAgY29uc3QgaW5pdGlhbE1vdmVYID0gdGhpcy5tb3ZlWDtcbiAgICAgICAgY29uc3QgaW5pdGlhbE1vdmVZID0gdGhpcy5tb3ZlWTtcblxuICAgICAgICBpZiAodGhpcy5tb3ZlWSA+IDApe1xuICAgICAgICAgICAgdGhpcy5tb3ZlWSA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMubW92ZVggPiAwKXtcbiAgICAgICAgICAgIHRoaXMubW92ZVggPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGltZyl7XG4gICAgICAgICAgICB0aGlzLnRyYW5zaXRpb25ZUmVzdHJpY3Rpb24oKTtcbiAgICAgICAgICAgIHRoaXMudHJhbnNpdGlvblhSZXN0cmljdGlvbigpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpbWcgJiYgdGhpcy5zY2FsZSA8IDEpe1xuICAgICAgICAgICAgaWYgKHRoaXMubW92ZVggPCB0aGlzLmVsZW1lbnQub2Zmc2V0V2lkdGggKiAoMSAtIHRoaXMuc2NhbGUpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5tb3ZlWCA9IHRoaXMuZWxlbWVudC5vZmZzZXRXaWR0aCAqICgxIC0gdGhpcy5zY2FsZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaW5pdGlhbE1vdmVYICE9IHRoaXMubW92ZVggfHwgaW5pdGlhbE1vdmVZICE9IHRoaXMubW92ZVk7XG4gICAgfVxuXG4gICAgcHVibGljIGFsaWduSW1hZ2UoKTp2b2lkIHtcbiAgICAgICAgbGV0IGlzTW92ZUNoYW5nZWQgPSB0aGlzLmNlbnRlcmluZ0ltYWdlKCk7XG5cbiAgICAgICAgaWYgKGlzTW92ZUNoYW5nZWQpe1xuICAgICAgICAgICAgdGhpcy51cGRhdGVJbml0aWFsVmFsdWVzKCk7XG4gICAgICAgICAgICB0aGlzLnRyYW5zZm9ybUVsZW1lbnQodGhpcy50cmFuc2l0aW9uRHVyYXRpb24pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdHJhbnNpdGlvbllSZXN0cmljdGlvbigpOnZvaWQge1xuICAgICAgICBsZXQgaW1nSGVpZ2h0ID0gdGhpcy5nZXRJbWFnZUhlaWdodCgpO1xuXG4gICAgICAgIGlmIChpbWdIZWlnaHQgKiB0aGlzLnNjYWxlIDwgdGhpcy5wYXJlbnRFbGVtZW50Lm9mZnNldEhlaWdodCl7XG4gICAgICAgICAgICB0aGlzLm1vdmVZID0gKHRoaXMucGFyZW50RWxlbWVudC5vZmZzZXRIZWlnaHQgLSB0aGlzLmVsZW1lbnQub2Zmc2V0SGVpZ2h0ICogdGhpcy5zY2FsZSkgLyAyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IGltZ09mZnNldFRvcCA9ICgoaW1nSGVpZ2h0IC0gdGhpcy5lbGVtZW50Lm9mZnNldEhlaWdodCkgKiB0aGlzLnNjYWxlKSAvIDI7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLm1vdmVZID4gaW1nT2Zmc2V0VG9wKXtcbiAgICAgICAgICAgICAgICB0aGlzLm1vdmVZID0gaW1nT2Zmc2V0VG9wO1xuICAgICAgICAgICAgfSBlbHNlIGlmICgoaW1nSGVpZ2h0ICogdGhpcy5zY2FsZSArIE1hdGguYWJzKGltZ09mZnNldFRvcCkgLSB0aGlzLnBhcmVudEVsZW1lbnQub2Zmc2V0SGVpZ2h0KSArIHRoaXMubW92ZVkgPCAwKXtcbiAgICAgICAgICAgICAgICB0aGlzLm1vdmVZID0gLSAoaW1nSGVpZ2h0ICogdGhpcy5zY2FsZSArIE1hdGguYWJzKGltZ09mZnNldFRvcCkgLSB0aGlzLnBhcmVudEVsZW1lbnQub2Zmc2V0SGVpZ2h0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRyYW5zaXRpb25YUmVzdHJpY3Rpb24oKTp2b2lkIHtcbiAgICAgICAgbGV0IGltZ1dpZHRoID0gdGhpcy5nZXRJbWFnZVdpZHRoKCk7XG5cbiAgICAgICAgaWYgKGltZ1dpZHRoICogdGhpcy5zY2FsZSA8IHRoaXMucGFyZW50RWxlbWVudC5vZmZzZXRXaWR0aCkge1xuICAgICAgICAgICAgdGhpcy5tb3ZlWCA9ICh0aGlzLnBhcmVudEVsZW1lbnQub2Zmc2V0V2lkdGggLSB0aGlzLmVsZW1lbnQub2Zmc2V0V2lkdGggKiB0aGlzLnNjYWxlKSAvIDI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgaW1nT2Zmc2V0TGVmdCA9ICgoaW1nV2lkdGggLSB0aGlzLmVsZW1lbnQub2Zmc2V0V2lkdGgpICogdGhpcy5zY2FsZSkgLyAyO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5tb3ZlWCA+IGltZ09mZnNldExlZnQpe1xuICAgICAgICAgICAgICAgIHRoaXMubW92ZVggPSBpbWdPZmZzZXRMZWZ0O1xuICAgICAgICAgICAgfSBlbHNlIGlmICgoaW1nV2lkdGggKiB0aGlzLnNjYWxlICsgTWF0aC5hYnMoaW1nT2Zmc2V0TGVmdCkgLSB0aGlzLnBhcmVudEVsZW1lbnQub2Zmc2V0V2lkdGgpICsgdGhpcy5tb3ZlWCA8IDApe1xuICAgICAgICAgICAgICAgIHRoaXMubW92ZVggPSAtIChpbWdXaWR0aCAqIHRoaXMuc2NhbGUgKyBNYXRoLmFicyhpbWdPZmZzZXRMZWZ0KSAtIHRoaXMucGFyZW50RWxlbWVudC5vZmZzZXRXaWR0aCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRFbGVtZW50UG9zaXRpb24oKTp2b2lkIHtcbiAgICAgICAgdGhpcy5lbGVtZW50UG9zaXRpb24gPSB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0TW92ZVgodmFsdWU6bnVtYmVyLCB0cmFuc2l0aW9uRHVyYXRpb246bnVtYmVyID0gMjAwKXtcbiAgICAgICAgdGhpcy5tb3ZlWCA9IHZhbHVlO1xuICAgICAgICB0aGlzLnRyYW5zZm9ybUVsZW1lbnQodHJhbnNpdGlvbkR1cmF0aW9uKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0TW92ZVkodmFsdWU6bnVtYmVyLCB0cmFuc2l0aW9uRHVyYXRpb246bnVtYmVyID0gMjAwKXtcbiAgICAgICAgdGhpcy5tb3ZlWSA9IHZhbHVlO1xuICAgICAgICB0aGlzLnRyYW5zZm9ybUVsZW1lbnQodHJhbnNpdGlvbkR1cmF0aW9uKTtcbiAgICB9XG59IiwiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBQaW5jaFpvb21Db21wb25lbnQgfSBmcm9tICcuL3BpbmNoLXpvb20uY29tcG9uZW50JzsgXG5cbkBOZ01vZHVsZSh7XG4gICAgZGVjbGFyYXRpb25zOiBbXG4gICAgICAgIFBpbmNoWm9vbUNvbXBvbmVudFxuICAgIF0sXG4gICAgaW1wb3J0czogW1xuICAgICAgICBDb21tb25Nb2R1bGVcbiAgICBdLFxuICAgIGV4cG9ydHM6IFtcbiAgICAgICAgUGluY2hab29tQ29tcG9uZW50XG4gICAgXSxcbiAgICBlbnRyeUNvbXBvbmVudHM6IFtcbiAgICAgICAgUGluY2hab29tQ29tcG9uZW50XG4gICAgXVxufSlcbmV4cG9ydCBjbGFzcyBQaW5jaFpvb21Nb2R1bGUgeyB9XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOzs7O0lBdUZJLFlBQW9CLFVBQXNCO1FBQXRCLGVBQVUsR0FBVixVQUFVLENBQVk7aUJBcEU5QixDQUFDO3FCQU9HLENBQUM7NEJBQ00sQ0FBQztxQkFPWCxDQUFDO3FCQUNELENBQUM7NEJBQ00sQ0FBQzs0QkFDRCxDQUFDOzRCQU1HLEtBQUs7dUJBRVgsQ0FBQztrQ0FHd0MsR0FBRzt5QkFDcEIsSUFBSTswQkFDRixJQUFJO3FDQUNtQixLQUFLO21DQUNULEtBQUs7MkJBQ3JCLEtBQUs7c0JBUWQsSUFBSSxZQUFZLEVBQU87S0EyQjVEOzs7OztJQWxDRCxJQUFpQixFQUFFLENBQUMsS0FBVTtRQUMxQixJQUFJLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQztLQUNwQjs7OztJQUNELElBQUksRUFBRTtRQUNGLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQztLQUNuQjs7OztJQVVELElBQUksUUFBUTtRQUNSLHFCQUFJLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbEIsQ0FBQyxVQUFTLENBQUMsSUFBRSxJQUFHLDBUQUEwVCxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBRSx5a0RBQXlrRCxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQztZQUFFLEtBQUssR0FBRyxJQUFJLENBQUMsRUFBQyxFQUFFLFNBQVMsQ0FBQyxTQUFTLElBQUUsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzErRCxPQUFPLEtBQUssQ0FBQztLQUNoQjs7Ozs7SUFFRCxJQUFJLFVBQVU7UUFDVixxQkFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3RDLHFCQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7UUFFcEMsSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRTtZQUNoQixPQUFPLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsWUFBWSxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDO1NBQzdIO1FBQ0QsSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLENBQUMsRUFBRTtZQUNsQixPQUFPLFNBQVMsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFlBQVksSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUM7U0FDbkc7S0FDSjs7OztJQUtELFFBQVE7UUFDSixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUFDO1FBQ2pELElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUM7UUFFbkQsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBRXRCLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxHQUFHO1lBQ3ZCLE9BQU8sS0FBSyxDQUFDO1NBQ2hCLENBQUM7S0FDTDs7Ozs7SUFRRCxZQUFZLENBQUMsS0FBaUI7UUFDMUIsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7UUFFMUIsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ2pCLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO1NBQzVCO0tBQ0o7Ozs7O0lBR0QsV0FBVyxDQUFDLEtBQWlCO1FBQ3pCLElBQUksSUFBSSxDQUFDLFlBQVksRUFBQztZQUNsQixLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7WUFFdkIsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUM7Z0JBQ2hCLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQztnQkFDeEQsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDO2FBQzFEO1lBRUQsSUFBSSxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUM7WUFDekIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7Z0JBQ2IsSUFBSSxFQUFFLE9BQU87Z0JBQ2IsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO2dCQUNqQixLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUs7YUFDcEIsQ0FBQyxDQUFDO1lBRUgsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDN0YsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFFNUYsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQ3RCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUM1QjtLQUNKOzs7OztJQUdELFNBQVMsQ0FBQyxLQUFpQjtRQUN2QixJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztRQUMxQixJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztRQUMzQixJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztLQUN2Qjs7Ozs7SUFRRCxRQUFRLENBQUMsS0FBVztRQUNoQixJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDckIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0tBQ2xEOzs7OztJQUdELGlCQUFpQixDQUFDLEtBQVM7UUFDdkIsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7UUFFMUIsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUM7WUFDaEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQztZQUNuRSxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDO1lBRWxFLElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUM7WUFDekUsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQztTQUMzRTtRQUVELElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUMsSUFBSSxFQUFFLFlBQVksRUFBQyxDQUFDLENBQUM7S0FDMUM7Ozs7O0lBR0QsZ0JBQWdCLENBQUMsS0FBUztRQUN0QixxQkFBSSxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQzs7UUFHNUIsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxJQUFJLElBQUksQ0FBQyxTQUFTLElBQUksT0FBTyxFQUFDO1lBQ3ZELElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDM0I7O1FBR0QsSUFBSSxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLElBQUksSUFBSSxDQUFDLFNBQVMsSUFBSSxrQkFBa0IsSUFBSSxJQUFJLENBQUMsU0FBUyxJQUFJLGdCQUFnQixFQUFDO1lBQzlHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUNqQzs7UUFHRCxJQUFJLE9BQU8sQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsU0FBUyxJQUFJLE9BQU8sRUFBQztZQUNyRSxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzNCO0tBQ0o7Ozs7O0lBR0QsZUFBZSxDQUFDLEtBQVM7UUFDckIsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWCxJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztRQUMxQixxQkFBSSxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQztRQUU1QixJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFDO1lBQ2YsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7U0FDbEI7O1FBR0QsSUFBSSxJQUFJLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQyxTQUFTLEtBQUssT0FBTyxFQUFDO1lBQy9DLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1NBQ2xCO1FBRUQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBQyxJQUFJLEVBQUUsVUFBVSxFQUFDLENBQUMsQ0FBQzs7UUFHckMsSUFBSSxJQUFJLENBQUMsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUM7WUFDN0MsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN2QixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFDLElBQUksRUFBRSxZQUFZLEVBQUMsQ0FBQyxDQUFDO1lBQ3ZDLE9BQU87U0FDVjtRQUVELElBQUksSUFBSSxDQUFDLFNBQVMsS0FBSyxPQUFPLElBQUksSUFBSSxDQUFDLFNBQVMsS0FBSyxPQUFPLEVBQUM7WUFDekQsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1NBQ3JCO1FBRUQsSUFBSSxJQUFJLENBQUMsU0FBUyxLQUFLLE9BQU87WUFDMUIsSUFBSSxDQUFDLFNBQVMsS0FBSyxPQUFPO1lBQzFCLElBQUksQ0FBQyxTQUFTLEtBQUssa0JBQWtCO1lBQ3JDLElBQUksQ0FBQyxTQUFTLEtBQUssZ0JBQWdCLEVBQUM7WUFDcEMsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7U0FDOUI7UUFFRCxJQUFJLENBQUMsU0FBUyxHQUFHLFVBQVUsQ0FBQztRQUU1QixJQUFJLE9BQU8sSUFBSSxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBQztZQUMvQixJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztTQUN2QjtLQUNKOzs7OztJQU9ELFdBQVcsQ0FBQyxLQUFTO1FBQ2pCLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUV2QixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBQztZQUNoQixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDO1lBQ25FLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUM7U0FDckU7UUFFRCxJQUFJLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQztRQUN6QixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztZQUNiLElBQUksRUFBRSxPQUFPO1lBQ2IsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO1lBQ2pCLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztTQUNwQixDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDeEcsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRXZHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUM1Qjs7Ozs7SUFFRCxXQUFXLENBQUMsS0FBUztRQUNqQixLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7UUFFdkIscUJBQUksT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUM7UUFFNUIsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUM7WUFDaEIsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBRWpELElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEtBQUssS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQztZQUMxSixJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxLQUFLLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUM7U0FDM0o7UUFFRCxJQUFJLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQztRQUN6QixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFDLElBQUksRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDO1FBQ2xDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMxQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLElBQUksSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7UUFFeEUsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxlQUFlLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDeEcsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxlQUFlLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFeEcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQzVCOzs7OztJQUVELGlCQUFpQixDQUFDLEtBQVM7UUFDdkIsSUFBSSxJQUFJLENBQUMsbUJBQW1CLEVBQUM7WUFDekIsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO1NBQzFCO1FBRUQsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDO1FBRVQsSUFBSSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBQztZQUNYLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ25EO1FBRUQsSUFBSSxJQUFJLENBQUMsU0FBUyxJQUFJLGtCQUFrQixFQUFDO1lBQ3JDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN4RyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztTQUNsQjtRQUVELElBQUksSUFBSSxDQUFDLFNBQVMsSUFBSSxnQkFBZ0IsRUFBQztZQUNuQyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztZQUNmLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUMxRztRQUVELElBQUksSUFBSSxDQUFDLFNBQVMsRUFBQztZQUNmLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDO2dCQUNiLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUztnQkFDcEIsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO2dCQUNqQixLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUs7YUFDcEIsQ0FBQyxDQUFDO1lBQ0gsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQzVCO0tBQ0o7Ozs7O0lBR0QsV0FBVyxDQUFDLE9BQVc7UUFDbkIsT0FBTyxPQUFPLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7S0FDcEU7Ozs7O0lBRUQsaUJBQWlCLENBQUMsT0FBaUI7UUFDL0IsT0FBTyxPQUFPLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7S0FDdEU7Ozs7O0lBRUQsa0JBQWtCLENBQUMsS0FBUztRQUN4QixJQUFJLElBQUksQ0FBQyxTQUFTLElBQUksa0JBQWtCLElBQUksSUFBSSxDQUFDLFNBQVMsSUFBSSxnQkFBZ0IsRUFBQztZQUMzRSxxQkFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUNyRyxxQkFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUVwRyxJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsSUFBSSxTQUFTLEVBQUU7Z0JBQzdCLE9BQU8sSUFBSSxDQUFDLG1CQUFtQixHQUFHLGdCQUFnQixHQUFHLEVBQUUsQ0FBQzthQUMzRDtpQkFBTTtnQkFDSCxPQUFPLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxrQkFBa0IsR0FBRyxFQUFFLENBQUM7YUFDL0Q7U0FDSjthQUFNO1lBQ0gsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO1NBQ3pCO0tBQ0o7Ozs7O0lBRUQsV0FBVyxDQUFDLE9BQVk7UUFDcEIsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDMUg7Ozs7SUFFRCxjQUFjO1FBQ1YsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQztLQUNuRTs7OztJQUVELGFBQWE7UUFDVCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsb0JBQW9CLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDO0tBQ2xFOzs7O0lBRUQsY0FBYztRQUNWLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7UUFDcEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNuQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUcsUUFBUSxDQUFDO1FBQ3pDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLGNBQWMsR0FBRyxRQUFRLENBQUM7UUFDN0MsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQztRQUUzQyxJQUFJLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQztRQUMzQixJQUFJLENBQUMsWUFBWSxHQUFHLFFBQVEsQ0FBQztRQUM3QixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUM7UUFFdkMsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO0tBQ3hCOzs7O0lBRUQsYUFBYTtRQUNULHFCQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRTFELElBQUksVUFBVSxDQUFDLE1BQU0sRUFBQztZQUNsQixVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUM7WUFDdEMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDO1NBQzFDO0tBQ0o7Ozs7O0lBRUQsZ0JBQWdCLENBQUMsV0FBZ0IsRUFBRTtRQUMvQixJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUcsTUFBTSxHQUFFLFFBQVEsR0FBRSxJQUFJLENBQUM7UUFDdkQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLFNBQVMsR0FBRSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFFLEdBQUcsR0FBRSxDQUFDLEdBQUUsR0FBRyxHQUFFLENBQUMsR0FBRSxHQUFHLEdBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRSxHQUFHLEdBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRSxHQUFHLEdBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRSxHQUFHLENBQUM7S0FDaEs7Ozs7SUFFRCxrQkFBa0I7UUFDZCxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBQztZQUNoQixPQUFPLEtBQUssQ0FBQztTQUNoQjtRQUVELHFCQUFJLFdBQVcsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ3ZDLHFCQUFJLFNBQVMsR0FBRyxXQUFXLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUUzQyxZQUFZLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFFcEMsSUFBSSxTQUFTLEdBQUcsR0FBRyxJQUFJLFNBQVMsR0FBRyxDQUFDLEVBQUU7WUFDbEMsT0FBTyxJQUFJLENBQUM7U0FDZjthQUFNO1lBQ0gsSUFBSSxDQUFDLGdCQUFnQixHQUFHLFVBQVUsQ0FBQztnQkFDL0IsWUFBWSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO2FBQ3ZDLEVBQUUsR0FBRyxDQUFDLENBQUM7U0FDWDtRQUNELElBQUksQ0FBQyxPQUFPLEdBQUcsV0FBVyxDQUFDO0tBQzlCOzs7OztJQUVNLFVBQVUsQ0FBQyxRQUFZLEtBQUs7UUFDL0IsSUFBSSxJQUFJLENBQUMsWUFBWSxLQUFLLENBQUMsRUFBQztZQUV4QixJQUFJLEtBQUssSUFBSSxLQUFLLENBQUMsY0FBYyxFQUFDO2dCQUM5QixxQkFBSSxjQUFjLEdBQUcsS0FBSyxDQUFDLGNBQWMsQ0FBQztnQkFFMUMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQztnQkFDbkMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxJQUFJLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDekYsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxJQUFJLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUMzRjtpQkFBTTtnQkFDSCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDO2dCQUNuQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDO2dCQUM5RCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDO2FBQ2xFO1lBRUQsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQ3RCLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1lBQzNCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztZQUMvQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFDLElBQUksRUFBRSxTQUFTLEVBQUMsQ0FBQyxDQUFDO1NBQ3ZDO2FBQU07WUFDSCxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDbEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBQyxJQUFJLEVBQUUsVUFBVSxFQUFDLENBQUMsQ0FBQztTQUN4Qzs7Ozs7SUFHTCxVQUFVO1FBQ04sSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7UUFDZixJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztRQUNmLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ2YsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7UUFDM0IsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0tBQ2xEOzs7O0lBRUQsbUJBQW1CO1FBQ2YsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQy9CLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUMvQixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7S0FDbEM7Ozs7SUFFRCxjQUFjO1FBQ1YscUJBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsb0JBQW9CLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEQsdUJBQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDaEMsdUJBQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFFaEMsSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBQztZQUNmLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1NBQ2xCO1FBQ0QsSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBQztZQUNmLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1NBQ2xCO1FBRUQsSUFBSSxHQUFHLEVBQUM7WUFDSixJQUFJLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztZQUM5QixJQUFJLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztTQUNqQztRQUNELElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFDO1lBQ3RCLElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUMxRCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDNUQ7U0FDSjtRQUVELE9BQU8sWUFBWSxJQUFJLElBQUksQ0FBQyxLQUFLLElBQUksWUFBWSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUM7S0FDbkU7Ozs7SUFFTSxVQUFVO1FBQ2IscUJBQUksYUFBYSxHQUFHLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUUxQyxJQUFJLGFBQWEsRUFBQztZQUNkLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1lBQzNCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztTQUNsRDs7Ozs7SUFHTCxzQkFBc0I7UUFDbEIscUJBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUV0QyxJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsWUFBWSxFQUFDO1lBQ3pELElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQztTQUMvRjthQUFNO1lBQ0gscUJBQUksWUFBWSxHQUFHLENBQUMsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLElBQUksSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUM7WUFFOUUsSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLFlBQVksRUFBQztnQkFDMUIsSUFBSSxDQUFDLEtBQUssR0FBRyxZQUFZLENBQUM7YUFDN0I7aUJBQU0sSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxZQUFZLElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQUM7Z0JBQzVHLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRyxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLENBQUM7YUFDdEc7U0FDSjtLQUNKOzs7O0lBRUQsc0JBQXNCO1FBQ2xCLHFCQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7UUFFcEMsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsRUFBRTtZQUN4RCxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUM7U0FDN0Y7YUFBTTtZQUNILHFCQUFJLGFBQWEsR0FBRyxDQUFDLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDO1lBRTdFLElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxhQUFhLEVBQUM7Z0JBQzNCLElBQUksQ0FBQyxLQUFLLEdBQUcsYUFBYSxDQUFDO2FBQzlCO2lCQUFNLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFDO2dCQUMzRyxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUcsUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2FBQ3JHO1NBQ0o7S0FDSjs7OztJQUVELGtCQUFrQjtRQUNkLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMscUJBQXFCLEVBQUUsQ0FBQztLQUNoRjs7Ozs7O0lBRU0sUUFBUSxDQUFDLEtBQVksRUFBRSxxQkFBNEIsR0FBRztRQUN6RCxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsZ0JBQWdCLENBQUMsa0JBQWtCLENBQUMsQ0FBQzs7Ozs7OztJQUd2QyxRQUFRLENBQUMsS0FBWSxFQUFFLHFCQUE0QixHQUFHO1FBQ3pELElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDOzs7O1lBamdCakQsU0FBUyxTQUFDO2dCQUNQLFFBQVEsRUFBRSwwQkFBMEI7Z0JBQ3BDLFFBQVEsRUFBRTs7Ozs7Ozs7O09BU1A7Z0JBQ0gsTUFBTSxFQUFFLENBQUMsMnNGQUEyc0YsQ0FBQzthQUN4dEY7Ozs7WUFmZ0MsVUFBVTs7OzhCQStDdEMsS0FBSyxTQUFDLFFBQVE7aUNBQ2QsS0FBSyxTQUFDLHFCQUFxQjt3QkFDM0IsS0FBSyxTQUFDLFlBQVk7eUJBQ2xCLEtBQUssU0FBQyxhQUFhO29DQUNuQixLQUFLLFNBQUMseUJBQXlCO2tDQUMvQixLQUFLLFNBQUMsdUJBQXVCOzBCQUM3QixLQUFLLFNBQUMsZUFBZTtpQkFDckIsS0FBSyxTQUFDLElBQUk7cUJBT1YsTUFBTTswQkFFTixXQUFXLFNBQUMsZUFBZTsyQkFDM0IsV0FBVyxTQUFDLGdCQUFnQjt5QkFDNUIsV0FBVyxTQUFDLGNBQWM7NkJBRTFCLFNBQVMsU0FBQyxTQUFTOzJCQXVDbkIsWUFBWSxTQUFDLFdBQVcsRUFBRSxDQUFDLFFBQVEsQ0FBQzswQkFTcEMsWUFBWSxTQUFDLGtCQUFrQixFQUFFLENBQUMsUUFBUSxDQUFDO3dCQXlCM0MsWUFBWSxTQUFDLGdCQUFnQixFQUFFLENBQUMsUUFBUSxDQUFDO3VCQVl6QyxZQUFZLFNBQUMsZUFBZSxFQUFFLENBQUMsUUFBUSxDQUFDO2dDQU14QyxZQUFZLFNBQUMsWUFBWSxFQUFFLENBQUMsUUFBUSxDQUFDOytCQWVyQyxZQUFZLFNBQUMsV0FBVyxFQUFFLENBQUMsUUFBUSxDQUFDOzhCQW9CcEMsWUFBWSxTQUFDLFVBQVUsRUFBRSxDQUFDLFFBQVEsQ0FBQzs7Ozs7OztBQ2pNeEM7OztZQUlDLFFBQVEsU0FBQztnQkFDTixZQUFZLEVBQUU7b0JBQ1Ysa0JBQWtCO2lCQUNyQjtnQkFDRCxPQUFPLEVBQUU7b0JBQ0wsWUFBWTtpQkFDZjtnQkFDRCxPQUFPLEVBQUU7b0JBQ0wsa0JBQWtCO2lCQUNyQjtnQkFDRCxlQUFlLEVBQUU7b0JBQ2Isa0JBQWtCO2lCQUNyQjthQUNKOzs7Ozs7Ozs7Ozs7Ozs7In0=