import { TestBed } from '@angular/core/testing';

import { PromptServService } from './prompt-serv.service';

describe('PromptServService', () => {
  let service: PromptServService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PromptServService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
