import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const routeSeoData = {
  '/': {
    title: 'GYMEZY - Best Gyms in Chennai & Personal Trainers',
    description:
      'Find top gyms in Chennai with GYMEZY. Book daily drop-in passes, flexible multi-gym memberships, and personal trainers with zero lock-in contracts.',
    keywords:
      'gyms in chennai, best gym in chennai, daily gym pass chennai, drop in gym pass chennai, personal trainer chennai, flexible gym membership chennai, fitness center chennai, GYMEZY chennai, gyms in porur, gyms in moulivakkam, gyms in anna nagar, gyms in velachery, workout passes, yoga chennai, zumba chennai, HIIT chennai',
    canonical: 'https://gymezy.com/',
    ogImage: 'https://gymezy.com/gymezy.png'
  },
  '/about': {
    title: 'About GYMEZY - Transforming Fitness Flexibility Across Chennai',
    description:
      'Learn how GYMEZY is making fitness flexible across Chennai with drop-in gym passes, multi-gym access, and verified personal trainers with zero lock-ins.',
    keywords:
      'about gymezy, fitness tech chennai, gym aggregator chennai, founders gymezy, fitness ecosystem chennai, gyms in moulivakkam, gyms in porur',
    canonical: 'https://gymezy.com/about',
    ogImage: 'https://gymezy.com/gymezy.png'
  },
  '/customers': {
    title: 'GYMEZY For Customers - Daily Gym Passes & Memberships in Chennai',
    description:
      'Book pay-per-session daily gym passes, flexible memberships, and certified fitness coaches in Chennai with instant OTP and QR front desk check-in.',
    keywords:
      'gym passes chennai, daily gym passes chennai, drop in fitness chennai, no contract gym chennai, fitness app chennai, pay per workout chennai, personal training booking chennai',
    canonical: 'https://gymezy.com/customers',
    ogImage: 'https://gymezy.com/gymezy.png'
  },
  '/gym-owners': {
    title: 'GYMEZY For Gym Owners - Grow Membership & Monetize Capacity in Chennai',
    description:
      'Partner with GYMEZY to list your Chennai gym or fitness studio for free, monetize off-peak capacity, and verify members with automated QR pass scanning.',
    keywords:
      'gym partner program chennai, list gym chennai, gym management software chennai, monetize off-peak gym floor, fitness studio partner chennai, GYMEZY partner',
    canonical: 'https://gymezy.com/gym-owners',
    ogImage: 'https://gymezy.com/gymezy.png'
  },
  '/trainers': {
    title: 'GYMEZY For Trainers - Certified Fitness Coaching Platform Chennai',
    description:
      'Join GYMEZY as a certified fitness trainer in Chennai. Connect with motivated clients, schedule 1-on-1 sessions, and manage workout routines effortlessly.',
    keywords:
      'fitness trainer jobs chennai, freelance personal trainer chennai, personal coaching platform chennai, fitness instructor chennai, GYMEZY trainer onboarding',
    canonical: 'https://gymezy.com/trainers',
    ogImage: 'https://gymezy.com/gymezy.png'
  }
};

function setMetaTag(selector, attribute, value, fallbackTag = 'meta', fallbackAttrs = {}) {
  let element = document.querySelector(selector);
  if (!element) {
    element = document.createElement(fallbackTag);
    Object.entries(fallbackAttrs).forEach(([k, v]) => element.setAttribute(k, v));
    document.head.appendChild(element);
  }
  element.setAttribute(attribute, value);
}

export default function SEO() {
  const location = useLocation();

  useEffect(() => {
    const data = routeSeoData[location.pathname] || routeSeoData['/'];

    // Update document title
    document.title = data.title;

    // Primary Meta Description & Keywords
    setMetaTag('meta[name="description"]', 'content', data.description, 'meta', { name: 'description' });
    setMetaTag('meta[name="keywords"]', 'content', data.keywords, 'meta', { name: 'keywords' });

    // Open Graph Tags
    setMetaTag('meta[property="og:title"]', 'content', data.title, 'meta', { property: 'og:title' });
    setMetaTag('meta[property="og:description"]', 'content', data.description, 'meta', { property: 'og:description' });
    setMetaTag('meta[property="og:url"]', 'content', data.canonical, 'meta', { property: 'og:url' });
    setMetaTag('meta[property="og:image"]', 'content', data.ogImage, 'meta', { property: 'og:image' });
    setMetaTag('meta[property="og:locale"]', 'content', 'en_IN', 'meta', { property: 'og:locale' });

    // Twitter Card Tags
    setMetaTag('meta[name="twitter:title"]', 'content', data.title, 'meta', { name: 'twitter:title' });
    setMetaTag('meta[name="twitter:description"]', 'content', data.description, 'meta', { name: 'twitter:description' });
    setMetaTag('meta[name="twitter:url"]', 'content', data.canonical, 'meta', { name: 'twitter:url' });
    setMetaTag('meta[name="twitter:image"]', 'content', data.ogImage, 'meta', { name: 'twitter:image' });

    // Canonical & Alternate Links
    setMetaTag('link[rel="canonical"]', 'href', data.canonical, 'link', { rel: 'canonical' });
    setMetaTag('link[rel="alternate"][hreflang="en-IN"]', 'href', data.canonical, 'link', {
      rel: 'alternate',
      hreflang: 'en-IN'
    });
    setMetaTag('link[rel="alternate"][hreflang="x-default"]', 'href', data.canonical, 'link', {
      rel: 'alternate',
      hreflang: 'x-default'
    });

    // GEO Signals
    setMetaTag('meta[name="geo.region"]', 'content', 'IN-TN', 'meta', { name: 'geo.region' });
    setMetaTag('meta[name="geo.placename"]', 'content', 'Chennai, Tamil Nadu, India', 'meta', { name: 'geo.placename' });
    setMetaTag('meta[name="geo.position"]', 'content', '13.0163;80.1415', 'meta', { name: 'geo.position' });
    setMetaTag('meta[name="ICBM"]', 'content', '13.0163, 80.1415', 'meta', { name: 'ICBM' });
    setMetaTag('meta[name="geo.country"]', 'content', 'India', 'meta', { name: 'geo.country' });
  }, [location.pathname]);

  return null;
}
