import { randomUUID } from 'crypto';

export class PostFactory {
  static create(author: string, description: string) {
    return {
      pk: 'post',
      sk: randomUUID(),
      comments: [],
      likes: 0,
      author: author,
      description: description,
      image: 'https://cdn.mos.cms.futurecdn.net/0bfa6d1cf85568b40f7c5e89dcacb6d9.jpg'
    };
  }
}
