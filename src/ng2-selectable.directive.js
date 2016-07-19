"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var SelectableDirective = (function () {
    function SelectableDirective(elementRef) {
        this.selectableOut = new core_1.EventEmitter();
        this._elementRef = elementRef;
        this._element = jQuery(this._elementRef.nativeElement);
    }
    SelectableDirective.prototype.ngOnInit = function () {
        var _this = this;
        jQuery(this._element).selectable({
            selected: this.selectEvent(event)
        });
        if (this.selectableList.length > 0) {
            this._element.bind('selectablestop', function () {
                _this.selectEvent(jQuery(_this._element)
                    .find('.ui-selected')
                    .get());
            });
        }
    };
    SelectableDirective.prototype.selectEvent = function (event) {
        this.selectableOut.emit(event);
    };
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], SelectableDirective.prototype, "selectableOut", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], SelectableDirective.prototype, "selectableList", void 0);
    SelectableDirective = __decorate([
        core_1.Directive({
            selector: '[asSelectable]'
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef])
    ], SelectableDirective);
    return SelectableDirective;
}());
exports.SelectableDirective = SelectableDirective;
//# sourceMappingURL=ng2-selectable.directive.js.map