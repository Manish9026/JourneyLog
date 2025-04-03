import React, { useState, useEffect, useRef } from "react";
export const InfiniteScroll = () => {
    const [items, setItems] = useState(Array.from({ length: 20 }, (_, i) => i + 1));
    const [loading, setLoading] = useState(false);
    const loaderRef = useRef(null);
  
    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            loadMoreItems();
          }
        },
        { threshold: 1.0 }
      );
  
      if (loaderRef.current) {
        observer.observe(loaderRef.current);
      }
  
      return () => {
        if (loaderRef.current) {
          observer.unobserve(loaderRef.current);
        }
      };
    }, []);
  
    const loadMoreItems = () => {
      if (loading) return;
      setLoading(true);
      setTimeout(() => {
        setItems((prev) => [...prev, ...Array.from({ length: 10 }, (_, i) => prev.length + i + 1)]);
        setLoading(false);
      }, 1000);
    };
  
    return (
      <div>
        <h2>Infinite Scroll</h2>
        <ul>
          {items.map((item, index) => (
            <li key={index} style={{ padding: "10px", border: "1px solid #ddd" }}>
              Item {item}
            </li>
          ))}
        </ul>
        <div ref={loaderRef} style={{ height: "20px", textAlign: "center" }}>
          {loading && <p>Loading...</p>}
        </div>
      </div>
    );
  };