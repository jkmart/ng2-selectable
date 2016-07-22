import { ElementRef, Directive, EventEmitter, Input, Output, OnInit, OnDestroy, AfterContentInit } from '@angular/core';
import { SelectableService, SelectEvent } from './selectable.service';
import { SelectableOptions } from './selectableOptions.model';
import { Subscription } from 'rxjs/Rx';

declare let jQuery: any;

@Directive({
  selector: '[asSelectable]'
})

export class SelectableDirective implements OnInit, OnDestroy, AfterContentInit {
  @Output() selectableOut = new EventEmitter();
  @Input() selectableOptions: SelectableOptions;
  @Input() selectableName: string;
  @Input() selectableToggle: boolean;

  private _elementRef: ElementRef;
  private _element: any;
  private _jQueryElement: any;

  private _selectableSvc: SelectableService;
  private _event: SelectEvent;
  private _selectableSubscription: Subscription;

  private _previousSelection: Array<any> = [];
  private _unselectedItems: Array<any> = [];
  private _defaultOptions: SelectableOptions = {
    autoRefresh: false
  };

  constructor(elementRef: ElementRef, selectableSvc: SelectableService) {
    this._elementRef = elementRef;
    this._element = this._elementRef.nativeElement;
    this._selectableSvc = selectableSvc;

    // Initialize jQuery element
    this._jQueryElement = jQuery(this._element);
  }

  ngOnInit() {

    // Set default name if none is given
    this.selectableName = this.selectableName || 'selectable';
    this._event = new SelectEvent({parentKey: this.selectableName});

    // Get options
    this.selectableOptions = this.selectableOptions || {};

    // Set default auto-refresh option unless overridden
    this.selectableOptions.autoRefresh = this.selectableOptions.autoRefresh || this._defaultOptions.autoRefresh;

    // Subscribe to selection listener service so we can remove selections in other asSelectable directives
    // Selections should only be removed if the other class has a different name i.e. it was specifically named
    this._selectableSubscription = this._selectableSvc.getSelect().subscribe((res) => {
      if (res.parentKey !== this._event.parentKey) {
        this.removeSelectedState();
      }
    });

    // Initialize jquery-ui selectable with specified options from api
    let jQueryElement = this._jQueryElement;
    jQueryElement.selectable(this.selectableOptions);

    if (this.selectableToggle) {

      // Bind events that enable the toggle functionality
      jQueryElement.bind('selectablestart', () => {
        this.previousSelection(jQueryElement.find('.ui-selected'));
      });
      jQueryElement.bind('selectableunselected', (event, ui) => this.addToUnselect(ui));
    }

    // Bind event for the end of the selection event that passes selected items to listeners
    jQueryElement.bind('selectablestop', () => {
      this.selectEvent(jQueryElement.find('.ui-selected'));
    });
  }

  ngOnDestroy() {
    // Remove subscription to avoid memory leaks
    if (this._selectableSubscription) {
      this._selectableSubscription.unsubscribe();
    }
  }

  ngAfterContentInit() {
    this.manualRefresh();
  }

  /**
   * If auto-refresh option disabled, calls a manual refresh of selectable parent
   */
  private manualRefresh() {
    if (!this.selectableOptions.autoRefresh) {
      this._jQueryElement.selectable('refresh');
    }
  }

  /**
   * If the element had been previously selected, determined by the textContent of the element, then deselect it
   *
   * @param ui Object emitted from Selectable
   */
  private selectToggle(ui: any) {
    let selection = jQuery(ui);

    // Determine if this item was previously selected, and unselect if true
    if (this._previousSelection.findIndex(previous => previous.textContent === selection[0].textContent) >= 0) {
      jQuery(selection).removeClass('ui-selected');
    }
  }

  /**
   * Emit the selected elements and the current parent. If selectableToggle is true, call toggle logic
   *
   * @param selectedElements jQuery object of currently selected elements in parent
   */
  private selectEvent(selectedElements: any): void {
    let selected: Array<any> = [];

    if (this.selectableToggle) {
      this._unselectedItems.forEach(unselected => jQuery(unselected).addClass('ui-selected'));
      if (selectedElements.length === 1) {
        this.selectToggle(selectedElements.get(0));
      }

      // Refresh ui-selected elements with updated values from toggle
      selectedElements = this._jQueryElement.find('.ui-selected');
    }

    for (let i = 0; i < selectedElements.length; i++) {
      // Get the text string of each selected list item
      selected.push(selectedElements[i].textContent);
    }
    this._selectableSvc.setSelectParent(this._event);
    this.selectableOut.emit(selected);
    this._unselectedItems = [];
    this.manualRefresh();
  }

  /**
   * Remove the selected state from all elements in parent
   */
  private removeSelectedState() {
    let jQueryElement = this._jQueryElement;
    jQueryElement.find('li').removeClass('ui-selected');
    this.manualRefresh();
    // Send an empty 'selection' to show nothing is selected
    this.selectableOut.emit([]);
  }

  /**
   * Adds the previously selected items to an array for tracking
   *
   * @param ui Object emitted from Selectable
   */
  private previousSelection(ui: any) {
    this.manualRefresh();
    this._previousSelection = [];
    for (let i = 0; i < ui.length; i++) {
      this._previousSelection.push(ui.get(i));
    }
  }

  /**
   * Adds the unselected items to an array for tracking
   *
   * @param ui Object emitted from Selectable
   */
  private addToUnselect(ui: any) {

    this._unselectedItems.push(ui.unselected);
  }
}
