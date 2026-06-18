import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Post, ProcessingEvent } from '../../models/post';

// test
@Component({
    selector: 'app-post-details-card',
    imports: [CommonModule],
    templateUrl: './post-details-card.component.html',
    styleUrl: './post-details-card.component.css'
})
export class PostDetailsCardComponent {
  @Input({ required: true }) post!: Post;

  // Optional: keep it as an event (so parent controls navigation)
  @Output() back = new EventEmitter<void>();

  processingEvents: ProcessingEvent[] = [
    { label: 'Message received', timestamp: new Date().toISOString(), status: 'Success' },
    { label: 'Validation completed', timestamp: new Date().toISOString(), status: 'Success' },
    { label: 'Routed to target system', timestamp: new Date().toISOString(), status: 'Success' },
    { label: 'Processing completed', timestamp: new Date().toISOString(), status: 'Success' },
  ];
}
