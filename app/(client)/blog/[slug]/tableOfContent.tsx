'use client'
import { slugify } from "@/lib/helpers";
import {useState, useEffect} from "react";

const Toc = ({headings}: any) => {
    const [activeHeading, setActiveHeading] = useState("");

    useEffect(() => {
        const handleScroll = () => {
            const offsets = headings.map((heading: any) => {
                const id = slugify(heading.children[0].text);
                const element = document.getElementById(id);
                if (element) {
                    return {
                        id,
                        offsetTop: element.offsetTop - 100 // Adjust for offset (e.g., header height)
                    };
                }
                return null;
            }).filter(Boolean);

            const scrollPosition = window.scrollY;

            let current = "";
            for (const {id, offsetTop} of offsets) {
                if (scrollPosition >= offsetTop) {
                    current = id;
                } else {
                    break;
                }
            }

            setActiveHeading(current);
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [headings]);

    return (
        <div className="max-w-full sticky top-20 self-start mt-8 rounded-sm border p-5">
            <h2 className="text-xl font-bold pb-2 mb-5 border-b">Table of Contents</h2>
            <nav>
                <ul className="text-[#505050]">
                    {headings?.map((heading: any) => {
                        const id = slugify(heading.children[0].text);
                        return (
                            <li key={heading?._key} className="mb-4">
                                <a
                                    className={`hover:underline ${
                                        activeHeading === id ? "text-black font-medium" : ""
                                    }`}
                                    href={`#${id}`}
                                >
                                    {heading.children[0].text}
                                </a>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </div>
    );
};

export default Toc;
