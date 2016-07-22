import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs/Rx';

export class SelectEvent {
    parentKey: string;

    constructor(selectEvent: SelectEvent) {
        this.parentKey = selectEvent.parentKey;
    }
}

@Injectable()
export class SelectableService {
    private _selectSubject = new Subject<SelectEvent>();

    public setSelectParent(event: SelectEvent): void {
        try {
            this._selectSubject.next(event);
        } catch (err) {
            console.error('Select Service setSelectParent error', err, event);
        }

    }

    public getSelect(): Observable<SelectEvent> {
        return this._selectSubject.asObservable();
    }

}
