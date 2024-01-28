import { TestBed } from '@angular/core/testing';

import { ApiPhotoService } from './api-photo.service';

describe('ApiPhotoService', () => {
  let service: ApiPhotoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiPhotoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
