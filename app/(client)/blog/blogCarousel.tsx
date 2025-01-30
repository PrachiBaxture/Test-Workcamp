'use client'
import React, {useState, useEffect} from "react";
import Image from "next/image";
import {Carousel, CarouselContent, CarouselItem} from "@/components/ui/carousel";
import {Card, CardContent, CardFooter} from "@/components/ui/card";
import Link from "next/link";
import {Badge} from "@/components/ui/badge";
import {FaCalendarDays} from "react-icons/fa6";
import { urlForImage } from "@/sanity/lib/image";

interface BlogCarouselProps {
    posts: Post[];
    categories: string[]; // Add categories as props
}

const BlogCarousel: React.FC<BlogCarouselProps> = ({posts, categories}) => {
    const [activeIndex, setActiveIndex] = useState(0);

    // Automatically change slides every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prevIndex) => (prevIndex + 1) % posts.length);
        }, 5000); // 5000ms = 5 seconds

        return () => {
            clearInterval(interval); // Cleanup the interval on unmount
        };
    }, [posts.length]);

    const goToSlide = (index: number) => {
        setActiveIndex(index);
    };

    // Helper function to generate a color based on category name
    const getColorFromCategory = (category: string) => {
        let hash = 0;
        for (let i = 0; i < category.length; i++) {
            hash = category.charCodeAt(i) + ((hash << 5) - hash);
        }
        const hue = hash % 360; // Ensure the hue is within the range of 0 to 360
        return `hsl(${hue}, 70%, 40%)`; // Generate a color with a fixed saturation and lightness
    };

    return (
        <div className="relative container">
            <Carousel className="w-full">
                <CarouselContent>
                    {posts?.map((post: Post, index: number) => (
                        <CarouselItem key={index} className={index === activeIndex ? 'block' : 'hidden'}>
                            <div className="rounded-lg">
                                <Link href={`/blogContent/${post.slug}`}>
                                    <Card>
                                        <CardContent className="flex p-0">
                                            <Image
                                                className="w-full rounded-t-lg"
                                                src={urlForImage(post.image)}
                                                width={736}
                                                height={500}
                                                alt={post.title || 'Post Image'}
                                                key={post.slug}
                                            />
                                        </CardContent>
                                        <CardFooter className="py-8 flex-col items-start">
                                            {/* Add categories below post content */}
                                            <div className="flex gap-3 pb-3 font-medium">
                                                {post.categories?.map((category: any, idx: number) => (
                                                    <Badge key={idx}
                                                           className="bg-[#E2E8F0] text-black font-medium py-1 hover:text-white">
                                                        {category.title}
                                                    </Badge>
                                                ))}
                                            </div>
                                            <h3 className="text-sm md:text-3xl font-semibold">{post.title}</h3>
                                            <div className="flex justify-between items-center pt-10 w-full">
                                                <div className="flex gap-2 items-center">
                                                    <Image
                                                        src={urlForImage(post.author.image)}
                                                        width={30}
                                                        height={30}
                                                        alt="author"
                                                        className="object-cover rounded-full"
                                                    />
                                                    <div className="flex flex-col gap-1 justify-between">
                                                        <h3 className="text-sm font-normal">{post.author.name}</h3>
                                                    </div>
                                                </div>
                                                <div className="flex gap-1 items-center text-sm font-normal">
                                                    <FaCalendarDays/>{new Date(post?.publishedAt).toDateString()} </div>
                                            </div>
                                        </CardFooter>
                                    </Card>
                                </Link>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                {/* Dot Navigation */}
                <div className="absolute top-0 w-full flex justify-end gap-2 p-4">
                    {posts?.map((_: any, index: number) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`h-2 w-2 rounded-full ${index === activeIndex ? 'bg-black' : 'bg-white'}`}
                        ></button>
                    ))}
                </div>
            </Carousel>
        </div>
    );
};

export default BlogCarousel;
