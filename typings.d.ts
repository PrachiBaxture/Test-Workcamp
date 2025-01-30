type Post = {
    minRead: number;
    title:string,
    summary:string,
    image:any,
    slug:string,
    categories?: Category[];
    author:Author,
    headings:Array<HTMLHeadElement | string>
    publishedAt:string;
    body:any;
    bodyText:string;
}
interface Author {
    summary: string;
    bio: string;
    image: any; // or specific type if you're using a type for the image
    name: string;
    slug:string;
  }

  interface Category {
    title: string;
  }