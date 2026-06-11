import { CommonModule } from "@angular/common";
import { Component, input, output } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Post } from "../../models/post";

@Component({
  selector: 'app-post-list-table',
  imports: [CommonModule, RouterModule],
  templateUrl: './post-list-table.component.html',
  styleUrl: './post-list-table.component.css'
})
export class PostListTableComponent {
  posts = input<Post[]>([]);
  deletePost = output<number>();
}
