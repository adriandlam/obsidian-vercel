//@ts-nocheck

"use client";

import sanitize from "sanitize-html";
import { Search, Loader2, X, CornerDownLeft } from "lucide-react";
import { Input } from "./ui/input";
import { useEffect, useState, useRef, useCallback } from "react";
import fuzzysort from "fuzzysort";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface SearchIndexItem {
  slug: string[];
  title: string;
  excerpt?: string;
  textContent: string;
}

type FuzzysortResult = Fuzzysort.KeysResult<SearchIndexItem>;
type FuzzysortKeyResult = Fuzzysort.KeyResult<SearchIndexItem>;

function generateSnippet(
  highlightedHtml: string,
  contextChars: number
): string {
  const markOpen = "<mark>";
  const markClose = "</mark>";
  const markIndex = highlightedHtml.indexOf(markOpen);

  if (markIndex === -1) {
    return highlightedHtml.length > contextChars * 2
      ? `${highlightedHtml.substring(0, contextChars * 2)}...`
      : highlightedHtml;
  }

  const matchEndIndex = highlightedHtml.indexOf(markClose, markIndex);
  const effectiveMatchEnd =
    matchEndIndex === -1 ? markIndex : matchEndIndex + markClose.length;
  const matchLength =
    (matchEndIndex === -1 ? 0 : matchEndIndex) - (markIndex + markOpen.length);

  // Calculate the midpoint of the match itself
  const matchMidpoint = markIndex + markOpen.length + matchLength / 2;

  const desiredStart = Math.max(0, Math.floor(matchMidpoint - contextChars));
  const desiredEnd = Math.min(
    highlightedHtml.length,
    Math.ceil(matchMidpoint + contextChars)
  );

  // Extract the snippet based on desired centered window
  let snippet = highlightedHtml.substring(desiredStart, desiredEnd);

  // Add ellipses if the snippet is truncated
  if (desiredStart > 0) {
    if (!snippet.match(/^(\s|\.|,|;)/)) {
      snippet = `... ${snippet}`;
    }
  }
  if (desiredEnd < highlightedHtml.length) {
    if (!snippet.match(/(\s|\.|,|;)$/)) {
      snippet = `${snippet} ...`;
    }
  }

  return snippet;
}

