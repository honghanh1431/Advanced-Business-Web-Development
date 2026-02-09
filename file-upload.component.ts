import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-file-upload',
    templateUrl: './file-upload.component.html',
    styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnDestroy {
    @Input() requiredFileType: string = '';

    fileName = '';
    uploadProgress = 0;
    uploadSub: Subscription | null = null;

    constructor(private http: HttpClient) {}

    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (!input.files || input.files.length === 0) {
            return;
        }
        const file: File = input.files[0];
        this.fileName = file.name;

        const formData = new FormData();
        formData.append('image', file);

        const upload$ = this.http.post('/upload', formData, {
            reportProgress: true,
            observe: 'events'
        }).pipe(
            finalize(() => this.reset())
        );

        this.uploadSub = upload$.subscribe({
            next: (evt: any) => {
                if (evt.type === HttpEventType.UploadProgress) {
                    const total = evt.total ?? 1;
                    this.uploadProgress = Math.round(100 * (evt.loaded / total));
                } else if (evt.type === HttpEventType.Response) {
                    // handle successful response if needed
                    // evt.body has server response
                }
            },
            error: (err) => {
                console.error('Upload error', err);
            }
        });
    }

    cancelUpload() {
        if (this.uploadSub) {
            this.uploadSub.unsubscribe();
            this.uploadSub = null;
        }
        this.reset();
    }

    reset() {
        this.uploadProgress = 0;
        this.fileName = '';
    }

    ngOnDestroy(): void {
        if (this.uploadSub) {
            this.uploadSub.unsubscribe();
            this.uploadSub = null;
        }
    }
}