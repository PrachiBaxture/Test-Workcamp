'use client'
import BlogCard from '@/components/BlogCard';
import {Card, CardContent} from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

interface BlogTabsProps {
    categories: string[];
    posts: Post[];
}

const BlogSection: React.FC<BlogTabsProps> = ({posts, categories}) => {

    return (
        <section className="md:container px-4">
            <div className="grid md:grid-cols-3 items-center">
                <div className='text-center md:text-left'>
                    <h1 className="text-2xl mt-12 text-dark dark:text-light sm:text-3xl lg:text-5xl">
                        Product Updates<br/>
                        <b>& More.</b>
                    </h1>
                    <p className="pb-10 pt-6">
                        Stay updated with the latest product features and enhancements designed to streamline your
                        project management experience.
                    </p>
                </div>
                <div className="md:col-span-2">
                    <Carousel
                        opts={{
                            align: "start",
                        }}
                        className="w-full"
                    >
                        <CarouselContent>
                            {/* Replace index with blog posts */}
                            {posts.map((post, index) => (
                                <CarouselItem key={index} className="md:basis-1/2">
                                    <div className="p-1">
                                        {/* <Card> */}
                                        <CardContent className="flex items-center justify-center p-0">
                                            {/* Pass post object to BlogCard */}
                                            <BlogCard post={post}/>
                                        </CardContent>
                                        {/* </Card> */}
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className='-bottom-14 top-auto left-[45%]'/>
                        <CarouselNext className='-bottom-14 top-auto right-[45%]'/>
                    </Carousel>
                </div>
            </div>
        </section>
    );
}

export default BlogSection;
