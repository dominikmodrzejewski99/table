import {AfterViewInit, Component, ViewChild, OnInit} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {debounceTime, distinctUntilChanged, Subscription} from "rxjs";
import {PeriodicElement, TableDataService} from "../../services/table-data.service";
import {MatDialog} from '@angular/material/dialog';
import {EditElementDialogComponent} from "../edit-element-dialog/edit-element-dialog.component";
import {MatButton} from "@angular/material/button";

@Component({
    selector: 'app-table',
    standalone: true,
    imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, ReactiveFormsModule, MatButton],
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, AfterViewInit {
    displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'actions'];
    dataSource = new MatTableDataSource<PeriodicElement>();

    filterValue = new FormControl('', {nonNullable: true});
    sub = new Subscription();

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(private tableDataService: TableDataService, public dialog: MatDialog) {
    }

    ngOnInit() {
        this.tableDataService.getPeriodicElements().subscribe((data) => {
            this.dataSource.data = data;
        });
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.sub.add(
            this.filterValue.valueChanges
                .pipe(debounceTime(2000), distinctUntilChanged())
                .subscribe(value => {
                    const val = value?.trim().toLowerCase();
                    this.applyFilter(val);
                })
        );
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue;
    }

    openEditDialog(element: PeriodicElement): void {
        const dialogRef = this.dialog.open(EditElementDialogComponent, {
            width: '300px',
            data: {...element}
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.updateElement(result);
            }
        });
    }

    updateElement(updatedElement: PeriodicElement): void {
        const index = this.dataSource.data.findIndex(el => el.position === updatedElement.position);
        if (index !== -1) {
            const updatedData = [...this.dataSource.data];
            updatedData[index] = updatedElement;
            this.dataSource.data = updatedData;
        }
    }
}
