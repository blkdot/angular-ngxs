import { Injectable } from '@angular/core';
import {NgxImageCompressService} from "ngx-image-compress";

@Injectable()
export class UploadService {


    constructor(private imageCompress: NgxImageCompressService) {
    }

    upload(event):FileReader  {
        let files = event.target.files;
        if (files.length === 0)
            return;
        
        const reader = new FileReader();
        

            reader.readAsDataURL(files[0]);
        
        
        return reader;
    }
}