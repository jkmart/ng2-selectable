import { ElementRef, Directive, EventEmitter, Input, Output, OnInit } from '@angular/core';

declare let jQuery: any;

@Directive({
  selector: '[asSelectable]'
})

export class SelectableDirective implements OnInit {
  @Output() selectableOut = new EventEmitter();
  @Input() selectableList: Array<any>;

  private _elementRef: ElementRef;
  private _element: any;

  constructor(elementRef: ElementRef) {
    this._elementRef = elementRef;
    this._element = jQuery(this._elementRef.nativeElement);
  }

  ngOnInit() {
    jQuery(this._element).selectable({
      selected: this.selectEvent(event)
    });

    if (this.selectableList.length > 0) {
      this._element.bind('selectablestop', () => {
        this.selectEvent(jQuery(this._element)
          .find('.ui-selected')
          .get()
        );
      });
    }
  }

  public selectEvent(event: any) {
    this.selectableOut.emit(event);
  }

}
