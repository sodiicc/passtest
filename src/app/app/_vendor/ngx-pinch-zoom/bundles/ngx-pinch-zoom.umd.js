(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common')) :
    typeof define === 'function' && define.amd ? define('ngx-pinch-zoom', ['exports', '@angular/core', '@angular/common'], factory) :
    (factory((global['ngx-pinch-zoom'] = {}),global.ng.core,global.ng.common));
}(this, (function (exports,core,common) { 'use strict';

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    var PinchZoomComponent = (function () {
        function PinchZoomComponent(elementRef) {
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
            this.events = new core.EventEmitter();
        }
        Object.defineProperty(PinchZoomComponent.prototype, "id", {
            get: /**
             * @return {?}
             */ function () {
                return this._id;
            },
            set: /**
             * @param {?} value
             * @return {?}
             */ function (value) {
                this._id = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PinchZoomComponent.prototype, "isMobile", {
            get: /**
             * @return {?}
             */ function () {
                var /** @type {?} */ check = false;
                (function (a) {
                    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))
                        check = true;
                })(navigator.userAgent || navigator.vendor);
                return check;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PinchZoomComponent.prototype, "isDragging", {
            get: /**
             * @return {?}
             */ function () {
                var /** @type {?} */ imgHeight = this.getImageHeight();
                var /** @type {?} */ imgWidth = this.getImageWidth();
                if (this.scale > 1) {
                    return imgHeight * this.scale > this.parentElement.offsetHeight || imgWidth * this.scale > this.parentElement.offsetWidth;
                }
                if (this.scale === 1) {
                    return imgHeight > this.parentElement.offsetHeight || imgWidth > this.parentElement.offsetWidth;
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @return {?}
         */
        PinchZoomComponent.prototype.ngOnInit = /**
         * @return {?}
         */
            function () {
                this.element = this.contentElement.nativeElement;
                this.parentElement = this.elementRef.nativeElement;
                this.setBasicStyles();
                this.element.ondragstart = function () {
                    return false;
                };
            };
        /*
         * Desktop listeners
         */
        /**
         * @param {?} event
         * @return {?}
         */
        PinchZoomComponent.prototype.onMouseEnter = /**
         * @param {?} event
         * @return {?}
         */
            function (event) {
                this.getElementPosition();
                if (this.isDragging) {
                    this.draggingMode = true;
                }
            };
        /**
         * @param {?} event
         * @return {?}
         */
        PinchZoomComponent.prototype.onMouseMove = /**
         * @param {?} event
         * @return {?}
         */
            function (event) {
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
            };
        /**
         * @param {?} event
         * @return {?}
         */
        PinchZoomComponent.prototype.onMouseUp = /**
         * @param {?} event
         * @return {?}
         */
            function (event) {
                this.draggingMode = false;
                this.updateInitialValues();
                this.eventType = '';
            };
        /*
         * Mobile listeners
         */
        /**
         * @param {?} event
         * @return {?}
         */
        PinchZoomComponent.prototype.onResize = /**
         * @param {?} event
         * @return {?}
         */
            function (event) {
                this.setImageWidth();
                this.transformElement(this.transitionDuration);
            };
        /**
         * @param {?} event
         * @return {?}
         */
        PinchZoomComponent.prototype.touchstartHandler = /**
         * @param {?} event
         * @return {?}
         */
            function (event) {
                this.getElementPosition();
                if (!this.eventType) {
                    this.startX = event.touches[0].clientX - this.elementPosition.left;
                    this.startY = event.touches[0].clientY - this.elementPosition.top;
                    this.startClientX = event.touches[0].clientX - this.elementPosition.left;
                    this.startClientY = event.touches[0].clientY - this.elementPosition.top;
                }
                this.events.emit({ type: 'touchstart' });
            };
        /**
         * @param {?} event
         * @return {?}
         */
        PinchZoomComponent.prototype.touchmoveHandler = /**
         * @param {?} event
         * @return {?}
         */
            function (event) {
                var /** @type {?} */ touches = event.touches;
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
            };
        /**
         * @param {?} event
         * @return {?}
         */
        PinchZoomComponent.prototype.touchendHandler = /**
         * @param {?} event
         * @return {?}
         */
            function (event) {
                this.i = 0;
                this.draggingMode = false;
                var /** @type {?} */ touches = event.touches;
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
            };
        /*
         * Handlers
         */
        /**
         * @param {?} event
         * @return {?}
         */
        PinchZoomComponent.prototype.handleSwipe = /**
         * @param {?} event
         * @return {?}
         */
            function (event) {
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
            };
        /**
         * @param {?} event
         * @return {?}
         */
        PinchZoomComponent.prototype.handlePinch = /**
         * @param {?} event
         * @return {?}
         */
            function (event) {
                event.preventDefault();
                var /** @type {?} */ touches = event.touches;
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
            };
        /**
         * @param {?} event
         * @return {?}
         */
        PinchZoomComponent.prototype.handleLinearSwipe = /**
         * @param {?} event
         * @return {?}
         */
            function (event) {
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
            };
        /**
         * @param {?} touches
         * @return {?}
         */
        PinchZoomComponent.prototype.detectSwipe = /**
         * @param {?} touches
         * @return {?}
         */
            function (touches) {
                return touches.length === 1 && this.scale > 1 && !this.eventType;
            };
        /**
         * @param {?} touches
         * @return {?}
         */
        PinchZoomComponent.prototype.detectLinearSwipe = /**
         * @param {?} touches
         * @return {?}
         */
            function (touches) {
                return touches.length === 1 && this.scale === 1 && !this.eventType;
            };
        /**
         * @param {?} event
         * @return {?}
         */
        PinchZoomComponent.prototype.getLinearSwipeType = /**
         * @param {?} event
         * @return {?}
         */
            function (event) {
                if (this.eventType != 'horizontal-swipe' && this.eventType != 'vertical-swipe') {
                    var /** @type {?} */ movementX = Math.abs((event.touches[0].clientX - this.elementPosition.left) - this.startClientX);
                    var /** @type {?} */ movementY = Math.abs((event.touches[0].clientY - this.elementPosition.top) - this.startClientY);
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
            };
        /**
         * @param {?} touches
         * @return {?}
         */
        PinchZoomComponent.prototype.getDistance = /**
         * @param {?} touches
         * @return {?}
         */
            function (touches) {
                return Math.sqrt(Math.pow(touches[0].pageX - touches[1].pageX, 2) + Math.pow(touches[0].pageY - touches[1].pageY, 2));
            };
        /**
         * @return {?}
         */
        PinchZoomComponent.prototype.getImageHeight = /**
         * @return {?}
         */
            function () {
                return this.element.getElementsByTagName("img")[0].offsetHeight;
            };
        /**
         * @return {?}
         */
        PinchZoomComponent.prototype.getImageWidth = /**
         * @return {?}
         */
            function () {
                return this.element.getElementsByTagName("img")[0].offsetWidth;
            };
        /**
         * @return {?}
         */
        PinchZoomComponent.prototype.setBasicStyles = /**
         * @return {?}
         */
            function () {
                this.element.style.display = "flex";
                this.element.style.height = "100%";
                this.element.style.alignItems = "center";
                this.element.style.justifyContent = "center";
                this.element.style.transformOrigin = '0 0';
                this.hostDisplay = "block";
                this.hostOverflow = "hidden";
                this.hostHeight = this.containerHeight;
                this.setImageWidth();
            };
        /**
         * @return {?}
         */
        PinchZoomComponent.prototype.setImageWidth = /**
         * @return {?}
         */
            function () {
                var /** @type {?} */ imgElement = this.element.getElementsByTagName("img");
                if (imgElement.length) {
                    imgElement[0].style.maxWidth = '100%';
                    imgElement[0].style.maxHeight = '100%';
                }
            };
        /**
         * @param {?=} duration
         * @return {?}
         */
        PinchZoomComponent.prototype.transformElement = /**
         * @param {?=} duration
         * @return {?}
         */
            function (duration) {
                if (duration === void 0) {
                    duration = 50;
                }
                this.element.style.transition = 'all ' + duration + 'ms';
                this.element.style.transform = 'matrix(' + Number(this.scale) + ',' + 0 + ',' + 0 + ',' + Number(this.scale) + ',' + Number(this.moveX) + ',' + Number(this.moveY) + ')';
            };
        /**
         * @return {?}
         */
        PinchZoomComponent.prototype.doubleTapDetection = /**
         * @return {?}
         */
            function () {
                if (!this.doubleTap) {
                    return false;
                }
                var /** @type {?} */ currentTime = new Date().getTime();
                var /** @type {?} */ tapLength = currentTime - this.lastTap;
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
            };
        /**
         * @param {?=} event
         * @return {?}
         */
        PinchZoomComponent.prototype.toggleZoom = /**
         * @param {?=} event
         * @return {?}
         */
            function (event) {
                if (event === void 0) {
                    event = false;
                }
                if (this.initialScale === 1) {
                    if (event && event.changedTouches) {
                        var /** @type {?} */ changedTouches = event.changedTouches;
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
            };
        /**
         * @return {?}
         */
        PinchZoomComponent.prototype.resetScale = /**
         * @return {?}
         */
            function () {
                this.scale = 1;
                this.moveX = 0;
                this.moveY = 0;
                this.updateInitialValues();
                this.transformElement(this.transitionDuration);
            };
        /**
         * @return {?}
         */
        PinchZoomComponent.prototype.updateInitialValues = /**
         * @return {?}
         */
            function () {
                this.initialScale = this.scale;
                this.initialMoveX = this.moveX;
                this.initialMoveY = this.moveY;
            };
        /**
         * @return {?}
         */
        PinchZoomComponent.prototype.centeringImage = /**
         * @return {?}
         */
            function () {
                var /** @type {?} */ img = this.element.getElementsByTagName("img")[0];
                var /** @type {?} */ initialMoveX = this.moveX;
                var /** @type {?} */ initialMoveY = this.moveY;
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
            };
        /**
         * @return {?}
         */
        PinchZoomComponent.prototype.alignImage = /**
         * @return {?}
         */
            function () {
                var /** @type {?} */ isMoveChanged = this.centeringImage();
                if (isMoveChanged) {
                    this.updateInitialValues();
                    this.transformElement(this.transitionDuration);
                }
            };
        /**
         * @return {?}
         */
        PinchZoomComponent.prototype.transitionYRestriction = /**
         * @return {?}
         */
            function () {
                var /** @type {?} */ imgHeight = this.getImageHeight();
                if (imgHeight * this.scale < this.parentElement.offsetHeight) {
                    this.moveY = (this.parentElement.offsetHeight - this.element.offsetHeight * this.scale) / 2;
                }
                else {
                    var /** @type {?} */ imgOffsetTop = ((imgHeight - this.element.offsetHeight) * this.scale) / 2;
                    if (this.moveY > imgOffsetTop) {
                        this.moveY = imgOffsetTop;
                    }
                    else if ((imgHeight * this.scale + Math.abs(imgOffsetTop) - this.parentElement.offsetHeight) + this.moveY < 0) {
                        this.moveY = -(imgHeight * this.scale + Math.abs(imgOffsetTop) - this.parentElement.offsetHeight);
                    }
                }
            };
        /**
         * @return {?}
         */
        PinchZoomComponent.prototype.transitionXRestriction = /**
         * @return {?}
         */
            function () {
                var /** @type {?} */ imgWidth = this.getImageWidth();
                if (imgWidth * this.scale < this.parentElement.offsetWidth) {
                    this.moveX = (this.parentElement.offsetWidth - this.element.offsetWidth * this.scale) / 2;
                }
                else {
                    var /** @type {?} */ imgOffsetLeft = ((imgWidth - this.element.offsetWidth) * this.scale) / 2;
                    if (this.moveX > imgOffsetLeft) {
                        this.moveX = imgOffsetLeft;
                    }
                    else if ((imgWidth * this.scale + Math.abs(imgOffsetLeft) - this.parentElement.offsetWidth) + this.moveX < 0) {
                        this.moveX = -(imgWidth * this.scale + Math.abs(imgOffsetLeft) - this.parentElement.offsetWidth);
                    }
                }
            };
        /**
         * @return {?}
         */
        PinchZoomComponent.prototype.getElementPosition = /**
         * @return {?}
         */
            function () {
                this.elementPosition = this.elementRef.nativeElement.getBoundingClientRect();
            };
        /**
         * @param {?} value
         * @param {?=} transitionDuration
         * @return {?}
         */
        PinchZoomComponent.prototype.setMoveX = /**
         * @param {?} value
         * @param {?=} transitionDuration
         * @return {?}
         */
            function (value, transitionDuration) {
                if (transitionDuration === void 0) {
                    transitionDuration = 200;
                }
                this.moveX = value;
                this.transformElement(transitionDuration);
            };
        /**
         * @param {?} value
         * @param {?=} transitionDuration
         * @return {?}
         */
        PinchZoomComponent.prototype.setMoveY = /**
         * @param {?} value
         * @param {?=} transitionDuration
         * @return {?}
         */
            function (value, transitionDuration) {
                if (transitionDuration === void 0) {
                    transitionDuration = 200;
                }
                this.moveY = value;
                this.transformElement(transitionDuration);
            };
        PinchZoomComponent.decorators = [
            { type: core.Component, args: [{
                        selector: 'pinch-zoom, [pinch-zoom]',
                        template: "<div #content \n\t[class.pz-dragging]=\"isDragging\">\n\t<ng-content></ng-content>\n</div>\n\n<div class=\"pz-zoom-button\"\n\t*ngIf=\"zoomButton && !isMobile\"\n\t(click)=\"toggleZoom()\"\n\t[class.pz-zoom-out]=\"scale > 1\">\n</div>",
                        styles: [":host{position:relative}.pz-dragging{cursor:all-scroll}.pz-zoom-button{position:absolute;left:50%;bottom:16px;margin-left:-22px;z-index:1000;color:#fff;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAQAAABLCVATAAABVUlEQVR4Ae3PAwxQXRgA0Pvbto1sW2NDts0x27atIdeQrakpY8i23cnGe5nn8epDeO1h+VgeVdRVRJLwsCQ101nX2aWJd8OD8a7Ozrkda6UJ8XnPUsBZy43S2Wz7rs8UDnEZCZjn5+tzb6jqCDgucYhDakAnb4Rb+MdmMCPEYSqYfH2cXfPr/ymcBalDFF84izN+uD7TnHCdXqB7iCI/WByuuy1QbrAiRFEL9L3WlObmc/l7uUHfgn0hivqg47VaXMfluQ/A6RBFeTDmnq39D7aEKNKBXfcMVBVMCtFsB0XvFshbVoBSIZqGYL8/wh10B/u8F6L52E6wU7ZwEx/oC6gV4pHVOXDeIPn95WOZ1bYRsD7EJ79D7m4nmO7dEI+fTHC7o7p6h+uh4pJJB0vscMwKQ+X13uXZ6RGh4vKeeQ8c6nWoJiFadCjRFUXzntbeDc/GaxcAotf7cicflKkAAAAASUVORK5CYII=),url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAQAAABLCVATAAABS0lEQVR4Ae3UA8xWfQCG8afPNrNt240N2TbHbNu2hlxDtqamjCHbdr/s5905b9Z1fN/bdfyPfOZl8ZMSGmipggwvL8loqZsAOKaDb2Ir+UZ/t7zITjlio/nWRsBNm03T33KnHiflw4umAlaJ/ziLo6EL4LL04TTZAf3Eea5JYT9YEk60EMyP2mVxE2QP1vzuJm74P4Z+GBgcLCoN1sfYFwdbgkXNwMj7+4V1fnq6n/0DTgWLWoO+9/c7AwD3s+/B9WBRbTAjxj41OBAsygWOxdg3BPMiwTgMKkbtvrQFVAsjagtOSxKlGwxO+Tbc0HEUHFXomfx7IwHNIuFQ0C1w2zilJfOT/JrbC9gdCY/SzonOUbA49Mgknjme56KBvuaxKizy6WODIy7ZYqKSDx6xxUGq8MPeqlirPqs6RKljqwq6ovCq7r6JvBs+cwdLiOaEU9ek1AAAAABJRU5ErkJggg==),url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAQAAABLCVATAAABVUlEQVR4Ae3PAwxQXRgA0Pvbto1sW2NDts0x27atIdeQrakpY8i23cnGe5nn8epDeO1h+VgeVdRVRJLwsCQ101nX2aWJd8OD8a7Ozrkda6UJ8XnPUsBZy43S2Wz7rs8UDnEZCZjn5+tzb6jqCDgucYhDakAnb4Rb+MdmMCPEYSqYfH2cXfPr/ymcBalDFF84izN+uD7TnHCdXqB7iCI/WByuuy1QbrAiRFEL9L3WlObmc/l7uUHfgn0hivqg47VaXMfluQ/A6RBFeTDmnq39D7aEKNKBXfcMVBVMCtFsB0XvFshbVoBSIZqGYL8/wh10B/u8F6L52E6wU7ZwEx/oC6gV4pHVOXDeIPn95WOZ1bYRsD7EJ79D7m4nmO7dEI+fTHC7o7p6h+uh4pJJB0vscMwKQ+X13uXZ6RGh4vKeeQ8c6nWoJiFadCjRFUXzntbeDc/GaxcAotf7cicflKkAAAAASUVORK5CYII=),url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAQAAABLCVATAAABS0lEQVR4Ae3UA8xWfQCG8afPNrNt240N2TbHbNu2hlxDtqamjCHbdr/s5905b9Z1fN/bdfyPfOZl8ZMSGmipggwvL8loqZsAOKaDb2Ir+UZ/t7zITjlio/nWRsBNm03T33KnHiflw4umAlaJ/ziLo6EL4LL04TTZAf3Eea5JYT9YEk60EMyP2mVxE2QP1vzuJm74P4Z+GBgcLCoN1sfYFwdbgkXNwMj7+4V1fnq6n/0DTgWLWoO+9/c7AwD3s+/B9WBRbTAjxj41OBAsygWOxdg3BPMiwTgMKkbtvrQFVAsjagtOSxKlGwxO+Tbc0HEUHFXomfx7IwHNIuFQ0C1w2zilJfOT/JrbC9gdCY/SzonOUbA49Mgknjme56KBvuaxKizy6WODIy7ZYqKSDx6xxUGq8MPeqlirPqs6RKljqwq6ovCq7r6JvBs+cwdLiOaEU9ek1AAAAABJRU5ErkJggg==);background-color:rgba(0,0,0,.8);background-position:center,-1000px;background-repeat:no-repeat,no-repeat;width:56px;height:56px;border-radius:4px;opacity:.5;cursor:pointer;transition:opacity .1s;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.pz-zoom-button.pz-zoom-out{background-position:-1000px,center}.pz-zoom-button:hover{opacity:.7}"]
                    },] },
        ];
        /** @nocollapse */
        PinchZoomComponent.ctorParameters = function () {
            return [
                { type: core.ElementRef }
            ];
        };
        PinchZoomComponent.propDecorators = {
            containerHeight: [{ type: core.Input, args: ['height',] }],
            transitionDuration: [{ type: core.Input, args: ['transition-duration',] }],
            doubleTap: [{ type: core.Input, args: ['double-tap',] }],
            zoomButton: [{ type: core.Input, args: ['zoom-button',] }],
            linearHorizontalSwipe: [{ type: core.Input, args: ['linear-horizontal-swipe',] }],
            linearVerticalSwipe: [{ type: core.Input, args: ['linear-vertical-swipe',] }],
            autoZoomOut: [{ type: core.Input, args: ['auto-zoom-out',] }],
            id: [{ type: core.Input, args: ['id',] }],
            events: [{ type: core.Output }],
            hostDisplay: [{ type: core.HostBinding, args: ['style.display',] }],
            hostOverflow: [{ type: core.HostBinding, args: ['style.overflow',] }],
            hostHeight: [{ type: core.HostBinding, args: ['style.height',] }],
            contentElement: [{ type: core.ViewChild, args: ['content',] }],
            onMouseEnter: [{ type: core.HostListener, args: ["mousedown", ['$event'],] }],
            onMouseMove: [{ type: core.HostListener, args: ["window:mousemove", ['$event'],] }],
            onMouseUp: [{ type: core.HostListener, args: ["window:mouseup", ['$event'],] }],
            onResize: [{ type: core.HostListener, args: ['window:resize', ['$event'],] }],
            touchstartHandler: [{ type: core.HostListener, args: ['touchstart', ['$event'],] }],
            touchmoveHandler: [{ type: core.HostListener, args: ['touchmove', ['$event'],] }],
            touchendHandler: [{ type: core.HostListener, args: ['touchend', ['$event'],] }]
        };
        return PinchZoomComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */
    var PinchZoomModule = (function () {
        function PinchZoomModule() {
        }
        PinchZoomModule.decorators = [
            { type: core.NgModule, args: [{
                        declarations: [
                            PinchZoomComponent
                        ],
                        imports: [
                            common.CommonModule
                        ],
                        exports: [
                            PinchZoomComponent
                        ],
                        entryComponents: [
                            PinchZoomComponent
                        ]
                    },] },
        ];
        return PinchZoomModule;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes} checked by tsc
     */

    exports.PinchZoomComponent = PinchZoomComponent;
    exports.PinchZoomModule = PinchZoomModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXBpbmNoLXpvb20udW1kLmpzLm1hcCIsInNvdXJjZXMiOlsibmc6Ly9uZ3gtcGluY2gtem9vbS9saWIvcGluY2gtem9vbS5jb21wb25lbnQudHMiLCJuZzovL25neC1waW5jaC16b29tL2xpYi9waW5jaC16b29tLm1vZHVsZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIEhvc3RCaW5kaW5nLCBFbGVtZW50UmVmLCBIb3N0TGlzdGVuZXIsIE9uSW5pdCwgVmlld0NoaWxkLCBJbnB1dCwgRXZlbnRFbWl0dGVyLCBPdXRwdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdwaW5jaC16b29tLCBbcGluY2gtem9vbV0nLFxuICAgIHRlbXBsYXRlOiBgPGRpdiAjY29udGVudCBcblx0W2NsYXNzLnB6LWRyYWdnaW5nXT1cImlzRHJhZ2dpbmdcIj5cblx0PG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuPC9kaXY+XG5cbjxkaXYgY2xhc3M9XCJwei16b29tLWJ1dHRvblwiXG5cdCpuZ0lmPVwiem9vbUJ1dHRvbiAmJiAhaXNNb2JpbGVcIlxuXHQoY2xpY2spPVwidG9nZ2xlWm9vbSgpXCJcblx0W2NsYXNzLnB6LXpvb20tb3V0XT1cInNjYWxlID4gMVwiPlxuPC9kaXY+YCxcbiAgICBzdHlsZXM6IFtgOmhvc3R7cG9zaXRpb246cmVsYXRpdmV9LnB6LWRyYWdnaW5ne2N1cnNvcjphbGwtc2Nyb2xsfS5wei16b29tLWJ1dHRvbntwb3NpdGlvbjphYnNvbHV0ZTtsZWZ0OjUwJTtib3R0b206MTZweDttYXJnaW4tbGVmdDotMjJweDt6LWluZGV4OjEwMDA7Y29sb3I6I2ZmZjtiYWNrZ3JvdW5kLWltYWdlOnVybChkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUNRQUFBQWtDQVFBQUFCTENWQVRBQUFCVlVsRVFWUjRBZTNQQXd4UVhSZ0EwUHZidG8xc1cyTkR0czB4MjdhdElkZVFyYWtwWThpMjNjbkdlNW5uOGVwRGVPMWgrVmdlVmRSVlJKTHdzQ1ExMDFuWDJhV0pkOE9EOGE3T3pya2RhNlVKOFhuUFVzQlp5NDNTMld6N3JzOFVEbkVaQ1pqbjUrdHpiNmpxQ0RndWNZaERha0FuYjRSYitNZG1NQ1BFWVNxWWZIMmNYZlByL3ltY0JhbERGRjg0aXpOK3VEN1RuSENkWHFCN2lDSS9XQnl1dXkxUWJyQWlSRkVMOUwzV2xPYm1jL2w3dVVIZmduMGhpdnFnNDdWYVhNZmx1US9BNlJCRmVURG1ucTM5RDdhRUtOS0JYZmNNVkJWTUN0RnNCMFh2RnNoYlZvQlNJWnFHWUw4L3doMTBCL3U4RjZMNTJFNndVN1p3RXgvb0M2Z1Y0cEhWT1hEZUlQbjk1V09aMWJZUnNEN0VKNzlEN200bm1PN2RFSStmVEhDN283cDZoK3VoNHBKSkIwdnNjTXdLUStYMTN1WFo2UkdoNHZLZWVROGM2bldvSmlGYWRDalJGVVh6bnRiZURjL0dheGNBb3RmN2NpY2ZsS2tBQUFBQVNVVk9SSzVDWUlJPSksdXJsKGRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQ1FBQUFBa0NBUUFBQUJMQ1ZBVEFBQUJTMGxFUVZSNEFlM1VBOHhXZlFDRzhhZlBOck50MjQwTjJUYkhiTnUyaGx4RHRxYW1qQ0hiZHIvczU5MDViOVoxZk4vYmRmeVBmT1psOFpNU0dtaXBnZ3d2TDhsb3Fac0FPS2FEYjJJcitVWi90N3pJVGpsaW8vbldSc0JObTAzVDMzS25IaWZsdzR1bUFsYUovemlMbzZFTDRMTDA0VFRaQWYzRWVhNUpZVDlZRWs2MEVNeVAybVZ4RTJRUDF2enVKbTc0UDRaK0dCZ2NMQ29OMXNmWUZ3ZGJna1hOd01qNys0VjFmbnE2bi8wRFRnV0xXb08rOS9jN0F3RDNzKy9COVdCUmJUQWp4ajQxT0JBc3lnV094ZGczQlBNaXdUZ01La2J0dnJRRlZBc2phZ3RPU3hLbEd3eE8rVGJjMEhFVUhGWG9tZng3SXdITkl1RlEwQzF3MnppbEpmT1QvSnJiQzlnZENZL1N6b25PVWJBNDlNZ2tuam1lNTZLQnZ1YXhLaXp5NldPREl5N1pZcUtTRHg2eHhVR3E4TVBlcWxpclBxczZSS2xqcXdxNm92Q3E3cjZKdkJzK2N3ZExpT2FFVTllazFBQUFBQUJKUlU1RXJrSmdnZz09KSx1cmwoZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFDUUFBQUFrQ0FRQUFBQkxDVkFUQUFBQlZVbEVRVlI0QWUzUEF3eFFYUmdBMFB2YnRvMXNXMk5EdHMweDI3YXRJZGVRcmFrcFk4aTIzY25HZTVubjhlcERlTzFoK1ZnZVZkUlZSSkx3c0NRMTAxblgyYVdKZDhPRDhhN096cmtkYTZVSjhYblBVc0JaeTQzUzJXejdyczhVRG5FWkNaam41K3R6YjZqcUNEZ3VjWWhEYWtBbmI0UmIrTWRtTUNQRVlTcVlmSDJjWGZQci95bWNCYWxERkY4NGl6Tit1RDdUbkhDZFhxQjdpQ0kvV0J5dXV5MVFickFpUkZFTDlMM1dsT2JtYy9sN3VVSGZnbjBoaXZxZzQ3VmFYTWZsdVEvQTZSQkZlVERtbnEzOUQ3YUVLTktCWGZjTVZCVk1DdEZzQjBYdkZzaGJWb0JTSVpxR1lMOC93aDEwQi91OEY2TDUyRTZ3VTdad0V4L29DNmdWNHBIVk9YRGVJUG45NVdPWjFiWVJzRDdFSjc5RDdtNG5tTzdkRUkrZlRIQzdvN3A2aCt1aDRwSkpCMHZzY013S1ErWDEzdVhaNlJHaDR2S2VlUThjNm5Xb0ppRmFkQ2pSRlVYem50YmVEYy9HYXhjQW90ZjdjaWNmbEtrQUFBQUFTVVZPUks1Q1lJST0pLHVybChkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUNRQUFBQWtDQVFBQUFCTENWQVRBQUFCUzBsRVFWUjRBZTNVQTh4V2ZRQ0c4YWZQTnJOdDI0ME4yVGJIYk51MmhseER0cWFtakNIYmRyL3M1OTA1YjlaMWZOL2JkZnlQZk9abDhaTVNHbWlwZ2d3dkw4bG9xWnNBT0thRGIySXIrVVovdDd6SVRqbGlvL25XUnNCTm0wM1QzM0tuSGlmbHc0dW1BbGFKL3ppTG82RUw0TEwwNFRUWkFmM0VlYTVKWVQ5WUVrNjBFTXlQMm1WeEUyUVAxdnp1Sm03NFA0WitHQmdjTENvTjFzZllGd2RiZ2tYTndNajcrNFYxZm5xNm4vMERUZ1dMV29PKzkvYzdBd0QzcysvQjlXQlJiVEFqeGo0MU9CQXN5Z1dPeGRnM0JQTWl3VGdNS2tidHZyUUZWQXNqYWd0T1N4S2xHd3hPK1RiYzBIRVVIRlhvbWZ4N0l3SE5JdUZRMEMxdzJ6aWxKZk9UL0pyYkM5Z2RDWS9Tem9uT1ViQTQ5TWdrbmptZTU2S0J2dWF4S2l6eTZXT0RJeTdaWXFLU0R4Nnh4VUdxOE1QZXFsaXJQcXM2UktsanF3cTZvdkNxN3I2SnZCcytjd2RMaU9hRVU5ZWsxQUFBQUFCSlJVNUVya0pnZ2c9PSk7YmFja2dyb3VuZC1jb2xvcjpyZ2JhKDAsMCwwLC44KTtiYWNrZ3JvdW5kLXBvc2l0aW9uOmNlbnRlciwtMTAwMHB4O2JhY2tncm91bmQtcmVwZWF0Om5vLXJlcGVhdCxuby1yZXBlYXQ7d2lkdGg6NTZweDtoZWlnaHQ6NTZweDtib3JkZXItcmFkaXVzOjRweDtvcGFjaXR5Oi41O2N1cnNvcjpwb2ludGVyO3RyYW5zaXRpb246b3BhY2l0eSAuMXM7LXdlYmtpdC11c2VyLXNlbGVjdDpub25lOy1tb3otdXNlci1zZWxlY3Q6bm9uZTstbXMtdXNlci1zZWxlY3Q6bm9uZTt1c2VyLXNlbGVjdDpub25lfS5wei16b29tLWJ1dHRvbi5wei16b29tLW91dHtiYWNrZ3JvdW5kLXBvc2l0aW9uOi0xMDAwcHgsY2VudGVyfS5wei16b29tLWJ1dHRvbjpob3ZlcntvcGFjaXR5Oi43fWBdXG59KVxuXG5leHBvcnQgY2xhc3MgUGluY2hab29tQ29tcG9uZW50IHtcblxuICAgIGk6IG51bWJlciA9IDA7XG4gICAgX2lkOiBhbnk7XG4gICAgZWxlbWVudDogYW55O1xuICAgIGVsZW1lbnRQb3NpdGlvbjogYW55O1xuICAgIHBhcmVudEVsZW1lbnQ6IGFueTtcbiAgICBldmVudFR5cGU6IGFueTtcblxuICAgIHNjYWxlOiBudW1iZXIgPSAxO1xuICAgIGluaXRpYWxTY2FsZTogbnVtYmVyID0gMTtcblxuICAgIHN0YXJ0WDogbnVtYmVyO1xuICAgIHN0YXJ0WTogbnVtYmVyO1xuICAgIHN0YXJ0Q2xpZW50WDogbnVtYmVyO1xuICAgIHN0YXJ0Q2xpZW50WTogbnVtYmVyO1xuXG4gICAgbW92ZVg6IGFueSA9IDA7XG4gICAgbW92ZVk6IGFueSA9IDA7XG4gICAgaW5pdGlhbE1vdmVYOiBhbnkgPSAwO1xuICAgIGluaXRpYWxNb3ZlWTogYW55ID0gMDtcbiAgICBtb3ZlWEM6IG51bWJlcjtcbiAgICBtb3ZlWUM6IG51bWJlcjtcblxuICAgIGRpc3RhbmNlOiBudW1iZXI7XG4gICAgaW5pdGlhbERpc3RhbmNlOiBudW1iZXI7XG4gICAgZHJhZ2dpbmdNb2RlOiBib29sZWFuID0gZmFsc2U7XG4gICAgZG91YmxlVGFwVGltZW91dDogYW55O1xuICAgIGxhc3RUYXA6IG51bWJlciA9IDA7XG5cbiAgICBASW5wdXQoJ2hlaWdodCcpIGNvbnRhaW5lckhlaWdodDogc3RyaW5nO1xuICAgIEBJbnB1dCgndHJhbnNpdGlvbi1kdXJhdGlvbicpIHRyYW5zaXRpb25EdXJhdGlvbjogbnVtYmVyID0gMjAwO1xuICAgIEBJbnB1dCgnZG91YmxlLXRhcCcpIGRvdWJsZVRhcDogYm9vbGVhbiA9IHRydWU7XG4gICAgQElucHV0KCd6b29tLWJ1dHRvbicpIHpvb21CdXR0b246IGJvb2xlYW4gPSB0cnVlO1xuICAgIEBJbnB1dCgnbGluZWFyLWhvcml6b250YWwtc3dpcGUnKSBsaW5lYXJIb3Jpem9udGFsU3dpcGU6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBASW5wdXQoJ2xpbmVhci12ZXJ0aWNhbC1zd2lwZScpIGxpbmVhclZlcnRpY2FsU3dpcGU6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBASW5wdXQoJ2F1dG8tem9vbS1vdXQnKSBhdXRvWm9vbU91dDogYm9vbGVhbiA9IGZhbHNlO1xuICAgIEBJbnB1dCgnaWQnKSBzZXQgaWQodmFsdWU6IGFueSkge1xuICAgICAgICB0aGlzLl9pZCA9IHZhbHVlO1xuICAgIH1cbiAgICBnZXQgaWQoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lkO1xuICAgIH1cbiAgICBcbiAgICBAT3V0cHV0KCkgZXZlbnRzOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuXG4gICAgQEhvc3RCaW5kaW5nKCdzdHlsZS5kaXNwbGF5JykgaG9zdERpc3BsYXk6c3RyaW5nO1xuICAgIEBIb3N0QmluZGluZygnc3R5bGUub3ZlcmZsb3cnKSBob3N0T3ZlcmZsb3c6c3RyaW5nO1xuICAgIEBIb3N0QmluZGluZygnc3R5bGUuaGVpZ2h0JykgaG9zdEhlaWdodDpzdHJpbmc7XG5cbiAgICBAVmlld0NoaWxkKCdjb250ZW50JykgY29udGVudEVsZW1lbnQ6IEVsZW1lbnRSZWY7XG5cbiAgICBnZXQgaXNNb2JpbGUoKSB7XG4gICAgICAgIHZhciBjaGVjayA9IGZhbHNlO1xuICAgICAgICAoZnVuY3Rpb24oYSl7aWYoLyhhbmRyb2lkfGJiXFxkK3xtZWVnbykuK21vYmlsZXxhdmFudGdvfGJhZGFcXC98YmxhY2tiZXJyeXxibGF6ZXJ8Y29tcGFsfGVsYWluZXxmZW5uZWN8aGlwdG9wfGllbW9iaWxlfGlwKGhvbmV8b2QpfGlyaXN8a2luZGxlfGxnZSB8bWFlbW98bWlkcHxtbXB8bW9iaWxlLitmaXJlZm94fG5ldGZyb250fG9wZXJhIG0ob2J8aW4paXxwYWxtKCBvcyk/fHBob25lfHAoaXhpfHJlKVxcL3xwbHVja2VyfHBvY2tldHxwc3B8c2VyaWVzKDR8NikwfHN5bWJpYW58dHJlb3x1cFxcLihicm93c2VyfGxpbmspfHZvZGFmb25lfHdhcHx3aW5kb3dzIGNlfHhkYXx4aWluby9pLnRlc3QoYSl8fC8xMjA3fDYzMTB8NjU5MHwzZ3NvfDR0aHB8NTBbMS02XWl8Nzcwc3w4MDJzfGEgd2F8YWJhY3xhYyhlcnxvb3xzXFwtKXxhaShrb3xybil8YWwoYXZ8Y2F8Y28pfGFtb2l8YW4oZXh8bnl8eXcpfGFwdHV8YXIoY2h8Z28pfGFzKHRlfHVzKXxhdHR3fGF1KGRpfFxcLW18ciB8cyApfGF2YW58YmUoY2t8bGx8bnEpfGJpKGxifHJkKXxibChhY3xheil8YnIoZXx2KXd8YnVtYnxid1xcLShufHUpfGM1NVxcL3xjYXBpfGNjd2F8Y2RtXFwtfGNlbGx8Y2h0bXxjbGRjfGNtZFxcLXxjbyhtcHxuZCl8Y3Jhd3xkYShpdHxsbHxuZyl8ZGJ0ZXxkY1xcLXN8ZGV2aXxkaWNhfGRtb2J8ZG8oY3xwKW98ZHMoMTJ8XFwtZCl8ZWwoNDl8YWkpfGVtKGwyfHVsKXxlcihpY3xrMCl8ZXNsOHxleihbNC03XTB8b3N8d2F8emUpfGZldGN8Zmx5KFxcLXxfKXxnMSB1fGc1NjB8Z2VuZXxnZlxcLTV8Z1xcLW1vfGdvKFxcLnd8b2QpfGdyKGFkfHVuKXxoYWllfGhjaXR8aGRcXC0obXxwfHQpfGhlaVxcLXxoaShwdHx0YSl8aHAoIGl8aXApfGhzXFwtY3xodChjKFxcLXwgfF98YXxnfHB8c3x0KXx0cCl8aHUoYXd8dGMpfGlcXC0oMjB8Z298bWEpfGkyMzB8aWFjKCB8XFwtfFxcLyl8aWJyb3xpZGVhfGlnMDF8aWtvbXxpbTFrfGlubm98aXBhcXxpcmlzfGphKHR8dilhfGpicm98amVtdXxqaWdzfGtkZGl8a2VqaXxrZ3QoIHxcXC8pfGtsb258a3B0IHxrd2NcXC18a3lvKGN8ayl8bGUobm98eGkpfGxnKCBnfFxcLyhrfGx8dSl8NTB8NTR8XFwtW2Etd10pfGxpYnd8bHlueHxtMVxcLXd8bTNnYXxtNTBcXC98bWEodGV8dWl8eG8pfG1jKDAxfDIxfGNhKXxtXFwtY3J8bWUocmN8cmkpfG1pKG84fG9hfHRzKXxtbWVmfG1vKDAxfDAyfGJpfGRlfGRvfHQoXFwtfCB8b3x2KXx6eil8bXQoNTB8cDF8diApfG13YnB8bXl3YXxuMTBbMC0yXXxuMjBbMi0zXXxuMzAoMHwyKXxuNTAoMHwyfDUpfG43KDAoMHwxKXwxMCl8bmUoKGN8bSlcXC18b258dGZ8d2Z8d2d8d3QpfG5vayg2fGkpfG56cGh8bzJpbXxvcCh0aXx3dil8b3Jhbnxvd2cxfHA4MDB8cGFuKGF8ZHx0KXxwZHhnfHBnKDEzfFxcLShbMS04XXxjKSl8cGhpbHxwaXJlfHBsKGF5fHVjKXxwblxcLTJ8cG8oY2t8cnR8c2UpfHByb3h8cHNpb3xwdFxcLWd8cWFcXC1hfHFjKDA3fDEyfDIxfDMyfDYwfFxcLVsyLTddfGlcXC0pfHF0ZWt8cjM4MHxyNjAwfHJha3N8cmltOXxybyh2ZXx6byl8czU1XFwvfHNhKGdlfG1hfG1tfG1zfG55fHZhKXxzYygwMXxoXFwtfG9vfHBcXC0pfHNka1xcL3xzZShjKFxcLXwwfDEpfDQ3fG1jfG5kfHJpKXxzZ2hcXC18c2hhcnxzaWUoXFwtfG0pfHNrXFwtMHxzbCg0NXxpZCl8c20oYWx8YXJ8YjN8aXR8dDUpfHNvKGZ0fG55KXxzcCgwMXxoXFwtfHZcXC18diApfHN5KDAxfG1iKXx0MigxOHw1MCl8dDYoMDB8MTB8MTgpfHRhKGd0fGxrKXx0Y2xcXC18dGRnXFwtfHRlbChpfG0pfHRpbVxcLXx0XFwtbW98dG8ocGx8c2gpfHRzKDcwfG1cXC18bTN8bTUpfHR4XFwtOXx1cChcXC5ifGcxfHNpKXx1dHN0fHY0MDB8djc1MHx2ZXJpfHZpKHJnfHRlKXx2ayg0MHw1WzAtM118XFwtdil8dm00MHx2b2RhfHZ1bGN8dngoNTJ8NTN8NjB8NjF8NzB8ODB8ODF8ODN8ODV8OTgpfHczYyhcXC18ICl8d2ViY3x3aGl0fHdpKGcgfG5jfG53KXx3bWxifHdvbnV8eDcwMHx5YXNcXC18eW91cnx6ZXRvfHp0ZVxcLS9pLnRlc3QoYS5zdWJzdHIoMCw0KSkpIGNoZWNrID0gdHJ1ZTt9KShuYXZpZ2F0b3IudXNlckFnZW50fHxuYXZpZ2F0b3IudmVuZG9yKTtcbiAgICAgICAgcmV0dXJuIGNoZWNrO1xuICAgIH07XG5cbiAgICBnZXQgaXNEcmFnZ2luZygpe1xuICAgICAgICBsZXQgaW1nSGVpZ2h0ID0gdGhpcy5nZXRJbWFnZUhlaWdodCgpO1xuICAgICAgICBsZXQgaW1nV2lkdGggPSB0aGlzLmdldEltYWdlV2lkdGgoKTtcblxuICAgICAgICBpZiAodGhpcy5zY2FsZSA+IDEpIHtcbiAgICAgICAgICAgIHJldHVybiBpbWdIZWlnaHQgKiB0aGlzLnNjYWxlID4gdGhpcy5wYXJlbnRFbGVtZW50Lm9mZnNldEhlaWdodCB8fCBpbWdXaWR0aCAqIHRoaXMuc2NhbGUgPiB0aGlzLnBhcmVudEVsZW1lbnQub2Zmc2V0V2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuc2NhbGUgPT09IDEpIHtcbiAgICAgICAgICAgIHJldHVybiBpbWdIZWlnaHQgPiB0aGlzLnBhcmVudEVsZW1lbnQub2Zmc2V0SGVpZ2h0IHx8IGltZ1dpZHRoID4gdGhpcy5wYXJlbnRFbGVtZW50Lm9mZnNldFdpZHRoO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBlbGVtZW50UmVmOiBFbGVtZW50UmVmKXtcbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gdGhpcy5jb250ZW50RWxlbWVudC5uYXRpdmVFbGVtZW50O1xuICAgICAgICB0aGlzLnBhcmVudEVsZW1lbnQgPSB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcblxuICAgICAgICB0aGlzLnNldEJhc2ljU3R5bGVzKCk7XG5cbiAgICAgICAgdGhpcy5lbGVtZW50Lm9uZHJhZ3N0YXJ0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH07XG4gICAgfVxuXG5cbiAgICAvKlxuICAgICAqIERlc2t0b3AgbGlzdGVuZXJzXG4gICAgICovXG5cbiAgICBASG9zdExpc3RlbmVyKFwibW91c2Vkb3duXCIsIFsnJGV2ZW50J10pXG4gICAgb25Nb3VzZUVudGVyKGV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgICAgIHRoaXMuZ2V0RWxlbWVudFBvc2l0aW9uKCk7XG5cbiAgICAgICAgaWYgKHRoaXMuaXNEcmFnZ2luZykge1xuICAgICAgICAgICAgdGhpcy5kcmFnZ2luZ01vZGUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgQEhvc3RMaXN0ZW5lcihcIndpbmRvdzptb3VzZW1vdmVcIiwgWyckZXZlbnQnXSlcbiAgICBvbk1vdXNlTW92ZShldmVudDogTW91c2VFdmVudCkge1xuICAgICAgICBpZiAodGhpcy5kcmFnZ2luZ01vZGUpe1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgaWYgKCF0aGlzLmV2ZW50VHlwZSl7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGFydFggPSBldmVudC5jbGllbnRYIC0gdGhpcy5lbGVtZW50UG9zaXRpb24ubGVmdDtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0WSA9IGV2ZW50LmNsaWVudFkgLSB0aGlzLmVsZW1lbnRQb3NpdGlvbi50b3A7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuZXZlbnRUeXBlID0gJ3N3aXBlJztcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzLmVtaXQoe1xuICAgICAgICAgICAgICAgIHR5cGU6ICdzd2lwZScsXG4gICAgICAgICAgICAgICAgbW92ZVg6IHRoaXMubW92ZVgsXG4gICAgICAgICAgICAgICAgbW92ZVk6IHRoaXMubW92ZVlcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLm1vdmVYID0gdGhpcy5pbml0aWFsTW92ZVggKyAoKGV2ZW50LmNsaWVudFggLSB0aGlzLmVsZW1lbnRQb3NpdGlvbi5sZWZ0KSAtIHRoaXMuc3RhcnRYKTtcbiAgICAgICAgICAgIHRoaXMubW92ZVkgPSB0aGlzLmluaXRpYWxNb3ZlWSArICgoZXZlbnQuY2xpZW50WSAtIHRoaXMuZWxlbWVudFBvc2l0aW9uLnRvcCkgLSB0aGlzLnN0YXJ0WSk7XG5cbiAgICAgICAgICAgIHRoaXMuY2VudGVyaW5nSW1hZ2UoKTtcbiAgICAgICAgICAgIHRoaXMudHJhbnNmb3JtRWxlbWVudCgwKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIEBIb3N0TGlzdGVuZXIoXCJ3aW5kb3c6bW91c2V1cFwiLCBbJyRldmVudCddKVxuICAgIG9uTW91c2VVcChldmVudDogTW91c2VFdmVudCkge1xuICAgICAgICB0aGlzLmRyYWdnaW5nTW9kZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLnVwZGF0ZUluaXRpYWxWYWx1ZXMoKTtcbiAgICAgICAgdGhpcy5ldmVudFR5cGUgPSAnJztcbiAgICB9XG5cblxuICAgIC8qXG4gICAgICogTW9iaWxlIGxpc3RlbmVyc1xuICAgICAqL1xuXG4gICAgQEhvc3RMaXN0ZW5lcignd2luZG93OnJlc2l6ZScsIFsnJGV2ZW50J10pXG4gICAgb25SZXNpemUoZXZlbnQ6RXZlbnQpIHtcbiAgICAgICAgdGhpcy5zZXRJbWFnZVdpZHRoKCk7XG4gICAgICAgIHRoaXMudHJhbnNmb3JtRWxlbWVudCh0aGlzLnRyYW5zaXRpb25EdXJhdGlvbik7IFxuICAgIH1cblxuICAgIEBIb3N0TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBbJyRldmVudCddKVxuICAgIHRvdWNoc3RhcnRIYW5kbGVyKGV2ZW50OmFueSkge1xuICAgICAgICB0aGlzLmdldEVsZW1lbnRQb3NpdGlvbigpO1xuXG4gICAgICAgIGlmICghdGhpcy5ldmVudFR5cGUpe1xuICAgICAgICAgICAgdGhpcy5zdGFydFggPSBldmVudC50b3VjaGVzWzBdLmNsaWVudFggLSB0aGlzLmVsZW1lbnRQb3NpdGlvbi5sZWZ0O1xuICAgICAgICAgICAgdGhpcy5zdGFydFkgPSBldmVudC50b3VjaGVzWzBdLmNsaWVudFkgLSB0aGlzLmVsZW1lbnRQb3NpdGlvbi50b3A7XG5cbiAgICAgICAgICAgIHRoaXMuc3RhcnRDbGllbnRYID0gZXZlbnQudG91Y2hlc1swXS5jbGllbnRYIC0gdGhpcy5lbGVtZW50UG9zaXRpb24ubGVmdDtcbiAgICAgICAgICAgIHRoaXMuc3RhcnRDbGllbnRZID0gZXZlbnQudG91Y2hlc1swXS5jbGllbnRZIC0gdGhpcy5lbGVtZW50UG9zaXRpb24udG9wO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5ldmVudHMuZW1pdCh7dHlwZTogJ3RvdWNoc3RhcnQnfSk7XG4gICAgfVxuXG4gICAgQEhvc3RMaXN0ZW5lcigndG91Y2htb3ZlJywgWyckZXZlbnQnXSlcbiAgICB0b3VjaG1vdmVIYW5kbGVyKGV2ZW50OmFueSkge1xuICAgICAgICBsZXQgdG91Y2hlcyA9IGV2ZW50LnRvdWNoZXM7XG5cbiAgICAgICAgLy8gU3dpcGVcbiAgICAgICAgaWYgKHRoaXMuZGV0ZWN0U3dpcGUodG91Y2hlcykgfHwgdGhpcy5ldmVudFR5cGUgPT0gJ3N3aXBlJyl7XG4gICAgICAgICAgICB0aGlzLmhhbmRsZVN3aXBlKGV2ZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIExpbmVhciBzd2lwZVxuICAgICAgICBpZiAodGhpcy5kZXRlY3RMaW5lYXJTd2lwZSh0b3VjaGVzKSB8fCB0aGlzLmV2ZW50VHlwZSA9PSAnaG9yaXpvbnRhbC1zd2lwZScgfHwgdGhpcy5ldmVudFR5cGUgPT0gJ3ZlcnRpY2FsLXN3aXBlJyl7ICAgXG4gICAgICAgICAgICB0aGlzLmhhbmRsZUxpbmVhclN3aXBlKGV2ZW50KTsgXG4gICAgICAgIH1cblxuICAgICAgICAvLyBQaW5jaFxuICAgICAgICBpZiAodG91Y2hlcy5sZW5ndGggPT09IDIgJiYgIXRoaXMuZXZlbnRUeXBlIHx8IHRoaXMuZXZlbnRUeXBlID09ICdwaW5jaCcpe1xuICAgICAgICAgICAgdGhpcy5oYW5kbGVQaW5jaChldmVudCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBASG9zdExpc3RlbmVyKCd0b3VjaGVuZCcsIFsnJGV2ZW50J10pXG4gICAgdG91Y2hlbmRIYW5kbGVyKGV2ZW50OmFueSkge1xuICAgICAgICB0aGlzLmkgPSAwO1xuICAgICAgICB0aGlzLmRyYWdnaW5nTW9kZSA9IGZhbHNlO1xuICAgICAgICBsZXQgdG91Y2hlcyA9IGV2ZW50LnRvdWNoZXM7XG5cbiAgICAgICAgaWYgKHRoaXMuc2NhbGUgPCAxKXtcbiAgICAgICAgICAgIHRoaXMuc2NhbGUgPSAxO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQXV0byBab29tIE91dFxuICAgICAgICBpZiAodGhpcy5hdXRvWm9vbU91dCAmJiB0aGlzLmV2ZW50VHlwZSA9PT0gJ3BpbmNoJyl7XG4gICAgICAgICAgICB0aGlzLnNjYWxlID0gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZXZlbnRzLmVtaXQoe3R5cGU6ICd0b3VjaGVuZCd9KTtcblxuICAgICAgICAvLyBEb3VibGUgVGFwXG4gICAgICAgIGlmICh0aGlzLmRvdWJsZVRhcERldGVjdGlvbigpICYmICF0aGlzLmV2ZW50VHlwZSl7XG4gICAgICAgICAgICB0aGlzLnRvZ2dsZVpvb20oZXZlbnQpO1xuICAgICAgICAgICAgdGhpcy5ldmVudHMuZW1pdCh7dHlwZTogJ2RvdWJsZS10YXAnfSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5ldmVudFR5cGUgPT09ICdwaW5jaCcgfHwgdGhpcy5ldmVudFR5cGUgPT09ICdzd2lwZScpe1xuICAgICAgICAgICAgdGhpcy5hbGlnbkltYWdlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5ldmVudFR5cGUgPT09ICdwaW5jaCcgfHwgXG4gICAgICAgICAgICB0aGlzLmV2ZW50VHlwZSA9PT0gJ3N3aXBlJyB8fFxuICAgICAgICAgICAgdGhpcy5ldmVudFR5cGUgPT09ICdob3Jpem9udGFsLXN3aXBlJyB8fFxuICAgICAgICAgICAgdGhpcy5ldmVudFR5cGUgPT09ICd2ZXJ0aWNhbC1zd2lwZScpe1xuICAgICAgICAgICAgdGhpcy51cGRhdGVJbml0aWFsVmFsdWVzKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmV2ZW50VHlwZSA9ICd0b3VjaGVuZCc7XG5cbiAgICAgICAgaWYgKHRvdWNoZXMgJiYgdG91Y2hlcy5sZW5ndGggPT0gMCl7XG4gICAgICAgICAgICB0aGlzLmV2ZW50VHlwZSA9ICcnO1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICAvKlxuICAgICAqIEhhbmRsZXJzXG4gICAgICovXG5cbiAgICBoYW5kbGVTd2lwZShldmVudDphbnkpe1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIGlmICghdGhpcy5ldmVudFR5cGUpe1xuICAgICAgICAgICAgdGhpcy5zdGFydFggPSBldmVudC50b3VjaGVzWzBdLmNsaWVudFggLSB0aGlzLmVsZW1lbnRQb3NpdGlvbi5sZWZ0O1xuICAgICAgICAgICAgdGhpcy5zdGFydFkgPSBldmVudC50b3VjaGVzWzBdLmNsaWVudFkgLSB0aGlzLmVsZW1lbnRQb3NpdGlvbi50b3A7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmV2ZW50VHlwZSA9ICdzd2lwZSc7XG4gICAgICAgIHRoaXMuZXZlbnRzLmVtaXQoe1xuICAgICAgICAgICAgdHlwZTogJ3N3aXBlJyxcbiAgICAgICAgICAgIG1vdmVYOiB0aGlzLm1vdmVYLFxuICAgICAgICAgICAgbW92ZVk6IHRoaXMubW92ZVlcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5tb3ZlWCA9IHRoaXMuaW5pdGlhbE1vdmVYICsgKChldmVudC50b3VjaGVzWzBdLmNsaWVudFggLSB0aGlzLmVsZW1lbnRQb3NpdGlvbi5sZWZ0KSAtIHRoaXMuc3RhcnRYKTtcbiAgICAgICAgdGhpcy5tb3ZlWSA9IHRoaXMuaW5pdGlhbE1vdmVZICsgKChldmVudC50b3VjaGVzWzBdLmNsaWVudFkgLSB0aGlzLmVsZW1lbnRQb3NpdGlvbi50b3ApIC0gdGhpcy5zdGFydFkpO1xuXG4gICAgICAgIHRoaXMudHJhbnNmb3JtRWxlbWVudCgwKTtcbiAgICB9XG5cbiAgICBoYW5kbGVQaW5jaChldmVudDphbnkpe1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIGxldCB0b3VjaGVzID0gZXZlbnQudG91Y2hlcztcblxuICAgICAgICBpZiAoIXRoaXMuZXZlbnRUeXBlKXtcbiAgICAgICAgICAgIHRoaXMuaW5pdGlhbERpc3RhbmNlID0gdGhpcy5nZXREaXN0YW5jZSh0b3VjaGVzKTtcblxuICAgICAgICAgICAgdGhpcy5tb3ZlWEMgPSAoKChldmVudC50b3VjaGVzWzBdLmNsaWVudFggLSB0aGlzLmVsZW1lbnRQb3NpdGlvbi5sZWZ0KSArIChldmVudC50b3VjaGVzWzFdLmNsaWVudFggLSB0aGlzLmVsZW1lbnRQb3NpdGlvbi5sZWZ0KSkgLyAyKSAtIHRoaXMuaW5pdGlhbE1vdmVYO1xuICAgICAgICAgICAgdGhpcy5tb3ZlWUMgPSAoKChldmVudC50b3VjaGVzWzBdLmNsaWVudFkgLSB0aGlzLmVsZW1lbnRQb3NpdGlvbi50b3ApICsgKGV2ZW50LnRvdWNoZXNbMV0uY2xpZW50WSAtIHRoaXMuZWxlbWVudFBvc2l0aW9uLnRvcCkpIC8gMikgLSB0aGlzLmluaXRpYWxNb3ZlWTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZXZlbnRUeXBlID0gJ3BpbmNoJztcbiAgICAgICAgdGhpcy5ldmVudHMuZW1pdCh7dHlwZTogJ3BpbmNoJ30pO1xuICAgICAgICB0aGlzLmRpc3RhbmNlID0gdGhpcy5nZXREaXN0YW5jZSh0b3VjaGVzKTtcbiAgICAgICAgdGhpcy5zY2FsZSA9IHRoaXMuaW5pdGlhbFNjYWxlICogKHRoaXMuZGlzdGFuY2UgLyB0aGlzLmluaXRpYWxEaXN0YW5jZSk7XG5cbiAgICAgICAgdGhpcy5tb3ZlWCA9IHRoaXMuaW5pdGlhbE1vdmVYIC0gKCgodGhpcy5kaXN0YW5jZSAvIHRoaXMuaW5pdGlhbERpc3RhbmNlKSAqIHRoaXMubW92ZVhDKSAtIHRoaXMubW92ZVhDKTtcbiAgICAgICAgdGhpcy5tb3ZlWSA9IHRoaXMuaW5pdGlhbE1vdmVZIC0gKCgodGhpcy5kaXN0YW5jZSAvIHRoaXMuaW5pdGlhbERpc3RhbmNlKSAqIHRoaXMubW92ZVlDKSAtIHRoaXMubW92ZVlDKTtcblxuICAgICAgICB0aGlzLnRyYW5zZm9ybUVsZW1lbnQoMCk7XG4gICAgfVxuXG4gICAgaGFuZGxlTGluZWFyU3dpcGUoZXZlbnQ6YW55KXtcbiAgICAgICAgaWYgKHRoaXMubGluZWFyVmVydGljYWxTd2lwZSl7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB0aGlzLmkrKztcblxuICAgICAgICBpZiAodGhpcy5pID4gMyl7XG4gICAgICAgICAgICB0aGlzLmV2ZW50VHlwZSA9IHRoaXMuZ2V0TGluZWFyU3dpcGVUeXBlKGV2ZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmV2ZW50VHlwZSA9PSAnaG9yaXpvbnRhbC1zd2lwZScpe1xuICAgICAgICAgICAgdGhpcy5tb3ZlWCA9IHRoaXMuaW5pdGlhbE1vdmVYICsgKChldmVudC50b3VjaGVzWzBdLmNsaWVudFggLSB0aGlzLmVsZW1lbnRQb3NpdGlvbi5sZWZ0KSAtIHRoaXMuc3RhcnRYKTtcbiAgICAgICAgICAgIHRoaXMubW92ZVkgPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZXZlbnRUeXBlID09ICd2ZXJ0aWNhbC1zd2lwZScpe1xuICAgICAgICAgICAgdGhpcy5tb3ZlWCA9IDA7XG4gICAgICAgICAgICB0aGlzLm1vdmVZID0gdGhpcy5pbml0aWFsTW92ZVkgKyAoKGV2ZW50LnRvdWNoZXNbMF0uY2xpZW50WSAtIHRoaXMuZWxlbWVudFBvc2l0aW9uLnRvcCkgLSB0aGlzLnN0YXJ0WSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5ldmVudFR5cGUpe1xuICAgICAgICAgICAgdGhpcy5ldmVudHMuZW1pdCh7XG4gICAgICAgICAgICAgICAgdHlwZTogdGhpcy5ldmVudFR5cGUsXG4gICAgICAgICAgICAgICAgbW92ZVg6IHRoaXMubW92ZVgsXG4gICAgICAgICAgICAgICAgbW92ZVk6IHRoaXMubW92ZVlcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy50cmFuc2Zvcm1FbGVtZW50KDApO1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICBkZXRlY3RTd2lwZSh0b3VjaGVzOmFueSl7XG4gICAgICAgIHJldHVybiB0b3VjaGVzLmxlbmd0aCA9PT0gMSAmJiB0aGlzLnNjYWxlID4gMSAmJiAhdGhpcy5ldmVudFR5cGU7XG4gICAgfVxuXG4gICAgZGV0ZWN0TGluZWFyU3dpcGUodG91Y2hlczpUb3VjaExpc3Qpe1xuICAgICAgICByZXR1cm4gdG91Y2hlcy5sZW5ndGggPT09IDEgJiYgdGhpcy5zY2FsZSA9PT0gMSAmJiAhdGhpcy5ldmVudFR5cGU7XG4gICAgfVxuXG4gICAgZ2V0TGluZWFyU3dpcGVUeXBlKGV2ZW50OmFueSk6c3RyaW5nIHtcbiAgICAgICAgaWYgKHRoaXMuZXZlbnRUeXBlICE9ICdob3Jpem9udGFsLXN3aXBlJyAmJiB0aGlzLmV2ZW50VHlwZSAhPSAndmVydGljYWwtc3dpcGUnKXtcbiAgICAgICAgICAgIGxldCBtb3ZlbWVudFggPSBNYXRoLmFicygoZXZlbnQudG91Y2hlc1swXS5jbGllbnRYIC0gdGhpcy5lbGVtZW50UG9zaXRpb24ubGVmdCkgLSB0aGlzLnN0YXJ0Q2xpZW50WCk7IFxuICAgICAgICAgICAgbGV0IG1vdmVtZW50WSA9IE1hdGguYWJzKChldmVudC50b3VjaGVzWzBdLmNsaWVudFkgLSB0aGlzLmVsZW1lbnRQb3NpdGlvbi50b3ApIC0gdGhpcy5zdGFydENsaWVudFkpO1xuXG4gICAgICAgICAgICBpZiAoKG1vdmVtZW50WSAqIDMpID4gbW92ZW1lbnRYKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubGluZWFyVmVydGljYWxTd2lwZSA/ICd2ZXJ0aWNhbC1zd2lwZScgOiAnJztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubGluZWFySG9yaXpvbnRhbFN3aXBlID8gJ2hvcml6b250YWwtc3dpcGUnIDogJyc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5ldmVudFR5cGU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXREaXN0YW5jZSh0b3VjaGVzOiBhbnkpe1xuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KCBNYXRoLnBvdyh0b3VjaGVzWzBdLnBhZ2VYIC0gdG91Y2hlc1sxXS5wYWdlWCwgMikgKyBNYXRoLnBvdyh0b3VjaGVzWzBdLnBhZ2VZIC0gdG91Y2hlc1sxXS5wYWdlWSwgMikpO1xuICAgIH1cblxuICAgIGdldEltYWdlSGVpZ2h0KCl7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJpbWdcIilbMF0ub2Zmc2V0SGVpZ2h0O1xuICAgIH1cblxuICAgIGdldEltYWdlV2lkdGgoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImltZ1wiKVswXS5vZmZzZXRXaWR0aDtcbiAgICB9XG5cbiAgICBzZXRCYXNpY1N0eWxlcygpOnZvaWQge1xuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuZGlzcGxheSA9IFwiZmxleFwiO1xuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gXCIxMDAlXCI7XG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5hbGlnbkl0ZW1zID0gXCJjZW50ZXJcIjtcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmp1c3RpZnlDb250ZW50ID0gXCJjZW50ZXJcIjtcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnRyYW5zZm9ybU9yaWdpbiA9ICcwIDAnO1xuXG4gICAgICAgIHRoaXMuaG9zdERpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgICAgIHRoaXMuaG9zdE92ZXJmbG93ID0gXCJoaWRkZW5cIjtcbiAgICAgICAgdGhpcy5ob3N0SGVpZ2h0ID0gdGhpcy5jb250YWluZXJIZWlnaHQ7XG5cbiAgICAgICAgdGhpcy5zZXRJbWFnZVdpZHRoKCk7XG4gICAgfVxuXG4gICAgc2V0SW1hZ2VXaWR0aCgpOnZvaWQge1xuICAgICAgICBsZXQgaW1nRWxlbWVudCA9IHRoaXMuZWxlbWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImltZ1wiKTtcblxuICAgICAgICBpZiAoaW1nRWxlbWVudC5sZW5ndGgpe1xuICAgICAgICAgICAgaW1nRWxlbWVudFswXS5zdHlsZS5tYXhXaWR0aCA9ICcxMDAlJztcbiAgICAgICAgICAgIGltZ0VsZW1lbnRbMF0uc3R5bGUubWF4SGVpZ2h0ID0gJzEwMCUnO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdHJhbnNmb3JtRWxlbWVudChkdXJhdGlvbjogYW55ID0gNTApe1xuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudHJhbnNpdGlvbiA9ICdhbGwgJysgZHVyYXRpb24gKydtcyc7XG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS50cmFuc2Zvcm0gPSAnbWF0cml4KCcrIE51bWJlcih0aGlzLnNjYWxlKSArJywnKyAwICsnLCcrIDAgKycsJysgTnVtYmVyKHRoaXMuc2NhbGUpICsnLCcrIE51bWJlcih0aGlzLm1vdmVYKSArJywnKyBOdW1iZXIodGhpcy5tb3ZlWSkgKycpJztcbiAgICB9XG5cbiAgICBkb3VibGVUYXBEZXRlY3Rpb24oKTpib29sZWFuIHtcbiAgICAgICAgaWYgKCF0aGlzLmRvdWJsZVRhcCl7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgY3VycmVudFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgbGV0IHRhcExlbmd0aCA9IGN1cnJlbnRUaW1lIC0gdGhpcy5sYXN0VGFwO1xuICAgICAgICBcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuZG91YmxlVGFwVGltZW91dCk7XG5cbiAgICAgICAgaWYgKHRhcExlbmd0aCA8IDMwMCAmJiB0YXBMZW5ndGggPiAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZG91YmxlVGFwVGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuZG91YmxlVGFwVGltZW91dCk7XG4gICAgICAgICAgICB9LCAzMDApO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubGFzdFRhcCA9IGN1cnJlbnRUaW1lO1xuICAgIH1cblxuICAgIHB1YmxpYyB0b2dnbGVab29tKGV2ZW50OmFueSA9IGZhbHNlKTp2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuaW5pdGlhbFNjYWxlID09PSAxKXtcblxuICAgICAgICAgICAgaWYgKGV2ZW50ICYmIGV2ZW50LmNoYW5nZWRUb3VjaGVzKXtcbiAgICAgICAgICAgICAgICBsZXQgY2hhbmdlZFRvdWNoZXMgPSBldmVudC5jaGFuZ2VkVG91Y2hlcztcblxuICAgICAgICAgICAgICAgIHRoaXMuc2NhbGUgPSB0aGlzLmluaXRpYWxTY2FsZSAqIDI7XG4gICAgICAgICAgICAgICAgdGhpcy5tb3ZlWCA9IHRoaXMuaW5pdGlhbE1vdmVYIC0gKGNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFggLSB0aGlzLmVsZW1lbnRQb3NpdGlvbi5sZWZ0KTtcbiAgICAgICAgICAgICAgICB0aGlzLm1vdmVZID0gdGhpcy5pbml0aWFsTW92ZVkgLSAoY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WSAtIHRoaXMuZWxlbWVudFBvc2l0aW9uLnRvcCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuc2NhbGUgPSB0aGlzLmluaXRpYWxTY2FsZSAqIDI7XG4gICAgICAgICAgICAgICAgdGhpcy5tb3ZlWCA9IHRoaXMuaW5pdGlhbE1vdmVYIC0gdGhpcy5lbGVtZW50Lm9mZnNldFdpZHRoIC8gMjtcbiAgICAgICAgICAgICAgICB0aGlzLm1vdmVZID0gdGhpcy5pbml0aWFsTW92ZVkgLSB0aGlzLmVsZW1lbnQub2Zmc2V0SGVpZ2h0IC8gMjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5jZW50ZXJpbmdJbWFnZSgpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVJbml0aWFsVmFsdWVzKCk7XG4gICAgICAgICAgICB0aGlzLnRyYW5zZm9ybUVsZW1lbnQodGhpcy50cmFuc2l0aW9uRHVyYXRpb24pO1xuICAgICAgICAgICAgdGhpcy5ldmVudHMuZW1pdCh7dHlwZTogJ3pvb20taW4nfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnJlc2V0U2NhbGUoKTtcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzLmVtaXQoe3R5cGU6ICd6b29tLW91dCd9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlc2V0U2NhbGUoKTp2b2lkIHtcbiAgICAgICAgdGhpcy5zY2FsZSA9IDE7XG4gICAgICAgIHRoaXMubW92ZVggPSAwO1xuICAgICAgICB0aGlzLm1vdmVZID0gMDtcbiAgICAgICAgdGhpcy51cGRhdGVJbml0aWFsVmFsdWVzKCk7XG4gICAgICAgIHRoaXMudHJhbnNmb3JtRWxlbWVudCh0aGlzLnRyYW5zaXRpb25EdXJhdGlvbik7XG4gICAgfVxuXG4gICAgdXBkYXRlSW5pdGlhbFZhbHVlcygpOnZvaWQge1xuICAgICAgICB0aGlzLmluaXRpYWxTY2FsZSA9IHRoaXMuc2NhbGU7XG4gICAgICAgIHRoaXMuaW5pdGlhbE1vdmVYID0gdGhpcy5tb3ZlWDtcbiAgICAgICAgdGhpcy5pbml0aWFsTW92ZVkgPSB0aGlzLm1vdmVZO1xuICAgIH1cblxuICAgIGNlbnRlcmluZ0ltYWdlKCk6Ym9vbGVhbiB7XG4gICAgICAgIGxldCBpbWcgPSB0aGlzLmVsZW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJpbWdcIilbMF07XG4gICAgICAgIGNvbnN0IGluaXRpYWxNb3ZlWCA9IHRoaXMubW92ZVg7XG4gICAgICAgIGNvbnN0IGluaXRpYWxNb3ZlWSA9IHRoaXMubW92ZVk7XG5cbiAgICAgICAgaWYgKHRoaXMubW92ZVkgPiAwKXtcbiAgICAgICAgICAgIHRoaXMubW92ZVkgPSAwO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLm1vdmVYID4gMCl7XG4gICAgICAgICAgICB0aGlzLm1vdmVYID0gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpbWcpe1xuICAgICAgICAgICAgdGhpcy50cmFuc2l0aW9uWVJlc3RyaWN0aW9uKCk7XG4gICAgICAgICAgICB0aGlzLnRyYW5zaXRpb25YUmVzdHJpY3Rpb24oKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaW1nICYmIHRoaXMuc2NhbGUgPCAxKXtcbiAgICAgICAgICAgIGlmICh0aGlzLm1vdmVYIDwgdGhpcy5lbGVtZW50Lm9mZnNldFdpZHRoICogKDEgLSB0aGlzLnNjYWxlKSkge1xuICAgICAgICAgICAgICAgIHRoaXMubW92ZVggPSB0aGlzLmVsZW1lbnQub2Zmc2V0V2lkdGggKiAoMSAtIHRoaXMuc2NhbGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGluaXRpYWxNb3ZlWCAhPSB0aGlzLm1vdmVYIHx8IGluaXRpYWxNb3ZlWSAhPSB0aGlzLm1vdmVZO1xuICAgIH1cblxuICAgIHB1YmxpYyBhbGlnbkltYWdlKCk6dm9pZCB7XG4gICAgICAgIGxldCBpc01vdmVDaGFuZ2VkID0gdGhpcy5jZW50ZXJpbmdJbWFnZSgpO1xuXG4gICAgICAgIGlmIChpc01vdmVDaGFuZ2VkKXtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlSW5pdGlhbFZhbHVlcygpO1xuICAgICAgICAgICAgdGhpcy50cmFuc2Zvcm1FbGVtZW50KHRoaXMudHJhbnNpdGlvbkR1cmF0aW9uKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRyYW5zaXRpb25ZUmVzdHJpY3Rpb24oKTp2b2lkIHtcbiAgICAgICAgbGV0IGltZ0hlaWdodCA9IHRoaXMuZ2V0SW1hZ2VIZWlnaHQoKTtcblxuICAgICAgICBpZiAoaW1nSGVpZ2h0ICogdGhpcy5zY2FsZSA8IHRoaXMucGFyZW50RWxlbWVudC5vZmZzZXRIZWlnaHQpe1xuICAgICAgICAgICAgdGhpcy5tb3ZlWSA9ICh0aGlzLnBhcmVudEVsZW1lbnQub2Zmc2V0SGVpZ2h0IC0gdGhpcy5lbGVtZW50Lm9mZnNldEhlaWdodCAqIHRoaXMuc2NhbGUpIC8gMjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBpbWdPZmZzZXRUb3AgPSAoKGltZ0hlaWdodCAtIHRoaXMuZWxlbWVudC5vZmZzZXRIZWlnaHQpICogdGhpcy5zY2FsZSkgLyAyO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5tb3ZlWSA+IGltZ09mZnNldFRvcCl7XG4gICAgICAgICAgICAgICAgdGhpcy5tb3ZlWSA9IGltZ09mZnNldFRvcDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoKGltZ0hlaWdodCAqIHRoaXMuc2NhbGUgKyBNYXRoLmFicyhpbWdPZmZzZXRUb3ApIC0gdGhpcy5wYXJlbnRFbGVtZW50Lm9mZnNldEhlaWdodCkgKyB0aGlzLm1vdmVZIDwgMCl7XG4gICAgICAgICAgICAgICAgdGhpcy5tb3ZlWSA9IC0gKGltZ0hlaWdodCAqIHRoaXMuc2NhbGUgKyBNYXRoLmFicyhpbWdPZmZzZXRUb3ApIC0gdGhpcy5wYXJlbnRFbGVtZW50Lm9mZnNldEhlaWdodCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0cmFuc2l0aW9uWFJlc3RyaWN0aW9uKCk6dm9pZCB7XG4gICAgICAgIGxldCBpbWdXaWR0aCA9IHRoaXMuZ2V0SW1hZ2VXaWR0aCgpO1xuXG4gICAgICAgIGlmIChpbWdXaWR0aCAqIHRoaXMuc2NhbGUgPCB0aGlzLnBhcmVudEVsZW1lbnQub2Zmc2V0V2lkdGgpIHtcbiAgICAgICAgICAgIHRoaXMubW92ZVggPSAodGhpcy5wYXJlbnRFbGVtZW50Lm9mZnNldFdpZHRoIC0gdGhpcy5lbGVtZW50Lm9mZnNldFdpZHRoICogdGhpcy5zY2FsZSkgLyAyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IGltZ09mZnNldExlZnQgPSAoKGltZ1dpZHRoIC0gdGhpcy5lbGVtZW50Lm9mZnNldFdpZHRoKSAqIHRoaXMuc2NhbGUpIC8gMjtcblxuICAgICAgICAgICAgaWYgKHRoaXMubW92ZVggPiBpbWdPZmZzZXRMZWZ0KXtcbiAgICAgICAgICAgICAgICB0aGlzLm1vdmVYID0gaW1nT2Zmc2V0TGVmdDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoKGltZ1dpZHRoICogdGhpcy5zY2FsZSArIE1hdGguYWJzKGltZ09mZnNldExlZnQpIC0gdGhpcy5wYXJlbnRFbGVtZW50Lm9mZnNldFdpZHRoKSArIHRoaXMubW92ZVggPCAwKXtcbiAgICAgICAgICAgICAgICB0aGlzLm1vdmVYID0gLSAoaW1nV2lkdGggKiB0aGlzLnNjYWxlICsgTWF0aC5hYnMoaW1nT2Zmc2V0TGVmdCkgLSB0aGlzLnBhcmVudEVsZW1lbnQub2Zmc2V0V2lkdGgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0RWxlbWVudFBvc2l0aW9uKCk6dm9pZCB7XG4gICAgICAgIHRoaXMuZWxlbWVudFBvc2l0aW9uID0gdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgfVxuXG4gICAgcHVibGljIHNldE1vdmVYKHZhbHVlOm51bWJlciwgdHJhbnNpdGlvbkR1cmF0aW9uOm51bWJlciA9IDIwMCl7XG4gICAgICAgIHRoaXMubW92ZVggPSB2YWx1ZTtcbiAgICAgICAgdGhpcy50cmFuc2Zvcm1FbGVtZW50KHRyYW5zaXRpb25EdXJhdGlvbik7XG4gICAgfVxuXG4gICAgcHVibGljIHNldE1vdmVZKHZhbHVlOm51bWJlciwgdHJhbnNpdGlvbkR1cmF0aW9uOm51bWJlciA9IDIwMCl7XG4gICAgICAgIHRoaXMubW92ZVkgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy50cmFuc2Zvcm1FbGVtZW50KHRyYW5zaXRpb25EdXJhdGlvbik7XG4gICAgfVxufSIsImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgUGluY2hab29tQ29tcG9uZW50IH0gZnJvbSAnLi9waW5jaC16b29tLmNvbXBvbmVudCc7IFxuXG5ATmdNb2R1bGUoe1xuICAgIGRlY2xhcmF0aW9uczogW1xuICAgICAgICBQaW5jaFpvb21Db21wb25lbnRcbiAgICBdLFxuICAgIGltcG9ydHM6IFtcbiAgICAgICAgQ29tbW9uTW9kdWxlXG4gICAgXSxcbiAgICBleHBvcnRzOiBbXG4gICAgICAgIFBpbmNoWm9vbUNvbXBvbmVudFxuICAgIF0sXG4gICAgZW50cnlDb21wb25lbnRzOiBbXG4gICAgICAgIFBpbmNoWm9vbUNvbXBvbmVudFxuICAgIF1cbn0pXG5leHBvcnQgY2xhc3MgUGluY2hab29tTW9kdWxlIHsgfVxuIl0sIm5hbWVzIjpbIkV2ZW50RW1pdHRlciIsIkNvbXBvbmVudCIsIkVsZW1lbnRSZWYiLCJJbnB1dCIsIk91dHB1dCIsIkhvc3RCaW5kaW5nIiwiVmlld0NoaWxkIiwiSG9zdExpc3RlbmVyIiwiTmdNb2R1bGUiLCJDb21tb25Nb2R1bGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTtRQXVGSSw0QkFBb0IsVUFBc0I7WUFBdEIsZUFBVSxHQUFWLFVBQVUsQ0FBWTtxQkFwRTlCLENBQUM7eUJBT0csQ0FBQztnQ0FDTSxDQUFDO3lCQU9YLENBQUM7eUJBQ0QsQ0FBQztnQ0FDTSxDQUFDO2dDQUNELENBQUM7Z0NBTUcsS0FBSzsyQkFFWCxDQUFDO3NDQUd3QyxHQUFHOzZCQUNwQixJQUFJOzhCQUNGLElBQUk7eUNBQ21CLEtBQUs7dUNBQ1QsS0FBSzsrQkFDckIsS0FBSzswQkFRZCxJQUFJQSxpQkFBWSxFQUFPO1NBMkI1RDtRQWxDRCxzQkFBaUIsa0NBQUU7OztnQkFHbkI7Z0JBQ0ksT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDO2FBQ25COzs7O2dCQUxELFVBQW9C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