export default function SearchDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchIndex, setSearchIndex] = useState<SearchIndexItem[]>([]);
  const [results, setResults] = useState<FuzzysortResult[]>([]);
  const [isLoadingIndex, setIsLoadingIndex] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/search-index.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setSearchIndex(data);
        setIsLoadingIndex(false);
        console.log("Search index loaded:", data.length, "items");
      })
      .catch((error) => {
        console.error("Failed to load search index:", error);
        setIsLoadingIndex(false);
      });
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "/" && !isOpen && !(e.target instanceof HTMLInputElement)) {
        e.preventDefault();
        setIsOpen(true);
      } else if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      } else if (
        isOpen &&
        results.length > 0 &&
        (e.key === "ArrowDown" || e.key === "ArrowUp")
      ) {
        e.preventDefault();
        const newIndex =
          e.key === "ArrowDown"
            ? (selectedIndex + 1) % results.length
            : (selectedIndex - 1 + results.length) % results.length;
        setSelectedIndex(newIndex);
        resultsRef.current
          ?.querySelector(`[data-index="${newIndex}"]`)
          ?.scrollIntoView({ block: "nearest" });
      } else if (e.key === "Enter" && isOpen && selectedIndex >= 0) {
        e.preventDefault();
        const selectedResult = results[selectedIndex];
        if (selectedResult) {
          const href = `/${selectedResult.obj.slug.join("/")}`;
          window.location.href = href;
          setIsOpen(false);
        }
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isOpen, results, selectedIndex]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery("");
      setResults([]);
      setSelectedIndex(-1);
    }
  }, [isOpen]);

  const getHighlightedHtml = (
    result: FuzzysortKeyResult | null | undefined
  ): string | null => {
    if (!result) return null;
    return result.highlight("<mark>", "</mark>");
  };

  const handleSearch = useCallback(
    (searchQuery: string) => {
      if (!searchQuery || isLoadingIndex || searchIndex.length === 0) {
        setResults([]);
        setSelectedIndex(-1);
        return;
      }

      const searchResults = fuzzysort.go<SearchIndexItem>(
        searchQuery,
        searchIndex,
        {
          keys: ["title", "excerpt", "textContent"],
          limit: 10,
          threshold: -1000,
        }
      );

      setResults(searchResults as unknown as FuzzysortResult[]);
      setSelectedIndex(-1);
    },
    [searchIndex, isLoadingIndex]
  );

  // Handle input change
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    handleSearch(newQuery);
  };

  return (
    <div className="w-full">
      {/* Trigger Button/Input */}
      <div className="relative group">
        <Search className="size-4 absolute top-1/2 -translate-y-1/2 left-2.5 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Search notes..."
          className="pl-9 w-full pr-8 cursor-pointer group-hover:!bg-muted/50 !bg-background transition-colors ease-in shadow-none"
          onClick={() => setIsOpen(true)}
          readOnly
          value=""
        />
        <kbd className="absolute top-1/2 -translate-y-1/2 right-2.5 text-muted-foreground font-mono text-sm pointer-events-none group-hover:text-foreground group-hover:bg-muted/75 transition-colors ease-in w-5 h-6 flex justify-center items-center rounded border">
          /
        </kbd>
      </div>

      {/* Dialog Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-200 ease-in-out",
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsOpen(false)}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setIsOpen(false);
          }
        }}
      />

      {/* Dialog Content */}
      {isOpen && (
        <div
          className={cn(
            "fixed top-[15%] left-1/2 -translate-x-1/2 z-50",
            "w-[90vw] max-w-2xl bg-background rounded-lg shadow-lg border",
            "flex flex-col overflow-hidden"
          )}
        >
          {/* Search Input inside Dialog */}
          <div className="relative p-4 border-b">
            <Search className="size-5 absolute top-1/2 -translate-y-1/2 left-6 text-muted-foreground" />
            <Input
              ref={inputRef}
              value={query}
              onChange={onInputChange}
              placeholder="Type to search notes..."
              className="w-full text-lg pl-10 pr-4 py-2 border-0 focus:ring-0"
            />
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-1/2 -translate-y-1/2 right-6 text-muted-foreground hover:text-foreground"
              aria-label="Close search"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Results Area */}
          <div ref={resultsRef} className="p-4 max-h-[60vh] overflow-y-auto">
            {isLoadingIndex && (
              <div className="flex items-center justify-center py-6 text-muted-foreground">
                <Loader2 className="size-5 mr-2 animate-spin" />
                Loading search index...
              </div>
            )}
            {!isLoadingIndex && query && results.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                No results found for "{query}".
              </div>
            )}
            {!isLoadingIndex && results.length > 0 && (
              <ul className="space-y-2">
                {results.map((result, index) => {
                  const titleResult = result[0];
                  const excerptResult = result[1];
                  const contentResult = result[2];

                  // Determine the best snippet to show based on HIGHEST score
                  let bestSnippetSourceResult: FuzzysortKeyResult | null = null;
                  const contentScore =
                    contentResult?.score ?? Number.NEGATIVE_INFINITY;
                  const excerptScore =
                    excerptResult?.score ?? Number.NEGATIVE_INFINITY;

                  if (
                    contentScore > excerptScore &&
                    contentScore > Number.NEGATIVE_INFINITY
                  ) {
                    bestSnippetSourceResult = contentResult;
                  } else if (excerptScore > Number.NEGATIVE_INFINITY) {
                    bestSnippetSourceResult = excerptResult;
                  }

                  // Get the raw highlighted HTML for title and the best snippet source
                  const titleHighlightedHtml = getHighlightedHtml(
                    titleResult as FuzzysortKeyResult
                  );
                  const snippetHighlightedHtml = getHighlightedHtml(
                    bestSnippetSourceResult
                  );

                  // Generate the actual snippets to display
                  const titleSnippet = titleHighlightedHtml
                    ? generateSnippet(titleHighlightedHtml, 60)
                    : null;
                  const contentSnippet = snippetHighlightedHtml
                    ? generateSnippet(snippetHighlightedHtml, 80)
                    : null;

                  return (
                    <li
                      key={result.obj.slug.join("/")}
                      data-index={index}
                      className={cn(
                        "rounded-md transition-colors",
                        selectedIndex === index
                          ? "bg-muted"
                          : "hover:bg-muted/50"
                      )}
                    >
                      <Link
                        href={`/${result.obj.slug.join("/")}`}
                        onClick={() => setIsOpen(false)}
                        className="block p-3"
                      >
                        {/* Render title snippet or plain title */}
                        <div className="font-medium text-foreground mb-1">
                          <span
                            dangerouslySetInnerHTML={{
                              __html: sanitize(
                                titleSnippet || result.obj.title,
                                {
                                  allowedTags: ["mark"],
                                }
                              ),
                            }}
                          />
                        </div>
                        {/* Render content/excerpt snippet */}
                        <span
                          className="text-muted-foreground text-sm"
                          dangerouslySetInnerHTML={{
                            __html: sanitize(
                              contentSnippet || result.obj.excerpt || "",
                              {
                                allowedTags: ["mark"],
                              }
                            ),
                          }}
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Footer / Help Text */}
          {!isLoadingIndex && results.length > 0 && (
            <div className="border-t p-3 text-xs text-muted-foreground flex justify-end items-center gap-x-4">
              <div className="flex items-center gap-x-2">
                <span>Navigate</span>
                <kbd className="px-1.5 py-0.5 border rounded bg-muted font-mono">
                  ↑
                </kbd>
                <kbd className="px-1.5 py-0.5 border rounded bg-muted font-mono">
                  ↓
                </kbd>
              </div>
              <div className="flex items-center gap-x-2">
                <span>Select</span>
                <kbd className="px-1.5 py-0.5 border rounded bg-muted font-mono flex items-center gap-1">
                  <CornerDownLeft size={10} /> Enter
                </kbd>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
