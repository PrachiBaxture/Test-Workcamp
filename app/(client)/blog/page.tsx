import React from "react";
import BlogTabs from "./blogTabs";
import BlogCard from "@/components/BlogCard";
import { client } from "@/sanity/lib/client";

export default async function BlogPost() {
    const query = `*[_type=='post'] | order(_createdAt desc){
  
    summary,title,image,categories[] -> {
    title,
    },
      "slug":slug.current, "author":author->{bio,image,name}, publishedAt, body,"bodyText": body[].children[].text, categories[] -> {
    title,
    }
  }`;

    const posts: Post[] = await client.fetch(query);

    const recentPosts = posts.slice(0, 2); // The first two posts are the most recent

    // Extract all categories
    const categoriesAll = Array.from(
        new Set(
            posts
                .flatMap((post) => post.categories?.map((category) => category.title) || [])
        )
    );

    function calculateMinRead(text: string) {
        const wordsPerMinute = 200; // Average reading speed

        // Ensure `text` is a string
        if (Array.isArray(text)) {
            text = text.join(' '); // Join array elements into a single string
        } else if (typeof text !== 'string') {
            text = ''; // Default to an empty string if `text` is not a string
        }

        const wordCount = text.split(/\s+/).filter(Boolean).length; // Count words
        const minutes = Math.max(Math.ceil(wordCount / wordsPerMinute), 1); // Ensure at least 1 min
        return minutes;
    }

    // Adding min read to each post
    posts.forEach(post => {
        post.minRead = calculateMinRead(post.bodyText);
    });

    return (
        <>
            <section className="text-center py-20">
                <div className="md:container px-4">
                    <h1
                        className="text-black text-4xl md:text-6xl font-normal font-['Poppins'] capitalize md:leading-[72.60px]">
                        The <b>Workcamp Blog!</b>
                    </h1>
                    <p className="pt-3 md:w-1/2 mx-auto">Get the latest insights, strategies, and tips
                        from industry experts to optimize your project workflows. </p>
                    {/* <div className="mt-6 justify-center flex">
                            <SubscribeEmail />
                        </div> */}
                </div>
            </section>

            <section className="py-10">
                <div className="md:container px-4">
                    <h2 className="text-2xl font-semibold sm:text-3xl pb-8">
                        Recently Published
                    </h2>
                    <div className="grid md:grid-cols-3 gap-5">
                        {recentPosts.map((post, index) => (
                            <BlogCard post={post} key={index} />
                        ))}
                    </div>
                </div>
            </section>

            <section className="flex min-h-screen flex-col py-10">
                <div className="md:container px-4">
                    <h2 className="text-2xl font-semibold sm:text-3xl pb-10">Choose the category you are interested
                        in:</h2>
                    {/* Use BlogTabs Component */}
                    {/* <Carousel className="w-full"
           plugins={[
            Autoplay({
              delay: 2000,
            }),
          ]}
          >
            <CarouselContent> */}
                    <BlogTabs categories={categoriesAll} posts={posts}/>
                    {/* </CarouselContent>
            <CarouselPrevious className="-bottom-11 top-auto left-[40%] md:left-[44%] xl:left-[47%]" />
            <CarouselNext className="-bottom-11 top-auto right-[40%] md:right-[44%] xl:right-[47%]" />
          </Carousel> */}
                </div>
            </section>

            {/* <WhoWorkcamp/> */}
        </>
    );
}
