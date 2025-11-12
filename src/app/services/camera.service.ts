import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CameraService {

  constructor() { }

  takeMeterPhoto(): Observable<string> {
    return from(
      Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        promptLabelPhoto: 'Fotografía del medidor',
        promptLabelPicture: 'Seleccionar foto'
      }).then((image) => image.dataUrl || '')
    );
  }

  takeFacadePhoto(): Observable<string> {
    return from(
      Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        promptLabelPhoto: 'Fotografía de la fachada',
        promptLabelPicture: 'Seleccionar foto'
      }).then((image) => image.dataUrl || '')
    );
  }

  pickPhotoFromGallery(): Observable<string> {
    return from(
      Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos
      }).then((image) => image.dataUrl || '')
    );
  }
}
