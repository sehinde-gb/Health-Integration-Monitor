import { TestBed } from '@angular/core/testing';
import { PostDetailsCardComponent } from './post-details-card.component';
import { Post } from '../../models/post';

describe('PostDetailsCardComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostDetailsCardComponent],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(PostDetailsCardComponent);

    const mockPost: Post = {
      id: 1,
      patientId: 'P-00001',
      patientName: 'Patient 1',
      messageType: 'ADT^A01',
      status: 'Processed',
      lastUpdated: '2026-06-11T15:03:40.033Z'
    };

    fixture.componentInstance.post = mockPost;

    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
  });
});
