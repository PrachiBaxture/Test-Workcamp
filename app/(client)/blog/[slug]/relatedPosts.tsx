import BlogCard from "@/components/BlogCard";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import {CardContent} from "@/components/ui/card";

export default function RelatedPosts({relatedPosts}: { relatedPosts: any[] }) {
    return (
        <>
            {relatedPosts.length > 0 && (
                <section className="my-1 md:container mb-10 px-4">
                    <h2 className="text-xl md:text-4xl font-semibold mb-6">Related Articles</h2>
                    <Carousel
                        opts={{
                            align: "start",
                        }}
                        className="w-full"
                    >
                        <CarouselContent>
                            {/* Iterate over relatedPosts */}
                            {relatedPosts.map((relatedPost, index) => (
                                <CarouselItem key={index} className="md:basis-1/3">
                                    <div className="p-1">
                                        <CardContent className="flex items-center justify-center p-0">
                                            {/* Pass post object to BlogCard */}
                                            <BlogCard post={relatedPost} key={index}/>
                                        </CardContent>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="-bottom-11 top-auto left-[40%] md:left-[44%] xl:left-[47%]"/>
                        <CarouselNext className="-bottom-11 top-auto right-[40%] md:right-[44%] xl:right-[47%]"/>
                    </Carousel>
                </section>
            )}
        </>
    );
}
