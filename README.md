This file is a merged representation of the entire codebase, combined into a single document by Repomix.
The content has been processed where security check has been disabled.

# File Summary

## Purpose
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Security check has been disabled - content may contain sensitive information
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
```
public/
  _redirects
src/
  components/
    Breadcrumbs.jsx
    CartItem.jsx
    ErrorBoundary.jsx
    Footer.jsx
    Navbar.jsx
    ProductCard.jsx
    ProtectedRoute.jsx
    QuantityControl.jsx
    ScrollToTop.jsx
    StreetMap.jsx
  context/
    AuthContext.jsx
    CartContext.jsx
    ThemeContext.jsx
    ToastContext.jsx
    WishlistContext.jsx
  hooks/
    useFetchProduct.js
    useFetchProducts.js
  pages/
    Cart.jsx
    Checkout.jsx
    Home.jsx
    Login.jsx
    ProductDetail.jsx
    Profile.jsx
    Shop.jsx
    Wishlist.jsx
  services/
    api.js
  styles/
    global.css
  theme/
    index.jsx
  App.jsx
  main.jsx
.gitignore
index.html
package.json
README.md
shopy-darkmode-fix.zip
shopy.zip
vercel.json
vite.config.js
WALKTHROUGH.md
```

##  Quick Start

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build → dist/
npm run preview   # preview production build
```

---

##  Project Structure

```
shopwave/
├── public/
│   └── _redirects              # Netlify SPA redirect
├── src/
│   ├── components/
│   │   ├── Navbar.jsx            # Marquee bar + live search dropdown + mobile drawer
│   │   ├── ProductCard.jsx       # Lazy images + entry animations
│   │   ├── Breadcrumbs.jsx       # MUI breadcrumbs for all pages
│   │   ├── Footer.jsx            # Full footer with contact, socials, payment badges
│   │   ├── ScrollToTop.jsx       # FAB appears after 300px scroll
│   │   ├── CartItem.jsx          # Cart row component
│   │   ├── QuantityControl.jsx   # Reusable +/− qty input
│   │   ├── ProtectedRoute.jsx    # Auth guard for checkout/profile
│   │   └── ErrorBoundary.jsx     # React error boundary
│   ├── context/
│   │   ├── CartContext.jsx       # Global cart (localStorage)
│   │   ├── AuthContext.jsx       # Mock auth (localStorage)
│   │   ├── ThemeContext.jsx      # Dark / light toggle
│   │   ├── ToastContext.jsx      # Top-right slide toasts
│   │   └── WishlistContext.jsx   # Wishlist (localStorage)
│   ├── hooks/
│   │   ├── useFetchProducts.js   # Fetch all products
│   │   └── useFetchProduct.js    # Fetch single product
│   ├── pages/
│   │   ├── Home.jsx              # Hero carousel, brand story, testimonials, partners
│   │   ├── Shop.jsx              # Advanced filters, view toggle, breadcrumbs
│   │   ├── ProductDetail.jsx     # Product detail with trust badges
│   │   ├── Cart.jsx              # Sticky summary + free-shipping progress
│   │   ├── Wishlist.jsx          # Wishlist with add-all-to-cart
│   │   ├── Checkout.jsx          # Multi-step checkout form
│   │   ├── Login.jsx             # Auth page
│   │   └── Profile.jsx           # Order tracker + GIS delivery map
│   ├── services/
│   │   └── api.js                # All fetch() calls (fakestoreapi.com)
│   ├── styles/
│   │   └── global.css            # Tailwind v4 + marquee/animation utilities
│   ├── theme/
│   │   └── index.jsx             # MUI theme (light + dark)
│   ├── App.jsx                   # Providers + protected routes + error boundary
│   └── main.jsx
├── index.html
├── vite.config.js
├── vercel.json
└── package.json
```
Project Link: https://nosej.netlify.app/
---

##  Features

### UI / UX
- **Announcement Marquee** — infinite scrolling bar, pauses on hover
- **Hero Carousel** — 4 slides, auto-advances every 2s, styled arrows + dot indicators
- **Live Search** — navbar dropdown showing top 3 matching products with images
- **Breadcrumbs** — on every internal page
- **Scroll-to-Top** FAB — appears after 300px scroll
- **Dark Mode** — refined mid-contrast palette, toggled via ThemeContext
- **Top-Right Toasts** — slide-in MUI Alerts for cart/wishlist actions

### Pages
| Page | Highlights |
|------|-----------|
| Home | Carousel · Category grid · Best Sellers · Brand Story · Testimonials · Partner Brands marquee · Newsletter |
| Shop | Search · Category · Price range · Min rating · Sale filter · Sort (7 options) · Grid/List toggle |
| Product | Lazy image · Trust badges · Qty control · Wishlist toggle · Tabs (desc/reviews/shipping) |
| Cart | Clean item list · **Sticky order summary** · Free-shipping progress bar · Tax calc |
| Wishlist | Add all to cart · Remove individual · Empty state |
| Profile | Order history · **Step Tracker** · **GIS delivery map** (SVG mock route) |
| Checkout | Protected route · Multi-field form |

### Architecture
- **Protected Routes** — Checkout & Profile redirect to `/login` if unauthenticated
- **Error Boundary** — prevents full app crash
- **Flat directory** — `components/`, `pages/`, `context/`, `hooks/`, `services/`

---

##  GIS Signature Feature

The Profile page includes a **"Live Order Map"** tab — an SVG-based delivery route
visualisation showing a mock path from Warehouse → User Location, built as a nod to
**Ahmed Salah's GIS Developer background**.

---

##  Deploy

### Netlify
`public/_redirects` is included — SPA routing works out of the box.


---

##  Developer

**Ahmed Salah** — GIS Engineer & Full-Stack Developer  
 ahmedsalah219013@gmail.com  
 +20 122 524 6488  
 [github.com/Ahmed-salah-muhammed](https://github.com/Ahmed-salah-muhammed/)
````

## File: WALKTHROUGH.md
````markdown
# ShopWave v2 - Complete Feature Walkthrough Guide

Welcome to the comprehensive walkthrough of ShopWave v2! This guide will take you through every new feature and enhancement, step-by-step, so you can fully explore and understand the application.

---

##  Getting Started

### Prerequisites
- Node.js installed on your system
- npm or yarn package manager
- A modern web browser (Chrome, Firefox, Safari, or Edge)

### Starting the Application

1. **Navigate to the project directory**:
   ```bash
   cd /home/ubuntu/shopping-app-project
   ```

2. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   - The app will be available at `http://localhost:5174/` (or the next available port)
   - You should see the ShopWave homepage load immediately

