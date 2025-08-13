"use client"
import { color } from 'framer-motion'
import React,{useState,useEffect,useMemo} from 'react'
import Image from 'next/image'
import Link from 'next/link'
import IconComponent from './IconComponent'

const EventCard = React.forwardRef((props, ref) => {
    const [eventCategories, setEventCategories] = useState([]);
    const [isMobile, setIsmobile] = useState(4);
    const [isLoading, setIsLoading] = useState(true);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [hasDragged, setHasDragged] = useState(false);
    const containerRef = React.useRef(null);

    // Fetch event categories from backend
    useEffect(() => {
        const fetchEventCategories = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('/api/event-categories?active=true');
                if (response.ok) {
                    const data = await response.json();
                    setEventCategories(data.eventCategories || []);
                }
            } catch (error) {
                console.error('Error fetching event categories:', error);
                // Fallback to empty array if fetch fails
                setEventCategories([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEventCategories();
    }, []);
    
    useEffect(()=>{
        if(window.innerWidth>=1024){
            setIsmobile(eventCategories.length);
        }
        else{
            setIsmobile(4);
        }
    },[eventCategories.length]);

    // Drag to scroll functionality
    const handleMouseDown = (e) => {
        if (!containerRef.current) return;
        setIsDragging(true);
        setHasDragged(false);
        setStartX(e.pageX - containerRef.current.offsetLeft);
        setScrollLeft(containerRef.current.scrollLeft);
        containerRef.current.style.cursor = 'grabbing';
        containerRef.current.style.userSelect = 'none';
    };

    const handleMouseMove = (e) => {
        if (!isDragging || !containerRef.current) return;
        e.preventDefault();
        const x = e.pageX - containerRef.current.offsetLeft;
        const walk = (x - startX) * 2; // Scroll speed multiplier
        
        // If the user has moved more than 5px, consider it a drag
        if (Math.abs(walk) > 5) {
            setHasDragged(true);
        }
        
        containerRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
        if (!containerRef.current) return;
        setIsDragging(false);
        containerRef.current.style.cursor = 'grab';
        containerRef.current.style.userSelect = 'auto';
    };

    const handleMouseLeave = () => {
        if (!containerRef.current) return;
        setIsDragging(false);
        containerRef.current.style.cursor = 'grab';
        containerRef.current.style.userSelect = 'auto';
    };

    // Prevent default link behavior when dragging
    const handleLinkClick = (e, href) => {
        if (hasDragged) {
            e.preventDefault();
            return;
        }
        // Allow normal navigation
        if (href) {
            window.location.href = href;
        }
    };

    // Show loading state
    if (isLoading) {
        return (
            <div className='w-screen overflow-hidden flex lg:gap-5 gap-2 px-10 lg:px-8 lg:flex-nowrap flex-wrap'>
                {[...Array(4)].map((_, index) => (
                    <div 
                        key={index}
                        className="flex justify-between lg:px-10 px-5 lg:h-24 lg:min-w-[370px] lg:w-auto w-[145px] h-[50px] items-center rounded-2xl bg-gray-200 animate-pulse"
                    >
                        <div className="w-1/3 h-4 bg-gray-300 rounded"></div>
                        <div className="w-6 h-6 bg-gray-300 rounded"></div>
                    </div>
                ))}
            </div>
        );
    }

    // Show empty state if no categories - hide the entire section
    if (!eventCategories.length) {
        return null; // Hide the entire section when no categories
    }

  return (
    <div ref={ref} className='w-screen overflow-hidden'>
        <div 
            ref={containerRef}
            className='flex lg:gap-5 gap-2 px-10 lg:px-8 overflow-x-auto scrollbar-hide cursor-grab select-none'
            style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                scrollBehavior: 'smooth'
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
        >
            {
                eventCategories.map((item,index)=>(
                    <div
                        key={item._id || index}
                        onClick={(e) => handleLinkClick(e, `/products?eventCategory=${item._id}&title=${encodeURIComponent(item.title + " Gifts")}`)}
                        className="block flex-shrink-0"
                    >
                        <div 
                            className={`flex justify-between lg:px-10 px-5 lg:h-24 lg:min-w-[370px] lg:w-auto w-[145px] h-[50px] items-center rounded-2xl lg:text-2xl text-xs text-white font-poppins font-semibold cursor-pointer hover:opacity-90 transition-opacity`}
                            style={{backgroundColor:`${item.color}`}}
                        >
                            <div className='w-1/3'>
                                {item.title || item.displayName || item.name}
                            </div>
                            {(item.icon || item.emoji) && (
                                <IconComponent 
                                    icon={item.icon || item.emoji} 
                                    className="lg:w-8 lg:h-8 w-6 h-6 text-white" 
                                />
                            )}
                        </div>
                    </div>
                ))
            }
        </div>
    </div>
  )
})
EventCard.displayName='EventCard'

export default EventCard