// Mock data for the TikTok Creator Economy demo

export interface Tier {
  id: string;
  name: string;
  price: number;
  description: string;
  benefits: string[];
  subscribers: number;
  revenue: number;
}

export interface OneTimePurchase {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  sales: number;
  revenue: number;
}

export interface Creator {
  id: string;
  name: string;
  username: string;
  avatar: string;
  subscribers: string;
  description: string;
  verified: boolean;
  tiers: Tier[];
}

export interface Video {
  id: string;
  name: string;
  links: string;
  tiktokId: string;
  views: string;
  comments: string;
  watchtime: string;
  likes: string;
  shares: string;
  donations: number;
  revenue?: string;
  uploadDate: string;
  mlScore?: number;
  mlSplit?: number;
}

export const mockTiers: Tier[] = [
  {
    id: "tier1",
    name: "Fan",
    price: 4.99,
    description: "Basic access to exclusive content",
    benefits: ["Exclusive videos", "Early access", "Community chat"],
    subscribers: 1250,
    revenue: 6237.5
  },
  {
    id: "tier2", 
    name: "Super Fan",
    price: 9.99,
    description: "Premium content and direct creator interaction",
    benefits: ["All Fan benefits", "1-on-1 Q&A", "Behind the scenes", "Merchandise discount"],
    subscribers: 680,
    revenue: 6793.2
  },
  {
    id: "tier3",
    name: "VIP Member", 
    price: 19.99,
    description: "Ultimate fan experience with exclusive perks",
    benefits: ["All Super Fan benefits", "Private coaching sessions", "Exclusive merchandise", "Priority support"],
    subscribers: 320,
    revenue: 6396.8
  }
];

export const mockOneTimePurchases: OneTimePurchase[] = [
  {
    id: "purchase1",
    name: "Complete React Course Bundle",
    price: 49.99,
    description: "Comprehensive React development course with projects",
    category: "Education",
    sales: 45,
    revenue: 2249.55
  },
  {
    id: "purchase2", 
    name: "Advanced CSS Techniques",
    price: 29.99,
    description: "Master modern CSS layouts and animations",
    category: "Education",
    sales: 38,
    revenue: 1139.62
  },
  {
    id: "purchase3",
    name: "JS Design Patterns",
    price: 39.99, 
    description: "Learn professional JS architecture",
    category: "Education",
    sales: 52,
    revenue: 2079.48
  },
  {
    id: "purchase4",
    name: "Full-Stack Project Template",
    price: 79.99,
    description: "Complete project starter with backend and frontend",
    category: "Templates",
    sales: 28,
    revenue: 2239.72
  }
];

export const mockCreators = [
  {
    id: "creator1",
    name: "Alex Rivera",
    username: "@alexdances",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=150&h=150&fit=crop&crop=face",
    subscribers: "2.1M",
    description: "Professional dancer & choreographer sharing exclusive content",
    verified: true,
    tiers: mockTiers
  }
];

