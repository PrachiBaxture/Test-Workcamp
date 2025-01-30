import Image from "next/image";
import Link from "next/link";
import { urlForImage } from "../sanity/lib/image";
import { FaCalendarDays } from "react-icons/fa6";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from 'date-fns';

export default function BlogCard({ post }: { post: Post }) {
    const imageUrl = post.image ? urlForImage(post.image) : null;
    const authorImageUrl = post.author.image ? urlForImage(post.author.image) : null;
    return (
        <Link href={`/blog/${post.slug}`}>

            <Card className="rounded-[20px] shadow-none border relative h-full hover:bg-[#8CBEFF3D]">
                <CardHeader className="p-4 md:p-6">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={post.title}
                        width={410}
                        height={300}
                        className="rounded-t-xl pb-2 h-64"
                    />
                ) : (
                    <div className="bg-gray-200 rounded-t-xl mx-auto w-full" style={{ height: 400 }}>
                        Placeholder if no image
                        <p className="text-center p-4">No Image Available</p>
                    </div>
                )}
                    <div className="flex justify-between items-center py-2">
                        {post.categories?.map((category, index) => (
                            <div key={index} className="flex items-center gap-1 bg-white p-1 rounded-md">
                                {category.title}
                            </div>
                        ))}
                         <div> {post.minRead} min read</div>
                    </div>

                    <CardTitle className="text-black text-lg md:text-xl font-medium"> {post.title}</CardTitle>
                    <CardDescription className="line-clamp-3 pt-3 text-black">{post.bodyText}</CardDescription>
                </CardHeader>
                <CardFooter className="sticky top-[100vh]">
                    <div className="flex justify-between items-center pt-2 w-full text-[#505050]">
                        {/* <div className="flex gap-2 items-center">
                            {authorImageUrl ? (
                                <Image
                                    src={authorImageUrl}
                                    width={30}
                                    height={30}
                                    alt="author"
                                    className="object-cover rounded-full"
                                />
                            ) : (
                                <div>No Image Available</div>
                            )}
                            <div className="flex flex-col gap-1 pr-3">
                                <h3 className="text-sm font-normal">{post.author.name}</h3>
                            </div>
                        </div> */}
                        <div className="flex gap-1 items-center text-sm font-normal whitespace-nowrap"> <FaCalendarDays /> {format(new Date(post?.publishedAt), 'MMM d, yyyy')} </div>
                    </div>
                    {/* </Link> */}
                </CardFooter>
            </Card>
        </Link>
    );
}