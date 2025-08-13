"use client";
import React, { useState, useEffect } from 'react';
import Cardcomponent from '@/components/Cardcomponent';
import EventCardSkeleton from '@/components/EventCardSkeleton';

function Eventmulticard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        
        // Fetch only normal events (not corporate events) for the public events page
        const response = await fetch('/api/events?eventCategory=normal&limit=6');
        if (!response.ok) throw new Error('Failed to fetch events');
        const data = await response.json();
        
        // Transform the events data to match the expected format for Cardcomponent
        const transformedEvents = (data.events || []).map(event => ({
          title: event.eventName,
          desc: event.eventDescription,
          // Use the first 3 images from the event, or default images if not enough
          image1: event.images?.[0]?.url || "/pic1.png",
          image2: event.images?.[1]?.url || "/pic2.png", 
          image3: event.images?.[2]?.url || "/pic3.png"
        }));
        
        setEvents(transformedEvents);
      } catch (err) {
        setError(err.message);
        // Don't set fallback events - leave events as empty array
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <EventCardSkeleton className="mt-52" />;
  }

  // Don't render anything if there are no events from the database
  if (!events || events.length === 0) {
    return null;
  }

  return (
    <div className="mt-52">
      <Cardcomponent item={events} title="Events" />
    </div>
  );
}

export default Eventmulticard;
