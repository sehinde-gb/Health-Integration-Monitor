
import {Post} from '../models/post'
export type CreatePostDto = Pick<Post, 'patientId' | 'patientName' | 'messageType' | 'status'
| 'lastUpdated'>;

export type UpdatePostDto = Partial<CreatePostDto>;
