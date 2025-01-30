import Image from "next/image";
import {urlForImage} from "../../../../sanity/lib/image";
import {PortableText} from "@portabletext/react";
import {notFound, usePathname} from "next/navigation";
import RelatedPosts from "../../blog/[slug]/relatedPosts";
import {format} from "date-fns";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Toc from "../../blog/[slug]/tableOfContent";
// import MetadataComponent from "@/components/Metadata";
import { client } from "@/sanity/lib/client";
import { slugify } from "@/lib/helpers";

// To create static pages for dynamic routes
export default async function page(
    {
        params: {slug},
    }: {
        params: { slug: string };
    }) {
    const query = `*[_type=='post' && slug.current=="${slug}"]{
    title,summary,image, body,"headings" : body[style in ["h2", "h3", "h4", "h5", "h6"]],
      author->{bio,image,name,summary,"slug": slug.current}, publishedAt, categories[] -> {
    title,
    }
  }[0]`;
    const post: Post | null = await client.fetch(query);

    if (!post) {
        notFound();
    }

    const categoriesAll: string[] = Array.from(
        new Set(post.categories?.map((category: any) => category.title) || [])
    );

    const relatedQuery = `*[_type == "post" && references(*[_type == "category" && title in ${JSON.stringify(categoriesAll)}]._id) && slug.current != "${slug}"]{
    title, "slug":slug.current, image, publishedAt, author->{bio,image,name},"bodyText": body[].children[].text, categories[] -> {
    title
  }
  }`;

    const relatedPosts = await client.fetch(relatedQuery);

    function calculateMinRead(text: string) {
        const wordsPerMinute = 200; // Average reading speed

        // Ensure `text` is a string
        if (Array.isArray(text)) {
            text = text.join(" "); // Join array elements into a single string
        } else if (typeof text !== "string") {
            text = ""; // Default to an empty string if `text` is not a string
        }

        const wordCount = text.split(/\s+/).filter(Boolean).length; // Count words
        const minutes = Math.max(Math.ceil(wordCount / wordsPerMinute), 1); // Ensure at least 1 min
        return minutes;
    }

    post.minRead = calculateMinRead(post.bodyText);
    const updatedRelatedPosts = relatedPosts.map(
        (post: { bodyText: string }) => ({
            ...post,
            minRead: calculateMinRead(post.bodyText),
        })
    );

    const title = `${post.title}`;
    const description = (post.summary || "No description available.").slice(0, 170);
    
    return (
        <>
            {/* <MetadataComponent seoTitle={title} seoDescription={description} canonical={"https://workcamp.io/"} ogTitle={title} ogDescription={description} />i */}

            <section className="pt-10 md:py-10 md:pt-20">
                <div className="md:container px-4">
                    <Breadcrumb>
                        <BreadcrumbList className="text-lg">
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/">Home</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator>{/*  <Slash />  */}</BreadcrumbSeparator>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/blog">Blog</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator>{/*  <Slash />  */}</BreadcrumbSeparator>
                            <BreadcrumbItem>
                                <BreadcrumbPage>
                                    {categoriesAll.map((category, index) => (
                                        <span key={index}>
                                                <div className="inline-block">{category}</div>
                                            {index < categoriesAll.length - 1 && (
                                                <BreadcrumbSeparator> &gt; </BreadcrumbSeparator>
                                            )}
                                        </span>
                                    ))}
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <h1 className="text-black text-3xl md:text-5xl capitalize md:leading-[55.6px] py-5">
                        {post.title}
                    </h1>

                    <div className="flex flex-col md:flex-row gap-3 justify-between items-center pt-4 text-lg">
                        <div className="flex gap-2 items-center text-lg">
                            <label>Date Published : </label>{" "}
                            {format(new Date(post?.publishedAt), "MMM d, yyyy")}
                        </div>
                        {/* <div> {post.minRead} Min Read</div> */}
                        {/* <div className="px-2 flex gap-2 items-center">
              <label>Author : </label>
              <h3>
                {post.author.slug ? (
                  <Link href={`/blog/author/${post.author.slug}`}>
                    {post.author.name}
                  </Link>
                ) : (
                  <span>{post.author.name}</span>
                )}
              </h3>
            </div> */}
                    </div>
                </div>
            </section>

            <article className="mb-10 md:mb-24 px-4 2xl:px-12 flex flex-col gap-y-8 md:container">
                <div className="md:grid md:grid-cols-4 gap-10">
                    {/* TOC for Mobile View */}
                    {post?.headings && post.headings.length > 0 && (
                        <div className="block md:hidden">
                            <Toc headings={post?.headings}/>
                        </div>
                    )}

                    <div className="col-span-3">
                        <div className="bg-[#FFF1FC] p-4 rounded-md mt-3">{post?.summary}</div>
                        {/* Main Body of Blog */}
                        <div className={richTextStyles}>
                            <PortableText
                                value={post?.body}
                                components={myPortableTextComponents}
                            />
                        </div>

                    </div>

                    {/* Sidebar with TOC for Larger Screens */}
                    {post?.headings && post.headings.length > 0 && (
                        <div className="hidden md:block md:col-span-1">
                            <Toc headings={post?.headings}/>
                        </div>
                    )}
                </div>
            </article>

            {/* Related Posts Section */}
            <RelatedPosts relatedPosts={updatedRelatedPosts}/>
        </>

    );
}

const richTextStyles = `
          mt-10
          text-justify
          m-auto
          prose-headings:my-5
          prose-heading:text-2xl
          prose-p:mb-5
          prose-p:leading-7
          prose-li:list-disc
          prose-li:leading-7
          prose-li:ml-4
          prose-p:pb-4
          `;

const myPortableTextComponents = {
    types: {
        image: ({value}: any) => (
            <Image src={urlForImage(value)} alt="Post" width={700} height={700} className="pb-4"/>
        ),
    },
    block: {
        h2: ({value}: any) => (
            <h2
                id={slugify(value.children[0].text)}
                className="text-3xl  mb-3"
            >
                {value.children[0].text}
            </h2>
        ),
        h3: ({value}: any) => (
            <h3
                id={slugify(value.children[0].text)}
                className="text-2xl  mb-3"
            >
                {value.children[0].text}
            </h3>
        ),
        h4: ({value}: any) => (
            <h4
                id={slugify(value.children[0].text)}
                className="text-2xl  mb-3"
            >
                {value.children[0].text}
            </h4>
        ),
        h5: ({value}: any) => (
            <h5
                id={slugify(value.children[0].text)}
                className="text-2xl mb-3"
            >
                {value.children[0].text}
            </h5>
        ),
        h6: ({value}: any) => (
            <h6
                id={slugify(value.children[0].text)}
                className="text-xl  mb-3"
            >
                {value.children[0].text}
            </h6>
        ),
    },
};