// Video Gallery Data
export const baseVideos: Omit<Video, "mlScore" | "mlSplit" | "revenue">[] = [
  // Original 4 videos
  {
    id: "1",
    name: "React Tutorial for Beginners",
    links:
      "https://www.tiktok.com/@odahojr_dev/video/7417885638571134213?q=react&t=1756469300348",
    tiktokId: "7515754084410952967",
    views: "10.2K",
    comments: "523",
    watchtime: "145000",
    likes: "1.2K",
    shares: "320",
    donations: 4500,
    uploadDate: "2025-03-15",
  },
  {
    id: "2",
    name: "CSS Tutorial – Full Course for Beginners",
    links:
      "https://www.tiktok.com/@codetheworld.io/video/7277023138456538375?q=css&t=1756469316434",
    tiktokId: "7515754084410952968",
    views: "8.5K",
    comments: "412",
    watchtime: "135000",
    likes: "950",
    shares: "280",
    donations: 3800,
    uploadDate: "2025-03-10",
  },
  {
    id: "3",
    name: "Learn HTML in 2 minutes",
    links:
      "https://www.tiktok.com/@thecodedonkey/video/7267611793382558977?q=html&t=1756469331327",
    tiktokId: "7515754084410952969",
    views: "15.7K",
    comments: "678",
    watchtime: "152000",
    likes: "2.1K",
    shares: "450",
    donations: 5200,
    uploadDate: "2025-03-05",
  },
  {
    id: "4",
    name: "JS Full Course for Beginners",
    links:
      "https://www.tiktok.com/@devslopes/video/7184676171588668715?q=Javascript&t=1756469345593",
    tiktokId: "7515754084410952970",
    views: "12.3K",
    comments: "589",
    watchtime: "148000",
    likes: "1.8K",
    shares: "390",
    donations: 4200,
    uploadDate: "2025-02-28",
  },
  // Free Videos from ConsumerDashboard
  {
    id: "5",
    name: "React Basics Tutorial",
    links:
      "https://www.tiktok.com/@reacttutorials/video/7417885638571134214?q=react+basics&t=1756469300349",
    tiktokId: "7515754084410952968",
    views: "45.2K",
    comments: "892",
    watchtime: "923000",
    likes: "3.8K",
    shares: "567",
    donations: 6800,
    uploadDate: "2025-02-20",
  },
  {
    id: "6",
    name: "CSS Grid Masterclass",
    links:
      "https://www.tiktok.com/@cssmaster/video/7277023138456538376?q=css+grid&t=1756469316435",
    tiktokId: "7515754084410952969",
    views: "38.7K",
    comments: "654",
    watchtime: "1338000",
    likes: "2.9K",
    shares: "423",
    donations: 5800,
    uploadDate: "2025-02-15",
  },
  {
    id: "7",
    name: "JS Fundamentals Course",
    links:
      "https://www.tiktok.com/@jsdev/video/7267611793382558978?q=javascript+fundamentals&t=1756469331328",
    tiktokId: "7515754084410952971",
    views: "52.1K",
    comments: "1.2K",
    watchtime: "1125000",
    likes: "4.5K",
    shares: "678",
    donations: 7200,
    uploadDate: "2025-02-10",
  },
  {
    id: "8",
    name: "Web Development Pro Tips",
    links:
      "https://www.tiktok.com/@jsdev/video/7184676171588668716?q=web+development+tips&t=1756469345594",
    tiktokId: "7515754084410952972",
    views: "29.8K",
    comments: "456",
    watchtime: "753000",
    likes: "2.1K",
    shares: "234",
    donations: 4800,
    uploadDate: "2025-02-05",
  },
  // Exclusive Content from ConsumerDashboard
  {
    id: "9",
    name: "Advanced React Patterns",
    links:
      "https://www.tiktok.com/@reactpro/video/7417885638571134215?q=advanced+react&t=1756469300350",
    tiktokId: "7515754084410952973",
    views: "18.9K",
    comments: "789",
    watchtime: "1695000",
    likes: "3.2K",
    shares: "456",
    donations: 8500,
    uploadDate: "2025-01-25",
  },
  {
    id: "10",
    name: "Code Review Secrets",
    links:
      "https://www.tiktok.com/@codereviewer/video/7277023138456538377?q=code+review&t=1756469316436",
    tiktokId: "7515754084410952974",
    views: "8.9K",
    comments: "345",
    watchtime: "2142000",
    likes: "1.8K",
    shares: "234",
    donations: 6500,
    uploadDate: "2025-01-15",
  },
  {
    id: "11",
    name: "Q&A Session: Your Questions",
    links:
      "https://www.tiktok.com/@devqa/video/7267611793382558979?q=qa+session&t=1756469331329",
    tiktokId: "7515754084410952975",
    views: "15.7K",
    comments: "567",
    watchtime: "2538000",
    likes: "2.7K",
    shares: "345",
    donations: 7800,
    uploadDate: "2025-01-05",
  },
  {
    id: "12",
    name: "State Management Deep Dive",
    links:
      "https://www.tiktok.com/@statemaster/video/7184676171588668717?q=state+management&t=1756469345595",
    tiktokId: "7515754084410952976",
    views: "9.4K",
    comments: "234",
    watchtime: "1885000",
    likes: "1.5K",
    shares: "189",
    donations: 5500,
    uploadDate: "2024-12-20",
  },
  // Additional videos for ConsumerDashboard sections
  {
    id: "13",
    name: "Introduction to React Basics",
    links: "https://www.tiktok.com/@reactbasics/video/example1",
    tiktokId: "7515754084410952977",
    views: "45.2K",
    comments: "234",
    watchtime: "923000",
    likes: "2.1K",
    shares: "123",
    donations: 3200,
    uploadDate: "2025-01-30",
  },
  {
    id: "14",
    name: "CSS Grid Layout Tutorial",
    links: "https://www.tiktok.com/@cssgrid/video/example2",
    tiktokId: "7515754084410952978",
    views: "38.7K",
    comments: "189",
    watchtime: "1338000",
    likes: "1.8K",
    shares: "98",
    donations: 2800,
    uploadDate: "2025-01-25",
  },
  {
    id: "15",
    name: "JS Fundamentals Course",
    links: "https://www.tiktok.com/@jsfundamentals/video/example3",
    tiktokId: "7515754084410952979",
    views: "52.1K",
    comments: "456",
    watchtime: "1125000",
    likes: "3.2K",
    shares: "234",
    donations: 4100,
    uploadDate: "2025-01-20",
  },
  {
    id: "16",
    name: "Web Development Tips",
    links: "https://www.tiktok.com/@webdevtips/video/example4",
    tiktokId: "7515754084410952980",
    views: "29.8K",
    comments: "123",
    watchtime: "753000",
    likes: "1.5K",
    shares: "67",
    donations: 2200,
    uploadDate: "2025-01-15",
  },
  // Premium/Locked videos
  {
    id: "17",
    name: "Advanced JS",
    links: "https://www.tiktok.com/@advancedjs/video/example5",
    tiktokId: "7515754084410952981",
    views: "15.2K",
    comments: "89",
    watchtime: "2700000",
    likes: "1.2K",
    shares: "45",
    donations: 6800,
    uploadDate: "2025-01-10",
  },
  {
    id: "18",
    name: "1-on-1 Code Review Session",
    links: "https://www.tiktok.com/@codereview1on1/video/example6",
    tiktokId: "7515754084410952982",
    views: "8.7K",
    comments: "67",
    watchtime: "3600000",
    likes: "890",
    shares: "34",
    donations: 5200,
    uploadDate: "2025-01-05",
  },
  {
    id: "19",
    name: "Exclusive Project Walkthrough",
    links: "https://www.tiktok.com/@projectwalkthrough/video/example7",
    tiktokId: "7515754084410952983",
    views: "12.3K",
    comments: "156",
    watchtime: "2295000",
    likes: "1.1K",
    shares: "78",
    donations: 4500,
    uploadDate: "2024-12-30",
  },
  {
    id: "20",
    name: "Live Workshop: Full-Stack Dev",
    links: "https://www.tiktok.com/@fullstackworkshop/video/example8",
    tiktokId: "7515754084410952984",
    views: "18.9K",
    comments: "234",
    watchtime: "5400000",
    likes: "2.3K",
    shares: "123",
    donations: 8900,
    uploadDate: "2024-12-25",
  },
];