---

##  Section 1: Homepage Exploration

### 1.1 Hero Carousel (First Thing You See)

**What to Look For:**
- A large, full-screen banner with a beautiful background image
- Text overlay with "FEATURED COLLECTION" label
- Large headline (e.g., "Summer Collection 2026")
- Subtitle text below the headline
- A prominent "SHOP NOW" call-to-action button
- Navigation arrows on the left and right sides
- Dot indicators at the bottom center (4 dots for 4 slides)

**How to Interact:**
1. **Watch the auto-rotation**: The carousel automatically changes slides every 2 seconds
2. **Click the left arrow**: Go to the previous slide manually
3. **Click the right arrow**: Go to the next slide manually
4. **Click any dot at the bottom**: Jump directly to that slide
5. **Observe the animations**: Notice the smooth fade transitions and text animations as each slide appears
6. **Click the CTA button**: The "SHOP NOW" button will navigate you to the Shop page

**What's Happening Behind the Scenes:**
- Framer Motion library creates smooth animations
- Auto-rotation uses a 2-second interval
- Each slide has unique content (title, subtitle, image, button text)
- Animations are staggered for visual appeal

---

### 1.2 Featured Categories Section

**What to Look For:**
- Three category cards below the hero carousel
- Left card: "Couture" with a fashion image
- Middle card: "Accessories" with description
- Right card: "The Modern Gentleman" with large text overlay
- Each card has a "DISCOVER" or "EXPLORE ESSENTIALS" link

**How to Interact:**
1. **Hover over the cards**: Notice the subtle hover effects
2. **Click any card**: Navigate to the Shop page (filtered by that category if implemented)
3. **Observe the images**: High-quality fashion photography

---

### 1.3 Brand Story Section

**What to Look For:**
- A centered section with "OUR STORY" label in purple
- Large heading: "The Digital Atelier"
- Descriptive paragraph about the brand
- Light background color for contrast
- Professional typography and spacing

**Content Highlights:**
- Explains the brand's mission: craftsmanship, minimalism, and modern design
- Builds trust through storytelling
- Emphasizes quality and sustainability

**How to Interact:**
1. **Read the story**: Understand the brand values
2. **Notice the animation**: The section fades in as you scroll to it
3. **Observe the typography**: Professional font hierarchy and sizing

---

### 1.4 Best Sellers Grid

**What to Look For:**
- Section titled "CURATED SELECTION" and "The Best Sellers"
- Grid of 8 product cards displayed in rows
- Each product card shows:
  - Product image
  - Product name
  - Star rating
  - Price
  - "Add to Cart" and "Add to Wishlist" buttons
- "LOAD MORE PIECES" button at the bottom

**How to Interact:**
1. **Hover over a product card**: See the hover effects and interactive buttons appear
2. **Click the product image**: Navigate to the product detail page
3. **Click "Add to Cart"**: Add the product to your shopping cart (see toast notification)
4. **Click the heart icon**: Add the product to your wishlist
5. **Observe the animations**: Products fade in smoothly as you scroll
6. **Click "LOAD MORE PIECES"**: Load additional products (if pagination is implemented)

**What's Happening:**
- Products are lazy-loaded for better performance
- Skeleton loaders appear while products are loading
- Smooth entrance animations with Framer Motion
- Toast notifications confirm your actions

---

### 1.5 Customer Testimonials Section

**What to Look For:**
- Section titled "CUSTOMER REVIEWS" and "What Our Customers Say"
- 4 testimonial cards in a responsive grid
- Each card contains:
  - 5-star rating display
  - Customer quote in quotation marks
  - Customer avatar (profile picture)
  - Customer name
  - Customer role/title
- Cards have a white background with subtle shadows

**Testimonials Included:**
1. **Sarah Johnson** (Fashion Enthusiast) - About quality and confidence
2. **Michael Chen** (Style Consultant) - About transformation and mastery
3. **Emma Davis** (Creative Director) - About craftsmanship and attention to detail
4. **James Wilson** (Entrepreneur) - About lifestyle and brand vision

**How to Interact:**
1. **Read each testimonial**: Understand customer satisfaction
2. **Observe the avatars**: Real-looking profile pictures for credibility
3. **Notice the animations**: Testimonials appear staggered as you scroll
4. **Check the ratings**: All are 5-star ratings showing high satisfaction

