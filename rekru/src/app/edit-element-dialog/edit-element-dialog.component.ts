import {Component, Inject, OnInit} from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle
} from '@angular/material/dialog';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {PeriodicElement} from "../../services/table-data.service";
import {MatFormField, MatInput, MatLabel} from "@angular/material/input";
import {MatButton} from "@angular/material/button";


interface TableState {
    elements: PeriodicElement[];
    filter: string;
}

@Component({
    selector: 'app-edit-element-dialog',
    templateUrl: './edit-element-dialog.component.html',
    standalone: true,
    imports: [
        MatInput,
        MatLabel,
        MatFormField,
        ReactiveFormsModule,
        MatDialogContent,
        MatDialogTitle,
        MatDialogActions,
        MatButton
    ],
    styleUrls: ['./edit-element-dialog.component.css']
})
export class EditElementDialogComponent implements OnInit {
    editForm: FormGroup;

    constructor(
        public dialogRef: MatDialogRef<EditElementDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: PeriodicElement
    ) {}

    ngOnInit(): void {
        this.editForm = new FormGroup({
            position: new FormControl(this.data.position),
            name: new FormControl(this.data.name),
            weight: new FormControl(this.data.weight),
            symbol: new FormControl(this.data.symbol),
        });
    }

    onSave(): void {
        if (this.editForm.valid) {
            this.dialogRef.close(this.editForm.value);
        }
    }

    onCancel(): void {
        this.dialogRef.close();
    }
}