// Thumbnail Image Mapping Function
export const getThumbnailImage = (name: string): string => {
  const imageMap: { [key: string]: string } = {
    // Original 4 videos
    "React Tutorial for Beginners":
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "CSS Tutorial – Full Course for Beginners":
      "https://images.unsplash.com/photo-1621839673705-6617adf9e890?q=80&w=2064&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "Learn HTML in 2 minutes":
      "https://images.unsplash.com/photo-1632882765546-1ee75f53becb?q=80&w=2064&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "JS Full Course for Beginners":
      "https://images.unsplash.com/photo-1583339793403-3d9b001b6008?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    // Free Videos from ConsumerDashboard
    "React Basics Tutorial":
      "https://images.unsplash.com/photo-1687603921109-46401b201195?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "CSS Grid Masterclass":
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "JS Fundamentals Course":
      "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "Web Development Pro Tips":
      "https://plus.unsplash.com/premium_photo-1663050633633-2856e875dcc7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    // Exclusive Content from ConsumerDashboard
    "Advanced React Patterns":
      "https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?q=80&w=1548&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "Code Review Secrets":
      "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "Q&A Session: Your Questions":
      "https://images.unsplash.com/photo-1597733336794-12d05021d510?q=80&w=1548&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "State Management Deep Dive":
      "https://plus.unsplash.com/premium_photo-1678566111481-8e275550b700?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    // Additional ConsumerDashboard videos
    "Introduction to React Basics":
      "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=300&h=200&fit=crop",
    "CSS Grid Layout Tutorial":
      "https://plus.unsplash.com/premium_photo-1680700308566-543a60569017?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "JS Fundamentals":
      "https://plus.unsplash.com/premium_photo-1683121716061-3faddf4dc504?q=80&w=2064&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "Web Development Tips":
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "Advanced JS":
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "1-on-1 Code Review Session":
      "https://images.unsplash.com/photo-1556740714-a8395b3bf30f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "Exclusive Project Walkthrough":
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "Live Workshop: Full-Stack Dev":
      "https://plus.unsplash.com/premium_photo-1661877737564-3dfd7282efcb?q=80&w=2100&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  };

  return imageMap[name] || imageMap["React Tutorial for Beginners"]; // fallback to React image
};

// Helper functions for ConsumerDashboard
export const getFreeVideos = () => baseVideos.slice(4, 8); // IDs 5-8
export const getExclusiveVideos = () => baseVideos.slice(8, 12); // IDs 9-12  
export const getPremiumVideos = () => baseVideos.slice(16, 20); // IDs 17-20

// Helper function to get video by name
export const getVideoByName = (name: string) => {
  return baseVideos.find(video => video.name === name);
};