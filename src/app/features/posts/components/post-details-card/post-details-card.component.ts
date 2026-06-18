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

  getProcessingEvents(): ProcessingEvent[] {
      const baseEvents: ProcessingEvent[] = [
        {
          label: 'Message received',
          timestamp: this.post.lastUpdated,
          status: 'Success'
        },
        {
          label: 'Validation completed',
          timestamp: this.post.lastUpdated,
          status: 'Success'
        }
      ];

      if (this.post.status === 'Failed') {
        return [
          ...baseEvents,
          {
            label: 'Routing failed',
            timestamp: this.post.lastUpdated,
            status: 'Error'
          }
        ];
      }

      if (this.post.status === 'Pending') {
        return [
          ...baseEvents,
          {
            label: 'Waiting for target system',
            timestamp: this.post.lastUpdated,
            status: 'Warning'
          }
        ];
      }

      return [
        ...baseEvents,
        {
          label: 'Routed to target system',
          timestamp: this.post.lastUpdated,
          status: 'Success'
        },
        {
          label: 'Processing completed',
          timestamp: this.post.lastUpdated,
          status: 'Success'
        }
      ];
    }


    getTimelineOutcome(): ProcessingEvent | undefined {
      return this.getProcessingEvents().find(event =>
        event.status === 'Error' ||
        event.status === 'Warning' ||
        event.label === 'Processing completed'
      );
    }
}