**Why This Matters:**
- Social proof builds trust with potential customers
- Diverse customer profiles show broad appeal
- Professional presentation increases credibility

---

### 1.6 Partner Brands Showcase

**What to Look For:**
- Section titled "TRUSTED PARTNERS" and "Featured Brands"
- 6 brand cards in a responsive grid (2 columns on mobile, 3 on tablet, 6 on desktop)
- Each brand card shows:
  - A large emoji logo (🏷️, 👔, ✨, 💎, 🎨, ⭐)
  - Brand name (Brand A, B, C, etc.)
  - Subtle border and background
  - Hover effects

**How to Interact:**
1. **Hover over a brand card**: See the border color change to primary color (#2a14b4)
2. **Observe the hover effects**: Card lifts up with a shadow effect
3. **Notice the animations**: Brands scale up smoothly as you scroll to them
4. **Responsive behavior**: Cards rearrange based on screen size

**Design Features:**
- Hover effects: Border color change, shadow elevation, slight upward movement
- Smooth transitions for all hover states
- Responsive grid that adapts to screen size

---

### 1.7 Newsletter Subscription

**What to Look For:**
- Large blue section at the bottom of the homepage
- "Subscribe to Our Newsletter" heading
- Descriptive text about exclusive deals
- Email input field with placeholder text
- "Subscribe" button
- Newsletter section in the footer as well

**How to Interact:**
1. **Click the email input field**: Focus on the input
2. **Type an email address**: Try entering a valid email (e.g., "test@example.com")
3. **Click the Subscribe button**: Submit your email
4. **Try invalid email**: Enter something like "notanemail" and try to submit
5. **Observe validation**: The input should show an error state for invalid emails
6. **Success state**: After entering a valid email and clicking Subscribe, the input clears

**Email Validation:**
- Uses regex pattern: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Requires: characters, @, more characters, dot, domain extension
- Visual feedback for invalid entries

---

## 📍 Section 2: Navigation & Global Components

### 2.1 Announcement Bar

**What to Look For:**
- Thin bar at the very top of every page
- Scrolling text with promotional message
- Text moves from right to left continuously

**How to Interact:**
1. **Hover over the announcement bar**: The scrolling pauses
2. **Move mouse away**: The scrolling resumes
3. **Observe the effect**: Smooth marquee animation

**Typical Messages:**
- " Welcome to ATELIER - Discover Premium Fashion | Free Shipping on Orders Over $150 | New Collection Available Now!"

---

### 2.2 Enhanced Navbar

**What to Look For:**
- Navigation bar below the announcement bar
- Left side: "ATELIER" logo/brand name
- Center: Search bar with magnifying glass icon
- Right side: Icons for wishlist, cart, theme toggle, and user profile

**Search Functionality (Live Search):**

1. **Click the search bar**: It becomes active
2. **Start typing a product name**: For example, type "shirt"
3. **Observe the dropdown**: Shows top 3 matching products with:
   - Product image thumbnail
   - Product name
   - Product price
   - Clickable card format
4. **Click a product in dropdown**: Navigate to that product's detail page
5. **Press Enter or click outside**: Close the dropdown

**Other Navbar Features:**

| Icon | Function | Behavior |
|------|----------|----------|
|  Search | Find products | Shows live search dropdown |
|  Wishlist | View saved items | Navigates to wishlist page |
|  Cart | View shopping cart | Shows item count badge + total price |
| 🌙/☀️ Theme | Toggle dark/light mode | Changes entire app theme |
|  User Profile | User account | Shows when logged in; click to go to profile |

**Responsive Behavior:**
- On mobile: Some icons may be hidden, search bar may collapse
- On tablet: All icons visible, search bar visible
- On desktop: Full navbar with all features visible

---

### 2.3 Breadcrumb Navigation

**What to Look For:**
- Appears on all internal pages (not on homepage)
- Shows your current location in the app hierarchy
- Format: "HOME > SHOP > PRODUCT NAME" or similar
- Each part is clickable

**Examples:**
- Shop page: `HOME > SHOP`
- Product detail: `HOME > SHOP > PRODUCT NAME`
- Cart page: `HOME > SHOP > CART`
- Profile page: `HOME > PROFILE`

**How to Use:**
1. **Click any breadcrumb part**: Navigate to that section
2. **Use for quick navigation**: Jump back to previous pages easily
3. **Understand your location**: Always know where you are in the app

---

### 2.4 Scroll-to-Top Button

**What to Look For:**
- Floating button in the bottom-right corner of the screen
- Appears only after scrolling down 300 pixels
- Has an upward arrow icon
- Semi-transparent background with hover effects

**How to Interact:**
1. **Scroll down the page**: After 300px, the button appears
2. **Notice the animation**: Button fades in smoothly
3. **Hover over the button**: See the hover effect (color change, elevation)
4. **Click the button**: Smoothly scroll back to the top of the page
5. **Scroll back up**: Button disappears as you reach the top

**Why It's Useful:**
- Long pages need quick navigation back to top
- Improves user experience on mobile devices
- Smooth animation makes it feel polished

---

### 2.5 Professional Footer

**What to Look For:**
- Large section at the bottom of every page
- Multiple columns of information
- Dark background with light text

**Footer Sections:**

#### Newsletter Subscription (Top)
- Blue background section
- Email input field
- Subscribe button
- Promotional text

#### Brand Information (Left Column)
- "ATELIER" brand name
- Brand description
- Contact information:
  - Email: ahmed@example.com
  - Phone: +1 (555) 123-4567
- Social media links:
  - GitHub
  - Twitter
  - Facebook
  - Instagram
  - Google

**Social Links Behavior:**
1. **Hover over social icons**: See the hover effect (color change, lift effect)
2. **Click a social link**: Opens in a new tab
3. **Notice the styling**: Circular buttons with primary color on hover

#### Footer Links (Right Columns)
Four categories of links:

| Category | Links |
|----------|-------|
| SHOP | New Arrivals, Best Sellers, Sale, Collections |
| COMPANY | About Us, Our Story, Careers, Press |
| SUPPORT | Contact, Shipping Info, Returns, FAQ |
| LEGAL | Privacy Policy, Terms & Conditions, Cookie Policy, Disclaimer |

**How to Interact:**
1. **Hover over any link**: See the color change to primary color
2. **Click any link**: Navigate to that page (if implemented)
3. **Observe the styling**: Consistent typography and spacing

#### Payment Methods
- Display of accepted payment methods:
  - Visa
  - Mastercard
  - PayPal
  - Apple Pay
  - Google Pay

#### Copyright
- Year-based copyright notice
- Designer attribution: "Designed by Ahmed Salah"
- Updates automatically each year

---

##  Section 3: Shop Page Features

### 3.1 Accessing the Shop Page

**How to Get There:**
1. Click "SHOP" in the navbar, OR
2. Click any "SHOP NOW" or "EXPLORE" button on the homepage, OR
3. Click the breadcrumb "SHOP" link, OR
4. Navigate directly to `/shop` in the URL

**What You'll See:**
- Two-column layout: Filters on left, products on right
- Page title: "Collection"
- Product count: "Showing X curated pieces in the digital atelier"
- Sort dropdown on the right

---

### 3.2 Filter Sidebar (Left Column)

**Sticky Positioning:**
- The sidebar stays visible as you scroll down the page
- Maintains position at top of viewport
- Very convenient for filtering while browsing

#### Search Filter
1. **Look for**: "SEARCH PIECES" section at the top
2. **Click the search input**: Type a product name
3. **Real-time filtering**: Products update as you type
4. **Example searches**: "shirt", "jacket", "dress", "shoes"

#### Category Filter
1. **Look for**: "CATEGORIES" section
2. **See all available categories**: Dynamically loaded from products
3. **Click a checkbox**: Select/deselect a category
4. **Multiple selection**: You can select multiple categories at once
5. **Selected styling**: Checked categories appear in bold with primary color
6. **Clear filters button**: Appears when categories are selected
7. **Click "Clear Filters"**: Reset all category selections

**Example Categories:**
- electronics
- jewelery
- men's clothing
- women's clothing

#### Price Range Filter
1. **Look for**: "PRICE RANGE" section
2. **See the slider**: Ranges from $0 to $1000
3. **Drag the slider**: Move left to decrease max price, right to increase
4. **Value display**: Shows current max price on the right
5. **Real-time filtering**: Products update as you adjust the slider
6. **Try different ranges**: $0-$100, $100-$500, $500-$1000

#### Exclusive Membership Card
1. **Look for**: Blue card at the bottom of sidebar
2. **Content**: "EXCLUSIVE" label, "Unlock the Archive" heading
3. **Description**: Benefits of joining the membership circle
4. **Action button**: "JOIN NOW" button
5. **Purpose**: Encourages user engagement and membership signup

---

### 3.3 Product Grid (Right Column)

#### Grid Header
- **Title**: "Collection"
- **Subtitle**: Shows product count
- **Sort Dropdown**: "Sort By" with options

#### Sorting Options
1. **Click the Sort dropdown**: See all available options
2. **Default Sorting**: Original order
3. **Price: Low to High**: Cheapest items first
4. **Price: High to Low**: Most expensive items first
5. **Name: A-Z**: Alphabetical order
6. **Observe the change**: Products rearrange immediately

#### Product Cards Display
- **Grid layout**: Responsive (1 column on mobile, 2 on tablet, 3 on desktop)
- **Each card shows**:
  - Product image
  - Product name
  - Star rating
  - Number of reviews
  - Price
  - "Add to Cart" button
  - "Add to Wishlist" button (heart icon)

#### Product Card Interactions
1. **Hover over a card**: See the hover effects
2. **Click the image**: Navigate to product detail page
3. **Click "Add to Cart"**: See a success toast notification
4. **Click the heart icon**: Add to wishlist (heart fills in)
5. **Observe animations**: Products fade in as they appear

#### Empty State
- **When no products match**: Shows a sad face icon
- **Message**: "The archive is empty"
- **Subtitle**: "No pieces match your current criteria"
- **Action button**: "Reset Filters" to clear all filters

---

### 3.4 Filtering Workflow Example

**Scenario: Find affordable women's clothing**

1. **Start on Shop page**: See all products
2. **Find Categories section**: Look for "women's clothing"
3. **Click the checkbox**: Select women's clothing
4. **Observe the change**: Products filter to show only women's items
5. **Find Price Range slider**: Drag to set max price to $50
6. **See the results**: Only affordable women's clothing displays
7. **Try sorting**: Click "Price: Low to High" to see cheapest items first
8. **Use search**: Type "shirt" to narrow down further
9. **Click "Clear Filters"**: Reset everything to see all products again

---

##  Section 4: Cart Page Features

### 4.1 Accessing the Cart Page

**How to Get There:**
1. Click the cart icon in the navbar, OR
2. Navigate to `/cart` in the URL, OR
3. Click "GO TO CART" after adding items

**What You'll See:**
- Page header with breadcrumbs
- Two-column layout: Cart items on left, Order Summary on right
- If cart is empty: Friendly message with "GO TO SHOP" button

---

### 4.2 Cart Items Section

#### Adding Items First
1. **Go to Shop page**: Browse products
2. **Click "Add to Cart"**: Add several items
3. **Return to Cart**: Click cart icon in navbar
4. **See your items**: All added products display

#### Cart Item Display
Each item shows:
- Product image thumbnail
- Product name
- Product price (per unit)
- Category information
- Quantity control
- Total price for that item
- Remove button (X icon)

#### Quantity Control
1. **Find the quantity control**: Shows current quantity
2. **Click + button**: Increase quantity
3. **Click - button**: Decrease quantity
4. **Type in the field**: Enter a specific quantity
5. **Observe the update**: Total price updates automatically

#### Removing Items
1. **Find the X button**: On the right side of each item
2. **Hover over it**: See the color change to red
3. **Click it**: Item is removed from cart
4. **Observe animation**: Item fades out smoothly

#### Item Animations
- Items fade in smoothly when cart loads
- Smooth transitions when quantities change
- Smooth fade-out when items are removed

---

### 4.3 Promo Code Section

**Location**: Below the cart items

**How to Use:**
1. **Find the "Have a Promo Code?" section**: Blue background box
2. **See the input field**: Placeholder says "Enter promo code (SAVE10 or SAVE20)"
3. **Type a promo code**: 
   - `SAVE10` = 10% discount
   - `SAVE20` = 20% discount
   - Other codes = no discount
4. **Click "Apply" button**: Apply the code
5. **See the result**: 
   - Valid code: "✓ Discount applied: $XX.XX" message appears
   - Invalid code: No discount message
6. **Check Order Summary**: Discount appears in the breakdown

**Example Workflow:**
- Cart subtotal: $100
- Apply code "SAVE10"
- Discount: -$10
- New subtotal: $90

---

### 4.4 Sticky Order Summary (Right Column)

**Key Feature: Sticky Positioning**
- The Order Summary stays visible as you scroll down
- Very convenient for reviewing totals while browsing items
- Remains at top of viewport

#### Order Summary Breakdown

| Item | Description | Example |
|------|-------------|---------|
| Subtotal | Sum of all items | $249.99 |
| Discount | Applied promo code | -$25.00 |
| Shipping | Delivery cost | FREE (or $9.99) |
| Tax | 8% sales tax | $18.40 |
| **Total** | **Final amount** | **$243.39** |

#### Shipping Rules
- **FREE shipping**: Orders over $150
- **$9.99 shipping**: Orders under $150
- **Displays dynamically**: Changes as you add/remove items

#### Tax Calculation
- **Rate**: 8% of subtotal (after discount)
- **Automatic**: Calculated in real-time
- **Included in total**: Already added to final amount

#### Terms & Conditions
1. **Find the checkbox**: Below the totals
2. **Read the label**: "I agree to the Terms & Conditions"
3. **Check the box**: Enable the checkout button
4. **Uncheck the box**: Disable the checkout button

#### Checkout Button
1. **Find "PROCEED TO CHECKOUT"**: Large blue button
2. **Disabled state**: Button is disabled until T&C is checked
3. **Enabled state**: Button is blue and clickable when T&C is checked
4. **Click to proceed**: Navigate to checkout page (if implemented)

#### Security Badge
- Lock icon with text: "Secure checkout with end-to-end encryption"
- Builds trust with customers
- Appears at bottom of Order Summary

---

### 4.5 Cart Workflow Example

**Complete Shopping Journey:**

1. **Start on homepage**: Browse featured products
2. **Add items**: Click "Add to Cart" on 3-4 products
3. **Go to cart**: Click cart icon in navbar
4. **Review items**: See all items with quantities and prices
5. **Adjust quantities**: Change quantity for one item
6. **Remove an item**: Click X on one product
7. **Apply promo code**: Enter "SAVE10" and click Apply
8. **Review totals**: Check Order Summary
   - See subtotal
   - See discount applied
   - See shipping (free or $9.99)
   - See tax calculation
   - See final total
9. **Check T&C**: Click the checkbox
10. **Proceed to checkout**: Click the button

---

##  Section 5: Profile Page & Order Tracking

### 5.1 Accessing the Profile Page

**How to Get There:**
1. **If logged in**: Click the user icon in navbar, OR
2. **Navigate directly**: Go to `/profile` in URL, OR
3. **From any page**: Use the profile link in navbar

**If Not Logged In:**
- See message: "Please log in to view your profile"
- "Go to Login" button to navigate to login page

---

### 5.2 Profile Information Card (Left Sidebar)

#### User Avatar
- Large circular avatar with user initials
- Background color: Primary color (#2a14b4)
- Size: 100x100 pixels
- Shows first letter of user's name

#### User Details
- **Name**: Displayed prominently
- **Email**: Shown below name
- **Contact Information**:
  - Email address with icon
  - Phone number with icon
  - Location with icon

#### Profile Actions
1. **Edit Profile button**: Opens profile editing interface (if implemented)
2. **Logout button**: 
   - Click to logout
   - Redirects to homepage
   - Clears user session

---

### 5.3 Order History Section

#### Order List
- **Title**: "Order History"
- **Multiple order cards**: Each card represents one order
- **Responsive layout**: Stacks on mobile, side-by-side on desktop

#### Order Card Display
Each order card shows:
- **Order ID**: Unique identifier (e.g., "ORD-001")
- **Order Date**: When the order was placed
- **Item Count**: Number of items in order
- **Total Amount**: Order total price
- **Status Badge**: Color-coded status (Delivered, Shipped, Processing)

#### Order Card Interactions
1. **Click any order card**: Select that order for tracking
2. **Visual feedback**: Selected order has a blue border
3. **Hover effect**: Card lifts up with shadow
4. **Status colors**:
   - Green: Delivered ✓
   - Blue: Shipped 🚚
   - Orange: Processing ⏳

#### Mock Orders Included
1. **ORD-001** (Delivered)
   - Date: 2024-03-15
   - Total: $249.99
   - Items: 3
   - Status: Delivered

2. **ORD-002** (Shipped)
   - Date: 2024-03-22
   - Total: $159.99
   - Items: 2
   - Status: Shipped

3. **ORD-003** (Processing)
   - Date: 2024-03-25
   - Total: $89.99
   - Items: 1
   - Status: Processing

---

### 5.4 Order Progress Tracker

#### MUI Stepper Component
- **Visual representation**: Shows all order stages
- **4 stages**:
  1. Order Placed
  2. Processing
  3. Shipped
  4. Delivered

#### Stage Display
- **Completed stages**: Checkmark icon, filled circle
- **Current stage**: Highlighted, active indicator
- **Future stages**: Empty circle, not yet completed
- **Timestamps**: Date shown for each completed stage

#### Example: Delivered Order (ORD-001)
```
✓ Order Placed (2024-03-15)
✓ Processing (2024-03-16)
✓ Shipped (2024-03-17)
✓ Delivered (2024-03-20)
```

#### Example: Shipped Order (ORD-002)
```
✓ Order Placed (2024-03-22)
✓ Processing (2024-03-23)
✓ Shipped (2024-03-24)
○ Delivered (pending)
```

#### Example: Processing Order (ORD-003)
```
✓ Order Placed (2024-03-25)
✓ Processing (2024-03-25)
○ Shipped (pending)
○ Delivered (pending)
```

---

### 5.5 GIS Order Tracking Map

**This is the Signature Feature!**

#### Visual Delivery Route
The map shows a simplified delivery visualization:

```
📦 Warehouse (NY) ———————→ 🏠 Your Address
```

#### Map Components
1. **Starting Point**:  Warehouse (NY)
2. **Ending Point**:  Your Address
3. **Progress Line**: Animated line connecting the two
4. **Status Indicator**: Shows current delivery status

#### Status Indicators

| Status | Icon | Color | Meaning |
|--------|------|-------|---------|
| Delivered | ✓ | Green | Order arrived |
| In Transit | 🚚 | Blue | On the way |
| Being Prepared | ⏳ | Orange | Preparing to ship |

#### Tracking Information
Below the map visualization:

| Field | Content |
|-------|---------|
| Tracking Number | TRK123456789 (unique per order) |
| From | Warehouse (NY) |
| To | Your Address |

#### Animated Progress
- **Delivered orders**: Progress line fills from left to right
- **Animation duration**: 2 seconds
- **Smooth easing**: Linear animation for realistic effect
- **Completion**: Shows "Delivered Successfully" chip

#### How to Interact
1. **Select different orders**: Click different order cards
2. **Watch the animation**: Progress line animates for each order
3. **See status change**: Status indicator updates based on order status
4. **Read the details**: Check the From/To information

#### Example Workflow
1. **Click ORD-001** (Delivered):
   - Progress line fills completely
   - Shows "✓ Delivered Successfully"
   - All stages completed in stepper

2. **Click ORD-002** (Shipped):
   - Progress line partially filled
   - Shows " In Transit"
   - Shipped stage highlighted in stepper

3. **Click ORD-003** (Processing):
   - Progress line mostly empty
   - Shows "⏳ Being Prepared"
   - Processing stage highlighted in stepper

---

### 5.6 Profile Page Workflow Example

**Complete Profile Journey:**

1. **Navigate to profile**: Click user icon in navbar
2. **See your information**: Avatar, name, email, contact details
3. **View order history**: See list of all your orders
4. **Select an order**: Click on "ORD-001" (delivered order)
5. **See progress tracker**: All 4 stages show as completed
6. **View delivery map**: See the warehouse to home route
7. **Check tracking number**: TRK123456789
8. **Select different order**: Click on "ORD-002" (shipped order)
9. **See updated tracker**: Only 3 stages completed
10. **See updated map**: Progress line partially filled
11. **Check status**: "In Transit" indicator shows
12. **Select processing order**: Click on "ORD-003"
13. **See early stage**: Only 2 stages completed
14. **See map**: Progress line mostly empty
15. **See status**: "Being Prepared" indicator shows
16. **Edit profile**: Click "Edit Profile" button (if implemented)
17. **Logout**: Click "Logout" button to exit

---

##  Section 6: Theme & Design Features

### 6.1 Dark Mode Toggle

**How to Access:**
1. **Find the theme icon**: Moon (🌙) or Sun (☀️) in navbar
2. **Click the icon**: Toggle between dark and light mode
3. **Observe the change**: Entire app theme changes instantly

#### Light Mode
- Light backgrounds
- Dark text
- Bright colors
- Good for daytime use

#### Dark Mode
- Dark backgrounds
- Light text
- Adjusted colors for contrast
- Good for nighttime use

#### Persistence
- **Saved preference**: Your theme choice is saved to localStorage
- **Persists across sessions**: Reopening the app remembers your choice
- **Per-device setting**: Each device can have different theme

### 6.2 Color Palette

#### Primary Color
- **Hex**: #2a14b4 (Deep Blue)
- **Usage**: Buttons, links, highlights, accents
- **Hover state**: Slightly lighter shade

#### Semantic Colors
- **Success**: Green (for positive actions)
- **Error**: Red (for destructive actions)
- **Warning**: Orange (for caution)
- **Info**: Blue (for informational messages)

#### Text Colors
- **Primary text**: Dark in light mode, light in dark mode
- **Secondary text**: Muted gray
- **Disabled text**: Very light gray

### 6.3 Typography

#### Font Family
- **Sans-serif**: Professional, modern look
- **Google Fonts**: Imported for consistency

#### Font Sizes
- **H1 (Headlines)**: 3-5rem (large and bold)
- **H2-H3**: 1.5-2.5rem (section headers)
- **Body**: 1rem (standard reading)
- **Caption**: 0.75-0.85rem (small text)

#### Font Weights
- **900**: Extra bold (headings, CTAs)
- **800**: Bold (section titles)
- **700**: Semi-bold (emphasis)
- **600**: Medium (secondary text)
- **400**: Regular (body text)

### 6.4 Spacing & Layout

#### Spacing Scale
- **4px**: Minimal spacing
- **8px**: Small spacing
- **16px**: Standard spacing
- **24px**: Large spacing
- **32px**: Extra large spacing

#### Container Widths
- **Mobile**: Full width with padding
- **Tablet**: 90% width
- **Desktop**: 1200px max-width centered

#### Responsive Breakpoints
- **xs**: 0px (mobile phones)
- **sm**: 600px (small tablets)
- **md**: 960px (tablets)
- **lg**: 1280px (small desktops)
- **xl**: 1920px (large desktops)

---

##  Section 7: Animations & Interactions

### 7.1 Framer Motion Animations

#### Fade Animations
- **Entrance**: Elements fade in smoothly
- **Exit**: Elements fade out smoothly
- **Duration**: 0.3-0.5 seconds typically

#### Slide Animations
- **Hero carousel**: Text slides up with fade
- **Testimonials**: Cards slide in from bottom
- **Products**: Items slide up as they appear

#### Scale Animations
- **Hover effects**: Buttons and cards scale up slightly
- **Click feedback**: Elements scale down then back up
- **Loading states**: Skeleton loaders pulse

#### Stagger Effects
- **Multiple items**: Each item animates with a slight delay
- **Creates flow**: Smooth sequential animation
- **Example**: Products in grid animate one after another

### 7.2 Interactive Elements

#### Buttons
- **Hover**: Color change, slight elevation
- **Active**: Pressed appearance
- **Disabled**: Grayed out, no interaction

#### Cards
- **Hover**: Shadow increase, slight lift
- **Click**: Visual feedback
- **Transitions**: Smooth color and shadow changes

#### Input Fields
- **Focus**: Border color change, shadow
- **Error**: Red border, error message
- **Valid**: Green checkmark or success state

#### Icons
- **Hover**: Color change, scale effect
- **Animated**: Some icons animate on interaction
- **Tooltips**: Hover to see descriptions

---

##  Section 8: Toast Notifications

### 8.1 What Are Toasts?

Small pop-up messages that appear briefly to confirm actions or show status updates.

### 8.2 When Toasts Appear

| Action | Toast Message | Type |
|--------|---------------|------|
| Add to cart | "Added to cart!" | Success (green) |
| Add to wishlist | "Added to wishlist!" | Info (blue) |
| Remove from cart | "Removed from cart!" | Info (blue) |
| Apply promo code | "Discount applied!" | Success (green) |
| Invalid email | "Please enter a valid email" | Error (red) |

### 8.3 Toast Behavior

- **Position**: Bottom-right corner of screen
- **Duration**: 4 seconds (auto-dismiss)
- **Stacking**: Multiple toasts stack vertically
- **Animation**: Fade in and out smoothly
- **Dismissable**: Click the X to close manually

### 8.4 How to Trigger Toasts

1. **Add to cart**: Go to Shop, click "Add to Cart" on any product
2. **Add to wishlist**: Click the heart icon on a product
3. **Subscribe**: Enter email in newsletter and click Subscribe
4. **Invalid email**: Try entering "notanemail" in newsletter
5. **Apply promo**: Go to Cart, enter "SAVE10", click Apply

---

##  Section 9: Responsive Design Testing

### 9.1 Testing on Different Screen Sizes

#### Mobile (320px - 600px)
1. **Open browser DevTools**: F12 or Right-click > Inspect
2. **Click device toolbar**: Toggle device toolbar icon
3. **Select mobile device**: iPhone 12, Pixel 5, etc.
4. **Observe changes**:
   - Single column layouts
   - Larger touch targets
   - Hamburger menu (if implemented)
   - Stacked navigation

#### Tablet (600px - 960px)
1. **Select tablet device**: iPad, Tab S6, etc.
2. **Observe changes**:
   - 2-column layouts
   - Larger cards
   - More comfortable spacing
   - Sidebar visible

#### Desktop (960px+)
1. **Select desktop**: Desktop 1920x1080, etc.
2. **Observe changes**:
   - Full layouts
   - 3-column grids
   - All features visible
   - Optimal spacing

### 9.2 Testing Orientation

1. **Portrait**: Vertical orientation (default)
2. **Landscape**: Horizontal orientation
3. **Observe**: Layout adjusts for each orientation

---

##  Section 10: Advanced Features to Explore

### 10.1 Product Detail Page

**How to Access:**
1. Click any product image or name
2. See full product details
3. Larger image, full description
4. Reviews section
5. Related products

### 10.2 Wishlist Page

**How to Access:**
1. Click heart icon on products
2. Click wishlist icon in navbar
3. See all saved items
4. Remove from wishlist
5. Move to cart

### 10.3 Checkout Page

**How to Access:**
1. Go to cart
2. Click "PROCEED TO CHECKOUT"
3. Enter shipping information
4. Enter payment details
5. Complete order

### 10.4 Login Page

**How to Access:**
1. Click user icon (when not logged in)
2. Or navigate to `/login`
3. Enter email
4. Login to access profile

---

##  Section 11: Tips & Tricks

### 11.1 Keyboard Shortcuts
- **Tab**: Navigate through interactive elements
- **Enter**: Activate buttons and links
- **Escape**: Close dropdowns and modals
- **Space**: Toggle checkboxes

### 11.2 Browser DevTools Tips
- **Inspect Element**: Right-click any element
- **Network tab**: See API calls
- **Console**: Check for errors
- **Responsive Design Mode**: Test different sizes

### 11.3 Performance Tips
- **Lazy loading**: Images load as needed
- **Smooth scrolling**: Use smooth scroll behavior
- **Caching**: Repeat visits are faster
- **Minified assets**: Smaller file sizes

### 11.4 Accessibility Features
- **Keyboard navigation**: Full keyboard support
- **Focus indicators**: Clear focus rings
- **Color contrast**: Readable text
- **Alt text**: Images have descriptions

---

##  Section 12: Learning Resources

### 12.1 Technology Stack

| Technology | Purpose | Learn More |
|------------|---------|------------|
| React 19 | UI framework | reactjs.org |
| Material-UI | Component library | mui.com |
| Framer Motion | Animations | framer.com/motion |
| React Router | Navigation | reactrouter.com |
| Tailwind CSS | Styling | tailwindcss.com |
| Vite | Build tool | vitejs.dev |

### 12.2 Code Structure
- **Components**: Reusable UI pieces
- **Pages**: Full page components
- **Context**: State management
- **Hooks**: Custom logic
- **Services**: API calls

### 12.3 Best Practices
- **Component composition**: Break into smaller pieces
- **Props drilling**: Pass data through props
- **State management**: Use Context for global state
- **Performance**: Memoize expensive computations
- **Accessibility**: Include ARIA labels

---

##  Section 13: Common User Scenarios

### Scenario 1: New Visitor Browsing
1. Land on homepage
2. See hero carousel
3. Read brand story
4. Browse testimonials
5. Check partner brands
6. Click "SHOP NOW"

### Scenario 2: Returning Customer Shopping
1. Login to profile
2. Check order history
3. Browse shop with filters
4. Add items to cart
5. Apply promo code
6. Proceed to checkout

### Scenario 3: Order Tracking
1. Login to profile
2. View order history
3. Select recent order
4. Check progress tracker
5. View delivery map
6. See tracking number

### Scenario 4: Mobile Shopping
1. Open on phone
2. Browse responsive layout
3. Use mobile-optimized search
4. Tap to add to cart
5. View cart on mobile
6. Proceed to checkout

---

##  Section 14: Verification Checklist

Use this checklist to verify all features are working:

- [ ] Hero carousel auto-rotates every 2 seconds
- [ ] Navigation arrows work on carousel
- [ ] Dot indicators are clickable
- [ ] Live search shows top 3 products
- [ ] Breadcrumbs appear on all pages
- [ ] Scroll-to-top button appears after 300px
- [ ] Dark mode toggle works
- [ ] Theme preference persists
- [ ] Newsletter validation works
- [ ] Promo codes apply discounts
- [ ] Cart sticky summary stays visible
- [ ] Order tracker shows all stages
- [ ] Delivery map animates
- [ ] Testimonials load smoothly
- [ ] Partner brands hover effects work
- [ ] Product filtering works
- [ ] Sorting options work
- [ ] Responsive design works on mobile
- [ ] Toast notifications appear
- [ ] Footer links are clickable

---

##  Conclusion

You've now explored all the major features of ShopWave v2! The application demonstrates modern e-commerce best practices with:

 **Beautiful Design** - Professional UI with smooth animations
 **Complete Shopping Experience** - Browse, filter, cart, checkout
 **Advanced Order Tracking** - Progress tracker with GIS map
 **Responsive Design** - Works perfectly on all devices
 **Dark Mode Support** - Comfortable viewing in any lighting
 **Smooth Interactions** - Framer Motion animations throughout
 **Professional Polish** - Attention to detail in every component

Thank you for exploring ShopWave v2. Enjoy your shopping experience!

---

**For questions or feedback, contact: ahmedsalah219013@gmail.com**
````
