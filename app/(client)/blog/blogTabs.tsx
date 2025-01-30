"use client"
import React, {useState} from "react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Button} from "@/components/ui/button";
import BlogCard from "@/components/BlogCard";
import {FaAngleRight, FaAngleLeft} from "react-icons/fa6";

interface BlogTabsProps {
    categories: string[];
    posts: Post[];
}

const BlogTabs: React.FC<BlogTabsProps> = ({categories, posts}) => {
    const allCategories = ["All Posts", ...categories];
    const itemsPerPage = 6; // Number of posts per page
    const [currentTab, setCurrentTab] = useState("All Posts");

    // Separate pagination state for each category
    const [pagination, setPagination] = useState(
        allCategories.reduce((acc, category) => {
            acc[category] = {currentPage: 1}; // Initialize page for each tab
            return acc;
        }, {} as Record<string, { currentPage: number }>)
    );

    // Handle pagination for specific tabs
    const handlePageChange = (category: string, page: number) => {
        setPagination((prev) => ({
            ...prev,
            [category]: {currentPage: page},
        }));
    };

    const getPaginatedPosts = (category: string) => {
        const currentPage = pagination[category]?.currentPage || 1;
        const filteredPosts =
            category === "All Posts"
                ? posts
                : posts.filter((post) =>
                    post.categories?.some((cat) => cat.title === category)
                );

        const indexOfLastPost = currentPage * itemsPerPage;
        const indexOfFirstPost = indexOfLastPost - itemsPerPage;
        return filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
    };

    const totalPages = (category: string) => {
        const filteredPosts =
            category === "All Posts"
                ? posts
                : posts.filter((post) =>
                    post.categories?.some((cat) => cat.title === category)
                );

        return Math.ceil(filteredPosts.length / itemsPerPage);
    };

    return (
        <div className="w-full">
            <Tabs
                defaultValue={allCategories[0]}
                onValueChange={(value) => setCurrentTab(value)}
                className="w-full"
            >
                <TabsList
                    className="flex flex-wrap md:flex-row w-full justify-start bg-transparent gap-5 data-[state=active]:font-bold ps-4 mb-10 p-0">
                    {allCategories.map((category) => (
                        <TabsTrigger
                            key={category}
                            value={category}
                            className="py-2 px-4 text-md data-[state=active]:bg-[#C2D8F240] bg-[#C2D8F240] data-[state=active]:border-gray-400 border rounded-full"
                        >
                            {category}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {/* Render All Posts with Pagination */}
                <TabsContent value="All Posts">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {getPaginatedPosts("All Posts").map((post) => (
                            <BlogCard post={post} key={post.slug}/>
                        ))}
                    </div>

                    {/* Pagination Controls for All Posts */}
                    <div className="flex justify-end mt-4 space-x-2">
                        <Button
                            onClick={() =>
                                handlePageChange(
                                    "All Posts",
                                    Math.max(1, pagination["All Posts"]?.currentPage - 1)
                                )
                            }
                            disabled={pagination["All Posts"]?.currentPage === 1}
                            className="px-4 py-2 bg-gray-100 text-black hover:text-white rounded"
                        >
                            <FaAngleLeft/>
                        </Button>
                        {Array.from({length: totalPages("All Posts")}, (_, index) => (
                            <Button
                                key={index}
                                onClick={() =>
                                    handlePageChange("All Posts", index + 1)
                                }
                                className={`px-4 py-2 rounded ${
                                    pagination["All Posts"]?.currentPage === index + 1
                                        ? "bg-black text-white"
                                        : "bg-gray-100 text-black hover:text-white"
                                }`}
                            >
                                {index + 1}
                            </Button>
                        ))}
                        <Button
                            onClick={() =>
                                handlePageChange(
                                    "All Posts",
                                    Math.min(
                                        totalPages("All Posts"),
                                        pagination["All Posts"]?.currentPage + 1
                                    )
                                )
                            }
                            disabled={
                                pagination["All Posts"]?.currentPage ===
                                totalPages("All Posts")
                            }
                            className="px-4 py-2 bg-gray-100 text-black hover:text-white rounded"
                        >
                            <FaAngleRight/>
                        </Button>
                    </div>
                </TabsContent>

                {/* Render content for each specific category with pagination */}
                {categories.map((category) => (
                    <TabsContent key={category} value={category}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {getPaginatedPosts(category).map((post) => (
                                <BlogCard post={post} key={post.slug}/>
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        <div className="flex justify-end mt-4 space-x-2">
                            <Button
                                onClick={() =>
                                    handlePageChange(
                                        category,
                                        Math.max(1, pagination[category]?.currentPage - 1)
                                    )
                                }
                                disabled={pagination[category]?.currentPage === 1}
                                className="px-4 py-2 bg-gray-100 text-black hover:text-white rounded"
                            >
                                <FaAngleLeft/>
                            </Button>
                            {Array.from({length: totalPages(category)}, (_, index) => (
                                <Button
                                    key={index}
                                    onClick={() =>
                                        handlePageChange(category, index + 1)
                                    }
                                    className={`px-4 py-2 rounded ${
                                        pagination[category]?.currentPage === index + 1
                                            ? "bg-black text-white"
                                            : "bg-gray-100 text-black hover:text-white"
                                    }`}
                                >
                                    {index + 1}
                                </Button>
                            ))}
                            <Button
                                onClick={() =>
                                    handlePageChange(
                                        category,
                                        Math.min(
                                            totalPages(category),
                                            pagination[category]?.currentPage + 1
                                        )
                                    )
                                }
                                disabled={
                                    pagination[category]?.currentPage ===
                                    totalPages(category)
                                }
                                className="px-4 py-2 bg-gray-100 text-black hover:text-white rounded"
                            >
                                <FaAngleRight/>
                            </Button>
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
};

export default BlogTabs;
