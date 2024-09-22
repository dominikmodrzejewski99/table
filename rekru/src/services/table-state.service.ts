import { Injectable } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { TableDataService, PeriodicElement } from './table-data.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface TableState {
    elements: PeriodicElement[];
    filter: string;
}

@Injectable({
    providedIn: 'root'
})
export class TableStateService extends RxState<TableState> {
    constructor(private tableDataService: TableDataService) {
        super();
        this.initialize();
    }

    initialize() {
        // Ustawienie początkowego stanu
        this.connect('elements', this.tableDataService.getPeriodicElements());
        this.set({ filter: '' });
    }

    // Selektor elementów
    get elements$(): Observable<PeriodicElement[]> {
        return this.select('elements');
    }

    // Ustawienie filtra
    setFilter(filter: string | null) {
        this.set({ filter });
    }

    // Selektor dla przefiltrowanych danych
    get filteredElements$(): Observable<PeriodicElement[]> {
        return this.select().pipe(
            map(({ elements, filter }) =>
                elements.filter(el => el.name.toLowerCase().includes(filter.toLowerCase()))
            )
        );
    }
}
